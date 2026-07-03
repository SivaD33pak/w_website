from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------


class RSVPRequest(BaseModel):
    """Incoming payload for POST /api/rsvp.

    The invitation-code verification step was removed, so every field below is
    mandatory and there is no guest lookup before saving. Duplicates are
    handled by matching on the WhatsApp number in the Excel service.
    """

    full_name: str = Field(
        ...,
        alias="fullName",
        min_length=2,
        max_length=120,
    )
    place: str = Field(..., min_length=1, max_length=120)
    whatsapp_number: str = Field(
        ...,
        alias="whatsappNumber",
        min_length=10,
        max_length=15,
        description="Full E.164-style number, e.g. +919876543210.",
    )
    side: Literal["bride", "groom"]
    relation: Literal["friend", "family"]
    coming: bool
    guests: int = Field(default=1, ge=0, le=20)

    model_config = ConfigDict(populate_by_name=True)


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------


class RSVPResponse(BaseModel):
    """Response for POST /api/rsvp."""

    saved: bool
    guest_name: str | None = Field(None, alias="guestName")
    message: str

    model_config = ConfigDict(by_alias=True, populate_by_name=True)
