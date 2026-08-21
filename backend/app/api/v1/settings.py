from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.content import SiteSettings
from app.models.admin import AdminUser
from app.schemas.content import SiteSettingsUpdate, SiteSettingsOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/settings", tags=["Site Settings"])

@router.get("", response_model=SiteSettingsOut)
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SiteSettings))
    sett = result.scalars().first()
    if not sett:
        sett = SiteSettings()
        db.add(sett)
        await db.commit()
        await db.refresh(sett)
    return sett

@router.put("", response_model=SiteSettingsOut)
async def update_settings(
    payload: SiteSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(SiteSettings))
    sett = result.scalars().first()
    if not sett:
        sett = SiteSettings()
        db.add(sett)

    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(sett, key, val)

    await db.commit()
    await db.refresh(sett)
    return sett
