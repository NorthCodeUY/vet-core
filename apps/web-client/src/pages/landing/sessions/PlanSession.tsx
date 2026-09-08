// apps/web-client/src/pages/landing/sessions/PlanSession.tsx

import React from 'react';
import { PlanCard } from '../../../components/PlanCard';
import { useConfig } from '../../../context/tenant_context';

/**
 * Sección de Planes de Salud y Programas Preventivos (`PlanSession`).
 * 
 * Consume los datos del cliente desde `useConfig()`, valida si el módulo está habilitado
 * mediante la feature flag `has_health_plans` y renderiza la grilla adaptable de tarjetas.
 *
 * @component
 * @returns {JSX.Element | null} Sección completa o `null` si el cliente tiene el módulo apagado.
 */
export const PlanSession: React.FC = () => {
  const { config } = useConfig();


  /* Validación de Feature Flag y existencia de datos en el JSON */
  const isEnabled = config?.features?.has_health_plans;
  const plansData = config?.plans_section;



  /* 1. Validación de Feature Flag y datos */
  if (!config?.features?.has_health_plans || !config.health_plans?.length) {
    return null;
  }

  const phone = config.contact.admin_phone; // Numero de whatsapp administrativo
  const countryCode = config.contact.whatsapp_country_code; // Codigo de pais para whatsapp

  return (
    <section className={`
      /* --- Posición --- */
      flex                         /* Layout flexible */
      flex-col                     /* Organización en columna */
      items-center                 /* Centrado horizontal */

      /* --- Dimensiones --- */
      w-full                       /* Ancho completo */
      py-20                        /* Padding vertical */
      px-6                         /* Padding horizontal */
      gap-12                       /* Separación encabezado-grilla */

      /* --- Colores --- */
      bg-vete-soft/20              /* Tinte suave de fondo */

      /* --- Texto --- */

      /* --- Animación --- */
    `}>
      {/* Encabezado de la Sección */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        flex-col                     /* Organización en columna */
        items-center                 /* Centrado horizontal */

        /* --- Dimensiones --- */
        max-w-3xl                    /* Ancho máximo de lectura */
        gap-3                        /* Separación título-párrafo */

        /* --- Texto --- */
        text-center                  /* Texto centrado */
      `}>
        {/* Título Dinámico */}
        <h2
          dangerouslySetInnerHTML={{ __html: plansData?.title_html || 'Nuestros Programas' }} // Optimiza para resivir de el jeison los valores de colores etc 
          className={`
          /* --- Colores --- */
          text-vete-text-base          /* Color tipográfico principal */

          /* --- Texto --- */
          text-3xl                     /* Tamaño móvil */
          md:text-5xl                  /* Tamaño pantallas medianas y escritorio */
          font-black                   /* Grosor 900 */
          tracking-tight               /* Espaciado cerrado */
          uppercase                    /* Mayúsculas */
        `}
        />

        <p className={`
          /* --- Dimensiones --- */
          max-w-xl                     /* Límite de ancho */

          /* --- Colores --- */
          text-vete-text-muted         /* Color atenuado */

          /* --- Texto --- */
          text-base                    /* Tamaño estándar */
          md:text-lg                   /* Tamaño cómodo */
          font-normal                  /* Grosor regular */
          leading-relaxed              /* Altura de línea cómoda */
        `}>
          {plansData?.description || "Planes diseñados para la satifacción de nuestros clientes"}
        </p>
      </div>

      {/* Grilla de Tarjetas */}
      <div className={`
        /* --- Posición --- */
        grid                         /* Grilla CSS */
        grid-cols-1                  /* 1 columna en móviles */
        sm:grid-cols-2               /* 2 columnas en tablets */
        lg:grid-cols-4               /* 4 columnas en escritorios */
        justify-items-center         /* Centra tarjetas en sus celdas */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        max-w-7xl                    /* Límite del viewport */
        gap-8                        /* Espaciado entre tarjetas */

      `}>
        {plansData?.items?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            phone={phone}
            countryCode={countryCode}
          />
        ))}
      </div>
    </section>
  );
};
