# En app/router/pedido_router.py (o donde proceses la compra)
from app.services.whatsapp_service import whatsapp_service #  Importa el servicio de WhatsApp
from fastapi import APIRouter, Depends # Importa APIRouter y Depends
from sqlalchemy.orm import Session # Importa Session
from app.database import get_db # Necesario para la conexión con la base de datos
from app.models import ClienteModel 
from fastapi import HTTPException #  Necesario para devolver errores 404, 500, etc

router = APIRouter() # Creacion del router 

@router.post("/confirmar-compra") 
def confirmar_compra(pedido_data: dict):
    # ... lógica para guardar el pedido en Postgres ...
    
    # Generamos el mensaje
    mensaje = f"Hola {pedido_data['nombre']}, gracias por tu compra en Veterinaria Beltrameli. Tu pedido ID: {pedido_data['id']} está siendo preparado."
    
    # Obtenemos el link para que el cliente pueda abrirlo
    link = whatsapp_service.generar_link_pedido(pedido_data['whatsapp'], mensaje)
    
    return {"status": "pedido_creado", "whatsapp_link": link}


from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Inicializamos el router (en producción se suele estructurar por módulos)
router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

# ==========================================
# ESQUEMAS DE VALIDACIÓN (Pydantic)
# ==========================================

class ConfirmarCompraSchema(BaseModel):
    """
    Esquema que define y valida los datos necesarios para confirmar un pedido.
    FastAPI lo usa para validar el JSON entrante de forma automática.
    """
    id: int = Field(..., description="ID único del pedido generado por la base de datos.")
    nombre: str = Field(..., min_length=2, description="Nombre del cliente que realiza la compra.")
    whatsapp: str = Field(..., description="Número de WhatsApp del cliente con formato internacional (ej: 59899123456).")

    class Config:
        # Ejemplo para la documentación interactiva de Swagger (/docs)
        json_schema_extra = {
            "example": {
                "id": 1054,
                "nombre": "Juan Pérez",
                "whatsapp": "59899123456"
            }
        }


# ==========================================
# ENDPOINTS / RUTAS
# ==========================================

@router.post(
    "/confirmar-compra", 
    status_code=status.HTTP_201_CREATED,
    summary="Confirma una compra y genera enlace de WhatsApp",
    response_description="Retorna el estado de la operación y el link de redirección"
)


def confirmar_compra(pedido_data: ConfirmarCompraSchema):
    """
    Procesa la confirmación de una compra en la plataforma de la veterinaria.
    
    **Flujo de la función:**
    1. Recibe y valida los datos del pedido mediante el esquema `ConfirmarCompraSchema`.
    2. Guarda la información correspondiente en la base de datos PostgreSQL.
    3. Construye un mensaje personalizado para el cliente.
    4. Solicita al servicio externo de WhatsApp la creación de un enlace directo.
    
    **Errores comunes:**
    - `422 Unprocessable Entity`: Si falta algún campo o el tipo de dato es incorrecto.
    - `500 Internal Server Error`: Si falla la persistencia en la base de datos o el servicio de WhatsApp.
    """
    try:
        #<!> por lo que enteido esto engo que programarlo yo ??



        #  TODO: Implementar la persistencia real en Postgres utilizando un ORM (como SQLAlchemy o SQLModel)
        # Ejemplo conceptual: 
        # db_pedido = PedidoRepository.guardar(pedido_data)
        pass 
        
        # <!> Construcción del mensaje predefinido para la API de WhatsApp.
        # <!> Al usar Pydantic, accedemos a las propiedades como atributos del objeto (.nombre, .id), no como diccionario.
        mensaje = ( # <!> Esto del mensaje estaria bueno tnerlo en alguan lado jutno para modificar facil el comportamiento de los mensajs me encantaria ingegrar uh chatbon con ia leugo para la parte de ventas 

            f"Hola {pedido_data.nombre}, gracias por tu compra en Veterinaria Beltramelli. "
            f"Tu pedido ID: {pedido_data.id} está siendo preparado."
        )
        
        # Delegamos la responsabilidad de estructurar la URL al servicio especializado.
        # Buenas prácticas: El controlador/ruta no debe saber CÓMO se construye la URL, solo la solicita.
        link = whatsapp_service.generar_link_pedido(pedido_data.whatsapp, mensaje) # <!> NO lo rengo claro
        
        # Retornamos una estructura limpia. El código 201 (Created) mapea mejor con una acción POST exitosa.
        return {
            "status": "pedido_creado", 
            "whatsapp_link": link
        }
        
    except Exception as e:
        # En caso de fallas inesperadas (DB caída, error de red), capturamos y lanzamos un error HTTP limpio.
        # Evita exponer trazas internas de error al cliente por motivos de seguridad.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error interno al procesar la confirmación del pedido."
        )


# <!> Este no va a funcionar porque el model de usario teien los datos pero por hoara dejalo asi queir continuar 
@router.get("/clientes/por-token/{token}")
def get_cliente_by_token(token: str, db: Session = Depends(get_db)): # metodo para obtener los datos del cliente por el token de su email 
    cliente = db.query(ClienteModel).filter(ClienteModel.cli_token == token).first()# aca busca en la tabla de clientes al usuario por el token 
    
    if not cliente: # si el cliente no se encuentra se genera un error 404
        # Si no hay nadie con ese token, devolvemos error 404
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # Devolvemos SOLO los datos necesarios (OJO: No devolvemos el token por seguridad)
    return {
       # "nombre": usuario.cli_nombre,
        "whatsapp": cliente.cli_whatsapp,
        "direccion": cliente.cli_direccion,
        "id": cliente.cli_id # Necesitamos el ID para guardar el pedido
    }


    # http://localhost:8000/api/clientes/por-token/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzb2ZpYTIzQGdtYWlsLmNvbSIsImV4cCI6MTc1MzIzNTAxMn0.FqPuvYq163eG7_oM78854W0bVwG735gX9c90p_r1y9M"