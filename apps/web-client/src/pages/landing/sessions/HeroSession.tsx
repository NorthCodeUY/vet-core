import React from 'react';
import { UI_CONFIG } from '../../../config/ui-config';

interface HeroSessionProps {
  bgColor?: string;
}

export function HeroSession({ bgColor }: HeroSessionProps) {
  // Cambiado a getHeroComponent()
  const HeroComponent = UI_CONFIG.getHeroComponent() as React.ComponentType<{ bgColor?: string }>;

  return <HeroComponent bgColor={bgColor} />;
}

export default HeroSession;