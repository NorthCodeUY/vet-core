# api-backend/app/models/caja_model.py
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.caja_item_model import CajaItemModel

class CajaModel(Base):
    __tablename__ = "caja"

    caja_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Código único para generar el QR (ej: "CJ-2024-001" o UUID)
    caja_codigo: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    # Etiqueta descriptiva (ej: "Ropa de Verano - Lote 1")
    caja_nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Ubicación física y logística
    direccion: Mapped[str] = mapped_column(String(255), nullable=False)
    deposito_referencia: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # Ej: "Pieza del fondo"
    
    # Datos de contacto de la persona que tiene la caja en su casa
    contacto_nombre: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    contacto_telefono: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    
    # Estado: "DISPONIBLE", "EN_TRANSITO", "LLENA"
    estado: Mapped[str] = mapped_column(String(30), default="DISPONIBLE", nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relación con los productos dentro de la caja
    rel_items: Mapped[List["CajaItemModel"]] = relationship(
        "CajaItemModel",
        back_populates="rel_caja",
        cascade="all, delete-orphan",
        lazy="selectin"
    )