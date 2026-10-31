/* =============================================================================
   DESPACHADOR DE PÁGINA DE MANTENIMIENTO (MaintenancePage Dispatcher)
   ============================================================================= */

import React, { useMemo } from 'react';
import { useConfig } from '../../context/tenant_context';
import MaintenancePageV1 from './MaintenancePageV1';
import MaintenancePageV2 from './MaintenancePageV2/MaintenancePageV2';

/**
 * Propiedades estándar que admiten las variantes de mantenimiento.
 * @interface MaintenanceVariantProps
 */
interface MaintenanceVariantProps {
  whatsappUrl?: string;
}

/**
 * Registro de variantes para la pantalla de mantenimiento.
 * <!> Se tipa admitiendo props de WhatsApp para satisfacer el contrato de V2.
 */
const MAINTENANCE_VARIANTS: Record<string, React.ComponentType<MaintenanceVariantProps>> = {
  v1: MaintenancePageV1,
  v2: MaintenancePageV2,
};

/**
 * Despachador dinámico de variantes de mantenimiento (`MaintenancePage`).
 * 
 * Resuelve la variante activa desde config.json y genera la URL de WhatsApp
 * institucional con el teléfono del tenant para inyectarla a la vista.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function MaintenancePage(): React.JSX.Element {
  const { config } = useConfig();
  const variant = config?.ui_variants?.maintenance ?? 'v2';

  /* ===========================================================================
     CONSTRUCCIÓN SEGURA DEL LINK DE WHATSAPP DEL TENANT
     =========================================================================== */
  const whatsappUrl = useMemo(() => {
    const rawPhone = config?.contact?.admin_phone || '';
    const countryCode = config?.contact?.whatsapp_country_code || '598';
    const digitsOnly = rawPhone.replace(/\D/g, '');
    const cleanPhone = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
    const finalPhone = `${countryCode}${cleanPhone}`;

    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(
      `¡Hola ${config?.business_name || ''}! Quisiera consultar sobre la fecha de apertura y servicios.`
    )}`;
  }, [config]);

  // Selección de la variante o fallback seguro a V2
  const SelectedPage = MAINTENANCE_VARIANTS[variant] ?? MaintenancePageV2;

  // <!> Inyección de la prop requerida
  return <SelectedPage whatsappUrl={whatsappUrl} />;
}