from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from typing import List
import os
import uuid
import shutil
from app.core.config import settings
from app.models.admin import AdminUser
from app.api.v1.auth import get_current_admin

router = APIRouter(prefix="/upload", tags=["File Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".pdf"}

@router.post("", response_model=List[str])
async def upload_files(
    files: List[UploadFile] = File(...)
):
    saved_urls = []
    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension '{ext}' not allowed."
            )
        
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        saved_urls.append(f"/static/uploads/{filename}")
    
    return saved_urls
