# api-backend/app/repositories/product_repo.py
"""

<!> aca tambien supongo que hay que actualizar devido al cambio de la estructura de los model 
=============================================================================
REPOSITORIO DE PERSISTENCIA: CATÁLOGO DE PRODUCTOS (SQLALCHEMY 2.0)
=============================================================================
Capa de abstracción de datos para el catálogo.
Aplica reglas estrictas de visibilidad comercial para la web pública:
- Excluye productos inactivos o no visibles.
- Carga únicamente variantes activas (var_activo == True).
- Previene N+1 queries mediante joinedload y selectinload estructurado.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel


def _opciones_carga_publica():
    """
    Estrategia de carga impaciente unificada para el catálogo público.
    Filtra las variantes cargadas para que viajen únicamente las que están activas.
    """
    return (
        joinedload(ProductoModel.rel_imagenes),
        selectinload(
            ProductoModel.rel_variantes.and_(ProductoVarianteModel.var_activo.is_(True))
        ).joinedload(ProductoVarianteModel.rel_color),
        selectinload(ProductoModel.rel_subcategoria).joinedload(
            ProductoSubCategoriaModel.rel_subcategoria
        )
    )


def _criterios_visibilidad_publica():
    """
    Condiciones obligatorias para que un producto aparezca en la tienda web:
    1. Debe estar activo (prod_activo = True).
    2. Debe estar visible (prod_visible = True).
    3. Debe tener stock físico, permitir pedidos por encargo o tener al menos
       una variante activa con disponibilidad.
    """
    return and_( 
        ProductoModel.prod_activo.is_(True),
        ProductoModel.prod_visible.is_(True),
        or_(
            
            ProductoModel.prod_stock > 0,
            ProductoModel.prod_per_sin_stock.is_(True),
            ProductoModel.rel_variantes.any(
                and_(
                    ProductoVarianteModel.var_activo.is_(True),
                    ProductoVarianteModel.var_disponible.is_(True),
                    or_(
                        ProductoVarianteModel.var_stock > 0,
                        ProductoVarianteModel.var_permitir_sin_stock.is_(True)
                    )
                )
            )
        )
    )


def get_productos_agrupados(db: Session, limit_por_categoria: int = 8) -> List[Dict[str, Any]]:
    """
    Retorna el catálogo público agrupado por categorías para la Landing Page.
    """
    stmt_cat = select(CategoriaModel).order_by(CategoriaModel.cat_id)
    categorias = db.scalars(stmt_cat).all()

    resultado = []

    for cat in categorias: #
        stmt_prod = (
            select(ProductoModel)
            .where(
                and_(
                    ProductoModel.cat_id == cat.cat_id,
                    _criterios_visibilidad_publica()
                )
            )
            .options(*_opciones_carga_publica())
            .limit(limit_por_categoria)
        )
        productos = list(db.scalars(stmt_prod).unique().all())

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
    Buscador y catálogo general público.
    """
    stmt = (
        select(ProductoModel)
        .join(ProductoModel.rel_categoria)
        .where(_criterios_visibilidad_publica())
        .options(*_opciones_carga_publica())
    )

    if cat_id:
        stmt = stmt.where(ProductoModel.cat_id == cat_id)

    if search:
        termino = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                ProductoModel.prod_nombre.ilike(termino),
                ProductoModel.prod_descripcion.ilike(termino),
                CategoriaModel.cat_nombre.ilike(termino)
            )
        )

    return list(db.scalars(stmt).unique().all())


def get_all_products_admin(db: Session) -> List[ProductoModel]:
    """
    Retorna todos los productos sin filtros para el panel administrativo.
    """
    stmt = (
        select(ProductoModel)
        .options(
            joinedload(ProductoModel.rel_imagenes),
            selectinload(ProductoModel.rel_variantes).joinedload(ProductoVarianteModel.rel_color),
            selectinload(ProductoModel.rel_subcategoria).joinedload(
                ProductoSubCategoriaModel.rel_subcategoria
            )
        )
        .order_by(ProductoModel.prod_id.desc())
    )
    return list(db.scalars(stmt).unique().all())