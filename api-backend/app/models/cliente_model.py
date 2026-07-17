# api-backend/app/models/clietes_model.py


from sqlalchemy import Column, Integer, String, ForeignKey, Float # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy

class ClienteModel(Base): # Clase que representa la tabla "cliente" en la base de datos
    """
    Modelo de la tabla "cliente" en la base de datos.
    
    Args:
        cli_id (int): ID del cliente que realiza el pedido
        cli_deuda (float): Deuda actual del cliente
    """
    __tablename__ = "clientes" # Nombre de la tabla en la base de datos

    # ==========================================
    # Columnas de la tabla "clientes"
    # ==========================================

    cli_id = Column(Integer, ForeignKey("usuarios.usu_id"), primary_key=True) # ID del cliete relacionado con su usario 
    cli_deuda = Column(Float, default=0.0) # Deuda actual del cliente
    
    # ==========================================
    # RELACIONES
    # ==========================================

    # Relacion con taba usuarios
    rel_usuario = relationship(
        "UserModel", # Modelo con el que se relaciona
        back_populates="rel_cliente",  # Parametro para poder acceder a la relacion desde la tabla "usuario"
        primaryjoin="ClienteModel.cli_id == UserModel.usu_id" # Condicion de la relacion
    )
    
    # Relacion con la tabla "pedido"
    rel_pedido = relationship(
        "PedidoModel", # Nombre de la clase del modelo "PedidoModel" 
        back_populates="rel_cliente", # Parametro para poder acceder a la relacion desde la tabla "pedido"
        primaryjoin="ClienteModel.cli_id == PedidoModel.cli_id" # Condicion de la relacion
    ) 
