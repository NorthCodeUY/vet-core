
# VetCore - Sistema Integral Veterinaria Beltramelli

## 🐾 Plataforma de Gestión Veterinaria y E-commerce desarrollada para la
Veterinaria Beltramelli en Salto, Uruguay. Este proyecto utiliza una
arquitectura de Monorepo diseñada para escalar desde una Landing Page hasta un
ecosistema completo de gestión clínica y ventas.

## 🚀 Stack Tecnológico (Frameworks & Libs)

El frontend está construido buscando el máximo rendimiento y mantenibilidad:

  - **React 19 (Beta)**: Implementación de las últimas funcionalidades del core de
    React.
  - **Vite 8**: Herramienta de construcción (build tool) ultra rápida para el
    desarrollo.
  - **TypeScript**: Tipado estático para reducir errores en tiempo de ejecución y
    mejorar el autocompletado.
  - **Tailwind CSS v3.4**: Framework de utilidades CSS para un diseño responsivo y
    "Pixel Perfect" basado en los bocetos de Figma.
  - **Lucide React**: Set de iconos vectoriales consistentes y ligeros.
  - **Lottie React**: Motor de animaciones basadas en JSON para una experiencia de
    usuario (UX) dinámica sin sacrificar performance.
  - **React Router DOM**: Gestión de navegación y rutas (ej: /revision para pruebas
    de cliente).

## 📂 Estructura del Proyecto (Monorepo)

El proyecto sigue una arquitectura Feature-Based, lo que permite separar la
lógica de negocio por módulos independientes:



## Estructura de proyecto sugerida para web-client Resumida
 
```text  

/vet-core
├── .github/workflows/      # Automatización de despliegue (GitHub Actions)
├── apps/
│   └── web-client/         # Proyecto principal en React (Frontend Clientes)
│       ├── src/
│       │   ├── assets/     # Recursos estáticos (Logos, SVGs, Animacion de web Produccion)
│       │   ├── components/ # Componentes atómicos reutilizables (Botones, Cards, tarjetas)
│       │   ├── data/       # Mock data (JSON para productos y Datos de la empresa)
│       │   ├── features/   # Interfase Modulo Landing Page (Web Principal), Cartel Web en poruccion. 
│       │   ├── models/     # Definición de interfaces y tipos TypeScript
│       │   └── layout/     # Contenedores globales (Navbar, Footer)
│       └── Dockerfile      # Configuración de contenedor para desarrollo local
├── services/               # [Próximamente] Backend con FastAPI
├── archive/                # Versiones anteriores y respaldos de diseño
├── docker-compose.yml       # Orquestador de servicios locales
└── README.md
```
### Estructura Diagramda directorio detallado

```text
/apps/web-client/src
├── assets/          # Estilos globales, imágenes de Salto/Vete
│   ├── animations/ 
│   │    └── maintenance.json # <!> Creo que guarda la animacion que cargo al inicio para la pagina de mantenimiento
│   ├── branding/ 
│   │    ├── SeccionPrincipalFondo.svg # Fondo de seccion principal no se esta usando actualmente 
│   │    ├── terminacionInferior.svg
│   │    └── WhatSapp_Cuadrado.svg # Icono WhatSapp para botones Administracion / Emergencia footer
├── components/      # UI Atoms/Molecules (Botones, Inputs reutilizables)
│   │    ├── ProductsCard.tsx   # Tarjeta para mostrar productos en landig page
│   │    ├── ServiceCard.tsx    # Tarjeta para mostrar servicios en landig page 
│   │    ├── ServiceProps.tsx   # <!> Este creo que no va poreu lo unico ue hago es pasarle los datos lo que tendria que aserlo desde Landig page  diferente eso me hace reudio y 
│   │    ├── WhatsAppButtonProps.tsx
├── config/          # Variables de entorno, instancias de Axios/Fetch
├── features/        # LÓGICA POR MÓDULO (E-commerce, Turnos, Perfil)
│   ├── shop/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ShopPage.tsx
│   └── appointments/
├── hooks/           # Custom hooks globales
├── store/           # Manejo de estado (Zustand o Context)
└── App.tsx
```

# <!> Agregar la etructura sujerida

Estrucutra intera de Proyecto web-client
components/: Botones, inputs y UI atómica reutilizable.
features/: Lógica de negocio pesada (ej: features/ecommerce, features/appointments).
layout/: Navbar, Footer y contenedores principales.
hooks/: Lógica compartida de React.


## <!> Version anteriro 4 mayo 2026



## 🛠️ Infraestructura & DevOps

El proyecto está diseñado para ser agnóstico al entorno (Cloud o Local):

  - Dockerized: Todo el entorno de desarrollo corre sobre contenedores,
    asegurando que todos los miembros del equipo tengan la misma versión de
    Node.js y dependencias.
  - CI/CD: Despliegue automático a través de GitHub Actions hacia el dominio
    oficial.
  - Ruteo Profesional: Uso de 404.html hack para soportar Single Page
    Application (SPA) en servidores de archivos estáticos.

## 📍 Contexto Local (Salto, Uruguay)

La plataforma está optimizada para el mercado uruguayo:

  - Moneda: Precios configurados en Pesos Uruguayos (UYU) con formato local.
  - Logística: Integración de puntos de contacto directo vía WhatsApp para
    emergencias 24hs en la ciudad de Salto.
  - Diseño: Estética profesional médica adaptada a la identidad visual de la
    Veterinaria Beltramelli.

## 👨‍💻 Desarrollo

Para levantar el proyecto en un entorno local de desarrollo:

1.  Entrar a la carpeta del cliente: cd apps/web-client
2.  Instalar dependencias: npm install
3.  Iniciar servidor: npm run dev

## 💡 Notas de Arquitectura

Se utiliza un archivo products.json centralizado para la gestión del catálogo.
Esta decisión facilita la migración futura hacia una base de datos real (FastAPI
/ PostgreSQL), ya que los componentes solo dependen de la estructura del dato y
no de su origen.

Desarrollado por NorthCode. 🚀🐄
