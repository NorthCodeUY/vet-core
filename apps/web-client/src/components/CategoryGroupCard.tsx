// apps/web-client/src/components/CategoryGroupCard.tsx 

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { ProductCard } from './ProductCard.tsx';
interface CategoryGroupProps{
  title: string;
  data: any[];  
}
// Tarjeta para mostrar productos por categoria 

const CategoryGroupCard = ({ title, data }: prop) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lógica de visualización:
  // Desktop: Siempre muestra 5.
  // Móvil: Si no está expandido muestra 2, si está expandido muestra 5.
  const mobileLimit = isExpanded ? 5 : 2;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8 border-b border-vete-primary/30 pb-4">
        <h3 className="text-5xl font-black text-vete-primary leading-none uppercase italic">{title}</h3>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-vete-primary font-bold hover:underline flex items-center gap-2 transition-all"
        >
          <span className="hidden sm:inline">{isExpanded ? 'Ver menos' : 'Ver catálogo completo'}</span>
          {isExpanded ? <ChevronUp size={20} /> : <span className="sm:hidden">Ver todos</span>}
          {!isExpanded && <span className="hidden sm:inline">➔</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-6 justify-items-center">
        {data.map((p, index) => {
          // Ocultamos elementos según el índice y el estado
          const isHiddenOnMobile = index >= mobileLimit;
          const isHiddenOnDesktop = index >= 5;

          return (
            <div 
              key={p.id} 
              className={`
                ${isHiddenOnMobile ? 'hidden' : 'flex'} 
                ${isHiddenOnDesktop ? 'xl:hidden' : 'xl:flex'}
                animate-in fade-in duration-300
              `}
            >
              <ProductCard title={p.titulo} desc={p.descripcion} price={p.precio} img={p.imagen} />
            </div>
          );
        })}
      </div>
    </div>
  );
};