/* apps/web-client/src/components/animations/AmbientScrollAnimation.tsx */


import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/tenant_context';

export interface AmbientAnimationProps {
  videoSrc?: string;
}

export const AmbientScrollAnimation: React.FC<AmbientAnimationProps> = ({ videoSrc }) => {
  const { config } = useConfig();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const isEnabled = Boolean(config?.features?.has_background_animation);
  const src = videoSrc || config?.branding?.background_animation_url || '/tenant/ambient.webm';

  useEffect(() => {
    const handleScroll = (): void => {
      // Alterna al modo lateral con opacidad suave después del Hero
      setIsScrolled(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isEnabled || !src) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`
        /* --- Posición --- */
        fixed                        /* Flotante en viewport */
        z-[10]                       /* Permanece visible sobre fondos y footer */
        pointer-events-none          /* Todos los clics pasan a botones y textos */
        flex
        items-center
        justify-center

        /* --- Dimensiones según Scroll (Permanece SIEMPRE activo) --- */
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