# api-backend/app/schemas/user_schema.py
"""
=============================================================================
ESQUEMAS PYDANTIC V2: DTOs DE USUARIOS, LOGIN Y REGISTRO
=============================================================================
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequestSchema(BaseModel):
    """Payload para autenticación vía JSON."""
    email: str = Field(..., description="Correo electrónico o WhatsApp del usuario")
    password: str = Field(..., min_length=6, description="Contraseña en texto plano")


class UserRegisterSchema(BaseModel):
    """Payload para registro de clientes."""
    email: EmailStr = Field(..., description="Correo electrónico válido")
    password: str = Field(..., min_length=6, description="Contraseña segura")
    nombre: str = Field(..., min_length=2, max_length=100)
    nombre_mostrar: Optional[str] = Field(default=None, max_length=100)
    whatsapp: Optional[str] = Field(default=None, max_length=20)
    direccion: Optional[str] = Field(default=None, max_length=255)
    ubicacion: Optional[str] = Field(default=None)


class TokenResponseSchema(BaseModel):
    """Respuesta emitida al generar un JWT exitoso."""
    access_token: str
    token_type: str = "bearer"
    usu_id: int
    usu_email: str
    usu_nombre: str
    usu_rol: str
    tenant_type: str

    model_config = ConfigDict(from_attributes=True)