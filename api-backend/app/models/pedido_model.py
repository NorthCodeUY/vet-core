# api-backend/app/models/pedido_model.py

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship

class PedidoModel(Base):
    """
    Modelo de la tabla "pedido" en la base de datos.
    
    Args:
        ped_id (int): ID del pedido que realiza el pedido
        cli_id (int): ID del cliente que realiza el pedido
        ped_fecha_emision (datetime): Fecha de emision del pedido
        ped_codigo_qr (str): Codigo QR para entrega del pedido
        ped_direccion (str): Direccion de entrega del pedido
        ped_estado (str): Estado del pedido
        ped_total (float): Total del pedido
        ped_pagado (bool): Estado del pedido
    """
    __tablename__ = "pedido" # Tabla para almacenar los pedidos
    ped_id = Column(Integer, primary_key=True, index=True)
    cli_id = Column(Integer, ForeignKey("cliente.cli_id")) # ID del cliente que realiza el pedido
    ped_fecha_emision = Column(DateTime) # Fecha de emision del pedido
    ped_codigo_qr = Column(String) # Codigo QR para entrega del pedido
    ped_direccion = Column(String) # Direccion de entrega del pedido
    ped_estado = Column(String) # Estado del pedido
    ped_total = Column(Float) # Total del pedido
    ped_pagado = Column(Boolean) # Estado del pedido

    # Relaccion con la tabla 
    rel_cliente = relationship("ClienteModel", back_populates="rel_pedido") 
    rel_pedido_detalle = relationship("PedidoDetalleModel") 
    rel_pago = relationship("PagoModel") 