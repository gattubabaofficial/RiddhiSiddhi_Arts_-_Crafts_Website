import os
import secrets
from pathlib import Path
from typing import List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[2]

# The key that was committed to this repository, plus the usual placeholders.
# Any of these in production means the signing key is public knowledge and admin
# tokens can be forged, so startup is refused.
COMPROMISED_SECRET_KEYS = {
    "supersecret_riddhi_siddhi_sandalwood_jaipur_key_2026",
    "changeme",
    "change-me",
    "secret",
    "supersecret",
}

MIN_SECRET_KEY_LENGTH = 32

# Machine-local development key. Generated once, never committed, so restarting
# uvicorn does not invalidate the admin session on every file save.
DEV_SECRET_KEY_FILE = BACKEND_ROOT / ".secret_key"


def _development_secret_key() -> str:
    try:
        existing = DEV_SECRET_KEY_FILE.read_text(encoding="utf-8").strip()
        if len(existing) >= MIN_SECRET_KEY_LENGTH:
            return existing
    except OSError:
        pass

    generated = secrets.token_urlsafe(48)
    try:
        DEV_SECRET_KEY_FILE.write_text(generated, encoding="utf-8")
    except OSError:
        # Read-only checkout: fall back to a process-lifetime key.
        pass
    return generated


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Riddhi Siddhi Arts & Crafts API"
    ENVIRONMENT: str = "development"

    # No usable default: production must supply one, development generates one.
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/riddhi_siddhi_db"
    )
    USE_SQLITE_FALLBACK: bool = True
    SQLITE_URL: str = "sqlite+aiosqlite:///./riddhi_siddhi.db"

    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 25

    ALLOWED_ORIGINS: str = (
        "http://localhost:3000,http://localhost:3001,"
        "http://127.0.0.1:3000,http://127.0.0.1:3001"
    )

    # Anonymous submissions (enquiries, reviews) allowed per client IP per window.
    PUBLIC_SUBMIT_LIMIT: int = 5
    PUBLIC_SUBMIT_WINDOW_SECONDS: int = 60

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.strip().lower() in {"production", "prod", "live"}

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        if not path.is_absolute():
            path = BACKEND_ROOT / path
        return path.resolve()

    @model_validator(mode="after")
    def _enforce_secret_key(self) -> "Settings":
        key = (self.SECRET_KEY or "").strip()

        if self.is_production:
            if not key:
                raise ValueError(
                    "SECRET_KEY must be set in production. Generate one with: "
                    "python -c \"import secrets; print(secrets.token_urlsafe(48))\""
                )
            if key in COMPROMISED_SECRET_KEYS:
                raise ValueError(
                    "SECRET_KEY is a known-compromised value that was published in "
                    "this repository's git history. Generate a fresh one."
                )
            if len(key) < MIN_SECRET_KEY_LENGTH:
                raise ValueError(
                    f"SECRET_KEY must be at least {MIN_SECRET_KEY_LENGTH} characters."
                )
            if "*" in self.cors_origins:
                raise ValueError(
                    "ALLOWED_ORIGINS cannot be '*' in production; credentialed CORS "
                    "requires an explicit origin list."
                )
        elif not key or key in COMPROMISED_SECRET_KEYS:
            object.__setattr__(self, "SECRET_KEY", _development_secret_key())

        return self


settings = Settings()

os.makedirs(settings.upload_path, exist_ok=True)
