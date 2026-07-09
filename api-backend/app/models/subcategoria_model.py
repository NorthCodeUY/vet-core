# api-backend/app/models/subcategoria_model.py

from sqlalchemy import Column, Integer, String # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy

class SubcategoriaModel(Base): # Clase que representa la tabla "subcategoria" en la base de datos
    """
    Modelo de la tabla "subcategoria" en la base de datos.
    
    Args:
        subc_id (int): ID de la subcategoria que realiza el pago
        subc_nombre (str): Nombre de la subcategoria que realiza el pago
    """
    
    __tablename__ = "subcategoria" # Nombre de la tabla en la base de datos
    subc_id = Column(Integer, primary_key=True, index=True) # ID de la subcategoria que realiza el pago
    subc_nombre = Column(String, unique=True, nullable=False) # Nombre de la subcategoria