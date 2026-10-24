// apps/web-client/src/components/PortfolioCard/PortfolioCardV1.tsx

/**
 * @fileoverview Variante 1 de Tarjeta de Trabajo (PortfolioCardV1).
 * Implementa carrusel interactivo para fotos/video, badges de categoría y CTA a WhatsApp.
 * 
 * @module components/PortfolioCard/PortfolioCardV1
 */

import React, { useState } from 'react';
// Iconografía Vectorial
import { MessageCircle, Video, Image as ImageIcon } from 'lucide-react';
// Tipos de Dominio y Contexto
import type { PortfolioItem } from '../../types/tenant_types';
import { useConfig } from '../../context/tenant_context';

/**
 * Propiedades del componente PortfolioCardV1.
 * 
 * @interface PortfolioCardV1Props
 * @property {PortfolioItem} item - Entidad del trabajo a renderizar.
 */
export interface PortfolioCardV1Props {
  item: PortfolioItem;
}

/**
 * Tarjeta de presentación compacta de trabajo realizado (`PortfolioCardV1`).
 *
 * @component
 * @param {PortfolioCardV1Props} props - Propiedades del ítem de portfolio.
 * @returns {JSX.Element} Tarjeta interactiva con visor de medios.
 */
export const PortfolioCardV1: React.FC<PortfolioCardV1Props> = ({ item }) => {
  const { config } = useConfig();
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  const phone = config?.contact?.admin_phone || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const activeMedia = item.media[activeMediaIndex] || item.media[0];

  /**
   * Dispara el enlace directo de WhatsApp con el mensaje estructurado del trabajo.
   */
  const handleInquiry = (): void => {
    const text = item.whatsapp_message || `¡Hola! Me interesa consultar por el trabajo: *${item.title}*.`;
    window.open(`https://wa.me/598${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className={`
        /* --- Posición --- */
        relative
        flex
        flex-col

        /* --- Dimensiones --- */
        w-full
        max-w-md
        overflow-hidden

        /* --- Colores --- */
        bg-vete-surface
        border
        border-vete-border-subtle/50
        shadow-xl

        /* --- Estilo --- */
        rounded-[2rem]

        /* --- Animación --- */
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-2xl
        hover:border-vete-primary/40
      `}
    >
      {/* =====================================================================
         1. CONTENEDOR FOTOGRÁFICO / REPRODUCTOR MULTIMEDIA
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          relative

          /* --- Dimensiones --- */
          w-full
          h-72
          overflow-hidden

          /* --- Colores --- */
          bg-vete-dark/20
        `}
      >
        {activeMedia?.type === 'video' ? (
          <video
            src={activeMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className={`
              /* --- Dimensiones --- */
              w-full
              h-full

              /* --- Estilo --- */
              object-cover
            `}
          />
        ) : (
          <img
            src={activeMedia?.url || '/tenant/producto_no_disponible.png'}
            alt={item.title}
            className={`
              /* --- Dimensiones --- */
              w-full
              h-full

              /* --- Estilo --- */
              object-cover

              /* --- Animación --- */
              transition-all
              duration-500
            `}
          />
        )}

        {/* Badge de Categoría */}
        {item.category && (
          <span
            className={`
              /* --- Posición --- */
              absolute
              top-4
              left-4
              z-10

              /* --- Dimensiones --- */
              px-3.5
              py-1

              /* --- Colores --- */
              bg-vete-dark/85
              backdrop-blur-md
              text-vete-primary
              border
              border-vete-border-subtle/20

              /* --- Texto --- */
              text-[11px]
              font-bold
              uppercase
              tracking-wider

              /* --- Estilo --- */
              rounded-full
            `}
          >
            {item.category}
          </span>
        )}

        {/* Indicador de Tipo si es Video */}
        {activeMedia?.type === 'video' && (
          <span
            className={`
              /* --- Posición --- */
              absolute
              top-4
              right-4
              z-10
              flex
              items-center
              gap-1.5

              /* --- Dimensiones --- */
              px-2.5
              py-1

              /* --- Colores --- */
              bg-vete-dark/85
              text-white
              border
              border-white/10

              /* --- Texto --- */
              text-[10px]
              font-bold
              uppercase

              /* --- Estilo --- */
              rounded-full
            `}
          >
            <Video size={12} className="text-vete-primary" />
            <span>Video</span>
          </span>
        )}

        {/* Selector de Medios (Miniaturas / Globos Interactivos) */}
        {item.media.length > 1 && (
          <div
            className={`
              /* --- Posición --- */
              absolute
              bottom-3
              left-1/2
              -translate-x-1/2
              z-10
              flex
              items-center

              /* --- Dimensiones --- */
              gap-2
              px-3
              py-1.5

              /* --- Colores --- */
              bg-vete-dark/70
              backdrop-blur-md
              border
              border-white/10

              /* --- Estilo --- */
              rounded-full
            `}
          >
            {item.media.map((med, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMediaIndex(idx)}
                className={`
                  /* --- Posición --- */
                  flex
                  items-center
                  justify-center

                  /* --- Dimensiones --- */
                  w-3
                  h-3

                  /* --- Colores --- */
                  ${activeMediaIndex === idx ? 'bg-vete-primary scale-125' : 'bg-white/50 hover:bg-white'}

                  /* --- Estilo --- */
                  rounded-full

                  /* --- Animación --- */
                  transition-all
                  duration-200
                `}
                title={med.type === 'video' ? `Ver video ${idx + 1}` : `Ver foto ${idx + 1}`}
                aria-label={`Ver medio ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
         2. CUERPO DE LA TARJETA (TÍTULO, DESCRIPCIÓN Y CTA)
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          justify-between
          flex-1

          /* --- Dimensiones --- */
          p-6
          gap-4
        `}
      >
        <div className="space-y-2">
          <h3
            className={`
              /* --- Colores --- */
              text-vete-text-base

              /* --- Texto --- */
              text-lg
              font-black
              leading-snug
            `}
          >
            {item.title}
          </h3>

          <p
            className={`
              /* --- Colores --- */
              text-vete-text-muted

              /* --- Texto --- */
              text-xs
              font-normal
              leading-relaxed
            `}
          >
            {item.description}
          </p>
        </div>

        {/* Botón CTA Consulta Directa por WhatsApp */}
        <button
          type="button"
          onClick={handleInquiry}
          className={`
            /* --- Posición --- */
            flex
            items-center
            justify-center
            gap-2.5

            /* --- Dimensiones --- */
            w-full
            py-3
            px-4

            /* --- Colores --- */
            bg-vete-primary/10
            hover:bg-vete-primary
            text-vete-primary
            hover:text-white
            border
            border-vete-primary/30

            /* --- Texto --- */
            text-xs
            font-bold
            uppercase
            tracking-wider

            /* --- Estilo --- */
            rounded-xl

            /* --- Animación --- */
            transition-all
            duration-200
            active:scale-95
          `}
        >
          <MessageCircle size={16} />
          <span>Consultar por este trabajo</span>
        </button>
      </div>
    </article>
  );
};