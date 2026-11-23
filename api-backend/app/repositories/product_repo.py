# api-backend/app/repositories/product_repo.py
"""
=============================================================================
REPOSITORIO DE PERSISTENCIA: CATÁLOGO DE PRODUCTOS (SQLALCHEMY 2.0)
=============================================================================
Capa de persistencia desacoplada para catálogo, inventario, buscadores
(público y administrativo) y sincronización multimedia/N:M.
"""

from typing import Any, Optional

from sqlalchemy import String, and_, cast, delete, or_, select, update
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.categoria_model import CategoriaModel
from app.models.color_model import ColorModel
from app.models.imagen_url_model import ImagenUrlModel
from app.models.producto_model import ProductoModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel
from app.models.subcategoria_model import SubcategoriaModel


# =============================================================================
# HELPERS INTERNOS DE CARGA Y FILTRADO
# =============================================================================

def _opciones_carga_completa():
    """Estrategia de carga ansiosa (eager loading) para prevenir consultas N+1."""
    return (
        joinedload(ProductoModel.rel_imagenes),
        selectinload(ProductoModel.rel_variantes).joinedload(
            ProductoVarianteModel.rel_color
        ),
        selectinload(ProductoModel.rel_subcategoria).joinedload(
            ProductoSubCategoriaModel.rel_subcategoria
        ),
    )


def _criterios_visibilidad_publica():
    """Reglas de publicación en vitrina pública (activo, visible y disponible)."""
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


def _aplicar_filtros_busqueda(
    stmt,
    search: Optional[str] = None,
    cat_id: Optional[int] = None,
    incluir_id: bool = False,
):
    """
    Aplica filtro por categoría y búsqueda tokenizada multi-campo:
    nombre, descripción, código de barras, categoría, subcategoría,
    variantes (nombre, tipo, SKU, código de barras) y color.
    """
    if cat_id is not None:
        stmt = stmt.where(ProductoModel.cat_id == cat_id)

    if search and search.strip():
        tokens = [t for t in search.strip().split() if t]
        filtros_tokens = []
        for token in tokens:
            termino = f"%{token}%"
            condiciones = [
                ProductoModel.prod_nombre.ilike(termino),
                ProductoModel.prod_descripcion.ilike(termino),
                ProductoModel.prod_codigo_barra.ilike(termino),
                CategoriaModel.cat_nombre.ilike(termino),
                ProductoModel.rel_subcategoria.any(
                    ProductoSubCategoriaModel.rel_subcategoria.has(
                        SubcategoriaModel.subc_nombre.ilike(termino)
                    )
                ),
                ProductoModel.rel_variantes.any(
                    or_(
                        ProductoVarianteModel.var_nombre.ilike(termino),
                        ProductoVarianteModel.var_tipo.ilike(termino),
                        ProductoVarianteModel.val_sku.ilike(termino),
                        ProductoVarianteModel.var_codigo_barra.ilike(termino),
                        ProductoVarianteModel.rel_color.has(
                            ColorModel.col_nombre.ilike(termino)
                        ),
                    )
                ),
            ]
            if incluir_id:
                condiciones.append(cast(ProductoModel.prod_id, String).ilike(termino))
            filtros_tokens.append(or_(*condiciones))

        stmt = stmt.where(and_(*filtros_tokens))

    return stmt


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
            db.execute(
                delete(ProductoVarianteModel).where(
                    ProductoVarianteModel.prod_id == prod_id
                )
            )
            # Libera índices UNIQUE en BD antes de reinsertar
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
                    var_codigo_barra=(
                        barcode.strip()
                        if isinstance(barcode, str) and barcode.strip()
                        else None
                    ),
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


# =============================================================================
# CONSULTAS DE LECTURA (PÚBLICAS Y ADMINISTRATIVAS)
# =============================================================================

def get_product_by_id(db: Session, prod_id: int) -> Optional[ProductoModel]:
    """Obtiene el grafo completo de un producto por ID."""
    stmt = (
        select(ProductoModel)
        .where(ProductoModel.prod_id == prod_id)
        .options(*_opciones_carga_completa())
    )
    return db.scalars(stmt).unique().first()


def get_productos_agrupados(
    db: Session,
    limit_por_categoria: int = 8,
) -> list[dict[str, Any]]:
    """Retorna categorías con sus productos visibles para la vitrina principal."""
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
            resultado.append(
                {
                    "cat_id": cat.cat_id,
                    "cat_nombre": cat.cat_nombre,
                    "productos": productos,
                }
            )
    return resultado


def get_productos_filtrados(
    db: Session,
    search: Optional[str] = None,
    cat_id: Optional[int] = None,
) -> list[ProductoModel]:
    """Buscador público (restringido a productos activos, visibles y con disponibilidad)."""
    stmt = (
        select(ProductoModel)
        .outerjoin(ProductoModel.rel_categoria)
        .where(_criterios_visibilidad_publica())
        .options(*_opciones_carga_completa())
    )
    stmt = _aplicar_filtros_busqueda(stmt, search=search, cat_id=cat_id, incluir_id=False)
    return list(db.scalars(stmt).unique().all())


def get_productos_admin_filtrados(
    db: Session,
    search: Optional[str] = None,
    cat_id: Optional[int] = None,
) -> list[ProductoModel]:
    """Buscador administrativo irrestricto (incluye inactivos, ocultos, sin stock y por ID)."""
    stmt = (
        select(ProductoModel)
        .outerjoin(ProductoModel.rel_categoria)
        .options(*_opciones_carga_completa())
        .order_by(ProductoModel.prod_id.desc())
    )
    stmt = _aplicar_filtros_busqueda(stmt, search=search, cat_id=cat_id, incluir_id=True)
    return list(db.scalars(stmt).unique().all())


def get_all_products_admin(
    db: Session,
    search: Optional[str] = None,
    cat_id: Optional[int] = None,
) -> list[ProductoModel]:
    """Listado administrativo con soporte opcional de búsqueda y categoría."""
    return get_productos_admin_filtrados(db, search=search, cat_id=cat_id)


# =============================================================================
# MUTACIONES TRANSACCIONALES
# =============================================================================

def create_producto(
    db: Session,
    datos: dict[str, Any],
    subcategoria_ids: Optional[list[int]] = None,
) -> ProductoModel:
    """Persiste un nuevo producto con sus subcategorías, variantes e imágenes."""
    imagenes = datos.pop("imagenes", None)
    variantes = datos.pop("variantes", None)

    columnas_db = {col.name for col in ProductoModel.__table__.columns}
    datos_producto = {k: v for k, v in datos.items() if k in columnas_db}

    nuevo_producto = ProductoModel(**datos_producto)
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
                    subc_id=sub_id,
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
    """Actualiza atributos de un producto y re-sincroniza subcategorías, variantes e imágenes."""
    stmt = select(ProductoModel).where(ProductoModel.prod_id == prod_id)
    producto = db.scalar(stmt)
    if not producto:
        return None

    imagenes = datos.pop("imagenes", None)
    variantes = datos.pop("variantes", None)

    columnas_db = {col.name for col in ProductoModel.__table__.columns}
    for clave, valor in datos.items():
        if clave in columnas_db:
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
                    subc_id=sub_id,
                )
            )

    db.commit()
    return get_product_by_id(db, prod_id)


def add_imagen_producto(
    db: Session,
    prod_id: int,
    img_url: str,
    img_principal: bool = False,
) -> Optional[ImagenUrlModel]:
    """Asocia una nueva imagen a un producto existente y gestiona su portada principal."""
    producto = db.scalar(select(ProductoModel).where(ProductoModel.prod_id == prod_id))
    if not producto:
        return None

    tiene_imagenes = db.scalar(
        select(ImagenUrlModel.img_id).where(ImagenUrlModel.prod_id == prod_id).limit(1)
    )
    es_principal = img_principal or (tiene_imagenes is None)

    if es_principal and tiene_imagenes is not None:
        db.execute(
            update(ImagenUrlModel)
            .where(ImagenUrlModel.prod_id == prod_id)
            .values(img_principal=False)
        )

    nueva_img = ImagenUrlModel(
        prod_id=prod_id,
        img_url=img_url,
        img_principal=es_principal,
        img_tipo="PRODUCTO",
    )
    db.add(nueva_img)
    db.commit()
    db.refresh(nueva_img)
    return nueva_img


def soft_delete_producto(db: Session, prod_id: int) -> bool:
    """Ejecuta baja lógica ocultando el producto del catálogo público."""
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
    """Conmuta la visibilidad pública de un producto en vitrina."""
    stmt = select(ProductoModel).where(ProductoModel.prod_id == prod_id)
    producto = db.scalar(stmt)
    if not producto:
        return False
    producto.prod_visible = is_visible
    db.commit()
    db.refresh(producto)
    return True