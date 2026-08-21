from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.products import router as products_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.enquiries import router as enquiries_router
from app.api.v1.reels import router as reels_router
from app.api.v1.banners import router as banners_router
from app.api.v1.content import router as content_router
from app.api.v1.settings import router as settings_router
from app.api.v1.upload import router as upload_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(categories_router)
api_router.include_router(products_router)
api_router.include_router(reviews_router)
api_router.include_router(enquiries_router)
api_router.include_router(reels_router)
api_router.include_router(banners_router)
api_router.include_router(content_router)
api_router.include_router(settings_router)
api_router.include_router(upload_router)
