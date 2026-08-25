"""Timezone-aware timestamps.

The stdlib naive-UTC helper is deprecated from Python 3.12 and returns a naive
datetime, which silently compares wrong against aware values. Everything in this
codebase uses now_utc() instead.
"""
from __future__ import annotations

from datetime import datetime, timezone


def now_utc() -> datetime:
    return datetime.now(timezone.utc)
