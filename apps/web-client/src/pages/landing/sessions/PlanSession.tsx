// apps/web-client/src/pages/landing/sessions/PlanSession.tsx
/* =============================================================================
   COMPONENTE: SECCIÓN DE PLANES Y PROGRAMAS PREVENTIVOS (PlanSession)
   ============================================================================= */

import React from 'react';
import { PlanCard } from '../../../components/PlanCard';
import { useConfig } from '../../../context/tenant_context';

/**
 * Propiedades del componente `PlanSession`.
 * 
 * @interface PlanSessionProps
 * @property {string} [bgColor='bg-vete-soft/20'] - Clase de Tailwind para alternar el color de fondo de la sección con contraste visual.
 */
export interface PlanSessionProps {
  bgColor?: string;
}

/**
 * Sección de catálogo de planes de salud y programas preventivos (`PlanSession`).
 * 
 * Consume la configuración del cliente activo mediante `useConfig()`, valida la bandera
 * de activación (`features.has_health_plans`) y renderiza la grilla responsiva de tarjetas
 * con enlace directo a WhatsApp.
 *
 * @component
 * @param {PlanSessionProps} props - Propiedades de configuración visual.
 * @returns {JSX.Element | null} Sección completa o `null` si el cliente tiene el módulo desactivado.
 */
export const PlanSession: React.FC<PlanSessionProps> = ({ bgColor = 'bg-vete-soft/20' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();

  /* ---------------------------------------------------------------------------
     2. CONTROL DE VISIBILIDAD MEDIANTE FEATURE FLAGS
     --------------------------------------------------------------------------- */
  const isEnabled = config?.features?.has_health_plans;
  const plansData = config?.plans_section;

  /* Retorno temprano si el módulo está apagado o no contiene planes configurados */
  if (!isEnabled || !plansData || !plansData.items?.length) {
    return null;
  }

  const phone = config.contact.admin_phone;

  return (
    <section
      id="PlanSession"
      className={`
        /* --- Posición --- */
        relative                     /* Contexto de posicionamiento */
        flex                         /* Layout flexible */
        flex-col                     /* Organización en columna */
        items-center                 /* Centrado horizontal de la sección */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        py-20                        /* Padding vertical amplio */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral escritorio */
        gap-12                       /* Separación entre encabezado y grilla */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico inyectado por props */
      `}
    >
      {/* ===================================================================
         BLOQUE SUPERIOR: Encabezado y Subtítulo Dinámicos
         =================================================================== */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        flex-col                     /* Disposición en columna */
        items-center                 /* Centrado de textos */

        /* --- Dimensiones --- */
        max-w-3xl                    /* Ancho máximo de lectura */
        gap-3                        /* Separación título-párrafo */

        /* --- Texto --- */
        text-center                  /* Texto centrado */

      `}>
        {/* Título Dinámico con Soporte HTML */}
        <h2
          dangerouslySetInnerHTML={{
            __html: plansData.title_html || 'Nuestros <span class="text-vete-primary">Programas</span>',
          }}
          className={`

            /* --- Colores --- */
            text-vete-text-base      /* Color tipográfico principal */

            /* --- Texto --- */
            text-3xl                 /* Tamaño en móvil */
            md:text-5xl              /* Tamaño en tablets y escritorio */
            font-black               /* Grosor máximo (900) */
            tracking-tight           /* Espaciado de letras compacto */
            uppercase                /* Mayúsculas */

          `}
        />

        {/* Bajada Descriptiva */}
        <p className={`

          /* --- Dimensiones --- */
          max-w-xl                   /* Límite de ancho para lectura óptima */

          /* --- Colores --- */
          text-vete-text-muted       /* Color secundario atenuado */

          /* --- Texto --- */
          text-base                  /* Tamaño estándar */
          md:text-lg                 /* Tamaño cómodo en desktop */
          font-normal                /* Grosor regular */
          leading-relaxed            /* Altura de línea cómoda */
        `}>
          {plansData.description || 'Planes diseñados para asegurar la salud preventiva de tus animales.'}
        </p>
      </div>

      {/* ===================================================================
         BLOQUE INFERIOR: Grilla Responsiva de Tarjetas
         =================================================================== */}
      <div className={`
        /* --- Posición --- */
        grid                         /* Layout en grilla */
        grid-cols-1                  /* 1 columna en teléfonos */
        sm:grid-cols-2               /* 2 columnas en tablets */
        lg:grid-cols-4               /* 4 columnas en pantallas de escritorio */
        justify-items-center         /* Centrado horizontal de cada tarjeta en su celda */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        max-w-7xl                    /* Límite máximo de contenedor */
        gap-8                        /* Espaciado uniforme entre tarjetas */
      `}>
        {plansData.items.map((plan) => (
          <PlanCard
            key={plan.id}
            title={plan.title}
            description={plan.description}
            benefits={plan.benefits}
            borderColor={plan.is_featured ? 'vete-primary' : 'vete-soft'}
            isFeatured={plan.is_featured}
            mensajeWhatsApp={plan.whatsapp_message}
            phoneWhattsApp={phone}
          />
        ))}
      </div>
    </section>
  );
};

export default PlanSession;