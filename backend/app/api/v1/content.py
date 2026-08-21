from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models.content import HomeSection, AboutBlock
from app.models.admin import AdminUser
from app.schemas.content import HomeSectionUpdate, HomeSectionOut, AboutBlockUpdate, AboutBlockOut
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/content", tags=["Content Managers"])

@router.get("/home-sections", response_model=List[HomeSectionOut])
async def list_home_sections(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HomeSection).order_by(HomeSection.display_order.asc(), HomeSection.id.asc()))
    return result.scalars().all()

@router.put("/home-sections/{section_key}", response_model=HomeSectionOut)
async def update_home_section(
    section_key: str,
    payload: HomeSectionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(HomeSection).where(HomeSection.section_key == section_key))
    sec = result.scalars().first()
    if not sec:
        sec = HomeSection(section_key=section_key)
        db.add(sec)
    
    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(sec, key, val)

    await db.commit()
    await db.refresh(sec)
    return sec

@router.get("/about-blocks", response_model=List[AboutBlockOut])
async def list_about_blocks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AboutBlock).order_by(AboutBlock.display_order.asc(), AboutBlock.id.asc()))
    return result.scalars().all()

@router.put("/about-blocks/{block_key}", response_model=AboutBlockOut)
async def update_about_block(
    block_key: str,
    payload: AboutBlockUpdate,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    result = await db.execute(select(AboutBlock).where(AboutBlock.block_key == block_key))
    blk = result.scalars().first()
    if not blk:
        blk = AboutBlock(block_key=block_key, title=block_key.replace('_', ' ').title(), content="")
        db.add(blk)

    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(blk, key, val)

    await db.commit()
    await db.refresh(blk)
    return blk
