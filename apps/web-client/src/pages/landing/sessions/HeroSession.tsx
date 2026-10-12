  // apps/web-client/src/pages/landing/sessions/HeroSession.tsx

  /* =============================================================================
    RENDERIZADOR DINÁMICO DE PORTADA HERO (HeroSession Dispatcher)
    ============================================================================= */

  import React from 'react';
  import { useConfig } from '../../../context/tenant_context';
  import { UI_REGISTRY } from '../../../config/ui-config';

  /**
   * Propiedades del componente despachador `HeroSession`.
   * 
   * @interface HeroSessionProps
   * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el fondo de la portada.
   */
  export interface HeroSessionProps {
    bgColor?: string;
  }

  /**
   * Despachador reactivo de variantes para la portada principal (`HeroSession`).
   * 
   * Consulta en tiempo de ejecución la clave `ui_variants.hero` configurada en el
   * archivo `client_info.json` del cliente activo y despacha el componente correspondiente
   * (Hero V1: Editorial/Modal, Hero V2: Cita directa, Hero V3: Animación Lottie) sin acoplar código.
   *
   * @component
   * @param {HeroSessionProps} props - Propiedades de configuración visual.
   * @returns {JSX.Element} Variante activa seleccionada por el cliente.
   */
  export const HeroSession: React.FC<HeroSessionProps> = ({ bgColor = 'bg-transparent' }) => {
    /* 1. Consumo del contexto multi-tenant */
    const { config } = useConfig();

    /* 2. Obtención de la variante configurada en el JSON ('v1', 'v2' o 'v3') */
    const activeVariant = config?.ui_variants?.hero ?? 'v1';

    /* 3. Resolución segura mediante el registro central */
    const SelectedHero = UI_REGISTRY.getHero(activeVariant);

    return <SelectedHero bgColor={bgColor} />;
  };

  export default HeroSession;