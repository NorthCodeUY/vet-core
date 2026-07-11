




// 10-JULIO nO BORAR pRODUCTA cAR QEU FUNCIONABA 
// apps/web-client/src/components/ProductCard.tsx

import { ShoppingCart} from 'lucide-react';

interface Props { 
  title: string; 
  desc: string; 
  price: number; 
  img: string; 
}

/**
 * Componente de UI para representar una tarjeta de producto en el catálogo.
 * 
 * @param {string} title - El nombre comercial del producto.
 * @param {string} desc - Una descripción breve o especificación (ej: peso, tamaño).
 * @param {number} price - El valor numérico del producto.
 * @param {string} img - La ruta de la imagen (debe apuntar a /public o ser un asset importado).
 * 
 * @returns {JSX.Element} Una tarjeta con diseño responsivo, formateo de moneda local 
 * e iconos de acción para carrito y WhatsApp.
 */
export const ProductCard = ({ title, desc, price, img }: Props) => (                  
  <div className="bg-vete-soft/50 p-6 rounded-[2rem] flex flex-col gap-2 min-w-[280px]">
    {/* Imagen del producto */}
    <img src={img} alt={title} className="rounded-2xl w-full h-48 object-cover" />
    {/* Titulo del producto */}
    <h4 className="text-vete-primary font-bold text-lg mt-2">{title}</h4>
    {/* Descripcion del producto */}
    <p className="text-vete-  dark text-sm">{desc}</p>
    {/* Precio y botones de accion */}
    <div className="flex justify-between items-center mt-4">
      {/* Precio del producto */}
      <span className="text-vete-primary font-black text-xl">${price.toLocaleString('es-UY')}</span>
      {/* Botones de accion */}
      <div className="flex gap-2">
          {/* Boton de whatsapp */}
          <img src="/images/branding/LogoWhtSapp.svg" alt="WhatsApp" className="w-8 h-8" />
        <div className="bg-vete-primary p-2 rounded-full cursor-pointer">
          {/* Boton de carrito */}
          <ShoppingCart size={16} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);


// 10-Jul ete funciona con la estructura anterior 

// apps/web-client/src/components/CategoryGroupCard.tsx 

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCard } from './ProductCard.tsx';
interface CategoryGroupProps{
  title: string;
  data: any[];  
}
// Tarjeta para mostrar productos por categoria 

export const CategoryGroupCard = ({ title, data }: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Lógica de visualización:
  // Desktop: Siempre muestra 5.
  // Móvil: Si no está expandido muestra 1, si está expandido muestra 5.
  const mobileLimit = isExpanded ? 5 : 1;

  return (
    <div className="w-full">
      {/* Contenedor del titulo*/}
      <div className="flex justify-between items-end mb-8 border-b border-vete-primary/30 pb-4">
        {/* Titulo de la categoria*/}
        <h3 className="text-5xl font-black text-vete-primary leading-none uppercase italic">{title}</h3>
        
        {/* Boton de expandir/ocultar*/}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-vete-primary font-bold hover:underline flex items-center gap-2 transition-all"
        >
          <span className="hidden sm:inline">{isExpanded ? 'Ver menos' : 'Ver mas'}</span>
          {/* Determina si el item es  */}
          {isExpanded && <ChevronUp size={20} />} 
          { !isExpanded && <ChevronDown size={20}/>}
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