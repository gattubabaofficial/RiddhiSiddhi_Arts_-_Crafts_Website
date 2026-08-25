"""In-process sliding-window rate limiting for anonymous write endpoints.

Deliberately dependency-free. State lives in this process, so behind more than
one worker the effective limit is per worker -- adequate for spam control on a
single-instance catalogue site. Move to Redis if the deployment is scaled out.
"""
from __future__ import annotations

import time
from collections import defaultdict, deque
from threading import Lock
from typing import Deque, Dict

from fastapi import HTTPException, Request, status

_hits: Dict[str, Deque[float]] = defaultdict(deque)
_lock = Lock()


def reset_rate_limits() -> None:
    """Drop all recorded hits. Used by tests to isolate cases."""
    with _lock:
        _hits.clear()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class RateLimiter:
    """FastAPI dependency: allows `max_requests` per `window_seconds` per IP."""

    def __init__(self, scope: str, max_requests: int, window_seconds: int):
        self.scope = scope
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def __call__(self, request: Request) -> None:
        key = f"{self.scope}:{_client_ip(request)}"
        now = time.monotonic()
        cutoff = now - self.window_seconds

        with _lock:
            bucket = _hits[key]
            while bucket and bucket[0] < cutoff:
                bucket.popleft()

            if len(bucket) >= self.max_requests:
                retry_after = max(1, int(bucket[0] + self.window_seconds - now))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=(
                        "Too many submissions from this address. "
                        f"Please try again in {retry_after} seconds."
                    ),
                    headers={"Retry-After": str(retry_after)},
                )

            bucket.append(now)
