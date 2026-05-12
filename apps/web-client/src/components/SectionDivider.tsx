// /app/vet-core/apps/web-client/src/components/SectionDivider.tsx
import OndaInferior from '../assets/branding/terminacionInferior.svg?react';

// <!> Esto no lo tengo claro es como una manera de definir los paramotros pero tengo que saber mas para documetar 
interface DividerProps {
  topColor: string;    // <!DMI> Color que va por debajo de la curva  el del Div contenedor 
  bottomColor: string; // <!DMI> Color que va por encima de la curva el del SVG 
}

//<!DMI> 
export const SectionDivider = ({ topColor, bottomColor }: DividerProps) => {
  return (
    // El div contenedor toma el color de la sección de ARRIBA
    <div className={`w-full leading-none overflow-hidden ${topColor}`}>
      <OndaInferior 
        // El SVG en sí toma el color de la sección de ABAJO
        className={`w-full h-[50px] md:h-[120px] block ${bottomColor}`} 
        preserveAspectRatio="none"
      />
    </div>
  );
};