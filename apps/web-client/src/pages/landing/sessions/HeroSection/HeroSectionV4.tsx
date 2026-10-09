// app/vet-core/apps/web-client/src/pages/landing/sessions/HeroSection/HeroSectionV4.tsx

/* =============================================================================
   COMPONENTE: HERO VARIANTE 4 CON VIDEO 3D TRANSPARENTE (HeroSessionV4)
   ============================================================================= */

import React from 'react';
import { Calendar, Sparkles, MessageCircle, Star } from 'lucide-react';
import { useConfig } from '../../../../context/tenant_context';

/**
 * Propiedades del componente `HeroSessionV4`.
 * 
 * @interface HeroSessionV4Props
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el fondo exterior.
 */
export interface HeroSessionV4Props {
  bgColor?: string;
}

/**
 * Portada principal con reproductor de video 3D transparente en bucle continuo (`HeroSessionV4`).
 * 
 * Diseñada para cargar secuencias fotorrealistas renderizadas desde Blender o WebM
 * sin saturar la memoria RAM del navegador, sincronizada con la paleta semántica del tenant.
 *
 * @component
 * @param {HeroSessionV4Props} props - Propiedades de configuración visual.
 * @returns {JSX.Element} Portada con video 3D de alto impacto y llamada a la acción.
 */
export const HeroSessionV4: React.FC<HeroSessionV4Props> = ({ bgColor = 'bg-transparent' }) => {
  const { config } = useConfig();
  const heroData = config?.hero;

  /* 1. Teléfono dinámico de recepción de turnos */
  const phone = config?.contact?.admin_phone || '';
  const cleanPhone = phone.replace(/\D/g, '');

  const handleBookingClick = () => {
    const msg = `¡Hola ${config?.business_name || ''}! Vi la web y me gustaría coordinar un turno.`;
    window.open(`https://wa.me/598${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="HeroSession"
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para halos de luz */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */
        overflow-hidden              /* Evita desbordamiento de sombras */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        min-h-[90vh]                 /* Altura de impacto visual */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral escritorio */
        py-12                        /* Padding vertical */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico por props */
      `}
    >
      {/* Resplandor Neón de Fondo (Luz que proyecta el objeto 3D) */}
      <div
        className={`
          /* --- Posición --- */
          absolute                   /* Flotante detrás */
          top-1/2                    /* Centrado vertical */
          right-12                   /* Pegado a la derecha */
          -translate-y-1/2           /* Ajuste fino de eje */

          /* --- Dimensiones --- */
          w-[550px]                  /* Diámetro de 550px */
          h-[550px]                  /* Diámetro de 550px */

          /* --- Colores --- */
          bg-vete-primary/25         /* Resplandor con el color primario del cliente */

          /* --- Estilo --- */
          rounded-full               /* Círculo */
          blur-[140px]               /* Difuminado extremo */
          pointer-events-none        /* No bloquea clics */

          /* --- Animación --- */
          animate-pulse              /* Pulso suave */
        `}
      />

      <div
        className={`
          /* --- Posición --- */
          relative                   /* Capa sobre el resplandor */
          z-10                       /* Por encima del fondo */
          flex                       /* Layout flexible */
          flex-col                   /* Columna en móvil */
          lg:flex-row                /* Fila en pantallas grandes */
          items-center               /* Centrado vertical */
          justify-between            /* Extremos */
          mx-auto                    /* Centrado horizontal */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          max-w-[1400px]             /* Límite de ancho */
          gap-8                      /* Separación entre columnas */
        `}
      >
        {/* ===================================================================
           COLUMNA IZQUIERDA: Título, Descripción y Botonera
           =================================================================== */}
        <div
          className={`
            /* --- Posición --- */
            flex                     /* Layout flexible */
            flex-col                 /* Disposición vertical */
            items-center             /* Centrado en móvil */
            lg:items-start           /* Alineado a la izquierda en desktop */

            /* --- Dimensiones --- */
            w-full                   /* Ancho total móvil */
            lg:w-1/2                 /* 50% en escritorio */
            gap-6                    /* Separación vertical */

            /* --- Texto --- */
            text-center              /* Centrado en móvil */
            lg:text-left             /* Izquierda en desktop */
          `}
        >

          {/* Título: Soporta Imagen SVG o Texto con Formato HTML */}
          {heroData?.title_image_url ? (
            <img
              src={heroData.title_image_url}
              alt={config?.business_name || 'Título'}
              className="w-full max-w-md h-auto mb-4"
            />
          ) : (
            <h1
              dangerouslySetInnerHTML={{
                __html:
                  heroData?.title_html ||
                  '<span class="text-vete-primary">Estilo</span> y <span class="text-vete-primary">carácter</span>',
              }}
              className={`
                /* --- Colores --- */
                text-vete-text-base  /* Color tipográfico principal */

                /* --- Texto --- */
                text-4xl             /* Tamaño móvil */
                sm:text-6xl          /* Tamaño intermedio */
                lg:text-7xl          /* Tamaño gigante desktop */
                font-black           /* Grosor 900 */
                leading-[0.98]       /* Altura de línea compacta */
                tracking-tight       /* Espaciado cerrado */

              `}
            />
          )}

          {/* Descripción */}
          <p
            className={`

              /* --- Dimensiones --- */
              max-w-xl               /* Límite de ancho */

              /* --- Colores --- */
              text-vete-text-muted   /* Color atenuado */

              /* --- Texto --- */
              text-base              /* Tamaño estándar */
              md:text-xl             /* Tamaño destacado */
              leading-relaxed        /* Altura de línea fluida */
              font-normal            /* Grosor regular */
            `}
          >
            {heroData?.description ||
              'Servicios especializados y atención personalizada diseñados para tu estilo.'}
          </p>

          {/* Botonera de Acción */}
          <div
            className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              flex-col               /* Columna en móvil */
              sm:flex-row            /* Fila en pantallas grandes */
              items-center           /* Centrado */

              /* --- Dimensiones --- */
              w-full                 /* Ancho total */
              gap-4                  /* Separación */
              pt-2                   /* Margen superior */
            `}
          >
            <button
              type="button"
              onClick={handleBookingClick}
              className={`
                /* --- Posición --- */
                flex                 /* Flexbox */
                items-center         /* Centrado vertical */
                justify-center       /* Centrado horizontal */
                gap-3                /* Espacio icono-texto */

                /* --- Dimensiones --- */
                w-full               /* Ancho total en móvil */
                sm:w-auto            /* Automático en escritorio */
                px-8                 /* Padding horizontal amplio */
                py-4                 /* Padding vertical */

                /* --- Colores --- */
                bg-vete-primary      /* Fondo de marca */
                hover:bg-vete-primary-hover /* Oscurecimiento en hover */
                text-white           /* Texto blanco */
                shadow-xl            /* Sombra profunda */
                shadow-vete-primary/25 /* Resplandor de marca */

                /* --- Texto --- */
                text-xs              /* Tamaño compacto */
                font-black           /* Grosor 900 */
                uppercase            /* Mayúsculas */
                tracking-wider       /* Espaciado */

                /* --- Estilo --- */
                rounded-2xl          /* Bordes redondeados */

                /* --- Animación --- */
                transition-all       /* Transición suave */
                duration-200         /* 200ms */
                hover:scale-105      /* Elevación */
                active:scale-95      /* Pulsación */
              `}
            >
              <Calendar size={18} />
              <span>Agendar Turno</span>
            </button>

          </div>
        </div>

        {/* ===================================================================
           COLUMNA DERECHA: Escenario de Video 3D Transparente a Gran Escala
           =================================================================== */}
        <div
          className={`
            /* --- Posición --- */
            relative                 /* Contenedor relativo */
            flex                     /* Centrado flexbox */
            items-center             /* Centrado vertical */
            justify-center           /* Centrado horizontal */
            lg:justify-end           /* Anclado a la derecha en escritorio */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo móvil */
            lg:w-1/2                 /* 50% en pantallas grandes */
            max-w-[650px]            /* Escala grande */
            h-[550px]                /* Altura vertical amplia */
            lg:h-[650px]             /* Mayor altura en monitores grandes */


          `}
        >
          {/* Video 3D Transparente en Bucle Continuo */}
          <div
            className={`
              /* --- Posición --- */
              relative               /* Contexto interno */
              flex                   /* Centrado */
              items-center           /* Centrado vertical */
              justify-center         /* Centrado horizontal */

              /* --- Dimensiones --- */
              w-full                 /* Ocupa el ancho máximo */
              h-full                 /* Ocupa la altura del contenedor */

              /* --- Colores --- */
              filter                 /* Habilita filtros CSS */
              drop-shadow-[0_0_50px_rgba(210,25,25,0.45)] /* Resplandor neón envolvente */

              /* --- Animación --- */
            `}
          >
            <video
              src="/tenant/barber_pole.webm"
              autoPlay
              loop
              muted
              playsInline
              className={`
                /* --- Posición --- */

                /* --- Dimensiones --- */
                w-full               /* Ancho total */
                h-full               /* Altura total */

                /* --- Estilo --- */
                object-contain       /* Ajuste proporcional perfecto */
                pointer-events-none  /* No interfiere con clics */

                /* --- Animación --- */
              `}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSessionV4;