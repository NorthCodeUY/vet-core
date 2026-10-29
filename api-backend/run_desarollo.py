# api-backend/run_desarrollo.py
"""
=============================================================================
ORQUESTADOR DE ENTORNO DE DESARROLLO MULTI-TENANT (run_desarrollo.py)
=============================================================================
Script CLI para desarrollo local con auto-aprovisionamiento de infraestructura:
1. Verifica y crea la base de datos física si no existe.
2. Crea tablas nuevas definidas en los modelos.
3. Auto-sincroniza columnas faltantes (Auto-Migración no destructiva).
4. Lanza Uvicorn con recarga en vivo (Hot-Reload).
"""

import sys
import os
import uvicorn
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

TENANTS: dict[str, str] = {
    "veterinaria": ".env.veterinaria",
    "valeria": ".env.veterinaria",
    "flordeloto": ".env.flordeloto",
}


def prompt_create_database() -> None:
    """Verifica si la base de datos existe; si no, la crea de forma interactiva."""
    db_name: str | None = os.getenv("DB_NAME")
    db_user: str = os.getenv("DB_USER", "postgres")
    db_password: str = os.getenv("DB_PASSWORD", "")
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: str = os.getenv("DB_PORT", "5432")

    if not db_name:
        print("\n❌ Error: La variable 'DB_NAME' no está definida en el archivo de entorno.\n")
        sys.exit(1)

    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (db_name,))
        exists = cursor.fetchone()

        if not exists:
            print("\n" + "!" * 70)
            print(f"⚠️  Base de datos objetivo no encontrada: '{db_name}'")
            print("!" * 70)
            opcion = input(f"¿Desea crear la base de datos '{db_name}' ahora? (s/n): ").strip().lower()
            
            if opcion in ["s", "si", "y", "yes"]:
                cursor.execute(f'CREATE DATABASE "{db_name}";')
                print(f"✅ Base de datos '{db_name}' creada exitosamente.")
            else:
                print("\n⛔ Inicio abortado.\n")
                sys.exit(0)

        cursor.close()
        conn.close()

    except psycopg2.OperationalError as err:
        print(f"\n❌ Error de conexión a PostgreSQL: {err}")
        sys.exit(1)


def auto_sync_schema() -> None:
    """
    Inspecciona la base de datos conectada y compara contra los modelos de SQLAlchemy.
    Si agregaste columnas nuevas a tus modelos, ejecuta automáticamente ALTER TABLE
    sin borrar ni alterar los registros existentes.
    """
    from sqlalchemy import inspect, text
    import app.models  # Carga todo el registro de entidades ORM
    from app.database import engine, Base

    # 1. Crear tablas que no existan
    Base.metadata.create_all(bind=engine)

    # 2. Comparar columnas existentes vs columnas definidas en código
    inspector = inspect(engine)
    tablas_existentes = inspector.get_table_names()

    with engine.connect() as conn:
        for nombre_tabla, tabla in Base.metadata.tables.items():
            if nombre_tabla in tablas_existentes:
                columnas_en_db = {col["name"] for col in inspector.get_columns(nombre_tabla)}
                
                for columna in tabla.columns:
                    if columna.name not in columnas_en_db:
                        # Compila el tipo de datos compatible con PostgreSQL
                        tipo_sql = columna.type.compile(engine.dialect)
                        sql_alter = f'ALTER TABLE "{nombre_tabla}" ADD COLUMN IF NOT EXISTS "{columna.name}" {tipo_sql};'
                        
                        print(f"[*] Sincronización automática: Agregando columna '{columna.name}' a la tabla '{nombre_tabla}'...")
                        conn.execute(text(sql_alter))
                        conn.commit()
                        print(f"✅ Columna '{columna.name}' añadida con éxito.")


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1].lower() not in TENANTS:
        disponibles = " | ".join(TENANTS.keys())
        print(f"\n❌ Parámetro de tenant inválido.")
        print(f"👉 Uso: python run_desarrollo.py [{disponibles}]\n")
        sys.exit(1)

    tenant_key: str = sys.argv[1].lower()
    env_path: str = TENANTS[tenant_key]

    if not os.path.exists(env_path):
        print(f"\n❌ Error: Archivo de entorno '{env_path}' no encontrado.\n")
        sys.exit(1)

    load_dotenv(dotenv_path=env_path, override=True)
    os.environ["IS_DOCKER"] = "false"
    os.environ["DB_HOST"] = "localhost"

    # 1. Asegurar existencia de la base de datos física
    prompt_create_database()

    # 2. Auto-sincronizar tablas y columnas faltantes
    auto_sync_schema()

    port: int = int(os.getenv("APP_PORT", 8000))

    print("=" * 70)
    print(f"🚀 [NORTHCODE SAAS] - BACKEND AGNOSTICO EN DESARROLLO")
    print(f"🏢 Tenant Activo  : {tenant_key.upper()}")
    print(f"📄 Archivo Config : {env_path}")
    print(f"🌐 URL Local      : http://localhost:{port}")
    print(f"📚 Documentación  : http://localhost:{port}/docs")
    print("=" * 70)

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )


if __name__ == "__main__":
    main()