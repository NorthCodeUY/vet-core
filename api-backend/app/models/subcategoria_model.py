# api-backend/app/models/subcategoria_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: SUBCATEGORÍAS DEL CATÁLOGO
=============================================================================
Entidad para clasificación secundaria de productos. Soporta iconografía 
híbrida con discriminador de selección activa.
"""

from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.producto_subcategoria_model import ProductoSubCategoriaModel


class SubcategoriaModel(Base):
    """
    Modelo de la tabla 'subcategoria'.
    
    Campos Híbridos de Iconografía:
    - subc_tipo_icono: Define la fuente activa elegida ('ICONO' o 'IMAGEN').
    - subc_icono: Clave de icono vectorial (ej: 'Dog', 'Tractor', 'Scissors').
    - subc_imagen_url: URL absoluta del isotipo/SVG en Cloudflare R2 o CDN.
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

    subc_tipo_icono: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="ICONO",
        doc="Discriminador de iconografía activa: 'ICONO' o 'IMAGEN'."
    )

    subc_icono: Mapped[Optional[str]] = mapped_column(
        String(50), 
        nullable=True, 
        default=None,
        doc="Nombre del ícono estándar de librería frontend (Lucide/Material)."
    )

    subc_imagen_url: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True, 
        default=None,
        doc="URL absoluta del asset SVG/PNG en Cloudflare R2."
    )

    # Relación M:N hacia productos a través de la tabla intermedia
    rel_productos: Mapped[List["ProductoSubCategoriaModel"]] = relationship(
        "ProductoSubCategoriaModel",
        back_populates="rel_subcategoria"
    )