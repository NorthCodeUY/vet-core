# api-backend/app/models/funcionario_model.py


from sqlalchemy import Column, Integer, String, ForeignKey # Importación de tipos de datos de SQLAlchemy
from app.database import Base # Importación de la clase base de SQLAlchemy
from sqlalchemy.orm import relationship # Importación de la clase relationship de SQLAlchemy

class FuncionarioModel(Base): # Clase que representa la tabla "funcionario" en la base de datos
    """
    Modelo de la tabla "funcionario" en la base de datos.
    
    Args:
        fun_id (int): ID del funcionario que realiza el pedido
    """
    __tablename__ = "funcionarios" # Nombre de la tabla en la base de datos
    fun_id = Column(Integer, ForeignKey("usuarios.usu_id"), primary_key=True) # ID del cliete relacionado con su usario 

    # Relacion ----
    
    rel_usuario = relationship("UserModel") # Relacion con la tabla "usuario"

