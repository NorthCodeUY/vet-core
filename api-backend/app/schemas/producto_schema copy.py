# api-backend/app/schemas/producto_schema.py
"""
=============================================================================
ESQUEMAS PYDANTIC V2: PRODUCTOS, VARIANTES Y CATÁLOGO AGRUPADO
=============================================================================
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
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
    var_tipo: str = Field(..., description="Talle, Volumen, Peso, etc.")
    var_nombre: str = Field(..., description="Ej: S, M, XL, 250ml")
    
    # Campo con precio absoluto de venta
    var_precio_venta: float = Field(default=0.0, description="Precio final de la presentación")
    var_precio_costo: Optional[float] = Field(default=None, description="Costo de compra")
    var_stock: int = Field(default=0)
    var_stock_minimo: Optional[int] = None
    
    var_sku: Optional[str] = Field(default=None, alias="val_sku")
    var_codigo_barra: Optional[str] = None
    
    # Flags operativos
    var_activo: bool = True
    var_visible: bool = True
    var_disponible: bool = True
    var_permitir_sin_stock: bool = False
    
    color: Optional[ColorResponseSchema] = Field(default=None, alias="rel_color")



    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 2. ENLACE A SUBCATEGORÍA (TABLA INTERMEDIA)
# =============================================================================
class ProductoSubcategoriaResponseSchema(BaseModel):
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
    
    # Mapea prod_precio_venta de la BD y permite que el JSON emita ambos para el frontend
    prod_precio_venta: float = Field(default=0.0, description="Precio base de venta")    
    prod_precio_costo: Optional[float] = None
    prod_solo_variantes: bool = False
    prod_disponible: bool = True
    prod_visible: bool = True
    prod_per_sin_stock: bool = False
    
    prod_stock: Optional[int] = Field(default=0, description="Stock físico")
    prod_stock_minimo: Optional[int] = None
    cat_id: int = Field(..., description="ID de la categoría principal")
    
    # Variantes físicas y subcategorías
    variantes: List[VarianteResponseSchema] = Field(default_factory=list, alias="rel_variantes")
    subcategorias: List[ProductoSubcategoriaResponseSchema] = Field(default_factory=list, alias="rel_subcategoria")
    # <!> aca falta agegar la relacion de  imagenURL 
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

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