// app/vet-core/apps/web-client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Creamos un punto de quiebre justo en 858px
        'desktop-vete': '1008px',
        'tablet-vete': '858px'
      },
      colors: {
        vete: {
          // Por lo que se es para el menu cartel de la web
          bg: 'rgb(var(--vete-bg) / <alpha-value>)',
          // Colores para la web
          primary: 'rgb(var(--vete-primary) / <alpha-value>)',
          secondary: 'rgb(var(--vete-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--vete-tertiary) / <alpha-value>)',
          dark:'rgb(var(--vete-dark) / <alpha-value>)',

          soft: 'rgb(var(--vete-soft) / <alpha-value>)',

          'text-light': 'rgb(var(--vete-text-light) / <alpha-value>)',
          error: 'rgb(var(--vete-error) / <alpha-value>)',
          'card-white': 'rgb(var(--vete-card-white) / <alpha-value>)',

          // --- COLORES AGREGADOS PARA ESTA REFECTORIZACIÓN ---
          'dark-green': 'rgb(var(--vete-dark-green) / <alpha-value>)', // Para reemplazar bg-emerald-900 (Verde oscuro institucional)
          'dark-green-hover': 'rgb(var(--vete-dark-green-hover) / <alpha-value>)', // Para hover de dark-green (Ligeramente más oscuro)
          'text-muted': 'rgb(var(--vete-text-muted) / <alpha-value>)', // Para reemplazar text-slate-400 y text-slate-500 (Gris para textos secundarios)
          'overlay': 'rgb(var(--vete-overlay) / <alpha-value>)', // Para reemplazar bg-slate-900 (Fondo de overlay)
          'light-border': 'rgb(var(--vete-light-border) / <alpha-value>)', // Para reemplazar border-slate-100 (Borde muy sutil)
          'light-bg-hover': 'rgb(var(--vete-light-bg-hover) / <alpha-value>)', // Para hover de elementos claros (Similar a emerald-50)
        }
      },
      // AQUÍ TRASLADAMOS FIGMA A TAILWIND (Debe estar DENTRO de extend):
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Formato:['font-size', { lineHeight: 'line-height' }]
        'vete-h1':['72px', { lineHeight: '1.1' }],        // Título principal
        'vete-h2':['36px', { lineHeight: '1.2' }],        // Subtítulos
        'vete-h3':['24px', { lineHeight: '1.3' }],        // Títulos de tarjetas
        'vete-body': ['18px', { lineHeight: '29.25px' }],  // El párrafo de tu captura
        'vete-small': ['14px', { lineHeight: '20px' }]    // Textos chicos
      }
    }
  },
  plugins: []
}