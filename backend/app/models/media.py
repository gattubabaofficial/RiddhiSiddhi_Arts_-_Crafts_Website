from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.time import now_utc
from app.core.database import Base

class Reel(Base):
    __tablename__ = "reels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    video_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, nullable=True)
    is_trending = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=now_utc)

class HeroBanner(Base):
    __tablename__ = "hero_banners"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(Text, nullable=False)
    heading = Column(String(255), nullable=False)
    subheading = Column(Text, nullable=True)
    cta_label = Column(String(100), nullable=True)
    cta_link = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    logo_url = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=now_utc)
