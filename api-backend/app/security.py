# api-backend/app/security.py
"""
=============================================================================
MÓDULO DE SEGURIDAD CRIPTOGRÁFICA (BCRYPT + JWT)
=============================================================================
Funciones utilitarias para hashing de credenciales y generación/validación
de tokens JSON Web Token (JWT) con algoritmos estándar.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings

# Contexto de hashing configurado con Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña en texto plano coincide con el hash almacenado."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Genera el hash Bcrypt a partir de una contraseña en texto plano."""
    return pwd_context.hash(password)


# Alias de compatibilidad hacia atrás
hash_password = get_password_hash


def create_access_token(
    data: Dict[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Genera y firma un token JWT con tiempo de expiración y claims de identidad.
    """
    to_encode = data.copy() # Copia de los datos
    now = datetime.now(timezone.utc) # Tiempo actual

    if expires_delta: # Si se especifica un tiempo de expiración
        expire = now + expires_delta # Tiempo de expiración
    else: # Si no se especifica un tiempo de expiración
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES) # Tiempo de expiración

    to_encode.update({"exp": expire, "iat": now}) # Actualiza el token con el tiempo de expiración y el tiempo actual
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM) # Codifica el token


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodifica y valida la firma y vigencia de un token JWT.
    Retorna el payload como diccionario o None si es inválido/expirado.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None