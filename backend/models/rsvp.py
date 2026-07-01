from pydantic import BaseModel, Field


class InvitationVerificationRequest(BaseModel):
    invitation_code: str = Field(..., min_length=2, max_length=64)


class RSVPRequest(BaseModel):
    invitation_code: str = Field(..., min_length=2, max_length=64)
    guest_name: str = Field(..., min_length=2, max_length=120)
    coming: bool
    adults: int = Field(..., ge=0, le=20)
    children: int = Field(default=0, ge=0, le=20)
    food_preference: str | None = Field(default=None, max_length=80)
    message: str | None = Field(default=None, max_length=1000)
