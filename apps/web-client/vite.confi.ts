/* --- apps/web-client/vite.config.ts --- */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      /* 
         Cualquier petición que empiece con /api 
         Vite la reenviará automáticamente a FastAPI 
      */
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/static': 'http://127.0.0.1:8000'
    }
  }
});