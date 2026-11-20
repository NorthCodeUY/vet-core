<!-- apps/admin-portal/README.md -->


# 🏢 VetCore Admin Portal (`apps/admin-portal`)

Suite administrativa multiplataforma (**Web, Desktop y Mobile**) para la plataforma SaaS **VetCore**. Desarrollada con **Flutter (Dart 3)** bajo los principios de **Clean Architecture**, modularización **Feature-First** y **Aislamiento Multi-Tenant en Silos (Zero Hardcoding)**.

Permite a los administradores de cada comercio gestionar su vitrina digital, catálogo de productos, control de stock y parametrización operativa en tiempo real contra su propio contenedor backend de FastAPI.

---

## 🏛️ Arquitectura del Sistema

```text
               ┌─────────────────────────────────────────────────────┐
               │              CLIENT CONFIG / ASSETS                 │
               │   ../../clients/<tenant>/config_admin.json + logo   │
               └──────────────────────────┬──────────────────────────┘
                                          │ (Inyección en caliente)
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             FLUTTER ADMIN PORTAL                                 │
│                                                                                  │
│   [ TenantConfig ] ───▶ Hidrata ThemeData (Material 3) + Modulos Operativos     │
│   [ AuthService  ] ───▶ Inyecta JWT en SecureStorage                             │
│   [ Screen / Handler ] ─ Separación estricta de UI pura y Controladores          │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │ HTTP REST (/api)
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             FASTAPI BACKEND SILO                                 │
│   Puerto 8000 (Valeria) | Puerto 8001 (Flor de Loto) | PostgreSQL Aislada        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Principios Arquitectónicos Clave:
1. **Zero Hardcoding (100% Agnóstico):**
   - Prohibido quemar nombres comerciales, URLs base o códigos de color hexadecimales en los widgets.
   - Toda la identidad corporativa se resuelve en tiempo de ejecución a través del árbol de contexto (`Theme.of(context).colorScheme`).
2. **Single Source of Truth (`clients/`):**
   - La identidad visual y módulos activos se leen desde la raíz del monorepo (`clients/<tenant>/config_admin.json`).
3. **Resolución de Red Desacoplada:**
   - La app no asume un host fijo. En desarrollo consume la variable `--dart-define=API_URL`. En producción Web bajo Docker, delega el tráfico relativo a NGINX Reverse Proxy.
4. **Patrón Screen + Handler:**
   - `*_screen.dart`: Widgets de presentación puros y declarativos sin llamadas directas a la API.
   - `*_handler.dart`: Controladores con gestión de estado mutable, validaciones de formulario y ciclo de vida.

---



1. El Flujo Arquitectónico de Conexión
No queremos que las pantallas (_screen.dart o _handler.dart) hagan llamadas HTTP directas con URLs o cabeceras quemadas. La arquitectura se divide en 4 capas estrictas:
Text
┌─────────────────────────┐
│     PANTALLA / UI       │  CatalogScreen / CatalogHandler
└────────────┬────────────┘
             │ Solicita datos del negocio (ej: `getProducts()`)
             ▼
┌─────────────────────────┐
│       REPOSITORY        │  ProductRepository (Contrato / Caso de Uso)
│  (Transforma JSON <->   │  - Convierte Map<String, dynamic> a List<Product>
│       Modelos)          │  - Maneja errores de dominio
└────────────┬────────────┘
             │ Envía petición genérica HTTP
             ▼
┌─────────────────────────┐
│       API CLIENT        │  ApiClient (Instancia centralizada de Dio)
│  (Configuración de Red) │  - BaseUrl dinámica (puerto 8001 / producción)
│                         │  - Timeouts de red (10s)
└────────────┬────────────┘
             │ Intercepta automáticamente
             ▼
┌─────────────────────────┐
│     AUTH INTERCEPTOR    │  AuthInterceptor
│   (Seguridad / Tokens)  │  - Lee JWT de FlutterSecureStorage
│                         │  - Agrega 'Authorization: Bearer <token>'
│                         │  - Captura 401 (token expirado) y desloguea
└────────────┬────────────┘
             │ Red Externa
             ▼
      FASTAPI BACKEND
2. Estructura de Directorios Refactorizada para la Capa de Datos
En tu proyecto, transformamos la carpeta genérica services/ en una arquitectura formal de Red (network) y Repositorios (repositories):
Text







## 📂 Estructura de Directorios del Portal


apps/admin-portal/
├── assets/
│   └── tenant/                              # 🎨 Inyección en caliente del comercio activo
│       ├── config.json                      # Copia/Enlace de config_admin.json (Tema y Flags)
│       └── logo.png                         # Isotipo oficial de la marca
│
├── lib/
│   ├── config/                              # ⚙️ Entorno y configuración runtime
│   │   ├── app_colors.dart                  # Tokens de diseño semánticos y fallbacks
│   │   ├── app_environment.dart             # Captura de variables (--dart-define API_URL)
│   │   ├── app_theme.dart                   # Generador dinámico de ThemeData (Material 3)
│   │   └── tenant_config.dart               # Parser tipado de config_admin.json
│   │
│   ├── network/                             # 🌐 Infraestructura HTTP (FastAPI)
│   │   ├── api_client.dart                  # Cliente Dio centralizado con timeouts y headers
│   │   ├── api_endpoints.dart               # Catálogo de rutas (/api/auth/token, /api/productos/admin_todos)
│   │   └── interceptors/
│   │       └── auth_interceptor.dart        # Inyector automático de Bearer Token & Captura de 401
│   │
│   ├── models/                              # 📦 Entidades de datos puras (Pydantic <-> Dart)
│   │   ├── auth_models.dart                 # Credenciales y sesión JWT
│   │   └── product/                         # 🏷️ Submódulo de catálogo (Principio SRP)
│   │       ├── category_model.dart          # Modelo de Categoría (categoria_model.py)
│   │       ├── color_model.dart             # Modelo de Color para variantes (color_model.py)
│   │       ├── product.dart                 # Archivo barrel de exportación unificada
│   │       ├── product_image_model.dart     # Galería multimedia de imágenes (imagen_url_model.py)
│   │       ├── product_model.dart           # Entidad maestra consolidada (producto_model.py)
│   │       ├── product_variant_model.dart   # SKUs, talles/pesos, stock y precios
│   │       └── subcategory_model.dart       # Modelo de Subcategoría (subcategoria_model.py)
│   │
│   ├── repositories/                        # 🗄️ Capa de Datos y Casos de Uso (Patrón Repository)
│   │   ├── auth_repository.dart             # Login OAuth2, logout y persistencia segura de sesión
│   │   └── product_repository.dart          # Consumo de /api/productos/admin_todos, toggle y stock
│   │
│   ├── screens/                             # 🖥️ Vistas y Controladores (Patrón Screen + Handler)
│   │   ├── catalog_handler.dart             # Controlador del catálogo (llamadas a FastAPI y filtros)
│   │   ├── catalog_screen.dart              # Vista declarativa del catálogo
│   │   ├── dashboard_handler.dart           # Controlador de pestañas (Inventario, Alta, Cajas)
│   │   ├── dashboard_screen.dart            # Layout contenedor (TopBar + Workspace + BottomBar)
│   │   ├── login_handler.dart               # Controlador de login y validación de formulario
│   │   ├── login_screen.dart                # UI pura del formulario de autenticación
│   │   └── product_form/                    # 📝 Módulo de Alta y Edición de Producto
│   │       ├── product_form_handler.dart    # Estado del formulario, cálculo de margen y subida
│   │       ├── product_form_screen.dart     # Formulario maestro (ensambla las 6 secciones)
│   │       └── widgets/                     # 🧩 Subcomponentes atómicos del formulario
│   │           ├── basic_info_section.dart  # Sección 1: Nombre, categoría, tags y EAN
│   │           ├── form_section_card.dart   # Contenedor estilizado reutilizable con icono
│   │           ├── gallery_picker_section.dart # Sección 2: Portada y selector de fotos
│   │           ├── inventory_stock_section.dart # Sección 4: Stock actual y punto de pedido
│   │           ├── pricing_finance_section.dart # Sección 3: Precio PVP, costo y margen reactivo
│   │           ├── showcase_switches_section.dart # Sección 5: Switches booleanos de vitrina
│   │           └── variants_editor_section.dart # Sección 6: Editor de SKUs y variantes físicas
│   │
│   ├── services/                            # 🛠️ Servicios auxiliares
│   │   └── auth_service.dart                # Servicio auxiliar de autenticación
│   │
│   ├── widgets/                             # 🧩 Componentes visuales transversales
│   │   ├── dashboard_bottom_bar.dart        # Barra inferior fija de navegación táctil
│   │   ├── dashboard_top_bar.dart           # Barra superior con logo, título y menú de perfil
│   │   ├── metrics_header.dart              # Resumen superior (Total, Vitrina, Críticos, Pausados)
│   │   ├── product_card_item.dart           # Tarjeta de producto con carrusel, badges y acciones
│   │   └── search_and_filters.dart          # Buscador en tiempo real y chips de segmentación
│   │
│   └── main.dart                            # 🚀 Bootstrap: Carga config del tenant y monta la app
│
├── run_admin.sh                             # 📜 Orquestador CLI para desarrollo rápido
├── pubspec.yaml                             # Dependencias del proyecto
└── README.md                                # Documentación técnica centralizada



actuaizar ariba 






---

## 🔑 Credenciales de Acceso en Entorno Local

Datos preconfigurados en la base de datos PostgreSQL del silo veterinario:

| Parámetro | Valor de Desarrollo |
| :--- | :--- |
| **Usuario / Correo** | `admin@beltramelli.com` |
| **Contraseña** | `654321` |
| **Host FastAPI Local** | `http://localhost:8001` |
| **Endpoint Token** | `POST /api/auth/token` |

---

## 🚀 Guía de Ejecución Local Paso a Paso

### 1. Levantar el Backend FastAPI del Tenant
Ubícate en `api-backend/` y levanta el entorno de desarrollo:

```bash
cd api-backend
python run_desarrollo.py veterinaria
```
> El servicio responderá en `http://localhost:8001` con documentación Swagger en `/docs`.

### 2. Sincronizar Assets del Tenant en el Portal
Desde `apps/admin-portal/`, vincula la configuración del cliente:

```bash
cd apps/admin-portal
mkdir -p assets/tenant

# Copiar configuración administrativa
cp ../../clients/veterinariabeltrameli/config_admin.json assets/tenant/config.json

# Copiar imagotipo
cp ../../clients/veterinariabeltrameli/assets/logo.png assets/tenant/logo.png
```

### 3. Ejecutar Flutter apuntando al Silo Activo
Lanza la aplicación web inyectando la URL del backend mediante `--dart-define`:

```bash
flutter run -d chrome --dart-define=API_URL="http://localhost:8001"
```

Para compilar en **Linux Desktop**:
```bash
flutter run -d linux --dart-define=API_URL="http://localhost:8001"
```

---

## 🧪 Pruebas y Análisis de Calidad de Código

Para verificar que no existan advertencias de tipado, dependencias no resueltas o imports rotos:

```bash
flutter analyze
```

Para ejecutar los tests de humo y renderizado inicial:
```bash
flutter test
```

