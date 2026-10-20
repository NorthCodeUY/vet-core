// apps/web-client/postcss.config.js
/**
 * @fileoverview Configuración del Pipeline de Post-procesamiento CSS (PostCSS)
 * 
 * Orquesta la transformación de hojas de estilo durante la compilación en Vite.
 * Procesa las directivas nativas de Tailwind CSS y aplica automáticamente los
 * prefijos de proveedores de navegadores (Vendor Prefixes) mediante Autoprefixer.
 * 
 * @module apps/web-client/postcss.config
 */

export default {
  plugins: {
    /* =========================================================================
       1. MOTOR DE UTILIDADES DE TAILWIND CSS
       ========================================================================= */
    // Rastrea el DOM virtual y genera bajo demanda las clases utilitarias compiladas
    tailwindcss: {},

    /* =========================================================================
       2. COMPATIBILIDAD ENTRE NAVEGADORES (Autoprefixer)
       ========================================================================= */
    // Inyecta prefijos propietarios (-webkit-, -moz-, -ms-) según la matriz de Browserslist
    // garantizando soporte visual homogéneo en Chrome, Safari, Firefox y navegadores móviles
    autoprefixer: {},
  },
};