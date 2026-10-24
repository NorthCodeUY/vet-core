# api-backend/app/models/color_model.py

from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.producto_variante_model import ProductoVarianteModel

class ColorModel(Base):
    __tablename__ = "color"

    col_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    col_nombre: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    col_hex: Mapped[str] = mapped_column(String(7), nullable=False, default="#000000")  # Ej: #FF5733

    # Variantes asociadas a este color
    rel_variantes: Mapped[List["ProductoVarianteModel"]] = relationship(
        "ProductoVarianteModel",
        back_populates="rel_color"
    )