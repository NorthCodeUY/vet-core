/**
 * @fileoverview Cabecera de la Vista de Mantenimiento / Próxima Apertura (MaintenanceHeader.tsx)
 * 
 * Despliega la identidad corporativa del tenant, el logotipo oficial inyectado
 * dinámicamente desde `/tenant/`, una insignia de apertura promocional y los
 * títulos institucionales adaptados a la paleta de diseño activa.
 * 
 * @module pages/maintenance/MaintenancePageV2/MaintenanceHeader
 */

import React from 'react';
// --- Iconografía Lucide ---
import { Sparkles } from 'lucide-react';
// --- Contexto Multi-Tenant ---
import { useConfig } from '../../../context/tenant_context';

/**
 * Propiedades del componente `MaintenanceHeader`.
 * 
 * @interface MaintenanceHeaderProps
 * @property {string} [businessName] - Nombre comercial opcional (fallback automático a config.business_name).
 */
interface MaintenanceHeaderProps {
  businessName?: string;
}

/**
 * Cabecera institucional para páginas de mantenimiento y lanzamiento (`MaintenanceHeader`).
 *
 * @component
 * @param {MaintenanceHeaderProps} props - Propiedades de configuración.
 * @returns {JSX.Element}
 */
export const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({ businessName }) => {
  /* ===========================================================================
     1. CONSUMO DEL CONTEXTO EN LA RAÍZ DEL COMPONENTE
     =========================================================================== */
  const { config } = useConfig();

  // Resolución dinámica de datos de identidad
  const name = businessName || config?.business_name || 'Comercio';
  // <!> Extracción segura del logo según la arquitectura multi-tenant
  const logoUrl = config?.branding?.logo_url || '/tenant/logo.png';
  const address = config?.contact?.address || 'Uruguay';

  /* ===========================================================================
     2. RENDERIZADO VISUAL
     =========================================================================== */
  return (
    <div
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para esferas de luz absolutas */
        text-center                  /* Alineación central de textos */
        overflow-hidden              /* Contiene halos decorativos */

        /* --- Dimensiones --- */
        px-8                         /* Padding lateral amplio */
        py-10                        /* Padding vertical */

        /* --- Colores --- */
        bg-vete-soft/20              /* Fondo suave temático */
        border-b                     /* Separador inferior */
        border-vete-border-subtle    /* Borde sutil institucional */
      `}
    >
      {/* Esferas decorativas de luz ambiental de fondo */}
      <div
        className={`
          /* --- Posición --- */
          absolute
          -right-16
          -top-16
          pointer-events-none

          /* --- Dimensiones --- */
          w-48
          h-48

          /* --- Colores --- */
          bg-vete-primary/5

          /* --- Estilo --- */
          rounded-full
          blur-2xl
        `}
      />
      <div
        className={`
          /* --- Posición --- */
          absolute
          -left-16
          -bottom-16
          pointer-events-none

          /* --- Dimensiones --- */
          w-48
          h-48

          /* --- Colores --- */
          bg-vete-secondary/10

          /* --- Estilo --- */
          rounded-full
          blur-2xl
        `}
      />

      {/* =====================================================================
         <!> LOGOTIPO DINÁMICO DEL TENANT (Inyectado con Fallback Seguro)
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          justify-center
          items-center

          /* --- Dimensiones --- */
          mb-4
        `}
      >
        <img
          src={logoUrl}
          alt={`Logo oficial de ${name}`}
          onError={(e) => {
            // Fallback si la imagen no existe en la carpeta /tenant/
            (e.currentTarget as HTMLImageElement).src = '/tenant/logo.png';
          }}
          className={`
            /* --- Dimensiones --- */
            w-16
            h-16

            /* --- Estilo --- */
            object-contain
            filter
            drop-shadow-sm

            /* --- Animación --- */
            transition-transform
            duration-300
            hover:scale-105
          `}
        />
      </div>

      {/* Insignia de Promoción de Apertura */}
      <div
        className={`
          /* --- Posición --- */
          inline-flex
          items-center

          /* --- Dimensiones --- */
          gap-2
          px-4
          py-1.5
          mb-6

          /* --- Colores --- */
          
          text-vete-primary
          shadow-sm

          /* --- Texto --- */
          text-xs
          sm:text-sm
          font-bold

          /* --- Estilo --- */
          rounded-full
        `}
      >
        <Sparkles size={16} />
        <span>Promoción de apertura: ¡Primera consulta sin costo para nuevos pacientes!</span>
      </div>

      {/* Título Principal */}
      <h1
        className={`
          /* --- Dimensiones --- */
          mb-3

          /* --- Colores --- */
          text-vete-text-base

          /* --- Texto --- */
          text-2xl
          sm:text-4xl
          font-black
          tracking-tight
        `}
      >
        Planes de Salud y Tarifas de Servicios
      </h1>

      {/* =====================================================================
         <!> ANUNCIO DE GRAN INAUGURACIÓN Y PRÓXIMO PORTAL ONLINE
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          items-center
          mx-auto

          /* --- Dimensiones --- */
          max-w-2xl
          gap-3
        `}
      >
        {/* Mensaje Cálido de Apertura */}
        <p
          className={`
            /* --- Colores --- */
            text-vete-text-muted

            /* --- Texto --- */
            text-xs
            sm:text-sm
            leading-relaxed
            text-center
          `}
        >
          <strong className="text-vete-primary font-bold">{name}</strong> — ¡Gran inauguración muy pronto! 
          Estamos ultimando cada detalle en <span className="font-semibold text-vete-text-base">{address}</span> para 
          ofrecerte una atención atenta, cálida y de primer nivel. Nos mueve la vocación y el compromiso porque sabemos 
          que <em className="text-vete-text-base font-semibold not-italic">cuidamos a quienes más amas</em>.
        </p>

        {/* Notificación de Tienda Online y Créditos */}
        <div
          className={`
            /* --- Posición --- */
            inline-flex
            flex-wrap
            items-center
            justify-center

            /* --- Dimensiones --- */
            gap-2
            pt-2

            /* --- Colores --- */
            text-vete-text-muted

            /* --- Texto --- */
            text-[11px]
            font-medium
            text-center
          `}
        >
          <span>
            🚀 Próximamente estaremos estrenando nuestro portal de venta y pedidos online.
          </span>
          <span className="text-vete-border-subtle hidden sm:inline">|</span>
          <a
            href="https://northcode-uy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              /* --- Colores --- */
              text-vete-primary
              hover:text-vete-primary-hover

              /* --- Texto --- */
              font-bold
              underline

              /* --- Animación --- */
              transition-colors
              duration-200
            `}
          >
            Tecnología por NorthCode
          </a>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceHeader;