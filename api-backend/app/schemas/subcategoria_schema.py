# api-backend/app/schemas/subcategoria_schema.py
"""
=============================================================================
ESQUEMAS DE VALIDACIÓN Y SERIALIZACIÓN (PYDANTIC V2) - SUBCATEGORÍAS
=============================================================================
Contratos DTO para la gestión e iconografía agnóstica de subcategorías.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SubcategoriaBaseSchema(BaseModel):
    """Atributos comunes de subcategoría."""
    subc_nombre: str = Field(..., min_length=2, max_length=100, description="Nombre de la subcategoría")
    subc_icono: Optional[str] = Field(
        default=None, 
        max_length=50, 
        description="Identificador del ícono vectorial (ej: 'Scissors', 'Shirt', 'PawPrint')"
    )
    subc_imagen_url: Optional[str] = Field(
        default=None, 
        max_length=255, 
        description="URL pública del asset SVG alojado en Cloudflare R2"
    )


class SubcategoriaCreateSchema(SubcategoriaBaseSchema):
    """Esquema de entrada para inserción de subcategorías."""
    pass


class SubcategoriaUpdateSchema(BaseModel):
    """Esquema de entrada para edición parcial de subcategorías."""
    subc_nombre: Optional[str] = Field(default=None, min_length=2, max_length=100)
    subc_icono: Optional[str] = Field(default=None, max_length=50)
    subc_imagen_url: Optional[str] = Field(default=None, max_length=255)


class SubcategoriaResponseSchema(SubcategoriaBaseSchema):
    """Contrato de salida expuesto hacia el frontend."""
    subc_id: int = Field(..., description="ID único de la subcategoría")

    model_config = ConfigDict(from_attributes=True)