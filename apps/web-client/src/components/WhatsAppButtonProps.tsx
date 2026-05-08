// /apps/web-client/src/components/WhatsAppButtonProps.tsx

import WhatSapp_Icon from '../assets/branding/WhatSapp_Cuadrado.svg?react';

/**
 * Componente de botón de WhatsApp expandible y reversible.
 * 
 * @param {string} label - El texto inicial (ej: "Administración").
 * @param {string} phone - El número de teléfono con formato (ej: "092 444 510").
 * @param {string} bgColor - Clase de Tailwind para el fondo (ej: "bg-vete-primary").
 * @param {boolean} isReversed - Si es true, el icono va a la derecha y el texto se expande a la izquierda.
 */
interface WhatsAppButtonProps {
  label: string;
  phone: string;
  bgColor: string;
  isReversed?: boolean;
}

export const WhatsAppButton = ({ label, phone, bgColor, isReversed = false }: WhatsAppButtonProps) => {
  
  const cleanPhone = phone.replace(/\s/g, '');

  const directionClass = isReversed ? "flex-row-reverse" : "flex-row";
  
  // El texto solo debe tener posición absoluta en pantallas grandes (sm: o superior)
  const textPositionClass = isReversed ? "sm:right-11 text-right" : "sm:left-11 text-left";

  return (
    <div className="relative z-30 pointer-events-auto">
      <a 
        href={`https://wa.me/598${cleanPhone}`} 
        target="_blank" 
        rel="noreferrer"
        className={`group relative flex items-center justify-center sm:justify-start px-0 sm:px-3 w-10 sm:w-40 h-10 ${bgColor} backdrop-blur-md rounded-full text-vete-secondary shadow-lg transition-all duration-300 border border-white/20 overflow-hidden hover:opacity-80 ${directionClass}`}
      >
        <WhatSapp_Icon 
          className="w-5 h-5 shrink-0 text-vete-secondary z-10" 
          preserveAspectRatio="none" 
        />
      
        {/* 
           CAMBIO EN SPANS:
           - hidden: El texto no existe en móvil.
           - sm:block: El texto aparece a partir del breakpoint 'sm'.
        */}
        <span className={`hidden sm:block absolute ${textPositionClass} font-bold text-sm transition-opacity duration-300 opacity-100 group-hover:opacity-0`}>
          {label}
        </span>
        
        <span className={`hidden sm:block absolute ${textPositionClass} font-bold text-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100`}>
          {phone}
        </span>
      </a>
    </div>
  );
};
