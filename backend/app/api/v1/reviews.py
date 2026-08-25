from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_admin
from app.core.config import settings
from app.core.database import get_db
from app.core.ratelimit import RateLimiter
from app.models.admin import AdminUser
from app.models.catalog import Product
from app.models.engagement import Review
from app.schemas.engagement import (
    ReviewCreate,
    ReviewOut,
    ReviewPublicOut,
    ReviewUpdate,
)

router = APIRouter(prefix="/reviews", tags=["Reviews"])

VALID_STATUSES = {"pending", "approved", "rejected"}

submit_rate_limit = RateLimiter(
    scope="reviews",
    max_requests=settings.PUBLIC_SUBMIT_LIMIT,
    window_seconds=settings.PUBLIC_SUBMIT_WINDOW_SECONDS,
)


def _with_product():
    return select(Review, Product.title.label("product_title")).outerjoin(
        Product, Review.product_id == Product.id
    )


def _to_public(review: Review, product_title: Optional[str]) -> ReviewPublicOut:
    out = ReviewPublicOut.model_validate(review)
    out.product_title = product_title
    return out


def _to_admin(review: Review, product_title: Optional[str]) -> ReviewOut:
    out = ReviewOut.model_validate(review)
    out.product_title = product_title
    return out


@router.get("", response_model=List[ReviewPublicOut])
async def list_public_reviews(
    product_id: Optional[int] = None,
    featured_only: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Approved reviews only, and never the reviewer's email address.

    There is deliberately no status filter here: the previous version accepted
    `?status_filter=pending`, which published the unmoderated queue -- along with
    every reviewer's email -- to anyone who asked.
    """
    query = _with_product().where(Review.status == "approved")

    if product_id:
        query = query.where(Review.product_id == product_id)
    if featured_only:
        query = query.where(Review.featured_on_home.is_(True))

    query = query.order_by(Review.created_at.desc()).limit(limit)
    return [_to_public(rev, title) for rev, title in (await db.execute(query)).all()]


@router.get("/admin/all", response_model=List[ReviewOut])
async def list_all_reviews_admin(
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    query = _with_product()
    if status_filter:
        query = query.where(Review.status == status_filter)
    query = query.order_by(Review.created_at.desc())
    return [_to_admin(rev, title) for rev, title in (await db.execute(query)).all()]


@router.post(
    "",
    response_model=ReviewPublicOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(submit_rate_limit)],
)
async def submit_review(payload: ReviewCreate, db: AsyncSession = Depends(get_db)):
    review = Review(
        product_id=payload.product_id,
        user_name=payload.user_name,
        user_email=payload.user_email,
        rating=payload.rating,
        text=payload.text,
        images=payload.images,
        status="pending",  # Always: approval is an admin action.
        featured_on_home=False,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    title = None
    if review.product_id:
        title = await db.scalar(
            select(Product.title).where(Product.id == review.product_id)
        )
    return _to_public(review, title)


@router.put("/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id: int,
    payload: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    changes = payload.model_dump(exclude_unset=True)

    if changes.get("status") is not None and changes["status"] not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"status must be one of: {', '.join(sorted(VALID_STATUSES))}",
        )

    for field, value in changes.items():
        if value is not None:
            setattr(review, field, value)

    await db.commit()
    await db.refresh(review)

    title = None
    if review.product_id:
        title = await db.scalar(
            select(Product.title).where(Product.id == review.product_id)
        )
    return _to_admin(review, title)


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(review)
    await db.commit()
    return None
