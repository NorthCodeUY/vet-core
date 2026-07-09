# api-backend/app/models/pedido_detalle_model.py

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

# Tabla que almacena los detalles de cada pedido
# Es una tabla asociativa entre pedido y producto
class PedidoDetalleModel(Base):
    """
    Modelo de la tabla "pedido_detalle" en la base de datos.
    
    Args:
        ped_id (int): ID del pedido que realiza el pedido
        prod_id (int): ID del producto que realiza el pedido
        pd_cantidad (int): Cantidad del producto
        pd_precio (float): Precio capturado al momento    
    """
    
    __tablename__ = "pedido_detalle" # Tabla para almacenar los detalles de cada pedido
    ped_id = Column(Integer, ForeignKey("pedido.ped_id"), primary_key=True, index=True) # ID del pedido que realiza el pedido
    prod_id = Column(Integer, ForeignKey("producto.prod_id"), primary_key=True, index=True) # ID del producto que realiza el pedido
    pd_cantidad = Column(Integer) # Cantidad del producto
    pd_precio = Column(Float) # Precio capturado al momento    
    
    # Relaciones de tablas 
    rel_producto = relationship("ProductoModel") # Relacion con la tabla producto
   
