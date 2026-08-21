from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.core.database import get_db
from app.models.media import Reel
from app.models.admin import AdminUser
from app.schemas.media import ReelCreate, ReelUpdate, ReelOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/reels", tags=["Reels"])

@router.get("", response_model=List[ReelOut])
async def list_reels(trending_only: Optional[bool] = None, db: AsyncSession = Depends(get_db)):
    query = select(Reel).order_by(Reel.display_order.asc(), Reel.id.desc())
    if trending_only:
        query = query.where(Reel.is_trending == True)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=ReelOut, status_code=status.HTTP_201_CREATED)
async def create_reel(
    payload: ReelCreate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    reel = Reel(**payload.model_dump())
    db.add(reel)
    await db.commit()
    await db.refresh(reel)
    return reel

@router.put("/{reel_id}", response_model=ReelOut)
async def update_reel(
    reel_id: int,
    payload: ReelUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Reel).where(Reel.id == reel_id))
    reel = result.scalars().first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(reel, key, value)

    await db.commit()
    await db.refresh(reel)
    return reel

@router.delete("/{reel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reel(
    reel_id: int,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(Reel).where(Reel.id == reel_id))
    reel = result.scalars().first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    await db.delete(reel)
    await db.commit()
    return None
