# api-backend/scripts/seed_subcategorias.py
"""
=============================================================================
SEMILLERO AUTOMATIZADO DE CATÁLOGO MULTI-TENANT (DATABASE SEEDER)
=============================================================================
Propósito:
    Inyecta las categorías y subcategorías oficiales por cliente:
    - VET: Categorías reales de la clienta (Alimento, Accesorios, etc.) y Especies.
    - RETAIL: Vertical de moda para Flor de Loto.
    
Comportamiento Idempotente:
    - No duplica registros existentes.
    - Si la subcategoría existe sin ícono, le asigna el ícono correspondiente.

Uso:
    python scripts/seed_subcategorias.py veterinaria
    python scripts/seed_subcategorias.py flordeloto
"""
# api-backend/scripts/seed_subcategorias.py

import sys
import os
from dotenv import load_dotenv
from sqlalchemy import select

# Garantiza que el script resuelva las importaciones desde la raíz del backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Carga obligatoria del registro de modelos completo antes de usar SessionLocal
import app.models
from app.database import SessionLocal
from app.models.categoria_model import CategoriaModel
from app.models.subcategoria_model import SubcategoriaModel

# =============================================================================
# CATÁLOGO OFICIAL POR RUBRO
# =============================================================================
CATALOGO_POR_RUBRO = {
    # -------------------------------------------------------------------------
    # VERTICAL 1: VETERINARIA & AGRO (Valeria Beltramelli)
    # -------------------------------------------------------------------------
    "VET": {
        "categorias": [
            "Accesorios",
            "Alimento",
            "Higiene",
            "Jardineria",
            "Medicamentos"
        ],
        "subcategorias": [
            # Nombres exactos que ya existen en tu BD + nuevas incorporaciones
            {"nombre": "Perro", "icono": "Dog"},
            {"nombre": "Gato", "icono": "Cat"},
            {"nombre": "Caballo", "icono": "Sparkles"},
            {"nombre": "Ganaderia / Bovinos", "icono": "Tractor"},
            {"nombre": "Peces", "icono": "Fish"},
            {"nombre": "Plantas", "icono": "Sprout"}
        ]
    },

    # -------------------------------------------------------------------------
    # VERTICAL 2: RETAIL & VESTIMENTA (Flor de Loto)
    # -------------------------------------------------------------------------
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

TENANTS = {
    "veterinaria": {
        "env": ".env.veterinaria",
        "rubro": "VET"
    },
    "flordeloto": {
        "env": ".env.flordeloto",
        "rubro": "RETAIL"
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
        print(f"[*] Conectado a la base de datos.")
        print(f"[*] Procesando catálogo para vertical: [{rubro}]")
        
        cat_nuevas = 0
        subc_nuevas = 0
        subc_actualizadas = 0

        # 1. Procesar Categorías Principales
        for cat_nombre in datos_rubro["categorias"]:
            stmt = select(CategoriaModel).where(CategoriaModel.cat_nombre == cat_nombre)
            existe = db.scalars(stmt).first()
            if not existe:
                db.add(CategoriaModel(cat_nombre=cat_nombre))
                cat_nuevas += 1

        db.flush()

        # 2. Procesar Subcategorías con Íconos
        for sub_data in datos_rubro["subcategorias"]:
            stmt = select(SubcategoriaModel).where(SubcategoriaModel.subc_nombre == sub_data["nombre"])
            subcategoria = db.scalars(stmt).first()

            if not subcategoria:
                # Si no existe, se inserta completa
                nueva_subc = SubcategoriaModel(
                    subc_nombre=sub_data["nombre"],
                    subc_icono=sub_data["icono"],
                    subc_imagen_url=None
                )
                db.add(nueva_subc)
                subc_nuevas += 1
            else:
                # Si ya existía pero no tenía icono configurado, se actualiza
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


def main():
    if len(sys.argv) < 2 or sys.argv[1].lower() not in TENANTS:
        disponibles = " | ".join(TENANTS.keys())
        print(f"\n❌ Uso: python scripts/seed_subcategorias.py [{disponibles}]\n")
        sys.exit(1)

    tenant_key = sys.argv[1].lower()
    info = TENANTS[tenant_key]

    if not os.path.exists(info["env"]):
        print(f"❌ No se encontró el archivo '{info['env']}'.")
        sys.exit(1)

    load_dotenv(dotenv_path=info["env"], override=True)
    os.environ["IS_DOCKER"] = "false"
    os.environ["DB_HOST"] = "localhost"

    poblar_catalogo(info["rubro"])


if __name__ == "__main__":
    main()