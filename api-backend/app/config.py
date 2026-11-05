# api-backend/app/config.py
"""
=============================================================================
CONFIGURACIÓN CENTRALIZADA MULTI-TENANT (PYDANTIC SETTINGS V2)
=============================================================================
Gestiona la carga de variables de entorno de forma dinámica por Tenant:
- Prioriza variables del sistema operativo (Docker env_file).
- Si existe la variable ENV_FILE, carga ese archivo específico (.env.veterinaria).
- Ensambla la conexión a PostgreSQL y la política de CORS de manera agnóstica.
"""

import os
import socket
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


def obtener_ip_local() -> str:
    """Detecta la IP privada del Host en la red local (WiFi/Ethernet)."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


# Resolución dinámica del archivo de entorno a cargar
# 1. Si el sistema operativo define 'ENV_FILE', usa ese.
# 2. Si no, busca '.env'.
TARGET_ENV_FILE = os.getenv("ENV_FILE", ".env")


class Settings(BaseSettings):
    """Contrato de configuración fuertemente tipado para cada Tenant."""

    # -------------------------------------------------------------------------
    # IDENTIFICACIÓN Y MODO DE EJECUCIÓN
    # -------------------------------------------------------------------------
    PROJECT_NAME: str = Field(default="VetCore Engine API", description="Nombre del tenant")
    ENV_MODE: str = Field(default="development", description="development | production")
    IS_DOCKER: bool = Field(default=False, description="True si corre dentro de Docker")
    
    # Feature Flags Multi-Tenant
    TENANT_TYPE: str = Field(default="GENERAL", description="VET | RETAIL | SERVICES")
    ENABLE_AGENDA: bool = Field(default=False, description="Habilita módulo de turnos/citas")

    # -------------------------------------------------------------------------
    # PERSISTENCIA (POSTGRESQL)
    # -------------------------------------------------------------------------
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "default_db"

    # -------------------------------------------------------------------------
    # RED Y SERVIDOR ASGI
    # -------------------------------------------------------------------------
    APP_PORT: int = 8000
    BASE_URL: str = ""
    ALLOWED_ORIGINS: str = ""

    # -------------------------------------------------------------------------
    # SEGURIDAD Y TOKENS JWT
    # -------------------------------------------------------------------------
    SECRET_KEY: str = Field(default="insecure_secret_key_change_me_in_production_32b", min_length=16)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # -------------------------------------------------------------------------
    # CLOUDFLARE R2 / OBJECT STORAGE
    # -------------------------------------------------------------------------
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "vetcore-media"
    R2_PUBLIC_URL: str = ""

    # -------------------------------------------------------------------------
    # CONFIGURACIÓN DEL LOADER DE PYDANTIC V2
    # -------------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=TARGET_ENV_FILE,
        extra="ignore",
        env_file_encoding="utf-8"
    )

    # -------------------------------------------------------------------------
    # PROPIEDADES DERIVADAS (BUSINESS & INFRASTRUCTURE LOGIC)
    # -------------------------------------------------------------------------
    @property
    def DATABASE_URL(self) -> str:
        """Construye dinámicamente la URL de conexión para SQLAlchemy."""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Calcula los orígenes permitidos según el modo de ejecución."""
        if self.ENV_MODE == "development":
            return ["*"]
        if self.ALLOWED_ORIGINS:
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return []

    @property
    def CORS_ALLOW_CREDENTIALS(self) -> bool:
        """Si se usa '*' en desarrollo, las credenciales deben ser False por estándar HTTP."""
        return self.ENV_MODE != "development"

    @property
    def RESOLVED_BASE_URL(self) -> str:
        """Determina la URL pública para construir enlaces a recursos."""
        if self.BASE_URL:
            return self.BASE_URL
        host = "localhost" if self.IS_DOCKER else obtener_ip_local()
        return f"http://{host}:{self.APP_PORT}"

    # -------------------------------------------------------------------------
    # ALIASES DE COMPATIBILIDAD HACIA ATRÁS (MINÚSCULAS)
    # -------------------------------------------------------------------------
    @property
    def db_user(self) -> str: return self.DB_USER
    @property
    def db_password(self) -> str: return self.DB_PASSWORD
    @property
    def db_host(self) -> str: return self.DB_HOST
    @property
    def db_port(self) -> str: return self.DB_PORT
    @property
    def db_name(self) -> str: return self.DB_NAME
    @property
    def env_mode(self) -> str: return self.ENV_MODE
    @property
    def app_port(self) -> int: return self.APP_PORT
    @property
    def base_url(self) -> str: return self.BASE_URL
    @property
    def allowed_origins(self) -> str: return self.ALLOWED_ORIGINS


# Instanciación única consumida por todo el backend
settings = Settings()

# Alias globales consumidos por main.py
origins_list = settings.CORS_ORIGINS
allow_credentials = settings.CORS_ALLOW_CREDENTIALS