# api-backend/run_desarrollo.py
import sys
import os
import uvicorn
from dotenv import load_dotenv

TENANTS = {
    "veterinaria": ".env.veterinaria",
    "flordeloto": ".env.flordeloto"
}

def main():
    """ 
    Ejecuta el servidor de desarrollo de FastAPI. 
    """
    if len(sys.argv) < 2 or sys.argv[1] not in TENANTS: # si no se pasa ningun argumento o no es ninguno de los tenants
        print(f"Uso: python run_desarrollo.py [{' | '.join(TENANTS.keys())}]") # muestra los tenants disponibles
        sys.exit(1) # sale del programa con error 1

    tenant_key = sys.argv[1] # tenant_key es el primer argumento que se pasa por consola
    env_path = TENANTS[tenant_key] # env_path es el path del archivo .env que se pasa por consola

    if not os.path.exists(env_path): # si no existe el archivo .env
        print(f"Error: Archivo de configuración {env_path} no existe.")
        sys.exit(1)

    # Carga de variables de entorno del tenant específico
    load_dotenv(dotenv_path=env_path, override=True)

    # Forzar modo no docker para ejecución en host local
    os.environ["IS_DOCKER"] = "false" # false porque se ejecuta en host local
    os.environ["DB_HOST"] = "localhost" # localhost porque se ejecuta en host local

    port = int(os.getenv("APP_PORT", 8000)) # puerto por defecto 8000
    print(f"[*] Iniciando Backend Tenant: [{tenant_key.upper()}] en http://localhost:{port}") # muestra el tenant y el puerto
    
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) # ejecuta uvicorn

if __name__ == "__main__":
    main()