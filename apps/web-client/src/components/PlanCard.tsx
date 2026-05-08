// app/vet-core/apps/web-client/src/components/PlanCard.tsx
 
import { Check } from 'lucide-react';
import { WhatsAppDynamicButton } from "./WhatsAppDynamicButton.tsx";

interface PlanProps {
  title: string;
  description: string;
  benefits: string[];
  borderColor: string; 
  isFeatured?: boolean;
  mensajeWhatsApp: string;
  phoneWhattsApp: string;
}

// <!DMI> Tarjeta para represetear los palnes de la empresa 
// <!> Esta tarjeta tiene que tener una logica integrada pqra que al apretar un mensaje mande un mensaje tipo lindo estoy interesado en el plan x dependindo el qeu diriegido al portal administratio  para qeu mejor 
export const PlanCard = ({ title, description, benefits, borderColor, isFeatured = false, mensajeWhatsApp, phoneWhattsApp }: PlanProps) => {
  
const dynamicColor =  `rgb(var(--${borderColor}))`;

const hoverBackgrounds: Record<string, string> = {
    'vete-primary': 'hover:bg-vete-primary',
    'vete-soft': 'hover:bg-vete-soft',
    'vete-tertiary': 'hover:bg-vete-tertiary',
    'vete-accent': 'hover:bg-vete-accent',
  };

// Obtenemos la clase de hover correspondiente al token
const hoverBgClass = hoverBackgrounds[borderColor] || 'hover:bg-gray-500';

// Funcion hacer clic 
const handleWhatsApp = () => {
  window.open(`https://wa.me/59892444510?text=Hola%20estoy%20interesado%20en%20el%20plan%20${title}`);
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
         
         style={{ borderTopColor: dynamicColor }}>
      
      <div className="mb-6">
        
        {/* Titulo del plan*/}
        <h3 className={`text-2xl font-bold mb-2 italic text-${borderColor}`}>
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
               <Check size={14} className="text-vete-primary" />
            </div>
            <span className="text-vete-text-light text-vete-body font-medium">
              {benefit}
            </span>
          </li>
        ))}
      </ul>

       <WhatsAppDynamicButton 
        label="Solicitar Plan"
        phone={mensajeWhatsApp}
        message={phoneWhattsApp}
        colorToken="vete-primary"
      />

    </div>
  );

};


