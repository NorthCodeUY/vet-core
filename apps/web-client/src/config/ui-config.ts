import { ProductCardV1 } from '../components/ProductCard/ProductCardV1';
import { ProductCardV2 } from '../components/ProductCard/ProductCardV2';
import { HeroSessionV1 } from '../pages/landing/sessions/HeroSection/HeroSectionV1';
import { HeroSessionV2 } from '../pages/landing/sessions/HeroSection/HeroSectionV2';

/* --- Mapeo de Tarjetas --- */
const CARD_VERSIONS = {
  v1: ProductCardV1,
  v2: ProductCardV2,
} as const;

type CardVersion = keyof typeof CARD_VERSIONS;
const cardVersion = (import.meta.env.VITE_CARD_VERSION || 'v2') as CardVersion;

/* --- Mapeo de Heros --- */
const Hero_VERSIONS = {
  v1: HeroSessionV1,
  v2: HeroSessionV2,
} as const;

type HeroVersion = keyof typeof Hero_VERSIONS;
const HeroVersion = (import.meta.env.VITE_Hero_VERSION || 'v1') as HeroVersion;

/* --- Configuración Global UI --- */
export const UI_CONFIG = {
  productCardVersion: cardVersion,
  HeroVersion: HeroVersion,

  getProductCardComponent: () => {
    return CARD_VERSIONS[cardVersion];
  },
  getHeroComponent: () => {
    return Hero_VERSIONS[HeroVersion];
  },
};