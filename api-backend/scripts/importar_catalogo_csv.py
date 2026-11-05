# api-backend/scripts/importar_catalogo_csv.py
"""
=============================================================================
INGESTA MASIVA DE CATÁLOGO Y SUBIDA DE IMÁGENES A CLOUDFLARE R2
=============================================================================
Uso:
    python scripts/importar_catalogo_csv.py veterinaria
    python scripts/importar_catalogo_csv.py flordeloto
"""

import sys
import os
import re
from typing import Optional, Any
import pandas as pd
from dotenv import load_dotenv

# 1. Resolver path raíz del backend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

if len(sys.argv) < 2:
    print("\n❌ Uso: python scripts/importar_catalogo_csv.py [veterinaria|flordeloto]\n")
    sys.exit(1)

tenant = sys.argv[1].lower()
env_file = os.path.join(BASE_DIR, f".env.{tenant}")

if not os.path.exists(env_file):
    print(f"\n❌ Error: Archivo de configuración '{env_file}' no encontrado.\n")
    sys.exit(1)

# Cargar entorno antes de instanciar SQLAlchemy
load_dotenv(dotenv_path=env_file, override=True)
os.environ["IS_DOCKER"] = "false"
os.environ["DB_HOST"] = "localhost"

from sqlalchemy import select
import app.models
from app.database import SessionLocal
from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel
from app.models.subcategoria_model import SubcategoriaModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel
from app.models.imagen_url_model import ImagenUrlModel
from app.services.storage_service import R2StorageService

CSV_PATH = os.path.join(BASE_DIR, "app/static/productos.csv")
STATIC_DIR = os.path.join(BASE_DIR, "app/static/productos")

NORMALIZACION_CATEGORIAS = {
    "accesorio": "Accesorios",
    "accesorios": "Accesorios",
    "alimento": "Alimento",
    "higiene": "Higiene",
    "jardineria": "Jardineria",
    "jardinería": "Jardineria",
    "medicamento": "Medicamentos",
    "medicamentos": "Medicamentos",
    "vacuna": "Medicamentos",
    "insumos": "Accesorios",
    "pintura": "Accesorios",
    "varios": "Accesorios"
}

NORMALIZACION_SUBCATEGORIAS = {
    "perro": "Perro",
    "perros": "Perro",
    "can": "Perro",
    "gato": "Gato",
    "gatos": "Gato",
    "feli": "Gato",
    "equino": "Caballo",
    "caballo": "Caballo",
    "bovino": "Ganaderia / Bovinos",
    "bov": "Ganaderia / Bovinos",
    "ovino": "Ganaderia / Bovinos",
    "peces": "Peces",
    "plantas": "Plantas"
}


def resolver_archivo_imagen(id_imagen_raw: Any) -> Optional[str]:
    """
    Busca físicamente el archivo en el disco tolerando floats de pandas (ej: 3.0 -> '3').
    Maneja .png, .jpeg, .jpg y .webp.
    """
    if pd.isna(id_imagen_raw):
        return None

    # Limpieza: 3.0 -> "3" | "3" -> "3"
    id_str = str(id_imagen_raw).strip()
    if id_str.endswith(".0"):
        id_str = id_str[:-2]

    # Probar las diferentes extensiones existentes en disco
    for ext in [".png", ".jpeg", ".jpg", ".webp"]:
        posible_ruta = os.path.join(STATIC_DIR, f"{id_str}{ext}")
        if os.path.exists(posible_ruta):
            return posible_ruta

    return None


def extraer_nombre_variante(talle: Any, descripcion: str, nombre_prod: str) -> str:
    if pd.notna(talle) and str(talle).strip():
        return str(talle).strip()
    match = re.search(r"(\d+(\.\d+)?\s*(ml|lt|l|kg|g|gr|comp|cc|m|cm))\b", str(descripcion), re.IGNORECASE)
    if match:
        return match.group(0).strip()
    for talla in ["chico", "mediano", "grande", " S", " M", " L", " XL"]:
        if talla.lower() in str(descripcion).lower():
            return talla.strip().upper()
    return "Presentación Estándar"


def importar_catalogo(tenant_key: str):
    db = SessionLocal()
    storage = R2StorageService()

    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: Archivo CSV no encontrado en '{CSV_PATH}'.")
        return

    print(f"[*] Conectado a la base de datos: {os.getenv('DB_NAME')}")
    print(f"[*] Procesando catálogo para [{tenant_key.upper()}]...")
    df = pd.read_csv(CSV_PATH)
    df.columns = [c.strip() for c in df.columns]

    total_prods = 0
    total_vars = 0
    total_imgs = 0
    productos_cache: dict[str, ProductoModel] = {}

    try:
        for _, row in df.iterrows():
            nombre_crudo = str(row.get("Nomre Producto", "")).strip()
            if not nombre_crudo or nombre_crudo.lower() == "nan":
                continue

            cat_cruda = str(row.get("Categoria", "Accesorios")).strip().lower()
            cat_nombre = NORMALIZACION_CATEGORIAS.get(cat_cruda, "Accesorios")

            # 1. Categoría
            stmt_cat = select(CategoriaModel).where(CategoriaModel.cat_nombre == cat_nombre)
            categoria = db.scalars(stmt_cat).first()
            if not categoria:
                categoria = CategoriaModel(cat_nombre=cat_nombre)
                db.add(categoria)
                db.flush()

            precio_fila = float(row["precio"]) if pd.notna(row.get("precio")) and str(row.get("precio")).replace('.', '', 1).isdigit() else 0.0
            clave_producto = f"{nombre_crudo.lower()}_{categoria.cat_id}"
            talle = row.get("Talle")
            descripcion = str(row.get("Descripcion", "")) if pd.notna(row.get("Descripcion")) else None

            # 2. Detección de Variante
            if clave_producto in productos_cache:
                padre = productos_cache[clave_producto]
                padre.prod_solo_variantes = True
                nombre_var = extraer_nombre_variante(talle, descripcion, nombre_crudo)

                nueva_var = ProductoVarianteModel(
                    prod_id=padre.prod_id,
                    var_tipo="Presentación",
                    var_nombre=nombre_var,
                    var_precio_venta=precio_fila,
                    var_stock=10,
                    var_activo=True,
                    var_visible=True,
                    var_disponible=True,
                    var_permitir_sin_stock=True
                )
                db.add(nueva_var)
                total_vars += 1
                continue

            # 3. Producto Maestro
            nuevo_prod = ProductoModel(
                prod_nombre=nombre_crudo,
                prod_descripcion=descripcion,
                prod_precio_venta=precio_fila,
                prod_stock=15,
                cat_id=categoria.cat_id,
                prod_activo=True,
                prod_visible=True,
                prod_disponible=True,
                prod_per_sin_stock=True,
                prod_solo_variantes=False
            )
            db.add(nuevo_prod)
            db.flush()

            productos_cache[clave_producto] = nuevo_prod
            total_prods += 1

            if pd.notna(talle) and str(talle).strip():
                primer_var = ProductoVarianteModel(
                    prod_id=nuevo_prod.prod_id,
                    var_tipo="Presentación",
                    var_nombre=str(talle).strip(),
                    var_precio_venta=precio_fila,
                    var_stock=10,
                    var_activo=True,
                    var_visible=True,
                    var_disponible=True,
                    var_permitir_sin_stock=True
                )
                db.add(primer_var)
                nuevo_prod.prod_solo_variantes = True
                total_vars += 1

            # 4. Subcategorías (Especies con Deduplicación)
            fuente_especie = str(row.get("Especie", "")) if pd.notna(row.get("Especie")) else str(row.get("Subcategoría", ""))
            tokens = re.split(r"[/,]", fuente_especie)
            subcategorias_asignadas_ids = set()

            for token in tokens:
                token_clean = token.strip().lower()
                for k, v in NORMALIZACION_SUBCATEGORIAS.items():
                    if k in token_clean:
                        stmt_sub = select(SubcategoriaModel).where(SubcategoriaModel.subc_nombre == v)
                        sub_obj = db.scalars(stmt_sub).first()
                        if sub_obj and sub_obj.subc_id not in subcategorias_asignadas_ids:
                            db.add(ProductoSubCategoriaModel(prod_id=nuevo_prod.prod_id, subc_id=sub_obj.subc_id))
                            subcategorias_asignadas_ids.add(sub_obj.subc_id)
                        break

            # 5. Imágenes (Cloudflare R2 o Fallback Local)
            img_val = row.get("imagen_url")
            archivo_local = resolver_archivo_imagen(img_val)
            
            if archivo_local:
                nombre_archivo = os.path.basename(archivo_local)
                url_final = storage.upload_local_file(tenant_key, archivo_local, nombre_archivo)
                
                img = ImagenUrlModel(
                    prod_id=nuevo_prod.prod_id,
                    img_url=url_final,
                    img_principal=True,
                    img_tipo=ImagenUrlModel.TIPO_PRODUCTO
                )
                db.add(img)
                total_imgs += 1

        db.commit()
        print("\n" + "=" * 65)
        print("✅ INGESTA DE CATÁLOGO Y FOTOS COMPLETADA")
        print(f"📦 Productos creados:           {total_prods}")
        print(f"🧩 Variantes físicas creadas:   {total_vars}")
        print(f"🖼️  Imágenes vinculadas a BD:    {total_imgs}")
        print("=" * 65 + "\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error fatal durante la importación: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    importar_catalogo(tenant)