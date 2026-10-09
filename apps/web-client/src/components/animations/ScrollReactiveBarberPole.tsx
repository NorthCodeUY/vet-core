// apps/web-client/src/components/animations/ScrollReactiveBarberPole.tsx

/* =============================================================================
   COMPONENTE: CARTEL 3D REACTIVO AL SCROLL (ScrollReactiveBarberPole)
   ============================================================================= */

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useConfig } from '../../context/tenant_context';

/**
 * Propiedades del componente `ScrollReactiveBarberPole`.
 * 
 * @interface ScrollBarberPoleProps
 * @property {string} [videoSrc='/tenant/barber_pole.webm'] - Ruta del video 3D transparente.
 */
export interface ScrollBarberPoleProps {
  videoSrc?: string;
}

/**
 * Cartel de barbería 3D con transición de escala y posición sincronizada al scroll.
 * 
 * En la parte superior ocupa el espacio principal del Hero a gran escala.
 * Al descender por el catálogo o servicios, se reduce y se ancla como asistente
 * flotante de WhatsApp en la esquina inferior de la pantalla.
 *
 * @component
 * @param {ScrollBarberPoleProps} props - Propiedades de configuración.
 * @returns {JSX.Element} Elemento interactivo reactivo al scroll.
 */
export const ScrollReactiveBarberPole: React.FC<ScrollBarberPoleProps> = ({
  videoSrc = '/tenant/barber_pole.webm',
}) => {
  const { config } = useConfig();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  /* 1. Detección de Scroll (Umbral de 280px para salir del Hero) */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 2. Disparo directo a WhatsApp */
  const phone = config?.contact?.admin_phone || '';
  const cleanPhone = phone.replace(/\D/g, '');

  const handleClick = () => {
    const msg = `¡Hola ${config?.business_name || ''}! Me gustaría agendar un turno.`;
    window.open(`https://wa.me/598${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      onClick={handleClick}
      title="Agendar Turno por WhatsApp"
      className={`
        /* --- Posición --- */
        fixed                        /* Flotante en pantalla */
        z-[120]                      /* Por encima de secciones, debajo de modales */
        flex                         /* Flexbox */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */
        cursor-pointer               /* Clickeable para WhatsApp */

        /* --- Dimensiones Dinámicas según Scroll --- */
        ${isScrolled
          ? 'bottom-6 right-4 sm:right-8 w-28 sm:w-36 h-56 sm:h-72 opacity-90 hover:opacity-100 hover:scale-110' // Modo Flotante Dockeado
          : 'top-20 lg:top-24 right-4 sm:right-10 lg:right-24 w-[340px] sm:w-[460px] lg:w-[620px] h-[450px] sm:h-[580px] lg:h-[720px] opacity-100' // Modo Hero Gigante
        }

        /* --- Colores --- */
        filter                       /* Filtro CSS */
        drop-shadow-[0_0_40px_rgba(var(--vete-primary),0.4)] /* Resplandor neón institucional */

        /* --- Animación --- */
        transition-all               /* Transición fluida de todas las propiedades */
        duration-700                 /* 700ms para un deslizamiento elegante */
        ease-in-out                  /* Aceleración y frenado suave */
        group                        /* Agrupador */
      `}
    >
      {/* Video 3D Transparente */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className={`
          /* --- Posición --- */

          /* --- Dimensiones --- */
          w-full                     /* Ocupa el contenedor */
          h-full                     /* Ocupa el contenedor */

          /* --- Estilo --- */
          object-contain             /* Sin deformar proporciones */
          pointer-events-none        /* Pasa el clic al contenedor */

          /* --- Animación --- */
        `}
      />

      {/* Badge Flotante que aparece solo cuando está dockeado abajo */}
      {isScrolled && (
        <div
          className={`
            /* --- Posición --- */
            absolute                 /* Flotante en la base del cartel */
            -bottom-2                /* Pegado abajo */
            z-20                     /* Capa superior */
            flex                     /* Flexbox */
            items-center             /* Centrado */
            gap-1.5                  /* Espaciado */

            /* --- Dimensiones --- */
            px-3                     /* Padding horizontal */
            py-1                     /* Padding vertical */

            /* --- Colores --- */
            bg-vete-tertiary         /* Verde WhatsApp */
            text-white               /* Texto blanco */
            shadow-xl                /* Sombra */

            /* --- Estilo --- */
            rounded-full             /* Píldora */

            /* --- Animación --- */
            animate-bounce           /* Rebote sutil */
          `}
        >
          <MessageCircle size={12} />
          <span className="text-[10px] font-black uppercase tracking-wider">Agendar</span>
        </div>
      )}
    </aside>
  );
};