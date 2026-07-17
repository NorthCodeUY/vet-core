# api-backend/app/models/producto_model.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey # Importación de tipos de datos de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy

class ProductoModel(Base): # Clase que representa la tabla "producto" en la base de datos
    """
    Modelo de la tabla "producto" en la base de datos.
    
    Args:
        prod_id (int): ID del producto que realiza el pedido
        prod_nombre (str): Nombre del producto que realiza el pedido
        prod_descripcion (str): Descripción del producto
        prod_precio (float): Precio actual del producto
        prod_stock (int): Stock actual del producto
        cat_id (int): ID de la categoría que realiza el pedido
    """
    
    __tablename__ = "producto" # Nombre de la tabla en la base de datos
    
    # ==========================================
    # Columnas de la tabla "producto"
    # ==========================================  
    prod_id = Column(Integer, primary_key=True, index=True) # Columna "prod_id" de tipo entero, llave primaria e indexada
    prod_nombre = Column(String, nullable=False) # Columna "prod_nombre" de tipo string, no puede ser nula
    prod_descripcion = Column(String) # Columna "prod_descripcion" de tipo string
    prod_precio = Column(Float) # Columna "prod_precio_actual" de tipo float
    prod_stock = Column(Integer) # Columna "prod_stock" de tipo entero
    cat_id = Column(Integer, ForeignKey("categoria.cat_id"), nullable=False) # ID de la categoría que realiza el pago
    
    # ==========================================
    # Relaciones con otras tablas
    # ==========================================  

    # Relacion con la tabla imagen_url 
    # donde guardo la ruta a las imagenes 
    rel_imagen_url = relationship(
        "ImagenUrlModel" # Nombre de la clase del modelo "ImagenUrlModel"
        # <!> no VA , back_populates="rel_producto" # Nombre de la relacion con la tabla "producto_model"      
    ) 
    
    # Relacion tabla subcategoria
    rel_subcategoria = relationship(
        "ProductoSubCategoriaModel" # Nombre de la clase del modelo "ProductoSubCategoriaModel"
        # <!> No va porque de 1 a muchos back_populates="rel_producto" # Nombre de la relacion con la tabla "producto_model"     
    ) 
    
    # Relacion con la categoria
    rel_categoria = relationship(
        "CategoriaModel" # Nombre de la clase del modelo "CategoriaModel" 
        # <!> No va porque de 1 a muchos back_populates="rel_producto" # Nombre de la relacion con la tabla "producto_model"
    )
