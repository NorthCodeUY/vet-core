/* =============================================================================
   COMPONENTE: HERO VARIANTE 3 CON ANIMACIÓN MASIVA A LA DERECHA (HeroSessionV3)
   ============================================================================= */

import React, { useState, useEffect } from 'react';
import LottieModule from 'lottie-react';
import { Calendar, Sparkles, MessageCircle, Star } from 'lucide-react';
import { useConfig } from '../../../../context/tenant_context';

/**
 * Fix de compatibilidad para React 19 y Vite.
 */
const Lottie = (LottieModule as unknown as { default: typeof LottieModule }).default || LottieModule;

/**
 * Propiedades del componente `HeroSessionV3`.
 * 
 * @interface HeroSessionV3Props
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el fondo.
 */
export interface HeroSessionV3Props {
  bgColor?: string;
}

/**
 * Portada principal con animación de gran formato anclada a la derecha (`HeroSessionV3`).
 * 
 * @component
 * @param {HeroSessionV3Props} props - Propiedades de configuración visual.
 * @returns {JSX.Element} Portada animada de alta conversión visual.
 */
export const HeroSessionV3: React.FC<HeroSessionV3Props> = ({ bgColor = 'bg-transparent' }) => {
  const { config } = useConfig();
  const heroData = config?.hero;

  /* 1. Carga asíncrona de la animación Lottie */
  const [animationData, setAnimationData] = useState<object | null>(null);
  const animationUrl = config?.branding?.hero_animation_url || '/tenant/animations/hero_animation.json';

  useEffect(() => {
    fetch(animationUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => console.warn('Aviso: Animación no encontrada en:', animationUrl, err));
  }, [animationUrl]);

  /* 2. Manejador de WhatsApp */
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
        overflow-hidden              /* Evita desbordamiento exterior */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        min-h-[88vh]                 /* Altura de impacto visual */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral escritorio */
        py-12                        /* Padding vertical */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico por props */

        /* --- Texto --- */

        /* --- Animación --- */
      `}
    >
      {/* Resplandor Neón de Fondo con el Color Primario */}
      <div
        className={`
          /* --- Posición --- */
          absolute                   /* Flotante detrás */
          top-1/2                    /* Centrado vertical */
          right-10                   /* Pegado a la derecha */
          -translate-y-1/2           /* Ajuste fino de eje */

          /* --- Dimensiones --- */
          w-[600px]                  /* Diámetro de 600px */
          h-[600px]                  /* Diámetro de 600px */

          /* --- Colores --- */
          bg-vete-primary/20         /* Resplandor con el color del cliente */

          /* --- Estilo --- */
          rounded-full               /* Círculo */
          blur-[140px]               /* Difuminado suave */
          pointer-events-none        /* No bloquea clics */

          /* --- Animación --- */
          animate-pulse              /* Pulso sutil */
        `}
      />

      <div
        className={`
          /* --- Posición --- */
          relative                   /* Capa sobre el resplandor */
          z-10                       /* Por encima del fondo */
          flex                       /* Layout flexible */
          flex-col                   /* Columna en móvil */
          lg:flex-row                /* Fila en escritorio */
          items-center               /* Centrado vertical */
          justify-between            /* Extremos */
          mx-auto                    /* Centrado horizontal */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          max-w-[1400px]             /* Límite de ancho para monitores amplios */
          gap-8                      /* Separación entre columnas */

          /* --- Colores --- */

          /* --- Texto --- */

          /* --- Animación --- */
        `}
      >
        {/* ===================================================================
           COLUMNA IZQUIERDA: Título, Descripción y Botones
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

            /* --- Colores --- */

            /* --- Texto --- */
            text-center              /* Centrado en móvil */
            lg:text-left             /* Izquierda en desktop */

            /* --- Animación --- */
          `}
        >
          {/* Badge de Calidad */}
          <div
            className={`
              /* --- Posición --- */
              inline-flex            /* Flex en línea */
              items-center           /* Centrado */
              gap-2                  /* Espaciado icono-texto */

              /* --- Dimensiones --- */
              px-4                   /* Padding horizontal */
              py-1.5                 /* Padding vertical */

              /* --- Colores --- */
              bg-vete-primary/10     /* Fondo suave */
              border                 /* Habilita borde */
              border-vete-primary/30 /* Borde de marca */
              text-vete-primary      /* Color primario */

              /* --- Texto --- */
              text-xs                /* Tamaño micro */
              font-black             /* Grosor 900 */
              uppercase              /* Mayúsculas */
              tracking-widest        /* Espaciado amplio */

              /* --- Estilo --- */
              rounded-full           /* Píldora */
              backdrop-blur-md       /* Desenfoque */

              /* --- Animación --- */
            `}
          >
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
            <span>Atención & Estilo Profesional</span>
          </div>

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
                /* --- Posición --- */

                /* --- Dimensiones --- */

                /* --- Colores --- */
                text-vete-text-base  /* Color tipográfico principal */

                /* --- Texto --- */
                text-4xl             /* Tamaño móvil */
                sm:text-6xl          /* Tamaño intermedio */
                lg:text-7xl          /* Tamaño gigante desktop */
                font-black           /* Grosor 900 */
                leading-[0.98]       /* Altura de línea compacta */
                tracking-tight       /* Espaciado cerrado */

                /* --- Animación --- */
              `}
            />
          )}

          {/* Descripción */}
          <p
            className={`
              /* --- Posición --- */

              /* --- Dimensiones --- */
              max-w-xl               /* Límite de ancho */

              /* --- Colores --- */
              text-vete-text-muted   /* Color atenuado */

              /* --- Texto --- */
              text-base              /* Tamaño estándar */
              md:text-xl             /* Tamaño destacado */
              leading-relaxed        /* Altura de línea */
              font-normal            /* Grosor regular */

              /* --- Animación --- */
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

              /* --- Colores --- */

              /* --- Texto --- */

              /* --- Animación --- */
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

            <a
              href="#ServicioSession"
              className={`
                /* --- Posición --- */
                flex                 /* Flexbox */
                items-center         /* Centrado */
                justify-center       /* Centrado */

                /* --- Dimensiones --- */
                w-full               /* Ancho completo móvil */
                sm:w-auto            /* Automático desktop */
                px-7                 /* Padding horizontal */
                py-4                 /* Padding vertical */

                /* --- Colores --- */
                bg-vete-surface      /* Fondo claro de tarjeta */
                border-2             /* Borde habilitado */
                border-vete-border-subtle /* Borde suave */
                text-vete-text-base  /* Color de lectura */
                hover:bg-vete-soft   /* Tinte suave al hover */

                /* --- Texto --- */
                text-xs              /* Tamaño compacto */
                font-bold            /* Grosor 700 */
                uppercase            /* Mayúsculas */

                /* --- Estilo --- */
                rounded-2xl          /* Bordes redondeados */

                /* --- Animación --- */
                transition-colors    /* Transición de color */
                duration-200         /* 200ms */
              `}
            >
              Ver Servicios
            </a>
          </div>
        </div>

        {/* ===================================================================
           COLUMNA DERECHA: Animación Lottie a Gran Escala
           =================================================================== */}
        <div
          className={`
            /* --- Posición --- */
            relative                 /* Contenedor relativo */
            flex                     /* Centrado */
            items-center             /* Centrado vertical */
            justify-center           /* Centrado horizontal */
            lg:justify-end           /* Pegado a la derecha en escritorio */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo móvil */
            lg:w-1/2                 /* 50% en pantallas grandes */
            max-w-[650px]            /* Gran escala de hasta 650px */
            min-h-[480px]            /* Altura amplia */

            /* --- Colores --- */

            /* --- Texto --- */

            /* --- Animación --- */
          `}
        >
          {animationData ? (
            <div
              className={`
                /* --- Posición --- */
                relative             /* Contexto interno */
                flex                 /* Centrado */
                items-center         /* Centrado */
                justify-center       /* Centrado */

                /* --- Dimensiones --- */
                w-full               /* Ocupa el ancho máximo */
                h-auto               /* Altura automática */

                /* --- Colores --- */
                filter               /* Habilita filtros CSS */
                drop-shadow-[0_15px_45px_rgba(210,25,25,0.35)] /* Resplandor rojo intenso */

                /* --- Animación --- */
                transform            /* Habilita escala */
                scale-110            /* Aumenta el tamaño visual */
                lg:scale-125         /* Más grande en escritorio */
              `}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-auto max-h-[550px]"
              />
            </div>
          ) : (
            <div className="w-80 h-80 rounded-3xl bg-vete-surface/20 border border-vete-border-subtle animate-pulse flex items-center justify-center">
              <span className="text-xs text-vete-text-muted font-bold">Cargando animación...</span>
            </div>
          )}

          {/* Badge Flotante Superior */}
          <div
            className={`
              /* --- Posición --- */
              absolute               /* Flotante arriba a la izquierda */
              top-4                  /* Anclado arriba */
              left-2                 /* Anclado a la izquierda */
              z-20                   /* Capa superior */
              flex                   /* Flexbox */
              items-center           /* Centrado */
              gap-2.5                /* Espaciado */

              /* --- Dimensiones --- */
              px-4                   /* Padding horizontal */
              py-2                   /* Padding vertical */

              /* --- Colores --- */
              bg-vete-dark           /* Fondo oscuro */
              border                 /* Borde habilitado */
              border-vete-primary/40 /* Borde rojo */
              shadow-xl              /* Sombra */

              /* --- Estilo --- */
              backdrop-blur-md       /* Desenfoque */
              rounded-2xl            /* Bordes redondeados */

              /* --- Animación --- */
              animate-pulse          /* Pulso */
            `}
          >
            <div className="p-1.5 bg-vete-primary/20 text-vete-primary rounded-lg">
              <Star size={15} fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-white">5.0 • Calidad Premium</span>
          </div>

          {/* Badge Flotante Inferior */}
          <div
            className={`
              /* --- Posición --- */
              absolute               /* Flotante abajo a la derecha */
              bottom-2               /* Anclado abajo */
              right-2                /* Anclado a la derecha */
              z-20                   /* Capa superior */
              flex                   /* Flexbox */
              items-center           /* Centrado */
              gap-2                  /* Espaciado */

              /* --- Dimensiones --- */
              px-4                   /* Padding horizontal */
              py-2                   /* Padding vertical */

              /* --- Colores --- */
              bg-vete-tertiary       /* Verde WhatsApp */
              text-white             /* Texto blanco */
              shadow-lg              /* Sombra */

              /* --- Estilo --- */
              rounded-full           /* Píldora */

              /* --- Animación --- */
            `}
          >
            <MessageCircle size={14} />
            <span className="text-[11px] font-bold">Turnos Online</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSessionV3;