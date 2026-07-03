"""Lazy singletons for service managers.

Routes import the getter functions — never create their own instances.
"""

from services.excel_manager import ExcelManager
from services.google_sheets_manager import GoogleSheetsManager

_excel_instance: ExcelManager | None = None
_sheets_instance: GoogleSheetsManager | None = None


def get_excel_manager() -> ExcelManager:
    """Return the module-level ExcelManager singleton (read-only)."""
    global _excel_instance
    if _excel_instance is None:
        _excel_instance = ExcelManager()
    return _excel_instance


def get_google_sheets_manager() -> GoogleSheetsManager:
    """Return the module-level GoogleSheetsManager singleton."""
    global _sheets_instance
    if _sheets_instance is None:
        _sheets_instance = GoogleSheetsManager()
    return _sheets_instance
