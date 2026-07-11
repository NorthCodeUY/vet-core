# api-backend/app/config.py
from pydantic_settings import BaseSettings
import os 

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    db_user: str
    db_password: str
    db_host: str
    db_port: str
    db_name: str
    
    base_url: str
    allowed_origins: str

    class Config:
        env_file = ENV_PATH # Le dice a Pydantic que busque el archivo .env <!> Esto esta en la ruta # /api-backend/.env lo que me dise que es probable que de error  
        extra = 'ignore'  # <--- ESTO SOLUCIONA TU ERROR
settings = Settings()