# api-backend/app/schemas/producto_schema.py
"""
=============================================================================
ESQUEMAS PYDANTIC V2: PRODUCTOS, VARIANTES Y CATÁLOGO AGRUPADO
=============================================================================
Orquesta las entidades de catálogo integrando variantes (SKUs), colores
y subcategorías enriquecidas con íconos.
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# Importación desacoplada desde sus propios dominios
from app.schemas.subcategoria_schema import SubcategoriaResponseSchema


# =============================================================================
# 1. ESQUEMAS DE VARIANTES Y COLOR (SKU)
# =============================================================================
class ColorResponseSchema(BaseModel):
    col_id: int = Field(..., description="ID único del color")
    col_nombre: str = Field(..., description="Nombre comercial del color")
    col_hex: str = Field(..., description="Código HEX para renderizado visual (#FFFFFF)")

    model_config = ConfigDict(from_attributes=True)


class VarianteResponseSchema(BaseModel):
    var_id: int = Field(..., description="ID de la variante")
    prod_id: int = Field(..., description="ID del producto padre")
    var_tipo: str = Field(..., description="Clasificación ('Talle', 'Volumen', 'Medida')")
    var_nombre: str = Field(..., description="Nombre visible (ej: 'XL', '500 ml')")
    var_precio_adicional: float = Field(default=0.0, description="Monto extra que suma al precio base")
    var_stock: int = Field(default=0, description="Stock de esta variante específica")
    sku: Optional[str] = Field(default=None, description="Código de barras único")
    color: Optional[ColorResponseSchema] = Field(default=None, alias="rel_color")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 2. ENLACE A SUBCATEGORÍA (TABLA INTERMEDIA)
# =============================================================================
class ProductoSubcategoriaResponseSchema(BaseModel):
    """Mapea la relación M:N con subcategoría y su ícono/URL resuelto."""
    subc_id: int
    subcategoria: Optional[SubcategoriaResponseSchema] = Field(default=None, alias="rel_subcategoria")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 3. ESQUEMA PRINCIPAL DE PRODUCTO
# =============================================================================
class ProductoResponseSchema(BaseModel):
    prod_id: int = Field(..., description="ID del producto")
    prod_nombre: str = Field(..., description="Nombre comercial del producto")
    prod_descripcion: Optional[str] = Field(default=None, description="Descripción detallada")
    prod_precio: float = Field(..., description="Precio base")
    prod_disponible: bool = Field(..., description="Producto disponible: True si el producto está disponible, False si no lo está.")
    prod_stock: Optional[int] = Field(
        default=0, 
        description="Stock general (0 si no tiene existencias o si es nulo)"
    )
    cat_id: int = Field(..., description="ID de la categoría principal")
    
    # Variantes físicas (Talles / Medidas)
    variantes: List[VarianteResponseSchema] = Field(
        default_factory=list, 
        alias="rel_variantes",
        description="Lista de talles/medidas disponibles"
    )
    
    # Subcategorías asignadas con soporte de íconos/SVG
    subcategorias: List[ProductoSubcategoriaResponseSchema] = Field(
        default_factory=list,
        alias="rel_subcategoria",
        description="Subcategorías asignadas al producto"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# Alias de compatibilidad hacia atrás
ProductoSchema = ProductoResponseSchema


# =============================================================================
# 4. ESQUEMA JERÁRQUICO PARA LANDING PAGE
# =============================================================================
class ProdCatAgrupadaSchema(BaseModel):
    cat_id: int = Field(..., description="ID de la categoría")
    cat_nombre: str = Field(..., description="Nombre de la categoría")
    productos: List[ProductoResponseSchema] = Field(
        default_factory=list,
        description="Productos pertenecientes a esta categoría"
    )

    model_config = ConfigDict(from_attributes=True)