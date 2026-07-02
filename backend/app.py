import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.events import router as events_router
from routes.gallery import router as gallery_router
from routes.rsvp import router as rsvp_router
from services import get_excel_manager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)

app = FastAPI(title="Wedding Website API", version="0.2.0")

# ---------------------------------------------------------------------------
# CORS — allow the frontend origin(s).  Defaults to localhost:3000 in dev;
# override via the CORS_ORIGINS env var (comma-separated) in production.
# ---------------------------------------------------------------------------
cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(events_router, prefix="/api", tags=["events"])
app.include_router(gallery_router, prefix="/api", tags=["gallery"])
app.include_router(rsvp_router, prefix="/api", tags=["rsvp"])


# ---------------------------------------------------------------------------
# Startup & health
# ---------------------------------------------------------------------------


@app.on_event("startup")
def on_startup() -> None:
    # Eagerly initialise the ExcelManager singleton so we fail fast if the
    # workbook is missing or corrupt.
    get_excel_manager()
    logging.getLogger(__name__).info(
        "Application started — CORS origins: %s", cors_origins
    )


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
