# api-backend/app/schemas/categoria_schema.py
"""
=============================================================================
ESQUEMAS PYDANTIC V2: CATEGORÍAS PRINCIPALES DEL CATÁLOGO
=============================================================================
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CategoriaBaseSchema(BaseModel):
    cat_nombre: str = Field(..., min_length=2, max_length=100, description="Nombre de la categoría")
    cat_descripcion: Optional[str] = Field(default=None, description="Descripción opcional")


class CategoriaCreateSchema(CategoriaBaseSchema):
    pass


class CategoriaResponseSchema(CategoriaBaseSchema):
    cat_id: int = Field(..., description="ID único de la categoría")

    model_config = ConfigDict(from_attributes=True)