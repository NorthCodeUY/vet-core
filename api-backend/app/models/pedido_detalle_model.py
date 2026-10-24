# api-backend/app/models/pedido_detalle_model.py

from typing import Optional, TYPE_CHECKING
from sqlalchemy import Float, Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.pedido_model import PedidoModel
    from app.models.producto_model import ProductoModel
    from app.models.producto_variante_model import ProductoVarianteModel

class PedidoDetalleModel(Base):
    """
    Entidad asociativa y transaccional que desglosa cada ítem dentro de un pedido.
    
    Invariantes Críticas:
    1. Llave Primaria Subrogada: Se utiliza 'det_id' como clave única en lugar de una
       clave compuesta (ped_id, prod_id), permitiendo que un cliente compre el mismo
       producto en diferentes talles/colores dentro de un mismo pedido.
    2. Congelamiento Histórico (Snapshot): Guarda el precio exacto cobrado en ese
       instante. Modificaciones futuras en el catálogo no alteran ventas pasadas.
    3. Compatibilidad Agnóstica: 'var_id' es opcional (nullable=True) para coexistir
       con productos sin variantes (medicamentos, alimentos) y registros históricos.
    """
    __tablename__ = "pedido_detalle"

    # =========================================================================
    # Identificadores y Claves Foráneas
    # =========================================================================
    det_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único de la línea de pedido."
    )

    ped_id: Mapped[int] = mapped_column(
        ForeignKey("pedido.ped_id", ondelete="CASCADE"), 
        nullable=False, 
        index=True,
        doc="Referencia obligatoria a la cabecera del pedido."
    )

    prod_id: Mapped[int] = mapped_column(
        ForeignKey("producto.prod_id"), 
        nullable=False, 
        index=True,
        doc="Referencia obligatoria al producto padre vendido."
    )

    var_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("producto_variante.var_id", ondelete="SET NULL"), 
        nullable=True, 
        index=True,
        doc="Referencia opcional a la variante física adquirida (Talle/Color/Volumen)."
    )

    # =========================================================================
    # Datos Transaccionales Congelados (Snapshot)
    # =========================================================================
    pd_cantidad: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=1,
        doc="Unidades físicas adquiridas de este ítem."
    )

    pd_precio: Mapped[float] = mapped_column(
        Float, 
        nullable=False,
        doc="Precio unitario exacto capturado al momento del checkout (incluye precio base + diferencial de variante)."
    )

    # =========================================================================
    # Relaciones ORM Tipadas
    # =========================================================================
    rel_pedido: Mapped["PedidoModel"] = relationship(
        "PedidoModel", 
        back_populates="rel_pedido_detalle",
        doc="Relación Many-to-One con la cabecera del pedido."
    )

    rel_producto: Mapped["ProductoModel"] = relationship(
        "ProductoModel",
        doc="Relación Many-to-One con el producto base."
    )

    rel_variante: Mapped[Optional["ProductoVarianteModel"]] = relationship(
        "ProductoVarianteModel",
        doc="Relación Many-to-One con la variante física (si aplica)."
    )