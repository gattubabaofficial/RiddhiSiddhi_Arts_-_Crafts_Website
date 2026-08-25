from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class CategoryOut(CategoryBase):
    id: int
    slug: str
    created_at: datetime
    product_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

class SpecItem(BaseModel):
    label: str
    value: str

class ProductBase(BaseModel):
    category_id: int
    title: str
    slug: Optional[str] = None
    price: Optional[str] = "₹199/Piece"
    currency: str = "INR"
    moq: str = "1 Piece"
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    images: List[str] = []
    videos: List[str] = []
    is_featured: bool = False
    display_order: int = 0
    specs: List[Dict[str, Any]] = []
    similar_product_ids: List[int] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[str] = None
    currency: Optional[str] = None
    moq: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    specs: Optional[List[Dict[str, Any]]] = None
    similar_product_ids: Optional[List[int]] = None

class ProductOut(ProductBase):
    id: int
    slug: str
    created_at: datetime
    category_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
