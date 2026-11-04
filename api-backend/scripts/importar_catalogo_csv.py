# api-backend/scripts/importar_catalogo_csv.py
"""
=============================================================================
INGESTA MASIVA DE CATÁLOGO Y VARIANTES DESDE CSV (SQLALCHEMY 2.0)
=============================================================================
Procesa la planilla CSV del cliente:
1. Normaliza categorías y subcategorías (incluyendo especies múltiples).
2. Agrupa productos repetidos convirtiéndolos en variantes físicas (SKUs).
3. Mapea imágenes y activa flags operativos (prod_solo_variantes, activo, visible).

Uso:
    python scripts/importar_catalogo_csv.py veterinaria
"""

from sqlalchemy.dialects.postgresql import Any
import sys
import os
import re
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import select

# Garantiza resolución de módulos en el backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import app.models
from app.database import SessionLocal
from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel
from app.models.subcategoria_model import SubcategoriaModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.producto_variante_model import ProductoVarianteModel
from app.models.imagen_url_model import ImagenUrlModel

CSV_PATH = "app/static/productos.csv"

# Diccionario de normalización de categorías para evitar duplicados
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

# <!> Ta la subcateogira y la categoria ase reverencia a model 
# Normalización de especies/subcategorías a los nombres base de tu BD subc_nombre

NORMALIZACION_SUBCATEGORIAS = {
    "perro": "Perro",
    "perros": "Perro",
    "can": "Perro",
    "canino": "Perro",
    "gato": "Gato",
    "gatos": "Gato",
    "feli": "Gato",
    "equino": "Caballo",
    "equi": "Caballo",
    "caballo": "Caballo",
    "bovino": "Ganaderia / Bovinos",
    "bov": "Ganaderia / Bovinos",
    "ovino": "Ganaderia / Bovinos",
    "ovi": "Ganaderia / Bovinos",
    "peces": "Peces",
    "plantas": "Plantas"
}


def extraer_nombre_variante(talle: Any, descripcion: str, nombre_prod: str) -> str:
    """Extrae una etiqueta de variante legible a partir de la columna Talle o Descripción."""
    if pd.notna(talle) and str(talle).strip():
        return str(talle).strip()
    
    # Buscar patrones comunes en la descripción (ej: 100ml, 250g, 5lt, S, M, L)
    match = re.search(r"(\d+(\.\d+)?\s*(ml|lt|l|kg|g|gr|comp|cc|m|cm))\b", str(descripcion), re.IGNORECASE)
    if match:
        return match.group(0).strip()
    
    # Detectar talles chicos/medianos/grandes
    for talla in ["chico", "mediano", "grande", " S", " M", " L", " XL"]:
        if talla.lower() in str(descripcion).lower():
            return talla.strip().upper()

    return "Presentación Estándar"


def importar_catalogo(tenant_key: str):
    db = SessionLocal()
    
    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: Archivo '{CSV_PATH}' no encontrado.")
        return

    print(f"[*] Leyendo archivo CSV: {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    
    # Limpieza de nombres de columnas
    df.columns = [c.strip() for c in df.columns]

    total_productos_creados = 0
    total_variantes_creadas = 0

    # Cache en memoria para agrupar productos por nombre normalizado
    productos_registrados: dict[str, ProductoModel] = {}

    try:
        for idx, row in df.iterrows():
            nombre_crudo = str(row.get("Nomre Producto", "")).strip()
            if not nombre_crudo or nombre_crudo.lower() == "nan":
                continue

            cat_cruda = str(row.get("Categoria", "Accesorios")).strip().lower()
            cat_nombre = NORMALIZACION_CATEGORIAS.get(cat_cruda, "Accesorios")

            # -----------------------------------------------------------------
            # 1. RESOLVER CATEGORÍA (Buscar o Crear)
            # -----------------------------------------------------------------
            stmt_cat = select(CategoriaModel).where(CategoriaModel.cat_nombre == cat_nombre)
            categoria = db.scalars(stmt_cat).first()
            if not categoria:
                categoria = CategoriaModel(cat_nombre=cat_nombre)
                db.add(categoria)
                db.flush()

            # -----------------------------------------------------------------
            # 2. RESOLVER PRODUCTO (Evitar duplicados agrupando por nombre y cat)
            # -----------------------------------------------------------------
            precio_fila = float(row["precio"]) if pd.notna(row.get("precio")) and str(row.get("precio")).replace('.', '', 1).isdigit() else 0.0
            clave_producto = f"{nombre_crudo.lower()}_{categoria.cat_id}"
            
            talle = row.get("Talle")
            descripcion = str(row.get("Descripcion", "")) if pd.notna(row.get("Descripcion")) else None

            if clave_producto in productos_registrados:
                # PRODUCTO REPETIDO -> SE CONVIERTE EN VARIANTE DEL EXISTENTE
                prod_padre = productos_registrados[clave_producto]
                prod_padre.prod_solo_variantes = True  # Marca que se compone de opciones
                
                # Crear la variante hija
                nombre_var = extraer_nombre_variante(talle, descripcion, nombre_crudo)
                diferencial_precio = precio_fila - prod_padre.prod_precio if prod_padre.prod_precio > 0 else precio_fila

                nueva_variante = ProductoVarianteModel(
                    prod_id=prod_padre.prod_id,
                    var_tipo="Medida / Presentación",
                    var_nombre=nombre_var,
                    var_precio_adicional=max(diferencial_precio, 0.0),
                    var_stock=10,  # Stock por defecto para pruebas
                    var_activo=True,
                    var_visible=True,
                    var_disponible=True,
                    var_permitir_sin_stock=True
                )
                db.add(nueva_variante)
                total_variantes_creadas += 1
                continue

            # NUEVO PRODUCTO MAESTRO
            nuevo_prod = ProductoModel(
                prod_nombre=nombre_crudo,
                prod_descripcion=descripcion,
                prod_precio=precio_fila,
                prod_stock=15,  # Existencia inicial de prueba
                cat_id=categoria.cat_id,
                prod_activo=True,
                prod_visible=True,
                prod_disponible=True,
                prod_per_sin_stock=True if precio_fila == 0.0 else False,
                prod_solo_variantes=False
            )
            db.add(nuevo_prod)
            db.flush()

            productos_registrados[clave_producto] = nuevo_prod
            total_productos_creados += 1

            # Si el producto tiene talle explícito de entrada, crear su primera variante
            if pd.notna(talle) and str(talle).strip():
                primer_var = ProductoVarianteModel(
                    prod_id=nuevo_prod.prod_id,
                    var_tipo="Presentación",
                    var_nombre=str(talle).strip(),
                    var_precio_adicional=0.0,
                    var_stock=10,
                    var_activo=True,
                    var_visible=True,
                    var_disponible=True,
                    var_permitir_sin_stock=True
                )
                db.add(primer_var)
                nuevo_prod.prod_solo_variantes = True
                total_variantes_creadas += 1

            # -----------------------------------------------------------------
            # 3. RESOLVER SUBCATEGORÍAS / ESPECIES
            # -----------------------------------------------------------------
            fuente_especie = str(row.get("Especie", "")) if pd.notna(row.get("Especie")) else str(row.get("Subcategoría", ""))
            
            # Divide múltiples especies (ej: "Perro/Gato", "Bov/Ovi/Equi")
            tokens_especies = re.split(r"[/,]", fuente_especie)
            for token in tokens_especies:
                token_clean = token.strip().lower()
                if not token_clean:
                    continue

                subc_nombre_final = None
                for clave, nombre_oficial in NORMALIZACION_SUBCATEGORIAS.items():
                    if clave in token_clean:
                        subc_nombre_final = nombre_oficial
                        break

                if subc_nombre_final:
                    stmt_sub = select(SubcategoriaModel).where(SubcategoriaModel.subc_nombre == subc_nombre_final)
                    subc_obj = db.scalars(stmt_sub).first()
                    
                    if subc_obj:
                        # Verificar que no esté vinculado previamente
                        stmt_rel = select(ProductoSubCategoriaModel).where(
                            ProductoSubCategoriaModel.prod_id == nuevo_prod.prod_id,
                            ProductoSubCategoriaModel.subc_id == subc_obj.subc_id
                        )
                        if not db.scalars(stmt_rel).first():
                            db.add(ProductoSubCategoriaModel(prod_id=nuevo_prod.prod_id, subc_id=subc_obj.subc_id))

            # -----------------------------------------------------------------
            # 4. RESOLVER IMÁGENES
            # -----------------------------------------------------------------
            img_val = row.get("imagen_url")
            if pd.notna(img_val) and str(img_val).strip():
                nombre_archivo = f"{str(img_val).strip()}.png"
                img = ImagenUrlModel(
                    prod_id=nuevo_prod.prod_id,
                    img_url=f"/static/productos/{nombre_archivo}",
                    img_principal=True,
                    img_tipo=ImagenUrlModel.TIPO_PRODUCTO
                )
                db.add(img)

        db.commit()
        print("\n" + "=" * 65)
        print("✅ INGESTA DE CATÁLOGO COMPLETADA EXITOSAMENTE")
        print(f"📦 Productos únicos insertados:   {total_productos_creados}")
        print(f"🧩 Variantes físicas detectadas:  {total_variantes_creadas}")
        print("=" * 65 + "\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error fatal durante la importación: {e}")
        sys.exit(1)
    finally:
        db.close()


def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/importar_catalogo_csv.py [veterinaria|flordeloto]")
        sys.exit(1)

    tenant = sys.argv[1].lower()
    env_file = f".env.{tenant}"

    if not os.path.exists(env_file):
        print(f"Error: {env_file} no encontrado.")
        sys.exit(1)

    load_dotenv(dotenv_path=env_file, override=True)
    os.environ["IS_DOCKER"] = "false"
    os.environ["DB_HOST"] = "localhost"

    importar_catalogo(tenant)


if __name__ == "__main__":
    main()