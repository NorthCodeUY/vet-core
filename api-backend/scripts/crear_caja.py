# api-backend/scripts/crear_caja.py
"""
=============================================================================
CLI ADMINISTRATIVO: ALTA DE CAJAS Y GENERACIÓN DE QR
=============================================================================
Uso:
    python scripts/crear_caja.py
"""

import os
import sys
import uuid
import qrcode
from pathlib import Path

# Agregar raíz al PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal
from app.models.caja_model import CajaModel


def main():
    print("\n" + "=" * 60)
    print("📦 [SISTEMA LOGÍSTICO] - ALTA MANUAL DE CAJA DE DEPÓSITO")
    print("=" * 60)

    # 1. Dirección (Único campo estrictamente obligatorio)
    direccion = input("\n📍 Dirección física del depósito/casa [OBLIGATORIO]: ").strip()
    while not direccion:
        print("❌ La dirección es obligatoria.")
        direccion = input("📍 Dirección física del depósito/casa: ").strip()

    # 2. Campos opcionales de referencia y contacto
    nombre_caja = input("🏷️  Nombre/Etiqueta (ej: Ropa Verano Lote 1) [Opcional]: ").strip()
    if not nombre_caja:
        nombre_caja = "Caja General"

    referencia = input("🔍 Detalle/Referencia (ej: Pieza del fondo, Estante 2) [Opcional]: ").strip() or None
    contacto_nombre = input("👤 Nombre del responsable en el lugar [Opcional]: ").strip() or None
    contacto_telefono = input("📞 Teléfono/WhatsApp de contacto [Opcional]: ").strip() or None

    # 3. Generación de código único
    codigo_aleatorio = f"CJ-{uuid.uuid4().hex[:6].upper()}"

    db = SessionLocal()
    try:
        nueva_caja = CajaModel(
            caja_codigo=codigo_aleatorio,
            caja_nombre=nombre_caja,
            direccion=direccion,
            deposito_referencia=referencia,
            contacto_nombre=contacto_nombre,
            contacto_telefono=contacto_telefono,
            estado="DISPONIBLE"
        )
        db.add(nueva_caja)
        db.commit()
        db.refresh(nueva_caja)

        print(f"\n✅ Caja registrada exitosamente en Base de Datos con ID: {nueva_caja.caja_id}")
        print(f"🔑 Código Asignado: {nueva_caja.caja_codigo}")

        # 4. Generación física del QR
        output_dir = Path("static/qrs_cajas")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        qr_file_path = output_dir / f"{nueva_caja.caja_codigo}.png"
        payload_qr = f"https://app.vetcore.com/cajas/{nueva_caja.caja_codigo}"

        img = qrcode.make(payload_qr)
        img.save(str(qr_file_path))

        print(f"🖨️  Código QR generado listo para imprimir en: {qr_file_path.resolve()}\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error al registrar la caja: {e}\n")
    finally:
        db.close()


if __name__ == "__main__":
    main()