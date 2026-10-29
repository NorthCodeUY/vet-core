# api-backend/app/repositories/product_repo.py
"""
=============================================================================
REPOSITORIO DE PERSISTENCIA: CATÁLOGO DE PRODUCTOS (SQLALCHEMY 2.0)
=============================================================================
Capa de abstracción de datos para el catálogo.
Implementa carga impaciente (eager loading) para variantes, colores,
imágenes y subcategorías, eliminando el problema de consultas N+1 y 
garantizando búsquedas textuales optimizadas.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel


def get_all_products(db: Session) -> List[ProductoModel]:
    """
    Recupera el catálogo completo de productos con sus relaciones cargadas.
    Función utilitaria para auditorías o sincronización masiva de inventario.
    """
    stmt = (
        select(ProductoModel)
        .options(
            joinedload(ProductoModel.rel_imagenes),
            selectinload(ProductoModel.rel_variantes).joinedload(ProductoVarianteModel.rel_color),
            selectinload(ProductoModel.rel_subcategoria).joinedload(ProductoSubCategoriaModel.rel_subcategoria)
        )
    )
    return list(db.scalars(stmt).unique().all())


def get_productos_agrupados(db: Session, limit_por_categoria: int = 8) -> List[Dict[str, Any]]:
    """
    Obtiene el catálogo estructurado para la Landing Page:
    Agrupa los productos dentro de su categoría correspondiente,
    restringiendo la cantidad por categoría para optimizar la carga inicial.
    """
    # 1. Traer las categorías ordenadas por ID
    stmt_cat = select(CategoriaModel).order_by(CategoriaModel.cat_id)
    categorias = db.scalars(stmt_cat).all()

    resultado = []

    # 2. Cargar los productos con variantes, imágenes y subcategorías
    for cat in categorias:
        stmt_prod = (
            select(ProductoModel)
            .where(ProductoModel.cat_id == cat.cat_id)
            .options(
                joinedload(ProductoModel.rel_imagenes),
                selectinload(ProductoModel.rel_variantes).joinedload(ProductoVarianteModel.rel_color),
                selectinload(ProductoModel.rel_subcategoria).joinedload(ProductoSubCategoriaModel.rel_subcategoria)
            )
            .limit(limit_por_categoria)
        )
        productos = list(db.scalars(stmt_prod).unique().all())

        # Solo se incluye la categoría si contiene productos para mostrar
        if productos:
            resultado.append({
                "cat_id": cat.cat_id,
                "cat_nombre": cat.cat_nombre,
                "productos": productos
            })

    return resultado


def get_productos_filtrados(
    db: Session, 
    search: Optional[str] = None, 
    cat_id: Optional[int] = None
) -> List[ProductoModel]:
    """
    Buscador principal del catálogo.
    Permite filtrar por categoría y/o buscar coincidencias de texto
    simultáneamente en el nombre del producto, su descripción o el nombre de su categoría.
    """
    # Iniciamos la consulta uniendo la relación con categoría para permitir búsqueda cruzada
    stmt = (
        select(ProductoModel)
        .join(ProductoModel.rel_categoria)
        .options(
            joinedload(ProductoModel.rel_imagenes),
            selectinload(ProductoModel.rel_variantes).joinedload(ProductoVarianteModel.rel_color),
            selectinload(ProductoModel.rel_subcategoria).joinedload(ProductoSubCategoriaModel.rel_subcategoria)
        )
    )

    # 1. Filtro por Categoría específica (ID)
    if cat_id:
        stmt = stmt.where(ProductoModel.cat_id == cat_id)

    # 2. Filtro textual multi-campo (Nombre de Producto, Descripción y Nombre de Categoría)
    if search:
        termino_busqueda = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                ProductoModel.prod_nombre.ilike(termino_busqueda),
                ProductoModel.prod_descripcion.ilike(termino_busqueda),
                CategoriaModel.cat_nombre.ilike(termino_busqueda)
            )
        )

    return list(db.scalars(stmt).unique().all())