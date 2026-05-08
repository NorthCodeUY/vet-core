// app/vet-core/apps/web-client/src/components/ServiceCard.tsx

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import {TractorIcon} from 'lucide-react';
import PequenosAIcon from '../assets/branding/guella.svg?react';
import EquinoIcon from '../assets/branding/caballo.svg?react';
import { WhatsAppDynamicButton } from './WhatsAppDynamicButton.tsx';

// EL MAPEADOR: Esto traduce el texto del JSON a un componente real
const IconMap: Record<string, React.ReactNode> = {
  produccion: <TractorIcon className="w-8 h-8 text-vete-primary" />,
  pequeñosAnimales: <PequenosAIcon className="w-8 h-8 text-vete-primary" />,
  Equino: <EquinoIcon className="w-8 h-8 text-vete-primary" />,
};

interface Props {
  title: string;
  description: string;
  items: string[];
  iconKey: string; // Recibimos la clave del icono del JSON
  message: string,
  phone: string
}

export const ServiceCard = ({ title, description, items, iconKey, message, phone }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir y contraer la tarjeta

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
           {IconMap[iconKey] || <PequenosAIcon />} 
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

        <WhatsAppDynamicButton 
          label="Realizar Consultar"
          phone={phone}
          message={message}
          colorToken="vete-primary"
        />

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