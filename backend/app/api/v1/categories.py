from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
import re
from app.core.database import get_db
from app.models.catalog import Category, Product
from app.models.admin import AdminUser
from app.schemas.catalog import CategoryCreate, CategoryUpdate, CategoryOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

def slugify(text: str) -> str:
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

@router.get("", response_model=List[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.display_order.asc(), Category.id.asc()))
    categories = result.scalars().all()
    
    out = []
    for cat in categories:
        count_res = await db.execute(select(func.count(Product.id)).where(Product.category_id == cat.id))
        count = count_res.scalar() or 0
        cat_dict = CategoryOut.model_validate(cat)
        cat_dict.product_count = count
        out.append(cat_dict)
    return out

@router.get("/{slug}", response_model=CategoryOut)
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.slug == slug))
    cat = result.scalars().first()
    if not cat:
        # Try finding by ID
        if slug.isdigit():
            result = await db.execute(select(Category).where(Category.id == int(slug)))
            cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    count_res = await db.execute(select(func.count(Product.id)).where(Product.category_id == cat.id))
    cat_dict = CategoryOut.model_validate(cat)
    cat_dict.product_count = count_res.scalar() or 0
    return cat_dict

@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    slug = payload.slug or slugify(payload.name)
    existing = await db.execute(select(Category).where(Category.slug == slug))
    if existing.scalars().first():
        slug = f"{slug}-{int(func.now())}"

    cat = Category(
        name=payload.name,
        slug=slug,
        image_url=payload.image_url,
        description=payload.description,
        display_order=payload.display_order
    )
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    cat_dict = CategoryOut.model_validate(cat)
    cat_dict.product_count = 0
    return cat_dict

@router.put("/{cat_id}", response_model=CategoryOut)
async def update_category(
    cat_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Category).where(Category.id == cat_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if payload.name is not None:
        cat.name = payload.name
        if not payload.slug:
            cat.slug = slugify(payload.name)
    if payload.slug is not None:
        cat.slug = payload.slug
    if payload.image_url is not None:
        cat.image_url = payload.image_url
    if payload.description is not None:
        cat.description = payload.description
    if payload.display_order is not None:
        cat.display_order = payload.display_order

    await db.commit()
    await db.refresh(cat)
    count_res = await db.execute(select(func.count(Product.id)).where(Product.category_id == cat.id))
    cat_dict = CategoryOut.model_validate(cat)
    cat_dict.product_count = count_res.scalar() or 0
    return cat_dict

@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    cat_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Category).where(Category.id == cat_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(cat)
    await db.commit()
    return None
