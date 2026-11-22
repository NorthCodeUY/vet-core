# api-backend/app/repositories/categoria_repo.py
"""
=============================================================================
REPOSITORIO DE PERSISTENCIA: CATEGORÍAS (SQLALCHEMY 2.0)
=============================================================================
Operaciones CRUD para categorías de primer nivel y control de integridad referencial.
"""

from typing import Any, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.categoria_model import CategoriaModel
from app.models.producto_model import ProductoModel


def get_all_categorias(db: Session) -> list[CategoriaModel]:
    """Retorna todas las categorías ordenadas alfabéticamente."""
    stmt = select(CategoriaModel).order_by(CategoriaModel.cat_nombre.asc())
    return list(db.scalars(stmt).all())


def get_categoria_by_id(db: Session, cat_id: int) -> Optional[CategoriaModel]:
    """Obtiene una categoría por su ID primario."""
    stmt = select(CategoriaModel).where(CategoriaModel.cat_id == cat_id)
    return db.scalar(stmt)


def create_categoria(db: Session, datos: dict[str, Any]) -> CategoriaModel:
    """Inserta una nueva categoría en la base de datos."""
    nueva_categoria = CategoriaModel(**datos)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria


def update_categoria(
    db: Session,
    cat_id: int,
    datos: dict[str, Any],
) -> Optional[CategoriaModel]:
    """Actualiza parcialmente los datos de una categoría."""
    categoria = get_categoria_by_id(db, cat_id)
    if not categoria:
        return None

    for clave, valor in datos.items():
        if hasattr(categoria, clave) and valor is not None:
            setattr(categoria, clave, valor)

    db.commit()
    db.refresh(categoria)
    return categoria


def delete_categoria(db: Session, cat_id: int) -> tuple[bool, str]:
    """
    Elimina una categoría validando que no tenga productos asociados.
    Retorna (True, "") si tuvo éxito, o (False, motivo) si fue rechazada.
    """
    categoria = get_categoria_by_id(db, cat_id)
    if not categoria:
        return False, "La categoría no existe."

    # Validación de integridad referencial contra productos existentes
    stmt_prod = select(ProductoModel.prod_id).where(ProductoModel.cat_id == cat_id).limit(1)
    producto_vinculado = db.scalar(stmt_prod)
    if producto_vinculado:
        return False, "No se puede eliminar la categoría porque contiene productos asociados."

    db.delete(categoria)
    db.commit()
    return True, ""