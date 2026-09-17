// app/vet-core/apps/web-client/src/components/PlanCard.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { WhatsAppDynamicButton } from './WhatsAppDynamicButton';

/**
 * Propiedades del componente `PlanCard`.
 * 
 * @interface PlanCardProps
 * @property {string} title - Nombre comercial del plan o paquete.
 * @property {string} description - Resumen del alcance y cobertura.
 * @property {string[]} benefits - Listado de servicios y ventajas incluidas.
 * @property {string} borderColor - Token de color dinámico para acentos (ej: 'vete-primary', 'vete-soft').
 * @property {boolean} [isFeatured=false] - Habilita el estilo visual elevado para el plan más popular.
 * @property {string} mensajeWhatsApp - Plantilla de texto preconfigurada para enviar al chat.
 * @property {string} phoneWhattsApp - Número telefónico de recepción de consultas.
 */
export interface PlanCardProps {
  title: string;
  description: string;
  benefits: string[];
  borderColor: string;
  isFeatured?: boolean;
  mensajeWhatsApp: string;
  phoneWhattsApp: string;
}

/**
 * Tarjeta de presentación de planes, suscripciones y promociones (`PlanCard`).
 * 
 * Despliega los beneficios del plan, resalta visualmente la opción destacada
 * mediante elevación y sombras, y administra la construcción y disparo del mensaje
 * pre-armado hacia WhatsApp al presionar el botón interactivo.
 *
 * @component
 * @param {PlanCardProps} props - Propiedades de configuración del plan.
 * @returns {JSX.Element} Tarjeta estructurada con llamada a la acción interactiva.
 */
export const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  benefits,
  borderColor,
  isFeatured = false,
  mensajeWhatsApp,
  phoneWhattsApp,
}) => {
  /* ---------------------------------------------------------------------------
     1. ASIGNACIÓN DE COLOR DINÁMICO
     --------------------------------------------------------------------------- */
  /* Extrae la variable CSS del tema activo correspondiente al token */
  const dynamicColor = `rgb(var(--${borderColor}))`;

  /* ---------------------------------------------------------------------------
     2. MANEJADOR DE ENVÍO DE CONSULTA (WhatsApp Dispatcher)
     --------------------------------------------------------------------------- */
  /**
   * Normaliza el número telefónico, construye el enlace codificado y abre WhatsApp.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - Evento de clic del botón.
   * @returns {void}
   */
  const handlePlanRequest = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    /* 1. Limpieza de caracteres no numéricos y cero inicial */
    const rawDigits = phoneWhattsApp.replace(/\D/g, '');
    const cleanDigits = rawDigits.startsWith('0') ? rawDigits.slice(1) : rawDigits;
    const finalPhone = `598${cleanDigits}`;

    /* 2. Construcción de URL codificada segura */
    const targetUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    /* 3. Apertura en nueva pestaña */
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      style={{ borderTopColor: dynamicColor }}
      className={`
        /* --- Posición --- */
        relative                     /* Contenedor relativo */
        flex                         /* Layout flexible */
        flex-col                     /* Disposición vertical */
        justify-between              /* Separa el encabezado de la botonera inferior */
        ${isFeatured ? 'z-20 -translate-y-3' : 'z-10'} /* Elevación para plan destacado */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el ancho disponible */
        max-w-[320px]                /* Ancho máximo uniforme */
        p-8                          /* Padding interno generoso */

        /* --- Colores --- */
        bg-vete-surface              /* Fondo claro del tema */
        ${isFeatured ? 'shadow-2xl' : 'shadow-sm'} /* Sombra pronunciada si es destacado */

        /* --- Estilo --- */
        rounded-2xl                  /* Bordes redondeados */
        ${isFeatured ? 'border-t-[12px]' : 'border-t-8'} /* Borde superior de acento */

        /* --- Animación --- */
        transition-all               /* Transición fluida */
        duration-300                 /* Tiempo de respuesta de 300ms */
        ${isFeatured ? 'scale-105' : 'scale-100'} /* Aumento de escala */
        hover:shadow-xl              /* Elevación en hover */
      `}
    >
      {/* ===================================================================
         SECCIÓN SUPERIOR: Título y Descripción
         =================================================================== */}
      <div className={`
        /* --- Dimensiones --- */
        mb-6                         /* Margen inferior */

      `}>
        {/* Título del Plan */}
        <h3
          style={{ color: dynamicColor }}
          className={`
            /* --- Dimensiones --- */
            mb-2                     /* Margen inferior */

            /* --- Texto --- */
            text-2xl                 /* Tamaño destacado */
            font-bold                /* Grosor 700 */
            italic                   /* Estilo cursivo editorial */
          `}
        >
          {title}
        </h3>

        {/* Descripción del Plan */}
        <p className={`

          /* --- Dimensiones --- */
          min-h-[60px]               /* Altura mínima para nivelar las tarjetas */

          /* --- Colores --- */
          text-vete-text-muted       /* Color atenuado */

          /* --- Texto --- */
          text-sm                    /* Tamaño de lectura */
          leading-relaxed            /* Altura de línea cómoda */
        `}>
          {description}
        </p>
      </div>

      {/* ===================================================================
         SECCIÓN CENTRAL: Lista de Beneficios
         =================================================================== */}
      <ul className={`
        /* --- Posición --- */
        flex-1                       /* Toma el espacio vertical disponible */

        /* --- Dimensiones --- */
        space-y-4                    /* Espaciado vertical entre ítems */
        mb-8                         /* Margen inferior */

      `}>
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              items-start            /* Alineación al inicio */
              gap-3                  /* Espacio icono-texto */
            `}
          >
            {/* Contenedor del Icono Check */}
            <div className={`
              /* --- Posición --- */
              shrink-0               /* No se deforma */

              /* --- Dimensiones --- */
              mt-1                   /* Ajuste de alineación con texto */
              p-0.5                  /* Padding interno */

              /* --- Colores --- */
              bg-vete-secondary/30   /* Fondo suave derivado */

              /* --- Estilo --- */
              rounded-md             /* Bordes redondeados sutiles */

            `}>
              <Check size={14} style={{ color: dynamicColor }} />
            </div>

            {/* Texto del Beneficio */}
            <span className={`

              /* --- Colores --- */
              text-vete-text-base    /* Color tipográfico principal */

              /* --- Texto --- */
              text-sm                /* Tamaño estándar */
              font-medium            /* Grosor medio (500) */

            `}>
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      {/* ===================================================================
         SECCIÓN INFERIOR: Botón Dinámico de WhatsApp
         =================================================================== */}
      <WhatsAppDynamicButton
        label="Solicitar Plan"
        hoverLabel="Enviar Consulta"
        colorToken={borderColor}
        onClick={handlePlanRequest}
      />
    </article>
  );
};