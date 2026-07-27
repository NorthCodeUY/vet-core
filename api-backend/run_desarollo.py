# api-backend/run_desarollo.py
import uvicorn
from app.config import settings

if __name__ == "__main__":
    # Mensajes informativos para saber qué está pasando al arrancar
    print(f"--- VetCore Backend Startup ---")
    print(f"MODO: {settings.env_mode}")
    print(f"PUERTO: {settings.app_port}")
    print(f"BASE_URL: {settings.base_url}")
    print(f"-------------------------------")

    # Ejecutamos uvicorn programáticamente
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=settings.app_port, 
        reload=True if settings.env_mode == "development" else False,
        workers=1 # En desarrollo siempre 1 worker para que el reload funcione bien
    )