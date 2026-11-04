# api-backend/app/repositories/__init__.py
"""
Paquete de repositorios para el módulo de Catálogo de Productos.
"""

from .product_repo import (
    get_all_products_admin,
    get_productos_agrupados,
    get_productos_filtrados
)