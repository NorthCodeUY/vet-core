## <!> Estructur de baken sugerido de proeycto comparando miproyecot contaduria barion 4 mayo

``` text
api-backend/
├── app/
│   ├── main.py                 # Punto de entrada (FastAPI)
│   ├── config.py               # Variables de entorno y constantes
│   ├── database.py             # Configuración de SQLAlchemy / Engine
│   ├── dependencies.py         # Inyección de dependencias (get_db, get_current_user)
│   ├── security.py             # Lógica de JWT y hashing
│   │
│   ├── models/                 # Modelos de base de datos (SQLAlchemy)
│   │   ├── business.py         # Para que sea multi-negocio (ID de la vete, ID de otros)
│   │   ├── user.py             # Administradores (Vendedores/Veterinarios)
│   │   ├── customer.py         # Clientes (Vinculados por WhatsApp ID)
│   │   ├── product.py          # Catálogo (Raciones, Accesorios, etc.)
│   │   ├── order.py            # Cabecera de pedido (Estados: Pendiente, Pago, etc.)
│   │   ├── order_item.py       # Detalle de productos en cada pedido
│   │   └── voucher.py          # Datos para el QR y etiquetas logísticas
│   │
│   ├── schemas/                # Validación de datos (Pydantic)
│   │   ├── auth.py             # Login y Tokens
│   │   ├── product.py          # Esquemas para CRUD de productos
│   │   ├── order.py            # Lógica de validación bilateral
│   │   ├── customer.py         # Registro vía WhatsApp
│   │   └── voucher.py          # Datos para impresión de etiquetas
│   │
│   ├── router/                 # Endpoints de la API
│   │   ├── v1/
│   │   │   ├── auth.py         # Autenticación JWT (Seamless via WhatsApp)
│   │   │   ├── store.py        # Catálogo público para el cliente
│   │   │   ├── inventory.py    # CRUD administrativo de productos
│   │   │   ├── orders.py       # Motor de gestión de pedidos y estados
│   │   │   ├── logistics.py    # Generación de Vouchers y escaneo QR
│   │   │   └── whatsapp.py     # Webhooks y notificaciones automáticas
│   │
│   ├── repositories/           # Capa de acceso a datos (Clean Architecture)
│   │   ├── product_repo.py
│   │   ├── order_repo.py
│   │   ├── customer_repo.py
│   │   └── voucher_repo.py
│   │
│   └── services/               # Lógica de negocio compleja
│       ├── whatsapp_bridge.py  # Conexión con la API de WhatsApp
│       ├── token_service.py    # Generación de links únicos para clientes
│       ├── order_manager.py    # Máquina de estados (Pendiente -> Pago -> Entrega)
│       └── qr_generator.py     # Generación de códigos QR para etiquetas
│
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```