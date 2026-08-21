from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models.media import HeroBanner, Collaboration
from app.models.admin import AdminUser
from app.schemas.media import HeroBannerCreate, HeroBannerUpdate, HeroBannerOut, CollaborationCreate, CollaborationOut
from app.api.v1.auth import get_current_admin

router = APIRouter(tags=["Media & Banners"])

@router.get("/banners", response_model=List[HeroBannerOut])
async def list_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HeroBanner).where(HeroBanner.is_active == True).order_by(HeroBanner.display_order.asc(), HeroBanner.id.asc()))
    return result.scalars().all()

@router.get("/admin/banners", response_model=List[HeroBannerOut])
async def list_banners_admin(db: AsyncSession = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    result = await db.execute(select(HeroBanner).order_by(HeroBanner.display_order.asc(), HeroBanner.id.asc()))
    return result.scalars().all()

@router.post("/banners", response_model=HeroBannerOut, status_code=status.HTTP_201_CREATED)
async def create_banner(
    payload: HeroBannerCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    banner = HeroBanner(**payload.model_dump())
    db.add(banner)
    await db.commit()
    await db.refresh(banner)
    return banner

@router.put("/banners/{banner_id}", response_model=HeroBannerOut)
async def update_banner(
    banner_id: int,
    payload: HeroBannerUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(HeroBanner).where(HeroBanner.id == banner_id))
    banner = result.scalars().first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
    await db.commit()
    await db.refresh(banner)
    return banner

@router.delete("/banners/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_banner(
    banner_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(HeroBanner).where(HeroBanner.id == banner_id))
    banner = result.scalars().first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    await db.delete(banner)
    await db.commit()
    return None

# Collaborations & Certificates
@router.get("/collaborations", response_model=List[CollaborationOut])
async def list_collaborations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Collaboration).order_by(Collaboration.display_order.asc(), Collaboration.id.asc()))
    return result.scalars().all()

@router.post("/collaborations", response_model=CollaborationOut, status_code=status.HTTP_201_CREATED)
async def create_collaboration(
    payload: CollaborationCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    collab = Collaboration(**payload.model_dump())
    db.add(collab)
    await db.commit()
    await db.refresh(collab)
    return collab

@router.delete("/collaborations/{collab_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collaboration(
    collab_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Collaboration).where(Collaboration.id == collab_id))
    collab = result.scalars().first()
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration not found")
    await db.delete(collab)
    await db.commit()
    return None
