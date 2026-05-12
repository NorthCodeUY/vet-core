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
          bg: 'rgb(var(--vete-bg) / <alpha-value>)', // <!> Esto croe que no va no se donde ase algo 
          // Colores para la web
          primary: 'rgb(var(--vete-primary) / <alpha-value>)',    // Color Azul Esta en varios lados  
          secondary: 'rgb(var(--vete-secondary) / <alpha-value>)',  // Color Secundario para mesclar 
          tertiary: 'rgb(var(--vete-tertiary) / <alpha-value>)',   // Color Boton Whatsap Verde
          dark:'rgb(var(--vete-dark) / <alpha-value>)',        // Color fondo Verde claro 

          soft: 'rgb(var(--vete-soft) / <alpha-value>)', // Fondo tarjetas 'var(--vete-soft)'

          'text-light': 'rgb(var(--vete-text-light) / <alpha-value>)', // La malloria de texto
          error: 'rgb(var(--vete-error) / <alpha-value>)',
          'vete-card-white': 'rgb(var(--vete-card-white) / <alpha-value>)', // Blanco puro para la tarjeta
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
    } // <--- Cierra extend
  }, // <--- Cierra theme
  plugins: []
} // <--- Cierra export default







  