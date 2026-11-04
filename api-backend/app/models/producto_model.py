# api-backend/app/models/producto_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: NÚCLEO DEL CATÁLOGO DE PRODUCTOS (SQLALCHEMY 2.0)
=============================================================================
Entidad central del catálogo. Agrupa información descriptiva, categorización,
galería multimedia, presentaciones físicas (variantes) y reglas financieras.
"""

from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.categoria_model import CategoriaModel
    from app.models.imagen_url_model import ImagenUrlModel
    from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
    from app.models.producto_variante_model import ProductoVarianteModel
    from app.models.caja_item_model import CajaItemModel


class ProductoModel(Base):
    """
    Entidad maestra de producto.
    
    Reglas Transaccionales y de Visualización:
    - prod_solo_variantes: Si es True, el producto no se puede vender directamente;
      obliga al frontend a exigir la selección de un talle, medida o volumen.
    - prod_precio_costo: Monto de adquisición (opcional, para cálculo de márgenes).
    - prod_stock_minimo: Umbral numérico para alertas preventivas de desabastecimiento.
    - prod_activo: Baja lógica para auditoría histórica de pedidos pasados.
    - prod_visible: Interruptor de vitrina pública (True=Visible, False=Oculto).
    """
    __tablename__ = "producto"

    # =========================================================================
    # 1. Identificadores y Atributos Básicos
    # =========================================================================
    prod_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único del producto en catálogo."
    )
    
    prod_nombre: Mapped[str] = mapped_column(
        String(150), 
        nullable=False,
        doc="Nombre comercial del producto desplegado en el frontend."
    )
    
    prod_descripcion: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True,
        doc="Descripción técnica, instrucciones o composición del producto."
    )
    
    prod_codigo_barra: Mapped[Optional[str]] = mapped_column(
        String(64),
        unique=True,
        nullable=True,
        index=True,
        doc="Código de barras EAN/UPC general para lectores ópticos."
    )

    # =========================================================================
    # 2. Control Financiero y Precios
    # =========================================================================
    prod_precio_venta: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Precio de venta base al público en moneda local."
    )

    prod_precio_costo: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        default=None,
        doc="Precio de compra al proveedor (confidencial, para reportes contables)."
    )

    # =========================================================================
    # 3. Control de Inventario y Stock
    # =========================================================================
    prod_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Stock físico en depósito (utilizado cuando el producto no tiene variantes)."
    )

    prod_stock_minimo: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=None,
        doc="Umbral de alerta para reposición de mercadería (None si no controla alertas)."
    )

    # =========================================================================
    # 4. Reglas de Negocio, Vitrina y Ciclo de Vida
    # =========================================================================
    prod_solo_variantes: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="True si el producto no tiene existencia unitaria y solo se vende por variantes (ej: medicamentos en ml)."
    )

    prod_activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Baja lógica: False oculta el producto permanentemente pero conserva auditoría de ventas."
    )

    prod_disponible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Interruptor de disponibilidad: False desactiva temporalmente el botón de compra."
    )

    prod_visible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Vitrina digital: False oculta el artículo del catálogo público de la tienda web."
    )

    prod_per_sin_stock: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="Habilita pedidos por encargo (backorders) cuando el stock físico es 0."
    )

    # =========================================================================
    # 5. Claves Foráneas
    # =========================================================================
    cat_id: Mapped[int] = mapped_column(
        ForeignKey("categoria.cat_id"), 
        nullable=False, 
        index=True,
        doc="Identificador de la categoría principal."
    )

    # =========================================================================
    # 6. Relaciones ORM Tipadas (SQLAlchemy 2.0)
    # =========================================================================
    rel_categoria: Mapped["CategoriaModel"] = relationship(
        "CategoriaModel",
        doc="Relación Many-to-One hacia la categoría del producto."
    )
    
    rel_imagenes: Mapped[List["ImagenUrlModel"]] = relationship(
        "ImagenUrlModel", 
        back_populates="rel_producto",
        cascade="all, delete-orphan",
        lazy="selectin",
        doc="Lista de imágenes asociadas a la galería del producto."
    )

    rel_subcategoria: Mapped[List["ProductoSubCategoriaModel"]] = relationship(
        "ProductoSubCategoriaModel",
        cascade="all, delete-orphan",
        doc="Asociaciones con subcategorías secundarias del catálogo."
    )

    rel_variantes: Mapped[List["ProductoVarianteModel"]] = relationship(
        "ProductoVarianteModel",
        back_populates="rel_producto",
        cascade="all, delete-orphan",
        lazy="selectin",
        doc="Presentaciones físicas vendibles asociadas a este producto."
    )

    rel_caja_items: Mapped[List["CajaItemModel"]] = relationship(
        "CajaItemModel",
        back_populates="rel_producto",
        doc="Trazabilidad de existencias físicas distribuidas en cajas de depósito."
    )