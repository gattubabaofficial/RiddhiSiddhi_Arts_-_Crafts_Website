from datetime import datetime
from typing import Annotated, List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints

# Trimmed and length-bounded: these fields come from anonymous submitters and go
# straight into the database and the admin inbox.
ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
Salutation = Annotated[str, StringConstraints(strip_whitespace=True, max_length=20)]
Mobile = Annotated[str, StringConstraints(strip_whitespace=True, min_length=6, max_length=32)]
BodyText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=5000)]

Rating = Annotated[int, Field(ge=1, le=5)]


class ReviewCreate(BaseModel):
    product_id: Optional[int] = None
    user_name: ShortText
    user_email: Optional[EmailStr] = None
    rating: Rating = 5
    text: BodyText
    images: List[str] = Field(default_factory=list, max_length=10)


class ReviewUpdate(BaseModel):
    status: Optional[str] = None  # pending, approved, rejected
    featured_on_home: Optional[bool] = None
    rating: Optional[Rating] = None
    text: Optional[BodyText] = None


class ReviewPublicOut(BaseModel):
    """What anonymous visitors may see. Deliberately has no user_email.

    `status` is safe to include: the public listing only ever returns approved
    rows, and on submission it tells the reviewer their review is awaiting
    moderation.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: Optional[int] = None
    user_name: str
    rating: int
    text: str
    images: List[str] = Field(default_factory=list)
    status: str
    featured_on_home: bool
    created_at: datetime
    product_title: Optional[str] = None


class ReviewOut(ReviewPublicOut):
    """Admin view: adds the reviewer's email address."""

    user_email: Optional[str] = None


class EnquiryCreate(BaseModel):
    title_salutation: Salutation = "Mr."
    name: ShortText
    mobile: Mobile
    email: EmailStr
    message: BodyText
    images: List[str] = Field(default_factory=list, max_length=10)
    product_id: Optional[int] = None
    product_title: Optional[str] = None


class EnquiryUpdateStatus(BaseModel):
    status: str  # new, in_progress, closed


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title_salutation: str
    name: str
    mobile: str
    email: str
    message: str
    images: List[str] = Field(default_factory=list)
    product_id: Optional[int] = None
    product_title: Optional[str] = None
    status: str
    created_at: datetime
