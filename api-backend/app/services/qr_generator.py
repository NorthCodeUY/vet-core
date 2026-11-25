# 
# api-backend/app/services/qr_generator.py
"""
=============================================================================
SERVICIO: GENERACIÓN DE CÓDIGOS QR EN MEMORIA (VITRINA Y GÓNDOLA/DEPÓSITO)
=============================================================================
Construye payloads de carrito React (`/revision?cart=...`) o códigos internos,
y genera imágenes PNG en memoria usando `qrcode` (+ `Pillow` opcional para etiquetas).
"""


# api-backend/app/services/qr_generator.py
# (Agregar este import arriba junto a import qrcode)
from qrcode.image.pure import PyPNGImage


from io import BytesIO
from typing import Literal, Optional

import qrcode
from fastapi import HTTPException, status

from app.config import settings
from app.models.producto_model import ProductoModel

try:
    from PIL import Image, ImageDraw, ImageFont

    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False


def construir_metadata_qr_producto(
    producto: ProductoModel,
    var_id: Optional[int] = None,
    tipo: Literal["vitrina", "interno"] = "vitrina",
) -> dict:
    """Resuelve payload, precio, código interno y URL de imagen para un producto/variante."""
    variante = None
    if var_id is not None:
        variante = next((v for v in producto.rel_variantes if v.var_id == var_id), None)
        if not variante:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"La variante {var_id} no pertenece al producto {producto.prod_id}.",
            )

    nombre = (
        f"{producto.prod_nombre} ({variante.var_nombre})"
        if variante
        else producto.prod_nombre
    )
    precio_venta = float(
        variante.var_precio_venta
        if variante and variante.var_precio_venta is not None
        else (producto.prod_precio_venta or 0.0)
    )

    tenant_prefix = (settings.TENANT_TYPE or "VET")[:3].upper()
    codigo_barras = (
        (variante.var_codigo_barra or variante.val_sku)
        if variante
        else producto.prod_codigo_barra
    )
    internal_code = (
        codigo_barras.strip()
        if isinstance(codigo_barras, str) and codigo_barras.strip()
        else f"{tenant_prefix}-{producto.prod_id}"
        + (f"-{variante.var_id}" if variante else "")
    )

    if tipo == "vitrina":
        cart_item = (
            f"{producto.prod_id}_{variante.var_id}:1"
            if variante
            else f"{producto.prod_id}_base:1"
        )
        qr_payload = f"{settings.RESOLVED_STOREFRONT_URL}/revision?cart={cart_item}"
    else:
        qr_payload = internal_code

    params = []
    if var_id is not None:
        params.append(f"var_id={var_id}")
    if tipo != "vitrina":
        params.append(f"tipo={tipo}")
    query_str = f"?{'&'.join(params)}" if params else ""

    return {
        "prod_id": producto.prod_id,
        "var_id": var_id,
        "prod_nombre": nombre,
        "precio_venta": precio_venta,
        "tipo": tipo,
        "qr_payload": qr_payload,
        "internal_code": internal_code,
        "qr_image_url": f"/api/productos/{producto.prod_id}/qr/imagen{query_str}",
    }


def generar_qr_producto_png(
    payload: str,
    size: int = 300,
    con_etiqueta: bool = False,
    nombre: str = "",
    precio_venta: float = 0.0,
    internal_code: str = "",
) -> BytesIO:
    """Genera el código QR en PNG en memoria (con etiqueta de góndola si Pillow está disponible)."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=max(2, size // 33),
        border=2,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    buffer = BytesIO()

    if HAS_PILLOW:
        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        qr_img = qr_img.resize((size, size), Image.Resampling.NEAREST)

        if not con_etiqueta:
            qr_img.save(buffer, format="PNG")
            buffer.seek(0)
            return buffer

        footer_height = 74
        canvas = Image.new("RGB", (size, size + footer_height), "white")
        canvas.paste(qr_img, (0, 0))

        draw = ImageDraw.Draw(canvas)
        font = ImageFont.load_default()
        titulo = (nombre[:32] + "...") if len(nombre) > 35 else nombre
        precio_txt = f"${precio_venta:,.2f}"

        draw.text((12, size + 6), titulo, fill="black", font=font)
        draw.text((12, size + 26), precio_txt, fill="black", font=font)
        if internal_code:
            draw.text((12, size + 46), f"Cod: {internal_code}", fill="#444444", font=font)

        canvas.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer












# api-backend/app/services/qr_generator.py
# (Reemplazar las últimas 4 líneas de generar_qr_producto_png)
    img = qr.make_image(image_factory=PyPNGImage)
    img.save(buffer)
    buffer.seek(0)
    return buffer
    