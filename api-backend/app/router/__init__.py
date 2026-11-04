# api-backend/app/router/__init__.py
"""
=============================================================================
PAQUETE DE ENRUTADORES HTTP (ROUTERS)
=============================================================================
Exporta centralizadamente los submódulos de rutas para FastAPI.
"""

from app.router import auth_router
from app.router import producto_router
from app.router import caja_router
from app.router import pedido_route

__all__ = ["auth_router", "producto_router", "caja_router", "pedido_route"]