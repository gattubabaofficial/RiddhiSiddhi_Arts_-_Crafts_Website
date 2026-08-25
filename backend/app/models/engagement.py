from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.time import now_utc
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), nullable=True)
    rating = Column(Integer, default=5, nullable=False)
    text = Column(Text, nullable=False)
    images = Column(JSON, default=[]) # User uploaded images
    status = Column(String(50), default="pending", index=True) # pending, approved, rejected
    featured_on_home = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    product = relationship("Product", back_populates="reviews")

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    title_salutation = Column(String(20), default="Mr.")
    name = Column(String(255), nullable=False)
    mobile = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    images = Column(JSON, default=[]) # Reference images uploaded by customer
    product_id = Column(Integer, nullable=True) # Linked product if initiated from product page
    product_title = Column(String(255), nullable=True)
    status = Column(String(50), default="new", index=True) # new, in_progress, closed
    created_at = Column(DateTime(timezone=True), default=now_utc)
