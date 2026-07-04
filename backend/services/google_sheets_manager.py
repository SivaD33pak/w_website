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
            all_records = self._worksheet.get_all_records()
            updated = False

            # Search for an existing row matching the WhatsApp number.
            # The header in the sheet must match the column name exactly.
            whatsapp_col = "WhatsappNumber"
            for idx, record in enumerate(all_records, start=2):  # 1-indexed, row 1 is header
                existing = str(record.get(whatsapp_col, "")).strip()
                if _normalize_whatsapp(existing) == whatsapp_number:
                    # Update the existing row.
                    for col_offset, value in enumerate(row_values):
                        self._worksheet.update_cell(idx, col_offset + 1, value)
                    updated = True
                    break

            if not updated:
                self._worksheet.append_row(row_values)

        action = "updated" if updated else "saved"
        logger.info(
            "RSVP %s for %s (%s)", action, whatsapp_number, data.full_name
        )

        return {
            "saved": True,
            "guest_name": data.full_name,
            "message": f"RSVP {action} successfully. Thank you, {data.full_name}!",
        }


def _normalize_whatsapp(number: str) -> str:
    """Normalize a WhatsApp number to the ``+91XXXXXXXXXX`` form."""
    digits = "".join(ch for ch in number if ch.isdigit())
    tail = digits[-10:] if len(digits) >= 10 else digits
    return f"+91{tail}"
