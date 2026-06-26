# api-backend/app/models/clietes_model.py

from sqlalchemy import Column, Integer, String # Importación de tipos de datos de SQLAlchemy
from ..database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy

class ClienteModel(Base): # Clase que representa la tabla "cliente" en la base de datos
    """
    Modelo de la tabla "cliente" en la base de datos.
    
    Args:
        cli_id (int): ID del cliente que realiza el pedido
        cli_nombre (str): Nombre del cliente que realiza el pedido
        cli_whatsapp (str): ID único
        cli_token (str): Para sesiones futuras
        cli_direccion (str): Dirección del cliente
    """
    __tablename__ = "cliente" # Nombre de la tabla en la base de datos
    cli_id = Column(Integer, primary_key=True, index=True) # ID del cliente que realiza el pedido
    cli_nombre = Column(String, nullable=False) # Nombre del cliente que realiza el pedido
    cli_whatsapp = Column(String, unique=True, nullable=False) # ID único
    cli_token = Column(String, nullable=True) # Para sesiones futuras
    cli_direccion = Column(String) # Dirección del cliente


    # Relacion inversa con pedido
    rel_pedido = relationship("PedidoModel", back_populates="rel_cliente") # Relacion con la tabla "pedido"
