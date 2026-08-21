from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.core.config import settings
import logging

logger = logging.getLogger("uvicorn")

class Base(DeclarativeBase):
    pass

def create_engine_and_session(url: str):
    connect_args = {"check_same_thread": False} if "sqlite" in url else {}
    eng = create_async_engine(url, echo=False, future=True, connect_args=connect_args)
    sess_maker = async_sessionmaker(eng, expire_on_commit=False, class_=AsyncSession)
    return eng, sess_maker

# Default to SQLite if postgres DB isn't initialized or if fallback is enabled
if settings.USE_SQLITE_FALLBACK:
    engine, AsyncSessionLocal = create_engine_and_session(settings.SQLITE_URL)
else:
    try:
        engine, AsyncSessionLocal = create_engine_and_session(settings.DATABASE_URL)
    except Exception as e:
        logger.warning(f"PostgreSQL engine error: {e}. Falling back to SQLite.")
        engine, AsyncSessionLocal = create_engine_and_session(settings.SQLITE_URL)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    global engine, AsyncSessionLocal
    # Try creating tables on current engine
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        logger.warning(f"Engine init error ({e}). Switching to SQLite fallback...")
        engine, AsyncSessionLocal = create_engine_and_session(settings.SQLITE_URL)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
