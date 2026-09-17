// apps/web-client/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'nav-breakpoint': '1166px',
        'tablet-breakpoint': '858px',
        'desktop-breakpoint': '1008px'
      },
      colors: {
        vete: {
          /* Colores de Marca y Acento */
          primary: 'rgb(var(--vete-primary) / <alpha-value>)',
          'primary-hover': 'rgb(var(--vete-primary-hover) / <alpha-value>)',
          secondary: 'rgb(var(--vete-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--vete-tertiary) / <alpha-value>)',

          /* Fondos Estructurales */
          dark: 'rgb(var(--vete-dark) / <alpha-value>)',
          surface: 'rgb(var(--vete-surface) / <alpha-value>)',
          soft: 'rgb(var(--vete-soft) / <alpha-value>)',
          overlay: 'rgb(var(--vete-overlay) / <alpha-value>)',

          /* Textos y Bordes */
          'text-base': 'rgb(var(--vete-text-base) / <alpha-value>)',
          'text-muted': 'rgb(var(--vete-text-muted) / <alpha-value>)',
          'border-subtle': 'rgb(var(--vete-border-subtle) / <alpha-value>)',
          error: 'rgb(var(--vete-error) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'vete-h1': ['72px', { lineHeight: '1.1' }],
        'vete-h2': ['36px', { lineHeight: '1.2' }],
        'vete-h3': ['24px', { lineHeight: '1.3' }],
        'vete-body': ['18px', { lineHeight: '29.25px' }],
        'vete-small': ['14px', { lineHeight: '20px' }]
      }
    }
  },
  plugins: []
}