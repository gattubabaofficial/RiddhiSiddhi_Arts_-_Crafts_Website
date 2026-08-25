from sqlalchemy import Column, Integer, String, DateTime
from app.core.time import now_utc
from app.core.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="superadmin", nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
