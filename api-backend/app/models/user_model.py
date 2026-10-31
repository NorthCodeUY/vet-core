# api-backend/app/models/user_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: USUARIOS, IDENTIDAD Y ACCESO (RBAC)
=============================================================================
Entidad central de seguridad y autenticación.
Almacena credenciales encriptadas y determina el nivel de autorización en la API.
"""

from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.cliente_model import ClienteModel
    from app.models.funcionario_model import FuncionarioModel


class UserModel(Base):
    """
    Tabla 'usuarios'.
    
    Roles soportados:
    - 'ADMIN': Acceso ilimitado al panel de control y operaciones del tenant.
    - 'FUNCIONARIO': Personal dependiente (cajeros, veterinarios, estilistas).
    - 'CLIENTE': Usuario final que compra por el catálogo digital.
    """
    __tablename__ = "usuarios"

    # =========================================================================
    # Identificadores y Credenciales
    # =========================================================================
    usu_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único del usuario."
    )

    usu_email: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        index=True, 
        nullable=False,
        doc="Correo electrónico utilizado como identificador de login (username)."
    )

    usu_password_hash: Mapped[str] = mapped_column(
        String(255), 
        nullable=False,
        doc="Hash seguro de la contraseña (Bcrypt)."
    )

    # =========================================================================
    # Información de Perfil
    # =========================================================================
    usu_nombre: Mapped[str] = mapped_column(
        String(100), 
        nullable=False,
        doc="Nombre completo o razón social."
    )

    usu_nombre_mostrar: Mapped[Optional[str]] = mapped_column(
        String(100), 
        nullable=True,
        doc="Nombre de pila o alias visible en la barra superior."
    )

    usu_whatsapp: Mapped[Optional[str]] = mapped_column(
        String(20), 
        unique=True, 
        index=True, 
        nullable=True,
        doc="Teléfono para notificaciones de pedidos (opcional para admins)."
    )

    usu_rol: Mapped[str] = mapped_column(
        String(20), 
        nullable=False, 
        default="CLIENTE",
        index=True,
        doc="Nivel de permisos: 'ADMIN', 'FUNCIONARIO', 'CLIENTE'."
    )

    usu_activo: Mapped[bool] = mapped_column(
        Boolean, 
        default=True, 
        nullable=False,
        doc="Baja lógica: False bloquea el login inmediatamente."
    )

    usu_imagen_url: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True,
        doc="URL del avatar almacenado en Cloudflare R2 o almacenamiento local."
    )

    usu_direccion: Mapped[Optional[str]] = mapped_column(
        String(255), 
        nullable=True,
        doc="Dirección textual de entrega o residencia."
    )

    usu_ubicacion: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True,
        doc="Coordenadas GPS (Latitud, Longitud) para ruteo en mapas."
    )

    # =========================================================================
    # Relaciones Especializadas (1 a 1)
    # =========================================================================
    rel_cliente: Mapped[Optional["ClienteModel"]] = relationship(
        "ClienteModel",
        back_populates="rel_usuario",
        uselist=False,
        cascade="all, delete-orphan",
        doc="Perfil extendido si el usuario opera como comprador."
    )

    rel_funcionario: Mapped[Optional["FuncionarioModel"]] = relationship(
        "FuncionarioModel",
        back_populates="rel_usuario",
        uselist=False,
        cascade="all, delete-orphan",
        doc="Perfil extendido si el usuario opera como empleado del negocio."
    )