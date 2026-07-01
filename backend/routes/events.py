from fastapi import APIRouter

from services.wedding_data import get_events

router = APIRouter()


@router.get("/events")
def list_events() -> list[dict[str, str]]:
    return get_events()
