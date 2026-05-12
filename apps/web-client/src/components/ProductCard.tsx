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
