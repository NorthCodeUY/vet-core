# api-backend/app/schemas/producto_schema.py
"""
=============================================================================
ESQUEMAS PYDANTIC V2: CATÁLOGO DE PRODUCTOS (UNIFICADO Y OPTIMIZADO)
=============================================================================
Contratos DTO para la API de Catálogo, Variantes Físicas (SKUs), Galería
Multimedia (R2/Local) e Integración N:M con Subcategorías.
"""

from typing import Optional

from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from app.schemas.categoria_schema import CategoriaResponseSchema
from app.schemas.subcategoria_schema import SubcategoriaResponseSchema


# =============================================================================
# 1. ESQUEMAS DE RECURSOS MULTIMEDIA (IMÁGENES)
# =============================================================================

class ImagenResponseSchema(BaseModel):
    """Contrato de salida para imágenes asociadas a productos."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    img_id: int = Field(..., description="ID único del registro de imagen")
    img_url: str = Field(..., description="URL absoluta o relativa hacia el asset")
    img_principal: bool = Field(
        default=False,
        description="True si es la portada principal del producto",
    )
    img_tipo: str = Field(
        default="PRODUCTO",
        description="Clasificación del recurso multimedia",
    )


# Alias de compatibilidad
ImagenUrlResponseSchema = ImagenResponseSchema


class ImagenUploadResponseSchema(BaseModel):
    """Respuesta tras subir una imagen binaria al storage (Cloudflare R2 o local)."""

    model_config = ConfigDict(from_attributes=True)

    img_url: str = Field(..., description="URL pública final del recurso almacenado")
    filename: str = Field(..., description="Nombre de archivo único generado en storage")


# =============================================================================
# 2. ESQUEMAS DE COLORES Y VARIANTES FÍSICAS (SKUs)
# =============================================================================

class ColorResponseSchema(BaseModel):
    """Información de colorimetría para variantes físicas."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    col_id: int = Field(..., description="ID único del color")
    col_nombre: str = Field(..., description="Nombre comercial del color")
    col_hex: str = Field(..., description="Código hexadecimal (#FFFFFF)")


class VarianteBaseSchema(BaseModel):
    """Atributos comunes para creación y visualización de variantes."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    var_nombre: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Ej: S, XL, 250ml, 1Kg",
    )
    var_tipo: str = Field(
        default="Presentación",
        max_length=50,
        description="Clasificación: Talle, Medida, etc.",
    )
    val_sku: Optional[str] = Field(
        default=None,
        alias="var_sku",
        max_length=64,
        description="Código SKU de almacén",
    )
    var_codigo_barra: Optional[str] = Field(
        default=None,
        max_length=64,
        description="Código de barras EAN/UPC",
    )
    var_precio_venta: float = Field(
        default=0.0,
        ge=0.0,
        description="Precio de venta absoluto al público",
    )
    var_precio_costo: Optional[float] = Field(
        default=None,
        ge=0.0,
        description="Costo de adquisición unitario",
    )
    var_stock: int = Field(default=0, ge=0, description="Existencias en inventario")
    var_stock_minimo: Optional[int] = Field(
        default=None,
        ge=0,
        description="Umbral crítico de reposición",
    )
    var_activo: bool = Field(default=True, description="Estado operativo en el sistema")
    var_visible: bool = Field(default=True, description="Visibilidad en catálogo")
    var_disponible: bool = Field(default=True, description="Habilitado para la venta")
    var_permitir_sin_stock: bool = Field(
        default=False,
        description="Permite pedidos por encargo sin stock",
    )
    col_id: Optional[int] = Field(default=None, description="ID del color asociado opcional")


class VarianteCreateSchema(VarianteBaseSchema):
    """Payload de entrada para inserción de variantes físicas."""

    pass


class VarianteResponseSchema(VarianteBaseSchema):
    """Contrato de salida para variantes físicas resueltas."""

    var_id: int = Field(..., description="ID único de la variante")
    prod_id: int = Field(..., description="ID del producto padre")
    color: Optional[ColorResponseSchema] = Field(
        default=None,
        alias="rel_color",
        description="Datos del color asignado",
    )


# =============================================================================
# 3. ENLACE RELACIONAL N:M (PRODUCTO <-> SUBCATEGORÍA)
# =============================================================================

class ProductoSubcategoriaResponseSchema(BaseModel):
    """Representación de la tabla intermedia con la entidad subcategoría anidada."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    subc_id: Optional[int] = Field(default=None, description="ID de la subcategoría")
    rel_subcategoria: Optional[SubcategoriaResponseSchema] = Field(
        default=None,
        description="Entidad completa de la subcategoría vinculada",
    )


# =============================================================================
# 4. ESQUEMA BASE DE PRODUCTO (COLUMNAS PERSISTIDAS)
# =============================================================================

class ProductoBaseSchema(BaseModel):
    """Columnas escalares nativas de la tabla producto."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    prod_nombre: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre comercial del producto",
    )
    prod_descripcion: Optional[str] = Field(
        default=None,
        description="Descripción técnica o composición",
    )
    prod_codigo_barra: Optional[str] = Field(
        default=None,
        max_length=64,
        description="Código de barras primario",
    )
    prod_precio_venta: float = Field(
        default=0.0,
        ge=0.0,
        description="Precio base de venta al público",
    )
    prod_precio_costo: Optional[float] = Field(
        default=None,
        ge=0.0,
        description="Precio de costo del proveedor",
    )
    prod_stock: int = Field(
        default=0,
        ge=0,
        description="Existencias globales consolidadas",
    )
    prod_stock_minimo: Optional[int] = Field(
        default=0,
        ge=0,
        description="Umbral para alerta de inventario",
    )
    prod_solo_variantes: bool = Field(
        default=False,
        description="Exige seleccionar una variante para vender",
    )
    prod_activo: bool = Field(default=True, description="Estado operativo en catálogo")
    prod_disponible: bool = Field(
        default=True,
        description="Habilitado para facturación y venta",
    )
    prod_visible: bool = Field(default=True, description="Visibilidad en vitrina digital")
    prod_per_sin_stock: bool = Field(
        default=False,
        description="Permite pedidos si stock <= 0",
    )
    prod_es_combo: bool = Field(
        default=False,
        description="Indica si es un paquete agrupado de productos",
    )
    cat_id: int = Field(..., description="ID de la categoría principal obligatoria")


# =============================================================================
# 5. DTOs TRANSACCIONALES: CREACIÓN Y ACTUALIZACIÓN
# =============================================================================

class ProductoCreateSchema(ProductoBaseSchema):
    """Payload para POST /api/productos con relaciones desacopladas."""

    subcategoria_ids: Optional[list[int]] = Field(
        default=None,
        validation_alias=AliasChoices("subcategoria_ids", "subcategorias_ids"),
        description="IDs de subcategorías (acepta 'subcategoria_ids' o 'subcategorias_ids')",
    )
    imagenes: Optional[list[str]] = Field(
        default=None,
        description="URLs de imágenes (la posición 0 se establece como portada principal)",
    )
    variantes: Optional[list[VarianteCreateSchema]] = Field(
        default=None,
        description="Lista de variantes físicas a instanciar para el producto",
    )


class ProductoUpdateSchema(BaseModel):
    """Payload para PUT /api/productos/{id}. Admite mutación parcial o total."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    prod_nombre: Optional[str] = Field(default=None, min_length=1, max_length=150)
    prod_descripcion: Optional[str] = None
    prod_codigo_barra: Optional[str] = Field(default=None, max_length=64)
    prod_precio_venta: Optional[float] = Field(default=None, ge=0.0)
    prod_precio_costo: Optional[float] = Field(default=None, ge=0.0)
    prod_stock: Optional[int] = Field(default=None, ge=0)
    prod_stock_minimo: Optional[int] = Field(default=None, ge=0)
    prod_solo_variantes: Optional[bool] = None
    prod_activo: Optional[bool] = None
    prod_disponible: Optional[bool] = None
    prod_visible: Optional[bool] = None
    prod_per_sin_stock: Optional[bool] = None
    prod_es_combo: Optional[bool] = None
    cat_id: Optional[int] = None
    subcategoria_ids: Optional[list[int]] = Field(
        default=None,
        validation_alias=AliasChoices("subcategoria_ids", "subcategorias_ids"),
        description="IDs para sobrescribir la vinculación N:M de subcategorías",
    )
    imagenes: Optional[list[str]] = Field(
        default=None,
        description="Galería de URLs que reemplazará a las imágenes previas",
    )
    variantes: Optional[list[VarianteCreateSchema]] = Field(
        default=None,
        description="Variantes que reemplazarán el inventario previo del artículo",
    )


# =============================================================================
# 6. DTOs DE SALIDA Y RESPUESTA AL FRONTEND
# =============================================================================

class ProductoResponseSchema(ProductoBaseSchema):
    """Contrato completo de salida de producto con todo su grafo relacional."""

    prod_id: int = Field(..., description="Identificador único del producto")
    categoria: Optional[CategoriaResponseSchema] = Field(
        default=None,
        alias="rel_categoria",
        description="Categoría principal asociada",
    )
    imagenes: list[ImagenResponseSchema] = Field(
        default_factory=list,
        alias="rel_imagenes",
        description="Galería fotográfica ordenada por portada",
    )
    variantes: list[VarianteResponseSchema] = Field(
        default_factory=list,
        alias="rel_variantes",
        description="Presentaciones y variantes físicas activas",
    )
    subcategorias: list[ProductoSubcategoriaResponseSchema] = Field(
        default_factory=list,
        alias="rel_subcategoria",
        description="Subcategorías asignadas",
    )


# Alias canónico
ProductoSchema = ProductoResponseSchema


# =============================================================================
# 7. CATÁLOGO AGRUPADO PARA LANDING Y MUTACIONES RÁPIDAS
# =============================================================================

class ProdCatAgrupadaSchema(BaseModel):
    """Estructura de catálogo público seccionada por categoría para la Landing Page."""

    model_config = ConfigDict(from_attributes=True)

    cat_id: int = Field(..., description="ID de la categoría")
    cat_nombre: str = Field(..., description="Nombre comercial de la categoría")
    productos: list[ProductoResponseSchema] = Field(
        default_factory=list,
        description="Lista de productos visibles con stock",
    )


class ToggleVitrinaSchema(BaseModel):
    """Payload para alternar visibilidad rápida en vitrina pública."""

    prod_visible: bool = Field(..., description="True para publicar, False para ocultar")


class ProductoAccionResponseSchema(BaseModel):
    """Respuesta unificada para operaciones administrativas (bajas y conmutaciones)."""

    message: str
    prod_id: int
    prod_activo: Optional[bool] = None
    prod_visible: Optional[bool] = None