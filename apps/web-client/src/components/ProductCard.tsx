/* --- apps/web-client/src/components/ProductCard.tsx --- */

import { UI_CONFIG } from '../config/ui-config';
import type { ApiProduct } from '../types/product_types';

interface Props {
  producto: ApiProduct;
}

export const ProductCard = (props: Props) => {
  const Component = UI_CONFIG.getProductCardComponent();
  
  // ✅ Pasa las props al componente resuelto dinámicamente
  return <Component {...props} />;
};