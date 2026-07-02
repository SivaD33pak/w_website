from fastapi import APIRouter, HTTPException

from models.rsvp import (
    InvitationVerificationRequest,
    InvitationVerificationResponse,
    RSVPRequest,
    RSVPResponse,
)
from services import get_excel_manager

router = APIRouter()


@router.post(
    "/verify",
    response_model=InvitationVerificationResponse,
)
def verify_invitation(
    payload: InvitationVerificationRequest,
) -> InvitationVerificationResponse:
    """Validate an invitation code against the guest list."""
    excel = get_excel_manager()
    result = excel.verify_invitation(payload.invitation_code)
    return InvitationVerificationResponse(**result)


@router.post(
    "/rsvp",
    response_model=RSVPResponse,
)
def submit_rsvp(payload: RSVPRequest) -> RSVPResponse:
    """Submit or update an RSVP entry."""
    excel = get_excel_manager()

    # Validate the invitation code first.
    guest = excel.get_guest_by_code(payload.invitation_code)
    if guest is None:
        return RSVPResponse(
            saved=False,
            guest_id=None,
            guest_name=payload.guest_name,
            message="Invitation code not found. Cannot save RSVP.",
        )

    result = excel.save_rsvp(payload)
    return RSVPResponse(**result)
