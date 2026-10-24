// apps/web-client/src/pages/landing/sessions/PortfolioSession.tsx
/**
 * @fileoverview Sección Modular de Trabajos Realizados (PortfolioSession).
 * Consume los datos estáticos de config.json y despliega la grilla responsiva de tarjetas.
 * 
 * @module pages/landing/sessions/PortfolioSession
 */

import React from 'react';
import { useConfig } from '../../../context/tenant_context';
import { PortfolioCard } from '../../../components/PortfolioCard/PortfolioCard';

export interface PortfolioSessionProps {
  bgColor?: string;
}

export const PortfolioSession: React.FC<PortfolioSessionProps> = ({ bgColor = 'bg-transparent' }) => {
  const { config } = useConfig();

  const isEnabled = config?.features?.has_portfolio;
  const portfolioData = config?.portfolio_section;

  // Guarda de seguridad: Si no está habilitado o no hay ítems, no renderiza nada
  if (!isEnabled || !portfolioData || !portfolioData.items?.length) {
    return null;
  }

  return (
    <section
      id="PortfolioSession"
      className={`
        /* --- Posición --- */
        relative
        flex
        flex-col
        items-center

        /* --- Dimensiones --- */
        w-full
        py-20
        px-6
        md:px-16
        gap-12

        /* --- Colores --- */
        ${bgColor}
      `}
    >
      {/* Encabezado de la Sección */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          items-center

          /* --- Dimensiones --- */
          max-w-3xl
          gap-3

          /* --- Texto --- */
          text-center
        `}
      >
        <h2
          dangerouslySetInnerHTML={{
            __html: portfolioData.title_html || 'Nuestros <span class="text-vete-primary">Trabajos</span>',
          }}
          className={`
            /* --- Colores --- */
            text-vete-text-base

            /* --- Texto --- */
            text-3xl
            md:text-5xl
            font-black
            tracking-tight
            uppercase
          `}
        />
        <p
          className={`
            /* --- Dimensiones --- */
            max-w-xl

            /* --- Colores --- */
            text-vete-text-muted

            /* --- Texto --- */
            text-base
            md:text-lg
            font-normal
            leading-relaxed
          `}
        >
          {portfolioData.description}
        </p>
      </div>

      {/* Grilla Responsiva de Tarjetas (1 col móvil, 2 tablet, 3 desktop) */}
      <div
        className={`
          /* --- Posición --- */
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          justify-items-center

          /* --- Dimensiones --- */
          w-full
          max-w-7xl
          gap-8
        `}
      >
        {portfolioData.items.map((trabajo) => (
          <PortfolioCard key={trabajo.id} item={trabajo} />
        ))}
      </div>
    </section>
  );
};

export default PortfolioSession;