//apps/web-client/src/components/WhatsAppDynamicButton.tsx

import React from 'react';
import WhatSapp_Icon from '../assets/branding/WhatSapp_Cuadrado.svg?react';

/**
 * Propiedades del componente `WhatsAppDynamicButton`.
 * 
 * @interface WhatsAppDynamicButtonProps
 * @property {string} [label='Contacto'] - Texto inicial visible en estado de reposo.
 * @property {string} [hoverLabel='Enviar Mensaje'] - Texto visible al pasar el cursor (hover).
 * @property {function(React.MouseEvent<HTMLButtonElement>): void} onClick - Función de despacho que ejecuta la acción al presionar.
 * @property {string} colorToken - Token semántico del tema para borde y texto (ej: 'vete-primary', 'vete-secondary').
 * @property {boolean} [disabled=false] - Deshabilita la interacción visual y funcional del botón.
 */
export interface WhatsAppDynamicButtonProps {
  label?: string;
  hoverLabel?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  colorToken: string;
  disabled?: boolean;
}

/**
 * Diccionario de clases estáticas seguras para forzar la compilación en Tailwind CSS.
 */
const COLOR_STYLES: Record<string, string> = {
  'vete-primary': 'border-vete-primary text-vete-primary hover:bg-vete-primary',
  'vete-secondary': 'border-vete-secondary text-vete-secondary hover:bg-vete-secondary',
  'vete-tertiary': 'border-vete-tertiary text-vete-tertiary hover:bg-vete-tertiary',
  'vete-soft': 'border-vete-soft text-vete-soft hover:bg-vete-soft',
  'vete-error': 'border-vete-error text-vete-error hover:bg-vete-error',
};

/**
 * Botón interactivo de presentación para llamadas a la acción de WhatsApp (`WhatsAppDynamicButton`).
 * 
 * Ofrece una microinteracción fluida con animación vertical entre dos etiquetas de texto,
 * icono SVG institucional con color heredado (`fill-current`) y delegación pura de eventos.
 *
 * @component
 * @param {WhatsAppDynamicButtonProps} props - Propiedades de configuración visual y callback.
 * @returns {JSX.Element} Botón de acción con animación interactiva.
 */
export const WhatsAppDynamicButton: React.FC<WhatsAppDynamicButtonProps> = ({
  label = 'Contacto',
  hoverLabel = 'Enviar Mensaje',
  onClick,
  colorToken,
  disabled = false,
}) => {
  /* 1. Mapeo de estilos según el token semántico activo */
  const activeStyles = COLOR_STYLES[colorToken] || COLOR_STYLES['vete-primary'];

  /* 2. Control de propagación y estado deshabilitado */
  const handleInternalClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (!disabled) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInternalClick}
      disabled={disabled}
      className={`
        /* --- Posición --- */
        relative                     /* Contenedor relativo para textos absolutos */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */
        gap-3                        /* Separación entre icono y texto */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho del contenedor */
        py-3                         /* Padding vertical de 0.75rem */
        px-6                         /* Padding horizontal de 1.5rem */

        /* --- Colores --- */
        ${activeStyles}              /* Borde, texto y fondo inyectados dinámicamente */
        hover:text-white             /* Texto blanco en contraste al pasar el cursor */

        /* --- Texto --- */
        text-[10px]                  /* Tamaño tipográfico micro */
        font-black                   /* Grosor tipográfico máximo (900) */
        uppercase                    /* Mayúsculas institucionales */
        tracking-widest              /* Espaciado de letras amplio */

        /* --- Estilo --- */
        border-2                     /* Borde visible de 2px */
        rounded-xl                   /* Bordes redondeados */
        overflow-hidden              /* Contiene el desplazamiento de la animación */

        /* --- Animación --- */
        transition-all               /* Transición fluida para todos los cambios */
        duration-300                 /* Velocidad de transición de 300ms */
        active:scale-95              /* Efecto de pulsación táctil */
        disabled:opacity-30          /* Atenuación en estado deshabilitado */
        group                        /* Permite animar los elementos hijos en hover */
      `}
    >
      {/* Icono de WhatsApp con color dinámico */}
      <WhatSapp_Icon
        className={`
          /* --- Posición --- */
          z-10                       /* Por encima del fondo */

          /* --- Dimensiones --- */
          w-5                        /* Ancho fijo de 1.25rem */
          h-5                        /* Alto fijo de 1.25rem */
          shrink-0                   /* Evita compresión del icono */

          /* --- Colores --- */
          fill-current               /* Hereda el color tipográfico activo */

          /* --- Animación --- */
          transition-colors          /* Transición suave de color */
          duration-300               /* Tiempo de 300ms */
        `}
      />

      {/* Contenedor de Textos Animados */}
      <div className={`
        /* --- Posición --- */
        relative                     /* Contenedor relativo para textos flotantes */
        flex                         /* Flexbox */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */
        z-10                         /* Capa superior */

        /* --- Dimensiones --- */
        h-5                          /* Altura fija de 1.25rem */
        min-w-[120px]                /* Ancho mínimo para estabilizar el botón */
      `}>
        {/* Texto en Estado de Reposo */}
        <span className={`
          /* --- Animación --- */
          transition-all             /* Transición fluida */
          duration-300               /* 300ms */
          opacity-100                /* Visible en reposo */
          group-hover:opacity-0      /* Se oculta en hover */
          group-hover:-translate-y-2 /* Se desplaza hacia arriba */
        `}>
          {label}
        </span>

        {/* Texto en Estado Hover */}
        <span className={`
          /* --- Posición --- */
          absolute                   /* Flotante en el mismo contenedor */
ç
          /* --- Texto --- */
          whitespace-nowrap          /* Evita cortes de línea */

          /* --- Animación --- */
          transition-all             /* Transición fluida */
          duration-300               /* 300ms */
          opacity-0                  /* Oculto en reposo */
          translate-y-2              /* Posicionado abajo */
          group-hover:opacity-100    /* Aparece en hover */
          group-hover:translate-y-0  /* Se acomoda al centro */
        `}>
          {hoverLabel}
        </span>
      </div>
    </button>
  );
};