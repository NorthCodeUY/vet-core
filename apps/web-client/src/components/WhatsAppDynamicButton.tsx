
// apps/web-client/src/components/WhatsAppDynamicButton.tsx

import WhatSapp_Icon from '../assets/branding/WhatSapp_Cuadrado.svg?react';
import { useState } from 'react'; // 1. Importamos useState

/**
 * Componente de Botón WhatsApp Dinámico
 * @param label - Texto que se muestra inicialmente (ej: "Consultar")
 * @param phone - El número de teléfono (ej: "092 444 510")
 * @param onClick - Función que se ejecuta al hacer clic en el botón
 * @param colorToken - El nombre del color en el config (ej: "vete-primary"
 * @param disabled - Controla la visibilidad del botón
 */
interface WhatsAppProps {
  label: string;
  hoverLabel: string;
  phone: string;
  onClick: (e: React.MouseEvent) => void; // <!> Ahora recibe la acción desde afuera
  colorToken: string;
  disabled?: boolean; // <!> AGREGAR ESTA LÍNEA
}

// Mapa de clases para que Tailwind las detecte correctamente
const hoverClasses: Record<string, string> = {
  'vete-primary': 'hover:bg-vete-primary',
  'vete-soft': 'hover:bg-vete-soft',
  'vete-tertiary': 'hover:bg-vete-tertiary',
  'vete-accent': 'hover:bg-vete-accent',
};

export const WhatsAppDynamicButton = ({ 
  label = "Contacto", 
  hoverLabel = "Enviar Mensaje",
  phone, 
  onClick, 
  colorToken,
  disabled = false 

}: WhatsAppProps) => {
  
  // Limpieza de datos para el link





  const [isHovered, setIsHovered] = useState(false); // Estado para manejar el hover  
  const dynamicColor = `rgb(var(--${colorToken}))`; // Obtiene el color dinámicamente desde el config
  const hoverBg = hoverClasses[colorToken] || 'hover:bg-gray-500'; // Obtiene el color de hover dinámicamente desde el config
  
  

  /* --- Handler Interno para proteger el evento --- */
  const handleInternalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitamos que el click suba a la tarjeta o drawer
    if (!disabled) {
      onClick(e); // Ejecutamos la función que nos pasaron por props
    }
  };


  return (
     <button 
      onClick={handleInternalClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        borderColor: dynamicColor,
        color: isHovered ? '#FFFFFF' : dynamicColor 
      }}
      className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */
        gap-3                        /* Espacio entre icono y texto */
        relative                     /* Para el efecto de intercambio de texto */

        /* --- Dimensiones --- */
        w-full                       /* Ancho total del contenedor */
        py-3                         /* Padding vertical */
        px-6                         /* Padding horizontal */
        
        /* --- Estilo --- */
        border-2                     /* Borde de 2px */
        rounded-xl                   /* Bordes redondeados */
        overflow-hidden              /* Corta las animaciones de texto */
        
        /* --- Texto --- */
        text-[10px]                  /* Tamaño pequeño institucional */
        font-black                   /* Peso máximo */
        uppercase                    /* Mayúsculas */
        tracking-widest              /* Espaciado de letras */

        /* --- Animación --- */
        transition-all               /* Transición para color y escala */
        duration-300                 /* Velocidad de 300ms */
        ${hoverBg}                   /* Color de fondo dinámico al hover */
        hover:shadow-lg              /* Sombra al pasar el mouse */
        active:scale-95              /* Efecto de presión */
        disabled:opacity-50          /* Transparencia si está bloqueado */
        group                        /* Grupo para animar hijos */
      `}
    >
      {/* Icono de WhatsApp  o */}
      <WhatSapp_Icon 
        className={`
          /* --- Dimensiones --- */
          w-5 h-5 
          /* --- Estilo --- */
          shrink-0                   /* Evita que se aplaste */
          fill-current               /* Toma el color del texto (dynamicColor) */
          /* --- Animación --- */
          transition-colors duration-300 
          z-10                       /* Por encima del fondo */
        `} 
      />

      {/* Contenedor de Textos con Efecto de Intercambio <!> Phone tendria que ser el texto que aparese cuando estoy ensima o alg */}
      <div className="relative h-5 flex items-center justify-center min-w-[120px]">
        <span className="transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2">
          {label}
        </span>


        {/* <!> Ahora usa la prop hoverLabel */}
        <span className="absolute transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap">
          {hoverLabel}
        </span>

        {/* <!> Esto creo que tendria que ser pasado por parametro  */}
        {/* <span className="absolute transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap">
          Enviar Mensaje
        </span> */}
      </div>
    </button>   
  );
};