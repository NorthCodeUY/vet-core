
 <!-- api-backend/README.md -->

# VetCore / NorthCode - Backend Core API

> **Motor Central Agnóstico: Catálogo de Productos con Variantes, Gestión de Pedidos, Facturación, Control de Caja y Módulos de Dominio (Veterinaria / Retail / Servicios).**

El backend de **VetCore** está estructurado bajo una **Arquitectura en Capas Desacoplada** (*Routers -> Schemas -> Services -> Repositories -> Models*) sobre un modelo de infraestructura **Container-per-Tenant** y **Database-per-Tenant**. Un único código base abastece a múltiples clientes aislando datos a nivel de base de datos relacional y bucket de almacenamiento, activando funcionalidades mediante *Feature Flags*.

---

## 🛠 Tecnologías Principales

- 🚀 **[FastAPI](https://fastapi.tiangolo.com/)**: Framework asíncrono para contratos API estrictos con OpenAPI auto-generado.
- 🗄️ **[SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/)**: Persistencia relacional orientada a objetos (Queries tipadas vía `select()`).
- 🛡️ **[Pydantic v2](https://docs.pydantic.dev/latest/)**: Validación estricta en tiempo de ejecución (`SettingsConfigDict`, `@field_validator`).
- ☁️ **[Cloudflare R2 / S3 API](https://developers.cloudflare.com/r2/)**: Almacenamiento de objetos stateless con durabilidad distribuida (11 noves) y cero costo de egreso.
- ⚡ **[Uvicorn](https://www.uvicorn.org/)**: Servidor ASGI de alto rendimiento.
- 🐘 **[PostgreSQL 15](https://www.postgresql.org/docs/)**: Clúster de bases de datos relacionales independientes por tenant.
- 🔑 **[PyJWT / Passlib (Bcrypt)](https://passlib.readthedocs.io/)**: Autenticación RBAC y hashing criptográfico seguro.
- 🐳 **[Docker & Compose V2](https://docs.docker.com/)**: Empaquetado multi-tenant, redes aisladas y orquestación.

---

## 📦 Estructura del Proyecto

```text
api-backend/
├── Dockerfile                      # Imagen base de producción agnóstica
├── docker-compose.yml              # Orquestador del clúster PostgreSQL y backends por tenant
├── requirements.txt                # Dependencias fijadas con versiones exactas
├── run_desarrollo.py               # CLI runner para levantar entornos locales por tenant
├── .env.example                    # Plantilla base con todas las variables requeridas
├── .env.veterinaria                # Variables de entorno: Tenant Veterinaria Beltramelli
├── .env.flordeloto                 # Variables de entorno: Tenant Tienda Ropa Flor de Loto
├── init-scripts/
│   └── init-multi-db.sh            # Script bash para inicializar múltiples DBs en PostgreSQL
├── scripts/
│   └── crear_caja.py               # CLI para generación de cajas y códigos QR de depósito
└── app/
    ├── __init__.py
    ├── main.py                     # Entrypoint: Middlewares, CORS y feature gating de routers
    ├── config.py                   # Pydantic Settings: parseo de variables y feature flags
    ├── database.py                 # Conexión SQLAlchemy, pool de sesiones y Base declarativa
    ├── security.py                 # Criptografía: Hashing bcrypt y encode/decode de JWT
    ├── models/                     # Entidades ORM (SQLAlchemy 2.0)
    │   ├── __init__.py
    │   ├── caja_model.py           # Contenedores físicos de depósito y ubicaciones
    │   ├── caja_item_model.py      # Inventario físico de productos/variantes por caja
    │   ├── categoria_model.py
    │   ├── cliente_model.py
    │   ├── color_model.py          # Paleta normalizada con códigos hexadecimales
    │   ├── funcionario_model.py
    │   ├── imagen_url_model.py     # URLs persistidas en Cloudflare R2 o almacenamiento local
    │   ├── pago_model.py
    │   ├── pedido_detalle_model.py # Invariante: Congelamiento de precio de venta (Snapshot)
    │   ├── pedido_model.py
    │   ├── producto_model.py       # Entidad padre de catálogo
    │   ├── producto_variante_model.py # Variantes físicas (SKU, talle, medida, stock, precios)
    │   ├── subcategoria_model.py
    │   └── user_model.py
    ├── repositories/               # Capa de Persistencia (Queries puras)
    │   ├── __init__.py
    │   ├── caja_repo.py
    │   └── product_repo.py
    ├── router/                     # Controllers / Endpoints REST
    │   ├── __init__.py
    │   ├── auth_router.py
    │   ├── caja_router.py          # Lectura QR de cajas e inventario de depósito
    │   ├── pedido_route.py
    │   ├── producto_router.py      # Gestión de catálogo y variantes
    │   └── agenda_router.py        # Módulo cargado condicionalmente (Feature Gating)
    ├── schemas/                    # DTOs y Contratos de Entrada/Salida (Pydantic v2)
    │   ├── __init__.py
    │   ├── caja_schema.py
    │   ├── producto_schema.py
    │   └── user_schema.py
    └── services/                   # Lógica de Negocio y Casos de Uso
        ├── __init__.py
        ├── import_excel.py         # Ingesta masiva de inventario
        ├── product_service.py      # Lógica de negocio de catálogo y cálculo de precios
        ├── r2_storage_service.py   # Cliente S3/Boto3 para Cloudflare R2
        ├── qr_generator.py         # Generación QR para validación de pedidos y cajas
        └── whatsapp_service.py     # Disparo de notificaciones
```

---

## 🏛 Arquitectura Multi-Tenant

> Diagrama de referencia técnica sincronizado con `docs/architecture/diagrama_arquitectura_backend.md`.


### Invariantes de Aislamiento:
1. **Agnosticismo de Código:** Un solo artefacto de software para todos los comercios. Toda corrección de seguridad o mejora beneficia a toda la infraestructura sin crear forks.
2. **Feature Gating:** Módulos opcionales (ej. `Agenda`) no registran routers en memoria si la variable `ENABLE_AGENDA=false`.
3. **Snapshot Histórico Financiero:** `pedido_detalle.pd_precio` almacena el valor monetario inmutable en el instante de la transacción. Modificaciones futuras de precios en catálogo no corrompen los balances históricos.
4. **Almacenamiento Stateless:** El servidor no depende del disco local. Las imágenes viven en Cloudflare R2 y la base de datos almacena la URL de acceso público.

---

## 💾 Política de Respaldos y Persistencia

### 1. Base de Datos Relacional (Crítico):
PostgreSQL almacena transacciones financieras, usuarios y estados de inventario. Requiere respaldos lógicos diarios mediante `pg_dump` automatizado (cronjob en el host o exportación a almacenamiento frío S3/R2).

### 2. Archivos Multimedia (Cloudflare R2):
Cloudflare R2 replica los objetos de forma geodistribuida automática con una durabilidad del 99.999999999% (11 nueves). **No es necesario respaldar las imágenes en discos duros locales o físicos del VPS**. La única precaución requerida es ejecutar una exportación puntual con AWS CLI antes de cerrar el contrato de un cliente.

---

## 💻 Entorno de Desarrollo Local

### 1. Requisitos Previos
- Python 3.12+
- Motor Docker y Compose V2 activos
- Entorno virtual (`venv`)

### 2. Instalación de Dependencias
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: .\venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Ejecución por Tenant
Con el motor de PostgreSQL activo, ejecuta el backend del tenant en el que vas a trabajar:

```bash
# Terminal 1: Backend Veterinaria Beltramelli (Puerto 8001)
python run_desarrollo.py veterinaria

# Terminal 2: Backend Flor de Loto (Puerto 8002)
python run_desarrollo.py flordeloto
```

---

## 🚀 Guía de Despliegue y Aprovisionamiento de Nuevos Clientes (SOP)

Sigue este procedimiento estandarizado para dar de alta cualquier comercio nuevo en la infraestructura:

### Paso 1: Crear la Base de Datos Aislada en PostgreSQL
Conéctate al contenedor activo (`vet_db_bel`) y crea el usuario y la base de datos correspondiente:

```bash
# Reemplaza [TENANT_ID] por el nombre del cliente (ej: barberia)
docker exec -it vet_db_bel psql -U ary -c "CREATE USER usr_[TENANT_ID] WITH PASSWORD 'clave_segura_aqui';"
docker exec -it vet_db_bel psql -U ary -c "CREATE DATABASE [TENANT_ID]_db OWNER usr_[TENANT_ID];"
docker exec -it vet_db_bel psql -U ary -c "GRANT ALL PRIVILEGES ON DATABASE [TENANT_ID]_db TO usr_[TENANT_ID];"
```

### Paso 2: Configurar Almacenamiento en Cloudflare R2
1. En el Dashboard de Cloudflare > **R2 Object Storage** > **Create bucket** con nombre `[TENANT_ID]-media`.
2. En **Settings > Public Access**: Activar subdominio `r2.dev` o vincular un dominio personalizado (ej: `media.[TENANT_DOMINIO].com`).
3. En **Manage R2 API Tokens** > **Create Account API token**:
   - Permisos: **`Object Read & Write`**.
   - Ámbito: **`Apply to specific buckets only`** -> Seleccionar `[TENANT_ID]-media`.
   - Guardar el `Access Key ID` y `Secret Access Key`.

### Paso 3: Crear el Archivo de Entorno (`.env.[TENANT_ID]`)
Copia la plantilla base y completa los valores del nuevo cliente:
```bash
cp .env.example .env.[TENANT_ID]
```

Configura las variables críticas:
```env
ENV_MODE=production
IS_DOCKER=true

# Credenciales de BD del Paso 1
DB_USER=usr_[TENANT_ID]
DB_PASSWORD=clave_segura_aqui
DB_NAME=[TENANT_ID]_db
DB_HOST=vet_db_bel
DB_PORT=5432

# Puerto único para el contenedor de este cliente
APP_PORT=800X
BASE_URL=https://api.[TENANT_DOMINIO].com
ALLOWED_ORIGINS=https://[TENANT_DOMINIO].com

# Feature Flags según el modelo de negocio
TENANT_TYPE=SERVICES  # RETAIL | VET | SERVICES
ENABLE_AGENDA=true

# Seguridad
SECRET_KEY=generar_con_openssl_rand_hex_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# Credenciales de R2 del Paso 2
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_BUCKET_NAME=[TENANT_ID]-media
R2_PUBLIC_URL=https://media.[TENANT_DOMINIO].com
```

### Paso 4: Declarar el Servicio en `docker-compose.yml`
Añade el nuevo bloque bajo la sección `services`:

```yaml
  backend-[TENANT_ID]:
    build: .
    container_name: backend_[TENANT_ID]
    restart: always
    ports:
      - "800X:800X"
    env_file:
      - .env.[TENANT_ID]
    networks:
      - northcode-net
```

### Paso 5: Levantar el Servicio Aislado
Inicia el nuevo contenedor sin reiniciar ni alterar los clientes que ya están en producción:
```bash
docker compose up -d --build backend-[TENANT_ID]
```

Verifica su estado de salud:
```bash
curl -I http://localhost:800X/docs
```

---

## 📦 Protocolo de Exportación y Entrega a Terceros (Handover SOP)

Procedimiento para entregar la totalidad de datos y activos cuando un cliente se desvincula del servicio:

### 1. Exportar la Base de Datos Relacional:
```bash
mkdir -p ~/entrega_cliente/database && cd ~/entrega_cliente

# A. Dump Binario Optimizado (para pg_restore)
docker exec -t vet_db_bel pg_dump -U ary -d [TENANT_ID]_db -F c -b -v -f /tmp/cliente_dump.bin
docker cp vet_db_bel:/tmp/cliente_dump.bin ./database/cliente_dump.bin
docker exec -it vet_db_bel rm /tmp/cliente_dump.bin

# B. Dump SQL Plano (Legible y editable en cualquier cliente SQL)
docker exec -t vet_db_bel pg_dump -U ary -d [TENANT_ID]_db --clean --if-exists --no-owner --no-privileges > ./database/cliente_schema.sql
```

### 2. Exportar Archivos Multimedia desde Cloudflare R2:
Descarga todos los activos del bucket utilizando **AWS CLI**:

```bash
# 1. Configurar credenciales del bucket del cliente
aws configure --profile export-[TENANT_ID]

# 2. Sincronizar hacia carpeta local
mkdir -p ./media_files
aws s3 sync s3://[TENANT_ID]-media ./media_files \
  --endpoint-url https://[R2_ACCOUNT_ID].r2.cloudflarestorage.com \
  --profile export-[TENANT_ID]
```

### 3. Contenido del Paquete de Entrega (`handover.zip`):
```text
entrega_[TENANT_ID]/
├── database/
│   ├── cliente_dump.bin              # Backup binario para pg_restore
│   └── cliente_schema.sql            # Script SQL plano
├── media_files/                      # Directorio con imágenes descargadas de R2
├── .env.example                      # Plantilla de variables para el nuevo entorno
└── README_RESTAURACION.md            # Guía técnica de restauración
```

---

## 📚 Documentación de Referencia

* 🚀 **FastAPI Framework:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
* 🗄️ **SQLAlchemy 2.0 Unified Tutorial:** [https://docs.sqlalchemy.org/en/20/tutorial/](https://docs.sqlalchemy.org/en/20/tutorial/)
* 🐘 **Documentación PostgreSQL `pg_dump`:** [https://www.postgresql.org/docs/current/app-pgdump.html](https://www.postgresql.org/docs/current/app-pgdump.html)
* ☁️ **Cloudflare R2 S3 API Compatibility:** [https://developers.cloudflare.com/r2/api/s3/api/](https://developers.cloudflare.com/r2/api/s3/api/)
