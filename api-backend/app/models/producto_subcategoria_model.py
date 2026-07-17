# api-backend/app/models/producto_subcategoria_model.py

# Aca creo que va la relacion entre producto y subcategoria

from sqlalchemy import Column, Integer, String # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy import ForeignKey # Importación de la clase ForeignKey de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy

class ProductoSubCategoriaModel(Base): # Clase que representa la tabla "producto_subcategoria" en la base de datos
    """
    Modelo de la tabla "producto_subcategoria" en la base de datos.
    
    Args:
        prod_id (int): ID del producto que realiza el pedido
        subc_id (int): ID de la subcategoria que realiza el pedido
    """
    
    __tablename__ = "producto_subcategoria" # Nombre de la tabla en la base de datos
    prod_id = Column(Integer, ForeignKey("producto.prod_id"), primary_key=True, index=True) # Columna "producto_id" de tipo entero, llave primaria e indexada, referencia a la tabla "producto"
    subc_id = Column(Integer, ForeignKey("subcategoria.subc_id"), primary_key=True, index=True) # Columna "subc_id" de tipo entero, llave primaria e indexada, referencia a la tabla "subcategoria"

    # Relacion con tabal subcategoria
    rel_subcategoria = relationship(
        "SubcategoriaModel", # Nombre de la clase del modelo "SubcategoriaModel" 
        # <!> Creo que este no va -  back_populates="rel_producto" # Nombre de la relacion con la tabla "producto_model"        
    ) 

    @property # Propiedad para obtener el nombre de la subcategoria
    def subc_nombre(self): # Propiedad para obtener el nombre de la subcategoria
        return self.rel_subcategoria.subc_nombre # Retorna el nombre de la subcategoria

    
