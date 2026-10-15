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
 * @property {string} [videoSrc] - Ruta alternativa opcional del video WebM transparente.
 */
export interface AmbientAnimationProps {
  videoSrc?: string;
}

/**
 * Elemento volumétrico ambiental fijado en Capa 1 (z-10) (`AmbientScrollAnimation`).
 * 
 * Permanece en el fondo sin bloquear clics (pointer-events-none). En el Hero se posiciona
 * de forma destacada y al hacer scroll se desplaza lateralmente reduciendo su opacidad y escala.
 *
 * @component
 * @param {AmbientAnimationProps} props - Propiedades de configuración.
 * @returns {JSX.Element | null} Capa de fondo fija con reproducción continua.
 */
export const AmbientScrollAnimation: React.FC<AmbientAnimationProps> = ({ videoSrc }) => {
  const { config } = useConfig();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /* 1. Control de Visibilidad por Feature Flag */
  const isEnabled = Boolean(config?.features?.has_background_animation);

  /* =============================================================================
     <!> MODIFICACIÓN: Eliminación de fallback quemado ('barber_pole.webm').
     Se utiliza una ruta agnóstica universal ('/tenant/ambient.webm').
     ============================================================================= */
  const src = videoSrc || config?.branding?.background_animation_url || '/tenant/ambient.webm';

  /* 2. Detección reactiva de desplazamiento vertical */
  useEffect(() => {
    const handleScroll = (): void => {
      // Se activa la transición cuando el usuario baja más de 250px del Hero
      setIsScrolled(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 3. Retorno temprano si está deshabilitado o no hay recurso */
  if (!isEnabled || !src) {
    return null;
  }

   return (
    <div
      aria-hidden="true"
      className={`
        /* --- Posición --- */
        fixed                        /* Flotante fijo sobre el viewport */
        z-[40]                       /* <!> CAPA AMBIENTAL: Por debajo de la barra flotante (z-[50]) */
        pointer-events-none          /* Todos los clics traspasan al contenido inferior */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */

        /* --- Dimensiones según Scroll --- */
        ${isScrolled
          ? 'top-1/2 right-0 translate-x-[30%] -translate-y-1/2 w-[280px] sm:w-[380px] lg:w-[460px] h-[550px] lg:h-[700px] opacity-25 lg:opacity-35 scale-90'
          : 'top-20 lg:top-14 right-2 sm:right-6 lg:-right-[100px] xl:-right-[150px] w-[320px] sm:w-[440px] lg:w-[540px] xl:w-[600px] h-[480px] sm:h-[600px] lg:h-[720px] opacity-90 lg:opacity-100 scale-100'
        }

        /* --- Colores --- */
        filter
        drop-shadow-[0_0_50px_rgba(var(--vete-primary),0.35)]

        /* --- Animación --- */
        transition-all
        duration-1000
        ease-out
      `}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AmbientScrollAnimation;