/* apps/web-client/src/components/animations/AmbientScrollAnimation.tsx */

/* =============================================================================
   COMPONENTE: ANIMACIÓN AMBIENTAL DE FONDO REACTIVA AL SCROLL (AmbientScrollAnimation)
   ============================================================================= */

import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/tenant_context';

/**
 * Propiedades del componente `AmbientScrollAnimation`.
 * 
 * @interface AmbientAnimationProps
 * @property {string} [videoSrc] - Ruta alternativa del video WebM transparente.
 */
export interface AmbientAnimationProps {
  videoSrc?: string;
}

/**
 * Elemento 3D ambiental que permanece en el fondo de toda la landing page (`AmbientScrollAnimation`).
 * 
 * En el Hero se posiciona de forma protagónica a la derecha. Al hacer scroll hacia abajo,
 * realiza una transición suave hacia el extremo lateral derecho con atenuación lumínica,
 * funcionando como textura de fondo viva sin interrumpir la interacción del usuario.
 *
 * @component
 * @param {AmbientAnimationProps} props - Propiedades de configuración.
 * @returns {JSX.Element | null} Capa de fondo fija con reproducción continua.
 */
export const AmbientScrollAnimation: React.FC<AmbientAnimationProps> = ({ videoSrc }) => {
  const { config } = useConfig();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /* 1. Control de Visibilidad por Configuración */
  const isEnabled = config?.features?.has_background_animation;
  const src = videoSrc || config?.branding?.background_animation_url || '/tenant/barber_pole.webm';

  /* 2. Detección de Desplazamiento Vertical */
  useEffect(() => {
    const handleScroll = () => {
      // Se activa la transición cuando el usuario baja más de 250px del Hero
      setIsScrolled(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
<div
      aria-hidden="true"
      className={`
        /* --- Posición --- */
        fixed                        /* Flotante sobre la pantalla */
        z-10                         /* CAPA 2: Por encima de fondos y ondas, debajo de textos */
        pointer-events-none          /* Todos los clics pasan directo a los botones */
        flex                         /* Flexbox */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */

        /* --- Dimensiones según Scroll --- */
        ${isScrolled
          ? 'top-1/2 right-0 translate-x-[30%] -translate-y-1/2 w-[280px] sm:w-[380px] lg:w-[460px] h-[550px] lg:h-[700px] opacity-25 lg:opacity-35 scale-90' // Modo Scroll: Asistente lateral discreto
          : 'top-20 lg:top-14 right-2 sm:right-6 lg:-right-[100px] xl:-right-[150px] w-[320px] sm:w-[440px] lg:w-[540px] xl:w-[600px] h-[480px] sm:h-[600px] lg:h-[720px] opacity-90 lg:opacity-100 scale-100' // Modo Hero: Pegado al extremo derecho en PC
        }

        /* --- Colores --- */
        filter                       /* Filtros CSS */
        drop-shadow-[0_0_50px_rgba(var(--vete-primary),0.35)] /* Resplandor neón */

        /* --- Animación --- */
        transition-all               /* Transición fluida */
        duration-1000                /* 1 segundo suave */
        ease-out                     /* Desaceleración suave */
      `}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={`

          /* --- Dimensiones --- */
          w-full                     /* Ocupa el contenedor */
          h-full                     /* Ocupa el contenedor */

          /* --- Estilo --- */
          object-contain             /* Preserva proporción exacta del render */

          /* --- Animación --- */
        `}
      />
    </div>
  );
};

export default AmbientScrollAnimation;