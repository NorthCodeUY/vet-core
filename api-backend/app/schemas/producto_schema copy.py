# api-backend/app/schemas/producto_schema.py
"""
=============================================================================
CONTRATOS DE DATOS (DTOs / SCHEMAS) - CATÁLOGO Y VARIANTES
=============================================================================
Define los esquemas de serialización y validación basados en Pydantic v2.
Estos contratos desacoplan los modelos internos de SQLAlchemy de la respuesta
JSON consumida por el frontend, garantizando tipado estricto y documentación
automática en Swagger/OpenAPI.
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class ColorResponseSchema(BaseModel):
    """
    Contrato de salida para la entidad Color.
    
    Permite al cliente web/móvil renderizar selectores visuales de color
    mediante códigos hexadecimales directos en componentes de UI.
    """
    col_id: int = Field(
        ..., 
        description="Identificador único del color en base de datos",
        examples=[1]
    )
    col_nombre: str = Field(
        ..., 
        description="Nombre visible del color",
        examples=["Rojo Escarlata", "Azul Marino"]
    )
    col_hex: str = Field(
        ..., 
        description="Código hexadecimal de color para renderizado CSS",
        examples=["#FF5733", "#000080"]
    )

    # from_attributes=True permite transformar directamente modelos SQLAlchemy ORM a JSON
    model_config = ConfigDict(from_attributes=True)


class VarianteResponseSchema(BaseModel):
    """
    Contrato de salida para la variante física (SKU vendible).
    
    Representa una opción concreta que puede ser seleccionada dentro de la
    tarjeta de producto (ej: Talle M, 500 ml) con su propio stock e impacto financiero.
    """
    var_id: int = Field(
        ..., 
        description="Identificador único de la variante física (SKU id)",
        examples=[101]
    )
    prod_id: int = Field(
        ..., 
        description="Identificador del producto padre",
        examples=[45]
    )
    var_tipo: str = Field(
        ..., 
        description="Categorización de la variante ('Talle', 'Volumen', 'Peso')",
        examples=["Talle", "Volumen"]
    )
    var_nombre: str = Field(
        ..., 
        description="Etiqueta visible de la opción en el selector",
        examples=["M", "XL", "250 ml", "5 Kg"]
    )
    var_precio_adicional: float = Field(
        default=0.0,
        ge=0.0,
        description="Monto extra que se suma al precio base del producto al elegir esta opción",
        examples=[0.0, 150.0]
    )
    var_stock: int = Field(
        default=0,
        ge=0,
        description="Existencias físicas disponibles exclusivamente para esta combinación",
        examples=[12]
    )
    sku: Optional[str] = Field(
        default=None,
        description="Código alfanumérico único para lectores de código de barras",
        examples=["REM-OVR-NEG-M"]
    )
    # Resuelve la relación ORM 'rel_color' y la expone como 'color' en el JSON de salida
    color: Optional[ColorResponseSchema] = Field(
        default=None, 
        alias="rel_color",
        description="Detalle de color asignado a la variante (si aplica)"
    )

    # populate_by_name permite serializar usando 'rel_color' desde SQLAlchemy y exponerlo como 'color'
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ProductoResponseSchema(BaseModel):
    """
    Contrato de salida principal del catálogo de productos.
    
    Diseñado bajo el principio de compatibilidad hacia atrás:
    - Productos Simples: El array 'variantes' se emite vacío ([]), usando el precio y stock base.
    - Productos Complejos: El frontend consume la lista 'variantes' para dibujar selectores dinámicos.
    """
    prod_id: int = Field(
        ..., 
        description="Identificador único del producto en catálogo",
        examples=[45]
    )
    prod_nombre: str = Field(
        ..., 
        description="Nombre comercial del producto",
        examples=["Remera Oversize", "Shampoo Hipoalergénico"]
    )
    prod_descripcion: Optional[str] = Field(
        default=None, 
        description="Descripción detallada de materiales, usos o composición",
        examples=["100% Algodón Peinado 24/1."]
    )
    prod_precio: float = Field(
        ..., 
        ge=0.0,
        description="Precio base del producto en moneda local",
        examples=[1200.0]
    )
    prod_stock: int = Field(
        ..., 
        ge=0,
        description="Stock global del producto base (utilizado cuando el producto no posee variantes)",
        examples=[25]
    )
    cat_id: int = Field(
        ..., 
        description="Identificador de la categoría a la que pertenece",
        examples=[2]
    )
    # Mapea la relación SQLAlchemy 'rel_variantes' hacia el campo público 'variantes'
    variantes: List[VarianteResponseSchema] = Field(
        default_factory=list, 
        alias="rel_variantes",
        description="Colección de presentaciones físicas, talles o volúmenes disponibles"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)