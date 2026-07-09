# api-backend/app/models/categoria_model.py

from sqlalchemy import Column, Integer, String # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy

class CategoriaModel(Base): # Clase que representa la tabla "categoria" en la base de datos
    """
    Modelo de la tabla "categoria" en la base de datos.
    
    Args:
        cat_id (int): ID de la categoría que realiza el pedido
        cat_nombre (str): Nombre de la categoría que realiza el pedido
    """
    
    __tablename__ = "categoria" # Nombre de la tabla en la base de datos
    cat_id = Column(Integer, primary_key=True, index=True) # ID de la categoría que realiza el pedido
    cat_nombre = Column(String, unique=True, nullable=False) # Nombre de la categoría que realiza el pedido
