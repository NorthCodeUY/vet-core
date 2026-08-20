/* --- apps/web-client/src/components/WhatsAppDynamicButton.tsx --- */

import WhatSapp_Icon from '../assets/branding/WhatSapp_Cuadrado.svg?react';

interface WhatsAppProps {
  label: string;
  hoverLabel: string;
  phone: string;
  onClick: (e: React.MouseEvent) => void;
  colorToken: string;
  disabled?: boolean;
}

/**
 * Mapa de clases para forzar a Tailwind a generar los estilos.
 * <!> IMPORTANTE: Si usas un color en el .env o JSON, DEBE estar aquí.
 */
const colorStyles: Record<string, string> = {
  'vete-primary': 'border-vete-primary text-vete-primary hover:bg-vete-primary',
  'vete-secondary': 'border-vete-secondary text-vete-secondary hover:bg-vete-secondary',
  'vete-tertiary': 'border-vete-tertiary text-vete-tertiary hover:bg-vete-tertiary',
  'vete-soft': 'border-vete-soft text-vete-soft hover:bg-vete-soft',
  'vete-dark-green': 'border-vete-dark-green text-vete-dark-green hover:bg-vete-dark-green',
};

export const WhatsAppDynamicButton = ({ 
  label = "Contacto", 
  hoverLabel = "Enviar Mensaje",
  onClick, 
  colorToken,
  disabled = false 
}: WhatsAppProps) => {
  
  /* Obtenemos las clases según el token, o usamos gris por defecto si falla */
  const activeStyles = colorStyles[colorToken] || 'border-slate-400 text-slate-400 hover:bg-slate-400';

  const handleInternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onClick(e);
  };

  return (
    <button 
      onClick={handleInternalClick}
      disabled={disabled}
      className={`
        /* --- Posición --- */
        flex items-center justify-center gap-3 relative
        
        /* --- Dimensiones --- */
        w-full py-3 px-6
        
        /* --- Estilo --- */
        border-2 rounded-xl overflow-hidden
        
        /* --- Colores Dinámicos --- */
        ${activeStyles}             /* Aplica borde, texto y fondo hover */
        hover:text-white            /* <!> ESTO ASEGURA EL TEXTO BLANCO */
        
        /* --- Texto --- */
        text-[10px] font-black uppercase tracking-widest
        
        /* --- Animación --- */
        transition-all duration-300
        active:scale-95 
        disabled:opacity-30 
        group                        /* Permite animar a los hijos */
      `}
    >
      {/* Icono de WhatsApp */}
      <WhatSapp_Icon 
        className={`
          /* --- Dimensiones --- */
          w-5 h-5 shrink-0 
          /* --- Colores --- */
          fill-current               /* Sigue el color del texto del botón */
          /* --- Animación --- */
          transition-colors duration-300 
          z-10
        `} 
      />

      {/* Contenedor de Textos */}
      <div className="relative h-5 flex items-center justify-center min-w-[120px] z-10">
        <span className={`
          transition-all duration-300 
          opacity-100 group-hover:opacity-0 group-hover:-translate-y-2
        `}>
          {label}
        </span>

        <span className={`
          absolute whitespace-nowrap
          transition-all duration-300 
          opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
        `}>
          {hoverLabel}
        </span>
      </div>
    </button>   
  );
};