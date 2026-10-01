from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.database import SessionLocal
from backend.app.db.init_db import init_database_tables, seed_demo_data
from backend.app.api.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables & seed initial synthetic demonstration dataset
    init_database_tables()
    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure Predictive Cybercrime Intelligence & Cash-out Forecasting Platform (SIH 2026)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS Configuration
_raw_origins = [str(o).rstrip("/") for o in settings.CORS_ORIGINS]
_has_wildcard = "*" in _raw_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _has_wildcard else _raw_origins,
    allow_credentials=not _has_wildcard,
    allow_origin_regex=r"^https://.*\.vercel\.app$" if not _has_wildcard else None,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {
        "project": "CyberTrace AI",
        "description": "Secure Predictive Cybercrime Intelligence & Cash-out Forecasting Platform",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs",
        "notice": "All demonstration data is synthetic. Consequential decisions must be made by authorized officers.",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "mode": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
