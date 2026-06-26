# /api-backend/app/database.py

from sqlalchemy import create_engine # El conector
from sqlalchemy.orm import sessionmaker # La fabrica de sesiones
from sqlalchemy.ext.declarative import declarative_base # El traductor de clases a tablas
from typing import Generator # Tipo para indicar que la función devuelve un generador
import os # Importación de la librería OS

# Configuración de la base de datos MySQL
USER = "ary"
PASSWORD = "hmq7381"
HOST = "localhost" # 'db' es el nombre del servicio en tu docker-compose
PORT = "5432"
DB_NAME = "vet_db"


# 🔌 Configuración de la base de datos
DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL) # Motor de la base de datos

#Configuramos como quermos la sesion
SessionLocal = sessionmaker(autocommit=False, #  No hace cambios amenos que se de la orden (db.commit())
                            autoflush=False, # Evita que se envíen cambios a la base de datos antes de que tú lo pidas.
                            bind=engine)

# Clase base para los modelos ORM
Base = declarative_base()

# Función que proporciona una secion de base de datos
# funciona como grifo de agua, abre y cierra la conexion
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ¡NUEVA FUNCIÓN PARA EL SCHEDULER! --- codigo comentando para ejemplo de como usar alembic
# def get_db_session_for_scheduler() -> SessionLocal:
#     ""
#     O"btiene una sesión de base de datos directamente para el scheduler.
#     El scheduler es responsable de cerrar esta sesión si se le pasa directamente.
#     """
#     return SessionLocal()
# # ------------------------------------------