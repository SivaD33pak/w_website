"""GoogleSheetsManager — writes RSVP submissions to a Google Sheet.

Replaces the Excel-based ``save_rsvp`` for production deployments where the
filesystem is read-only or ephemeral (Vercel, Render free tier, etc.).

Authentication uses a Google Cloud **Service Account**. The service account
email must be given Editor access to the target spreadsheet.

Required environment variables (set in Render / .env):
    GOOGLE_SHEETS_CREDENTIALS  — JSON string of the service-account key file.
    GOOGLE_SHEET_ID           — ID of the spreadsheet (from the URL).
"""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime
from threading import Lock
from typing import Any

import gspread
from models.rsvp import RSVPRequest

logger = logging.getLogger(__name__)

# Column order that matches the header row in the Google Sheet.
_RSVP_COLUMNS = [
    "FullName",
    "Place",
    "WhatsappNumber",
    "Side",
    "Relation",
    "Coming",
    "Guests",
    "SubmittedAt",
]


class GoogleSheetsManager:
    """Encapsulates all write access to the RSVP Google Sheet.

    On first use the service-account credentials and sheet ID are read from
    environment variables. All writes go through a thread lock for safety.
    """

    def __init__(self) -> None:
        creds_json = os.environ.get("GOOGLE_SHEETS_CREDENTIALS", "")
        sheet_id = os.environ.get("GOOGLE_SHEET_ID", "")

        if not creds_json or not sheet_id:
            raise RuntimeError(
                "GOOGLE_SHEETS_CREDENTIALS and GOOGLE_SHEET_ID "
                "environment variables are required."
            )

        credentials = json.loads(creds_json)
        self._client = gspread.service_account_from_dict(credentials)
        self._sheet_id = sheet_id
        self._lock = Lock()

        # Open the first worksheet (or the one named "Sheet1").
        spreadsheet = self._client.open_by_key(sheet_id)
        self._worksheet = spreadsheet.sheet1
        self._whatsapp_row_by_number = self._load_whatsapp_index()
        self._next_row = max(self._whatsapp_row_by_number.values(), default=1) + 1

        logger.info(
            "GoogleSheetsManager initialised — sheet: %s (%s)",
            self._worksheet.title,
            sheet_id,
        )

    # ------------------------------------------------------------------
    # WRITE methods — thread-safe via self._lock
    # ------------------------------------------------------------------

    def save_rsvp(self, data: RSVPRequest) -> dict[str, Any]:
        """Persist (or update) an RSVP in the Google Sheet.

        Deduplicates by normalised WhatsApp number: if a row with the same
        number already exists it is updated in-place, otherwise a new row
        is appended.
        """
        whatsapp_number = _normalize_whatsapp(data.whatsapp_number)
        timestamp = datetime.now().isoformat()

        row_values = [
            data.full_name,
            data.place,
            whatsapp_number,
            data.side.capitalize(),
            data.relation.capitalize(),
            "Yes" if data.coming else "No",
            str(data.guests),
            timestamp,
        ]

        with self._lock:
            existing_row = self._whatsapp_row_by_number.get(whatsapp_number)

            if existing_row:
                self._worksheet.update(
                    range_name=f"A{existing_row}:H{existing_row}",
                    values=[row_values],
                    value_input_option="USER_ENTERED",
                )
                updated = True
            else:
                self._worksheet.append_row(
                    row_values,
                    value_input_option="USER_ENTERED",
                )
                self._whatsapp_row_by_number[whatsapp_number] = self._next_row
                self._next_row += 1
                updated = False

        action = "updated" if updated else "saved"
        logger.info(
            "RSVP %s for %s (%s)", action, whatsapp_number, data.full_name
        )

        return {
            "saved": True,
            "guest_name": data.full_name,
            "message": f"RSVP {action} successfully. Thank you, {data.full_name}!",
        }

    def _load_whatsapp_index(self) -> dict[str, int]:
        """Load only the WhatsApp column once so submits avoid full-sheet reads."""
        try:
            header_row = self._worksheet.row_values(1)
            whatsapp_col = header_row.index("WhatsappNumber") + 1
        except ValueError:
            logger.warning(
                "WhatsappNumber header missing; assuming RSVP column order."
            )
            whatsapp_col = _RSVP_COLUMNS.index("WhatsappNumber") + 1

        values = self._worksheet.col_values(whatsapp_col)
        index: dict[str, int] = {}
        for row_number, value in enumerate(values[1:], start=2):
            normalized = _normalize_whatsapp(value)
            if normalized != "+91":
                index[normalized] = row_number
        return index


def _normalize_whatsapp(number: str) -> str:
    """Normalize a WhatsApp number to the ``+91XXXXXXXXXX`` form."""
    digits = "".join(ch for ch in number if ch.isdigit())
    tail = digits[-10:] if len(digits) >= 10 else digits
    return f"+91{tail}"
