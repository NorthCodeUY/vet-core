# api-backend/app/models/subcategoria_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: SUBCATEGORÍAS DEL CATÁLOGO
=============================================================================
Entidad para clasificación secundaria de productos. Soporta iconografía 
híbrida (identificadores de librerías universales o URLs a isotipos SVG personalizados).
"""

from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.producto_subcategoria_model import ProductoSubCategoriaModel


class SubcategoriaModel(Base):
    """
    Modelo de la tabla 'subcategoria'.
    
    Campos Híbridos de Iconografía:
    - subc_icono: Clave alfanumérica de iconos vectoriales (ej: 'Scissors', 'Dog', 'Shirt').
    - subc_imagen_url: Enlace directo a Cloudflare R2 / CDN si el cliente tiene un logo SVG propio.
    """
    __tablename__ = "subcategoria"

    subc_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único de la subcategoría."
    )
    
    subc_nombre: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        nullable=False,
        doc="Nombre de la subcategoría."
    )

    subc_icono: Mapped[Optional[str]] = mapped_column(
        String(50), 
        nullable=True, 
        default=None,
        doc="Nombre del ícono estándar de librería frontend (Lucide/FontAwesome)."
    )

    subc_imagen_url: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True, 
        default=None,
        doc="URL absoluta del asset SVG personalizado en Cloudflare R2."
    )

    # Relación M:N hacia productos a través de la tabla intermedia
    rel_productos: Mapped[List["ProductoSubCategoriaModel"]] = relationship(
        "ProductoSubCategoriaModel",
        back_populates="rel_subcategoria"
    )