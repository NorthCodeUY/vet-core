// app/vet-core/apps/web-client/src/components/PlanCard.tsx
 
import { Check } from 'lucide-react';
import { WhatsAppDynamicButton } from "./WhatsAppDynamicButton.tsx";


// <!DMI> Tarjeta para represetear los palnes de la empresa 
// <!> Esta tarjeta tiene que tener una logica integrada pqra que al apretar un mensaje mande un mensaje tipo lindo estoy interesado en el plan x dependindo el qeu diriegido al portal administratio  para qeu mejor 

interface PlanCardProps {
  title: string;
  description: string;
  benefits: string[];
  borderColor: string; 
  isFeatured?: boolean;
  mensajeWhatsApp: string;
  phoneWhattsApp: string;
}


export const PlanCard = ({ title, description, benefits, borderColor, isFeatured = false, mensajeWhatsApp, phoneWhattsApp }: PlanCardProps) => {
  
  const dynamicColor =  `rgb(var(--${borderColor}))`;

  /* --- Lógica de Envío (Fachada de Acción) --- */
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
        {/* <!> Aca hay que corrregir el problema que haora el boton aseipta 
        la funcion clik hay que determinar por aca que quiero mandar el mensaje 
        caps traer por parametro enves de el mensaje el clik para que para atras
         aga el mensaje  */}
      
      
      
      
      
      
       {/* <WhatsAppDynamicButton 
        label="Solicitar Plan"
        phone={phoneWhattsApp}
        message={mensajeWhatsApp}
        colorToken={borderColor}
      /> */}






      {/* 
          <!> ADAPTACIÓN: 
          Ahora pasamos 'onClick' en lugar de 'message'. 
          La tarjeta decide QUÉ mensaje mandar, el botón solo lo ejecuta.
      */}
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


