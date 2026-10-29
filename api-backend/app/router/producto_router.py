# api-backend/app/router/producto_router.py
"""
=============================================================================
CONTROLADOR HTTP: CATÁLOGO Y CONSULTAS DE PRODUCTOS
=============================================================================
Endpoints públicos para la navegación del catálogo.
Deserialización de parámetros, inyección de dependencias y serialización
estricta mediante Pydantic v2.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.product_repo import (
    get_productos_agrupados, 
    get_productos_filtrados
)
from app.schemas.producto_schema import (
    ProdCatAgrupadaSchema, 
    ProductoResponseSchema
)

# Prefijo ajustado: main.py añade '/api', por lo que la ruta final es '/api/productos'
router = APIRouter(prefix="/productos", tags=["Catálogo de Productos"])


@router.get(
    "/agrupados", 
    response_model=List[ProdCatAgrupadaSchema],
    status_code=status.HTTP_200_OK,
    summary="Obtener catálogo agrupado por categorías"
)
def listar_agrupados(db: Session = Depends(get_db)):
    """Retorna categorías y productos para la Landing Page."""
    return get_productos_agrupados(db)


@router.get(
    "/", 
    response_model=List[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscar y filtrar productos"
)
def listar_productos(
    cat_id: Optional[int] = Query(default=None, description="Filtrar por ID de categoría"), 
    search: Optional[str] = Query(default=None, description="Término de búsqueda"), 
    db: Session = Depends(get_db)
):
    """Retorna productos filtrados para el catálogo y buscador."""
    return get_productos_filtrados(db, cat_id=cat_id, search=search)