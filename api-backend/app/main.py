# api-backend/app/main.py
"""
=============================================================================
ENTRYPOINT PRINCIPAL DE LA API (FASTAPI)
=============================================================================
Orquestador de ciclo de vida: configuración de CORS, montaje de estáticos,
registro centralizado de routers e inicialización de esquemas.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Carga obligatoria de todo el grafo de modelos antes de crear tablas
import app.models
from app.database import engine, Base
from app.config import settings, origins_list, allow_credentials
from app.router import producto_router, auth_router

# Inicialización declarativa de tablas no existentes
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=getattr(settings, "PROJECT_NAME", "VetCore SaaS API"),
    description="Motor central SaaS para Catálogo, Pedidos y Gestión"
)

# =============================================================================
# MIDDLEWARE DE CORS (Cross-Origin Resource Sharing)
# =============================================================================
# Permite peticiones seguras desde las aplicaciones Frontend (React / Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# REGISTRO DE ROUTERS (PREFIJO GLOBAL /api)
# =============================================================================
# /api + /productos -> /api/productos
app.include_router(producto_router.router, prefix="/api")
# /api + /auth      -> /api/auth
app.include_router(auth_router.router, prefix="/api")

# =============================================================================
# ARCHIVOS ESTÁTICOS LOCALES (Fallback para desarrollo)
# =============================================================================
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/", tags=["Health Check"])
def read_root():
    """Endpoint raíz agnóstico para comprobación de estado de la API."""
    return {
        "status": "online",
        "service": getattr(settings, "PROJECT_NAME", "VetCore SaaS API"),
        "mode": getattr(settings, "ENV_MODE", "development")
    }