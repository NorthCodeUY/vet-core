# api-backend/app/models/pago_model.py

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean # Importación de tipos de datos de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy import ForeignKey # Importación de la clase ForeignKey de SQLAlchemy

class PagoModel(Base): # Clase que representa la tabla "pago" en la base de datos
    """
    Modelo de la tabla "pago" en la base de datos.
    
    Args:
        pago_id (int): ID del pago que realiza el pago
        ped_id (int): ID del pedido que realiza el pago
        pago_monto (float): Monto del pago
        pago_fecha (datetime): Fecha del pago
        pago_metodo (str): Método de pago
        pago_referencia (str): Referencia del pago
    """
    __tablename__ = "pago" # Nombre de la tabla en la base de datos
    

    # ==========================================
    # Columnas de la tabla "pago"
    # ==========================================
    
    pago_id = Column(Integer, primary_key=True, index=True) # ID del pago que realiza el pago
    ped_id = Column(Integer, ForeignKey("pedido.ped_id"), nullable=False) # ID del pedido que realiza el pago
    pago_monto = Column(Float, nullable=False) # Monto del pago
    pago_fecha = Column(DateTime, nullable=False) # Fecha del pago
    pago_metodo = Column(String, nullable=False) # Método de pago
    pago_referencia = Column(String) # Referencia del pago

    # ==========================================
    # RELACIONES
    # ==========================================

    # Relacion con tabla pedido
    rel_pedido = relationship(
        "PedidoModel",
        back_populates="rel_pago"
    )