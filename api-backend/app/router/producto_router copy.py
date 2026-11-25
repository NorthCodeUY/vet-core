# api-backend/app/router/producto_router.py
"""
=============================================================================
CONTROLADOR HTTP: CATÁLOGO DE PRODUCTOS (ENDPOINTS PÚBLICOS Y ADMIN)
=============================================================================
Endpoints para la Landing Page, vitrina comercial, administración del catálogo
y carga de imágenes hacia Cloudflare R2 / storage local.
"""
from typing import Literal, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
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
    ProductoResponseSchema,
    ProductoUpdateSchema,
    ToggleVitrinaSchema,
)
from app.services.storage_service import storage_service


# (Agregar junto a los imports existentes)

from fastapi.responses import StreamingResponse

from app.services.qr_generator import (
    construir_metadata_qr_producto,
    generar_qr_producto_png,
)



router = APIRouter(prefix="/productos", tags=["Catálogo de Productos"])





@router.get(
    "/admin/listado",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listado completo administrativo (con filtros opcionales)",
)
def listar_productos_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
    cat_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
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
    return get_productos_admin_filtrados(db, cat_id=cat_id, search=search)

    


@router.get(
    "/agrupados",
    response_model=list[ProdCatAgrupadaSchema],
    status_code=status.HTTP_200_OK,
    summary="Catálogo agrupado por categorías",
)
def listar_agrupados(db: Session = Depends(get_db)):
    return get_productos_agrupados(db)


@router.get(
    "/filtrados",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Buscador y catálogo general público",
)
def listar_productos(
    cat_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    return get_productos_filtrados(db, cat_id=cat_id, search=search)


@router.get(
    "/admin/listado",
    response_model=list[ProductoResponseSchema],
    status_code=status.HTTP_200_OK,
    summary="Listado completo administrativo",
)
def listar_productos_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_all_products_admin(db)[skip : skip + limit]


@router.post(
    "/upload-imagen",
    response_model=ImagenUploadResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Subir imagen a Cloudflare R2 / Storage",
)
async def subir_imagen_storage(file: UploadFile = File(...)):
    img_url, filename = await storage_service.upload_uploadfile(
        tenant_id=settings.RESOLVED_TENANT_ID,
        file=file,
    )
    return ImagenUploadResponseSchema(img_url=img_url, filename=filename)


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
    summary="Subir imagen a R2 y asociarla al producto",
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