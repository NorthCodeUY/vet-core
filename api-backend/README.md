<!-- api-backend/README.md -->

# 🐾 VetCore / NorthCode - Backend Core API

> **Motor Central Agnóstico: Catálogo de Productos con Variantes, Gestión de Pedidos, Facturación, Control de Caja y Módulos de Dominio (Veterinaria / Retail / Servicios).**

El backend de **VetCore** está estructurado bajo una **Arquitectura en Capas Desacoplada** (*Routers -> Schemas -> Services -> Repositories -> Models*) sobre un modelo de infraestructura **Container-per-Tenant** y **Database-per-Tenant**. Un único código base abastece a múltiples clientes y tipos de negocio aislando datos a nivel de base de datos relacional y bucket de almacenamiento, activando funcionalidades mediante *Feature Flags*.

---

## 🛠 Tecnologías Principales

- 🚀 **[FastAPI](https://fastapi.tiangolo.com/)**: Framework asíncrono para contratos API estrictos con OpenAPI auto-generado.
- 🗄️ **[SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/)**: Persistencia relacional orientada a objetos (Queries tipadas vía `select()`).
- 🛡️ **[Pydantic v2](https://docs.pydantic.dev/latest/)**: Validación estricta en tiempo de ejecución (`SettingsConfigDict`, `@field_validator`).
- ☁️ **[Cloudflare R2 / S3 API](https://developers.cloudflare.com/r2/)**: Almacenamiento de objetos stateless con cero costo de egress.
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
├── .env.veterinaria                # Variables de entorno: Tenant Veterinaria Beltramelli
├── .env.flordeloto                 # Variables de entorno: Tenant Tienda Ropa Flor de Loto
├── init-scripts/
│   └── init-multi-db.sh            # Script bash para inicializar múltiples DBs en PostgreSQL
└── app/
    ├── __init__.py
    ├── main.py                     # Entrypoint: Middlewares, CORS y feature gating de routers
    ├── config.py                   # Pydantic Settings: parseo de variables y feature flags
    ├── database.py                 # Conexión SQLAlchemy, pool de sesiones y Base declarativa
    ├── security.py                 # Criptografía: Hashing bcrypt y encode/decode de JWT
    ├── models/                     # Entidades ORM (SQLAlchemy 2.0)
    │   ├── __init__.py
    │   ├── caja_model.py           # Sesiones de caja, movimientos y arqueo de turnos
    │   ├── categoria_model.py
    │   ├── cliente_model.py
    │   ├── funcionario_model.py
    │   ├── imagen_url_model.py     # URLs absolutas persistidas en Cloudflare R2
    │   ├── pago_model.py
    │   ├── pedido_detalle_model.py # Invariante: Congelamiento de precio de venta
    │   ├── pedido_model.py
    │   ├── producto_model.py       # Entidad padre de catálogo
    │   ├── producto_variante_model.py # Variantes (SKU, atributos dinámicos, stock, precios)
    │   ├── subcategoria_model.py
    │   └── user_model.py
    ├── repositories/               # Capa de Persistencia (Queries puras)
    │   ├── __init__.py
    │   ├── caja_repo.py
    │   └── product_repo.py
    ├── router/                     # Controllers / Endpoints REST
    │   ├── __init__.py
    │   ├── auth_router.py
    │   ├── caja_router.py          # Apertura, movimientos y cierre de caja
    │   ├── pedido_route.py
    │   ├── producto_router.py      # Gestión de productos y variantes
    │   └── agenda_router.py        # Módulo cargado condicionalmente (Feature Flag)
    ├── schemas/                    # DTOs y Contratos de Entrada/Salida (Pydantic v2)
    │   ├── __init__.py
    │   ├── caja_schema.py
    │   ├── producto_schema.py
    │   └── user_schema.py
    └── services/                   # Lógica de Negocio y Casos de Uso
        ├── __init__.py
        ├── caja_service.py         # Validación transaccional de caja y balances
        ├── import_excel.py         # Ingesta masiva de inventario
        ├── product_service.py      # Lógica de variantes y stock
        ├── r2_storage_service.py   # Cliente S3/Boto3 para Cloudflare R2
        ├── qr_generator.py         # Generación QR para validación de pedidos
        └── whatsapp_service.py     # Disparo de notificaciones
```

---

## 🏛 Arquitectura Multi-Tenant

El sistema implementa una separación **Database-per-Tenant** y **Bucket-per-Tenant** sobre una infraestructura común:
<!-- <!> aca no se si el elmacenamiento respaldo automatico tendria que hacerlo con Cloudflare R2 apare en fisico en algun lado -->




```mermaid
graph TD
    subgraph Internet / Clientes
        C1[Cliente Veterinaria] -->|Puerto 8001| BV[Backend: Veterinaria Beltramelli]
        C2[Cliente Retail] -->|Puerto 8002| BF[Backend: Flor de Loto]
    end

    subgraph Docker Network: northcode-net
        BV -->|TENANT_TYPE=VET<br/>ENABLE_AGENDA=true| PG[(PostgreSQL Cluster)]
        BF -->|TENANT_TYPE=RETAIL<br/>ENABLE_AGENDA=false| PG
        PG -->|Persistencia Aislada| DB1[(vet_beltramelli_db)]
        PG -->|Persistencia Aislada| DB2[(flor_de_loto_db)]
    end

    subgraph Almacenamiento Cloudflare R2 (Para las fotos)
        BV -->|S3 API| R2_1[(Bucket: vetcore-media)]
        BF -->|S3 API| R2_2[(Bucket: flordeloto-media)]
    end
```
```mermaid
graph TD
    subgraph Internet / Clientes
        C1[Cliente Veterinaria] -->|Puerto 8001| BV[Backend: Veterinaria Beltramelli]
        C2[Cliente Retail] -->|Puerto 8002| BF[Backend: Flor de Loto]
    end

    subgraph Docker Network: northcode-net
        BV -->|TENANT_TYPE=VET<br/>ENABLE_AGENDA=true| PG[(PostgreSQL Cluster)]
        BF -->|TENANT_TYPE=RETAIL<br/>ENABLE_AGENDA=false| PG
        PG -->|Persistencia Aislada| DB1[(vet_beltramelli_db)]
        PG -->|Persistencia Aislada| DB2[(flor_de_loto_db)]
    end

    subgraph Almacenamiento Cloudflare R2 (Para las fotos)
        BV -->|S3 API| R2_1[(Bucket: vetcore-media)]
        BF -->|S3 API| R2_2[(Bucket: flordeloto-media)]
    end
```



### Invariantes de Aislamiento:
1. **Agnosticismo de Código:** Un solo código base para todos los comercios. Todo parche o mejora beneficia a toda la suite.
2. **Feature Gating:** Módulos opcionales (ej. `Agenda`) no registran endpoints en memoria si `ENABLE_AGENDA=false`.
3. **Snapshot Histórico de Facturación:** `pedido_detalle.pd_precio_venta` almacena el valor monetario inmutable en el instante de la transacción, protegiendo las estadísticas contables frente a futuros cambios de precio en el catálogo.
4. **Almacenamiento Stateless:** El servidor no guarda imágenes en disco local. Toda imagen se sube a R2 y la base de datos solo almacena su URL pública.

---

## 💼 1. Módulos Core del Negocio

### A. Almacenamiento Multimedia (Cloudflare R2 / S3)
El servicio `r2_storage_service.py` implementa el cliente compatible con AWS S3 mediante `boto3`.

* **Subida de Archivos:** Las imágenes subidas desde el frontend se envían mediante `UploadFile` (multipart) hacia el backend, que las transmite al bucket del tenant asignado.
* **Nomenclatura en Bucket:** `/{categoria_o_entidad}/{uuid_unico}.{ext}`.
* **Persistencia en Base de Datos:** Se guarda la URL pública absoluta construida con `R2_PUBLIC_URL` (ej: `https://media.veterinaria-beltramelli.com/productos/6ad75bc1.webp`).

#### Variables Requeridas en `.env`:
```env
R2_ACCOUNT_ID="c8cfb64e678b9d08f0fbb247f3d609a9"
R2_ACCESS_KEY_ID="tu_access_key_id"
R2_SECRET_ACCESS_KEY="tu_secret_access_key"
R2_ENDPOINT_URL="https://c8cfb64e678b9d08f0fbb247f3d609a9.r2.cloudflarestorage.com"
R2_BUCKET_NAME="vetcore-media"
R2_PUBLIC_URL="https://media.veterinaria-beltramelli.com"
```

---

### B. Módulo de Catálogo: Productos y Sistema de Variantes
El sistema soporta tanto productos unitarios simples como productos complejos con múltiples presentaciones, tallas, colores o atributos clínicos.

#### 1. Entidad Producto (Padre):
Representa la definición conceptual del artículo:
* Nombre general (ej: *"Alimento Royal Canin Mini Adult"* o *"Remera Oversize"*).
* Descripción, Categoría, Subcategoría y Marca.
* Galería de imágenes generales.
* Tipo de control de inventario (`SIMPLE` vs `VARIANTES`).

#### 2. Entidad ProductoVariante (Hijo):
Representa la unidad transaccional que se vende y descuenta stock:
* `sku`: Código de barras o identificador único comercial (obligatorio por variante).
* `attributes`: Estructura JSON con los atributos dinámicos:
  * *Ejemplo Veterinaria:* `{"peso": "15kg", "etapa": "adulto"}` o `{"dosis": "100ml"}`.
  * *Ejemplo Retail:* `{"talle": "XL", "color": "Negro"}`.
* `price`: Precio de venta al público específico de la variante.
* `cost_price`: Precio de costo de compra (para cálculo de margen de ganancia).
* `stock_actual`: Cantidad de unidades físicas disponibles en depósito.
* `stock_minimo`: Umbral de alerta para reposición.
* `imagen_url`: Foto específica de la variante (opcional, si difiere de la del padre).

---

### C. Módulo de Control de Caja (Cash Shifts & Register)
Diseñado para comercios físicos que requieren apertura, arqueo, auditoría y cierre de turnos de cobro.

* **Apertura de Turno (`POST /api/caja/apertura`):**
  * Registra el monto inicial en efectivo en gaveta (`monto_inicial`).
  * Asocia la caja al usuario logueado (`funcionario_id`) y fecha/hora exacta.
  * Valida que no exista una caja abierta previa para ese mismo operador.
* **Movimientos de Caja (`POST /api/caja/movimiento`):**
  * Registra entradas y salidas manuales no vinculadas a ventas (ej: *Extracción de efectivo para pago a proveedor*, *Ingreso de cambio*).
* **Ventas Automáticas:** Cada factura generada impacta en la caja activa según el método de pago (`EFECTIVO`, `TRANSFERENCIA`, `POS/TARJETA`).
* **Cierre y Arqueo (`POST /api/caja/cierre`):**
  * El operador declara el monto real en efectivo contado físicamente (`monto_declarado`).
  * El sistema calcula el saldo teórico esperado:
    $$\text{Saldo Teórico} = \text{Monto Inicial} + \text{Ventas Efectivo} + \text{Ingresos} - \text{Egresos}$$
  * Guarda automáticamente la `diferencia` (sobrante o faltante).
  * Cambia el estado a `CERRADA` y bloquea cualquier nueva transacción con esa sesión.

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
Con el contenedor de PostgreSQL activo, ejecuta el backend del tenant en el que vas a trabajar:

```bash
# Terminal 1: Backend Veterinaria Beltramelli (Puerto 8001)
python run_desarrollo.py veterinaria

# Terminal 2: Backend Flor de Loto (Puerto 8002)
python run_desarrollo.py flordeloto
```

---

## 🚀 Guía de Despliegue y Aprovisionamiento de Nuevos Clientes

Para incorporar un nuevo comercio a la infraestructura (ej. `Barbería Deluxe`):

### 1. Base de Datos Aislada en PostgreSQL:
Entra al contenedor de base de datos y crea el usuario y schema aislados:
```bash
docker exec -it vet_db_bel psql -U ary -c "CREATE USER usr_barberia WITH PASSWORD 'clave_segura_123';"
docker exec -it vet_db_bel psql -U ary -c "CREATE DATABASE barberia_deluxe_db OWNER usr_barberia;"
docker exec -it vet_db_bel psql -U ary -c "GRANT ALL PRIVILEGES ON DATABASE barberia_deluxe_db TO usr_barberia;"
```

### 2. Bucket Aislado en Cloudflare R2:
1. En Cloudflare Dashboard > **R2 Object Storage** > **Create bucket** con el nombre `barberia-media`.
2. En **Settings > Public Access**: Activar subdominio `r2.dev` o conectar el dominio propio `media.barberia-deluxe.com`.
3. En **Manage R2 API Tokens** > **Create Account API token**:
   * Permisos: **`Object Read & Write`**.
   * Bucket: **`Apply to specific buckets only`** -> Seleccionar únicamente `barberia-media`.
   * Copiar el `Access Key ID` y `Secret Access Key`.

### 3. Crear el archivo `.env.barberia`:
```env
ENV_MODE=production
IS_DOCKER=true

DB_USER=usr_barberia
DB_PASSWORD=clave_segura_123
DB_NAME=barberia_deluxe_db
DB_HOST=vet_db_bel
DB_PORT=5432

APP_PORT=8003
BASE_URL=https://api.barberia-deluxe.com
ALLOWED_ORIGINS=https://barberia-deluxe.com

TENANT_TYPE=SERVICES
ENABLE_AGENDA=true

SECRET_KEY=generar_con_openssl_rand_hex_32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

R2_ACCOUNT_ID=c8cfb64e678b9d08f0fbb247f3d609a9
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_BUCKET_NAME=barberia-media
R2_PUBLIC_URL=https://media.barberia-deluxe.com
```

### 4. Declarar el servicio en `docker-compose.yml`:
```yaml
backend-barberia:
  build: .
  container_name: backend_barberia_deluxe
  restart: always
  ports:
    - "8003:8003"
  env_file:
    - .env.barberia
  depends_on:
    - postgres-cluster
  networks:
    - northcode-net
```

Levantar el nuevo servicio sin tocar los que ya están en producción:
```bash
docker compose up -d --build backend-barberia
```

---

## 📦 Protocolo de Exportación y Entrega a Terceros (Handover SOP)

Si un cliente decide no renovar el mantenimiento y solicita la entrega completa de su portal para continuar con su propio equipo de desarrollo:

### 1. Exportar la Base de Datos Relacional:
Generamos dos formatos (binario rápido para restaurar y SQL plano transparente):

```bash
# Crear directorio temporal
mkdir -p ~/entrega_cliente/database && cd ~/entrega_cliente

# A. Dump Binario Optimizado (para pg_restore)
docker exec -t vet_db_bel pg_dump -U ary -d vet_core_db -F c -b -v -f /tmp/cliente_dump.bin
docker cp vet_db_bel:/tmp/cliente_dump.bin ./database/cliente_dump.bin
docker exec -it vet_db_bel rm /tmp/cliente_dump.bin

# B. Dump SQL Plano (Legible y editable en cualquier gestor)
docker exec -t vet_db_bel pg_dump -U ary -d vet_core_db --clean --if-exists --no-owner --no-privileges > ./database/cliente_schema.sql
```

### 2. Exportar todos los Archivos Multimedia de Cloudflare R2:
Utilizando la herramienta oficial **AWS CLI** con las credenciales aisladas del cliente:

```bash
# 1. Configurar credenciales temporales del bucket
aws configure --profile export-cliente
# AWS Access Key ID: Pegar R2_ACCESS_KEY_ID del cliente
# AWS Secret Access Key: Pegar R2_SECRET_ACCESS_KEY del cliente
# Default region: auto
# Default output format: json

# 2. Descargar todos los archivos manteniendo la estructura
mkdir -p ./media_files
aws s3 sync s3://vetcore-media ./media_files \
  --endpoint-url https://c8cfb64e678b9d08f0fbb247f3d609a9.r2.cloudflarestorage.com \
  --profile export-cliente
```

### 3. Paquete de Entrega Final (`handover.zip`):
Se empaqueta y se entrega al cliente:
```text
entrega_cliente/
├── database/
│   ├── cliente_dump.bin              # Backup binario para pg_restore
│   └── cliente_schema.sql            # Backup SQL plano
├── media_files/                      # Todas las fotos y documentos descargados de R2
├── .env.example                      # Plantilla documentada con variables a configurar
└── README_RESTAURACION.md            # Guía para el nuevo programador
```

> **Garantía de Seguridad:** La infraestructura central de NorthCode nunca se ve comprometida. El cliente solo se lleva sus datos, sin acceso a claves maestras ni a información de otros comercios.

---

## 📚 Enlaces y Documentación Oficial

* 🚀 **Documentación de FastAPI:** [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
* 🗄️ **SQLAlchemy 2.0 Docs:** [https://docs.sqlalchemy.org/en/20/](https://docs.sqlalchemy.org/en/20/)
* 🐘 **Herramienta PostgreSQL `pg_dump`:** [https://www.postgresql.org/docs/current/app-pgdump.html](https://www.postgresql.org/docs/current/app-pgdump.html)
* ☁️ **Cloudflare R2 Storage (S3 API):** [https://developers.cloudflare.com/r2/api/s3/api/](https://developers.cloudflare.com/r2/api/s3/api/)
* 📦 **Sincronización de R2 con AWS CLI:** [https://developers.cloudflare.com/r2/examples/aws/aws-cli/](https://developers.cloudflare.com/r2/examples/aws/aws-cli/)

