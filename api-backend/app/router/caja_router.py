# api-backend/app/router/caja_router.py
import io
import qrcode
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from app.database import get_db
from app.models.caja_model import CajaModel
from app.models.caja_item_model import CajaItemModel
from app.schemas.caja_schema import CajaResponseSchema
from app.config import TENANT_TYPE

router = APIRouter(prefix="/api/cajas", tags=["Cajas"])

@router.get("/{codigo}", response_model=CajaResponseSchema)
def obtener_caja_por_codigo(codigo: str, db: Session = Depends(get_db)):
    """
    Endpoint para lectura por escáner de depósito.
    Retorna datos de contacto, ubicación y los productos/variantes contenidos.
    """
    stmt = (
        select(CajaModel)
        .options(
            selectinload(CajaModel.rel_items)
            .selectinload(CajaItemModel.rel_producto),
            selectinload(CajaModel.rel_items)
            .selectinload(CajaItemModel.rel_variante)
        )
        .where(CajaModel.caja_codigo == codigo)
    )
    caja = db.scalars(stmt).first()

    if not caja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La caja con código '{codigo}' no existe en el sistema."
        )
    return caja






router.get("/{codigo}/qr")
def imprimir_qr_caja(codigo: str, db: Session = Depends(get_db)):
    """
    Genera y retorna dinámicamente la imagen PNG del código QR
    para imprimir y pegar directamente en la caja física.
    """
    stmt = select(CajaModel).where(CajaModel.caja_codigo == codigo)
    caja = db.scalars(stmt).first()

    if not caja:
        raise HTTPException(status_code=404, detail="Caja no encontrada")

    payload_qr = f"https://app.vetcore.com/cajas/{caja.caja_codigo}"

    img = qrcode.make(payload_qr)
    buffer = io.BytesIO()
    
    # Se remueve el keyword 'format="PNG"' incompatible con el driver PyPNGImage
    img.save(buffer)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")