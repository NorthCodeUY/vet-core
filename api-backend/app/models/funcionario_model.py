# api-backend/app/models/funcionario_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: PERFIL DE FUNCIONARIOS / EMPLEADOS
=============================================================================
Extensión del usuario cuando cumple tareas operativas en el negocio.
"""

from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user_model import UserModel


class FuncionarioModel(Base):
    """
    Tabla 'funcionarios'.
    Almacena metadatos del personal (cargos, matrículas, permisos operativos).
    """
    __tablename__ = "funcionarios"

    fun_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.usu_id", ondelete="CASCADE"), 
        primary_key=True,
        doc="ID foráneo vinculado 1:1 con la tabla usuarios."
    )

    fun_cargo: Mapped[str] = mapped_column(
        String(50), 
        nullable=False, 
        default="Operador",
        doc="Puesto en el negocio: 'Veterinario', 'Cajero', 'Peluquero', 'Encargado'."
    )

    fun_matricula: Mapped[Optional[str]] = mapped_column(
        String(50), 
        nullable=True,
        doc="Matrícula profesional médica (aplicable a veterinarias)."
    )

    # Relación inversa al usuario
    rel_usuario: Mapped["UserModel"] = relationship(
        "UserModel", 
        back_populates="rel_funcionario"
    )