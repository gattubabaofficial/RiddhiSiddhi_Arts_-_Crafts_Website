import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Riddhi Siddhi Arts & Crafts API"
    SECRET_KEY: str = "supersecret_riddhi_siddhi_sandalwood_jaipur_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/riddhi_siddhi_db"
    USE_SQLITE_FALLBACK: bool = True
    SQLITE_URL: str = "sqlite+aiosqlite:///./riddhi_siddhi.db"
    UPLOAD_DIR: str = "uploads"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
