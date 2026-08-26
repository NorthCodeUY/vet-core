
/* --- apps/web-client/src/pages/pedido/PedidoFooterCollapsible.tsx--- */

import React, { useState } from 'react';
import { 
  Banknote,  // Dinero en mano osea al recibir el pedido
  Building2, // Banco 
  CreditCard, // Tarjeta 
  QrCode, // Codigo QR 
  MapPin, // Direccion 
  ChevronDown, // Desplegable 
  Trash2,  // Basura  
  Send // Enviar 
} from 'lucide-react';


import companyInfo from '../../data/companyInfo.json'; // Datos de la empresa 
import { usePedidoStore } from '../../context/pedido_context'; // Contexto del pedido 



/**
 * Catálogo de configuración de métodos de pago soportados por la plataforma.
 * 
 * Centraliza la definición visual (etiquetas, descripciones e iconografía de Lucide)
 * y la lógica de generación de mensajes dinámicos para WhatsApp. Permite desacoplar
 * la regla de negocio de cada pasarela/método respecto al componente de interfaz.
 *
 * @constant
 * @type {Array<{
 *   id: string,
 *   label: string,
 *   description: string,
 *   icon: React.ComponentType<{ size?: number, className?: string }>,
 *   getMessage: () => string
 * }>}
 * <!> Yo para mi tengo que camiar esto y mejorar el icono en el cado de los item desplegables 
 */
const PAYMENT_METHODS = [
  {
    id: 'efectivo',
    label: 'Efectivo',
    description: 'Pago en mano al recibir',
    icon: Banknote,
    /**
     * Genera la instrucción de cobro en efectivo para el mensaje de WhatsApp.
     * @returns {string} Nota informativa sobre coordinación de cambio.
     */
    getMessage: () => '_Forma de pago: Efectivo (coordinar cambio con el vendedor)_'
  },
  {
    id: 'transferencia',
    label: 'Transferencia',
    description: 'BROU / PREX / Santander',
    icon: Building2,
    /**
    * Extrae dinámicamente los datos bancarios del archivo de configuración empresarial
    * y los formatea como bloque de texto para la transferencia.
    * @returns {string} Datos bancarios estructurados (Banco, Cuenta, Titular).
    */
    getMessage: () => 
      `*Datos de Transferencia:*\n- Banco: ${companyInfo.bank.name}\n- Cuenta: ${companyInfo.bank.accountNumber}\n- Titular: ${companyInfo.bank.beneficiary}\n_Adjuntaré el comprobante por este medio._`
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    description: 'Débito o Crédito al entregar',
    icon: CreditCard,
    /**
     * Genera la instrucción para coordinar el POS inalámbrico al momento del delivery.
     * @returns {string} Nota informativa para llevar el terminal POS.
     */
    getMessage: () => '_Forma de pago: Tarjeta de Débito/Crédito (coordinar pos con el vendedor)_'
  },
  {
    id: 'mercadopago',
    label: 'Mercado Pago',
    description: 'Link de pago / Código QR',
    icon: QrCode,
    /**
     * Solicita la generación de un link de pago digital o código QR dinámico.
     * @returns {string} Solicitud de pasarela de pago digital.
     */
    getMessage: () => '_Forma de pago: Mercado Pago (solicito link de pago / QR)_'
  }
];





/**
 * Propiedades del componente `PedidoFooterCollapsible`.
 * 
 * @interface PedidoFooterCollapsibleProps
 * @property {function(): void} onClearCart - Callback disparado al presionar el botón de vaciado de carrito (abre modal de confirmación en el padre).
 */
interface PedidoFooterCollapsibleProps {
  onClearCart: () => void;
}


/* =============================================================================
   SUB-COMPONENTE A: SELECTOR DE MÉTODO DE PAGO
   ============================================================================= */
const PaymentSelector = ({ 
  selectedMethod, 
  setSelectedMethod,
  bankInfo 
}: { 
  selectedMethod: string; 
  setSelectedMethod: (m: string) => void;
  bankInfo: { name: string; accountNumber: string; beneficiary: string };
}) => {
  const currentPayment = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const CurrentIcon = currentPayment.icon;

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`
        /* --- Texto --- */
        text-[10px] font-black uppercase tracking-widest ml-1
        /* --- Colores --- */
        text-vete-text-muted
      `}>
        Método de Pago
      </label>

      <div className="relative">
        <CurrentIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vete-primary pointer-events-none" />
        
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className={`
            /* --- Dimensiones --- */
            w-full py-2.5 pl-10 pr-8
            /* --- Colores --- */
            bg-vete-dark text-vete-text-light border border-vete-light-border/40
            /* --- Texto --- */
            text-xs font-bold uppercase
            /* --- Estilo --- */
            rounded-xl outline-none appearance-none cursor-pointer
            focus:border-vete-primary transition-colors
          `}
        >
          {PAYMENT_METHODS.map((pm) => (  
            <option key={pm.id} value={pm.id} className="bg-slate-900 text-white">
              {pm.label} — {pm.description}
            </option>
          ))}
        </select>
        
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vete-text-muted pointer-events-none" />
      </div>

      {/* Datos Bancarios condicionales */}
      {selectedMethod === 'transferencia' && (
        <div className={`
          /* --- Posición --- */
          p-3
          /* --- Colores --- */
          bg-vete-primary/10 border border-dashed border-vete-primary/40
          /* --- Estilo --- */
          rounded-xl animate-in fade-in duration-200
        `}>
          <p className="text-vete-text-light text-xs font-medium leading-tight">
            <span className="font-bold text-vete-primary">Datos Bancarios:</span><br />
            Banco: {bankInfo.name}<br />
            Cuenta: {bankInfo.accountNumber}<br />
            Titular: {bankInfo.beneficiary}
          </p>
        </div>
      )}
    </div>
  );
};

// <!> Borrar !!! 
// const PaymentSelector = ({ 
//   method, 
//   setMethod, 
//   bankInfo 
// }: { 
//   method: string; 
//   setMethod: (m: string) => void; 
//   bankInfo: string;
// }) => {
//   return (
//     <div className={`
//       /* --- Posición --- */
//       flex flex-col gap-2
//       /* --- Dimensiones --- */
//       w-full mt-1
//     `}>
//       <div className="relative flex items-center">
//         <Banknote size={14} className="absolute left-3 text-vete-primary pointer-events-none" />
//         <select
//           value={method}
//           onChange={(e) => setMethod(e.target.value)}
//           className={`
//             /* --- Dimensiones --- */
//             w-full py-2 pl-9 pr-8
//             /* --- Colores --- */
//             bg-vete-dark text-vete-text-light border border-vete-light-border/40
//             /* --- Texto --- */
//             text-xs font-bold uppercase
//             /* --- Estilo --- */
//             rounded-xl outline-none appearance-none cursor-pointer
//             focus:border-vete-primary
//           `}
//         >
//           <option value="efectivo">💵 Efectivo (Pago al recibir)</option>
//           <option value="transferencia">🏦 Transferencia Bancaria</option>
//         </select>
//         <ChevronDown size={14} className="absolute right-3 text-vete-text-muted pointer-events-none" />
//       </div>

//       {/* Datos Bancarios: Solo si elige Transferencia */}
//       {method === 'transferencia' && (
//         <div className={`
//           /* --- Posición --- */
//           p-2.5
//           /* --- Colores --- */
//           bg-vete-primary/10 border border-dashed border-vete-primary/40
//           /* --- Estilo --- */
//           rounded-xl animate-in fade-in duration-200
//         `}>
//           <p className="text-[11px] text-vete-text-light leading-tight">
//             <span className="font-bold text-vete-primary">Datos para el pago:</span><br />
//             {bankInfo}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };


/* =============================================================================
   SUB-COMPONENTE B: SELECCIÓN Y ENTRADA DE DIRECCIÓN / RETIRO
   ============================================================================= */
const DeliveryAddressSection = ({
  address,
  setAddress,
  mapsUrl
}: {
  address: string;
  setAddress: (addr: string) => void;
  mapsUrl: string;
}) => {
  const isRetiro = address === "Retiro en Local";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black uppercase text-vete-text-muted tracking-widest">
          Dirección de Entrega
        </label>
        <a 
          href={mapsUrl}
          target="_blank" 
          rel="noreferrer"
          className="text-[9px] font-bold uppercase text-vete-primary hover:underline"
        >
          Ver Local en Maps
        </a>
      </div>

      {/* Botón rápido: Retiro en Local */}
      <button
        type="button"
        onClick={() => setAddress(isRetiro ? "" : "Retiro en Local")}
        className={`
          /* --- Posición --- */
          flex items-center justify-center gap-1.5
          /* --- Dimensiones --- */
          w-full py-2 px-3
          /* --- Estilo --- */
          rounded-xl border transition-all text-xs font-bold
          /* --- Colores --- */
          ${isRetiro 
            ? 'bg-vete-primary text-white border-vete-primary shadow-sm' 
            : 'bg-vete-dark text-vete-text-muted border-vete-light-border/40 hover:text-vete-text-light'}
        `}
      >
        <MapPin size={13} />
        <span>{isRetiro ? "✓ Retiro en Veterinaria (Salto)" : "Retirar en el Local"}</span>
      </button>

      {/* Input Manual de Dirección */}
      {!isRetiro && (
        <div className="relative animate-in fade-in duration-200">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vete-text-muted pointer-events-none" />
          <input 
            type="text"
            placeholder="Calle, número de puerta o esquina..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`
              /* --- Dimensiones --- */
              w-full py-2.5 pl-10 pr-4
              /* --- Colores --- */
              bg-vete-dark text-vete-text-light border border-vete-light-border/40
              /* --- Texto --- */
              text-xs font-medium placeholder:text-vete-text-muted/50
              /* --- Estilo --- */
              rounded-xl outline-none focus:border-vete-primary transition-all
            `}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Pie de página interactivo y colapsable del Drawer de Pedidos (`PedidoFooterCollapsible`).
 * 
 * Optimiza el espacio vertical mediante un panel tipo acordeón que resume el método de 
 * pago y la dirección de entrega en una sola línea compacta, permitiendo expandir los controles 
 * para su edición. Administra la construcción del mensaje de WhatsApp con formato enriquecido 
 * y la persistencia de estado del carrito vía URL.
 *
 * @component
 * @param {PedidoFooterCollapsibleProps} props - Propiedades recibidas del contenedor padre.
 * @returns {JSX.Element} Panel de control de checkout fijo en la base del drawer.
 */
export const PedidoFooterCollapsible: React.FC<PedidoFooterCollapsibleProps> = ({ onClearCart }) => {
  const { pedido, total } = usePedidoStore();
  
  /* --- Estados Locales de Checkout --- */
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('efectivo');
  const [address, setAddress] = useState('');

  /* Obtener el método de pago activo */
  const currentPayment = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const CurrentIcon = currentPayment.icon;

  /* Manejo de Confirmación y Construcción del WhatsApp */
  const handleConfirmOrder = () => {
    if (!address.trim()) {
      alert("Por favor, ingresa una dirección de entrega.");
      return;
    }
    if (pedido.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const rawPhone = companyInfo.contact.adminPhone;
    const cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    const finalPhone = `598${cleanPhone}`;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-UY');
    const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const shareUrl = window.location.href;

    /* --- Construcción Estructurada del Mensaje --- */
    let message = `*NUEVO PEDIDO - ${companyInfo.name.toUpperCase()}*\n\n`;
    message += `📅 *Fecha:* ${dateStr} - ${timeStr} hs\n`;
    message += `📍 *Entrega:* ${address.trim()}\n\n`;
    message += `💳 *Método de Pago:* ${currentPayment.label.toUpperCase()}\n`;
    message += `${currentPayment.getMessage()}\n\n`;
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

  return ( // Retorno componente ---------------------------------------------------------------------------
    <div className={`
      /* --- Posición --- */
      sticky                       /* Se fija en la base del drawer */
      bottom-0                     /* Anclado abajo */
      z-20                         /* Por encima de la lista de scroll */
      flex                         /* Contenedor flexible */
      flex-col                     /* Dirección vertical */
      gap-4                        /* Espaciado interno entre filas */

      /* --- Dimensiones --- */
      p-5                          /* Padding general */

      /* --- Colores --- */
      bg-vete-card-white           /* Fondo blanco/tarjeta */
      border-t                     /* Borde superior separador */
      border-vete-light-border     /* Color de borde institucional */
      shadow-[0_-10px_25px_rgba(0,0,0,0.05)] /* Sombra sutil superior */
    `}>
      















      {/* 1. BARRA INTERRUPTORA (Afuera del colapsable) */}
      {!isExpanded ? (
        <div 
          onClick={() => setIsExpanded(true)}
          className={`
            /* --- Posición --- */
            flex items-center justify-between cursor-pointer select-none
            /* --- Dimensiones --- */
            p-3
            /* --- Colores --- */
            bg-vete-dark border border-vete-light-border/40 hover:bg-vete-dark/80
            /* --- Estilo --- */
            rounded-xl transition-all
          `}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 text-vete-primary shrink-0">
              <CurrentIcon size={16} /> 
              <span className="text-[10px] font-black uppercase tracking-wider">
                Pago: <span className="font-bold">{currentPayment.label}</span>
              </span>
            </div>

            <div className="h-3 w-px bg-vete-light-border shrink-0" />

            <div className="flex items-center gap-1.5 text-vete-text-muted truncate">
              <MapPin size={13} className="shrink-0" />
              <span className="text-[11px] font-medium truncate max-w-[130px]">
                {address.trim() || 'Dirección de entrega...'}
              </span>
            </div>
          </div>

          <button type="button" className="p-1 text-vete-text-muted hover:text-vete-primary transition-colors">
            <ChevronDown size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="flex items-center justify-between w-full py-1.5 px-3 bg-vete-dark/40 text-vete-text-muted hover:text-vete-primary rounded-lg border border-vete-light-border/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <span>Ocultar Configuración</span>
          <ChevronDown size={14} className="rotate-180 transition-transform" />
        </button>
      )}

      {/* 2. CONTENEDOR COLAPSABLE CON SUB-COMPONENTES */}
      <div className={`
        /* --- Posición --- */
        flex flex-col gap-4 overflow-hidden
        /* --- Animación --- */
        transition-all duration-300
        ${isExpanded ? 'max-h-[500px] opacity-100 pt-1' : 'max-h-0 opacity-0 pointer-events-none'}
      `}>
        {/* Sub-componente Pago */}
        <PaymentSelector 
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          bankInfo={companyInfo.bank}
        />

        {/* Sub-componente Dirección */}
        <DeliveryAddressSection 
          address={address}
          setAddress={setAddress}
          mapsUrl={companyInfo.location.googleMapsUrl}
        />
      </div>


















{/* Aca va el menu contraieble   */}








































      {/* 3. TOTAL PERMANENTE Y BOTONERA */}
      <div className="flex flex-col gap-3 pt-2 border-t border-vete-light-border/30">
        <div className="flex justify-between items-baseline px-1">
          <span className="text-[10px] font-black uppercase text-vete-text-muted tracking-widest">
            Total a Pagar
          </span>
          <span className={`
            /* --- Texto --- */
            text-2xl font-black          /* Tamaño de destaque */
            text-vete-dark-green         /* Color institucional */
          `}>
            ${total.toLocaleString('es-UY')}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full">
          {/* Botón Vaciar */}
          <button 
            type="button"
            onClick={onClearCart} 
            disabled={pedido.length === 0}
            className={`
              /* --- Posición --- */
              flex items-center justify-center
              /* --- Dimensiones --- */
              p-3.5
              /* --- Colores --- */
              bg-transparent text-vete-error border-2 border-vete-error/30
              /* --- Estilo --- */
              rounded-xl
              /* --- Animación --- */
              hover:bg-vete-error/10 active:scale-95 disabled:opacity-30 transition-all
            `}
            title="Vaciar Carrito"
            aria-label="Vaciar Carrito"
          >
            <Trash2 size={18} />
          </button>

          {/* Botón WhatsApp Principal */}
          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={pedido.length === 0}
            className={`
              /* --- Posición --- */
              flex-1                       /* Toma el ancho restante */
              flex items-center justify-center gap-2
              /* --- Dimensiones --- */
              py-3.5 px-4
              /* --- Colores --- */
              bg-vete-dark-green text-white
              /* --- Texto --- */
              font-black uppercase tracking-wider text-xs
              /* --- Estilo --- */
              rounded-xl shadow-lg shadow-vete-dark-green/20
              /* --- Animación --- */
              hover:bg-vete-dark-green/90 active:scale-[0.98] disabled:opacity-40 transition-all
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
