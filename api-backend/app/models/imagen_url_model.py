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
    
    # Define tus tipos aquí
    TIPO_PRODUCTO = "producto"
    TIPO_USUARIO = "usuario"
    
    # ==========================================
    # Columnas de la tabla "imagen_url"
    # ==========================================

    img_id = Column(Integer, primary_key=True, index=True) # ID de la imagen que realiza el pedido
    prod_id = Column(Integer, ForeignKey("producto.prod_id")) # ID del producto que realiza el pedido
    img_url = Column(String, nullable=False) # URL de la imagen
    img_principal = Column(Boolean, default=False) # Determina cual es la imagen principal
    img_tipo = Column(String, nullable=False, default=TIPO_PRODUCTO) # <!>Tipo de imagen que realiza el pedido
    
    # # ==========================================
    # # RELACIONES BIDIRECCIONALES (1 a 1)
    # # ==========================================
    
    # # Relacion con producto 
    # rel_producto = relationship( 
    #     "ProductoModel", # Nombre de la clase del modelo "ProductoModel"
    #     back_populates="rel_imagen_url" # Nombre de la relacion con la tabla "producto_model"      
    # )    