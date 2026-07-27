# /api-backend/app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Definición de Base (Debe estar arriba para evitar errores de importación en modelos)
Base = declarative_base()

# Lógica de detección de Host (Agnóstica al entorno)
# Si 'IS_DOCKER' es true, usamos el nombre del servicio definido en docker-compose.
# De lo contrario, usamos lo que diga el .env (localhost para desarrollo manual).
is_docker = os.getenv("IS_DOCKER", "false").lower() == "true"

if is_docker: 
    # Nombre del servicio PostgreSQL en la red interna de Docker
    db_host = "db-vet_bel"
else:
    # Si estamos en local, usamos lo que diga el .env (localhost)
    db_host = settings.db_host


# # Construimos la URL desde settings<!> (Se puede borrar)
# DATABASE_URL = f"postgresql://" + \
#                 f"{settings.db_user}:{settings.db_password}@{db_host}:{settings.db_port}/{settings.db_name}"


# Construimos la URL de la base de datos con comentarios por componente
DATABASE_URL = (
    "postgresql://"
    f"{settings.db_user}:"      # Usuario de PostgreSQL
    f"{settings.db_password}@"  # Contraseña
    f"{db_host}:"               # Host (ej. 'db' en Docker o 'localhost')
    f"{settings.db_port}/"      # Puerto (ej. 5432)
    f"{settings.db_name}"       # Nombre de la base de datos
)


# Configuración del Motor de SQLAlchemy (Optimizado para Producción)
engine = create_engine(
    DATABASE_URL,          # URL de la base de datos
    pool_pre_ping=True,    # Verifica la salud de la conexión antes de usarla
    pool_size=10,          # Mantiene 10 conexiones abiertas para rapidez
    max_overflow=20,       # Permite hasta 20 conexiones extra en picos de tráfico <!> Es posible pasarme a un log o algo con dockerpa ver los picos de travicos 
    pool_use_lifo=True,    # Mejora el rendimiento reutilizando la conexión más reciente
    echo=False             # Cambiar a True solo para debugging de SQL
)

# Fábrica de Sesiones
SessionLocal = sessionmaker(
    autocommit=False,   # Evita que la base de datos guarde automaticamente los cambios
    autoflush=False,    # Evita que la base de datos guarde automaticamente los cambios
    bind=engine         # Enlaza la sesion con el motor
    )                   

# Base = declarative_base()

def get_db():
    """
    Generador de sesiones de base de datos. 
    Garantiza el cierre de la conexión al finalizar la petición.
    """
    db = SessionLocal() # Crea una instancia de SessionLocal
    try:
        yield db # Espera a que se complete la peticion
    finally:
        db.close() # Cierra la conexion

# Ejemplo de uso

# from app.database import get_db
# from app.models import Categoria

# def read_categorias():
#     db = get_db()
#     categorias = db.query(Categoria).all()
#     return categorias