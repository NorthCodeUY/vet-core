// apps/web-client/src/pages/landing/sessions/HeroSession/HeroSectionV2.tsx

/* =============================================================================
   COMPONENTE: HERO VARIANTE 2 INVERTIDO (Imagen a la Izquierda / Texto a la Derecha)
   ============================================================================= */

import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { useConfig } from '../../../../context/tenant_context';

/**
 * Propiedades del componente `HeroSessionV2`.
 * 
 * @interface HeroSessionV2Props
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el fondo exterior.
 */
export interface HeroSessionV2Props {
  bgColor?: string;
}

/**
 * Portada editorial invertida (`HeroSessionV2`).
 * 
 * Despliega la imagen institucional a la izquierda (o arriba en móviles) y el bloque
 * de textos con llamada directa a la acción a la derecha (abajo en móviles).
 * Soporta títulos gráficos vectoriales en SVG o tipografía masiva en HTML.
 *
 * @component
 * @param {HeroSessionV2Props} props - Propiedades de configuración visual.
 * @returns {JSX.Element} Sección Hero con disposición invertida.
 */
export const HeroSessionV2: React.FC<HeroSessionV2Props> = ({ bgColor = 'bg-transparent' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();
  const heroData = config?.hero;

  /* ---------------------------------------------------------------------------
     2. MANEJADOR DE WHATSAPP DIRECTO
     --------------------------------------------------------------------------- */
  const phone = config?.contact?.admin_phone || '';
  const cleanPhone = phone.replace(/\D/g, '');

  const handleBookingClick = () => {
    const msg = `¡Hola ${config?.business_name || ''}! Me gustaría coordinar un turno.`;
    window.open(`https://wa.me/598${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="HeroSession"
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para elementos flotantes */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        overflow-hidden              /* Contiene sombras y halos */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        min-h-[85vh]                 /* Altura de impacto visual */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico recibido por props */
      `}
    >
      <div
        className={`
          /* --- Posición --- */
          relative                   /* Contexto para z-index */
          z-10                       /* Por encima de fondos */
          flex                       /* Layout flexible */
          flex-col                   /* Columna en móvil (Imagen arriba, texto abajo) */
          lg:flex-row                /* Fila en escritorio (Imagen izquierda, texto derecha) */
          items-center               /* Centrado vertical */
          justify-between            /* Distribución a los extremos */
          mx-auto                    /* Centrado horizontal automático */

          /* --- Dimensiones --- */
          max-w-[1400px]             /* Límite de ancho para monitores amplios */
          w-full                     /* Ocupa el ancho disponible */
          px-6                       /* Padding lateral móvil */
          md:px-16                   /* Padding lateral escritorio */
          py-16                      /* Espaciado vertical */
          gap-12                     /* Separación uniforme entre columnas */

        `}
      >
        {/* ===================================================================
           1. COLUMNA DE IMAGEN (Izquierda en PC / Arriba en Celular)
           =================================================================== */}
        <div
          className={`
            /* --- Posición --- */
            relative                 /* Contexto interno para el resplandor */
            flex                     /* Centrado flexbox */
            items-center             /* Centrado vertical */
            justify-center           /* Centrado en móvil */
            lg:justify-start         /* Pegado a la izquierda en escritorio */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo en móvil */
            lg:w-1/2                 /* 50% del ancho en escritorio */

          `}
        >
          {/* Marco Editorial de la Imagen */}
          <div
            className={`
              /* --- Posición --- */
              relative               /* Contexto */

              /* --- Dimensiones --- */
              w-full                 /* Ancho adaptativo */
              max-w-[340px]          /* Tamaño controlado en móvil */
              sm:max-w-[420px]       /* Tamaño en tablets */
              lg:max-w-[620px]       /* Gran escala en escritorio */
              h-auto                 /* Proporcional */

              /* --- Estilo --- */
              overflow-hidden        /* Contiene la imagen */

            `}
          >
            <img
              src="/tenant/hero.png"
              alt={`Portada ${config?.business_name || 'Comercio'}`}
              className={`

                /* --- Dimensiones --- */
                w-full               /* Ocupa todo el marco */
                h-auto               /* Altura automática */
                max-h-[750px]        /* Límite de altura */

                /* --- Estilo --- */
                object-cover         /* Sin deformación */

                /* --- Animación --- */
                hover:scale-105      /* Zoom sutil al pasar el cursor */
                transition-transform /* Transición fluida */
                duration-500         /* 500ms */
              `}
            />
          </div>

          {/* Resplandor Neón Decorativo de Fondo */}
          <div
            className={`
              /* --- Posición --- */
              absolute               /* Flotante */
              -bottom-6              /* Posición inferior */
              -left-6                /* Posición izquierda */
              z-[-1]                 /* Detrás de la imagen */

              /* --- Dimensiones --- */
              w-64                   /* Ancho de 16rem */
              h-64                   /* Alto de 16rem */

              /* --- Colores --- */
              bg-vete-primary/20     /* Color de resplandor de marca */

              /* --- Estilo --- */
              rounded-full           /* Círculo */
              blur-3xl               /* Difuminado suave */

              /* --- Animación --- */
            `}
          />
        </div>

        {/* ===================================================================
           2. COLUMNA DE TEXTOS Y BOTÓN (Derecha en PC / Abajo en Celular)
           =================================================================== */}
         <div
          className={`
            /* --- Posición --- */
            relative                 /* Contexto z-index */
            z-30                     /* CAPA SUPERIOR: Por encima de la animación */
            flex                     /* Layout flexible */
            flex-col                 /* Disposición vertical */
            items-center             /* Centrado en móvil */
            lg:items-start           /* A la izquierda en escritorio */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo móvil */
            lg:w-1/2                 /* 50% en escritorio */
            max-w-xl                 /* Límite de ancho para no desbordar */
            gap-6                    /* Separación vertical */

            /* --- Colores --- */

            /* --- Texto --- */
            text-center              /* Centrado en móvil */
            lg:text-left             /* Izquierda en desktop */

            /* --- Animación --- */
          `}>   

          {/* Título: Soporta Imagen SVG o Texto con Formato HTML */}

          {heroData?.title_image_url ? (
            <img
              src={heroData.title_image_url}
              alt={config?.business_name || 'Título'}
              className={`
                /* --- Posición --- */

                /* --- Dimensiones --- */
                w-full               /* Ancho adaptativo */
                max-w-md             /* Límite de ancho */
                h-auto               /* Mantiene proporción */
                mb-2                 /* Margen inferior */

                /* --- Colores --- */
                filter               /* Habilita filtros */
                drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] /* Sombra negra que separa el título del fondo */

                /* --- Estilo --- */
                object-contain       /* Ajuste proporcional */

                /* --- Animación --- */
              `}
            />
          ) : (

            <h1
              dangerouslySetInnerHTML={{
                __html:
                  heroData?.title_html ||
                  'Cuidamos <span class="text-vete-primary">a quienes</span> amas',
              }}
              className={`
                /* --- Posición --- */

                /* --- Dimensiones --- */
                mb-2                 /* Margen inferior */

                /* --- Colores --- */
                text-vete-text-base  /* Color tipográfico principal */

                /* --- Texto --- */
                text-4xl             /* Tamaño móvil */
                sm:text-6xl          /* Tamaño intermedio */
                lg:text-7xl          /* Tamaño gigante en escritorio */
                font-black           /* Grosor 900 */
                leading-[0.98]       /* Altura de línea compacta */
                tracking-tight       /* Espaciado cerrado */

                /* --- Animación --- */
              `}
            />
          )}

          {/* Bajada Descriptiva */}
{/* Bajada Descriptiva con Fondo Compacto (Sin cortes en letras descendentes) */}
          <p
            className={`
              /* --- Posición --- */

              /* --- Dimensiones --- */
              w-fit                  /* Se ajusta exactamente al ancho del texto */
              max-w-lg               /* Límite cómodo de lectura */
              px-4                   /* Padding horizontal suave */
              py-3                   /* Padding vertical uniforme */

              /* --- Colores --- */
              bg-vete-dark/95        /* TAPA 100% la animación con el fondo del tema */
              text-vete-text-muted   /* Color tipográfico secundario legible */
              shadow-2xl             /* Sombra profunda que despega el texto */

              /* --- Estilo --- */
              rounded-2xl            /* Bordes redondeados continuos */

              /* --- Texto --- */
              text-base              /* Tamaño estándar */
              md:text-lg             /* Tamaño destacado */
              leading-relaxed        /* Altura de línea natural (no corta la 'g' ni la 'p') */
              font-medium            /* Grosor medio (500) */

              /* --- Animación --- */
            `}
          >
            {heroData?.description ||
              'Servicios especializados y atención personalizada diseñados para tu total satisfacción.'}
          </p>





          {/* Botonera de Acción */}
          <div
            className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              items-center           /* Centrado vertical */

              /* --- Dimensiones --- */
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
                gap-3                /* Espacio icono-texto */

                /* --- Dimensiones --- */
                px-8                 /* Padding horizontal amplio */
                py-4                 /* Padding vertical cómodo */

                /* --- Colores --- */
                bg-vete-primary      /* Fondo de marca */
                hover:bg-vete-primary-hover /* Oscurecimiento en hover */
                text-white           /* Texto blanco en contraste */
                shadow-xl            /* Sombra profunda */
                shadow-vete-primary/25 /* Resplandor institucional */

                /* --- Texto --- */
                text-xs              /* Tamaño compacto */
                font-black           /* Grosor 900 */
                uppercase            /* Mayúsculas */
                tracking-wider       /* Espaciado de letras */

                /* --- Estilo --- */
                rounded-2xl          /* Bordes redondeados */

                /* --- Animación --- */
                transition-all       /* Transición suave */
                duration-200         /* 200ms */
                hover:scale-105      /* Elevación sutil */
                active:scale-95      /* Pulsación táctil */
              `}
            >
              <Calendar size={18} />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSessionV2;