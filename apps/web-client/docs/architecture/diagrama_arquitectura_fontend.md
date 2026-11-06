<!-- apps/web-client/docs/architecture/diagrama_arquitectura_fontend.md -->

# 🏛️ Diagrama de Arquitectura Global del Frontend (VetCore SaaS)

[⬅️ Volver al README Principal del Web Client](../../README.md) | [📖 Sub-Doc: Landing Page](../../src/pages/landing/README.md) | [🛒 Sub-Doc: Pedidos](../../src/pages/pedido/README.md) | [📑 Overview de Arquitectura](overview.md) | [🔄 Diagrama de Secuencia](diagrama_secuencia_fronten.md)

---

## 📌 Visión de Capas del Sistema (Zero-Rebuild SaaS)

El siguiente diagrama detalla el flujo de datos unidireccional y la separación de responsabilidades entre la **Capa de Configuración en Runtime**, la **Capa de Infraestructura y Mappers**, la **Capa de Estado y Fachadas (Hooks)** y la **Capa de Presentación UI**:

```mermaid
graph TD
    %% =========================================================================
    %% FUENTE DE CONFIGURACIÓN RUNTIME (Zero-Rebuild)
    %% =========================================================================
    subgraph ConfigLayer ["⚙️ 1. Capa de Configuración Runtime (Zero-Rebuild)"]
        JSON["📄 Runtime Config: client_info.json"]
        ContextTenant["🏢 TenantContext (useConfig)"]
        ThemeEngine["🎨 Theme Config (Hex -> RGB :root)"]
    end

    %% =========================================================================
    %% CAPA DE INFRAESTRUCTURA & COMUNICACIÓN CON BACKEND
    %% =========================================================================
    subgraph InfraLayer ["🔌 2. Infraestructura HTTP & Mappers"]
        API["⚡ FastAPI REST Backend (Docker Silo)"]
        ServiceProd["🌐 product_service.ts (HTTP Client)"]
        Logger["📡 logger.ts (Telemetría /api/logs/frontend)"]
        MapperProd["🔄 product_mapper.ts (DTO -> UI Model)"]
    end

    %% =========================================================================
    %% CAPA DE ESTADO & FACHADAS (HOOKS)
    %% =========================================================================
    subgraph StateLayer ["🧠 3. Capa de Estado & Lógica de Negocio"]
        HookProd["🪝 useProducts.ts (Fachada de Catálogo & Buscador)"]
        ContextCart["🛒 PedidoContext (usePedidoStore / Anti-NaN)"]
    end

    %% =========================================================================
    %% CAPA DE PRESENTACIÓN UI
    %% =========================================================================
    subgraph UILayer ["🎨 4. Capa de Presentación (UI / Layout Engine)"]
        Landing["🏠 LlandingPage.tsx (Orquestador & Alternancia Matricial)"]
        HeaderSec["📌 HederSession.tsx (Sticky Navbar)"]
        HeroSec["🚀 HeroSession.tsx (Dispatcher Hero V1-V4)"]
        SecProd["📦 ProductsSession.tsx (Catálogo)"]
        SecServ["🩺 ServicioSession.tsx (Servicios)"]
        SecPlan["📋 PlanSession.tsx (Planes)"]
        SecPort["💼 PortfolioSession.tsx (Galería)"]
        SecMaps["📍 MapsSession.tsx (Google Maps)"]
        FooterSec["👣 FooterSession.tsx (Pie)"]

        %% Strategy Pattern para Tarjetas
        DispProd{"🔀 Dispatcher: ProductCard"}
        CardProdV1["ProductCardV1 (Plana / Rápida)"]
        CardProdV2["ProductCardV2 (Acordeón Variantes)"]

        %% Módulo Lateral de Compra
        DrawerCart["🛒 PedidoDrawer.tsx (Off-Canvas)"]
        RowCart["📋 PedidoItemRow.tsx (Línea con item_key)"]
        FooterCart["💵 PedidoFooterCollapsible.tsx (Checkout & WPP)"]
    end

    %% =========================================================================
    %% RELACIONES RUNTIME
    %% =========================================================================
    JSON --> ContextTenant
    ContextTenant --> ThemeEngine
    ContextTenant -.->|Inyecta Features & Paleta| Landing

    %% RELACIONES DE INFRAESTRUCTURA Y BACKEND
    HookProd -->|1. fetchProductosAgrupados| ServiceProd
    ServiceProd -->|2. GET /api/productos/agrupados| API
    ServiceProd -.->|Error HTTP| Logger
    Logger -.->|POST telemetría| API
    API -->|3. DTO Crudo| MapperProd
    MapperProd -->|4. ApiProduct[] normalizado| HookProd

    %% RELACIONES DE ESTADO Y UI
    SecProd --> HookProd
    SecProd --> DispProd
    DispProd -->|ui_variants: v1| CardProdV1
    DispProd -->|ui_variants: v2| CardProdV2

    CardProdV1 -->|addToPedido| ContextCart
    CardProdV2 -->|addToPedido| ContextCart

    Landing --> HeaderSec
    Landing --> HeroSec
    Landing --> SecProd
    Landing --> SecServ
    Landing --> SecPlan
    Landing --> SecPort
    Landing --> SecMaps
    Landing --> FooterSec

    HeaderSec -->|Abre Carrito| DrawerCart
    DrawerCart --> RowCart
    DrawerCart --> FooterCart
    DrawerCart <-->|Sincronización Total/Items| ContextCart
    FooterCart -->|Genera Pedido| WPP[("📲 WhatsApp API Payload")]

    %% =========================================================================
    %% HIPERVÍNCULOS NAVEGABLES EN MERMAID
    %% =========================================================================
    click JSON "../../public/config/client_info.json" "Ver configuración del tenant activo"
    click ContextTenant "../../src/context/tenant_context.tsx" "Abrir TenantContext"
    click ThemeEngine "../../src/config/theme_config.ts" "Abrir inyector de tema"
    click ServiceProd "../../src/services/product_service.ts" "Abrir product_service.ts"
    click Logger "../../src/services/logger.ts" "Abrir logger de frontend"
    click MapperProd "../../src/mapper/product_mapper.ts" "Abrir product_mapper.ts"
    click HookProd "../../src/hooks/useProducts.ts" "Abrir hook useProducts.ts"
    click ContextCart "../../src/context/pedido_context.tsx" "Abrir pedido_context.tsx"
    click Landing "../../src/pages/landing/LlandingPage.tsx" "Abrir LlandingPage.tsx"
    click SecProd "../../src/pages/landing/sessions/ProductsSession.tsx" "Abrir ProductsSession.tsx"
    click DispProd "../../src/components/ProductCard/ProductCard.tsx" "Abrir Dispatcher ProductCard"
    click CardProdV1 "../../src/components/ProductCard/ProductCardV1.tsx" "Abrir ProductCardV1"
    click CardProdV2 "../../src/components/ProductCard/ProductCardV2.tsx" "Abrir ProductCardV2"
    click DrawerCart "../../src/pages/pedido/PedidoDrawer.tsx" "Abrir PedidoDrawer.tsx"
    click RowCart "../../src/pages/pedido/PedidoItemRow.tsx" "Abrir PedidoItemRow.tsx"
    click FooterCart "../../src/pages/pedido/PedidoFooterCollapsible.tsx" "Abrir PedidoFooterCollapsible.tsx"
    click API "../../../../api-backend/app/main.py" "Abrir backend FastAPI"
```

---

## 🗺️ Índice de Componentes y Enlaces Directos del Diagrama

Para entornos donde los clics dentro de diagramas Mermaid no estén habilitados, utiliza la siguiente tabla de navegación directa:

| Capa Arquitectónica | Componente / Archivo | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Configuración** | [`client_info.json`](../../public/config/client_info.json) | Identidad, teléfonos, flags y colores montados en caliente. |
| **Configuración** | [`tenant_context.tsx`](../../src/context/tenant_context.tsx) | Parseo defensivo (`stripJsonComments`) y provisión reactiva vía `useConfig()`. |
| **Configuración** | [`theme_config.ts`](../../src/config/theme_config.ts) | Transforma paleta Hex a canales RGB e inyecta variables CSS en `:root`. |
| **Infraestructura** | [`product_service.ts`](../../src/services/product_service.ts) | Cliente HTTP puro (`fetch`) con endpoints `/api/productos/agrupados`. |
| **Infraestructura** | [`logger.ts`](../../src/services/logger.ts) | Despacha fallos de red y excepciones a `POST /api/logs/frontend`. |
| **Infraestructura** | [`product_mapper.ts`](../../src/mapper/product_mapper.ts) | Mapea DTOs a `ApiProduct`, resuelve imágenes (R2/local/fallback) y variantes. |
| **Backend** | [`api-backend/app/main.py`](../../../../api-backend/app/main.py) | Punto de entrada FastAPI con endpoints transaccionales y CORS/proxy. |
| **Estado / Fachada** | [`useProducts.ts`](../../src/hooks/useProducts.ts) | Fachada de catálogo, rehidratación desde URL (`?cart=...`) y buscador en memoria. |
| **Estado / Store** | [`pedido_context.tsx`](../../src/context/pedido_context.tsx) | Store reactivo del carrito, gestión de variantes por `item_key` y cálculos Anti-NaN. |
| **Presentación** | [`LlandingPage.tsx`](../../src/pages/landing/LlandingPage.tsx) | Orquestador maestro, pipeline de secciones y máquina de alternancia de fondos. |
| **Presentación** | [`ProductsSession.tsx`](../../src/pages/landing/sessions/ProductsSession.tsx) | Grilla de catálogo comercial con filtrado y buscador interactivo. |
| **Presentación** | [`ProductCard.tsx`](../../src/components/ProductCard/ProductCard.tsx) | Despachador de variante de tarjeta de producto (`v1` plana o `v2` acordeón). |
| **Presentación** | [`PedidoDrawer.tsx`](../../src/pages/pedido/PedidoDrawer.tsx) | Panel lateral deslizable (Off-canvas) con resumen y gestión de líneas. |
| **Presentación** | [`PedidoItemRow.tsx`](../../src/pages/pedido/PedidoItemRow.tsx) | Fila de producto con control numérico en vivo y badge de talle/variante. |
| **Presentación** | [`PedidoFooterCollapsible.tsx`](../../src/pages/pedido/PedidoFooterCollapsible.tsx) | Acordeón de checkout: métodos de pago, datos bancarios, logística y WhatsApp. |

---

## 🔗 Referencias Cruzadas y Documentación Oficial

* 📘 [README General de apps/web-client](../../README.md)
* 🏠 [Documentación de Landing Page (`src/pages/landing/README.md`)](../../src/pages/landing/README.md)
* 🛒 [Documentación de Pedidos y Carrito (`src/pages/pedido/README.md`)](../../src/pages/pedido/README.md)
* 🏛️ [Overview de Arquitectura del Frontend](overview.md)
* 🔄 [Diagrama de Secuencia de Integración](diagrama_secuencia_fronten.md)
* 🌐 [Documentación Oficial de React 19](https://react.dev/)
* ⚡ [Documentación Oficial de Vite](https://vite.dev/)
* 📘 [Documentación Oficial de TypeScript](https://www.typescriptlang.org/docs/)
* 🎨 [Documentación Oficial de Tailwind CSS v3](https://tailwindcss.com/docs)
* 🚀 [Documentación Oficial de FastAPI](https://fastapi.tiangolo.com/)
