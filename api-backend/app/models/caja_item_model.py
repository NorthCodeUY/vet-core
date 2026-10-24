# api-backend/app/models/caja_item_model.py
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.caja_model import CajaModel
    from app.models.producto_model import ProductoModel
    from app.models.producto_variante_model import ProductoVarianteModel

class CajaItemModel(Base):
    __tablename__ = "caja_item"

    item_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    caja_id: Mapped[int] = mapped_column(ForeignKey("caja.caja_id", ondelete="CASCADE"), nullable=False, index=True)
    prod_id: Mapped[int] = mapped_column(ForeignKey("producto.prod_id"), nullable=False, index=True)
    var_id: Mapped[Optional[int]] = mapped_column(ForeignKey("producto_variante.var_id"), nullable=True, index=True)
    
    # Cantidad física de esta variante/producto guardada en la caja
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Relaciones tipadas
    rel_caja: Mapped["CajaModel"] = relationship("CajaModel", back_populates="rel_items")
    rel_producto: Mapped["ProductoModel"] = relationship("ProductoModel")
    rel_variante: Mapped[Optional["ProductoVarianteModel"]] = relationship("ProductoVarianteModel")