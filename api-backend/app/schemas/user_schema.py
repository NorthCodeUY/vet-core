
# /api-backend/app/schemas/user_schema.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegisterSchema(BaseModel): # <!> NO lo puedo usar porque no permite archvios 
    """Esquema estricto para validar el registro de un nuevo cliente."""
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre de usari en cliete es el whatsapp si no tiene email")
    nombre_mostrar: str = Field(..., min_length=2, max_length=100, description="Nombre que se muestra en el perfil")
    email: str = Field(..., description="Correo electrónico único del usuario") 
    password: str = Field(..., min_length=6, description="Contraseña de acceso (mínimo 6 caracteres) Numero Watsap ")
    whatsapp: str = Field(..., description="Número de WhatsApp con formato internacional lo uso par crear cuenta  (ej: 59899123456)")
    direccion: Optional[str] = Field(None, description="Dirección del cliente"),
    ubicacion: Optional[str] = Field(None, description="Ubicación del cliente Para usar google o alguna palicacion de mapa "),
    rol: str = Field(..., description="Esto por haor es Cliente, Funcionario"),



{
  "nombre": "Ary Gimenez",
  "nombre_mostrar": "Ary",
  "email": "argi.prog@gmail.com",
  "password": "hmq7831",
  "whatsapp": "099123456",
  "direccion": "Arenal Grande 1546",
  "ubicacion": "https://maps.app.goo.gl/MQx8LpKxNGoTVCRu9",
  "rol": "cliente"
}
 
 
class LoginRequestSchema(BaseModel): # <!> Esto no lo entiendo 
    """Esquema para validar las credenciales de inicio de sesión."""
    nombre: EmailStr = Field(..., description="Correo electrónico registrado")
    password: str = Field(..., description="Contraseña en texto plano")


    