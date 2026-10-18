# api-backend/run_desarrollo.py
"""
=============================================================================
ORQUESTADOR DE ENTORNO DE DESARROLLO MULTI-TENANT (run_desarrollo.py)
=============================================================================
Script CLI para inicializar instancias de FastAPI en entorno local (Host).
Permite alternar entre diferentes clientes (Silo Architecture) inyectando el
archivo de variables de entorno (.env.<tenant>) correspondiente sin depender
de la infraestructura de contenedores Docker para depuración rápida.
"""

import sys
import os
import uvicorn
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# =============================================================================
# 1. REGISTRO DE TENANTS Y MAPEO DE ARCHIVOS DE ENTORNO
# =============================================================================
TENANTS: dict[str, str] = {
    "veterinaria": ".env.veterinaria",      # Instancia Valeria Beltramelli
    "valeria": ".env.veterinaria",          # Alias directo para Valeria
    "flordeloto": ".env.flordeloto",        # Instancia Boutique Flor de Loto
}

def prompt_create_database() -> None:
    """
    Verifica la existencia física de la base de datos en el cluster de PostgreSQL.
    Si no existe, intercepta la ejecución e interactúa por consola para solicitar
    confirmación de creación antes de inicializar SQLAlchemy.
    """
    db_name: str | None = os.getenv("DB_NAME")
    db_user: str = os.getenv("DB_USER", "postgres")
    db_password: str = os.getenv("DB_PASSWORD", "")
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: str = os.getenv("DB_PORT", "5432")

    if not db_name:
        print("\n❌ Error: La variable 'DB_NAME' no está definida en el archivo de entorno.\n")
        sys.exit(1)

    try:
        # Conexión administrativa al catálogo raíz 'postgres'
        conn = psycopg2.connect(
            dbname="postgres",
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Consulta idempotente para chequear existencia de la BD
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (db_name,))
        exists = cursor.fetchone()

        if not exists:
            print("\n" + "!" * 70)
            print(f"⚠️  ALERTA DE INFRAESTRUCTURA: Base de datos no encontrada.")
            print(f"🏢 Base de datos objetivo: '{db_name}'")
            print("!" * 70)
            
            # Confirmación interactiva por consola
            opcion = input(f"\n¿Desea crear la base de datos '{db_name}' automáticamente ahora? (s/n): ").strip().lower()
            
            if opcion in ["s", "si", "y", "yes"]:
                print(f"\n[*] Ejecutando: CREATE DATABASE \"{db_name}\"...")
                cursor.execute(f'CREATE DATABASE "{db_name}";')
                print(f"✅ Base de datos '{db_name}' creada exitosamente.")
            else:
                print(f"\n⛔ Operación abortada por el usuario. No se puede iniciar sin la base de datos.\n")
                cursor.close()
                conn.close()
                sys.exit(0)

        cursor.close()
        conn.close()

    except psycopg2.OperationalError as err:
        print(f"\n❌ Error de Conexión a PostgreSQL: {err}")
        print("Verifique que el servicio de base de datos esté levantado y escuchando en el puerto configurado.\n")
        sys.exit(1)


def main() -> None:
    """
    Punto de entrada principal del orquestador.
    Valida argumentos CLI, sobreescribe variables para host local,
    gestiona el aprovisionamiento interactivo de BD e inicia Uvicorn.
    """
    # -------------------------------------------------------------------------
    # A. Validación de Parámetros de Entrada (CLI)
    # -------------------------------------------------------------------------
    if len(sys.argv) < 2 or sys.argv[1].lower() not in TENANTS:
        disponibles = " | ".join(TENANTS.keys())
        print(f"\n❌ Error: Parámetro de tenant inválido o ausente.")
        print(f"👉 Uso correcto: python run_desarrollo.py [{disponibles}]\n")
        sys.exit(1)

    tenant_key: str = sys.argv[1].lower()
    env_path: str = TENANTS[tenant_key]

    if not os.path.exists(env_path):
        print(f"\n❌ Error Crítico: No se encontró el archivo de entorno '{env_path}'.")
        print(f"Verifique que el archivo exista en la raíz de 'api-backend/'.\n")
        sys.exit(1)

    # -------------------------------------------------------------------------
    # B. Inyección Dinámica de Variables de Entorno en Runtime
    # -------------------------------------------------------------------------
    load_dotenv(dotenv_path=env_path, override=True)

    os.environ["IS_DOCKER"] = "false"
    os.environ["DB_HOST"] = "localhost"

    # Verificación interactiva / Aprovisionamiento antes de levantar la app
    prompt_create_database()

    port: int = int(os.getenv("APP_PORT", 8000))

    print("=" * 70)
    print(f"🚀 [NORTHCODE SAAS] - INICIANDO BACKEND AGNOSTICO")
    print(f"🏢 Tenant Activo  : {tenant_key.upper()}")
    print(f"📄 Archivo Config : {env_path}")
    print(f"🌐 URL Local      : http://localhost:{port}")
    print(f"📚 Documentación  : http://localhost:{port}/docs")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # C. Ejecución del Servidor ASGI con Recarga en Vivo (Hot Reload)
    # -------------------------------------------------------------------------
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()