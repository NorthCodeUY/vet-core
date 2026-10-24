# api-backend/app/router/producto_router.py
"""
=============================================================================
CONTROLADOR HTTP - CATÁLOGO Y CONSULTAS DE PRODUCTOS
=============================================================================
Endpoints públicos para la navegación del catálogo.
Implementa deserialización de parámetros, inyección de dependencias de BD
y serialización estricta mediante Pydantic v2.
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

router = APIRouter(prefix="/api/productos", tags=["Catálogo de Productos"])


@router.get(
    "/agrupados", 
    response_model=List[ProdCatAgrupadaSchema],
    status_code=status.HTTP_200_OK,
    summary="Obtener catálogo agrupado por categorías",
    description="Retorna las categorías activas con sus productos asociados (incluyendo variantes y colores) para renderizar la Landing Page."
)
def listar_agrupados(db: Session = Depends(get_db)):
    """
    Controlador para vista principal (Landing Page).
    Delega la consulta jerárquica a la capa de persistencia.
    """
    return get_productos_agrupados(db)


@router.get(
    "/", 
    response_model=List[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscar y filtrar productos",
    description="Retorna una lista plana de productos filtrados opcionalmente por categoría o coincidencia de texto."
)
def listar_productos(
    cat_id: Optional[int] = Query(
        default=None, 
        description="Filtrar por ID único de categoría"
    ), 
    search: Optional[str] = Query(
        default=None, 
        description="Término de búsqueda textual sobre el nombre o descripción del producto"
    ), 
    db: Session = Depends(get_db)
):
    """
    Controlador para el buscador y catálogo general con filtros combinados.
    """
    return get_productos_filtrados(db, cat_id=cat_id, search=search)