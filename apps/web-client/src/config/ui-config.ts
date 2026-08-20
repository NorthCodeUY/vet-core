import { ProductCardV1 } from '../components/ProductCardV1';
import { ProductCardV2 } from '../components/ProductCardV2';

const CARD_VERSIONS = {
  v1: ProductCardV1,
  v2: ProductCardV2,
};

export const UI_CONFIG = {
  productCardVersion: (import.meta.env.VITE_CARD_VERSION as keyof typeof CARD_VERSIONS) || 'v1',
  
  /**
   * Devuelve dinámicamente el componente según la versión de .env
   */
  getProductCardComponent: () => {
    return CARD_VERSIONS[UI_CONFIG.productCardVersion] || ProductCardV1;
  }
};