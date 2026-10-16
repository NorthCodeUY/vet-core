/**
 * @fileoverview Configuración Central de Calidad de Código y Linter (ESLint v9+ Flat Config)
 * 
 * Define las reglas estáticas de análisis de código para garantizar la robustez
 * arquitectónica, el cumplimiento estricto de las reglas de Hooks en React 19,
 * la seguridad tipográfica de TypeScript y la compatibilidad con Fast Refresh en Vite.
 * 
 * @module apps/web-client/eslint.config
 */

// --- Reglas Base de JavaScript Oficiales ---
import js from '@eslint/js';

// --- Definiciones de Variables Globales del Entorno de Ejecución ---
import globals from 'globals';

// --- Plugins Especializados del Ecosistema React y TypeScript ---
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// --- Helper de Tipado y Configuración de ESLint ---
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  /* ===========================================================================
     1. EXCLUSIONES GLOBALES (Ignore Patterns)
     Evita analizar carpetas de distribución compilada o artefactos temporales.
     =========================================================================== */
  globalIgnores([
    'dist',          // Artefactos de producción generados por Vite
    'node_modules',   // Dependencias de terceros
    'public',         // Assets estáticos servidos directamente
  ]),

  /* ===========================================================================
     2. CONFIGURACIÓN PRINCIPAL DE SOURCE CODE (TypeScript & React 19)
     =========================================================================== */
  {
    // Aplica las reglas únicamente a archivos de lógica y componentes de interfaz
    files: ['**/*.{ts,tsx}'],

    /* -------------------------------------------------------------------------
       CONJUNTOS DE REGLAS HEREDADAS (Presets Recomendados)
       ------------------------------------------------------------------------- */
    extends: [
      // 1. Buenas prácticas y sintaxis estándar de JavaScript moderno
      js.configs.recommended,

      // 2. Reglas de análisis estático y seguridad tipográfica para TypeScript
      tseslint.configs.recommended,

      // 3. Reglas estrictas de React Hooks (Garantiza integridad en dependencias de useEffect/useMemo)
      reactHooks.configs.flat.recommended,

      // 4. Asegura que los componentes se exporten correctamente para Vite Fast Refresh (HMR)
      reactRefresh.configs.vite,
    ],

    /* -------------------------------------------------------------------------
       OPCIONES DE PARSEO Y ENTORNO GLOBAL
       ------------------------------------------------------------------------- */
    languageOptions: {
      // Soporte para sintaxis ECMAScript moderna (Optional chaining ?., Nullish coalescing ??)
      ecmaVersion: 2020,

      // Declara como válidos los objetos globales del navegador (window, document, fetch, navigator)
      globals: globals.browser,
    },

    /* -------------------------------------------------------------------------
       REGLAS PERSONALIZADAS Y OVERRIDES
       ------------------------------------------------------------------------- */
    rules: {
      // Permite advertir componentes no aislados que impidan la recarga en caliente de Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]);