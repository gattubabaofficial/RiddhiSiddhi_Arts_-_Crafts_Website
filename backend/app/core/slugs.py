"""Slug generation.

A slug is a public URL. Two rules follow from that:

  * a collision must resolve to a new slug, never a 500 (the old code did
    `int(func.now())`, which raises TypeError on a SQLAlchemy function element);
  * an existing slug must never change on its own, because links to it have
    already been shared and indexed.
"""
from __future__ import annotations

import re
from typing import Optional, Type

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

MAX_SLUG_LENGTH = 200


def slugify(text: str) -> str:
    slug = re.sub(r"[\W_]+", "-", (text or "").lower()).strip("-")
    return slug[:MAX_SLUG_LENGTH] or "item"


async def unique_slug(
    db: AsyncSession,
    model: Type,
    base: str,
    exclude_id: Optional[int] = None,
) -> str:
    """Return `base`, or `base-2`, `base-3`... if it is already taken."""
    base = slugify(base)
    candidate = base
    suffix = 2

    while True:
        stmt = select(model.id).where(model.slug == candidate)
        if exclude_id is not None:
            stmt = stmt.where(model.id != exclude_id)
        if (await db.execute(stmt)).first() is None:
            return candidate
        candidate = f"{base}-{suffix}"
        suffix += 1


async def slug_is_taken(
    db: AsyncSession,
    model: Type,
    slug: str,
    exclude_id: Optional[int] = None,
) -> bool:
    stmt = select(model.id).where(model.slug == slug)
    if exclude_id is not None:
        stmt = stmt.where(model.id != exclude_id)
    return (await db.execute(stmt)).first() is not None
