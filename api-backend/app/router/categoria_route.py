# api-backend/app/router/categoria_route.py
"""
=============================================================================
CONTROLADOR HTTP: CATEGORÍAS DEL CATÁLOGO
=============================================================================
Endpoints CRUD para la administración de categorías primarias.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.categoria_repo import (
    create_categoria,
    delete_categoria,
    get_all_categorias,
    get_categoria_by_id,
    update_categoria,
)
from app.schemas.categoria_schema import (
    CategoriaAccionResponseSchema,
    CategoriaCreateSchema,
    CategoriaResponseSchema,
    CategoriaUpdateSchema,
)

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get(
    "",
    response_model=list[CategoriaResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listar todas las categorías",
)
def listar_categorias(db: Session = Depends(get_db)):
    """Retorna la lista de todas las categorías disponibles."""
    return get_all_categorias(db)


@router.get(
    "/{cat_id}",
    response_model=CategoriaResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Obtener categoría por ID",
)
def obtener_categoria(cat_id: int, db: Session = Depends(get_db)):
    categoria = get_categoria_by_id(db, cat_id=cat_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría {cat_id} no encontrada.",
        )
    return categoria


@router.post(
    "",
    response_model=CategoriaResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría",
)
def crear_nueva_categoria(
    payload: CategoriaCreateSchema,
    db: Session = Depends(get_db),
):
    """Crea una categoría principal en el catálogo."""
    return create_categoria(db=db, datos=payload.model_dump())


@router.put(
    "/{cat_id}",
    response_model=CategoriaResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Modificar categoría",
)
def modificar_categoria(
    cat_id: int,
    payload: CategoriaUpdateSchema,
    db: Session = Depends(get_db),
):
    datos = payload.model_dump(exclude_unset=True)
    categoria_actualizada = update_categoria(
        db=db,
        cat_id=cat_id,
        datos=datos,
    )
    if not categoria_actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría {cat_id} no encontrada para modificar.",
        )
    return categoria_actualizada


@router.delete(
    "/{cat_id}",
    response_model=CategoriaAccionResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Eliminar categoría",
)
def eliminar_categoria(cat_id: int, db: Session = Depends(get_db)):
    """Elimina la categoría validando previamente que no existan productos vinculados."""
    exito, motivo = delete_categoria(db=db, cat_id=cat_id)
    if not exito:
        if "no existe" in motivo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=motivo,
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=motivo,
        )
    return CategoriaAccionResponseSchema(
        message=f"Categoría {cat_id} eliminada exitosamente.",
        cat_id=cat_id,
    )