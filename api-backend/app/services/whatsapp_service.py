# /api-backend/app/services/whatsapp_bridge.py
import urllib.parse

class WhatsAppService:
    def __init__(self):
        # En el futuro aquí podrías inicializar tu cliente de WhatsApp
        pass

    def generar_link_pedido(self, telefono: str, mensaje: str) -> str:
        """
        Genera un link de WhatsApp con un mensaje pre-configurado.
        """
        # Codificamos el mensaje para que sea una URL válida
        mensaje_encoded = urllib.parse.quote(mensaje)
        return f"https://wa.me/{telefono}?text={mensaje_encoded}"

    async def enviar_mensaje_webhook(self, telefono: str, mensaje: str):
        """
        Este método se usará cuando tengas un bot o API conectada.
        Por ahora, simplemente imprimimos el log.
        """
        print(f"--- SIMULANDO ENVÍO A {telefono} ---")
        print(f"Mensaje: {mensaje}")
        return True

whatsapp_service = WhatsAppService()