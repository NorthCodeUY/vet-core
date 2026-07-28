# api-backend/app/config.py
from pydantic_settings import BaseSettings  #  Importamos la clase BaseSettings del modulo pydantic_settings para poder crear variables de entorno 
from pydantic_settings import SettingsConfigDict # Importamos la clase SettingsConfigDict para poder configurar el cargador

import os # Importamos el modulo os para poder trabajar con rutas y archivos 
import socket # Importamos el modulo socket para poder obtener la direccion ip local

def obtener_ip_local():
    """Detecta la IP privada de la máquina en la red local (WiFi/Ethernet)"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Sockets son para crear conexiones entre procesos, en este caso para obtener la ip local 
        # No realiza una conexión real, solo sirve para identificar 
        # la interfaz de red activa
        s.connect(("8.8.8.8", 80)) # (Direccion ip, puerto) Se conecta a la ip y puerto de google para obtener la ip local 
        ip = s.getsockname()[0] # Obtiene la direccion ip local
        s.close() # Cierra la conexion
        return ip
    except Exception:
        return "127.0.0.1"


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Busca el directorio padre dos veces para encontrar la raiz del proyecto
ENV_PATH = os.path.join(BASE_DIR, ".env") # Busca el archivo .env en la raiz del proyecto

class Settings(BaseSettings):
    """ Variables de entorno cargadas desde .env """

    # Datos Base de datos 
    db_user: str # Usuario de la base de datos 
    db_password: str # Contraseña de la base de datos
    db_host: str # Host de la base de datos
    db_port: str # Puerto de la base de datos
    db_name: str # Nombre de la base de datos
    
    # Configuración de Red
    base_url: str = "" # La URL base de tu backend (por ejemplo, para construir enlaces absolutos). 
    allowed_origins: str = "" # Lista de origenes permitidos (para CORS).
    env_mode: str = "development" # Modo de entorno (development o production)
    app_port: int = 8000  # Puerto donde corre el backend (8001 en tu caso)

    # Pydantic v2: Forma moderna de configurar el cargador
    model_config = SettingsConfigDict( 
        env_file=ENV_PATH, # Le dice a Pydantic que busque el archivo .env
        extra='ignore', # Ignora variables no definidas
        env_file_encoding='utf-8' # Codificacion de utf-8
    )  

settings = Settings() # Instanciamos la configuración inicial desde el .env


# --- LÓGICA DE DETECCIÓN DE ENTORNO ---
is_docker = os.getenv("IS_DOCKER", "false").lower() == "true"
origins_list = []
allow_credentials = False

#  LÓGICA DINÁMICA DE BASE_URL
# Si estamos en desarrollo, ignoramos lo que diga el .env y construimos la URL con la IP real
if settings.env_mode == "development":
    # <!> Aca tengo una duda esto va a andar en el entorno bakend contenedor 
    # fronten local pqero que pasa cuando es ambos en contenedor andara o no hay que refernciar 
    # a otra cosa ??
    host= "" # Host del backend
    if is_docker:
        host= "localhost" # enra atraves de el host local
    else:
        host = obtener_ip_local() # ip local del host
    
    
    # 2. CORS en Desarrollo
    origins_list = ["*"] # Abre la comunicacion con cualquier frontend 
    allow_credentials = False # Obligatorio False si usamos "*"

    settings.base_url = f"http://{host}:{settings.app_port}"

elif settings.env_mode == "production":
    # En producción, si base_url está vacío en el .env, lanzamos un error preventivo
    if not settings.base_url:
        raise ValueError("ERROR: BASE_URL debe estar definida en el .env para producción")
    origins_list = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
    allow_credentials = True 

# --- PROCESAMIENTO DINÁMICO DE CORS ---
# Convertimos el string de ALLOWED_ORIGINS del .env en una lista limpia
# origins_list = [origin.strip() for origin in settings.allowed_origins.split(",")]

