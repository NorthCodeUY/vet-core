// app/vet-core/apps/web-client/vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' // Plugin para trabajar con SVG 

export default defineConfig({
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
})




