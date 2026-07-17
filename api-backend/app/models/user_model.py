# api-backend/app/models/user_model.py

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class UserModel(Base):
    """
    Modelo de la tabla "usuarios" en la base de datos.
    
    Args: <!> arreglarlo cuandoande 

        usu_id (int): ID del usuario que realiza el pago
        usu_nombre (str): Nombre del usuario que realiza el pago
        usu_email (str): Email del usuario que realiza el pago
        usu_password_hash (str): Contraseña del usuario que realiza el pago
        usu_rol (str): Rol del usuario
        
    """
    __tablename__ = "usuarios"
    
    # ==========================================
    # Columnas de la tabla "usuarios"
    # ==========================================
    usu_id = Column(Integer, primary_key=True, index=True)  # ID del usuario que realiza el pago
    usu_nombre = Column(String(100), nullable=False)  # Nombre del usuario que realiza el pago
    usu_nombre_mostrar = Column(String(100), nullable=False)  # Nombre del usuario que realiza el pago
    usu_email = Column(String(100), unique=True, index=True, nullable=False) # Email del usuario que realiza el pago
    usu_password_hash = Column(String(255), nullable=False) # Contraseña del usuario que realiza el pago 
    usu_whatsapp = Column(String(20), unique=True, index=True, nullable=False) # WhatsApp del usuario que realiza el pago
    # Añadimos un rol para saber qué tipo de usuario es (ej: "cliente", "admin", "veterinario")
    usu_rol = Column(String(20), nullable=False, default="cliente")
    usu_imagen_url = Column(String, nullable=True) # URL de la imagen del usuario
    usu_direccion = Column(String, nullable=True) # Texto que muestra la direccion 
    usu_ubicacion = Column(String, nullable=True) # Punto gps para trabajar con Google maps 
     
    # ==========================================
    # RELACIONES BIDIRECCIONALES (1 a 1)
    # ==========================================
    
    # Un usuario que es cliente tendrá este perfil poblado (uselist=False)
    rel_cliente = relationship(
        "ClienteModel", # Nombre de la clase del modelo "ClienteModel"
        back_populates="rel_usuario", # Nombre de la relacion con la tabla "cliente_model"
        uselist=False, # False porque es una relacion 1 a 1
        cascade="all, delete-orphan" # Si borrás el usuario, borra el perfil cliente asociado
    )
    
    # Un usuario que es funcionario tendrá este perfil poblado (uselist=False)
    rel_funcionario = relationship(
        "FuncionarioModel", # Nombre de la clase del modelo "FuncionarioModel"
        back_populates="rel_usuario", # Nombre de la relacion con la tabla "funcionario_model"  
        uselist=False, # False porque es una relacion 1 a 1
        cascade="all, delete-orphan" # Si borrás el usuario, borra el perfil de funcionario
    )

