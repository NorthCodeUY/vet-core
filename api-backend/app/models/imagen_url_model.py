# /api-backend/app/models/imagen_url_model.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean  # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy

class ImagenUrlModel(Base): # Clase que representa la tabla "imagen_url" en la base de datos
    """
    Modelo de la tabla "imagen_url" en la base de datos.
    
    Args:
        img_id (int): ID de la imagen que realiza el pedido
        prod_id (int): ID del producto que realiza el pedido
        img_url (str): URL de la imagen
    """
    
    __tablename__ = "imagen_url" # Nombre de la tabla en la base de datos
    img_id = Column(Integer, primary_key=True, index=True) # ID de la imagen que realiza el pedido
    prod_id = Column(Integer, ForeignKey("producto.prod_id")) # ID del producto que realiza el pedido
    img_url = Column(String, nullable=False) # URL de la imagen
    img_principal = Column(Boolean, default=False) # Determina cual es la imagen principal
