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
## <!> Tengoque terminar de docuemtar la parte de como levantar los entorno 

## Modelo Entidad relacion 


El modelo de datos está estructurado para manejar el historial de precios en el carrito y la gestión de productos.

## 📊 [Documentacion Frontend Web Clientes](./apps/web-client/README.md)

## 📊 [Documentacion Backend](./api-backend/README.md)





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

# 🧠 Explicación Técnica del Auditor

**Aislamiento de Datos:** Cada servicio de API (api_valeria, api_carlos) apunta a una base de datos distinta dentro del mismo motor PostgreSQL. Esto garantiza que un error en una instancia no comprometa los datos de otra y facilita los backups independientes.

**Inyección por Volúmenes:** En lugar de crear una imagen de Docker por cada cliente, usamos la misma imagen y le "enchufamos" el config.json específico mediante volúmenes de Docker. Esto reduce drásticamente el uso de disco y simplifica el mantenimiento.

**Configuración en Runtime (React):** El desarrollador de React debe entender que el archivo client_info.json en la carpeta public es su única fuente de verdad para el branding. Al cargar la app, un fetch inicial a este archivo local configurará el estado global (Context API o Redux) con los colores y textos del cliente actual.

**Escalabilidad:** Para agregar un nuevo carrito, solo debes crear una nueva base de datos en Postgres y agregar un bloque nuevo al docker-compose.yml con su respectivo JSON de configuración. No se requiere tocar una sola línea de código Python o TypeScript.

