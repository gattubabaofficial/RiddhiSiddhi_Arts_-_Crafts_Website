from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ReelBase(BaseModel):
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    is_trending: bool = False
    display_order: int = 0

class ReelCreate(ReelBase):
    pass

class ReelUpdate(BaseModel):
    title: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_trending: Optional[bool] = None
    display_order: Optional[int] = None

class ReelOut(ReelBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HeroBannerBase(BaseModel):
    image_url: str
    heading: str
    subheading: Optional[str] = None
    cta_label: Optional[str] = None
    cta_link: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class HeroBannerCreate(HeroBannerBase):
    pass

class HeroBannerUpdate(BaseModel):
    image_url: Optional[str] = None
    heading: Optional[str] = None
    subheading: Optional[str] = None
    cta_label: Optional[str] = None
    cta_link: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class HeroBannerOut(HeroBannerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CollaborationBase(BaseModel):
    title: str
    logo_url: str
    link: Optional[str] = None
    display_order: int = 0

class CollaborationCreate(CollaborationBase):
    pass

class CollaborationOut(CollaborationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
