# admin_portal

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.


Estructura actual de proyhecto antes de comensar 


# Estrucutra actual
```text

.
├── assets
│   ├── Logo Barone.png
│   ├── logo (Copiar).png
│   └── logo.png
├── core
│   └── theme
│       ├── app_colors.dart
│       ├── app_styles.dart
│       ├── app_text_styles.dart
│       └── app_theme.dart
├── main.dart
├── models
│   ├── cliente.dart
│   ├── depositos.dart
│   └── user.dart
├── screens
│   ├── add_clients
│   │   ├── add_clients.dart
│   │   └── add_clients_handler.dart
│   ├── clients
│   │   ├── clients_handler.dart
│   │   └── clients_screen.dart
│   ├── deposits
│   │   ├── deposits_handler.dart
│   │   └── deposits_screen.dart
│   ├── login
│   │   ├── login_form.dart
│   │   ├── login_handler.dart
│   │   └── login_styles.dart
│   ├── main_website
│   │   ├── main_content.dart
│   │   ├── main_handler.dart
│   │   ├── main_styles.dart
│   │   └── notification_modal.dart
│   ├── password_reset
│   │   ├── password_reset_form.dart
│   │   ├── password_reset_handler.dart
│   │   └── password_reset_styles.dart
│   └── payments
│       ├── payments_handler.dart
│       └── payments_screen.dart
└── services
    └── api_service.dart

```







# Estructura sujerida por la ia IA

```text

apps/admin-portal/lib/
├── core/                                 # Transversal a toda la app
│   ├── config/                           # Inyección en Runtime (Zero Hardcoding)
│   │   ├── admin_config.dart             # Modelo fuertemente tipado de admin_config.json
│   │   └── app_environment.dart          # Variables inyectadas (--dart-define API_URL)
│   ├── network/                          # Capa HTTP desacoplada
│   │   ├── api_client.dart               # Cliente Dio configurado con Interceptor JWT
│   │   └── api_endpoints.dart            # Constantes de rutas FastAPI (/api/v1/...)
│   ├── storage/                          # Persistencia segura de credenciales
│   │   └── secure_storage_service.dart   # Encapsula flutter_secure_storage para tokens
│   └── theme/                            # Motor dinámico de estilos
│       └── dynamic_theme.dart            # Convierte admin_config.json -> Material 3 ThemeData
│
├── features/                             # Módulos de negocio aislados
│   │
│   ├── auth/                             # 🔐 FASE 1: Autenticación
│   │   ├── data/
│   │   │   └── auth_repository.dart      # Consume /api/auth/token con Dio
│   │   ├── domain/
│   │   │   └── auth_state.dart           # Modelos de sesión y usuario autenticado
│   │   └── presentation/
│   │       ├── login_screen.dart         # UI pura del formulario de login
│   │       └── login_handler.dart        # Controlador de estado de login (Loading, Error, Success)
│   │
│   ├── shell/                            # 🎛️ FASE 2: Layout Principal (Sidebar Dinámico)
│   │   └── presentation/
│   │       ├── dashboard_screen.dart     # Layout responsivo (TopBar + Sidebar + Body)
│   │       ├── dashboard_handler.dart    # Controla la navegación interna entre pestañas
│   │       └── widgets/
│   │           └── dynamic_sidebar.dart  # Renderiza ítems según admin_modules (has_*)
│   │
│   └── catalog/                          # 📦 FASE 3: Vitrina / Productos (Alta, Baja, Modificación)
│       ├── data/
│       │   └── product_repository.dart   # GET /api/productos, POST, PUT, DELETE, Upload de foto
│       ├── domain/
│       │   └── product_model.dart        # Entidad de producto agnóstica
│       └── presentation/
│           ├── catalog_list_screen.dart  # Grilla/Tabla de productos activos con toggle visible
│           ├── catalog_list_handler.dart # Paginación, búsqueda y cambio de visibilidad
│           ├── product_form_screen.dart  # Formulario alta/edición adaptado al business_type
│           ├── product_form_handler.dart # Manejo de validaciones y subida multipart
│           └── widgets/
│               ├── image_picker_box.dart # Selector de imágenes (Web drag & drop y Mobile)
│               └── schemas/              # Subformularios condicionales
│                   ├── standard_fields.dart
│                   ├── clothing_fields.dart   # Talles / Colores
│                   └── automotive_fields.dart # Kilómetros / Año / Transmisión
│
└── main.dart     # Bootstrap: Carga config, verifica JWT y monta la app

```

