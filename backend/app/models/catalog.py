from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    image_url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    price = Column(String(100), nullable=True) # e.g., ₹199/Piece
    currency = Column(String(10), default="INR")
    moq = Column(String(100), default="1 Piece") # Minimum Order Quantity
    short_description = Column(Text, nullable=True)
    long_description = Column(Text, nullable=True)
    images = Column(JSON, default=[]) # List of image URLs
    is_featured = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=0)
    specs = Column(JSON, default=[]) # List of dicts: [{"label": "Wood Origin", "value": "Indian Sandalwood"}]
    similar_product_ids = Column(JSON, default=[]) # Array of integer product IDs
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
