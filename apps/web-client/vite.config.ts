/**
 * @fileoverview Configuración del Empaquetador y Servidor de Desarrollo (Vite)
 * 
 * Orquesta la compilación del bundle para React 19, la resolución de variables
 * de entorno en tiempo de desarrollo y el túnel proxy inverso hacia el backend 
 * FastAPI, emulando la infraestructura de producción de NGINX.
 * 
 * @module apps/web-client/vite.config
 */

import { defineConfig, loadEnv } from 'vite';
// --- Plugins Oficiales de Compilación y Transformación ---
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  /* ===========================================================================
     1. RESOLUCIÓN DINÁMICA DE ENTORNO (ENV VARIABLES)
     Carga las variables del archivo .env según el modo activo ('development' | 'production').
     =========================================================================== */
  const env = loadEnv(mode, process.cwd(), '');
  
  // Puertos operativos de desarrollo con fallbacks defensivos
  const backendPort = env.VITE_BACKEND_PORT || '8001'; // <!> Esto no entido es un puerto estatico pense una varible 
  const frontendPort = Number(env.VITE_FRONTEND_PORT) || 5173; // <!> Esto lo miso no me quda claro pense que esto es un puerto diferete para cada entron segun el clite o no cas porque por lo que entiendo cpas estoy me dio perdido en esto 

  return {
    /* =========================================================================
       2. SERVIDOR DE DESARROLLO LOCAL (Vite Dev Server)
       ========================================================================= */
    server: {
      port: frontendPort,

      // Expone el servidor en 0.0.0.0 para habilitar pruebas en red local (LAN) y Docker
      host: '0.0.0.0',

      // Lista blanca de hosts autorizados para soportar túneles remotos (Cloudflare Tunnels)
      allowedHosts: [
        '.trycloudflare.com',
        'localhost',
        '127.0.0.1'
      ],

      /* -----------------------------------------------------------------------
         PROXY INVERSO LOCAL (Desacople de CORS en Desarrollo)
         Emula el comportamiento de NGINX redirigiendo peticiones al backend FastAPI.
         ----------------------------------------------------------------------- */
      proxy: {
        // Redirección de endpoints transaccionales REST
        '/api': {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: true, // Modifica la cabecera 'Host' para coincidir con el destino
          secure: false,      // Permite certificados autofirmados en entornos de prueba
        },
        // Redirección de archivos estáticos y multimedia servidos por el backend
        '/static': {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    /* =========================================================================
       3. PIPELINE DE PLUGINS Y TRANSFORMACIÓN DE ASSETS
       ========================================================================= */
    plugins: [
      // Soporte para React 19 y Fast Refresh (HMR instantáneo)
      react(),

      // Transformación de gráficos SVG a componentes React interactivos
      svgr({
        svgrOptions: {
          icon: true, // Optimiza el viewBox para escalado tipográfico
          replaceAttrValues: {
            // Convierte trazos negros fijos a 'currentColor' para dinamizar con clases Tailwind
            '#000000': 'currentColor',
          },
        },
      }),
    ],

    /* =========================================================================
       4. RESOLUCIÓN DE RUTAS DE DISTRIBUCIÓN
       ========================================================================= */
    // Define la raíz de montaje de la SPA compatible con NGINX
    base: '/',
  };
});