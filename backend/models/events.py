from pydantic import BaseModel, ConfigDict, Field


class EventResponse(BaseModel):
    """Response model for GET /api/events."""

    event_id: str = Field(..., alias="eventId")
    event_name: str = Field(..., alias="eventName")
    date: str
    time: str
    venue: str

    model_config = ConfigDict(by_alias=True, populate_by_name=True)
