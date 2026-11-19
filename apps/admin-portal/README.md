# 🏢 VetCore Admin Portal

Portal administrativo multiplataforma (Web, Desktop y Mobile) para la suite SaaS **VetCore**. Construido con Flutter (Dart 3) bajo principios de **Clean Architecture**, enfoque **Feature-First** y **Aislamiento Multi-Tenant (Zero Hardcoding)**.

---

## 🏛️ Arquitectura del Sistema

1. **Aislamiento Multi-Tenant (Runtime Injection):**
   - La identidad visual, paleta de colores y logotipos se inyectan en tiempo de ejecución desde `assets/tenant/admin_config.json`.
   - Cero cadenas de texto comerciales ni colores hexadecimales quemados en código fuente Dart.

2. **Resolución de Backend Agnóstica:**
   - En desarrollo, el target de FastAPI se inyecta mediante variables de entorno de compilación:
     `--dart-define=API_URL=http://localhost:8000`
   - En producción Web/Docker, opera acoplado a NGINX bajo el proxy inverso estándar `/api`.

3. **Separación de Responsabilidades (Screen + Handler):**
   - `*_screen.dart`: Widgets de presentación puros, reactivos a estados de UI.
   - `*_handler.dart`: Controladores de estado que gestionan llamadas HTTP, validaciones y ciclo de vida.

---


## 🚀 Entorno de Desarrollo Local

### Pre-requisitos
- Flutter SDK 3.44.x o superior.
- Backend FastAPI del tenant levantado en su puerto correspondiente (ej. 8000 para Valeria).

### Ejecución con Orquestador
Utiliza el script orquestador para enlazar los assets del cliente e inicializar Flutter:

```bash
# Ejecución para tenant Valeria en Web
./run_admin.sh valeria chrome

# Ejecución para tenant Flor de Loto en Linux Desktop
./run_admin.sh flordeloto linux
```

## 📦 Mapa de Módulos (Feature Flags)
El portal activa o desactiva pantallas dinámicamente según las banderas - provistas en admin_config.json:
- has_products_catalog: Habilita la gestión de inventario y vitrina.
- has_appointments_agenda: Habilita el calendario de turnos.
- has_medical_records: Activa fichas clínicas (exclusivo veterinarias).
- has_orders_monitoring: Panel de compras en tiempo real.
Code
---

### Siguiente paso inmediato
Ejecuta la limpieza del **Paso 1** en tu terminal y confírmame que la estructura de carpetas quedó lista. A partir de ahí, colocamos el `main.dart` mínimo para levantar la pantalla de login sin errores.








lib/features/catalog/presentation/
├── catalog_screen.dart             # Orquestador principal (ensambla las piezas)
├── catalog_handler.dart            # Estado: carga de productos, filtros y toggles
└── widgets/
    ├── metrics_header.dart         # Tarjetas de resumen (Total, Vitrina, Críticos, Ocultos)
    ├── search_and_filters.dart     # Barra de búsqueda y pills de filtro
    ├── product_card_item.dart      # Tarjeta individual de producto con switch de vitrina
    └── quick_actions_footer.dart   # Barra de acciones rápidas (Ajuste de precio, CSV)




admin@beltramelli.com
654321







```text 

lib/
├── core/                                   # Capa transversal desacoplada
│   ├── config/
│   │   ├── admin_config.dart               # Parser tipado de admin_config.json
│   │   └── app_environment.dart            # Inyección de URL de FastAPI (--dart-define)
│   ├── network/
│   │   ├── api_client.dart                 # Cliente Dio con interceptor de JWT
│   │   └── api_endpoints.dart              # URLs (/api/auth/token, /api/productos)
│   ├── storage/
│   │   └── secure_storage_service.dart     # Persistencia cifrada de credenciales
│   └── theme/
│       └── dynamic_theme.dart              # Mapeo de tokens de diseño a Material 3
│
├── screm/                               # Módulos de negocio (Feature-First)
│   ├── auth/                               # Módulo 1: Autenticación
│   │   ├── data/
│   │   │   └── auth_repository.dart        # Llamadas a /api/auth con Dio
│   │   ├── domain/
│   │   │   └── auth_models.dart            # LoginCredentials, AuthSession
│   │   └── presentation/
│   │       ├── login_handler.dart          # Lógica, estado y validación
│   │       └── login_screen.dart           # UI pura agnóstica al tenant
│   │
│   ├── shell/                              # Módulo 2: Contenedor Administrativo
│   │   └── presentation/
│   │       ├── dashboard_handler.dart      # Control de navegación y tabs
│   │       ├── dashboard_screen.dart       # Layout (TopBar + Workspace)
│   │       └── widgets/
│   │           └── dynamic_sidebar.dart    # Menú condicionado por feature flags
│   │
│   └── catalog/                            # Módulo 3: Vitrina de Productos (ABM)
│       ├── data/
│       │   └── product_repository.dart     # CRUD y subida de imágenes a FastAPI
│       ├── domain/
│       │   └── product_model.dart          # Modelo de Producto
│       └── presentation/
│           ├── catalog_handler.dart        # Paginación, filtros y bajas
│           ├── catalog_screen.dart         # Grilla/Tabla administrativa
│           ├── product_form_handler.dart   # Lógica del formulario
│           └── product_form_screen.dart    # Vista de alta/edición de producto
│
└── main.dart                               # Bootstrap: Inyección de config y arranque
``` 