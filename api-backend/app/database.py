# api-backend/app/database.py
"""
=============================================================================
MOTOR DE PERSISTENCIA Y GESTIÓN DE SESIONES (SQLALCHEMY 2.0)
=============================================================================
Configuración del Engine, Pool de conexiones y generador de sesiones transaccionales.
Completamente agnóstico: la resolución de red depende 100% de las variables de entorno.
"""

import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from app.config import settings

# =============================================================================
# 1. BASE DECLARATIVA (Sintaxis Moderna SQLAlchemy 2.0)
# =============================================================================
class Base(DeclarativeBase):
    """Clase base para todos los modelos ORM del sistema."""
    pass


# =============================================================================
# 2. AUDITORÍA DE PICOS DE TRÁFICO Y POOL DE CONEXIONES
# =============================================================================
# Si el pool se satura y usa conexiones 'max_overflow', lo imprime en consola/Docker
if settings.ENV_MODE == "development":
    # Muestra advertencias de saturación de pool en la terminal
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)


# =============================================================================
# 3. CONFIGURACIÓN DEL MOTOR (ENGINE)
# =============================================================================
# La URL se resuelve limpiamente desde settings sin condicionales hardcodeados
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,    # Comprueba que la conexión siga viva antes de entregarla (evita fallos por timeout)
    pool_size=10,          # Mantiene 10 conexiones persistentes abiertas en memoria
    max_overflow=20,       # Admite hasta 20 conexiones extras dinámicas durante picos de tráfico
    pool_use_lifo=True,    # Reutiliza la conexión usada más recientemente (optimiza el cache de PostgreSQL)
    echo=False             # En True solo para depurar queries SQL en consola
)


# =============================================================================
# 4. FÁBRICA DE SESIONES
# =============================================================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# =============================================================================
# 5. DEPENDENCY INJECTION (FastAPI get_db)
# =============================================================================
def get_db() -> Generator[Session, None, None]:
    """
    Generador de contexto para endpoints de FastAPI.
    Garantiza que toda sesión abierta se cierre obligatoriamente al responder la petición,
    retornando la conexión física al pool sin fugas de memoria.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()