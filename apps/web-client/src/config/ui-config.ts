// app/web-client/src/config/ui-config.ts
/* =============================================================================
   REGISTRO CENTRAL DE VARIANTES VISUALES (UI Component Strategy Registry)
   ============================================================================= */

import React from 'react';

/* --- 1. Importación de Variantes de Tarjetas de Producto --- */
import { ProductCardV1 } from '../components/ProductCard/ProductCardV1';
import { ProductCardV2 } from '../components/ProductCard/ProductCardV2';

/* --- 2. Importación de Variantes de Portadas (Hero) --- */
import { HeroSessionV1 } from '../pages/landing/sessions/HeroSection/HeroSectionV1';
import { HeroSessionV2 } from '../pages/landing/sessions/HeroSection/HeroSectionV2';
import { HeroSessionV3 } from '../pages/landing/sessions/HeroSection/HeroSectionV3';
import { HeroSessionV4 } from '../pages/landing/sessions/HeroSection/HeroSectionV4';
/* --- 3. Tipados de Dominio --- */
import type { ApiProduct } from '../types/product_types';

/**
 * Propiedades estándar que debe recibir cualquier variante de tarjeta de producto.
 */
export interface ProductCardComponentProps {
  producto: ApiProduct;
}

/**
 * Propiedades estándar que puede recibir cualquier variante de sección Hero.
 */
export interface HeroComponentProps {
  bgColor?: string;
}

/* =============================================================================
   DICCIONARIOS DE REGISTRO (Strategy Pattern)
   ============================================================================= */

/**
 * Catálogo de variantes de diseño para Tarjetas de Producto.
 * @constant
 */
export const PRODUCT_CARD_VARIANTS: Record<string, React.FC<ProductCardComponentProps>> = {
  v1: ProductCardV1,
  v2: ProductCardV2
};

/**
 * Catálogo de variantes de diseño para Portadas Principales (Hero).
 * @constant
 */
export const HERO_VARIANTS: Record<string, React.FC<HeroComponentProps>> = {
  v1: HeroSessionV1,
  v2: HeroSessionV2,
  v3: HeroSessionV3,
  v4: HeroSessionV4,
};

/* =============================================================================
   DESPACHADORES RESOLUTORES EN RUNTIME (Zero-Rebuild SaaS)
   ============================================================================= */

/**
 * Fachada de resolución de componentes visuales (`UI_REGISTRY`).
 * 
 * Despacha de forma segura el componente React correspondiente según la clave
 * configurada en `client_info.json` (`ui_variants`), aplicando fallbacks automáticos
 * si la variante solicitada no existe.
 */
export const UI_REGISTRY = {
  /**
   * Resuelve el componente de tarjeta de producto configurado.
   * 
   * @param {string} [variant='v1'] - Identificador de variante (ej: 'v1', 'v2').
   * @returns {React.FC<ProductCardComponentProps>} Componente React listo para renderizar.
   */
  getProductCard: (variant?: string): React.FC<ProductCardComponentProps> => {
    const key = variant?.toLowerCase() || 'v1';
    return PRODUCT_CARD_VARIANTS[key] || PRODUCT_CARD_VARIANTS['v1'];
  },

  /**
   * Resuelve el componente de portada Hero configurado.
   * 
   * @param {string} [variant='v1'] - Identificador de variante (ej: 'v1', 'v3').
   * @returns {React.FC<HeroComponentProps>} Componente React listo para renderizar.
   */
  getHero: (variant?: string): React.FC<HeroComponentProps> => {
    const key = variant?.toLowerCase() || 'v1';
    return HERO_VARIANTS[key] || HERO_VARIANTS['v1'];
  },
};

export default UI_REGISTRY;