from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.config import settings
from app.core.database import get_db
from app.core.ratelimit import RateLimiter
from app.models.engagement import Enquiry
from app.models.catalog import Product
from app.models.admin import AdminUser
from app.schemas.engagement import EnquiryCreate, EnquiryUpdateStatus, EnquiryOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

submit_rate_limit = RateLimiter(
    scope="enquiries",
    max_requests=settings.PUBLIC_SUBMIT_LIMIT,
    window_seconds=settings.PUBLIC_SUBMIT_WINDOW_SECONDS,
)

@router.post(
    "",
    response_model=EnquiryOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(submit_rate_limit)],
)
async def submit_enquiry(payload: EnquiryCreate, db: AsyncSession = Depends(get_db)):
    prod_title = payload.product_title
    if payload.product_id and not prod_title:
        p_res = await db.execute(select(Product.title).where(Product.id == payload.product_id))
        prod_title = p_res.scalar()

    enq = Enquiry(
        title_salutation=payload.title_salutation,
        name=payload.name,
        mobile=payload.mobile,
        email=payload.email,
        message=payload.message,
        images=payload.images,
        product_id=payload.product_id,
        product_title=prod_title,
        status="new"
    )
    db.add(enq)
    await db.commit()
    await db.refresh(enq)
    return enq

@router.get("", response_model=List[EnquiryOut])
async def list_enquiries(
    status_filter: Optional[str] = None,
    limit: int = Query(200, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    query = select(Enquiry).order_by(Enquiry.created_at.desc())
    if status_filter:
        query = query.where(Enquiry.status == status_filter)
    result = await db.execute(query.limit(limit))
    return result.scalars().all()

@router.put("/{enquiry_id}/status", response_model=EnquiryOut)
async def update_enquiry_status(
    enquiry_id: int,
    payload: EnquiryUpdateStatus,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Enquiry).where(Enquiry.id == enquiry_id))
    enq = result.scalars().first()
    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enq.status = payload.status
    await db.commit()
    await db.refresh(enq)
    return enq

@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enquiry(
    enquiry_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Enquiry).where(Enquiry.id == enquiry_id))
    enq = result.scalars().first()
    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    await db.delete(enq)
    await db.commit()
    return None
