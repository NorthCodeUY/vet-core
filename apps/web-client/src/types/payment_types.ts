/* --- apps/web-client/src/types/payment_types.ts --- */

/**
 * @fileoverview Tipos y Contratos de Dominio para Métodos de Pago y Pasarelas (payment_types.ts)
 * 
 * Define los identificadores canónicos de modalidades de liquidación soportadas
 * en el checkout y la interfaz de configuración visual y formativa (Strategy Pattern)
 * para la construcción dinámica de pedidos hacia WhatsApp.
 * 
 * @module types/payment_types
 */

/**
 * Identificadores únicos de las estrategias de pago disponibles en el sistema.
 * 
 * @typedef {'efectivo' | 'transferencia' | 'tarjeta' | 'mercadopago'} PaymentMethodId
 */
export type PaymentMethodId = 'efectivo' | 'transferencia' | 'tarjeta' | 'mercadopago';

/**
 * Entidad de configuración para una opción de pago dentro del Drawer de checkout.
 * 
 * Centraliza los textos descriptivos, el icono representativo y la función
 * constructora del mensaje que se adjuntará al comprobante enviado al comerciante.
 * 
 * @interface PaymentOption
 * @property {PaymentMethodId} id - Identificador de la estrategia seleccionada.
 * @property {string} label - Nombre comercial principal (ej: 'Transferencia Bancaria').
 * @property {string} subLabel - Bajada explicativa breve (ej: 'BROU / PREX / Santander').
 * @property {string} iconName - Nombre del icono vectorial para resolución dinámica en UI.
 * @property {function(Object=): string} getMessageNote - Función generadora de la cláusula
 * formativa para el payload de WhatsApp, inyectando condicionalmente datos de cuenta bancaria.
 */
export interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  subLabel: string;
  iconName: string;
  getMessageNote: (bankInfo?: {
    name: string;
    accountNumber: string;
    beneficiary: string;
  }) => string;
}