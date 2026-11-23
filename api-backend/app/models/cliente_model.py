# api-backend/app/models/cliente_model.py
from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.pedido_model import PedidoModel
    from app.models.user_model import UserModel


class ClienteModel(Base):
    """Modelo ORM de la tabla 'clientes'."""

    __tablename__ = "clientes"

    cli_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.usu_id"),
        primary_key=True,
    )
    cli_deuda: Mapped[float] = mapped_column(Float, default=0.0)

    rel_usuario: Mapped["UserModel"] = relationship(
        "UserModel",
        back_populates="rel_cliente",
        primaryjoin="ClienteModel.cli_id == UserModel.usu_id",
    )
    rel_pedido: Mapped[list["PedidoModel"]] = relationship(
        "PedidoModel",
        back_populates="rel_cliente",
        primaryjoin="ClienteModel.cli_id == PedidoModel.cli_id",
    )