from fastapi import APIRouter

from services.wedding_data import get_gallery

router = APIRouter()


@router.get("/gallery")
def list_gallery() -> list[dict[str, str]]:
    return get_gallery()
