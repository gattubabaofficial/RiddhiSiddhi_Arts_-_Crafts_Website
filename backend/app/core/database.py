"""Database engine, session factory and schema bootstrap.

Schema is owned by Alembic, not by `Base.metadata.create_all`. create_all only
ever issues CREATE TABLE -- it never ALTERs an existing one, so adding a column
to a model used to leave the running database silently one column behind, and
every query touching that column failed at runtime.

Startup therefore checks the applied revision. In development it upgrades in
place; in production it refuses to start rather than serve a stale schema.
"""
from __future__ import annotations

import logging
from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

logger = logging.getLogger("uvicorn")

BACKEND_ROOT = Path(__file__).resolve().parents[2]
ALEMBIC_INI = BACKEND_ROOT / "alembic.ini"


class Base(DeclarativeBase):
    pass


def create_engine_and_session(url: str):
    connect_args = {"check_same_thread": False} if "sqlite" in url else {}
    engine = create_async_engine(url, echo=False, future=True, connect_args=connect_args)
    session_maker = async_sessionmaker(
        engine, expire_on_commit=False, class_=AsyncSession
    )
    return engine, session_maker


def database_url() -> str:
    return settings.SQLITE_URL if settings.USE_SQLITE_FALLBACK else settings.DATABASE_URL


engine, AsyncSessionLocal = create_engine_and_session(database_url())


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


def _alembic_config() -> Config:
    config = Config(str(ALEMBIC_INI))
    config.set_main_option("script_location", str(BACKEND_ROOT / "alembic"))
    config.set_main_option("sqlalchemy.url", database_url())
    return config


def _head_revision(config: Config) -> str | None:
    return ScriptDirectory.from_config(config).get_current_head()


def _sync_schema(connection) -> None:
    """Runs inside run_sync, so `connection` is a plain sync Connection."""
    config = _alembic_config()
    config.attributes["connection"] = connection

    head = _head_revision(config)
    applied = MigrationContext.configure(connection).get_current_revision()
    tables = set(inspect(connection).get_table_names()) - {"alembic_version"}

    if applied == head:
        if not tables and Base.metadata.tables:
            # Version table claims we are up to date but the schema is empty --
            # a dropped/restored database. Rebuild from base rather than
            # starting up against nothing.
            logger.warning("Schema is empty despite revision %s; rebuilding", applied)
            command.stamp(config, "base")
            command.upgrade(config, "head")
        return

    if applied is None and tables:
        # Pre-Alembic database: adopt it at the baseline instead of trying to
        # re-create tables that already exist.
        logger.warning("Un-versioned database detected; stamping at %s", head)
        command.stamp(config, "head")
        return

    if settings.is_production:
        raise RuntimeError(
            f"Database schema is at revision {applied!r} but the code expects "
            f"{head!r}. Run 'alembic upgrade head' before starting the server."
        )

    logger.info("Upgrading schema %s -> %s", applied, head)
    command.upgrade(config, "head")


async def init_db() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(_sync_schema)
