/* --- apps/web-client/src/pages/pedido/PedidoFooterCollapsible.tsx --- */

/**
 * @fileoverview Pie de Página Colapsable del Carrito y Orquestador de Checkout (PedidoFooterCollapsible)
 * 
 * Centraliza la selección de medios de pago, la logística de entrega/retiro,
 * el cálculo de totales y la construcción del mensaje estructurado para WhatsApp.
 * Implementa un selector interactivo enriquecido con iconografía dinámica.
 * 
 * @module pages/pedido/PedidoFooterCollapsible
 */

import React, { useState } from 'react';
// --- Iconografía Lucide ---
import { 
  Banknote,
  Building2,
  CreditCard,
  QrCode,
  MapPin,
  ChevronDown,
  Trash2,
  Send,
  Truck,
  Check
} from 'lucide-react';

// --- Contextos y Modelos Globales ---
import { useConfig } from '../../context/tenant_context';
import { usePedidoStore } from '../../context/pedido_context';
import type { BankAccountItem } from '../../types/tenant_types';

/* =============================================================================
   CONSTANTES Y MODELO DE ESTRATEGIAS DE PAGO
   ============================================================================= */

/**
 * Identificadores inmutables de métodos de pago para evitar strings mágicos.
 * <!> Se reemplazan comparaciones duras de texto por constantes tipadas.
 */
export const PAYMENT_METHOD_IDS = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  TARJETA: 'tarjeta',
  MERCADOPAGO: 'mercadopago',
} as const;

export type PaymentMethodType = typeof PAYMENT_METHOD_IDS[keyof typeof PAYMENT_METHOD_IDS];

/**
 * Catálogo de estrategias de cobro soportadas por la plataforma.
 */
interface PaymentStrategy {
  id: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  getMessage: (bankAccounts?: BankAccountItem[]) => string;
}

const PAYMENT_METHODS: PaymentStrategy[] = [
  {
    id: PAYMENT_METHOD_IDS.EFECTIVO,
    label: 'Efectivo',
    description: 'Pago en mano al recibir',
    icon: Banknote,
    getMessage: () => '_Forma de pago: Efectivo (coordinar cambio con el vendedor)_',
  },
  {
    id: PAYMENT_METHOD_IDS.TRANSFERENCIA,
    label: 'Transferencia',
    description: 'BROU / PREX / Santander',
    icon: Building2,
    getMessage: (bankAccounts) => {
      if (!bankAccounts || bankAccounts.length === 0) {
        return '_Forma de pago: Transferencia Bancaria (solicitar datos de cuenta)_';
      }
      let text = `*Datos de Transferencia:*`;
      bankAccounts.forEach((acc) => {
        text += `\n- *${acc.bank_name}:* N° ${acc.account_number} (${acc.beneficiary})`;
      });
      text += `\n_Adjuntaré el comprobante por este medio._`;
      return text;
    },
  },
  {
    id: PAYMENT_METHOD_IDS.TARJETA,
    label: 'Tarjeta',
    description: 'Débito o Crédito al entregar',
    icon: CreditCard,
    getMessage: () => '_Forma de pago: Tarjeta de Débito/Crédito (solicitar POS inalámbrico)_',
  },
  {
    id: PAYMENT_METHOD_IDS.MERCADOPAGO,
    label: 'Mercado Pago',
    description: 'Link de pago / Código QR',
    icon: QrCode,
    getMessage: () => '_Forma de pago: Mercado Pago (solicito link de pago / QR)_',
  },
];

/* =============================================================================
   SUB-COMPONENTE: SELECTOR ENRIQUECIDO DE MÉTODO DE PAGO
   ============================================================================= */

interface PaymentSelectorProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  bankInfo?: BankAccountItem;
}

/**
 * Selector desplegable con iconografía personalizada para métodos de pago (`PaymentSelector`).
 * <!> Se reemplaza el select nativo por un menú interactivo con íconos vectoriales visibles en cada ítem.
 * 
 * @component
 */
const PaymentSelector: React.FC<PaymentSelectorProps> = ({ 
  selectedMethod, 
  setSelectedMethod,
  bankInfo 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentPayment = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const CurrentIcon = currentPayment.icon;

  return (
    <div className={`
      /* --- Posición --- */
      flex
      flex-col
      relative

      /* --- Dimensiones --- */
      gap-1.5
    `}>
      <label className={`
        /* --- Posición --- */
        ml-1

        /* --- Colores --- */
        text-vete-text-muted

        /* --- Texto --- */
        text-[10px]
        font-black
        uppercase
        tracking-widest
      `}>
        Método de Pago
      </label>

      {/* Botón Disparador del Menú Desplegable Enriquecido */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          /* --- Posición --- */
          flex
          items-center
          justify-between
          relative

          /* --- Dimensiones --- */
          w-full
          py-2.5
          px-3.5

          /* --- Colores --- */
          bg-vete-dark
          border
          border-vete-border-subtle/40
          text-vete-text-base

          /* --- Estilo --- */
          rounded-xl
          outline-none
          cursor-pointer

          /* --- Animación --- */
          transition-colors
          duration-150
          hover:border-vete-primary/60
          focus:border-vete-primary
        `}
      >
        <div className={`
          /* --- Posición --- */
          flex
          items-center
          gap-2.5
        `}>
          <CurrentIcon size={16} className="text-vete-primary shrink-0" />
          <span className={`
            /* --- Texto --- */
            text-xs
            font-bold
            uppercase
            tracking-wide
          `}>
            {currentPayment.label} — <span className="text-[11px] font-normal text-vete-text-muted lowercase">{currentPayment.description}</span>
          </span>
        </div>

        <ChevronDown 
          size={14} 
          className={`
            /* --- Colores --- */
            text-vete-text-muted

            /* --- Animación --- */
            transition-transform
            duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Menú Desplegable con Iconos Visibles en Cada Opción */}
      {isOpen && (
        <div className={`
          /* --- Posición --- */
          absolute
          top-full
          left-0
          z-50

          /* --- Dimensiones --- */
          w-full
          mt-1
          p-1.5

          /* --- Colores --- */
          bg-vete-surface
          border
          border-vete-border-subtle
          shadow-2xl

          /* --- Estilo --- */
          rounded-2xl

          /* --- Animación --- */
          animate-in
          fade-in
          zoom-in-95
          duration-150
        `}>
          {PAYMENT_METHODS.map((pm) => {
            const Icon = pm.icon;
            const isSelected = pm.id === selectedMethod;

            return (
              <div
                key={pm.id}
                onClick={() => {
                  setSelectedMethod(pm.id);
                  setIsOpen(false);
                }}
                className={`
                  /* --- Posición --- */
                  flex
                  items-center
                  justify-between
                  cursor-pointer

                  /* --- Dimensiones --- */
                  p-2.5
                  rounded-xl

                  /* --- Colores --- */
                  ${isSelected ? 'bg-vete-primary/10 text-vete-primary' : 'text-vete-text-base hover:bg-vete-dark/5'}

                  /* --- Animación --- */
                  transition-colors
                  duration-150
                `}
              >
                <div className={`
                  /* --- Posición --- */
                  flex
                  items-center
                  gap-2.5
                `}>
                  <div className={`
                    /* --- Posición --- */
                    p-1.5
                    rounded-lg

                    /* --- Colores --- */
                    ${isSelected ? 'bg-vete-primary text-white' : 'bg-vete-dark/5 text-vete-primary'}
                  `}>
                    <Icon size={14} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold uppercase">{pm.label}</span>
                    <span className="text-[10px] text-vete-text-muted">{pm.description}</span>
                  </div>
                </div>

                {isSelected && <Check size={14} className="text-vete-primary" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Panel Informativo Condicional para Transferencias Bancarias */}
      {selectedMethod === PAYMENT_METHOD_IDS.TRANSFERENCIA && bankInfo && (
        <div className={`
          /* --- Posición --- */
          flex
          flex-col

          /* --- Dimensiones --- */
          p-3
          gap-1

          /* --- Colores --- */
          bg-vete-primary/10
          border
          border-dashed
          border-vete-primary/40

          /* --- Estilo --- */
          rounded-xl

          /* --- Animación --- */
          animate-in
          fade-in
          duration-200
        `}>
          <span className={`
            /* --- Colores --- */
            text-vete-primary

            /* --- Texto --- */
            text-[11px]
            font-black
            uppercase
            tracking-wider
          `}>
            Datos Bancarios del Comercio
          </span>
          <p className={`
            /* --- Colores --- */
            text-vete-text-base

            /* --- Texto --- */
            text-xs
            font-medium
            leading-relaxed
          `}>
            <strong>Entidad:</strong> {bankInfo.bank_name}<br />
            <strong>N° Cuenta:</strong> {bankInfo.account_number} ({bankInfo.currency})<br />
            <strong>Titular:</strong> {bankInfo.beneficiary}
          </p>
        </div>
      )}
    </div>
  );
};

/* =============================================================================
   SUB-COMPONENTE: BARRA RESUMEN COMPACTA (CheckoutSummaryBar)
   ============================================================================= */

interface CheckoutSummaryBarProps {
  paymentLabel: string;
  PaymentIcon: React.ComponentType<{ size?: number; className?: string }>;
  address: string;
  onExpand: () => void;
}

const CheckoutSummaryBar: React.FC<CheckoutSummaryBarProps> = ({
  paymentLabel,
  PaymentIcon,
  address,
  onExpand
}) => {
  return (
    <div 
      onClick={onExpand}
      className={`
        /* --- Posición --- */
        flex
        items-center
        justify-between
        cursor-pointer
        select-none

        /* --- Dimensiones --- */
        p-3

        /* --- Colores --- */
        bg-vete-dark
        border
        border-vete-border-subtle/40

        /* --- Estilo --- */
        rounded-xl

        /* --- Animación --- */
        transition-all
        duration-200
        hover:border-vete-primary/50
      `}
    >
      <div className={`
        /* --- Posición --- */
        flex
        items-center
        overflow-hidden

        /* --- Dimensiones --- */
        gap-3
      `}>
        {/* Método de Pago Activo */}
        <div className={`
          /* --- Posición --- */
          flex
          items-center
          shrink-0

          /* --- Dimensiones --- */
          gap-1.5

          /* --- Colores --- */
          text-vete-primary
        `}>
          <PaymentIcon size={15} /> 
          <span className={`
            /* --- Texto --- */
            text-[10px]
            font-black
            uppercase
            tracking-wider
          `}>
            Pago: <span className="font-bold">{paymentLabel}</span>
          </span>
        </div>

        {/* Separador */}
        <div className="h-3 w-px bg-vete-border-subtle shrink-0" />

        {/* Dirección Resumida */}
        <div className={`
          /* --- Posición --- */
          flex
          items-center
          truncate

          /* --- Dimensiones --- */
          gap-1.5

          /* --- Colores --- */
          text-vete-text-muted
        `}>
          <MapPin size={13} className="shrink-0" />
          <span className={`
            /* --- Dimensiones --- */
            max-w-[130px]

            /* --- Texto --- */
            text-[11px]
            font-medium
            truncate
          `}>
            {address.trim() || 'Retiro en Local'}
          </span>
        </div>
      </div>

      <button 
        type="button" 
        className={`
          /* --- Dimensiones --- */
          p-1

          /* --- Colores --- */
          text-vete-text-muted
          hover:text-vete-primary

          /* --- Animación --- */
          transition-colors
        `}
        aria-label="Abrir opciones de pago y entrega"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};

/* =============================================================================
   SUB-COMPONENTE: LOGÍSTICA DE ENTREGA (DeliveryAddressSection)
   ============================================================================= */

interface DeliveryAddressSectionProps {
  address: string;
  setAddress: (addr: string) => void;
  mapsUrl: string;
}

const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
  address,
  setAddress,
  mapsUrl
}) => {
  const isRetiro = address === "Retiro en Local";

  return (
    <div className={`
      /* --- Posición --- */
      flex
      flex-col

      /* --- Dimensiones --- */
      gap-2
    `}>
      <div className={`
        /* --- Posición --- */
        flex
        justify-between
        items-center

        /* --- Dimensiones --- */
        px-1
      `}>
        <label className={`
          /* --- Colores --- */
          text-vete-text-muted

          /* --- Texto --- */
          text-[10px]
          font-black
          uppercase
          tracking-widest
        `}>
          Modalidad de Entrega
        </label>

        <a 
          href={mapsUrl}
          target="_blank" 
          rel="noreferrer"
          className={`
            /* --- Colores --- */
            text-vete-primary
            hover:text-vete-primary-hover

            /* --- Texto --- */
            text-[9px]
            font-bold
            uppercase
            underline

            /* --- Animación --- */
            transition-colors
          `}
        >
          Ver Local en Maps
        </a>
      </div>

      {/* <!> Selector Binario Agnóstico: Eliminación de clases fijas bg-slate-* por tokens semánticos */}
      <div className={`
        /* --- Posición --- */
        grid
        grid-cols-2

        /* --- Dimensiones --- */
        gap-2
      `}>
        {/* Opción 1: Retiro en Local */}
        <button
          type="button"
          onClick={() => setAddress("Retiro en Local")}
          className={`
            /* --- Posición --- */
            flex
            items-center
            justify-center

            /* --- Dimensiones --- */
            py-2.5
            px-3
            gap-1.5

            /* --- Colores --- */
            ${isRetiro 
              ? 'bg-vete-primary text-white border-vete-primary shadow-md' 
              : 'bg-vete-dark text-vete-text-base border-vete-border-subtle/50 hover:border-vete-primary/40'}
            border-2

            /* --- Texto --- */
            text-xs
            font-bold

            /* --- Estilo --- */
            rounded-xl

            /* --- Animación --- */
            transition-all
            duration-150
            active:scale-95
          `}
        >
          <MapPin size={14} className={isRetiro ? "text-white" : "text-vete-primary"} />
          <span>Retiro en Local</span>
        </button>

        {/* Opción 2: Envío a Domicilio */}
        <button
          type="button"
          onClick={() => {
            if (isRetiro) setAddress("");
          }}
          className={`
            /* --- Posición --- */
            flex
            items-center
            justify-center

            /* --- Dimensiones --- */
            py-2.5
            px-3
            gap-1.5

            /* --- Colores --- */
            ${!isRetiro 
              ? 'bg-vete-primary text-white border-vete-primary shadow-md' 
              : 'bg-vete-dark text-vete-text-base border-vete-border-subtle/50 hover:border-vete-primary/40'}
            border-2

            /* --- Texto --- */
            text-xs
            font-bold

            /* --- Estilo --- */
            rounded-xl

            /* --- Animación --- */
            transition-all
            duration-150
            active:scale-95
          `}
        >
          <Truck size={14} className={!isRetiro ? "text-white" : "text-vete-primary"} />
          <span>Envío a Domicilio</span>
        </button>
      </div>

      {/* Input de Dirección Asistida */}
      {!isRetiro && (
        <div className={`
          /* --- Posición --- */
          relative

          /* --- Animación --- */
          animate-in
          fade-in
          slide-in-from-top-2
          duration-200
        `}>
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vete-text-muted pointer-events-none" />
          <input 
            type="text"
            required
            autoFocus
            placeholder="Calle, número de puerta y esquina..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`
              /* --- Dimensiones --- */
              w-full
              py-2.5
              pl-10
              pr-4

              /* --- Colores --- */
              bg-vete-dark
              text-vete-text-base
              border
              border-vete-border-subtle/60
              focus:border-vete-primary

              /* --- Texto --- */
              text-xs
              font-medium
              placeholder:text-vete-text-muted/60

              /* --- Estilo --- */
              rounded-xl
              outline-none

              /* --- Animación --- */
              transition-all
            `}
          />
        </div>
      )}
    </div>
  );
};

/* =============================================================================
   COMPONENTE PRINCIPAL: PIE COLAPSABLE DE CHECKOUT
   ============================================================================= */

interface PedidoFooterCollapsibleProps {
  onClearCart: () => void;
}

export const PedidoFooterCollapsible: React.FC<PedidoFooterCollapsibleProps> = ({ onClearCart }) => {
  const { pedido, total } = usePedidoStore();
  const { config } = useConfig();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>(PAYMENT_METHOD_IDS.EFECTIVO);
  const [address, setAddress] = useState<string>('Retiro en Local');

  const currentPayment = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const CurrentIcon = currentPayment.icon;

  const handleConfirmOrder = (): void => {
    if (address !== 'Retiro en Local' && !address.trim()) {
      alert("Por favor, ingresa una dirección de entrega válida o selecciona 'Retiro en Local'.");
      return;
    }

    if (pedido.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const rawPhone = config?.contact?.admin_phone || '';
    const countryCode = config?.contact?.whatsapp_country_code || '598';
    const digitsOnly = rawPhone.replace(/\D/g, '');
    const cleanPhone = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
    const finalPhone = `${countryCode}${cleanPhone}`;

    const businessName = config?.business_name || 'TIENDA WEB';
    const prefixMsg = config?.custom_messages?.whatsapp_order_prefix || 'NUEVO PEDIDO';

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-UY');
    const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const shareUrl = window.location.href;

    let message = `*${prefixMsg} - ${businessName.toUpperCase()}*\n\n`;
    message += `📅 *Fecha:* ${dateStr} - ${timeStr} hs\n`;
    message += `📍 *Entrega:* ${address.trim()}\n\n`;
    message += `💳 *Método de Pago:* ${currentPayment.label.toUpperCase()}\n`;
    message += `${currentPayment.getMessage(config?.bank_accounts)}\n\n`;
    message += `🛒 *Detalle de la compra:*\n`;

    pedido.forEach(item => {
      const subtotal = item.precio_unitario_capturado * item.cantidad;
      message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${subtotal.toLocaleString('es-UY')}\n`;
    });

    message += `\n💰 *TOTAL ESTIMADO: $${total.toLocaleString('es-UY')}*\n`;
    message += `__________________________\n\n`;
    message += `🔗 *Ver o Modificar este pedido en la web:*\n${shareUrl}`;

    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`
      /* --- Posición --- */
      sticky
      bottom-0
      z-20
      flex
      flex-col

      /* --- Dimensiones --- */
      p-5
      gap-4

      /* --- Colores --- */
      bg-vete-surface
      border-t
      border-vete-border-subtle
      shadow-[0_-10px_25px_rgba(0,0,0,0.05)]
    `}>
      {/* 1. Barra Interruptora de Resumen */}
      {!isExpanded ? (
        <CheckoutSummaryBar 
          paymentLabel={currentPayment.label}
          PaymentIcon={CurrentIcon}
          address={address}
          onExpand={() => setIsExpanded(true)}
        />
      ) : (
        <div className="flex justify-center w-full py-0.5">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            title="Plegar menú"
            aria-label="Plegar menú"
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              px-4
              py-1
              gap-1

              /* --- Colores --- */
              bg-vete-dark/50
              text-vete-text-muted
              border
              border-vete-border-subtle/30
              hover:text-vete-primary
              hover:bg-vete-dark

              /* --- Texto --- */
              text-[9px]
              font-bold
              uppercase
              tracking-wider

              /* --- Estilo --- */
              rounded-full

              /* --- Animación --- */
              transition-all
              duration-150
              hover:scale-105
            `}
          >
            <span>Plegar</span>
            <ChevronDown size={13} className="rotate-180 transition-transform" />
          </button>
        </div>
      )}

      {/* 2. Contenedor Colapsable */}
      <div className={`
        /* --- Posición --- */
        flex
        flex-col
        overflow-hidden

        /* --- Dimensiones --- */
        gap-4

        /* --- Animación --- */
        transition-all
        duration-300
        ${isExpanded ? 'max-h-[500px] opacity-100 pt-1' : 'max-h-0 opacity-0 pointer-events-none'}
      `}>
        <PaymentSelector 
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          bankInfo={config?.bank_accounts?.[0]}
        />

        <DeliveryAddressSection 
          address={address}
          setAddress={setAddress}
          mapsUrl={config?.contact?.google_maps_url || '#'}
        />
      </div>

      {/* 3. Total y Acciones Finales */}
      <div className={`
        /* --- Posición --- */
        flex
        flex-col

        /* --- Dimensiones --- */
        pt-2
        gap-3

        /* --- Colores --- */
        border-t
        border-vete-border-subtle/30
      `}>
        <div className="flex justify-between items-baseline px-1">
          <span className={`
            /* --- Colores --- */
            text-vete-text-muted

            /* --- Texto --- */
            text-[10px]
            font-black
            uppercase
            tracking-widest
          `}>
            Total a Pagar
          </span>
          <span className={`
            /* --- Colores --- */
            text-vete-primary

            /* --- Texto --- */
            text-2xl
            font-black
          `}>
            ${total.toLocaleString('es-UY')}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full">
          {/* Vaciar Carrito */}
          <button 
            type="button"
            onClick={onClearCart} 
            disabled={pedido.length === 0}
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              p-3.5

              /* --- Colores --- */
              bg-transparent
              text-vete-error
              border-2
              border-vete-error/30
              hover:bg-vete-error/10

              /* --- Estilo --- */
              rounded-xl

              /* --- Animación --- */
              transition-all
              active:scale-95
              disabled:opacity-30
            `}
            title="Vaciar Carrito"
            aria-label="Vaciar Carrito"
          >
            <Trash2 size={18} />
          </button>

          {/* Confirmar Pedido WhatsApp */}
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={pedido.length === 0}
            className={`
              /* --- Posición --- */
              flex-1
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              py-3.5
              px-4
              gap-2

              /* --- Colores --- */
              bg-vete-primary
              text-white
              hover:bg-vete-primary-hover
              shadow-lg
              shadow-vete-primary/20

              /* --- Texto --- */
              text-xs
              font-black
              uppercase
              tracking-wider

              /* --- Estilo --- */
              rounded-xl

              /* --- Animación --- */
              transition-all
              active:scale-[0.98]
              disabled:opacity-40
            `}
          >
            <span>Confirmar Pedido</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};