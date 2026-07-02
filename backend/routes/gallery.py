from fastapi import APIRouter

from models.gallery import GalleryImageResponse
from services import get_excel_manager

router = APIRouter()


@router.get("/gallery", response_model=list[GalleryImageResponse])
def list_gallery() -> list[GalleryImageResponse]:
    """Return all gallery images from the database."""
    excel = get_excel_manager()
    rows = excel.get_gallery()
    return [
        GalleryImageResponse(
            image_id=r["ImageID"],
            title=r["Title"],
            image_path=r["ImagePath"],
        )
        for r in rows
    ]
