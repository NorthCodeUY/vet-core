# api-backend/scripts/seed_subcategorias.py
"""
=============================================================================
SEMILLERO AUTOMATIZADO DE CATÁLOGO MULTI-TENANT (DATABASE SEEDER)
=============================================================================
Inyecta las categorías y subcategorías oficiales por cliente.
Asegura la carga de variables de entorno ANTES de instanciar el engine de BD.
Ejecutar
 python scripts/seed_subcategorias.py veterinaria
 python scripts/seed_subcategorias.py flordeloto
"""

import sys
import os
from dotenv import load_dotenv

# 1. Resolver la ruta absoluta de la raíz del backend (api-backend/)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

TENANTS = {
    "veterinaria": {
        "env_file": ".env.veterinaria",
        "rubro": "VET"
    },
    "flordeloto": {
        "env_file": ".env.flordeloto",
        "rubro": "RETAIL"
    }
}

# -----------------------------------------------------------------------------
# PASO CRÍTICO: CARGA DE ENTORNO ANTES DE IMPORTAR BASE DE DATOS
# -----------------------------------------------------------------------------
if len(sys.argv) < 2 or sys.argv[1].lower() not in TENANTS:
    disponibles = " | ".join(TENANTS.keys())
    print(f"\n❌ Uso: python scripts/seed_subcategorias.py [{disponibles}]\n")
    sys.exit(1)

tenant_key = sys.argv[1].lower()
info = TENANTS[tenant_key]
env_path = os.path.join(BASE_DIR, info["env_file"])

if not os.path.exists(env_path):
    print(f"❌ Error: No se encontró el archivo '{env_path}'.")
    sys.exit(1)

# Cargar variables del tenant específico en memoria
load_dotenv(dotenv_path=env_path, override=True)
os.environ["IS_DOCKER"] = "false"
os.environ["DB_HOST"] = "localhost"

# AHORA SÍ: Con las variables inyectadas, importamos la base de datos y modelos
from sqlalchemy import select
import app.models
from app.database import SessionLocal
from app.models.categoria_model import CategoriaModel
from app.models.subcategoria_model import SubcategoriaModel

# =============================================================================
# CATÁLOGO OFICIAL POR RUBRO
# =============================================================================
CATALOGO_POR_RUBRO = {
    "VET": {
        "categorias": [
            "Accesorios",
            "Alimento",
            "Higiene",
            "Jardineria",
            "Medicamentos"
        ],
        "subcategorias": [
            {"nombre": "Perro", "icono": "Dog"},
            {"nombre": "Gato", "icono": "Cat"},
            {"nombre": "Caballo", "icono": "Sparkles"},
            {"nombre": "Ganaderia / Bovinos", "icono": "Tractor"},
            {"nombre": "Peces", "icono": "Fish"},
            {"nombre": "Plantas", "icono": "Sprout"}
        ]
    },
    "RETAIL": {
        "categorias": [
            "Prendas Superiores",
            "Prendas Inferiores",
            "Calzado",
            "Accesorios & Complementos"
        ],
        "subcategorias": [
            {"nombre": "Buzo Manga Corta", "icono": "Shirt"},
            {"nombre": "Buzo Manga Larga & Hoodies", "icono": "Shirt"},
            {"nombre": "Camperas & Abrigos", "icono": "Sparkles"},
            {"nombre": "Remeras & Tops", "icono": "Shirt"},
            {"nombre": "Pantalones & Jeans", "icono": "Scissors"},
            {"nombre": "Shorts & Bermudas", "icono": "Scissors"},
            {"nombre": "Calzado Femenino", "icono": "Footprints"},
            {"nombre": "Calzado Masculino", "icono": "Footprints"},
            {"nombre": "Bolsos & Carteras", "icono": "ShoppingBag"}
        ]
    }
}


def poblar_catalogo(rubro: str):
    """Ejecuta la inserción o enriquecimiento sin romper registros existentes."""
    db = SessionLocal()
    datos_rubro = CATALOGO_POR_RUBRO.get(rubro)

    if not datos_rubro:
        print(f"❌ Error: Rubro '{rubro}' no configurado.")
        return

    try:
        print(f"[*] Conectado a la base de datos: {os.getenv('DB_NAME')}")
        print(f"[*] Procesando catálogo para vertical: [{rubro}]")
        
        cat_nuevas = 0
        subc_nuevas = 0
        subc_actualizadas = 0

        # 1. Categorías
        for cat_nombre in datos_rubro["categorias"]:
            stmt = select(CategoriaModel).where(CategoriaModel.cat_nombre == cat_nombre)
            existe = db.scalars(stmt).first()
            if not existe:
                db.add(CategoriaModel(cat_nombre=cat_nombre))
                cat_nuevas += 1

        db.flush()

        # 2. Subcategorías con Íconos
        for sub_data in datos_rubro["subcategorias"]:
            stmt = select(SubcategoriaModel).where(SubcategoriaModel.subc_nombre == sub_data["nombre"])
            subcategoria = db.scalars(stmt).first()

            if not subcategoria:
                nueva_subc = SubcategoriaModel(
                    subc_nombre=sub_data["nombre"],
                    subc_icono=sub_data["icono"],
                    subc_imagen_url=None
                )
                db.add(nueva_subc)
                subc_nuevas += 1
            else:
                if not subcategoria.subc_icono:
                    subcategoria.subc_icono = sub_data["icono"]
                    subc_actualizadas += 1

        db.commit()
        
        print("\n" + "=" * 60)
        print(f"✅ SINCRONIZACIÓN EXITOSA PARA [{rubro}]")
        print(f"📁 Categorías nuevas creadas:      {cat_nuevas}")
        print(f"🏷️  Subcategorías nuevas creadas:   {subc_nuevas}")
        print(f"🔄 Subcategorías con ícono añadido: {subc_actualizadas}")
        print("=" * 60 + "\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error fatal: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    poblar_catalogo(info["rubro"])