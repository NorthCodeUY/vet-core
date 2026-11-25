
# api-backend/app/router/producto_router.py
"""
=============================================================================
CONTROLADOR HTTP: CATÁLOGO DE PRODUCTOS (PÚBLICO, ADMIN, STORAGE Y QR)
=============================================================================
Capa de entrada HTTP pura (cero lógica 
de negocio o queries ORM):
- Vitrina pública: catálogo agrupado y buscador multi-campo.
- Portal Admin: listado paginado, buscador irrestricto, CRUD y vitrina.
- Multimedia: subida binaria a Cloudflare R2 / fallback local.
- Códigos QR: metadatos (vitrina carrito React / interno) y PNG imprimible.
"""

from typing import Literal, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.repositories.product_repo import (
    add_imagen_producto,
    create_producto,
    get_all_products_admin,
    get_product_by_id,
    get_productos_admin_filtrados,
    get_productos_agrupados,
    get_productos_filtrados,
    soft_delete_producto,
    toggle_vitrina_producto,
    update_producto,
)
from app.schemas.producto_schema import (
    ImagenResponseSchema,
    ImagenUploadResponseSchema,
    ProdCatAgrupadaSchema,
    ProductoAccionResponseSchema,
    ProductoCreateSchema,
    ProductoQrResponseSchema,
    ProductoResponseSchema,
    ProductoUpdateSchema,
    ToggleVitrinaSchema,
)
from app.services.qr_generator import (
    construir_metadata_qr_producto,
    generar_qr_producto_png,
)
from app.services.storage_service import storage_service

router = APIRouter(prefix="/productos", tags=["Catálogo de Productos"])


# =============================================================================
# 1. ENDPOINTS PÚBLICOS (VITRINA Y BUSCADOR)
# =============================================================================

@router.get(
    "/agrupados",
    response_model=list[ProdCatAgrupadaSchema],
    status_code=status.HTTP_200_OK,
    summary="Catálogo agrupado por categorías",
)
def listar_agrupados(db: Session = Depends(get_db)):
    """Retorna categorías activas con sus productos visibles para la Landing Page."""
    return get_productos_agrupados(db)


@router.get(
    "/filtrados",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscador y catálogo general público",
)
def listar_productos(
    cat_id: Optional[int] = Query(default=None, description="ID de categoría"),
    search: Optional[str] = Query(default=None, description="Texto libre multi-campo"),
    db: Session = Depends(get_db),
):
    """Filtra productos públicos (activos, visibles y disponibles) por categoría y texto."""
    return get_productos_filtrados(db, cat_id=cat_id, search=search)


# =============================================================================
# 2. ENDPOINTS ADMINISTRATIVOS (LISTADO, BUSCADOR IRRESTRICTO Y STORAGE)
# =============================================================================

@router.get(
    "/admin/listado",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listado administrativo paginado (con filtros opcionales)",
)
def listar_productos_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
    cat_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """Lista productos administrativos incluyendo inactivos, ocultos y sin stock."""
    return get_all_products_admin(db, cat_id=cat_id, search=search)[skip : skip + limit]


@router.get(
    "/admin/filtrados",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscador administrativo sin restricción de visibilidad ni stock",
)
def listar_productos_admin_filtrados(
    cat_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """Busca en nombre, detalle, ID, código de barras, categoría, subcategoría, SKU y color."""
    return get_productos_admin_filtrados(db, cat_id=cat_id, search=search)


@router.post(
    "/upload-imagen",
    response_model=ImagenUploadResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Subir imagen a Cloudflare R2 / Storage",
)
async def subir_imagen_storage(file: UploadFile = File(...)):
    """Sube una imagen validada al bucket R2 del tenant (o fallback local /static)."""
    img_url, filename = await storage_service.upload_uploadfile(
        tenant_id=settings.RESOLVED_TENANT_ID,
        file=file,
    )
    return ImagenUploadResponseSchema(img_url=img_url, filename=filename)


# =============================================================================
# 3. FICHA INDIVIDUAL Y CÓDIGOS QR (RUTAS CON prod_id)
# =============================================================================

@router.get(
    "/{prod_id}/qr",
    response_model=ProductoQrResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Metadatos QR de producto (vitrina carrito React o interno)",
)
def obtener_qr_producto_metadata(
    prod_id: int,
    var_id: Optional[int] = Query(default=None, description="ID opcional de variante"),
    tipo: Literal["vitrina", "interno"] = Query(
        default="vitrina",
        description="vitrina: URL carrito React | interno: código para góndola/admin",
    ),
    db: Session = Depends(get_db),
):
    producto = get_product_by_id(db, prod_id=prod_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto {prod_id} no existe.",
        )
    return construir_metadata_qr_producto(producto=producto, var_id=var_id, tipo=tipo)


@router.get(
    "/{prod_id}/qr/imagen",
    status_code=status.HTTP_200_OK,
    summary="Imagen PNG imprimible del código QR",
)
def obtener_qr_producto_imagen(
    prod_id: int,
    var_id: Optional[int] = Query(default=None),
    tipo: Literal["vitrina", "interno"] = Query(default="vitrina"),
    size: int = Query(default=300, ge=120, le=1200),
    con_etiqueta: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    producto = get_product_by_id(db, prod_id=prod_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto {prod_id} no existe.",
        )

    meta = construir_metadata_qr_producto(producto=producto, var_id=var_id, tipo=tipo)
    png_buffer = generar_qr_producto_png(
        payload=meta["qr_payload"],
        size=size,
        con_etiqueta=con_etiqueta,
        nombre=meta["prod_nombre"],
        precio_venta=meta["precio_venta"],
        internal_code=meta["internal_code"],
    )
    return StreamingResponse(
        png_buffer,
        media_type="image/png",
        headers={"Content-Disposition": f'inline; filename="qr-prod-{prod_id}.png"'},
    )


@router.get(
    "/{prod_id}",
    response_model=ProductoResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Ficha individual de producto",
)
def obtener_producto(prod_id: int, db: Session = Depends(get_db)):
    producto = get_product_by_id(db, prod_id=prod_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto {prod_id} no existe.",
        )
    return producto


@router.post(
    "/{prod_id}/imagenes",
    response_model=ImagenResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Subir imagen a R2 y asociarla directamente al producto",
)
async def subir_y_asociar_imagen(
    prod_id: int,
    file: UploadFile = File(...),
    principal: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    img_url, _ = await storage_service.upload_uploadfile(
        tenant_id=settings.RESOLVED_TENANT_ID,
        file=file,
    )
    imagen = add_imagen_producto(
        db=db,
        prod_id=prod_id,
        img_url=img_url,
        img_principal=principal,
    )
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto con ID {prod_id} no existe.",
        )
    return imagen


# =============================================================================
# 4. MUTACIONES CRUD Y CONMUTACIÓN DE VITRINA
# =============================================================================

@router.post(
    "",
    response_model=ProductoResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Alta de producto integral",
)
def crear_nuevo_producto(
    payload: ProductoCreateSchema,
    db: Session = Depends(get_db),
):
    datos = payload.model_dump(exclude={"subcategoria_ids"}, by_alias=True)
    return create_producto(
        db=db,
        datos=datos,
        subcategoria_ids=payload.subcategoria_ids,
    )


@router.put(
    "/{prod_id}",
    response_model=ProductoResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Modificación integral de producto",
)
def modificar_producto(
    prod_id: int,
    payload: ProductoUpdateSchema,
    db: Session = Depends(get_db),
):
    datos = payload.model_dump(
        exclude={"subcategoria_ids"},
        exclude_unset=True,
        by_alias=True,
    )
    producto_actualizado = update_producto(
        db=db,
        prod_id=prod_id,
        datos=datos,
        subcategoria_ids=payload.subcategoria_ids,
    )
    if not producto_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto con ID {prod_id} no existe.",
        )
    return producto_actualizado


@router.delete(
    "/{prod_id}",
    response_model=ProductoAccionResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Baja lógica de producto",
)
def dar_de_baja_producto(prod_id: int, db: Session = Depends(get_db)):
    if not soft_delete_producto(db, prod_id=prod_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto con ID {prod_id} no fue encontrado.",
        )
    return ProductoAccionResponseSchema(
        message=f"Producto {prod_id} dado de baja.",
        prod_id=prod_id,
        prod_activo=False,
        prod_visible=False,
    )


@router.patch(
    "/{prod_id}/vitrina",
    response_model=ProductoAccionResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Conmutar visibilidad en vitrina web",
)
def alternar_vitrina(
    prod_id: int,
    payload: ToggleVitrinaSchema,
    db: Session = Depends(get_db),
):
    if not toggle_vitrina_producto(db, prod_id=prod_id, is_visible=payload.prod_visible):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto con ID {prod_id} no fue encontrado.",
        )
    return ProductoAccionResponseSchema(
        message=f"Visibilidad del producto {prod_id} actualizada.",
        prod_id=prod_id,
        prod_visible=payload.prod_visible,
    )