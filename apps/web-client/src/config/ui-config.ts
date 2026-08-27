import { ProductCardV1 } from '../components/ProductCard/ProductCardV1';
import { ProductCardV2 } from '../components/ProductCard/ProductCardV2';

const CARD_VERSIONS = {
  v1: ProductCardV1,
  v2: ProductCardV2,
} as const;

type CardVersion = keyof typeof CARD_VERSIONS;

const version = (import.meta.env.VITE_CARD_VERSION || 'v1') as CardVersion;

export const UI_CONFIG = {
  productCardVersion: version,

  getProductCardComponent: () => {
    return CARD_VERSIONS[version];
  },
};
