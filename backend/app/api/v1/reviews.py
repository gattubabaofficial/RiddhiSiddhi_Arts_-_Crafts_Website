from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.database import get_db
from app.models.engagement import Review
from app.models.catalog import Product
from app.models.admin import AdminUser
from app.schemas.engagement import ReviewCreate, ReviewUpdate, ReviewOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("", response_model=List[ReviewOut])
async def list_reviews(
    product_id: Optional[int] = None,
    status_filter: Optional[str] = "approved",
    featured_only: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Review, Product.title.label("product_title")).outerjoin(Product, Review.product_id == Product.id)

    if status_filter:
        query = query.where(Review.status == status_filter)
    if product_id:
        query = query.where(Review.product_id == product_id)
    if featured_only:
        query = query.where(Review.featured_on_home == True)

    query = query.order_by(Review.created_at.desc())
    result = await db.execute(query)
    rows = result.all()

    out = []
    for rev, p_title in rows:
        r_dict = ReviewOut.model_validate(rev)
        r_dict.product_title = p_title
        out.append(r_dict)
    return out

@router.get("/admin/all", response_model=List[ReviewOut])
async def list_all_reviews_admin(
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    query = select(Review, Product.title.label("product_title")).outerjoin(Product, Review.product_id == Product.id).order_by(Review.created_at.desc())
    result = await db.execute(query)
    rows = result.all()

    out = []
    for rev, p_title in rows:
        r_dict = ReviewOut.model_validate(rev)
        r_dict.product_title = p_title
        out.append(r_dict)
    return out

@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def submit_review(payload: ReviewCreate, db: AsyncSession = Depends(get_db)):
    rev = Review(
        product_id=payload.product_id,
        user_name=payload.user_name,
        user_email=payload.user_email,
        rating=payload.rating,
        text=payload.text,
        images=payload.images,
        status="pending", # Needs admin approval
        featured_on_home=False
    )
    db.add(rev)
    await db.commit()
    await db.refresh(rev)

    p_title = None
    if rev.product_id:
        p_res = await db.execute(select(Product.title).where(Product.id == rev.product_id))
        p_title = p_res.scalar()

    r_dict = ReviewOut.model_validate(rev)
    r_dict.product_title = p_title
    return r_dict

@router.put("/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id: int,
    payload: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    rev = result.scalars().first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")

    if payload.status is not None:
        rev.status = payload.status
    if payload.featured_on_home is not None:
        rev.featured_on_home = payload.featured_on_home
    if payload.rating is not None:
        rev.rating = payload.rating
    if payload.text is not None:
        rev.text = payload.text

    await db.commit()
    await db.refresh(rev)

    p_title = None
    if rev.product_id:
        p_res = await db.execute(select(Product.title).where(Product.id == rev.product_id))
        p_title = p_res.scalar()

    r_dict = ReviewOut.model_validate(rev)
    r_dict.product_title = p_title
    return r_dict

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Review).where(Review.id == review_id))
    rev = result.scalars().first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(rev)
    await db.commit()
    return None
