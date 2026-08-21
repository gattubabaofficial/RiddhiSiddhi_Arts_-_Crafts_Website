from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import List, Optional
import re
from app.core.database import get_db
from app.models.catalog import Product, Category
from app.models.admin import AdminUser
from app.schemas.catalog import ProductCreate, ProductUpdate, ProductOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/products", tags=["Products"])

def slugify(text: str) -> str:
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

@router.get("", response_model=List[ProductOut])
async def list_products(
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(Product, Category.name.label("category_name")).join(Category, Product.category_id == Category.id)

    if category_id:
        query = query.where(Product.category_id == category_id)
    if category_slug:
        query = query.where(Category.slug == category_slug)
    if featured is not None:
        query = query.where(Product.is_featured == featured)
    if search:
        query = query.where(
            or_(
                Product.title.ilike(f"%{search}%"),
                Product.short_description.ilike(f"%{search}%"),
                Product.long_description.ilike(f"%{search}%")
            )
        )

    query = query.order_by(Product.display_order.asc(), Product.id.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    rows = result.all()

    out = []
    for prod, cat_name in rows:
        p_dict = ProductOut.model_validate(prod)
        p_dict.category_name = cat_name
        out.append(p_dict)
    return out

@router.get("/{slug_or_id}", response_model=ProductOut)
async def get_product_detail(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Product, Category.name.label("category_name")).join(Category, Product.category_id == Category.id)
    
    if slug_or_id.isdigit():
        result = await db.execute(query.where(Product.id == int(slug_or_id)))
    else:
        result = await db.execute(query.where(Product.slug == slug_or_id))
    
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    
    prod, cat_name = row
    p_dict = ProductOut.model_validate(prod)
    p_dict.category_name = cat_name
    return p_dict

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    slug = payload.slug or slugify(payload.title)
    existing = await db.execute(select(Product).where(Product.slug == slug))
    if existing.scalars().first():
        slug = f"{slug}-{int(func.now())}"

    prod = Product(
        category_id=payload.category_id,
        title=payload.title,
        slug=slug,
        price=payload.price,
        currency=payload.currency,
        moq=payload.moq,
        short_description=payload.short_description,
        long_description=payload.long_description,
        images=payload.images,
        is_featured=payload.is_featured,
        display_order=payload.display_order,
        specs=payload.specs,
        similar_product_ids=payload.similar_product_ids
    )
    db.add(prod)
    await db.commit()
    await db.refresh(prod)

    cat_res = await db.execute(select(Category.name).where(Category.id == prod.category_id))
    cat_name = cat_res.scalar()

    p_dict = ProductOut.model_validate(prod)
    p_dict.category_name = cat_name
    return p_dict

@router.put("/{prod_id}", response_model=ProductOut)
async def update_product(
    prod_id: int,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == prod_id))
    prod = result.scalars().first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if payload.category_id is not None:
        prod.category_id = payload.category_id
    if payload.title is not None:
        prod.title = payload.title
        if not payload.slug:
            prod.slug = slugify(payload.title)
    if payload.slug is not None:
        prod.slug = payload.slug
    if payload.price is not None:
        prod.price = payload.price
    if payload.currency is not None:
        prod.currency = payload.currency
    if payload.moq is not None:
        prod.moq = payload.moq
    if payload.short_description is not None:
        prod.short_description = payload.short_description
    if payload.long_description is not None:
        prod.long_description = payload.long_description
    if payload.images is not None:
        prod.images = payload.images
    if payload.is_featured is not None:
        prod.is_featured = payload.is_featured
    if payload.display_order is not None:
        prod.display_order = payload.display_order
    if payload.specs is not None:
        prod.specs = payload.specs
    if payload.similar_product_ids is not None:
        prod.similar_product_ids = payload.similar_product_ids

    await db.commit()
    await db.refresh(prod)

    cat_res = await db.execute(select(Category.name).where(Category.id == prod.category_id))
    cat_name = cat_res.scalar()

    p_dict = ProductOut.model_validate(prod)
    p_dict.category_name = cat_name
    return p_dict

@router.delete("/{prod_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    prod_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.id == prod_id))
    prod = result.scalars().first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(prod)
    await db.commit()
    return None
