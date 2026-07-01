from fastapi import APIRouter

from models.rsvp import InvitationVerificationRequest, RSVPRequest

router = APIRouter()


@router.post("/verify")
def verify_invitation(payload: InvitationVerificationRequest) -> dict[str, object]:
    return {
        "valid": False,
        "invitationCode": payload.invitation_code,
        "message": "Invitation verification will be connected to ExcelManager.",
    }


@router.post("/rsvp")
def submit_rsvp(payload: RSVPRequest) -> dict[str, object]:
    return {
        "saved": False,
        "guestName": payload.guest_name,
        "message": "RSVP persistence will be connected to ExcelManager.",
    }
