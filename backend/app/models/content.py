from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from datetime import datetime
from app.core.database import Base

class HomeSection(Base):
    __tablename__ = "home_sections"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String(100), unique=True, index=True, nullable=False) # e.g. hero, featured_products, about_summary, reels, trending_reels, reviews, collaborations, location
    title = Column(String(255), nullable=True)
    subtitle = Column(String(255), nullable=True)
    body_content = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    is_visible = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class AboutBlock(Base):
    __tablename__ = "about_blocks"

    id = Column(Integer, primary_key=True, index=True)
    block_key = Column(String(100), index=True, nullable=False) # vision, mission, ceo_story, brand_story, why_choose_us, real_vs_fake, how_to_test
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    images = Column(JSON, default=[])
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), default="Riddhi Siddhi Arts & Crafts")
    proprietor = Column(String(255), default="Ghanshyam Agrawal")
    phone = Column(String(100), default="+91-7942625339")
    email = Column(String(255), default="info@riddhisiddhiarts.com")
    gst_number = Column(String(100), default="08ADOPA9061E1ZK")
    address = Column(Text, default="Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India")
    latitude = Column(String(50), default="26.87013")
    longitude = Column(String(50), default="75.77491")
    map_embed_url = Column(Text, default="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed")
    social_links = Column(JSON, default={
        "whatsapp": "+917942625339",
        "facebook": "https://facebook.com",
        "instagram": "https://instagram.com",
        "youtube": "https://youtube.com"
    })
    logo_url = Column(Text, nullable=True)
    seo_meta = Column(JSON, default={
        "meta_title": "Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur",
        "meta_description": "Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Beads in Jaipur."
    })
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
