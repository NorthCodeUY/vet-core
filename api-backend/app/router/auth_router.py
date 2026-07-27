# /api-beckend/app/router/auth_router.py

from app.models import imagen_url_model
from fastapi import APIRouter, Depends, HTTPException, status, Body, Form, File # Importo las dependencias necesarias 
from typing import Optional

from sqlalchemy.orm import Session  # Importo la sesion de la base de datos 

from app.database import get_db # Importo la sesion de la base de datos
from app.models.user_model import UserModel  # Trae la tabla Usuario
from app.models.cliente_model import ClienteModel # Trae la tabla Clientes 

# Es normal importar funciones de seguridad aquí, pero si no te gusta visualmente,
# podés encapsularlas en un "AuthService" dentro de app/services/auth_service.py
from app.security import hash_password, verify_password, create_access_token
from pydantic import BaseModel
# Cambiamos las importaciones al nuevo directorio de esquemas

from sqlalchemy.orm import Session 

# Para subir archivos desde el front  para la foto de perfil de los clietes 
from fastapi import UploadFile, File

from app.schemas.user_schema import UserRegisterSchema, LoginRequestSchema


router = APIRouter(prefix="/auth", tags=["Autenticación"])  # Sirve para agrupar todas las rutas de ese archivo bajo una misma categoría


@router.post("/register/cliente", 
    status_code=status.HTTP_201_CREATED
    )
async def register(
    user_data: UserRegisterSchema = Body(...), # Describe la estructura de el Jeison de Usuario 
    db: Session = Depends(get_db) # Base de datos 
    ): 

        # print("llego aca Registro -------------------------") # <!> Sacar luego que cumpla su funcion

        # <!> Aca deberia que los campos requeridos allan sido enviados

        # Valiar el password
        if len(user_data.password) < 6:
            raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")
        
        # 1. Validación de WhatsApp (que ahora es tu ID principal)
        if db.query(UserModel).filter(UserModel.usu_whatsapp == user_data.whatsapp).first():
            raise HTTPException(status_code=400, detail="WhatsApp ya registrado")

        try: 
  
            # <!> Sacar esto version anterior no permite archivos fotos           
            # Agrego campos obligatorios
            nuevo_usuario = UserModel(
                usu_whatsapp=user_data.whatsapp,
                usu_nombre=user_data.nombre,
                usu_nombre_mostrar=user_data.nombre_mostrar,
                usu_password_hash=hash_password(user_data.password),
                usu_rol='cliente'
            )

            # Agregamos los opcionales solo si existen
            # <!> Esto no se si es necesario creo que si el campo
            # biene sin datos no hay que validarlo simplmente lo mete 
            # sin datos no se 
            if user_data.email:
                nuevo_usuario.usu_email = user_data.email
            if user_data.direccion:
                nuevo_usuario.usu_direccion = user_data.direccion
            if user_data.ubicacion:
                nuevo_usuario.usu_ubicacion = user_data.ubicacion
        
            db.add(nuevo_usuario) # Agregar el nuevo usuario a la base de datos 
            db.flush() # Confirmar la transaccion a BD

            # 3. Crear Cliente
            nuevo_cliente = ClienteModel(
                cli_id=nuevo_usuario.usu_id # ID del cliente relacionadas con su usario 
            )
            db.add(nuevo_cliente) # Agregar el nuevo cliente a la base de datos 
            db.commit() # Confirmar la transaccion a BD



            # 5. Token (sub es el whatsapp)
            token = create_access_token({"sub": nuevo_usuario.usu_whatsapp}) # Generar el token 
        
            return { # <!>  Agrege el id para que en la otra cosulta pude agregar la imagen lo que no me queda claro como manda el tokn al fronte ni como funciona pra la secion 
                "access_token": token,
                "token_type": "bearer",
                "user": {"nombre": nuevo_usuario.usu_nombre, 
                        "whatsapp": nuevo_usuario.usu_whatsapp,
                        "id": nuevo_usuario.usu_id}
             }
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

# <!> Ejemlo como retorna la informacion 
# {
#     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTkxMjM0NTYiLCJleHAiOjE3ODQzMDI4Njh9.xGFWNByOFKPZhGHml5Fk2bkFg63HNAnKWCOWZAN6Tsg",
#     "token_type": "bearer",
#     "user": {
#         "nombre": "Ary Gimenez",
#         "whatsapp": "099123456",
#         "id": 1
#     }
# }

@router.post("/upload-avatar/{user_id}")
async def upload_avatar(
    user_id: int, 
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
    ):

    # Verificamos si el usuario existe
    user = db.query(UserModel).filter(UserModel.usu_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Guardar foto si viene
    file_path = None # Para guardar la foto de perfil del cliente 
    if file: # Si el cliente envia una foto 
        file_path = f"app/static/clientes/Cli_{user_id}.png"
        with open(file_path, "wb") as buffer: # Escribir la foto en el archivo 
            buffer.write(await file.read()) # Leer la foto  
    return {"message": "Foto subida"}
    
    
            

@router.post(
    "/login", 
    status_code=status.HTTP_200_OK,
    summary="Autentica un usuario y devuelve su token JWT de sesión"
)
def login(creds: LoginRequestSchema, db: Session = Depends(get_db)):
    """
    Valida las credenciales del usuario.
    Si son correctas, emite un JWT que el dispositivo recordará para futuras peticiones.
    """
    # Buscamos el registro en la tabla de credenciales
    user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    
    # Mitigación de seguridad: Usamos un mensaje genérico para no dar pistas de si el email existe o no
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException( # Error 401 - Porque no se pudo autenticar  
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="WhatSapp o contraseña incorrectos."
        )
    
    # Generamos el token JWT. Este es el que el celular/navegador mantendrá guardado.
    token = create_access_token({"sub": user.email}) # <!> Esto creo que tendria que ser whatsapp 
    
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "email": user.email
        }
    }



# <!> No se si el situiete metodo esta bien dejo el de arriba y luego lo reviso  

# @router.post("/login") 
# def login(creds: LoginRequestSchema, db: Session = Depends(get_db)):
    
#     # 1. BUSCAR AL USUARIO: 
#     # El usuario envía su email. Buscamos en la base de datos si alguien tiene ese email.
#     user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    
#     # 2. VALIDAR (La parte crítica):
#     # Si no encontramos al usuario O la contraseña no coincide con el hash en la DB...
#     if not user or not verify_password(creds.password, user.password_hash):
#         # ...entonces rechazamos el acceso.
#         raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
#     # 3. GENERAR EL TOKEN (El "Pasaporte"):
#     # Si la contraseña es correcta, creamos un JWT (un string cifrado) que contiene su identidad.
#     token = create_access_token({"sub": user.email})
    
#     # 4. RESPUESTA:
#     # Le devolvemos el token y sus datos básicos al frontend para que los guarde.
#     return {
#         "access_token": token, 
#         "token_type": "bearer", 
#         "user": {"id": user.id, "nombre": user.nombre}
#     }