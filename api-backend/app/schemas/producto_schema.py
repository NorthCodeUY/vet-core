# api-backend/app/schemas/producto_schema.py
"""
=============================================================================
ESQUEMAS DE VALIDACIÓN Y SERIALIZACIÓN (PYDANTIC V2) - PRODUCTOS Y CATÁLOGO
=============================================================================
Define los contratos de datos (DTOs) que viajan entre la base de datos,
la API FastAPI y las aplicaciones clientes (Frontend/Mobile).
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


# =============================================================================
# 1. ESQUEMA DE COLOR
# =============================================================================
class ColorResponseSchema(BaseModel):
    """Representa el color asignado a una variante física."""
    col_id: int = Field(..., description="ID único del color")
    col_nombre: str = Field(..., description="Nombre comercial del color (ej: 'Azul Marino')")
    col_hex: str = Field(..., description="Código HEX para renderizado visual en frontend (ej: '#000080')")

    # Permite mapear directamente atributos de objetos SQLAlchemy ORM
    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# 2. ESQUEMA DE VARIANTE (SKU)
# =============================================================================
class VarianteResponseSchema(BaseModel):
    """Representa una presentación específica (Talle, Medida, Volumen) con su propio stock."""
    var_id: int = Field(..., description="ID único de la variante física")
    prod_id: int = Field(..., description="ID del producto padre")
    var_tipo: str = Field(..., description="Clasificación ('Talle', 'Volumen', 'Medida')")
    var_nombre: str = Field(..., description="Valor visible (ej: 'XL', '500 ml')")
    var_precio_adicional: float = Field(default=0.0, description="Diferencial de precio sobre el base")
    var_stock: int = Field(default=0, description="Existencias disponibles de esta variante")
    sku: Optional[str] = Field(default=None, description="Código de barras único")
    
    # Resuelve la relación ORM 'rel_color' y la expone como 'color' en el JSON
    color: Optional[ColorResponseSchema] = Field(default=None, alias="rel_color")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 3. ESQUEMA PRINCIPAL DE PRODUCTO
# =============================================================================
class ProductoResponseSchema(BaseModel):
    """Contrato base de un producto expuesto al catálogo."""
    prod_id: int = Field(..., description="ID del producto")
    prod_nombre: str = Field(..., description="Nombre comercial del producto")
    prod_descripcion: Optional[str] = Field(default=None, description="Descripción detallada")
    prod_precio: float = Field(..., description="Precio base del producto")
    prod_stock: int = Field(..., description="Stock general (usado si el producto no tiene variantes)")
    cat_id: int = Field(..., description="ID de la categoría principal")
    
    # Resuelve la relación ORM 'rel_variantes' y la expone como 'variantes'
    variantes: List[VarianteResponseSchema] = Field(
        default_factory=list, 
        alias="rel_variantes",
        description="Lista de talles/medidas disponibles. Si no tiene, se emite vacía ([])"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# Alias de compatibilidad por si algún router antiguo importa 'ProductoSchema'
ProductoSchema = ProductoResponseSchema


# =============================================================================
# 4. ESQUEMA AGRUPADO POR CATEGORÍAS (LANDING PAGE)
# =============================================================================
class ProdCatAgrupadaSchema(BaseModel):
    """
    Estructura jerárquica para la Landing Page:
    Agrupa los productos directamente dentro de su categoría correspondiente.
    """
    cat_id: int = Field(..., description="ID único de la categoría")
    cat_nombre: str = Field(..., description="Nombre de la categoría (ej: 'Alimentos', 'Ropa')")
    productos: List[ProductoResponseSchema] = Field(
        default_factory=list,
        description="Colección de productos que pertenecen a esta categoría"
    )

    model_config = ConfigDict(from_attributes=True)