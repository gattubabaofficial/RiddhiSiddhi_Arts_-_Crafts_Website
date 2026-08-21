from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ReviewCreate(BaseModel):
    product_id: Optional[int] = None
    user_name: str
    user_email: Optional[EmailStr] = None
    rating: int = 5
    text: str
    images: List[str] = []

class ReviewUpdate(BaseModel):
    status: Optional[str] = None # pending, approved, rejected
    featured_on_home: Optional[bool] = None
    rating: Optional[int] = None
    text: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    product_id: Optional[int] = None
    user_name: str
    user_email: Optional[str] = None
    rating: int
    text: str
    images: List[str] = []
    status: str
    featured_on_home: bool
    created_at: datetime
    product_title: Optional[str] = None

    class Config:
        from_attributes = True

class EnquiryCreate(BaseModel):
    title_salutation: str = "Mr."
    name: str
    mobile: str
    email: EmailStr
    message: str
    images: List[str] = []
    product_id: Optional[int] = None
    product_title: Optional[str] = None

class EnquiryUpdateStatus(BaseModel):
    status: str # new, in_progress, closed

class EnquiryOut(BaseModel):
    id: int
    title_salutation: str
    name: str
    mobile: str
    email: str
    message: str
    images: List[str] = []
    product_id: Optional[int] = None
    product_title: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
