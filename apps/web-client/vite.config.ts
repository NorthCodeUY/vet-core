// app/vet-core/apps/web-client/vite.config.ts

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' // Plugin para trabajar con SVG 

export default defineConfig(({ mode }) => {
  // Cargamos las variables de entorno basándonos en el modo actual
  const env = loadEnv(mode, process.cwd(), '') // Trae los dato de el archivo .env
  const backendPort = env.VITE_BACKEND_PORT || '8000' // trae el puerto de backend 
  const frontendPort = parseInt(env.VITE_FRONTEND_PORT) || 5173; // trae el puerto de frontend 

  return {
    server: {
      port: frontendPort, // Usamos el puerto que viene del .env
      host: true, // <!> Revisar la seguridad en este punto 
      allowedHosts: [ // Para que funcione el tunel de esportacion entorno desarollo
        '.trycloudflare.com', // Permite cualquier subdominio de Cloudflare
        'localhost',
        '127.0.0.1'
      ],
      proxy: {
        /* 
           Configuración dinámica del Proxy:
           Usa el puerto del backend definido en el .env
        */
        '/api': {
          target: `http://127.0.0.1:${backendPort}`,// URL dinamica para la API con su puerto
          changeOrigin: true, //  Cambia el origen de la petición <!> NO entiendo bien esto ni me quede tranquilo con lo que lei de esto 
          secure: false, //  No valida el certificado SSL/TLS <!> Esto no hace inseguro el sitio 
        },
        '/static': {
          target: `http://127.0.0.1:${backendPort}`, // URL dinamica para las imagenes con su puerto
          changeOrigin: true, //  Cambia el origen de la petición <!> NO entiendo bien esto ni me quede tranquilo con lo que lei de esto 
          secure: false, //  No valida el certificado SSL/TLS <!> Esto no hace inseguro el sitio 
        }

      }
    },

  plugins: [  // plugins: [react()] // Asi estaba antes 
    react(),
    svgr({
      // Esta opción es clave para que reaccione a Tailwind
      svgrOptions: {
        icon: true,
        replaceAttrValues: {
          // Busca el color original (ej: "#000000") y lo reemplaza por "currentColor"
          // Cambiá "#000000" por el color exacto que tenga tu SVG al exportarlo
          '#000000': 'currentColor', 
        }
      }
    })
  ],
  base: '/', // Esto es vital para dominios personalizados
  };
});




