# api-backend/app/router/producto_router.py
"""
=============================================================================
CONTROLADOR HTTP: CATÁLOGO DE PRODUCTOS (ENDPOINTS PÚBLICOS Y ADMIN)
=============================================================================
Endpoints para la Landing Page, buscador general y panel administrativo.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.product_repo import (
    get_productos_agrupados, 
    get_productos_filtrados,
    get_all_products_admin
)
from app.schemas.producto_schema import (
    ProdCatAgrupadaSchema, 
    ProductoResponseSchema
)

# Variable consumida por main.py (app.include_router(producto_router.router, prefix="/api"))
router = APIRouter(prefix="/productos", tags=["Catálogo de Productos"])


@router.get(
    "/agrupados", 
    response_model=List[ProdCatAgrupadaSchema],
    status_code=status.HTTP_200_OK,
    summary="Obtener catálogo agrupado por categorías (Landing Page)"
)
def listar_agrupados(db: Session = Depends(get_db)):
    """Retorna los productos activos y con disponibilidad organizados por categoría."""
    return get_productos_agrupados(db)


@router.get(
    "/", 
    response_model=List[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscar y filtrar productos públicos"
)
def listar_productos(
    cat_id: Optional[int] = Query(default=None, description="Filtrar por ID único de categoría"), 
    search: Optional[str] = Query(default=None, description="Término de búsqueda por coincidencia textual"), 
    db: Session = Depends(get_db)
):
    """Buscador público con filtros estrictos de visibilidad comercial."""
    return get_productos_filtrados(db, cat_id=cat_id, search=search)


@router.get(
    "/admin/todos",
    response_model=List[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listado completo para panel administrativo"
)
def listar_productos_admin(db: Session = Depends(get_db)):
    """Retorna todos los artículos sin filtros (incluyendo dados de baja y agotados)."""
    return get_all_products_admin(db)