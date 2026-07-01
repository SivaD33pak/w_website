from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.events import router as events_router
from routes.gallery import router as gallery_router
from routes.rsvp import router as rsvp_router

app = FastAPI(title="Wedding Website API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router, prefix="/api", tags=["events"])
app.include_router(gallery_router, prefix="/api", tags=["gallery"])
app.include_router(rsvp_router, prefix="/api", tags=["rsvp"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
