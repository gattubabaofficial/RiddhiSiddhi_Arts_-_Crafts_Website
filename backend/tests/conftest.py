"""Shared fixtures.

Every test runs against a throwaway SQLite file and a temp upload directory so
the real riddhi_siddhi.db and uploads/ are never touched.
"""
from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

# These must be set before app.core.config is imported anywhere below.
_TMP_UPLOAD_DIR = tempfile.mkdtemp(prefix="rs-test-uploads-")
os.environ["ENVIRONMENT"] = "test"
os.environ["SECRET_KEY"] = "test-only-secret-key-do-not-use-in-production"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000"
os.environ["UPLOAD_DIR"] = _TMP_UPLOAD_DIR
os.environ["MAX_UPLOAD_SIZE_MB"] = "1"

from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import (  # noqa: E402
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.database import Base, get_db  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.main import app  # noqa: E402
from app.models import AdminUser, Category  # noqa: E402

ADMIN_EMAIL = "admin@riddhi-test.example.com"
ADMIN_PASSWORD = "test-password-123"


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture(autouse=True)
def _isolate_rate_limits():
    """The limiter keeps process-global state; without this, submissions from
    one test consume another test's budget."""
    from app.core.ratelimit import reset_rate_limits

    reset_rate_limits()
    yield
    reset_rate_limits()


@pytest.fixture
def upload_dir() -> Path:
    return Path(_TMP_UPLOAD_DIR)


@pytest.fixture
async def db_engine(tmp_path):
    engine = create_async_engine(
        f"sqlite+aiosqlite:///{tmp_path / 'test.db'}",
        connect_args={"check_same_thread": False},
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
def session_maker(db_engine):
    return async_sessionmaker(db_engine, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture
async def client(session_maker):
    async def _get_db():
        async with session_maker() as session:
            yield session

    app.dependency_overrides[get_db] = _get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as async_client:
        yield async_client
    app.dependency_overrides.clear()


@pytest.fixture
async def auth_headers(client, session_maker):
    async with session_maker() as session:
        session.add(
            AdminUser(
                email=ADMIN_EMAIL,
                password_hash=get_password_hash(ADMIN_PASSWORD),
                role="superadmin",
            )
        )
        await session.commit()

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture
async def category(session_maker) -> int:
    """A persisted category; returns its id."""
    async with session_maker() as session:
        cat = Category(name="Sandalwood Malas", slug="sandalwood-malas")
        session.add(cat)
        await session.commit()
        await session.refresh(cat)
        return cat.id
