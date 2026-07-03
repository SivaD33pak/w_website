from fastapi import APIRouter

from models.rsvp import RSVPRequest, RSVPResponse
from services import get_google_sheets_manager

router = APIRouter()


@router.post(
    "/rsvp",
    response_model=RSVPResponse,
)
def submit_rsvp(payload: RSVPRequest) -> RSVPResponse:
    """Submit or update an RSVP entry.

    Saves to Google Sheets. Duplicates are handled by matching on the
    WhatsApp number.
    """
    sheets = get_google_sheets_manager()
    result = sheets.save_rsvp(payload)
    return RSVPResponse(**result)
