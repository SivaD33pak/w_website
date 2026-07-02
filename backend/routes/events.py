from fastapi import APIRouter

from models.events import EventResponse
from services import get_excel_manager

router = APIRouter()


@router.get("/events", response_model=list[EventResponse])
def list_events() -> list[EventResponse]:
    """Return all wedding events from the database."""
    excel = get_excel_manager()
    rows = excel.get_events()
    return [
        EventResponse(
            event_id=r["EventID"],
            event_name=r["EventName"],
            date=r["Date"],
            time=r["Time"],
            venue=r["Venue"],
        )
        for r in rows
    ]
