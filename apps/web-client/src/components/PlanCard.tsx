// app/vet-core/apps/web-client/src/components/PlanCard.tsx
 

/* =============================================================================
   COMPONENTE: TARJETA DE PLAN O PROMOCIÓN (PlanCard)
   ============================================================================= */

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
 * mediante elevación y sombras, y administra el disparo del mensaje pre-armado
 * hacia WhatsApp mediante el botón interactivo `WhatsAppDynamicButton`.
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
     ASIGNACIÓN DE COLOR DINÁMICO
     --------------------------------------------------------------------------- */
  /* Extrae la variable CSS del tema activo correspondiente al token */
  const dynamicColor =  `rgb(var(--${borderColor}))`;

  /* ---------------------------------------------------------------------------
     MANEJADOR DE ENVÍO DE CONSULTA (WhatsApp Dispatcher)
     --------------------------------------------------------------------------- */
  /**
   * Normaliza el número telefónico, construye el enlace codificado y abre WhatsApp.
   * 
   * @function handlePlanRequest
   * @returns {void}
   */
  const handlePlanRequest = () => {
    /* 1. Limpiamos el número (Quitamos espacios y el 0 inicial) */
    const rawPhone = phoneWhattsApp.replace(/\s/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    
    /* 2. Construimos la URL con el mensaje personalizado del plan */
    const url = `https://wa.me/598${cleanPhone}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    /* 3. Abrimos el chat */
    window.open(url, '_blank');
  };

  return (
    <div className={`flex flex-col p-8 bg-white rounded-2xl shadow-sm 
      border-t-8 transition-all hover:shadow-xl w-full 
        
        ${isFeatured // CLASES PARA EL EFECTO LEVANTADO
          ? 'scale-105 z-18 shadow-2xl -translate-y-3 border-t-[12px]' // Más grande, arriba de las otras y más sombra
          : 'scale-100 z-10 shadow-sm border-t-8' // Tamaño normal
        }
      w-full
      max-w-[320px]`}
         // Color de borde superior 
         style={{ borderTopColor: dynamicColor }}>
      
      <div className="mb-6">
        
        {/* Titulo del plan*/}
        <h3 className={`
        text-2xl font-bold mb-2 italic`}
          style={{ color: dynamicColor }}> {/* Asigno el color que paso por parametro a el titulo */}
          {title}
        </h3>
        
        {/* Descripcion del plan*/}
        <p className="text-vete-text-light text-sm opacity-80 leading-relaxed min-h-[60px]">
          {description}
        </p>
      </div>

      {/* Beneficios del plan - Servicos*/}
      <ul className="flex-1 space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-1 bg-vete-secondary/30 p-0.5 rounded-md">
               <Check size={14} style={{ color: dynamicColor }} />
            </div>
            <span className={`text-vete-text-light text-vete-body font-medium`}>
              {benefit}
            </span>
          </li>
        ))}
      </ul>
      {/* Boton para enviar mensaje a whatsapp */}
      <WhatsAppDynamicButton 
        label="Solicitar Plan"
        hoverLabel="Enviar Consulta"
        phone={phoneWhattsApp}
        colorToken={borderColor}
        onClick={handlePlanRequest}
      />

    </div>
  );

};


