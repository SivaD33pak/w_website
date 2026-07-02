"""ExcelManager — the single source of truth for all .xlsx operations.

All API routes go through this service.  Swapping Excel for PostgreSQL / MySQL
later only requires rewriting this file; the route layer stays unchanged.
"""

from __future__ import annotations

import logging
from datetime import datetime
from pathlib import Path
from threading import Lock
from typing import Any

from models.rsvp import RSVPRequest
from openpyxl import load_workbook

logger = logging.getLogger(__name__)

WORKBOOK_PATH = Path(__file__).resolve().parents[1] / "excel" / "wedding_database.xlsx"

# Column name → index mappings (0-based) for each sheet.
# These are read from the first header row so they stay in sync with the file.
_EVENT_COLUMNS = ["EventID", "EventName", "Date", "Time", "Venue"]
_GALLERY_COLUMNS = ["ImageID", "Title", "ImagePath"]
_GUEST_COLUMNS = ["GuestID", "Name", "Phone", "Family", "InvitationCode", "Status"]
_RSVP_COLUMNS = [
    "GuestID",
    "Coming",
    "Adults",
    "Children",
    "FoodPreference",
    "Message",
    "SubmittedAt",
]


class ExcelManager:
    """Encapsulates all read / write access to ``wedding_database.xlsx``.

    Read operations work on an in-memory cache loaded once at startup.
    Write operations acquire a thread lock, reload the file fresh,
    mutate the appropriate sheet, and persist immediately.
    """

    def __init__(self, workbook_path: Path = WORKBOOK_PATH) -> None:
        self.workbook_path = workbook_path
        self._lock = Lock()

        if not workbook_path.exists():
            raise FileNotFoundError(
                f"Excel workbook not found at {workbook_path}"
            )

        # Pre-load sheet caches for fast reads.
        self._events_cache: list[dict[str, str]] = []
        self._gallery_cache: list[dict[str, str]] = []
        self._guests_cache: list[dict[str, str]] = []
        self._rsvp_cache: list[dict[str, str]] = []
        self._load_caches()

        logger.info(
            "ExcelManager initialised — %d events, %d gallery images, "
            "%d guests, %d RSVPs",
            len(self._events_cache),
            len(self._gallery_cache),
            len(self._guests_cache),
            len(self._rsvp_cache),
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_caches(self) -> None:
        """Read every sheet into an in-memory list of row-dicts."""
        wb = load_workbook(self.workbook_path, read_only=True, data_only=True)

        self._events_cache = self._sheet_to_dicts(wb["Events"], _EVENT_COLUMNS)
        self._gallery_cache = self._sheet_to_dicts(wb["Gallery"], _GALLERY_COLUMNS)
        self._guests_cache = self._sheet_to_dicts(wb["Guests"], _GUEST_COLUMNS)
        self._rsvp_cache = self._sheet_to_dicts(wb["RSVP"], _RSVP_COLUMNS)

        wb.close()

    @staticmethod
    def _sheet_to_dicts(
        sheet: Any,
        columns: list[str],
    ) -> list[dict[str, str]]:
        """Convert an openpyxl sheet (with header row) to a list of dicts.

        Empty rows (where the first column is ``None``) are skipped.
        ``datetime`` values are converted to ``YYYY-MM-DD`` strings.
        """
        rows: list[dict[str, str]] = []
        header_passed = False
        for row in sheet.iter_rows(values_only=True):
            if not header_passed:
                header_passed = True
                continue  # skip the header row
            # Skip entirely empty rows.
            if row[0] is None:
                continue
            row_dict: dict[str, str] = {}
            for idx, col_name in enumerate(columns):
                value = row[idx] if idx < len(row) else None
                if isinstance(value, datetime):
                    value = value.strftime("%Y-%m-%d")
                row_dict[col_name] = str(value) if value is not None else ""
            rows.append(row_dict)
        return rows

    def _reload_write_workbook(self) -> Any:
        """Open a writable copy of the workbook (called inside the lock)."""
        return load_workbook(self.workbook_path)

    # ------------------------------------------------------------------
    # READ methods — fast, no lock needed
    # ------------------------------------------------------------------

    def get_events(self) -> list[dict[str, str]]:
        """Return all rows from the Events sheet."""
        return list(self._events_cache)

    def get_gallery(self) -> list[dict[str, str]]:
        """Return all rows from the Gallery sheet."""
        return list(self._gallery_cache)

    def get_guest_by_code(self, invitation_code: str) -> dict[str, str] | None:
        """Look up a guest by their InvitationCode (case-insensitive)."""
        code_lower = invitation_code.strip().lower()
        for guest in self._guests_cache:
            if guest.get("InvitationCode", "").strip().lower() == code_lower:
                return guest
        return None

    # ------------------------------------------------------------------
    # WRITE methods — thread-safe via self._lock
    # ------------------------------------------------------------------

    def verify_invitation(self, invitation_code: str) -> dict[str, Any]:
        """Validate an invitation code against the Guests sheet.

        Returns a dict suitable for building an
        ``InvitationVerificationResponse``.
        """
        guest = self.get_guest_by_code(invitation_code)
        if guest is None:
            return {
                "valid": False,
                "guest_id": None,
                "guest_name": None,
                "message": "Invitation code not found. Please check and try again.",
            }

        return {
            "valid": True,
            "guest_id": guest["GuestID"],
            "guest_name": guest["Name"],
            "message": f"Welcome, {guest['Name']}! Your invitation is valid.",
        }

    def save_rsvp(self, data: RSVPRequest) -> dict[str, Any]:
        """Persist (or update) an RSVP in the RSVP sheet.

        Acquires the thread lock, reloads the workbook fresh, checks for
        an existing RSVP for the same GuestID, and either updates or appends.
        """
        guest = self.get_guest_by_code(data.invitation_code)
        if guest is None:
            return {
                "saved": False,
                "guest_id": None,
                "guest_name": data.guest_name,
                "message": "Invitation code not found. Cannot save RSVP.",
            }

        guest_id = guest["GuestID"]
        timestamp = datetime.now().isoformat()

        with self._lock:
            wb = self._reload_write_workbook()
            ws = wb["RSVP"]

            # Determine column indices from the header row.
            header = [cell.value for cell in ws[1]]
            col_index = {name: idx for idx, name in enumerate(header) if name}

            # Build the new row values.
            new_values = {
                "GuestID": guest_id,
                "Coming": "Yes" if data.coming else "No",
                "Adults": str(data.adults),
                "Children": str(data.children),
                "FoodPreference": data.food_preference or "",
                "Message": data.message or "",
                "SubmittedAt": timestamp,
            }

            # Check for an existing RSVP row to update.
            guest_id_col = col_index.get("GuestID")
            updated = False
            if guest_id_col is not None:
                for row in ws.iter_rows(min_row=2):
                    if (
                        row[guest_id_col].value is not None
                        and str(row[guest_id_col].value).strip() == guest_id
                    ):
                        for col_name, value in new_values.items():
                            if col_name in col_index:
                                row[col_index[col_name]].value = value
                        updated = True
                        break

            # No existing row — write at the first truly empty row.
            # We can't rely on ws.append() / ws.max_row because the sheet may
            # contain trailing phantom rows left by earlier edits. Scan from
            # row 2 downward and write into the first row whose GuestID cell
            # is empty.
            if not updated:
                new_row = [new_values.get(c, "") for c in _RSVP_COLUMNS]
                target_row_idx = None
                for row_idx in range(2, ws.max_row + 1):
                    if ws.cell(row=row_idx, column=guest_id_col + 1).value in (None, ""):
                        target_row_idx = row_idx
                        break
                if target_row_idx is None:
                    # All existing rows are full — append at the very end.
                    target_row_idx = ws.max_row + 1

                for col_offset, value in enumerate(new_row):
                    ws.cell(
                        row=target_row_idx,
                        column=col_offset + 1,
                        value=value,
                    )

            wb.save(self.workbook_path)
            wb.close()

        # Refresh the in-memory RSVP cache so subsequent reads are accurate.
        self._rsvp_cache = self._sheet_to_dicts(
            load_workbook(self.workbook_path, read_only=True, data_only=True)["RSVP"],
            _RSVP_COLUMNS,
        )

        action = "updated" if updated else "saved"
        logger.info("RSVP %s for GuestID=%s (%s)", action, guest_id, data.guest_name)

        return {
            "saved": True,
            "guest_id": guest_id,
            "guest_name": data.guest_name,
            "message": f"RSVP {action} successfully. Thank you, {data.guest_name}!",
        }
