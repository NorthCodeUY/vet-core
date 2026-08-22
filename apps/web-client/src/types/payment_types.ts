/* --- apps/web-client/src/types/payment_types.ts--- */

export type PaymentMethodId = 'efectivo' | 'transferencia' | 'tarjeta' | 'mercadopago';

export interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  subLabel: string;
  iconName: string;
  getMessageNote: (bankInfo?: { name: string; accountNumber: string; beneficiary: string }) => string;
}