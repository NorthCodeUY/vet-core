# api-backend/app/schemas/producto_schema.py






"""
=============================================================================
ESQUEMAS PYDANTIC V2: PRODUCTOS, VARIANTES Y CATÁLOGO AGRUPADO
=============================================================================
Orquesta las entidades de catálogo integrando variantes (SKUs), colores,
imágenes multimedia y subcategorías enriquecidas con íconos vectoriales.
"""
# api-backend/app/schemas/producto_schema.py
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field


class VarianteBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    var_nombre: str
    var_tipo: str = "Presentación"
    val_sku: Optional[str] = Field(default=None, alias="var_sku")
    var_codigo_barra: Optional[str] = None
    var_precio_venta: float = 0.0
    var_precio_costo: Optional[float] = None
    var_stock: int = 0
    var_stock_minimo: Optional[int] = None
    var_activo: bool = True
    var_visible: bool = True
    var_disponible: bool = True
    var_permitir_sin_stock: bool = False
    col_id: Optional[int] = None


class ProductoBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    prod_nombre: str
    prod_descripcion: Optional[str] = None
    prod_precio_venta: float
    prod_precio_costo: Optional[float] = None
    prod_stock: int = 0
    prod_stock_minimo: Optional[int] = 0
    prod_activo: bool = True
    prod_visible: bool = True
    prod_per_sin_stock: bool = False
    prod_es_combo: bool = False
    cat_id: int


class ProductoCreateSchema(ProductoBaseSchema):
    subcategoria_ids: Optional[list[int]] = Field(
        default=None,
        description="IDs de subcategorías asociadas (relación N:M)",
    )
    imagenes: Optional[list[str]] = Field(
        default=None,
        description="Lista de URLs de imágenes (la primera será la portada principal)",
    )
    variantes: Optional[list[VarianteBaseSchema]] = Field(
        default=None,
        description="Variantes físicas o de presentación del producto",
    )


class ProductoUpdateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    prod_nombre: Optional[str] = None
    prod_descripcion: Optional[str] = None
    prod_precio_venta: Optional[float] = None
    prod_precio_costo: Optional[float] = None
    prod_stock: Optional[int] = None
    prod_stock_minimo: Optional[int] = None
    prod_activo: Optional[bool] = None
    prod_visible: Optional[bool] = None
    prod_per_sin_stock: Optional[bool] = None
    prod_es_combo: Optional[bool] = None
    cat_id: Optional[int] = None
    subcategoria_ids: Optional[list[int]] = None
    imagenes: Optional[list[str]] = None
    variantes: Optional[list[VarianteBaseSchema]] = None


class ImagenUrlResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    img_id: int
    img_url: str
    img_principal: bool


class VarianteResponseSchema(VarianteBaseSchema):
    var_id: int
    prod_id: int


class SubcategoriaSimpleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sub_id: int
    sub_nombre: str


class ProductoSubcategoriaResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rel_subcategoria: SubcategoriaSimpleSchema


class ProductoResponseSchema(ProductoBaseSchema):
    prod_id: int
    rel_imagenes: list[ImagenUrlResponseSchema] = []
    rel_variantes: list[VarianteResponseSchema] = []
    rel_subcategoria: list[ProductoSubcategoriaResponseSchema] = []


class ProdCatAgrupadaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    cat_id: int
    cat_nombre: str
    productos: list[ProductoResponseSchema]


class ToggleVitrinaSchema(BaseModel):
    prod_visible: bool


class ProductoAccionResponseSchema(BaseModel):
    message: str
    prod_id: int
    prod_activo: Optional[bool] = None
    prod_visible: Optional[bool] = None



























from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.subcategoria_schema import SubcategoriaResponseSchema
from app.schemas.categoria_schema import CategoriaResponseSchema


# =============================================================================
# 1. ESQUEMA DE RECURSOS MULTIMEDIA (IMÁGENES)
# =============================================================================
class ImagenResponseSchema(BaseModel):
    """Contrato de salida para imágenes de productos (Cloudflare R2 o Local)."""
    img_id: int = Field(..., description="ID único del registro de imagen")
    img_url: str = Field(..., description="URL absoluta o relativa hacia el asset multimedia")
    img_principal: bool = Field(default=False, description="True si es la portada principal de la tarjeta")
    img_tipo: str = Field(default="producto", description="Clasificación del activo")

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# 2. ESQUEMAS DE VARIANTES Y COLOR (SKU)
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
    
    # Precios absolutos
    var_precio_venta: float = Field(default=0.0, description="Precio final de la presentación")
    var_precio_costo: Optional[float] = Field(default=None, description="Costo de compra al proveedor")
    var_stock: int = Field(default=0, description="Existencias en depósito")
    var_stock_minimo: Optional[int] = Field(default=None, description="Umbral de alerta de reposición")
    
    var_sku: Optional[str] = Field(default=None, alias="val_sku")
    var_codigo_barra: Optional[str] = None
    
    # Flags operativos
    var_activo: bool = True
    var_visible: bool = True
    var_disponible: bool = True
    var_permitir_sin_stock: bool = False
    
    color: Optional[ColorResponseSchema] = Field(default=None, alias="rel_color")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class VarianteCreateSchema(BaseModel):
    var_tipo: str = Field(default="Presentación", description="Talle, Volumen, Peso, etc.")
    var_nombre: str = Field(..., description="Ej: S, M, XL, 250ml")
    var_precio_venta: float = Field(default=0.0, description="Precio final de la presentación")
    var_precio_costo: Optional[float] = Field(default=None, description="Costo de compra al proveedor")
    var_stock: int = Field(default=0, description="Existencias en depósito")
    var_stock_minimo: Optional[int] = Field(default=None, description="Umbral de reposición")
    var_sku: Optional[str] = Field(default=None, alias="val_sku")
    var_codigo_barra: Optional[str] = None
    col_id: Optional[int] = None
    var_activo: bool = True
    var_visible: bool = True
    var_disponible: bool = True
    var_permitir_sin_stock: bool = False

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 3. ENLACE A SUBCATEGORÍA (TABLA INTERMEDIA)
# =============================================================================
class ProductoSubcategoriaResponseSchema(BaseModel):
    subc_id: int
    subcategoria: Optional[SubcategoriaResponseSchema] = Field(default=None, alias="rel_subcategoria")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# =============================================================================
# 4. ESQUEMA PRINCIPAL DE PRODUCTO Y DTOs DE CREACIÓN / EDICIÓN
# =============================================================================
class ProductoCreateSchema(BaseModel):
    """Payload para registrar un nuevo producto en el catálogo."""
    prod_nombre: str = Field(..., min_length=1, max_length=150, description="Nombre comercial del producto")
    prod_descripcion: Optional[str] = Field(default=None, description="Descripción técnica o composición")
    prod_codigo_barra: Optional[str] = Field(default=None, max_length=64, description="Código de barras EAN/UPC")
    prod_precio_venta: float = Field(default=0.0, ge=0.0, description="Precio de venta base al público")
    prod_precio_costo: Optional[float] = Field(default=None, ge=0.0, description="Precio de costo del proveedor")
    prod_stock: int = Field(default=0, ge=0, description="Stock físico")
    prod_stock_minimo: Optional[int] = Field(default=5, ge=0, description="Umbral de stock crítico")
    prod_solo_variantes: bool = Field(default=False, description="Exige variante para la venta")
    prod_activo: bool = Field(default=True, description="Estado activo en catálogo")
    prod_disponible: bool = Field(default=True, description="Disponibilidad para compras")
    prod_visible: bool = Field(default=True, description="Visibilidad en vitrina")
    prod_per_sin_stock: bool = Field(default=False, description="Permite pedidos sin stock")
    cat_id: int = Field(default=1, description="ID de la categoría principal")
    imagenes: Optional[List[str]] = Field(default=None, description="URLs de imágenes para asociar al producto")
    variantes: Optional[List[VarianteCreateSchema]] = Field(default=None, description="Lista de variantes físicas")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProductoUpdateSchema(BaseModel):
    """Payload para actualización total o parcial de un producto."""
    prod_nombre: Optional[str] = Field(default=None, min_length=1, max_length=150)
    prod_descripcion: Optional[str] = None
    prod_codigo_barra: Optional[str] = None
    prod_precio_venta: Optional[float] = Field(default=None, ge=0.0)
    prod_precio_costo: Optional[float] = Field(default=None, ge=0.0)
    prod_stock: Optional[int] = Field(default=None, ge=0)
    prod_stock_minimo: Optional[int] = Field(default=None, ge=0)
    prod_solo_variantes: Optional[bool] = None
    prod_activo: Optional[bool] = None
    prod_disponible: Optional[bool] = None
    prod_visible: Optional[bool] = None
    prod_per_sin_stock: Optional[bool] = None
    cat_id: Optional[int] = None
    imagenes: Optional[List[str]] = None
    variantes: Optional[List[VarianteCreateSchema]] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProductoResponseSchema(BaseModel):
    prod_id: int = Field(..., description="ID del producto")
    prod_nombre: str = Field(..., description="Nombre comercial del producto")
    prod_descripcion: Optional[str] = Field(default=None, description="Descripción detallada")
    prod_codigo_barra: Optional[str] = Field(default=None, description="Código de barras EAN/UPC")
    
    # Control financiero
    prod_precio_venta: float = Field(default=0.0, description="Precio base de venta")
    prod_precio_costo: Optional[float] = None
    
    # Reglas de negocio y vitrina
    prod_solo_variantes: bool = False
    prod_activo: bool = True
    prod_disponible: bool = True
    prod_visible: bool = True
    prod_per_sin_stock: bool = False
    
    # Inventario
    prod_stock: Optional[int] = Field(default=0, description="Stock físico")
    prod_stock_minimo: Optional[int] = None
    cat_id: int = Field(..., description="ID de la categoría principal")
    categoria: Optional[CategoriaResponseSchema] = Field(default=None, alias="rel_categoria")
    
    # Galería de imágenes vinculada desde ProductoModel.rel_imagenes
    imagenes: List[ImagenResponseSchema] = Field(
        default_factory=list, 
        alias="rel_imagenes",
        description="Galería multimedia del producto"
    )
    
    # Variantes físicas y subcategorías
    variantes: List[VarianteResponseSchema] = Field(
        default_factory=list, 
        alias="rel_variantes",
        description="Presentaciones físicas disponibles"
    )
    subcategorias: List[ProductoSubcategoriaResponseSchema] = Field(
        default_factory=list, 
        alias="rel_subcategoria",
        description="Subcategorías asociadas"
    )

    # populate_by_name permite acceder tanto por el nombre interno como por el alias de salida
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

ProductoSchema = ProductoResponseSchema


# =============================================================================
# 5. ESQUEMA JERÁRQUICO PARA LANDING PAGE
# =============================================================================
class ProdCatAgrupadaSchema(BaseModel):
    cat_id: int = Field(..., description="ID de la categoría")
    cat_nombre: str = Field(..., description="Nombre de la categoría")
    productos: List[ProductoResponseSchema] = Field(
        default_factory=list,
        description="Productos pertenecientes a esta categoría"
    )

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# 6. ESQUEMAS DE MUTACIONES ADMINISTRATIVAS (VITRINA Y BAJA LÓGICA)
# =============================================================================
class ToggleVitrinaSchema(BaseModel):
    """Payload para alternar visibilidad en vitrina web."""
    prod_visible: bool = Field(..., description="True para exhibir en tienda web, False para ocultar")


class ProductoAccionResponseSchema(BaseModel):
    """Respuesta estándar para mutaciones administrativas de productos."""
    message: str
    prod_id: int
    prod_activo: Optional[bool] = None
    prod_visible: Optional[bool] = None
