// app/vet-core/apps/web-client/src/components/ServiceCard.tsx

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  items: string[];
  icon: React.ReactNode;
}

export const ServiceCard = ({ title, description, items, icon }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Solo mostramos los primeros 3 si no está expandido
  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <>
      {/* Overlay para oscurecer el fondo al expandir */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsExpanded(false)} />
      )}

      <div className={`relative flex flex-col p-8 rounded-[20px] transition-all duration-300 w-full max-w-[350px]
        ${isExpanded ? 'z-50 scale-105 bg-white' : 'z-10 bg-white shadow-sm hover:shadow-md'}`}>
        
        {/* Icono en contenedor cuadrado (como en Figma) */}
        <div className="w-14 h-14 bg-vete-secondary rounded-[10px] flex items-center justify-center mb-6 self-center">
          <div className="text-vete-primary italic font-black">
            {icon}
          </div>
        </div>

        {/* Título y Descripción */}
        <h3 className="text-vete-primary text-2xl font-bold mb-3 text-center">{title}</h3>
        <p className="text-vete-text-light text-base opacity-70 mb-6 text-center leading-relaxed">
          {description}
        </p>

        {/* Lista de Items */}
        <ul className="space-y-4 mb-8">
          {visibleItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-vete-text-light font-medium animate-in fade-in">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full shrink-0" />
              <span className="text-lg leading-none">{item}</span>
            </li>
          ))}
        </ul>

        {/* Botón Consultar (Estilo Figma outline) */}
        <button className="w-full py-3 rounded-[10px] border border-stone-600 text-stone-600 font-bold hover:bg-stone-50 transition-colors mb-4">
          Consultar
        </button>

        {/* Flecha de expansión */}
        {hasMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mx-auto text-vete-primary hover:scale-110 transition-transform"
          >
            <ChevronDown className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </>
  );
};