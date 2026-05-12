import WhatSapp_Icon from '../assets/branding/WhatSapp_Cuadrado.svg?react';
import { useState } from 'react'; // 1. Importamos useState

/**
 * Componente de Botón WhatsApp Dinámico
 * @param label - Texto que se muestra inicialmente (ej: "Consultar")
 * @param phone - El número de teléfono (ej: "092 444 510")
 * @param message - El texto predefinido para el chat de WhatsApp
 * @param colorToken - El nombre del color en el config (ej: "vete-primary")
 */
interface WhatsAppProps {
  label: string;
  phone: string;
  message: string;
  colorToken: string;
}

// Mapa de clases para que Tailwind las detecte correctamente
const hoverClasses: Record<string, string> = {
  'vete-primary': 'hover:bg-vete-primary',
  'vete-soft': 'hover:bg-vete-soft',
  'vete-tertiary': 'hover:bg-vete-tertiary',
  'vete-accent': 'hover:bg-vete-accent',
};

export const WhatsAppDynamicButton = ({ label = "Contacto", phone, message, colorToken }: WhatsAppProps) => {
  
  // Limpieza de datos para el link
  const cleanPhone = phone.replace(/\s/g, ''); // Elimina los espacios en el número de teléfono
  const dynamicColor = `rgb(var(--${colorToken}))`; // Obtiene el color dinámicamente desde el config
  const hoverBg = hoverClasses[colorToken] || 'hover:bg-gray-500'; // Obtiene el color de hover dinámicamente desde el config
  const [isHovered, setIsHovered] = useState(false); // Estado para manejar el hover
  
  // Función de envío
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic afecte a componentes padres
    const url = `https://wa.me/598${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button 
      onClick={handleWhatsApp}
      onMouseEnter={() => setIsHovered(true)} // 3. Activamos hover
      onMouseLeave={() => setIsHovered(false)} // 4. Desactivamos hover
      className={`

        /* Estructura y Animación */
        w-full py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300
        /* Tipografía */
        text-vete-small font-black uppercase tracking-widest 
        /* Borde y Grupo */
        border-2 group
        /* EFECTO HOVER */
        ${hoverBg} hover:shadow-lg active:scale-95
        /* Animación */
        duration-300  overflow-hidden
      `}
      style={{ 
        borderColor: dynamicColor,
        // <!> Sacar color: dynamicColor,
        //LA CLAVE: Si está en hover, forzamos blanco, sino el dinámico
        color: isHovered ? '#FFFFFF' : dynamicColor 
      }}
    >
      {/* Icono de WhatsApp - Cambia a blanco en hover gracias a fill-current */}
      <WhatSapp_Icon 
        className="w-5 h-5 shrink-0 fill-current transition-colors duration-300 z-10" 
      />

      {/* CONTENEDOR DE TEXTOS: Efecto de intercambio */}
      <div className="relative h-5 flex items-center justify-center min-w-[120px]`">
        {/* Texto 1: El Label (Aparece por defecto) */}
        <span className="transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2">
          {label}
        </span>
        
        {/* Texto 2: El Número (Aparece en Hover) */}
        <span className="absolute transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap">
          Enviar Mensaje
        </span>
      </div>
    </button>
  );
};