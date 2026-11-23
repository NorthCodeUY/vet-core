# api-backend/app/repositories/subcategoria_repo.py
"""
=============================================================================
REPOSITORIO DE PERSISTENCIA: SUBCATEGORÍAS (SQLALCHEMY 2.0)
=============================================================================
Operaciones CRUD directas sobre la entidad SubcategoriaModel y limpieza de
relaciones N:M en producto_subcategoria.
"""

from typing import Any, Optional
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.subcategoria_model import SubcategoriaModel


def get_all_subcategorias(db: Session) -> list[SubcategoriaModel]:
    """Retorna todas las subcategorías ordenadas alfabéticamente por nombre."""
    stmt = select(SubcategoriaModel).order_by(SubcategoriaModel.subc_nombre.asc())
    return list(db.scalars(stmt).all())


def get_subcategoria_by_id(db: Session, subc_id: int) -> Optional[SubcategoriaModel]:
    """Obtiene una subcategoría por su clave primaria."""
    stmt = select(SubcategoriaModel).where(SubcategoriaModel.subc_id == subc_id)
    return db.scalar(stmt)


def create_subcategoria(db: Session, datos: dict[str, Any]) -> SubcategoriaModel:
    """Inserta una nueva subcategoría en la base de datos."""
    nueva_subcategoria = SubcategoriaModel(**datos)
    db.add(nueva_subcategoria)
    db.commit()
    db.refresh(nueva_subcategoria)
    return nueva_subcategoria


def update_subcategoria(
    db: Session,
    subc_id: int,
    datos: dict[str, Any],
) -> Optional[SubcategoriaModel]:
    """Actualiza parcialmente los campos de una subcategoría existente."""
    subcategoria = get_subcategoria_by_id(db, subc_id)
    if not subcategoria:
        return None

    for clave, valor in datos.items():
        if hasattr(subcategoria, clave) and valor is not None:
            setattr(subcategoria, clave, valor)

    db.commit()
    db.refresh(subcategoria)
    return subcategoria


def delete_subcategoria(db: Session, subc_id: int) -> bool:
    """
    Elimina una subcategoría desvinculando previamente sus registros
    en la tabla intermedia 'producto_subcategoria' para no violar la FK.
    """
    subcategoria = get_subcategoria_by_id(db, subc_id)
    if not subcategoria:
        return False


    db.delete(subcategoria)
    db.commit()
    return True