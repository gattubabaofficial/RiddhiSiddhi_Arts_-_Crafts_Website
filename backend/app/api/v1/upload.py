"""Authenticated file upload.

This endpoint writes attacker-controlled bytes to disk and serves them back over
HTTP, so it validates on four axes: caller identity, extension, declared media
type vs. actual magic bytes, and size. Filenames are always regenerated -- the
client-supplied name is never used to build a path.
"""
from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.v1.auth import get_current_admin
from app.core.config import settings
from app.models.admin import AdminUser

router = APIRouter(prefix="/upload", tags=["File Uploads"])

CHUNK_SIZE = 1024 * 1024
HTTP_413_CONTENT_TOO_LARGE = 413

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv", ".m4v", ".avi"}
DOCUMENT_EXTENSIONS = {".pdf"}

ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS | DOCUMENT_EXTENSIONS

# Leading bytes that must be present for formats with a stable signature. A
# browser can claim any content type, so this is the check that actually holds.
MAGIC_SIGNATURES: Dict[str, Tuple[bytes, ...]] = {
    ".png": (b"\x89PNG\r\n\x1a\n",),
    ".jpg": (b"\xff\xd8\xff",),
    ".jpeg": (b"\xff\xd8\xff",),
    ".gif": (b"GIF87a", b"GIF89a"),
    ".webp": (b"RIFF",),
    ".pdf": (b"%PDF-",),
}


def _expected_type_prefix(ext: str) -> Optional[str]:
    if ext in IMAGE_EXTENSIONS:
        return "image/"
    if ext in VIDEO_EXTENSIONS:
        return "video/"
    if ext in DOCUMENT_EXTENSIONS:
        return "application/pdf"
    return None


def _reject(detail: str, code: int = status.HTTP_400_BAD_REQUEST) -> HTTPException:
    return HTTPException(status_code=code, detail=detail)


def _validate_extension(filename: Optional[str]) -> str:
    ext = os.path.splitext(filename or "")[1].lower()
    if not ext:
        raise _reject("File must have an extension.")
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise _reject(f"File extension '{ext}' is not allowed. Allowed: {allowed}")
    return ext


def _validate_declared_type(ext: str, content_type: Optional[str]) -> None:
    expected = _expected_type_prefix(ext)
    declared = (content_type or "").split(";")[0].strip().lower()
    if expected is None or not declared:
        return
    if declared == "application/octet-stream":
        return  # Generic; the magic-byte check below still applies.
    if not declared.startswith(expected):
        raise _reject(
            f"Declared content type '{declared}' does not match a '{ext}' file."
        )


def _validate_signature(ext: str, header: bytes) -> None:
    signatures = MAGIC_SIGNATURES.get(ext)
    if not signatures:
        return  # Container formats without a single reliable prefix.
    if not any(header.startswith(sig) for sig in signatures):
        raise _reject(f"File contents do not look like a valid '{ext}' file.")


async def _store(file: UploadFile, upload_dir: Path, max_bytes: int) -> str:
    ext = _validate_extension(file.filename)
    _validate_declared_type(ext, file.content_type)

    # The stored name is generated, so a client filename of "../../evil.png"
    # cannot influence the destination path.
    destination = upload_dir / f"{uuid.uuid4().hex}{ext}"
    written = 0
    inspected_header = False

    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE):
                if not inspected_header:
                    _validate_signature(ext, chunk[:16])
                    inspected_header = True

                written += len(chunk)
                if written > max_bytes:
                    raise _reject(
                        f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB limit.",
                        HTTP_413_CONTENT_TOO_LARGE,
                    )
                buffer.write(chunk)

        if written == 0:
            raise _reject("File is empty.")
    except BaseException:
        destination.unlink(missing_ok=True)
        raise

    return f"/static/uploads/{destination.name}"


@router.post("", response_model=List[str])
async def upload_files(
    files: List[UploadFile] = File(...),
    admin: AdminUser = Depends(get_current_admin),
):
    upload_dir = settings.upload_path
    upload_dir.mkdir(parents=True, exist_ok=True)
    max_bytes = settings.max_upload_bytes

    saved: List[str] = []
    try:
        for file in files:
            saved.append(await _store(file, upload_dir, max_bytes))
    except BaseException:
        # Keep a rejected batch all-or-nothing rather than leaving orphans.
        for url in saved:
            (upload_dir / url.rsplit("/", 1)[1]).unlink(missing_ok=True)
        raise

    return saved
