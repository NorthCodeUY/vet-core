# api-backend/app/security.py
"""
=============================================================================
MÓDULO DE SEGURIDAD CRIPTOGRÁFICA (BCRYPT NATIVO + JWT)
=============================================================================
Funciones utilitarias para hashing de credenciales y generación/validación
de tokens JSON Web Token (JWT) con algoritmos estándar.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional
import bcrypt
from jose import jwt, JWTError
from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña en texto plano coincide con el hash almacenado."""
    try:
        password_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except (ValueError, TypeError):
        return False


def get_password_hash(password: str) -> str:
    """Genera el hash Bcrypt de forma nativa truncando a 72 bytes según el estándar Blowfish."""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")


# Alias de compatibilidad hacia atrás
hash_password = get_password_hash


def create_access_token(
    data: dict[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Genera y firma un token JWT con tiempo de expiración y claims de identidad.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decodifica y valida la firma y vigencia de un token JWT.
    Retorna el payload como diccionario o None si es inválido/expirado.
    """
    try:
        payload: dict[str, Any] = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None