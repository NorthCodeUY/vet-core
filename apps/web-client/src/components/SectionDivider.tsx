// apps/web-client/src/components/SectionDivider.tsx
/* =============================================================================
   COMPONENTE: DIVISOR ONDULATORIO DE SECCIONES (SectionDivider)
   ============================================================================= */

import React from 'react';
import OndaInferior from '../assets/branding/terminacionInferior.svg?react';

/**
 * Propiedades del componente `SectionDivider`.
 * 
 * @interface SectionDividerProps
 * @property {string} topColor - Clase de color de fondo de Tailwind correspondiente a la sección superior inmediata.
 * @property {string} bottomColor - Clase de color de texto o relleno de Tailwind que se fusiona con la sección inferior.
 * @property {boolean} [isReversed=false] - Permite invertir verticalmente la orientación de la onda mediante rotación de 180°.
 */
export interface SectionDividerProps {
  topColor: string;
  bottomColor: string;
  isReversed?: boolean;
}

/**
 * Divisor visual orgánico para transiciones fluidas entre secciones (`SectionDivider`).
 * 
 * Utiliza un gráfico SVG vectorial adaptable (`preserveAspectRatio="none"`) para
 * eliminar cortes rectos y generar una transición ondulatoria continua entre dos
 * bloques con diferentes colores de fondo.
 *
 * @component
 * @param {SectionDividerProps} props - Propiedades de color y orientación.
 * @returns {JSX.Element} Contenedor con la forma ondulatoria escalable.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  topColor,
  bottomColor,
  isReversed = false,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`
        /* --- Posición --- */
        relative                     /* Contexto de posicionamiento */
        overflow-hidden              /* Evita desbordamiento de píxeles */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho de pantalla */

        /* --- Colores --- */
        ${topColor}                  /* El contenedor adopta el color de la sección SUPERIOR */

        /* --- Texto --- */
        leading-none                 /* Elimina espaciados residuales de línea */

      `}
    >
      <OndaInferior
        preserveAspectRatio="none"
        className={`
          /* --- Posición --- */
          block                      /* Comportamiento en bloque para evitar espacios inferiores */

          /* --- Dimensiones --- */
          w-full                     /* Estira la onda en todo el ancho */
          h-[40px]                   /* Altura compacta en dispositivos móviles */
          sm:h-[80px]                /* Altura intermedia en tablets */
          md:h-[120px]               /* Altura completa en pantallas de escritorio */

          /* --- Colores --- */
          ${bottomColor}             /* El SVG vectorial adopta el color de la sección INFERIOR */

          /* --- Animación --- */
          ${isReversed ? 'rotate-180' : 'rotate-0'} /* Invierte la curva si aplica */
        `}
      />
    </div>
  );
};

export default SectionDivider;