# api-backend/app/models/producto_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: NÚCLEO DEL CATÁLOGO DE PRODUCTOS
=============================================================================
Entidad central del catálogo. Agrupa información descriptiva, categorización,
galería multimedia, presentaciones físicas (variantes) y reglas de visualización/stock.
"""

from sqlalchemy import true
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
    
    Reglas Transaccionales:
    - prod_activo: Baja lógica para preservar integridad referencial de pedidos pasados.
    - prod_visible: Permite ocultar el producto de la tienda pública sin desactivarlo.
    - permitir_sin_stock: Permite compras por encargo (backorders) cuando el stock es 0.
    """
    __tablename__ = "producto"

    # =========================================================================
    # Identificadores y Atributos Básicos
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
        doc="Nombre comercial del producto desplegado en frontend."
    )
    
    prod_descripcion: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True,
        doc="Descripción técnica, instrucciones o detalles del producto."
    )
    
    prod_precio: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Precio base en moneda local."
    )
    
    prod_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Stock global físico (utilizado como fallback cuando no hay variantes)."
    )

    codigo_barra: Mapped[Optional[str]] = mapped_column(
        String(64),
        unique=True,
        nullable=True,
        index=True,
        doc="Código de barras EAN/UPC para lectores ópticos en panel administrativo."
    )

    # =========================================================================
    # Reglas de Visibilidad, Inventario y Baja Lógica 1 
    # =========================================================================
    prod_activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Baja lógica: False si el producto fue dado de baja definitiva pero debe persistir en auditoría."
    )

    prod_disponible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Producto disponible: True si el producto está disponible, False si no lo está."
    )

    prod_visible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Visibilidad en vitrina: False para ocultar de la web pública (ej: joyas únicas agotadas)."
    )

    permitir_sin_stock: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="Habilita pedidos por encargo aunque el stock actual sea 0."
    )

    # =========================================================================
    # Claves Foráneas
    # =========================================================================
    cat_id: Mapped[int] = mapped_column(
        ForeignKey("categoria.cat_id"), 
        nullable=False, 
        index=True,
        doc="Identificador de la categoría principal."
    )

    # =========================================================================
    # Relaciones ORM Tipadas (SQLAlchemy 2.0)
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
        doc="Lista de imágenes asociadas al producto."
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