from pydantic import BaseModel, ConfigDict, Field


class GalleryImageResponse(BaseModel):
    """Response model for GET /api/gallery."""

    image_id: str = Field(..., alias="imageId")
    title: str
    image_path: str = Field(..., alias="imagePath")

    model_config = ConfigDict(by_alias=True, populate_by_name=True)
