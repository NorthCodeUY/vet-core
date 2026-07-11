# En app/router/pedido_router.py (o donde proceses la compra)
from app.services.whatsapp_service import whatsapp_service
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter() # Creacion del router 

@router.post("/confirmar-compra") 
def confirmar_compra(pedido_data: dict):
    # ... lógica para guardar el pedido en Postgres ...
    
    # Generamos el mensaje
    mensaje = f"Hola {pedido_data['nombre']}, gracias por tu compra en Veterinaria Beltrameli. Tu pedido ID: {pedido_data['id']} está siendo preparado."
    
    # Obtenemos el link para que el cliente pueda abrirlo
    link = whatsapp_service.generar_link_pedido(pedido_data['whatsapp'], mensaje)
    
    return {"status": "pedido_creado", "whatsapp_link": link}