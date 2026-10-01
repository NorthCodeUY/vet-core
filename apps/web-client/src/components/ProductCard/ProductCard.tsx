/* --- apps/web-client/src/components/ProductCard/ProductCard.tsx --- */

/* =============================================================================
   RENDERIZADOR DINÁMICO DE TARJETA DE PRODUCTO (ProductCard)
   ============================================================================= */

import React from 'react';
import { useConfig } from '../../context/tenant_context';
import { ProductCardV1 } from './ProductCardV1';
import { ProductCardV2 } from './ProductCardV2';
import type { ApiProduct } from '../../types/product_types';

/**
 * Propiedades del despachador `ProductCard`.
 * 
 * @interface ProductCardProps
 * @property {ApiProduct} producto - Datos del producto a renderizar.
 */
interface ProductCardProps {
  producto: ApiProduct;
}

/**
 * Mapa de variantes disponibles para tarjetas de catálogo.
 */
const CARD_VARIANTS: Record<string, React.FC<ProductCardProps>> = {
  v1: ProductCardV1,
  v2: ProductCardV2,
};

/**
 * Renderizador dinámico de tarjetas de producto (`ProductCard`).
 * 
 * Despacha reactivamente la variante de diseño configurada en `client_info.json`
 * bajo la clave `ui_variants.product_card` ('v1' o 'v2') sin usar condicionales acoplados.
 *
 * @component
 * @param {ProductCardProps} props - Propiedades del producto.
 * @returns {JSX.Element} Variante activa seleccionada por el cliente.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
  const { config } = useConfig();

  /* 1. Lee la variante activa del cliente (ej: 'v1' o 'v2') con fallback a 'v1' */
  const activeVariant = config?.ui_variants?.product_card ?? 'v1';

  /* 2. Obtiene el componente correspondiente del registro */
  const SelectedCard = CARD_VARIANTS[activeVariant] ?? ProductCardV1;

  return <SelectedCard producto={producto} />;
};

export default ProductCard;