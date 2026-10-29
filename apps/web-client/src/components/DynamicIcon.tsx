/**
 * @fileoverview Renderizador Dinámico de Iconos Lucide (DynamicIcon.tsx)
 * 
 * Resuelve dinámicamente el componente vectorial a partir del string provisto
 * por el backend (ej: "Cat", "Dog", "Scissors", "Shirt").
 * 
 * @module components/DynamicIcon
 */

import React from 'react';
import { 
  Cat, 
  Dog, 
  Scissors, 
  Shirt, 
  Sparkles, 
  Fish, 
  Sprout, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  ShoppingBag, 
  Footprints, 
  Bone, 
  Tag, 
  Tractor,
  Link,
  Shield,
  Trash2,
  Home
} from 'lucide-react';

interface DynamicIconProps {
  name?: string | null;
  size?: number;
  className?: string;
}

// Registro tipado de iconos compatibles con el catálogo multi-tenant
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cat,
  Dog,
  Scissors,
  Shirt,
  Sparkles,
  Fish,
  Sprout,
  ShieldCheck,
  Shield,
  Activity,
  Stethoscope,
  ShoppingBag,
  Footprints,
  Bone,
  Tractor,
  Link,
  Trash2,
  Home,
  Tag,
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  size = 14, 
  className = '' 
}) => {
  if (!name) return <Tag size={size} className={className} />;
  
  const IconComponent = ICON_MAP[name] || Tag;
  return <IconComponent size={size} className={className} />;
};