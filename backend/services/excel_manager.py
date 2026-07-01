from pathlib import Path
from threading import Lock

WORKBOOK_PATH = Path(__file__).resolve().parents[1] / "excel" / "wedding_database.xlsx"


class ExcelManager:
    def __init__(self, workbook_path: Path = WORKBOOK_PATH) -> None:
        self.workbook_path = workbook_path
        self._lock = Lock()

    def verify_invitation(self, invitation_code: str) -> dict[str, object]:
        with self._lock:
            return {
                "valid": False,
                "invitationCode": invitation_code,
                "message": "Excel lookup is not implemented yet.",
            }

    def save_rsvp(self, data: dict[str, object]) -> dict[str, object]:
        with self._lock:
            return {
                "saved": False,
                "message": "Excel write is not implemented yet.",
                "data": data,
            }
