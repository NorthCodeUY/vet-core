// apps/web-client/src/utils/categoryHelpers.tsx 

import { Dog, Cat, Leaf, Fish } from 'lucide-react';

/**
 * Este objeto mapea el texto del backend con un componente de icono.
 * Si el backend devuelve "Perro", aquí sabemos que debemos pintar el icono <Dog />
 */
export const SUBCATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Perro": <Dog size={16} />,
  "Gato": <Cat size={16} />,
  "Plantas": <Leaf size={16} />,
  "Peces": <Fish size={16} />,
};