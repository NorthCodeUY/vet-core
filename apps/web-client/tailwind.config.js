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
          // Paleta 2
          //\dark: '#1b4332', //Color Fonod

          // Por lo que se es para el menu cartel de la web
          bg: '#000000', // <!> Esto croe que no va no se donde ase algo 
          // Colores para la web
          primary: '#275D9E',    // Verde claro (Ahora es azul según tu hex)
          secondary: '#DBECD5',  // Color Secundario para mesclar 
          tertiary: '#1FAF38',   // Color Boton Whatsap Verde
          dark:'#FDFDF1',        // Color fondo (Ahora es verde fuerte)
          soft: '#76a165ff', // Fondo tarjetas
          accent: '#914122',     // Marrón footer
          'text-light': '#000000' // La malloria de texto
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