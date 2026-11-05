<!-- api-backend/README.md -->

# ⚙️ VetCore / NorthCode — Backend Core API

> **Motor Central Agnóstico:** Catálogo de Productos con Variantes (SKU/Colores/Talles), Gestión de Pedidos, Facturación, Control de Depósito por Cajas QR y Módulos de Dominio (Veterinaria, Retail y Servicios).

El backend de **VetCore** está estructurado bajo una **Arquitectura en Capas Desacoplada** (*Routers ➔ Schemas ➔ Services ➔ Repositories ➔ Models*), implementado con **FastAPI**, **SQLAlchemy 2.0** y **Pydantic v2**. Un único código base atiende a múltiples comercios garantizando aislamiento estricto de datos y almacenamiento stateless.

---

## 🧭 Navegación Rápida

- 📦 [Árbol de Directorios y Enlaces de Código](#-estructura-del-proyecto-y-accesos-directos)
- 🏛️ [Arquitectura en Capas del Backend](#-arquitectura-en-capas-del-backend)
- 🔄 [Diagrama de Secuencia: Ciclo de una Petición](#-diagrama-de-secuencia-ciclo-de-vida-de-una-petición)
- 🧩 [Explicación Detallada de Módulos Core](#-explicación-detallada-de-los-componentes-core)
- 🌐 [Infraestructura y Despliegue](#-infraestructura-y-orquestación-multi-tenant)
- 🧪 [Auditoría y Pruebas Rápidas con `curl`](#-auditoría-y-pruebas-rápidas-con-curl)
- 💻 [Entorno de Desarrollo Local](#-entorno-de-desarrollo-local)
- 🛠️ [Scripts y Tareas de Mantenimiento](#-scripts-utilitarios-y-mantenimiento)

---

## 📦 Estructura del Proyecto y Accesos Directos

Cada archivo del árbol cuenta con su enlace directo para inspección y edición inmediata:

```text
api-backend/
├── 📄 [Dockerfile](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/Dockerfile)                            # Imagen base de producción FastAPI
├── 📄 [docker-compose.yml](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/docker-compose.yml)                  # Orquestador del clúster PostgreSQL y backends por tenant
├── 📄 [requirements.txt](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/requirements.txt)                    # Dependencias exactas fijadas para el entorno
├── 📄 [run_desarollo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/run_desarollo.py)                    # CLI runner interactivo con auto-creación de DB y migración
├── 📄 [.env.example](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/.env.example)                        # Plantilla base con variables requeridas
├── 📄 [.env.veterinaria](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/.env.veterinaria)                    # Configuración: Tenant Veterinaria Beltramelli
├── 📄 [.env.flordeloto](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/.env.flordeloto)                     # Configuración: Tenant Tienda Ropa Flor de Loto
├── 📁 [script-sql/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/script-sql)
│   └── 📄 [agregar.sql](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/script-sql/agregar.sql)                 # Scripts SQL manuales y migraciones de emergencia
├── 📁 [scripts/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts)
│   ├── 📄 [crear_admin.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/crear_admin.py)              # Alta administrativa de superusuario con contraseña hasheada
│   ├── 📄 [crear_caja.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/crear_caja.py)               # Creación de cajas de depósito y generación de QR
│   ├── 📄 [importar_catalogo_csv.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/importar_catalogo_csv.py)    # Ingesta masiva desde planillas CSV con deduplicación
│   └── 📄 [seed_subcategorias.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/seed_subcategorias.py)       # Poblado inicial de subcategorías con iconografía Lucide
├── 📁 [docs/architecture/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/docs/architecture)
│   ├── 📄 [diagrama_base_de_datos.md](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/docs/architecture/diagrama_base_de_datos.md)  # Diagrama ER completo de PostgreSQL
│   └── 📄 [diagram_modalidadFutura_Auto.md](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/docs/architecture/diagram_modalidadFutura_Auto.md) # Extensión polimórfica para vertical automotriz
└── 📁 [app/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app)
    ├── 📄 [main.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/main.py)                             # Entrypoint: Inicialización FastAPI, CORS y registro de rutas
    ├── 📄 [config.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/config.py)                           # Settings Pydantic v2: Carga dinámica de .env y feature flags
    ├── 📄 [database.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/database.py)                         # Motor SQLAlchemy 2.0, Pool de conexiones y generador get_db
    ├── 📄 [security.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/security.py)                         # Hashing Bcrypt y emisión / validación de tokens JWT
    ├── 📁 [router/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router)
    │   ├── 📄 [producto_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py)       # Endpoints: Catálogo agrupado, filtros y admin
    │   ├── 📄 [auth_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/auth_router.py)           # Endpoints: Login OAuth2, login JSON y registro
    │   ├── 📄 [caja_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/caja_router.py)           # Endpoints: Escaneo de cajas y generación de QR
    │   └── 📄 [pedido_route.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/pedido_route.py)          # Endpoints: Procesamiento y estados de pedidos
    ├── 📁 [schemas/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas)
    │   ├── 📄 [producto_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/producto_schema.py)       # DTOs: Catálogo, variantes, colores e imágenes
    │   ├── 📄 [user_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/user_schema.py)           # DTOs: LoginRequest, UserRegister, TokenResponse
    │   ├── 📄 [caja_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/caja_schema.py)           # DTOs: Contenedores físicos y productos en depósito
    │   ├── 📄 [categoria_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/categoria_schema.py)      # DTOs: Categorías del catálogo
    │   └── 📄 [subcategoria_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/subcategoria_schema.py)   # DTOs: Subcategorías e iconografía
    ├── 📁 [repositories/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories)
    │   └── 📄 [product_repo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories/product_repo.py)          # Queries tipadas SQLAlchemy 2.0 (Previene N+1 con joinedload)
    ├── 📁 [models/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models)
    │   ├── 📄 [producto_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/producto_model.py)        # Tabla 'producto': Entidad central del catálogo
    │   ├── 📄 [producto_variante_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/producto_variante_model.py) # Tabla 'producto_variante': SKUs, talles, stock y precios
    │   ├── 📄 [categoria_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/categoria_model.py)       # Tabla 'categoria': Agrupador principal de productos
    │   ├── 📄 [subcategoria_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/subcategoria_model.py)    # Tabla 'subcategoria': Subclasificación con íconos
    │   ├── 📄 [producto_subcategoria_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/producto_subcategoria_model.py) # Tabla pivote N a M: Productos y Subcategorías
    │   ├── 📄 [color_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/color_model.py)           # Tabla 'color': Paleta comercial con códigos HEX
    │   ├── 📄 [imagen_url_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/imagen_url_model.py)      # Tabla 'imagen_url': Enlaces a Cloudflare R2 o disco
    │   ├── 📄 [user_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/user_model.py)            # Tabla 'usuarios': Cuentas, roles y contraseñas hasheadas
    │   ├── 📄 [cliente_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/cliente_model.py)         # Tabla 'clientes': Perfil comercial y estado de cuenta
    │   ├── 📄 [funcionario_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/funcionario_model.py)     # Tabla 'funcionarios': Cargo y matrícula profesional
    │   ├── 📄 [caja_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/caja_model.py)            # Tabla 'cajas': Contenedores de depósito con código QR
    │   ├── 📄 [caja_item_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/caja_item_model.py)       # Tabla 'caja_items': Existencias de SKUs por caja
    │   ├── 📄 [pedido_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/pedido_model.py)          # Tabla 'pedido': Transacción comercial y estados
    │   ├── 📄 [pedido_detalle_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/pedido_detalle_model.py)  # Tabla 'pedido_detalle': Invariante histórica de precio
    │   └── 📄 [pago_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/pago_model.py)            # Tabla 'pagos': Comprobantes y métodos de liquidación
    └── 📁 [services/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/services)
        ├── 📄 [product_service.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/services/product_service.py)       # Casos de uso y reglas de negocio del catálogo
        ├── 📄 [storage_service.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/services/storage_service.py)       # Cliente Boto3 / S3 para Cloudflare R2 y fallback local
        ├── 📄 [whatsapp_service.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/services/whatsapp_service.py)      # Notificaciones y confirmación por mensajería
        └── 📄 [qr_generator.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/services/qr_generator.py)          # Generación en memoria de códigos QR PNG
```

---

## 🏛️ Arquitectura en Capas del Backend

El backend se organiza en capas concéntricas con responsabilidades unívocas. Ningún controlador consulta la base de datos de manera directa; todo el flujo atraviesa validación de esquemas y abstracciones de persistencia.

```mermaid
flowchart TD
    subgraph Clients ["🌐 Clientes Externos"]
        WC["Web Client (React 19)"]
        AP["Admin Portal (Flutter)"]
        SW["Swagger UI / OpenAPI (/docs)"]
    end

    subgraph Entry ["🚀 Punto de Entrada y Configuración"]
        MAIN["📄 main.py<br/>FastAPI Instance + CORS + Routers"]
        CONF["📄 config.py<br/>Pydantic Settings + .env Loader"]
    end

    subgraph Routers ["🛣️ Capa de Routers / Controladores HTTP"]
        R_PROD["📄 producto_router.py<br/>/api/productos"]
        R_AUTH["📄 auth_router.py<br/>/api/auth"]
        R_CAJA["📄 caja_router.py<br/>/cajas"]
    end

    subgraph Schemas ["🛡️ Capa de Esquemas / Validación (Pydantic v2)"]
        S_PROD["📄 producto_schema.py<br/>ProdCatAgrupadaSchema"]
        S_USER["📄 user_schema.py<br/>Login / Register / Token"]
        S_CAJA["📄 caja_schema.py<br/>CajaResponseSchema"]
    end

    subgraph Logic ["⚙️ Capa de Servicios y Persistencia"]
        SERV_ST["📄 storage_service.py<br/>Upload Cloudflare R2"]
        REPO_PROD["📄 product_repo.py<br/>Queries Tipadas SQLAlchemy 2.0"]
        SEC["📄 security.py<br/>Bcrypt + PyJWT Token Engine"]
    end

    subgraph ORM ["🗄️ Capa de Modelos ORM y Base de Datos"]
        MODELS["📁 app/models/*<br/>ProductoModel, UserModel, CajaModel..."]
        DB["📄 database.py<br/>Engine + Pool LIFO + get_db()"]
    end

    subgraph Infrastructure ["🐘 Persistencia y Storage Externo"]
        PG[("🐘 PostgreSQL 15<br/>Base de Datos Aislada")]
        R2[("☁️ Cloudflare R2<br/>Bucket Multimedia Stateless")]
    end

    %% Conexiones
    Clients -->|HTTP REST / JSON| MAIN
    MAIN --- CONF
    MAIN --> R_PROD
    MAIN --> R_AUTH
    MAIN --> R_CAJA

    R_PROD --> S_PROD
    R_AUTH --> S_USER
    R_CAJA --> S_CAJA

    R_PROD --> REPO_PROD
    R_AUTH --> SEC
    R_CAJA --> REPO_PROD
    R_PROD -.-> SERV_ST

    REPO_PROD --> MODELS
    REPO_PROD --> DB
    SEC -.-> DB

    DB -->|SQL Pool Session| PG
    SERV_ST -->|S3 API Boto3| R2

    %% Enlaces interactivos en Mermaid
    click MAIN "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/main.py" "Abrir main.py"
    click CONF "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/config.py" "Abrir config.py"
    click DB "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/database.py" "Abrir database.py"
    click SEC "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/security.py" "Abrir security.py"
    click R_PROD "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py" "Abrir producto_router.py"
    click R_AUTH "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/auth_router.py" "Abrir auth_router.py"
    click REPO_PROD "file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories/product_repo.py" "Abrir product_repo.py"
```

### Tabla de Accesos Directos por Capa

| Capa Arquitectónica | Componente Clave | Enlace Directo al Código |
| :--- | :--- | :--- |
| **Punto de Entrada** | Instancia de FastAPI, middlewares y arranque | [main.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/main.py) |
| **Configuración** | Inyección de variables de entorno y feature flags | [config.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/config.py) |
| **Conexión a BD** | Conexión, pool LIFO de PostgreSQL y `get_db` | [database.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/database.py) |
| **Seguridad** | Cifrado Bcrypt y tokens JWT | [security.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/security.py) |
| **Rutas (Productos)** | Endpoints del catálogo público y de administración | [producto_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py) |
| **Rutas (Auth)** | Endpoints de inicio de sesión y registro | [auth_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/auth_router.py) |
| **Rutas (Cajas)** | Endpoints de lectura de depósitos físicos | [caja_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/caja_router.py) |
| **Repositorio** | Consultas SQLAlchemy 2.0 optimizadas sin N+1 | [product_repo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories/product_repo.py) |
| **Esquemas** | DTOs de validación y serialización de productos | [producto_schema.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/producto_schema.py) |
| **Modelos** | Entidad relacional principal del producto | [producto_model.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/models/producto_model.py) |

---

## 🔄 Diagrama de Secuencia: Ciclo de Vida de una Petición

El siguiente diagrama detalla cómo viaja una solicitud HTTP (por ejemplo, el cliente solicitando los productos agrupados para la vitrina web) a través de cada pieza del sistema:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as 🌐 Cliente Web (React)
    participant Main as 🚀 main.py (FastAPI)
    participant CORS as 🛡️ CORSMiddleware
    participant Router as 🛣️ producto_router.py
    participant DBDep as 💉 database.py (get_db)
    participant Repo as 📦 product_repo.py
    participant PG as 🐘 PostgreSQL 15
    participant Schema as 📋 producto_schema.py

    Cliente->>Main: GET /api/productos/agrupados
    Main->>CORS: Validar cabeceras Origin y Allowed Methods
    CORS-->>Main: Origen permitido
    Main->>Router: Enrutar a listar_agrupados()
    
    Router->>DBDep: Inyectar dependencia Session = Depends(get_db)
    DBDep->>DBDep: Adquirir conexión del pool (SessionLocal)
    DBDep-->>Router: Sesión transaccional activa (db)

    Router->>Repo: get_productos_agrupados(db)
    Note over Repo: Construye query select(CategoriaModel)<br/>con joinedload(imagenes) y selectinload(variantes)
    Repo->>PG: Ejecutar SQL optimizado en 1 o 2 round-trips (Sin N+1)
    PG-->>Repo: Tuplas de categorías, productos, variantes y colores

    Repo-->>Router: Instancias ORM de ProductoModel & CategoriaModel
    Router->>Schema: Serializar a List[ProdCatAgrupadaSchema]
    Note over Schema: Valida tipos, formatea campos,<br/>filtra campos privados
    Schema-->>Router: DTO estructurado en formato JSON limpio

    Router-->>DBDep: Cierre de ciclo de vida del endpoint
    DBDep->>DBDep: finally: db.close() (Regresa conexión física al pool)
    Router-->>Cliente: HTTP 200 OK + Payload JSON con catálogo completo
```

### ¿Qué ocurre en cada paso de la secuencia?

1. **Recepción del Request:** El navegador o la aplicación cliente ejecuta `GET /api/productos/agrupados`.
2. **Filtro de Seguridad CORS:** [main.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/main.py#L29-L38) evalúa si el dominio de origen está autorizado mediante las variables calculadas en [config.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/config.py#L101-L107).
3. **Despacho al Router:** FastAPI localiza el endpoint asociado en [producto_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py#L28-L37).
4. **Inyección de Dependencia de BD (`get_db`):** Antes de ejecutar la lógica, FastAPI solicita una sesión a [database.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/database.py#L60-L70). La sesión se toma de un pool en memoria gestionado con estrategia LIFO (*Last In, First Out*).
5. **Delegación al Repositorio:** El router delega la consulta a [product_repo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories/product_repo.py#L25-L50).
6. **Resolución Antipatrón N+1:** El repositorio formula una sentencia `select()` de **SQLAlchemy 2.0** aplicando `joinedload` para imágenes y `selectinload` para variantes activas. Esto recupera todo el árbol relacional en un número mínimo y constante de consultas SQL.
7. **Filtrado de Reglas de Negocio:** La base de datos descarta productos inactivos (`prod_activo = false`), no visibles (`prod_visible = false`) o que carezcan de stock y variantes disponibles.
8. **Transformación DTO (Pydantic v2):** El resultado ORM es procesado por [ProdCatAgrupadaSchema](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/schemas/producto_schema.py#L110-L134), garantizando que las respuestas cumplan estrictamente el contrato tipado.
9. **Retorno de Conexión:** El bloque `finally` de `get_db()` ejecuta `db.close()`, asegurando que la conexión física regrese al pool sin fugas de memoria.
10. **Emisión de Respuesta:** FastAPI serializa el resultado a JSON y responde `HTTP 200 OK` al cliente.

---

## 🧩 Explicación Detallada de los Componentes Core

Para que cualquier desarrollador entienda exactamente qué rol cumple cada archivo en el backend:

### 1. `app/main.py` — El Orquestador del Proyecto
- **¿Qué es?** Es el entrypoint de FastAPI.
- **¿Qué funciones cumple?**
  1. Instancia `app = FastAPI(...)` con metadatos del proyecto.
  2. Ejecuta `Base.metadata.create_all(bind=engine)` para inicializar las tablas en la base de datos si aún no existían.
  3. Registra el middleware `CORSMiddleware`, configurando qué orígenes web tienen permiso de consultar la API.
  4. Monta el directorio local `/static` para servir imágenes en caso de pruebas locales sin Cloudflare.
  5. Incluye los enrutadores principales: `/api/productos` vía [producto_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py) y `/api/auth` vía [auth_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/auth_router.py).
  6. Expone el endpoint de comprobación de salud en la raíz `GET /` (*Health Check*).

### 2. `app/config.py` — Configuración Dinámica y Multi-Tenant
- **¿Qué es?** El cerebro de configuración del backend basado en `pydantic-settings`.
- **¿Por qué existe?** Permite que una misma base de código corra indistintamente para cualquier comercio sin tocar código Python.
- **¿Cómo opera?**
  1. Lee la variable de entorno `ENV_FILE`. Si vale `.env.veterinaria`, carga ese archivo; si vale `.env.flordeloto`, conmuta a la tienda de ropa de forma inmediata.
  2. Ensambla la propiedad `DATABASE_URL` con formato `postgresql://user:pass@host:port/dbname`.
  3. Resuelve `CORS_ORIGINS`: en modo desarrollo permite `["*"]`; en producción parsea la lista blanca de dominios desde `ALLOWED_ORIGINS`.
  4. Determina `RESOLVED_BASE_URL` detectando la IP privada local del host en WiFi/Ethernet para que los celulares en la misma red puedan resolver URLs de prueba.
  5. Contiene las claves para Cloudflare R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_BUCKET_NAME`) y seguridad JWT.

### 3. `app/database.py` — Conexión y Pool de PostgreSQL
- **¿Qué es?** La capa de conexión relacional basada en SQLAlchemy 2.0.
- **¿Qué optimizaciones incluye?**
  1. `pool_pre_ping=True`: Realiza un ping silencioso antes de entregar una conexión al endpoint. Si la conexión murió por inactividad, la restablece transparentemente sin provocar errores `500 Internal Server Error`.
  2. `pool_size=10` y `max_overflow=20`: Mantiene 10 conexiones persistentes en memoria y permite escalar hasta 30 conexiones ante ráfagas de usuarios.
  3. `pool_use_lifo=True`: Reutiliza siempre la conexión utilizada más recientemente, manteniendo caliente la memoria caché de PostgreSQL.
  4. Inyección `get_db()`: Un generador que entrega `Session` al router y garantiza `db.close()` en el bloque `finally` para evitar agotamiento de descriptores de sockets.

### 4. `app/security.py` — Criptografía y Control de Acceso
- **¿Qué es?** El motor de seguridad del backend.
- **¿Qué funciones cumple?**
  1. `get_password_hash(password)`: Hashea las contraseñas usando el algoritmo **Bcrypt** con salt criptográfico automático antes de persistirlas en la columna `usu_password_hash`.
  2. `verify_password(plain, hashed)`: Comprueba si la contraseña ingresada en el login coincide con el hash almacenado en base de datos.
  3. `create_access_token(data, expires_delta)`: Ensambla y firma digitalmente un token **JWT (JSON Web Token)** con algoritmo `HS256`, fecha de emisión (`iat`) y fecha de caducidad (`exp`).
  4. `decode_access_token(token)`: Verifica la firma y vigencia del token para proteger rutas restringidas.

### 5. `app/router/` — Controladores y Endpoints REST
- **¿Qué hacen?** Son los puntos de contacto HTTP públicos y privados. Reciben la petición, parsean parámetros y devuelven respuestas JSON.
  - 📄 [producto_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/producto_router.py):
    - `GET /api/productos/agrupados`: Retorna las categorías activas con sus productos, imágenes y variantes agrupadas para renderizar la Landing Page.
    - `GET /api/productos/`: Buscador público que admite filtros combinados por categoría (`?cat_id=X`) o texto libre (`?search=shampoo`).
    - `GET /api/productos/admin/todos`: Endpoint administrativo para listar todo el catálogo sin filtros de visibilidad.
  - 📄 [auth_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/auth_router.py):
    - `POST /api/auth/token`: Autenticación OAuth2 estándar (compatible con Swagger UI y terminales). Acepta tanto Email como WhatsApp en el campo `username`.
    - `POST /api/auth/login`: Autenticación JSON para aplicaciones web y Flutter.
    - `POST /api/auth/register-cliente`: Registro rápido de nuevos clientes en el checkout de pedidos.
  - 📄 [caja_router.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/router/caja_router.py):
    - `GET /cajas/{codigo}`: Retorna los productos y variantes físicas que contiene una caja de depósito tras escanear su código de barras o QR.
    - `GET /cajas/{codigo}/qr`: Genera y emite al vuelo la imagen PNG del código QR para imprimir y pegar en las cajas de depósito.

### 6. `app/schemas/` — Contratos de Entrada y Salida (DTOs)
- **¿Qué hacen?** Modelos construidos con **Pydantic v2** que actúan como aduana de datos:
  - Validan que los datos enviados por el usuario sean del tipo correcto (números, correos válidos, longitudes mínimas).
  - Ocultan campos internos de la base de datos (por ejemplo, nunca devuelven contraseñas hasheadas ni metadatos sensibles).
  - Convierten automáticamente objetos ORM complejos a JSON gracias a `ConfigDict(from_attributes=True)`.

### 7. `app/repositories/` — Consultas de Persistencia
- **¿Qué hacen?** Aíslan el código SQL/ORM del resto de la aplicación.
  - [product_repo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/app/repositories/product_repo.py): Implementa consultas con `select()`, filtros de disponibilidad comercial (`prod_activo`, `prod_visible`, stock disponible) y carga impaciente (*eager loading*) para evitar el problema de N+1 queries.

### 8. `app/models/` — Entidades ORM (Tablas PostgreSQL)
- **¿Qué hacen?** Clases Python declarativas que definen la estructura exacta de cada tabla relacional en PostgreSQL (`producto`, `producto_variante`, `categoria`, `subcategoria`, `color`, `imagen_url`, `usuarios`, `cajas`, `pedidos`, etc.).

---

## 🌐 Infraestructura y Orquestación Multi-Tenant

> 💡 **Nota de Arquitectura:** La documentación completa sobre Docker Compose, la red `northcode-net`, los túneles de Cloudflare y los procedimientos estandarizados de alta de clientes se encuentra en el directorio raíz de infraestructura:
> 
> 👉 **[Centro de Documentación de Infraestructura: infrastructure/README.md](file:///home/ary/Documentos/proyect/app/vet-core/infrastructure/README.md)**
> 👉 **[Diagrama de Topología de Red: infrastructure/diagrama_arquitectura.md](file:///home/ary/Documentos/proyect/app/vet-core/infrastructure/diagrama_arquitectura.md)**

### Resumen de Aislamiento por Tenant
- **Código Agnóstico:** Un solo artefacto de software Docker sirve a todos los clientes.
- **Contenedores Independientes:** Cada cliente corre en su propio contenedor FastAPI ([api-backend/docker-compose.yml](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/docker-compose.yml)).
- **Bases de Datos Aisladas:** Cada cliente posee una base de datos propia en el clúster PostgreSQL (`vet_beltramelli_db`, `flor_de_loto_db`).
- **Almacenamiento Stateless en R2:** Los archivos multimedia se almacenan en buckets de Cloudflare R2 sin costo de egreso y con replicación geográfica.

---

## 🧪 Auditoría y Pruebas Rápidas con `curl`

Puedes probar y auditar tu backend directamente desde la terminal con estos comandos:

### 1. Catálogo Agrupado (Landing Page)
```bash
curl -s http://localhost:8001/api/productos/agrupados | python3 -m json.tool
```
*(Para inspeccionar únicamente el primer producto sin saturar la terminal):*
```bash
curl -s http://localhost:8001/api/productos/agrupados | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data[0]['productos'][0], indent=2))"
```

### 2. Buscador y Filtro de Catálogo
```bash
# Búsqueda por palabra clave:
curl -s "http://localhost:8001/api/productos/?search=shampoo" | python3 -m json.tool

# Filtrar por ID de categoría (ej: categoría 1):
curl -s "http://localhost:8001/api/productos/?cat_id=1" | python3 -m json.tool
```

### 3. Login y Generación de Token JWT
```bash
curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@beltramelli.com", "password": "tu_password_aqui"}' | python3 -m json.tool
```

### 4. Auditoría de Tiempos de Respuesta y Código HTTP
```bash
curl -o /dev/null -s -w "HTTP Code: %{http_code} | Tiempo Total: %{time_total}s\n" http://localhost:8001/api/productos/agrupados
```
*Salida esperada:*
```text
HTTP Code: 200 | Tiempo Total: 0.038142s
```

---

## 💻 Entorno de Desarrollo Local

### 1. Requisitos
- Python 3.12+
- Docker y Docker Compose V2 activos
- Motor PostgreSQL 15 corriendo en puerto 5432

### 2. Instalación de Dependencias
```bash
cd api-backend
python3 -m venv venv
source venv/bin/activate  # En Windows: .\venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Ejecución por Tenant con `run_desarollo.py`
El CLI [run_desarollo.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/run_desarollo.py) verifica la base de datos, crea tablas y columnas faltantes de forma no destructiva, y lanza Uvicorn con recarga en vivo:

```bash
# Terminal 1: Backend Veterinaria Beltramelli (Puerto 8001)
python run_desarollo.py veterinaria

# Terminal 2: Backend Tienda de Ropa Flor de Loto (Puerto 8002)
python run_desarollo.py flordeloto
```

---

## 🛠️ Scripts Utilitarios y Mantenimiento

Ubicados en el directorio [scripts/](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts):

- 📄 [crear_admin.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/crear_admin.py):
  Crea o actualiza el usuario administrador en la base de datos del tenant configurado en `.env`:
  ```bash
  python scripts/crear_admin.py
  ```

- 📄 [crear_caja.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/crear_caja.py):
  Genera una caja física de depósito, asocia productos y variantes, y exporta la imagen del código QR a disco:
  ```bash
  python scripts/crear_caja.py
  ```

- 📄 [importar_catalogo_csv.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/importar_catalogo_csv.py):
  Ingesta masiva de productos desde archivos CSV con normalización de variantes, talles y colores.
  ```bash
  python scripts/importar_catalogo_csv.py app/static/productos.csv
  ```

- 📄 [seed_subcategorias.py](file:///home/ary/Documentos/proyect/app/vet-core/api-backend/scripts/seed_subcategorias.py):
  Puebla las subcategorías iniciales vinculadas con nombres de íconos compatibles con la librería Lucide del frontend.
  ```bash
  python scripts/seed_subcategorias.py
  ```

---

## 📚 Enlaces de Referencia Técnica

* 🚀 [FastAPI Framework Documentation](https://fastapi.tiangolo.com/)
* 🗄️ [SQLAlchemy 2.0 Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
* 🛡️ [Pydantic v2 Documentation](https://docs.pydantic.dev/latest/)
* ☁️ [Cloudflare R2 S3 API Reference](https://developers.cloudflare.com/r2/api/s3/api/)
* 🐘 [PostgreSQL 15 Documentation](https://www.postgresql.org/docs/15/)
* 🌐 [Documentación de Infraestructura del Proyecto](file:///home/ary/Documentos/proyect/app/vet-core/infrastructure/README.md)
