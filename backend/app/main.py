import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError

from app.api.router import api_router
from app.core.config import settings
from app.core.database import init_db

logger = logging.getLogger("uvicorn")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    await init_db()
    
    # Auto-seed initial catalog, categories, and superadmin if database is fresh/empty
    try:
        from app.core.database import AsyncSessionLocal
        from app.models import Category
        from sqlalchemy import select
        from seed import seed_data
        async with AsyncSessionLocal() as session:
            res = await session.execute(select(Category))
            if not res.scalars().first():
                logger.info("Empty database detected on startup. Auto-seeding default catalog...")
                await seed_data()
    except Exception as e:
        logger.warning("Auto-seed on startup skipped/failed: %s", e)

    logger.info("Started in %s mode", settings.ENVIRONMENT)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend API for Riddhi Siddhi Arts & Crafts Jaipur",
    lifespan=lifespan,
    # Interactive docs expose every admin route; keep them off in production.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

# Credentialed CORS must name its origins explicitly. A regex such as
# r"https?://.*" combined with allow_credentials=True lets any site on the
# internet call this API with a logged-in admin's browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

settings.upload_path.mkdir(parents=True, exist_ok=True)
app.mount(
    "/static/uploads",
    StaticFiles(directory=settings.upload_path),
    name="uploads",
)

@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    """A uniqueness or foreign-key violation is a client mistake, not a server
    fault; without this it surfaced as an opaque 500."""
    logger.warning("Integrity error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "detail": (
                "That value conflicts with an existing record. Names and slugs "
                "must be unique."
            )
        },
    )


app.include_router(api_router)


@app.get("/")
@app.get("/api/v1")
async def root_status():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "products": "/api/v1/products",
            "categories": "/api/v1/categories",
            "enquiries": "/api/v1/enquiries",
            "reviews": "/api/v1/reviews",
        },
    }


@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
