/* =============================================================================
   PÁGINA: VISTA DE MANTENIMIENTO Y PRÓXIMAMENTE (MaintenancePage)
   ============================================================================= */

import React from 'react';
import LottieModule from 'lottie-react';
import maintenanceAnimation from '../../assets/animations/maintenance.json';
import { useConfig } from '../../context/tenant_context';

/**
 * Normalización de compatibilidad ESM / CommonJS para React 19 y Vite.
 */
const Lottie = (LottieModule as unknown as { default: typeof LottieModule }).default || LottieModule;

/**
 * Página de Mantenimiento y Próximo Lanzamiento (`MaintenancePage`).
 * 
 * Se renderiza en la ruta raíz (`/`) mientras el sitio web del cliente está en construcción.
 * Despliega una animación vectorial fluida con Lottie, identifica dinámicamente el nombre
 * del comercio desde `useConfig()` y mantiene los créditos de infraestructura institucional.
 *
 * @component
 * @returns {JSX.Element} Vista de pantalla completa para estado de mantenimiento.
 */
export default function MaintenancePage(): React.JSX.Element {
  const { config } = useConfig();

  return (
    <main
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para el footer absoluto */
        flex                         /* Layout flexible */
        flex-col                     /* Disposición en columna */
        items-center                 /* Centrado horizontal */
        justify-center               /* Centrado vertical */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        h-screen                     /* Altura total de la ventana gráfica */
        p-6                          /* Padding perimetral */

        /* --- Colores --- */
        bg-[#121212]                 /* Fondo oscuro neutro para resaltar animación */
        text-white                   /* Color de texto base */

        /* --- Texto --- */

        /* --- Animación --- */
      `}
    >
      {/* ===================================================================
         CONTENEDOR CENTRAL: Animación Lottie y Mensaje de Estado
         =================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex                       /* Layout flexible */
          flex-col                   /* Disposición vertical */
          items-center               /* Centrado horizontal */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          max-w-md                   /* Límite de ancho para no desbordar */
          gap-6                      /* Separación entre animación y texto */

          /* --- Colores --- */

          /* --- Texto --- */
          text-center                /* Texto centrado */

          /* --- Animación --- */
          transition-all             /* Transición fluida */
          duration-500               /* 500ms */
          ease-in-out                /* Curva de aceleración suave */
        `}
      >
        {/* Reproductor de Animación Vectorial */}
        <div
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */
            w-full                   /* Ancho total del contenedor */
            h-auto                   /* Altura proporcional */

            /* --- Colores --- */
            filter                   /* Habilita filtros CSS */
            drop-shadow-2xl          /* Sombra profunda para dar relieve */

            /* --- Texto --- */

            /* --- Animación --- */
          `}
        >
          <Lottie
            animationData={maintenanceAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-auto"
          />
        </div>

        {/* Mensaje Informativo para Clientes */}
        <div
          className={`
            /* --- Posición --- */
            flex                     /* Layout flexible */
            flex-col                 /* Disposición en columna */
            gap-2                    /* Separación título-párrafo */

            /* --- Colores --- */

            /* --- Texto --- */

            /* --- Animación --- */
          `}
        >
          <h1
            className={`
              /* --- Posición --- */

              /* --- Dimensiones --- */

              /* --- Colores --- */
              text-vete-primary      /* Color principal del cliente */

              /* --- Texto --- */
              text-2xl               /* Tamaño destacado */
              font-black             /* Grosor 900 */
              uppercase              /* Mayúsculas */
              tracking-wider         /* Espaciado de letras */

              /* --- Animación --- */
            `}
          >
            {config?.business_name || 'Sitio Web en Construcción'}
          </h1>

          <p
            className={`
              /* --- Posición --- */

              /* --- Dimensiones --- */
              max-w-sm               /* Ancho de lectura óptimo */

              /* --- Colores --- */
              text-slate-400         /* Color secundario atenuado */

              /* --- Texto --- */
              text-xs                /* Tamaño compacto */
              leading-relaxed        /* Altura de línea cómoda */

              /* --- Animación --- */
            `}
          >
            Estamos preparando una nueva experiencia digital. Muy pronto podrás acceder a todos nuestros servicios y catálogo online.
          </p>
        </div>
      </div>

      {/* ===================================================================
         PIE DE PÁGINA: Créditos Institucionales de Infraestructura
         =================================================================== */}
      <footer
        className={`
          /* --- Posición --- */
          absolute                   /* Anclado al fondo */
          bottom-8                   /* Separación inferior */

          /* --- Dimensiones --- */

          /* --- Colores --- */

          /* --- Texto --- */
          text-center                /* Texto centrado */

          /* --- Animación --- */
        `}
      >
        <p
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */

            /* --- Colores --- */
            text-white/30            /* Color con transparencia sutil */

            /* --- Texto --- */
            text-[10px]              /* Tamaño micro */
            font-bold                /* Grosor 700 */
            tracking-[0.35em]        /* Espaciado extendido editorial */
            uppercase                /* Mayúsculas */

            /* --- Animación --- */
          `}
        >
          Infraestructura por NorthCode
        </p>
      </footer>
    </main>
  );
}