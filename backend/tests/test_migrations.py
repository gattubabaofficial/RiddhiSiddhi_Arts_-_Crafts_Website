"""Migrations must stay in step with the models.

`create_all` never issues ALTER TABLE, so a model change used to leave the
running database silently one column behind. These tests fail the moment a model
is edited without a matching migration.
"""
from __future__ import annotations

from pathlib import Path

import pytest
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import create_engine

import app.models  # noqa: F401  (registers every model on Base.metadata)
from app.core.database import Base

BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _config(url: str) -> Config:
    # These tests run upgrade/downgrade. If a URL ever resolved to the real
    # development database, `downgrade base` would drop every table in it --
    # which is exactly what happened once. Refuse anything not disposable.
    if "riddhi_siddhi.db" in url:
        raise AssertionError(f"refusing to run migrations against the app database: {url}")

    config = Config(str(BACKEND_ROOT / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_ROOT / "alembic"))
    config.set_main_option("sqlalchemy.url", url)
    return config


@pytest.fixture
def migrated_db(tmp_path):
    """A database built purely by running the migrations.

    Alembic drives it through the async driver (as the app does); inspection
    afterwards uses a plain sync engine.
    """
    db_file = tmp_path / "migrated.db"
    command.upgrade(_config(f"sqlite+aiosqlite:///{db_file}"), "head")
    engine = create_engine(f"sqlite:///{db_file}")
    yield engine
    engine.dispose()


def test_there_is_exactly_one_migration_head():
    """Two heads means someone branched; alembic upgrade would be ambiguous."""
    heads = ScriptDirectory.from_config(_config("sqlite+aiosqlite://")).get_heads()
    assert len(heads) == 1, f"expected a single head, found {heads}"


def test_migrations_build_every_table_the_models_declare(migrated_db):
    from sqlalchemy import inspect

    built = set(inspect(migrated_db).get_table_names())
    expected = set(Base.metadata.tables)
    assert expected <= built, f"migrations never create: {sorted(expected - built)}"


def test_models_and_migrations_have_not_drifted(migrated_db):
    """The check that actually matters: after upgrading to head, autogenerate
    must find nothing left to do."""
    with migrated_db.connect() as connection:
        context = MigrationContext.configure(
            connection,
            opts={"compare_type": True, "render_as_batch": True},
        )
        diff = compare_metadata(context, Base.metadata)

    assert diff == [], (
        "Models and migrations disagree. Run:\n"
        "  alembic revision --autogenerate -m 'describe your change'\n"
        f"Outstanding differences: {diff}"
    )


def test_the_baseline_migration_is_reversible(tmp_path):
    from sqlalchemy import inspect

    db_file = tmp_path / "roundtrip.db"
    config = _config(f"sqlite+aiosqlite:///{db_file}")
    command.upgrade(config, "head")
    command.downgrade(config, "base")

    engine = create_engine(f"sqlite:///{db_file}")
    try:
        remaining = set(inspect(engine).get_table_names()) - {"alembic_version"}
        assert remaining == set(), f"downgrade left tables behind: {remaining}"
    finally:
        engine.dispose()
