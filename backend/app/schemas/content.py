from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class HomeSectionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    body_content: Optional[str] = None
    image_url: Optional[str] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None

class HomeSectionOut(BaseModel):
    id: int
    section_key: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    body_content: Optional[str] = None
    image_url: Optional[str] = None
    is_visible: bool
    display_order: int
    created_at: datetime

    class Config:
        from_attributes = True

class AboutBlockUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    images: Optional[List[str]] = None
    display_order: Optional[int] = None

class AboutBlockOut(BaseModel):
    id: int
    block_key: str
    title: str
    content: str
    images: List[str] = []
    display_order: int
    created_at: datetime

    class Config:
        from_attributes = True

class SiteSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    proprietor: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    map_embed_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    logo_url: Optional[str] = None
    seo_meta: Optional[Dict[str, Any]] = None

class SiteSettingsOut(BaseModel):
    id: int
    company_name: str
    proprietor: str
    phone: str
    email: str
    gst_number: str
    address: str
    latitude: str
    longitude: str
    map_embed_url: str
    social_links: Dict[str, Any]
    logo_url: Optional[str] = None
    seo_meta: Dict[str, Any]
    updated_at: datetime

    class Config:
        from_attributes = True
