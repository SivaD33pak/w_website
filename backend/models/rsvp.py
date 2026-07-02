from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------


class InvitationVerificationRequest(BaseModel):
    """Incoming payload for POST /api/verify."""

    invitation_code: str = Field(
        ...,
        alias="invitationCode",
        min_length=2,
        max_length=64,
    )

    model_config = ConfigDict(populate_by_name=True)


class RSVPRequest(BaseModel):
    """Incoming payload for POST /api/rsvp."""

    invitation_code: str = Field(
        ...,
        alias="invitationCode",
        min_length=2,
        max_length=64,
    )
    guest_name: str = Field(
        ...,
        alias="guestName",
        min_length=2,
        max_length=120,
    )
    coming: bool
    adults: int = Field(..., ge=0, le=20)
    children: int = Field(default=0, ge=0, le=20)
    food_preference: str | None = Field(
        None,
        alias="foodPreference",
        max_length=80,
    )
    message: str | None = Field(None, max_length=1000)

    model_config = ConfigDict(populate_by_name=True)


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------


class InvitationVerificationResponse(BaseModel):
    """Response for POST /api/verify."""

    valid: bool
    guest_id: str | None = Field(None, alias="guestId")
    guest_name: str | None = Field(None, alias="guestName")
    message: str

    model_config = ConfigDict(by_alias=True, populate_by_name=True)


class RSVPResponse(BaseModel):
    """Response for POST /api/rsvp."""

    saved: bool
    guest_id: str | None = Field(None, alias="guestId")
    guest_name: str | None = Field(None, alias="guestName")
    message: str

    model_config = ConfigDict(by_alias=True, populate_by_name=True)
