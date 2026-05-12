# VetCore

🐾 **VetCore Ecosystem by NorthCode**

VetCore es una plataforma integral de gestión veterinaria diseñada para cerrar la brecha entre la atención clínica de pequeñas mascotas y la gestión productiva de grandes animales. Desarrollado con un enfoque en **Rigor Científico**, **Escalabilidad** y **Cumplimiento Normativo (SNIG/DILAVE)**.

Este repositorio contiene el núcleo del sistema, diseñado como una solución *White Label* para clínicas veterinarias que buscan profesionalizar su identidad digital y optimizar su flujo de caja mediante e-commerce y logística integrada.

## 🚀 Características Principales

### Fase 1: Identidad & Presencia Digital
- **Landing Page High-Performance**: Desarrollada en React + Tailwind CSS para una carga instantánea.
- **Catálogo Dinámico**: Visualización de productos vía JSON para despliegue rápido.
- **Módulo de Emergencias**: Integración directa con WhatsApp API para asistencia inmediata.

### Fase 2: E-commerce & Logística de Proximidad
- **Smart Cart**: Sistema de pedidos automatizado con cierre en WhatsApp.
- **Gestión de Stock Proactiva**: Control de inventario con soporte para lectores de códigos de barras Bluetooth.
- **Fleet Management**: Aplicación móvil (Flutter) para la organización de repartos por zona y horario.

### Fase 3: Gestión Clínica & Compliance MGAP
- **Historia Clínica Digital**: Registro cronológico detallado y trazabilidad sanitaria.
- **Módulo de Producción**: Gestión por pred io (DICOSE) y seguimiento de patologías en rodeos.
- **Compliance DILAVE/SNIG**: Registro automatizado de específicos y generación de reportes ministeriales.

## 🛠 Stack Tecnológico

- **Frontend**: React.js + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Mobile**: Flutter (Dart), Portales administrativos, clinica, logisticas 
- **Infraestructura**: Docker, Nginx Proxy Manager, PostgreSQL.
- **Comunicación**: WhatsApp Business API.


## 📦 Estructura genera de proyecto

```text
/vet-core
├── apps/                   # Frontend 
│    web-client/            # React (E-commerce y Portal Clientes)
├── api-backend/            # Backend FastAPI 
├── docker-compose.yml       # Orquestador local <!> Falta desarollar 
└── README.md                # Documentación técnica centralizada
``` 

## 📊 [Documentacion Frontend Web Clientes](./apps/web-client/README.md)

## 📈 Filosofía de Desarrollo

En **NorthCode**, creemos en la **Transparencia Total**. Este proyecto se desarrolla bajo una arquitectura de código abierto y documentado, permitiendo la auditoría técnica y garantizando que el cliente sea dueño de su activo tecnológico.




## 📝 Licencia

Este proyecto es propiedad de **NorthCode**. Se otorga una licencia de uso perpetua a los clientes finales, manteniendo el código abierto para fines de portafolio y mejora comunitaria.

---

Desarrollado con ❤️ en Artigas/Salto, Uruguay por **NorthCode**.

---

> **💡 Tip de Senior PM para el Repo:**
>
> En la descripción corta del repo (la que sale a la derecha en GitHub): Pon algo breve como: *"Comprehensive digital management ecosystem for veterinary clinics and livestock production. Built with React, FastAPI, and Flutter."*
>
> **Topics (Etiquetas):** Agregá etiquetas como `veterinary-software`, `react`, `fastapi`, `flutter`, `snig-uruguay`, `northcode`. Esto ayuda a que el repo se posicione mejor.


### Estructura General del Proyecto



## <!> Estructur de baken sugerido de proeycto comparando miproyecot contaduria barion 4 mayo

``` text
/veterinaria-salto
├── apps/
│    web-client/          # React (E-commerce y Portal Clientes)
│   └── admin-app/           # Flutter (Gestión interna y Médica)
├── services/
│   └── api-backend/         # FastAPI
├── shared/                  # Documentación, Assets globales, Prototipos Figma
├── infra/
│   ├── docker/              # Dockerfiles específicos y configs
│   └── nginx/               # Configuración de proxy inverso
├── docker-compose.yml       # Orquestador local
└── README.md                # Documentación técnica centralizada
```





Estructura de proyecto que se que funciona Cantaduria barone
https://github.com/northcodeuy-debug/Proyecto-EstudioContable-






























## Estructura de poryecto sujerida para backend

```text
/services/api-backend/app
├── api/             # Endpoints (v1, v2)
│   └── v1/
│       ├── endpoints/
│       └── api.py
├── core/            # Configuración, Seguridad (JWT), Constantes
├── db/              # Sesión de Base de Datos y Migraciones
├── models/          # Modelos de base de datos (SQLAlchemy/SQLModel)
├── schemas/         # Pydantic models (Validación de datos)
├── services/        # Lógica de negocio (Donde ocurre la "magia")
└── main.py
```


## Modelo Entidad relacion 


El modelo de datos está estructurado para manejar el historial de precios en el carrito y la gestión de productos.


```mermaid
erDiagram
    %% Relaciones principales
    CLIENTE ||--o{ PEDIDO : "realiza"
    PEDIDO ||--|{ PEDIDO_DETALLE : "contiene"
    PRODUCTO ||--o{ PEDIDO_DETALLE : "se vende en"
    PRODUCTO ||--o{ SUBCATEGORIA : "aplica a"
    PEDIDO ||--o{ PAGO : "genera"
    SUBCATEGORIA ||--o{ PRODUCTO : "agrupa"

    CLIENTE {
        int id PK
        string nombre
        string whatsapp
        string token
    }

    PRODUCTO {
        int id PK
        string nombre
        string descripcion
        float precio_actual
        int stock
        int categoria_id FK
        string categoria_nombre "Ej: Medicamentos, Alimento, Accesorios"
    }

    SUBCATEGORIA {
        int id PK
        string nombre "Ej: Perro, Gato, Caballo, Oveja"
    }

    PEDIDO {
        int id PK
        int cliente_id FK
        datetime fecha
        string codigo_qr "Token de entrega"
        datetime fecha_entrega
        string estado "Ej: Armado, Entregado"
    }

    PEDIDO_DETALLE {
        int pedido_id PK, FK
        int producto_id PK, FK
        int cantidad
        float precio_unitario_venta "Precio capturado al momento"
    }

    PAGO {
        int id PK
        int pedido_id FK
        datetime fecha
        string detalle "Ej: Transferencia, Efectivo"
    }
```