<!-- apps/web-client/docs/architecture/diagrama_arquitectura_fontend.md 
<!> Los link parese no funcionar hay que probarlo cuado lo suba aver que hoda -->


[⬅️ Volver a la Documentación Principal](../../README.md)

---

# 🏛️ Arquitectura Global del Frontend (VetCore SaaS)

> 💡 **Interactividad:** Puedes hacer clic en cualquiera de las cajas del diagrama para abrir directamente su archivo de código fuente en el editor o en GitHub.

```mermaid
graph TD
    %% =========================================================================
    %% FUENTE DE CONFIGURACIÓN RUNTIME (Zero-Rebuild)
    %% =========================================================================
    subgraph ConfigLayer ["⚙️ Capa de Configuración Runtime"]
        JSON["Runtime Config: client_info.json"]
        ContextTenant["Contexto: TenantContext (useConfig)"]
        ThemeEngine["Theme Config: Hex -> RGB (:root)"]
    end

    %% =========================================================================
    %% CAPA DE PRESENTACIÓN UI
    %% =========================================================================
    subgraph UILayer ["🎨 Capa de Presentación (UI / Layout Engine)"]
        Landing["Orquestador: LlandingPage.tsx"]
        
        %% Módulos Seccionales
        SecProd["Sección: ProductsSession"]
        SecPort["Sección: PortfolioSession"]
        SecServ["Sección: ServicioSession"]
        
        %% Strategy Pattern (Variantes)
        DispProd{"Dispatcher: ProductCard"}
        CardProdV1["ProductCardV1 (Plana)"]
        CardProdV2["ProductCardV2 (Acordeón)"]
        
        DispPort{"Dispatcher: PortfolioCard"}
        CardPortV1["PortfolioCardV1 (Multimedia)"]
    end

    %% =========================================================================
    %% CAPA DE ESTADO & FACHADAS (HOOKS)
    %% =========================================================================
    subgraph StateLayer ["🧠 Capa de Estado & Lógica de Negocio"]
        HookProd["Hook Fachada: useProducts"]
        ContextCart["Store: PedidoContext (Carrito)"]
    end

    %% =========================================================================
    %% CAPA DE INFRAESTRUCTURA Y BACKEND
    %% =========================================================================
    subgraph InfraLayer ["🔌 Infraestructura & Datos"]
        ServiceProd["Servicio HTTP: product_service.ts"]
        MapperProd["Mapper: DTO -> Modelos UI"]
        API["FastAPI Backend (Docker Silo)"]
    end

    %% RELACIONES RUNTIME
    JSON --> ContextTenant
    ContextTenant --> ThemeEngine
    ContextTenant -.->|Inyecta Features & Paleta| Landing

    %% RELACIONES UI
    Landing --> SecProd
    Landing --> SecPort
    Landing --> SecServ

    %% STRATEGY PATTERNS
    SecProd --> DispProd
    DispProd -->|ui_variants: v1| CardProdV1
    DispProd -->|ui_variants: v2| CardProdV2

    SecPort --> DispPort
    DispPort -->|ui_variants: v1| CardPortV1

    %% ESTADO Y LLAMADAS
    SecProd --> HookProd
    CardProdV1 --> ContextCart
    CardProdV2 --> ContextCart

    HookProd --> ServiceProd
    ServiceProd --> API
    API --> MapperProd
    MapperProd --> HookProd

    %% =========================================================================
    %% <!> HIPERVÍNCULOS NAVEGABLES A TODOS LOS ARCHIVOS DEL PROYECTO
    %% =========================================================================
    click JSON "../../public/config/client_info.json" "Ver JSON activo de configuración"
    click ContextTenant "../../src/context/tenant_context.tsx" "Abrir TenantContext"
    click ThemeEngine "../../src/config/theme_config.ts" "Abrir ThemeConfig"

    click Landing "../../src/pages/landing/LlandingPage.tsx" "Abrir Orquestador LandingPage"
    click SecProd "../../src/pages/landing/sessions/ProductsSession.tsx" "Abrir ProductsSession"
    click SecPort "../../src/pages/landing/sessions/PortfolioSession.tsx" "Abrir PortfolioSession"
    click SecServ "../../src/pages/landing/sessions/ServicioSession.tsx" "Abrir ServicioSession"

    click DispProd "../../src/components/ProductCard/ProductCard.tsx" "Abrir Dispatcher ProductCard"
    click CardProdV1 "../../src/components/ProductCard/ProductCardV1.tsx" "Abrir ProductCardV1"
    click CardProdV2 "../../src/components/ProductCard/ProductCardV2.tsx" "Abrir ProductCardV2"

    click DispPort "../../src/components/PortfolioCard/PortfolioCard.tsx" "Abrir Dispatcher PortfolioCard"
    click CardPortV1 "../../src/components/PortfolioCard/PortfolioCardV1.tsx" "Abrir PortfolioCardV1"

    click HookProd "../../src/hooks/useProducts.ts" "Abrir useProducts"
    click ContextCart "../../src/context/pedido_context.tsx" "Abrir PedidoContext"

    click ServiceProd "../../src/services/product_service.ts" "Abrir product_service"
    click MapperProd "../../src/mapper/product_mapper.ts" "Abrir product_mapper"
    click API "../../../../api-backend/app/main.py" "Abrir Backend FastAPI"