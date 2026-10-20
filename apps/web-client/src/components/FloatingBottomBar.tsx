/* apps/web-client/src/components/FloatingBottomBar.tsx */

/* =============================================================================
   COMPONENTE: BARRA FLOTANTE CON AUTO-OCULTADO AL LLEGAR AL FOOTER
   ============================================================================= */

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Facebook, Instagram } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButtonProps';
import { useConfig } from '../context/tenant_context';

const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const FloatingBottomBar: React.FC = () => {
  const { config } = useConfig();
  /* <!> Estado que detecta si el usuario llegó al final de la página */
  const [isNearBottom, setIsNearBottom] = useState<boolean>(false);

  const phone = config?.contact?.admin_phone || '';
  const mapsUrl = config?.contact?.google_maps_direct_url || config?.contact?.google_maps_url || '#';

  const hasEmergency = Boolean(
    config?.features?.has_emergency_button &&
    config?.contact?.emergency_phone &&
    config?.contact?.emergency_phone.trim() !== '' &&
    config?.contact?.emergency_phone !== '#'
  );

  const socials = {
    facebook: config?.contact?.social_networks?.facebook || '#',
    instagram: config?.contact?.social_networks?.instagram || '#',
    tiktok: config?.contact?.social_networks?.tiktok || '#',
  };

  /* <!> Detector de proximidad al Footer (menos de 400px del fondo) */
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setIsNearBottom(distanceFromBottom < 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSocialClick = useCallback((platform: string) => {
    console.debug(`Click en red social flotante: ${platform}`);
  }, []);

  return (
    <div
      className={`
        /* --- Posición --- */
        fixed                        /* Anclado fijo a la pantalla */
        bottom-0                     /* Al ras inferior */
        left-0                       /* Al ras izquierdo */
        z-[50]                       /* Por delante de la animación 3D */
        flex                         /* Layout flexible */
        items-end                    /* Alineado al fondo */
        justify-between              /* Distribución a los extremos */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        h-24                         /* Altura fija de 6rem */
        px-4                         /* Padding horizontal móvil */
        md:px-16                     /* Padding horizontal escritorio */
        pb-4                         /* Separación inferior */

        /* --- Interacción y Animación al llegar al Footer --- */
        ${
          /* <!> Si llega al fondo, desaparece deslizándose hacia abajo */
          isNearBottom
            ? 'opacity-0 translate-y-16 pointer-events-none'
            : 'opacity-100 translate-y-0 pointer-events-none'
        }

        /* --- Animación Cinemática --- */
        transition-all               /* Suaviza desaparición */
        duration-500                 /* Medio segundo de transición fluida */
        ease-out                     /* Desaceleración suave */
      `}
    >
      {/* Fondo de textura */}
      <img
        src="/tenant/nav.png"
        alt=""
        className={`
          /* --- Posición --- */
          absolute
          bottom-0
          left-0
          z-0
          pointer-events-none

          /* --- Dimensiones --- */
          w-full
          h-full

          /* --- Colores --- */
          opacity-35

          /* --- Estilo --- */
          object-cover
          object-top
        `}
      />

      {/* LADO IZQUIERDO: Administración */}
      <div className="pointer-events-auto z-30">
        {hasEmergency && (
          <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <WhatsAppButton
              label="Administración"
              phone={phone}
              bgColor="bg-vete-tertiary"
            />
          </div>
        )}
      </div>

      {/* CENTRO: Redes y Ubicación */}
      <div
        className={`
          /* --- Posición --- */
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          z-30
          flex
          items-center
          gap-3.5
          pointer-events-auto
        `}
      >
        {socials.facebook !== '#' && (
          <a
            href={socials.facebook}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleSocialClick('facebook')}
            className="p-3 bg-vete-dark/80 backdrop-blur-md rounded-full border border-vete-border-subtle hover:bg-vete-primary transition-all shadow-lg text-vete-text-base hover:scale-110"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-vete-dark/80 backdrop-blur-md rounded-full border border-vete-border-subtle hover:bg-vete-primary transition-all shadow-xl text-vete-text-base hover:scale-125 group"
          title="Ver ubicación en Google Maps"
          aria-label="Google Maps"
        >
          <MapPin size={22} className="group-hover:text-vete-text-base transition-colors" />
        </a>

        {socials.instagram !== '#' && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleSocialClick('instagram')}
            className="p-3 bg-vete-dark/80 backdrop-blur-md rounded-full border border-vete-border-subtle hover:bg-vete-primary transition-all shadow-lg text-vete-text-base hover:scale-110"
            title="Instagram"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        )}

        {socials.tiktok !== '#' && (
          <a
            href={socials.tiktok}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleSocialClick('tiktok')}
            className="p-3 bg-vete-dark/80 backdrop-blur-md rounded-full border border-vete-border-subtle hover:bg-vete-primary transition-all shadow-lg text-vete-text-base hover:scale-110"
            title="TikTok"
            aria-label="TikTok"
          >
            <TikTokIcon size={18} />
          </a>
        )}
      </div>

      {/* LADO DERECHO: Contacto o Emergencia */}
      <div className="pointer-events-auto z-30">
        {hasEmergency ? (
          <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <WhatsAppButton
              label="Emergencia"
              phone={config?.contact?.emergency_phone || '#'}
              bgColor="bg-vete-error"
              isReversed={true}
            />
          </div>
        ) : (
          <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <WhatsAppButton
              label={config?.custom_messages?.whatsapp_contact_label || 'Contactar'}
              phone={phone}
              bgColor="bg-vete-tertiary"
              isReversed={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingBottomBar;