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
        fixed                        /* Fijo sobre toda la ventana gráfica */
        z-0                          /* Capa inferior detrás de todas las secciones */
        pointer-events-none          /* Cero interferencia: todos los clics pasan a la web */
        flex                         /* Flexbox */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */

        /* --- Dimensiones Dinámicas según Scroll --- */
        ${isScrolled
          ? 'top-1/2 right-0 translate-x-[25%] -translate-y-1/2 w-[280px] sm:w-[380px] lg:w-[480px] h-[550px] lg:h-[700px] opacity-25 lg:opacity-35 scale-90' // Modo Lateral Ambiental
          : 'top-20 lg:top-16 right-4 sm:right-12 lg:right-24 -translate-y-0 w-[340px] sm:w-[480px] lg:w-[620px] h-[480px] sm:h-[620px] lg:h-[760px] opacity-85 lg:opacity-95 scale-100' // Modo Hero Protagónico
        }

        /* --- Colores --- */
        filter                       /* Habilita filtros CSS */
        drop-shadow-[0_0_60px_rgba(var(--vete-primary),0.3)] /* Resplandor neón suave */

        /* --- Animación --- */
        transition-all               /* Transición fluida de posición, opacidad y escala */
        duration-1000                /* 1 segundo de amortiguación cinematográfica */
        ease-out                     /* Curva de desaceleración suave */
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