/**
 * @fileoverview Despachador de Tarjetas de Portfolio (Strategy Pattern).
 * Selecciona dinámicamente la variante de tarjeta ('v1' | 'v2') definida en config.json.
 * 
 * @module components/PortfolioCard/PortfolioCard
 */

import React from 'react';
import type { PortfolioItem } from '../../types/tenant_types';
import { useConfig } from '../../context/tenant_context';
import { PortfolioCardV1 } from './PortfolioCardV1';
import { PortfolioCardV2 } from './PortfolioCardV2';

export interface PortfolioCardProps {
  item: PortfolioItem;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const { config } = useConfig();
  const variant = config?.ui_variants?.portfolio_card || 'v1';

  // Mapa de estrategias de renderizado
  const variantsMap: Record<string, React.FC<{ item: PortfolioItem }>> = {
    v1: PortfolioCardV1,
    v2: PortfolioCardV2,
  };

  const SelectedCard = variantsMap[variant] || PortfolioCardV1;
  return <SelectedCard item={item} />;
};