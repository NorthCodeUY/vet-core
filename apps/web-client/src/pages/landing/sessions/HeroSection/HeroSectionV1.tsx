/* --- apps/web-client/src/pages/landing/sessions/HeroSession.tsx --- */

/* =============================================================================
   COMPONENTE: SECCIÓN HERO Y MODAL INSTITUCIONAL (HeroSessionV1)
   ============================================================================= */

import React, { useState } from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { useConfig } from '../../../../context/tenant_context';      
import { AboutSection } from '../AboutSection';

/**
 * Propiedades del componente `HeroSessionV1`.
 * 
 * @interface HeroSessionV1Props
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el color de fondo exterior.
 */
export interface HeroSessionV1Props {
  bgColor?: string;
}

/**
 * Portada principal institucional de la plataforma (`HeroSessionV1`).
 * 
 * Despliega el encabezado de alto impacto con palabras clave resaltadas,
 * la imagen representativa del cliente dentro de un marco editorial y un botón
 * de llamada a la acción ("Conózcanos") que abre un modal con la información
 * institucional (Misión, Visión, Valores) sin saturar la vista principal.
 *
 * @component
 * @param {HeroSessionV1Props} props - Propiedades de configuración visual.
 * @returns {JSX.Element} Sección Hero con modal institucional interactivo.
 */
export const HeroSessionV1: React.FC<HeroSessionV1Props> = ({ bgColor = 'bg-transparent' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();
  const heroData = config?.hero;

  /* ---------------------------------------------------------------------------
     2. ESTADO LOCAL: Modal Institucional (Sobre Nosotros)
     --------------------------------------------------------------------------- */
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  return (
    <>
      {/* =====================================================================
         SECCIÓN PRINCIPAL HERO (2 Columnas)
         ===================================================================== */}
      <section className={`
        /* --- Posición --- */
        relative                     /* Contexto para elementos flotantes y halos */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical del contenido */
        overflow-hidden              /* Evita desbordamiento de sombras */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        min-h-[80vh]                 /* Altura mínima de impacto */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico por propiedad */

      `}>
        <div className={`
          /* --- Posición --- */
          relative                   /* Contexto para z-index */
          z-10                       /* Por encima de posibles fondos decorativos */
          flex                       /* Layout flexible */
          flex-col                   /* Columna en dispositivos móviles */
          lg:flex-row                /* Fila en pantallas grandes */
          items-center               /* Centrado vertical de las columnas */
          justify-between            /* Distribución a los extremos */
          mx-auto                    /* Centrado horizontal automático */

          /* --- Dimensiones --- */
          max-w-[1400px]             /* Ancho máximo contenido */
          w-full                     /* Ancho completo */
          px-6                       /* Padding lateral móvil */
          md:px-16                   /* Padding lateral escritorio */
          py-16                      /* Espaciado vertical */
          gap-12                     /* Separación entre texto e imagen */
        `}>
          {/* COLUMNA IZQUIERDA: Textos y Botonera */}
          <div className={`
            /* --- Posición --- */
            flex                     /* Layout flexible */
            flex-col                 /* Disposición en columna */
            items-center             /* Centrado en dispositivos móviles */
            lg:items-start           /* Alineado a la izquierda en escritorio */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo en móvil */
            lg:w-1/2                 /* 50% de ancho en pantallas grandes */

            /* --- Texto --- */
            text-center              /* Texto centrado en móvil */
            lg:text-left             /* Texto a la izquierda en escritorio */

          `}>
            {/* Título Principal Dinámico con Soporte HTML */}
            <h1
              dangerouslySetInnerHTML={{
                __html:
                  heroData?.title_html ||
                  '<!> No entro - Cuidamos <span class="text-vete-primary">a</span><br />quienes <span class="text-vete-primary">amas</span>',
              }}
              className={`

                /* --- Dimensiones --- */
                mb-8                 /* Margen inferior */

                /* --- Colores --- */
                text-vete-text-base  /* Color tipográfico principal */

                /* --- Texto --- */
                text-4xl             /* Tamaño móvil */
                md:text-6xl          /* Tamaño intermedio */
                lg:text-7xl          /* Tamaño gigante en escritorio */
                font-black           /* Grosor 900 */
                leading-[0.95]       /* Altura de línea compacta */
                tracking-tighter     /* Espaciado de letras ajustado */

              `}
            />

            {/* Bajada Descriptiva */}
            <p className={`

              /* --- Dimensiones --- */
              max-w-xl               /* Ancho óptimo de lectura */

              /* --- Colores --- */
              text-vete-text-muted   /* Color tipográfico atenuado */

              /* --- Texto --- */
              text-lg                /* Tamaño estándar */
              md:text-xl             /* Tamaño destacado en escritorio */
              leading-relaxed        /* Altura de línea cómoda */
              font-medium            /* Grosor medio (500) */

            `}>
              {heroData?.description ||
                '<!> No entro - Tu mascota merece la mejor atención médica en un ambiente cálido y profesional. Contamos con especialistas comprometidos con el bienestar integral de tus compañeros.'}
            </p>

            {/* Botonera de Acción: "Conózcanos" */}
            <div className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              items-center           /* Centrado vertical */

              /* --- Dimensiones --- */
              mt-10                  /* Margen superior */
            `}>
              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className={`
                  /* --- Posición --- */
                  flex               /* Flexbox */
                  items-center       /* Centrado vertical */
                  gap-2.5            /* Espacio icono-texto */

                  /* --- Dimensiones --- */
                  px-8               /* Padding horizontal amplio */
                  py-4               /* Padding vertical cómodo */

                  /* --- Colores --- */
                  bg-vete-primary    /* Fondo de color de marca */
                  text-white         /* Texto blanco */
                  shadow-xl          /* Sombra de relieve */
                  shadow-vete-primary/20 /* Resplandor institucional */

                  /* --- Texto --- */
                  text-sm            /* Tamaño de texto */
                  font-bold          /* Grosor 700 */
                  uppercase          /* Mayúsculas */
                  tracking-wider     /* Espaciado de letras */

                  /* --- Estilo --- */
                  rounded-2xl        /* Bordes redondeados */

                  /* --- Animación --- */
                  transition-all     /* Transición suave */
                  duration-200       /* Tiempo de 200ms */
                  hover:scale-105    /* Elevación sutil en hover */
                  hover:bg-vete-primary-hover /* Oscurecimiento en hover */
                  active:scale-95    /* Pulsación táctil */
                `}
              >
                <BookOpen size={18} />
                <span>Conózcanos</span>
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Marco de Imagen Institucional */}
          <div className={`
            /* --- Posición --- */
            hidden                   /* Oculto en móviles */
            lg:flex                  /* Visible en escritorio */
            justify-end              /* Alineado a la derecha */
            relative                 /* Contenedor relativo */

            /* --- Dimensiones --- */
            w-full                   /* Ancho total móvil */
            lg:w-1/2                 /* 50% en escritorio */
          `}>
            <img
              src="/tenant/hero.png"
              alt={`Portada ${config?.business_name || 'Veterinaria'}`}
              className={`
                /* --- Dimensiones --- */
                w-full               /* Ocupa el ancho disponible */
                max-w-[650px]        /* Límite máximo de ancho */
                h-auto               /* Mantiene aspect ratio */
                max-h-[800px]        /* Altura máxima */

                /* --- Colores --- */
                border-[12px]        /* Marco grueso */
                border-white/20      /* Color de marco traslúcido */
                shadow-2xl           /* Sombra profunda */

                /* --- Estilo --- */
                rounded-[4rem]       /* Bordes muy redondeados */
                object-cover         /* Ajuste proporcional */

              `}
            />

            {/* Elemento decorativo de brillo trasero */}
            <div className={`
              /* --- Posición --- */
              absolute               /* Flotante */
              -bottom-6              /* Posición inferior */
              -left-6                /* Posición izquierda */
              z-[-1]                 /* Detrás de la imagen */

              /* --- Dimensiones --- */
              w-64                   /* Ancho de 16rem */
              h-64                   /* Alto de 16rem */

              /* --- Colores --- */
              bg-vete-primary/20     /* Color de resplandor */

              /* --- Estilo --- */
              rounded-full           /* Círculo */
              blur-3xl               /* Difuminado suave */

            `} />
          </div>
        </div>
      </section>

      {/* =====================================================================
         MODAL / DRAWER INSTITUCIONAL: INFORMACIÓN DE LA EMPRESA (AboutSection)
         ===================================================================== */}
      {isAboutOpen && (
        <div className={`
          /* --- Posición --- */
          fixed                      /* Fijo sobre toda la ventana */
          inset-0                    /* Ocupa el 100% de la pantalla */
          z-[999]                    /* Capa superior absoluta por encima del Navbar */
          flex                       /* Layout flexible */
          items-center               /* Centrado vertical */
          justify-center             /* Centrado horizontal */
          p-4                        /* Padding exterior en móvil */
          md:p-8                     /* Padding en escritorio */

          /* --- Colores --- */
          bg-vete-overlay/80         /* Backdrop oscuro con opacidad */
          backdrop-blur-md           /* Desenfoque de fondo */

          /* --- Animación --- */
          animate-in                 /* Entrada animada */
          fade-in                    /* Desvanecimiento */
          duration-200               /* 200ms */
        `}>
          {/* Fondo clickeable para cerrar al hacer clic afuera */}
          <div 
            className="absolute inset-0 z-0" 
            onClick={() => setIsAboutOpen(false)} 
          />

          {/* Diálogo Central */}
          <div className={`
            /* --- Posición --- */
            relative                 /* Contexto interno */
            z-10                     /* Por encima del backdrop */
            flex                     /* Flexbox */
            flex-col                 /* Disposición vertical */
            overflow-hidden          /* Contiene el scroll interno */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo */
            max-w-5xl                /* Límite máximo */
            h-full                   /* Altura adaptativa */
            max-h-[85vh]             /* 85% del alto de la ventana */

            /* --- Colores --- */
            bg-vete-surface          /* Fondo de tarjeta blanco/claro */
            border                   /* Borde habilitado */
            border-vete-border-subtle /* Borde suave */
            shadow-2xl               /* Sombra profunda */

            /* --- Estilo --- */
            rounded-3xl              /* Bordes redondeados */

            /* --- Animación --- */
            zoom-in-95               /* Entrada con zoom sutil */
          `}>
            {/* BARRA SUPERIOR FIJA (Nunca se oculta ni se comprime) */}
            <div className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              items-center           /* Centrado vertical */
              justify-between        /* Distribución a los extremos */
              shrink-0               /* OBLIGATORIO: Evita que el scroll la aplaste */
              z-30                   /* Por encima del contenido */

              /* --- Dimensiones --- */
              w-full                 /* Ancho total */
              px-6                   /* Padding horizontal */
              py-4                   /* Padding vertical */

              /* --- Colores --- */
              bg-vete-surface        /* Fondo sólido para que no se trasluzca el texto */
              border-b               /* Línea divisoria */
              border-vete-border-subtle /* Color de borde suave */
              shadow-sm              /* Sombra sutil */

            `}>
               {/*  */}
              <div className="
               flex 
               items-center 
               gap-2
               ">
                <Sparkles size={18} className="text-vete-primary" />
                <span className={`
                  /* --- Texto --- */
                  text-sm            /* Tamaño estándar */
                  font-black         /* Grosor 900 */
                  uppercase          /* Mayúsculas */
                  tracking-wider     /* Espaciado */
                  text-vete-text-base /* Color de lectura */
                `}>
                  Sobre Nosotros — {config?.business_name}
                </span>
              </div>

              {/* Botón de Cierre Destacado */}
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                className={`
                  /* --- Posición --- */
                  flex               /* Flexbox */
                  items-center       /* Centrado */
                  justify-center     /* Centrado */

                  /* --- Dimensiones --- */
                  p-2.5              /* Padding táctil */

                  /* --- Colores --- */
                  bg-vete-soft       /* Fondo suave institucional */
                  text-vete-text-base /* Icono oscuro */
                  hover:bg-vete-error /* Pasa a rojo en hover */
                  hover:text-white   /* Icono pasa a blanco */

                  /* --- Estilo --- */
                  rounded-full       /* Botón circular */

                  /* --- Animación --- */
                  transition-all     /* Transición fluida */
                  duration-200       /* 200ms */
                  hover:scale-110    /* Aumento sutil al pasar el mouse */
                  active:scale-95    /* Pulsación */
                `}
                title="Cerrar ventana"
                aria-label="Cerrar ventana"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* CONTENIDO CON SCROLL INTERNO */}
            <div className={`
              /* --- Posición --- */
              flex-1                 /* Toma todo el alto restante */
              overflow-y-auto        /* Activa scroll vertical */

              /* --- Dimensiones --- */
              p-6                    /* Padding interno móvil */
              md:p-10                /* Padding interno desktop */


            `}>
              <AboutSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSessionV1;