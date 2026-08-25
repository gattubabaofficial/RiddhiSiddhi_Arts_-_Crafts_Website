from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_admin
from app.core.database import get_db
from app.core.slugs import slug_is_taken, slugify, unique_slug
from app.models.admin import AdminUser
from app.models.catalog import Category, Product
from app.schemas.catalog import CategoryCreate, CategoryOut, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["Categories"])


async def _product_counts(db: AsyncSession) -> Dict[int, int]:
    """One grouped query for every category, rather than a COUNT per row."""
    rows = await db.execute(
        select(Product.category_id, func.count(Product.id)).group_by(
            Product.category_id
        )
    )
    return {category_id: count for category_id, count in rows.all()}


def _to_out(category: Category, product_count: int) -> CategoryOut:
    out = CategoryOut.model_validate(category)
    out.product_count = product_count
    return out


async def _load_category(db: AsyncSession, cat_id: int) -> Category:
    result = await db.execute(select(Category).where(Category.id == cat_id))
    category = result.scalars().first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get("", response_model=List[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category).order_by(Category.display_order.asc(), Category.id.asc())
    )
    categories = result.scalars().all()
    counts = await _product_counts(db)
    return [_to_out(cat, counts.get(cat.id, 0)) for cat in categories]


@router.get("/{slug}", response_model=CategoryOut)
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.slug == slug))
    category = result.scalars().first()

    if not category and slug.isdigit():
        result = await db.execute(select(Category).where(Category.id == int(slug)))
        category = result.scalars().first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    count = await db.scalar(
        select(func.count(Product.id)).where(Product.category_id == category.id)
    )
    return _to_out(category, count or 0)


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    category = Category(
        name=payload.name,
        slug=await unique_slug(db, Category, payload.slug or payload.name),
        image_url=payload.image_url,
        description=payload.description,
        display_order=payload.display_order,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return _to_out(category, 0)


@router.put("/{cat_id}", response_model=CategoryOut)
async def update_category(
    cat_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    category = await _load_category(db, cat_id)
    changes = payload.model_dump(exclude_unset=True)

    # As with products: renaming never rewrites an already-published slug.
    if changes.get("slug") is not None:
        requested = slugify(changes["slug"])
        if await slug_is_taken(db, Category, requested, exclude_id=category.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{requested}' is already used by another category.",
            )
        category.slug = requested
    changes.pop("slug", None)

    for field, value in changes.items():
        if value is not None:
            setattr(category, field, value)

    await db.commit()
    await db.refresh(category)

    count = await db.scalar(
        select(func.count(Product.id)).where(Product.category_id == category.id)
    )
    return _to_out(category, count or 0)


@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    cat_id: int,
    cascade: bool = Query(
        False,
        description="Also delete every product in this category. Required when "
        "the category is not empty.",
    ),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    category = await _load_category(db, cat_id)

    # The ORM relationship cascades to products. Deleting a whole catalogue
    # section is not something a mis-click should be able to do.
    count = await db.scalar(
        select(func.count(Product.id)).where(Product.category_id == category.id)
    )
    if count and not cascade:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Category still contains {count} product(s). Move or delete them "
                "first, or repeat this request with cascade=true to delete them "
                "along with the category."
            ),
        )

    await db.delete(category)
    await db.commit()
    return None
