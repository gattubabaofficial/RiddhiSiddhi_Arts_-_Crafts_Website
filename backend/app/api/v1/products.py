from typing import List, Optional, Sequence, Tuple

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_admin
from app.core.database import get_db
from app.core.slugs import slug_is_taken, slugify, unique_slug
from app.models.admin import AdminUser
from app.models.catalog import Category, Product
from app.schemas.catalog import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 24
MAX_SIMILAR = 12


def _to_out(product: Product, category_name: Optional[str]) -> ProductOut:
    out = ProductOut.model_validate(product)
    out.category_name = category_name
    return out


def _with_category():
    return select(Product, Category.name.label("category_name")).join(
        Category, Product.category_id == Category.id
    )


def _rows_to_out(rows: Sequence[Tuple[Product, Optional[str]]]) -> List[ProductOut]:
    return [_to_out(product, name) for product, name in rows]


async def _require_category(db: AsyncSession, category_id: int) -> None:
    exists = await db.execute(select(Category.id).where(Category.id == category_id))
    if exists.first() is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category {category_id} does not exist.",
        )


async def _load_product(db: AsyncSession, product_id: int) -> Product:
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("", response_model=List[ProductOut])
async def list_products(
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    query = _with_category()

    if category_id:
        query = query.where(Product.category_id == category_id)
    if category_slug:
        query = query.where(Category.slug == category_slug)
    if featured is not None:
        query = query.where(Product.is_featured == featured)
    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Product.title.ilike(term),
                Product.short_description.ilike(term),
                Product.long_description.ilike(term),
            )
        )

    query = (
        query.order_by(Product.display_order.asc(), Product.id.desc())
        .offset(offset)
        .limit(limit)
    )
    return _rows_to_out((await db.execute(query)).all())


@router.get("/{slug_or_id}", response_model=ProductOut)
async def get_product_detail(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    query = _with_category()
    if slug_or_id.isdigit():
        query = query.where(Product.id == int(slug_or_id))
    else:
        query = query.where(Product.slug == slug_or_id)

    row = (await db.execute(query)).first()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return _to_out(*row)


@router.get("/{slug_or_id}/similar", response_model=List[ProductOut])
async def get_similar_products(
    slug_or_id: str,
    limit: int = Query(4, ge=1, le=MAX_SIMILAR),
    db: AsyncSession = Depends(get_db),
):
    """Curated `similar_product_ids` when the admin has set them, otherwise the
    rest of the same category. The curated list was previously stored and then
    ignored by every reader."""
    lookup = select(Product)
    if slug_or_id.isdigit():
        lookup = lookup.where(Product.id == int(slug_or_id))
    else:
        lookup = lookup.where(Product.slug == slug_or_id)

    product = (await db.execute(lookup)).scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    curated = [pid for pid in (product.similar_product_ids or []) if pid != product.id]
    if curated:
        rows = (
            await db.execute(_with_category().where(Product.id.in_(curated[:limit])))
        ).all()
        by_id = {row[0].id: row for row in rows}
        return _rows_to_out([by_id[pid] for pid in curated[:limit] if pid in by_id])

    fallback = (
        _with_category()
        .where(Product.category_id == product.category_id, Product.id != product.id)
        .order_by(Product.display_order.asc(), Product.id.desc())
        .limit(limit)
    )
    return _rows_to_out((await db.execute(fallback)).all())


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    await _require_category(db, payload.category_id)

    slug = await unique_slug(db, Product, payload.slug or payload.title)

    product = Product(
        category_id=payload.category_id,
        title=payload.title,
        slug=slug,
        price=payload.price,
        currency=payload.currency,
        moq=payload.moq,
        short_description=payload.short_description,
        long_description=payload.long_description,
        images=payload.images,
        videos=payload.videos,
        is_featured=payload.is_featured,
        display_order=payload.display_order,
        specs=payload.specs,
        similar_product_ids=payload.similar_product_ids,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)

    name = await db.scalar(select(Category.name).where(Category.id == product.category_id))
    return _to_out(product, name)


@router.put("/{prod_id}", response_model=ProductOut)
async def update_product(
    prod_id: int,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = await _load_product(db, prod_id)
    changes = payload.model_dump(exclude_unset=True)

    if "category_id" in changes and changes["category_id"] is not None:
        await _require_category(db, changes["category_id"])

    # Renaming must not rewrite the slug: the old URL is already indexed and
    # linked. Changing the public address of a product is an explicit action.
    if changes.get("slug") is not None:
        requested = slugify(changes["slug"])
        if await slug_is_taken(db, Product, requested, exclude_id=product.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{requested}' is already used by another product.",
            )
        product.slug = requested
    changes.pop("slug", None)

    for field, value in changes.items():
        if value is not None:
            setattr(product, field, value)

    await db.commit()
    await db.refresh(product)

    name = await db.scalar(select(Category.name).where(Category.id == product.category_id))
    return _to_out(product, name)


@router.delete("/{prod_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    prod_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = await _load_product(db, prod_id)
    await db.delete(product)
    await db.commit()
    return None
