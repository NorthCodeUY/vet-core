# api-backend/scripts/crear_admin.py
"""
=============================================================================
CLI ADMINISTRATIVO: CREACIÓN DE SUPERUSUARIOS / ADMINISTRADORES
=============================================================================
Uso:
    python scripts/crear_admin.py veterinaria admin@beltramelli.com ClaveSegura2024
    python scripts/crear_admin.py flordeloto admin@flordeloto.com ClaveSegura2024
"""

import sys
import os
from dotenv import load_dotenv

# 1. Validación de parámetros de línea de comandos
if len(sys.argv) < 4:
    print("\n❌ Parámetros insuficientes.")
    print("👉 Uso correcto: python scripts/crear_admin.py [tenant] [email] [password]\n")
    sys.exit(1)

tenant_key = sys.argv[1].lower()
email = sys.argv[2].strip().lower()
password = sys.argv[3].strip()

# 2. Configurar entorno y forzar carga antes de cualquier import de SQLAlchemy
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
env_path = f".env.{tenant_key}"

if not os.path.exists(env_path):
    print(f"❌ Error: Archivo de configuración '{env_path}' no existe.")
    sys.exit(1)

# Cargar variables del tenant específico antes de inicializar database.py
load_dotenv(dotenv_path=env_path, override=True)
os.environ["IS_DOCKER"] = "false"
os.environ["DB_HOST"] = "localhost"

# 3. Imports diferidos: garantizan que 'app.database' lea las variables recién inyectadas
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from app.database import Base, engine
import app.models  # Registra todos los modelos en Base.metadata
from app.models.user_model import UserModel
from app.security import get_password_hash


def main() -> None:
    # Garantizar que las tablas existan en la base de datos del tenant
    print(f"[*] Verificando esquema relacional en base de datos de [{tenant_key.upper()}]...")
    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = Session()

    try:
        stmt = select(UserModel).where(UserModel.usu_email == email)
        usuario_existente = db.scalars(stmt).first()

        password_hasheada = get_password_hash(password)

        if usuario_existente:
            print(f"[*] El usuario '{email}' ya existe. Actualizando contraseña y elevando a ADMIN...")
            usuario_existente.usu_password_hash = password_hasheada
            usuario_existente.usu_rol = "ADMIN"
            usuario_existente.usu_activo = True
        else:
            print(f"[*] Creando nuevo Superusuario ADMIN para [{tenant_key.upper()}]...")
            nuevo_admin = UserModel(
                usu_email=email,
                usu_password_hash=password_hasheada,
                usu_nombre="Administrador General",
                usu_nombre_mostrar="Admin",
                usu_rol="ADMIN",
                usu_activo=True,
            )
            db.add(nuevo_admin)

        db.commit()
        print(f"✅ Administrador '{email}' configurado exitosamente en [{tenant_key.upper()}].\n")

    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear el administrador: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()