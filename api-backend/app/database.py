# /api-backend/app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Detectamos si corremos en Docker
is_docker = os.getenv("IS_DOCKER", "false") == "true"

if is_docker:
    # Si estamos en docker, usamos el nombre del servicio del compose "db-vet_bel"
    db_host = "db-vet_bel"
else:
    # Si estamos en local, usamos lo que diga el .env (localhost)
    db_host = settings.db_host


# Construimos la URL desde settings
DATABASE_URL = f"postgresql://{settings.db_user}:{settings.db_password}@{db_host}:5432/{settings.db_name}"

# El motor debe llamarse 'engine'
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,    # <--- IMPORTANTE: Valida que la conexión exista antes de usarla
    pool_size=10,          # <--- RECOMENDADO: Conexiones activas
    max_overflow=20,       # <--- RECOMENDADO: Conexiones temporales si hay demanda
    pool_use_lifo=True,    # <--- RECOMENDADO: Usa las conexiones más recientes (mejora rendimiento)
    echo=False             # Poner True solo si quieres ver las queries SQL en consola
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()