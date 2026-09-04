// apps/web-client/src/pages/landing/sessions/PlanSession.tsx

import React from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { PlanCard } from '../../../components/PlanCard';

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

  /* 1. Validación de Feature Flag y datos */
  if (!config?.features?.has_health_plans || !config.health_plans?.length) {
    return null;
  }

  const phone = config.contact.admin_phone;
  const countryCode = config.contact.whatsapp_country_code;

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

        /* --- Colores --- */

        /* --- Texto --- */
        text-center                  /* Texto centrado */

        /* --- Animación --- */
      `}>
        <h2 className={`
          /* --- Posición --- */

          /* --- Dimensiones --- */

          /* --- Colores --- */
          text-vete-text-base          /* Color tipográfico principal */

          /* --- Texto --- */
          text-3xl                     /* Tamaño móvil */
          md:text-5xl                  /* Tamaño pantallas medianas y escritorio */
          font-black                   /* Grosor 900 */
          tracking-tight               /* Espaciado cerrado */
          uppercase                    /* Mayúsculas */

          /* --- Animación --- */
        `}>
          Programas de <span className="text-vete-primary">Bienestar Animal</span>
        </h2>

        <p className={`
          /* --- Posición --- */

          /* --- Dimensiones --- */
          max-w-xl                     /* Límite de ancho */

          /* --- Colores --- */
          text-vete-text-muted         /* Color atenuado */

          /* --- Texto --- */
          text-base                    /* Tamaño estándar */
          md:text-lg                   /* Tamaño cómodo */
          font-normal                  /* Grosor regular */
          leading-relaxed              /* Altura de línea cómoda */

          /* --- Animación --- */
        `}>
          Planes diseñados para asegurar la salud preventiva de tus animales a lo largo de toda su vida.
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

        /* --- Colores --- */

        /* --- Texto --- */

        /* --- Animación --- */
      `}>
        {config.health_plans.map((plan) => (
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
