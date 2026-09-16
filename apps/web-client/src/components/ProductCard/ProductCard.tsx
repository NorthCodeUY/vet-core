import { UI_CONFIG } from '../config/ui-config';

/**
 * Componente que renderiza una tarjeta de producto
 * 
 * Utiliza la configuración dinámica para obtener el componente de tarjeta de producto
 * 
 * @param {Object} props - Props del componente
 * @returns {React.ComponentType} - Componente de tarjeta de producto
 */
export const ProductCard = (props: any) => {
  const Component = UI_CONFIG.getProductCardComponent();
  return <Component {...props} />;
};