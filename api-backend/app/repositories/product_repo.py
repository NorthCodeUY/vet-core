# api-backend/app/repositories/product_repo.py
"""
=============================================================================
REPOSITORIO DE PERSISTENCIA: CATÁLOGO DE PRODUCTOS (SQLALCHEMY 2.0)
=============================================================================
Capa de persistencia desacoplada para catálogo, inventario y vitrina.
Maneja operaciones de consulta optimizada, mutaciones transaccionales y
sincronización de relaciones N:M con subcategorías.
"""
from typing import Any, Optional
from sqlalchemy import and_, delete, or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.categoria_model import CategoriaModel
from app.models.imagen_url_model import ImagenUrlModel
from app.models.producto_model import ProductoModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel


def _opciones_carga_completa():
    return (
        joinedload(ProductoModel.rel_imagenes),
        selectinload(ProductoModel.rel_variantes).joinedload(ProductoVarianteModel.rel_color),
        selectinload(ProductoModel.rel_subcategoria).joinedload(
            ProductoSubCategoriaModel.rel_subcategoria
        ),
    )


def _criterios_visibilidad_publica():
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
                        ProductoVarianteModel.var_permitir_sin_stock.is_(True),
                    ),
                )
            ),
        ),
    )


def get_product_by_id(db: Session, prod_id: int) -> Optional[ProductoModel]:
    stmt = (
        select(ProductoModel)
        .where(ProductoModel.prod_id == prod_id)
        .options(*_opciones_carga_completa())
    )
    return db.scalar(stmt)


def get_productos_agrupados(db: Session, limit_por_categoria: int = 8) -> list[dict[str, Any]]:
    stmt_cat = select(CategoriaModel).order_by(CategoriaModel.cat_id)
    categorias = db.scalars(stmt_cat).all()

    resultado: list[dict[str, Any]] = []
    for cat in categorias:
        stmt_prod = (
            select(ProductoModel)
            .where(
                and_(
                    ProductoModel.cat_id == cat.cat_id,
                    _criterios_visibilidad_publica(),
                )
            )
            .options(*_opciones_carga_completa())
            .limit(limit_por_categoria)
        )
        productos = list(db.scalars(stmt_prod).unique().all())
        if productos:
            resultado.append({
                "cat_id": cat.cat_id,
                "cat_nombre": cat.cat_nombre,
                "productos": productos,
            })
    return resultado


def get_productos_filtrados(
    db: Session,
    search: Optional[str] = None,
    cat_id: Optional[int] = None,
) -> list[ProductoModel]:
    stmt = (
        select(ProductoModel)
        .join(ProductoModel.rel_categoria)
        .where(_criterios_visibilidad_publica())
        .options(*_opciones_carga_completa())
    )
    if cat_id:
        stmt = stmt.where(ProductoModel.cat_id == cat_id)
    if search:
        termino = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                ProductoModel.prod_nombre.ilike(termino),
                ProductoModel.prod_descripcion.ilike(termino),
                CategoriaModel.cat_nombre.ilike(termino),
            )
        )
    return list(db.scalars(stmt).unique().all())


def get_all_products_admin(db: Session) -> list[ProductoModel]:
    stmt = (
        select(ProductoModel)
        .options(*_opciones_carga_completa())
        .order_by(ProductoModel.prod_id.desc())
    )
    return list(db.scalars(stmt).unique().all())


def _sincronizar_imagenes_y_variantes(
    db: Session,
    prod_id: int,
    imagenes: Optional[list[str]],
    variantes: Optional[list[dict[str, Any]]],
    reemplazar: bool,
) -> None:
    """Sincroniza galería multimedia y variantes desacoplándolas de ProductoModel."""
    if imagenes is not None:
        if reemplazar:
            db.execute(delete(ImagenUrlModel).where(ImagenUrlModel.prod_id == prod_id))
            db.flush()

        for idx, url in enumerate(imagenes):
            url_limpia = url.strip()
            if not url_limpia:
                continue
            db.add(
                ImagenUrlModel(
                    prod_id=prod_id,
                    img_url=url_limpia,
                    img_principal=(idx == 0),
                    img_tipo="PRODUCTO",
                )
            )

    if variantes is not None:
        if reemplazar:
            db.execute(delete(ProductoVarianteModel).where(ProductoVarianteModel.prod_id == prod_id))
            # Libera índices UNIQUE en la BD antes de reinsertar
            db.flush()

        for var_data in variantes:
            sku = var_data.get("val_sku") or var_data.get("var_sku")
            barcode = var_data.get("var_codigo_barra")
            db.add(
                ProductoVarianteModel(
                    prod_id=prod_id,
                    col_id=var_data.get("col_id"),
                    var_tipo=var_data.get("var_tipo", "Presentación"),
                    var_nombre=var_data["var_nombre"],
                    val_sku=sku.strip() if isinstance(sku, str) and sku.strip() else None,
                    var_codigo_barra=barcode.strip() if isinstance(barcode, str) and barcode.strip() else None,
                    var_precio_venta=var_data.get("var_precio_venta", 0.0),
                    var_precio_costo=var_data.get("var_precio_costo"),
                    var_stock=var_data.get("var_stock", 0),
                    var_stock_minimo=var_data.get("var_stock_minimo"),
                    var_activo=var_data.get("var_activo", True),
                    var_visible=var_data.get("var_visible", True),
                    var_disponible=var_data.get("var_disponible", True),
                    var_permitir_sin_stock=var_data.get("var_permitir_sin_stock", False),
                )
            )


def create_producto(
    db: Session,
    datos: dict[str, Any],
    subcategoria_ids: Optional[list[int]] = None,
) -> ProductoModel:
    # Extracción de relaciones antes del mapeo de columnas base
    imagenes = datos.pop("imagenes", None)
    variantes = datos.pop("variantes", None)

    nuevo_producto = ProductoModel(**datos)
    db.add(nuevo_producto)
    db.flush()

    _sincronizar_imagenes_y_variantes(
        db=db,
        prod_id=nuevo_producto.prod_id,
        imagenes=imagenes,
        variantes=variantes,
        reemplazar=False,
    )

    if subcategoria_ids:
        for sub_id in set(subcategoria_ids):
            db.add(
                ProductoSubCategoriaModel(
                    prod_id=nuevo_producto.prod_id,
                    sub_id=sub_id,
                )
            )

    db.commit()
    return get_product_by_id(db, nuevo_producto.prod_id)  # type: ignore[return-value]


def update_producto(
    db: Session,
    prod_id: int,
    datos: dict[str, Any],
    subcategoria_ids: Optional[list[int]] = None,
) -> Optional[ProductoModel]:
    stmt = select(ProductoModel).where(ProductoModel.prod_id == prod_id)
    producto = db.scalar(stmt)
    if not producto:
        return None

    # Extracción de relaciones para sincronización explícita
    imagenes = datos.pop("imagenes", None)
    variantes = datos.pop("variantes", None)

    for clave, valor in datos.items():
        if hasattr(producto, clave):
            setattr(producto, clave, valor)

    _sincronizar_imagenes_y_variantes(
        db=db,
        prod_id=prod_id,
        imagenes=imagenes,
        variantes=variantes,
        reemplazar=True,
    )

    if subcategoria_ids is not None:
        db.execute(
            delete(ProductoSubCategoriaModel).where(
                ProductoSubCategoriaModel.prod_id == prod_id
            )
        )
        for sub_id in set(subcategoria_ids):
            db.add(
                ProductoSubCategoriaModel(
                    prod_id=prod_id,
                    sub_id=sub_id,
                )
            )

    db.commit()
    return get_product_by_id(db, prod_id)


def soft_delete_producto(db: Session, prod_id: int) -> bool:
    stmt = select(ProductoModel).where(ProductoModel.prod_id == prod_id)
    producto = db.scalar(stmt)
    if not producto:
        return False
    producto.prod_activo = False
    producto.prod_visible = False
    db.commit()
    db.refresh(producto)
    return True


def toggle_vitrina_producto(db: Session, prod_id: int, is_visible: bool) -> bool:
    stmt = select(ProductoModel).where(ProductoModel.prod_id == prod_id)
    producto = db.scalar(stmt)
    if not producto:
        return False
    producto.prod_visible = is_visible
    db.commit()
    db.refresh(producto)
    return True