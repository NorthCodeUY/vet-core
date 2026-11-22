# api-backend/app/router/subcategoria_route.py
"""
=============================================================================
CONTROLADOR HTTP: SUBCATEGORÍAS DEL CATÁLOGO
=============================================================================
Endpoints CRUD para la administración de subcategorías e iconografía.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.subcategoria_repo import (
    create_subcategoria,
    delete_subcategoria,
    get_all_subcategorias,
    get_subcategoria_by_id,
    update_subcategoria,
)
from app.schemas.subcategoria_schema import (
    SubcategoriaAccionResponseSchema,
    SubcategoriaCreateSchema,
    SubcategoriaResponseSchema,
    SubcategoriaUpdateSchema,
)

router = APIRouter(prefix="/subcategorias", tags=["Subcategorías"])


@router.get(
    "",
    response_model=list[SubcategoriaResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las subcategorías",
)
def listar_subcategorias(db: Session = Depends(get_db)):
    """Retorna la lista completa de subcategorías con sus iconos y URLs asociadas."""
    return get_all_subcategorias(db)


@router.get(
    "/{subc_id}",
    response_model=SubcategoriaResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Obtener detalle de una subcategoría",
)
def obtener_subcategoria(subc_id: int, db: Session = Depends(get_db)):
    subcategoria = get_subcategoria_by_id(db, subc_id=subc_id)
    if not subcategoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subcategoría {subc_id} no encontrada.",
        )
    return subcategoria


@router.post(
    "",
    response_model=SubcategoriaResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nueva subcategoría",
)
def crear_nueva_subcategoria(
    payload: SubcategoriaCreateSchema,
    db: Session = Depends(get_db),
):
    """Crea una subcategoría asignando nombre, identificador de icono y/o URL de imagen."""
    return create_subcategoria(db=db, datos=payload.model_dump())


@router.put(
    "/{subc_id}",
    response_model=SubcategoriaResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Modificar subcategoría existente",
)
def modificar_subcategoria(
    subc_id: int,
    payload: SubcategoriaUpdateSchema,
    db: Session = Depends(get_db),
):
    datos = payload.model_dump(exclude_unset=True)
    subcategoria_actualizada = update_subcategoria(
        db=db,
        subc_id=subc_id,
        datos=datos,
    )
    if not subcategoria_actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subcategoría {subc_id} no encontrada para modificar.",
        )
    return subcategoria_actualizada


@router.delete(
    "/{subc_id}",
    response_model=SubcategoriaAccionResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Eliminar subcategoría",
)
def eliminar_subcategoria(subc_id: int, db: Session = Depends(get_db)):
    """Elimina la subcategoría y remueve sus vínculos en la tabla intermedia N:M."""
    if not delete_subcategoria(db=db, subc_id=subc_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subcategoría {subc_id} no encontrada.",
        )
    return SubcategoriaAccionResponseSchema(
        message=f"Subcategoría {subc_id} eliminada exitosamente.",
        subc_id=subc_id,
    )