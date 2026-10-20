/**
 * @fileoverview Configuración Base del Servidor de Desarrollo y Empaquetador (Vite)
 * 
 * Configura la integración oficial para React y establece las reglas de túnel
 * proxy inverso hacia el backend FastAPI local, evitando problemas de CORS
 * durante la fase de desarrollo.
 * 
 * @module apps/web-client/vite.config
 */

import { defineConfig } from 'vite';
// --- Plugin Oficial de React para Vite (Fast Refresh & JSX Transformation) ---
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* ===========================================================================
     1. PIPELINE DE PLUGINS
     =========================================================================== */
  plugins: [
    // Habilita Fast Refresh (HMR) y la compilación optimizada de JSX/TSX
    react(),
  ],

  /* ===========================================================================
     2. SERVIDOR DE DESARROLLO Y REVERSE PROXY
     =========================================================================== */
  server: {
    proxy: {
      /* -----------------------------------------------------------------------
         PROXY DE API REST (/api)
         Reenvía las peticiones de endpoints del cliente hacia el servidor FastAPI.
         ----------------------------------------------------------------------- */
      '/api': {
        // Dirección base del backend local
        target: 'http://127.0.0.1:8000',
        
        // Modifica la cabecera 'Host' de la petición para que coincida con el backend destino
        changeOrigin: true,
        
        // Permite la conexión incluso si el protocolo usara certificados autofirmados (HTTP/HTTPS)
        secure: false,
      },

      /* -----------------------------------------------------------------------
         PROXY DE ARCHIVOS ESTÁTICOS (/static)
         Sintaxis simplificada para servir imágenes de catálogo y recursos multimedia 
         subidos por el backend sin bloqueos de seguridad del navegador.
         ----------------------------------------------------------------------- */
      '/static': 'http://127.0.0.1:8000',
    },
  },
});