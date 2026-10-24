// apps/web-client/src/components/PortfolioCard/PortfolioCardV2.tsx


/**
 * <!> no enteido porque tengo un card igual al otro almenos eso es lo que entiendo 
 * @fileoverview Variante 2 de Tarjeta de Trabajo (PortfolioCardV2 - Placeholder Arquitectónico).
 * Preparada para despliegues con modal expandido y ficha técnica extendida.
 * 
 * @module components/PortfolioCard/PortfolioCardV2
 */

import React from 'react';
import type { PortfolioItem } from '../../types/tenant_types';
import { PortfolioCardV1 } from './PortfolioCardV1';

export interface PortfolioCardV2Props {
  item: PortfolioItem;
}

export const PortfolioCardV2: React.FC<PortfolioCardV2Props> = ({ item }) => {
  // Por defecto delega a V1 hasta implementar el modal detallado
  return <PortfolioCardV1 item={item} />;
};