import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ServiceProps {
  title: string;
  description: string;
  items: string[];
  icon: React.ReactNode;
  limit?: number; // Cuántos ítems mostrar por defecto
}

export const ServiceCard = ({ title, description, items, icon, limit = 3 }: ServiceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lógica para mostrar solo los permitidos o todos
  const hasMore = items.length > limit;
  const visibleItems = isExpanded ? items : items.slice(0, limit);

  return (
    <>
      {/* 1. OVERLAY: Oscurece el resto de la web cuando se expande */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setIsExpanded(false)} // Cierra al hacer clic fuera
        />
      )}

      {/* 2. TARJETA */}
      <div className={`
        relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300
        ${isExpanded ? 'z-50 scale-105 shadow-2xl' : 'z-10 bg-vete-card-white shadow-sm'}
        bg-white w-full max-w-[350px] min-h-[420px]
      `}>
        
        {/* Icono en cuadrado */}
        <div className="w-16 h-16 bg-vete-soft/30 rounded-2xl flex items-center justify-center mb-6 text-vete-primary">
          {icon}
        </div>

        {/* Títulos */}
        <h3 className="text-vete-h3 font-black text-vete-primary mb-3 leading-tight uppercase">
          {title}
        </h3>
        <p className="text-vete-small text-vete-dark opacity-70 mb-6">
          {description}
        </p>

        {/* Lista de Items */}
        <ul className="space-y-3 mb-auto">
          {visibleItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-vete-body text-vete-dark font-medium">
              <span className="text-vete-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-vete-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Botón de Expansión (Flecha SVG) */}
        {hasMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 mx-auto p-2 text-vete-primary hover:bg-vete-soft/20 rounded-full transition-all"
          >
            <ChevronDown 
              className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} 
              size={28} 
            />
          </button>
        )}
      </div>
    </>
  );
};