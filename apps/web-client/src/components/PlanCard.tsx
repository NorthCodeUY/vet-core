// app/vet-core/apps/web-client/src/components/PlanCard.tsx
 
import { Check } from 'lucide-react';

interface PlanProps {
  title: string;
  description: string;
  benefits: string[];
  borderColor: string; 
  isFeatured?: boolean;
}

// <!DMI> Tarjeta para represetear los palnes de la empresa 
// <!> Esta tarjeta tiene que tener una logica integrada pqra que al apretar un mensaje mande un mensaje tipo lindo estoy interesado en el plan x dependindo el qeu diriegido al portal administratio  para qeu mejor 
export const PlanCard = ({ title, description, benefits, borderColor, isFeatured = false }: PlanProps) => {
  return (
    <div className={`flex flex-col p-8 bg-white rounded-2xl shadow-sm border-t-8 transition-all hover:shadow-xl w-full max-w-[320px]`}
         style={{ borderColor: borderColor }}>
      
      <div className="mb-6">
        {/* Usamos tu fuente Newsreader o serif para el título si la tienes, sino sans */}
        <h3 className="text-2xl font-bold mb-2 italic" style={{ color: borderColor }}>
          {title}
        </h3>
        <p className="text-vete-text-light text-sm opacity-80 leading-relaxed min-h-[60px]">
          {description}
        </p>
      </div>

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

      <button className={`w-full py-3 rounded-xl text-vete-small font-black uppercase tracking-widest transition-all
        ${isFeatured 
          ? 'bg-vete-primary text-white hover:bg-vete-accent' 
          : 'border-2 border-vete-soft text-vete-soft hover:bg-vete-soft hover:text-white'
        }`}>
        Consultar
      </button>
    </div>
  );
};