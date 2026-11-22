# api-backend/app/main.py
"""
=============================================================================
ENTRYPOINT PRINCIPAL DE LA API (FASTAPI)
=============================================================================
Orquestador del ciclo de vida de la aplicación: configuración de CORS,
registro modular de routers HTTP, montaje de archivos estáticos y verificación de estado.
"""

from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# 1. Carga explícita del grafo completo de modelos antes de inicializar DDL
import app.models
from app.config import allow_credentials, origins_list, settings
from app.database import Base, engine
from app.router import auth_router, categoria_route, producto_router, subcategoria_route


# 2. Manejo estructurado del ciclo de vida (Startup / Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verificación e inicialización declarativa de tablas no existentes
    Base.metadata.create_all(bind=engine)
    yield


# 3. Instancia de la aplicación
app = FastAPI(
    title=getattr(settings, "PROJECT_NAME", "VetCore SaaS API"),
    description="Motor central SaaS para Catálogo, Pedidos e Inventario Multitenant",
    version="1.0.0",
    lifespan=lifespan,
)


# =============================================================================
# MIDDLEWARE DE CORS (Cross-Origin Resource Sharing)
# =============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# REGISTRO CENTRALIZADO DE ROUTERS (PREFIJO UNIFICADO /api)
# =============================================================================
app.include_router(auth_router.router, prefix="/api")
app.include_router(producto_router.router, prefix="/api")
app.include_router(categoria_route.router, prefix="/api")
app.include_router(subcategoria_route.router, prefix="/api")


# =============================================================================
# ARCHIVOS ESTÁTICOS LOCALES (Fallback multimedia)
# =============================================================================
static_dir = Path("app/static")
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


# =============================================================================
# HEALTH CHECK
# =============================================================================
@app.get(
    "/",
    tags=["Health Check"],
    status_code=status.HTTP_200_OK,
    summary="Comprobación de operatividad del nodo",
)
def read_root():
    """Endpoint de sondeo de salud para orquestadores (Docker / Nginx / Uptime Kuma)."""
    return {
        "status": "online",
        "service": getattr(settings, "PROJECT_NAME", "VetCore SaaS API"),
        "mode": getattr(settings, "ENV_MODE", "development"),
    }