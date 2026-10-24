# api-backend/app/models/imagen_url_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: GESTIÓN DE RECURSOS MULTIMEDIA (IMÁGENES)
=============================================================================
Almacena referencias a los recursos gráficos asociados a productos o usuarios.
Diseñado para admitir tanto almacenamiento estático local (/static/...)
como proveedores de Object Storage externos (Cloudflare R2, AWS S3).
"""

from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.producto_model import ProductoModel


class ImagenUrlModel(Base):
    """
    Entidad relacional para imágenes del catálogo.
    
    Permite múltiples imágenes por producto, designando una principal para 
    la vista en miniatura de las tarjetas y el resto para la galería de detalle.
    """
    __tablename__ = "imagen_url"

    # Constantes de tipificado de recursos
    TIPO_PRODUCTO: str = "producto"
    TIPO_USUARIO: str = "usuario"

    # =========================================================================
    # Claves Primarias y Foráneas
    # =========================================================================
    img_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único del registro de imagen."
    )
    
    prod_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("producto.prod_id", ondelete="CASCADE"), 
        nullable=True, 
        index=True,
        doc="ID del producto asociado. Si el producto se elimina, sus imágenes se borran en cascada."
    )

    # =========================================================================
    # Metadatos del Archivo
    # =========================================================================
    img_url: Mapped[str] = mapped_column(
        String(255), 
        nullable=False,
        doc="Ruta relativa (/static/productos/...) o URL absoluta (CDN / Cloudflare R2)."
    )
    
    img_principal: Mapped[bool] = mapped_column(
        Boolean, 
        default=False, 
        nullable=False,
        doc="Indica si es la imagen destacada que se renderiza en la tarjeta principal del catálogo."
    )
    
    img_tipo: Mapped[str] = mapped_column(
        String(50), 
        default=TIPO_PRODUCTO, 
        nullable=False,
        doc="Clasificación del activo multimedia ('producto', 'banner', 'usuario')."
    )

    # =========================================================================
    # Relaciones ORM Tipadas
    # =========================================================================
    rel_producto: Mapped[Optional["ProductoModel"]] = relationship(
        "ProductoModel", 
        back_populates="rel_imagenes",
        doc="Relación bidireccional Many-to-One con el producto padre."
    )