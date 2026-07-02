"""Lazy singleton for ExcelManager.

Routes import ``get_excel_manager()`` — never create their own instance.
"""

from services.excel_manager import ExcelManager

_instance: ExcelManager | None = None


def get_excel_manager() -> ExcelManager:
    """Return the module-level ExcelManager singleton."""
    global _instance
    if _instance is None:
        _instance = ExcelManager()
    return _instance
