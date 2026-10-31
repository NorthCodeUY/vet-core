# api-backend/app/router/auth_router.py
"""
=============================================================================
CONTROLADOR HTTP: AUTENTICACIÓN, REGISTRO Y GESTIÓN DE TOKENS (JWT)
=============================================================================
Provee endpoints para login administrativo, registro de clientes por catálogo
y emisión de tokens con claims de rol y contexto de tenant.
"""

from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Body, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select, or_

from app.database import get_db
from app.config import settings
from app.models.user_model import UserModel
from app.models.cliente_model import ClienteModel
from app.security import verify_password, get_password_hash, create_access_token
from app.schemas.user_schema import (
    UserRegisterSchema, 
    LoginRequestSchema, 
    TokenResponseSchema
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])


# =============================================================================
# 1. LOGIN ESTÁNDAR OAUTH2 (SWAGGER / CLI / BACKOFFICE)
# =============================================================================
@router.post(
    "/token", 
    response_model=TokenResponseSchema,
    summary="Login OAuth2 estándar (Form Data)",
    description="Endpoint compatible con Swagger UI. El campo 'username' acepta Email o WhatsApp."
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Autenticación para Swagger UI y clientes OAuth2 estándar."""
    identificador = form_data.username.strip().lower()

    # Búsqueda dual: Permite loguearse con Email o con WhatsApp
    stmt = select(UserModel).where(
        or_(
            UserModel.usu_email == identificador,
            UserModel.usu_whatsapp == identificador
        )
    )
    usuario = db.scalars(stmt).first()

    if not usuario or not verify_password(form_data.password, usuario.usu_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (Email/WhatsApp o contraseña inválidos).",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not usuario.usu_activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario suspendido o dado de baja."
        )

    # Inyección de claims en JWT
    token_claims = {
        "sub": str(usuario.usu_id),
        "email": usuario.usu_email,
        "rol": usuario.usu_rol,
        "tenant_type": settings.TENANT_TYPE
    }

    return {
        "access_token": create_access_token(token_claims),
        "token_type": "bearer",
        "usu_id": usuario.usu_id,
        "usu_email": usuario.usu_email,
        "usu_nombre": usuario.usu_nombre,
        "usu_rol": usuario.usu_rol,
        "tenant_type": settings.TENANT_TYPE
    }


# =============================================================================
# 2. LOGIN JSON PARA EL FRONTEND (REACT / AXIOS)
# =============================================================================
@router.post(
    "/login", 
    response_model=TokenResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Login directo vía JSON para aplicaciones web y móviles"
)
def login_json(
    creds: LoginRequestSchema = Body(...), 
    db: Session = Depends(get_db)
):
    """Endpoint simplificado que recibe un payload JSON tradicional."""
    identificador = creds.email.strip().lower()

    stmt = select(UserModel).where(
        or_(
            UserModel.usu_email == identificador,
            UserModel.usu_whatsapp == identificador
        )
    )
    usuario = db.scalars(stmt).first()

    if not usuario or not verify_password(creds.password, usuario.usu_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email/WhatsApp o contraseña incorrectos."
        )

    if not usuario.usu_activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta ha sido desactivada."
        )

    token_claims = {
        "sub": str(usuario.usu_id),
        "email": usuario.usu_email,
        "rol": usuario.usu_rol,
        "tenant_type": settings.TENANT_TYPE
    }

    return {
        "access_token": create_access_token(token_claims),
        "token_type": "bearer",
        "usu_id": usuario.usu_id,
        "usu_email": usuario.usu_email,
        "usu_nombre": usuario.usu_nombre,
        "usu_rol": usuario.usu_rol,
        "tenant_type": settings.TENANT_TYPE
    }


# =============================================================================
# 3. REGISTRO PÚBLICO DE CLIENTES (CATÁLOGO WEB)
# =============================================================================
@router.post(
    "/register/cliente", 
    response_model=TokenResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Registro de nuevo comprador en tienda web"
)
def register_cliente(
    user_data: UserRegisterSchema = Body(...), 
    db: Session = Depends(get_db)
):
    """
    Registra un usuario con rol 'CLIENTE' y provisiona su registro en 'clientes'.
    Emite inmediatamente el token JWT para dejarlo autenticado tras registrarse.
    """
    # 1. Validación de unicidad de email
    stmt_email = select(UserModel).where(UserModel.usu_email == user_data.email.strip().lower())
    if db.scalars(stmt_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El correo electrónico ya se encuentra registrado."
        )

    # 2. Validación de unicidad de WhatsApp (si lo proporciona)
    if user_data.whatsapp:
        stmt_wpp = select(UserModel).where(UserModel.usu_whatsapp == user_data.whatsapp.strip())
        if db.scalars(stmt_wpp).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="El número de WhatsApp ya pertenece a otra cuenta."
            )

    try:
        # 3. Creación del Usuario Identity
        nuevo_usuario = UserModel(
            usu_email=user_data.email.strip().lower(),
            usu_password_hash=get_password_hash(user_data.password),
            usu_nombre=user_data.nombre.strip(),
            usu_nombre_mostrar=user_data.nombre_mostrar or user_data.nombre.split()[0],
            usu_whatsapp=user_data.whatsapp.strip() if user_data.whatsapp else None,
            usu_direccion=user_data.direccion,
            usu_ubicacion=user_data.ubicacion,
            usu_rol="CLIENTE",
            usu_activo=True
        )
        db.add(nuevo_usuario)
        db.flush()  # Genera nuevo_usuario.usu_id

        # 4. Creación del Perfil Cliente (Relación 1 a 1)
        nuevo_cliente = ClienteModel(cli_id=nuevo_usuario.usu_id)
        db.add(nuevo_cliente)
        
        db.commit()
        db.refresh(nuevo_usuario)

        # 5. Emisión de Token de bienvenida
        token_claims = {
            "sub": str(nuevo_usuario.usu_id),
            "email": nuevo_usuario.usu_email,
            "rol": nuevo_usuario.usu_rol,
            "tenant_type": settings.TENANT_TYPE
        }

        return {
            "access_token": create_access_token(token_claims),
            "token_type": "bearer",
            "usu_id": nuevo_usuario.usu_id,
            "usu_email": nuevo_usuario.usu_email,
            "usu_nombre": nuevo_usuario.usu_nombre,
            "usu_rol": nuevo_usuario.usu_rol,
            "tenant_type": settings.TENANT_TYPE
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error en la transacción de registro: {str(e)}"
        )


# =============================================================================
# 4. CARGA DE AVATAR (COMPATIBLE CON CONTENEDORES DOCKER)
# =============================================================================
@router.post(
    "/upload-avatar/{user_id}",
    summary="Subir imagen de perfil (Fallback local con auto-creación de carpetas)"
)
async def upload_avatar(
    user_id: int, 
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Guarda la foto de perfil en disco local asegurando la existencia de la ruta."""
    usuario = db.get(UserModel, user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Asegura que el directorio exista en el contenedor
    upload_dir = Path("app/static/clientes")
    upload_dir.mkdir(parents=True, exist_ok=True)

    extension = file.filename.split(".")[-1].lower() if file.filename else "png"
    filename = f"avatar_{user_id}.{extension}"
    file_path = upload_dir / filename

    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Actualizar la URL relativa en base de datos
    usuario.usu_imagen_url = f"/static/clientes/{filename}"
    db.commit()

    return {
        "message": "Avatar actualizado exitosamente",
        "avatar_url": usuario.usu_imagen_url
    }