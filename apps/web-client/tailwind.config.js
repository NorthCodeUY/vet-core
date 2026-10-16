// apps/web-client/tailwind.config.js

/**
 * @fileoverview Configuración del Motor de Estilos Tailwind CSS (tailwind.config.js)
 * 
 * Define el sistema de diseño agnóstico y multi-tenant de VetCore. Integra el 
 * diccionario de tokens semánticos dinámicos respaldados por variables CSS en 
 * formato RGB (`rgb(var(...) / <alpha-value>)`), permitiendo la alternancia de 
 * temas en tiempo de ejecución (Runtime) con soporte completo de opacidades.
 * 
 * @module apps/web-client/tailwind.config
 * @type {import('tailwindcss').Config}
 */
export default {
  /* ===========================================================================
     1. PURGA Y ÁMBITO DE CONTENIDO (Content Tree-Shaking)
     Rastrea los archivos fuente para incluir únicamente las clases CSS utilizadas.
     =========================================================================== */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* =======================================================================
         2. BREAKPOINTS RESPONSIVOS PERSONALIZADOS (Puntos de Quiebre)
         Alineados con la arquitectura de navegación y drawers de la plataforma.
         ======================================================================= */
      screens: {
        'nav-breakpoint': '1166px',     // Transición entre menú desktop y drawer móvil
        'tablet-breakpoint': '858px',   // Reorganización de grillas en tablets medianas
        'desktop-breakpoint': '1008px', // Salto a disposición de columnas en escritorio
      },

      /* =======================================================================
         3. DICCIONARIO DE TOKENS SEMÁNTICOS MULTI-TENANT (vete-*)
         Variables inyectadas en :root vía ThemeConfig en formato RGB ("R G B").
         La sintaxis '/ <alpha-value>' habilita transparencias nativas (ej: bg-vete-primary/20).
         ======================================================================= */
      colors: {
        vete: {
          /* --- A. Marca, Identidad y Llamadas a la Acción (CTA) --- */
          primary: 'rgb(var(--vete-primary) / <alpha-value>)',             // Color institucional primario
          'primary-hover': 'rgb(var(--vete-primary-hover) / <alpha-value>)', // Estado hover del botón de acción
          secondary: 'rgb(var(--vete-secondary) / <alpha-value>)',         // Tinte secundario y badges
          tertiary: 'rgb(var(--vete-tertiary) / <alpha-value>)',           // Color exclusivo WhatsApp/Canales

          /* --- B. Fondos Estructurales y Contenedores --- */
          dark: 'rgb(var(--vete-dark) / <alpha-value>)',                   // Fondos estructurales profundos
          surface: 'rgb(var(--vete-surface) / <alpha-value>)',             // Fondo de tarjetas, modales e inputs
          soft: 'rgb(var(--vete-soft) / <alpha-value>)',                   // Tinte suave de soporte visual
          overlay: 'rgb(var(--vete-overlay) / <alpha-value>)',             // Capa oscura para backdrops

          /* --- C. Jerarquía Tipográfica y Bordes --- */
          'text-base': 'rgb(var(--vete-text-base) / <alpha-value>)',       // Color tipográfico de alto contraste
          'text-muted': 'rgb(var(--vete-text-muted) / <alpha-value>)',     // Subtítulos, fechas y placeholders
          'border-subtle': 'rgb(var(--vete-border-subtle) / <alpha-value>)', // Separadores y líneas tenues
          error: 'rgb(var(--vete-error) / <alpha-value>)',                 // Alertas y acciones destructivas
        },
      },

      /* =======================================================================
         4. TIPOGRAFÍA BASE (Font Family)
         ======================================================================= */
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fuente sans-serif de legibilidad optimizada
      },

      /* =======================================================================
         5. ESCALA TIPOGRÁFICA CORPORATIVA (Typography Hierarchy)
         Tuplas con tamaño de fuente [fontSize] e interlineado estricto [lineHeight].
         ======================================================================= */
      fontSize: {
        'vete-h1': ['72px', { lineHeight: '1.1' }],       // Títulos de impacto en portada (Hero)
        'vete-h2': ['36px', { lineHeight: '1.2' }],       // Encabezados principales de sección
        'vete-h3': ['24px', { lineHeight: '1.3' }],       // Títulos de tarjetas y bloques modulares
        'vete-body': ['18px', { lineHeight: '29.25px' }], // Texto estándar de lectura continua
        'vete-small': ['14px', { lineHeight: '20px' }],   // Textos auxiliares, badges y pie de foto
      },
    },
  },

  /* ===========================================================================
     6. PLUGINS DE TAILWIND
     =========================================================================== */
  plugins: [],
};