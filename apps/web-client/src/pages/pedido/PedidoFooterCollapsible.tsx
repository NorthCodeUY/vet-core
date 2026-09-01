
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
  Send, // Enviar 
  Truck // Camioneta 
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
 * 
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

/* =============================================================================
   SUB-COMPONENTE: SELECTOR Y DETALLE DE MÉTODO DE PAGO
   ============================================================================= */

/**
 * Propiedades para el sub-componente `PaymentSelector`.
 * 
 * @interface PaymentSelectorProps
 * @property {string} selectedMethod - Identificador de la estrategia de pago seleccionada ('efectivo' | 'transferencia' | 'tarjeta' | 'mercadopago').
 * @property {function(string): void} setSelectedMethod - Función de despacho para actualizar el método de pago activo en el estado principal.
 * @property {Object} bankInfo - Objeto con la información bancaria institucional para liquidaciones vía transferencia.
 * @property {string} bankInfo.name - Nombre de la entidad bancaria o fintech (ej: 'PREX', 'BROU').
 * @property {string} bankInfo.accountNumber - Número de cuenta o identificador de destino de fondos.
 * @property {string} bankInfo.beneficiary - Titular registrado de la cuenta bancaria.
 */
interface PaymentSelectorProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  bankInfo: {
    name: string;
    accountNumber: string;
    beneficiary: string;
  };
}


/**
 * Sub-componente de selección de método de pago (`PaymentSelector`).
 * 
 * Renderiza un menú desplegable (combobox) estilizado para elegir la modalidad
 * de liquidación del pedido. Si el método seleccionado es transferencia bancaria,
 * despliega reactivamente una tarjeta informativa con los datos de cuenta y titular
 * extraídos del archivo de configuración corporativa.
 *
 * @component
 * @param {PaymentSelectorProps} props - Propiedades de configuración y control de selección.
 * @returns {JSX.Element} Control interactivo de selección de pago y panel condicional de datos bancarios.
 */
const PaymentSelector: React.FC<PaymentSelectorProps> = ({ 
  selectedMethod, 
  setSelectedMethod,
  bankInfo 
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
        {/* Icono del metodo de pago */}
        <CurrentIcon size={16} className={`
          /* --- Posición --- */
          absolute 
          left-3.5 
          top-1/2 
          -translate-y-1/2 
          text-vete-primary 
          pointer-events-none
        `}
        />
        {/* Desplegable con los metodos de pago */}
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
          {/* Opciones de los metodos de pago */}
          {PAYMENT_METHODS.map((pm) => (  















            
            // <!> Esto quiero mejorarlo en el menu anterior mostraba los logitos y se veia mejor la lista desplebalbe 
            <option key={pm.id} value={pm.id} className="bg-slate-900 text-white">
              {pm.label} — {pm.description}
            </option>
          ))}
        </select>
        {/* Icono de desplegable */}
        <ChevronDown size={14} className={`
          /* --- Posición --- */
          absolute 
          right-3.5 
          top-1/2 
          -translate-y-1/2 
          /* --- Colores --- */
          text-vete-text-muted 
          /* --- Comportamiento --- */
          pointer-events-none
        `}/>
      </div>





      {/* 
        Datos Bancarios condicionales 
        Cuadro que aparese en caso de seleccionar transferencia bancaria
        Se utiliza para mostrar los datos de la cuenta de manera visual 
      */}







      {/* <!> Lo de abajo deveria apuntar a variable no a transferencia texto  */}
      {selectedMethod === 'transferencia' && (
        <div className={`
          /* --- Posición --- */
          p-3
          /* --- Colores --- */
          bg-vete-primary/10 
          border 
          border-dashed 
          border-vete-primary/40
          /* --- Estilo --- */
          rounded-xl 
          animate-in 
          fade-in 
          duration-200
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




/* =============================================================================
   SUB-COMPONENTE: BARRA RESUMEN / GATILLO DEL ACORDEÓN
   ============================================================================= */

/**
 * Propiedades para el sub-componente `CheckoutSummaryBar`.
 * 
 * @interface CheckoutSummaryBarProps
 * @property {string} paymentLabel - Nombre del método de pago actual (ej: 'Efectivo', 'Transferencia').
 * @property {React.ComponentType<{ size?: number, className?: string }>} PaymentIcon - Componente de icono de Lucide correspondiente al pago.
 * @property {string} address - Dirección de entrega seleccionada o texto por defecto ('Retiro en Local').
 * @property {function(): void} onExpand - Callback que activa el estado de expansión en el componente padre.
 */
interface CheckoutSummaryBarProps {
  paymentLabel: string;
  PaymentIcon: React.ComponentType<{ size?: number; className?: string }>;
  address: string;
  onExpand: () => void;
}


/**
 * Barra compacta de resumen de checkout (`CheckoutSummaryBar`).
 * 
 * Se muestra cuando el panel de configuración está colapsado. Resume de forma
 * horizontal el método de pago y la dirección elegida en un botón interactivo
 * de bajo perfil vertical para no tapar los productos del carrito.
 *
 * @component
 * @param {CheckoutSummaryBarProps} props - Propiedades recibidas del orquestador.
 * @returns {JSX.Element} Barra interactiva con datos resumidos y botón de despliegue.
 */
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
        flex                         /* Contenedor flexible */
        items-center                 /* Centrado vertical */
        justify-between              /* Distribución a los extremos */
        cursor-pointer               /* Cursor interactivo */
        select-none                  /* Evita selección accidental de texto */

        /* --- Dimensiones --- */
        p-3                          /* Padding interno cómodo */

        /* --- Colores --- */
        bg-vete-dark                 /* Fondo oscuro base */
        border                       /* Borde habilitado */
        border-vete-light-border/40  /* Borde translúcido suave */

        /* --- Estilo --- */
        rounded-xl                   /* Bordes redondeados consistentes */

        /* --- Animación --- */
        hover:bg-vete-dark/80        /* Feedback visual en hover */
        transition-all               /* Suaviza transiciones */
      `}
    >
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor en línea */
        items-center                 /* Centrado */
        gap-3                        /* Separación entre método y dirección */
        overflow-hidden              /* Corta textos excesivos */
      `}>
        {/* Preview Método de Pago */}
        <div className={`
          /* --- Posición --- */
          flex items-center gap-1.5
          /* --- Colores --- */
          text-vete-primary
          /* --- Dimensiones --- */
          shrink-0                   /* No se achica */
        `}>
          <PaymentIcon size={16} /> 
          <span className={`
            /* --- Texto --- */
            text-[10px] font-black uppercase tracking-wider
          `}>
            Pago: <span className="font-bold">{paymentLabel}</span>
          </span>
        </div>

        {/* Separador vertical */}
        <div className="h-3 w-px bg-vete-light-border shrink-0" />

        {/* Preview Dirección de Entrega */}
        <div className={`
          /* --- Posición --- */
          flex items-center gap-1.5
          /* --- Colores --- */
          text-vete-text-muted
          /* --- Estilo --- */
          truncate                   /* Puntos suspensivos si no entra */
        `}>
          <MapPin size={13} className="shrink-0" />
          <span className={`
            /* --- Texto --- */
            text-[11px] font-medium truncate max-w-[130px]
          `}>
            {address.trim() || 'Retiro en Local'}
          </span>
        </div>
      </div>

      {/* Flecha indicadora */}
      <button 
        type="button" 
        className="p-1 text-vete-text-muted hover:text-vete-primary transition-colors"
        aria-label="Abrir opciones de pago y entrega"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};



/* =============================================================================
   SUB-COMPONENTE: LOGÍSTICA DE ENTREGA Y RETIRO
   ============================================================================= */


/**
 * Propiedades para el sub-componente `DeliveryAddressSection`.
 * 
 * @interface DeliveryAddressSectionProps
 * @property {string} address - Cadena reactiva con la dirección de destino o el estado especial "Retiro en Local".
 * @property {function(string): void} setAddress - Función de despacho para actualizar la dirección de entrega en el estado padre.
 * @property {string} mapsUrl - URL externa a Google Maps configurada en la información corporativa para geolocalización.
 */
interface DeliveryAddressSectionProps {
  address: string;
  setAddress: (addr: string) => void;
  mapsUrl: string;
}


/**
 * Sub-componente de selección de modalidad de entrega (`DeliveryAddressSection`).
 * 
 * Gestiona la logística del pedido ofreciendo dos caminos de despacho:
 * 1. **Retiro en Local:** Estado por defecto, minimiza la UI ocultando entradas de texto.
 * 2. **Envío a Domicilio:** Despliega reactivamente un campo de texto asistido para dirección manual.
 * 
 * Integra acceso directo a Google Maps para verificación de la ubicación del local comercial.
 *
 * @component
 * @param {DeliveryAddressSectionProps} props - Propiedades de configuración y setters de estado.
 * @returns {JSX.Element} Panel de opciones de entrega con selector binario y entrada de texto condicional. 
 */
const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
  address,
  setAddress,
  mapsUrl
}) => {
  const isRetiro = address === "Retiro en Local";
  return (
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Organización vertical */
      gap-2                        /* Espaciado interno */
    `}>
      <div className={`
        /* --- Posición --- */
        flex                         /* Alineación horizontal */
        justify-between              /* Extremos */
        items-center                 /* Centrado vertical */
        px-1                         /* Padding lateral */
      `}>
        <label className={`
          /* --- Texto --- */
          text-[10px] font-black uppercase tracking-widest
          /* --- Colores --- */
          text-vete-text-muted
        `}>
          Método de Entrega
        </label>

        <a 
          href={mapsUrl}
          target="_blank" 
          rel="noreferrer"
          className={`
            /* --- Texto --- */
            text-[9px] font-bold uppercase underline
            /* --- Colores --- */
            text-vete-primary hover:opacity-80
            /* --- Animación --- */
            transition-opacity
          `}
        >
          Ver Local en Maps
        </a>
      </div>

      {/* Botón Selector: Retiro en Local vs Envío a Domicilio */}
      <div className={`
        /* --- Posición --- */
        grid                         /* Sistema de grilla */
        grid-cols-2                  /* 2 columnas iguales */
        gap-2                        /* Espaciado entre botones */
      `}>

        {/* 1. Botón para Retiro en Local */}
        <button
          type="button"
          onClick={() => setAddress("Retiro en Local")}
          className={`
            /* --- Posición --- */
            flex                         /* Contenedor flexible */
            items-center                 /* Centrado vertical */
            justify-center               /* Centrado horizontal */
            gap-1.5                      /* Espacio icono-texto */

            /* --- Dimensiones --- */
            py-2.5                       /* Altura de botón cómoda */
            px-3                         /* Padding lateral */

            /* --- Texto --- */
            text-xs                      /* Tamaño estándar */
            font-bold                    /* Negrita */

            /* --- Estilo --- */
            rounded-xl                   /* Bordes redondeados */
            border-2                     /* Borde visible de 2px */

            /* --- Colores Dinámicos --- */
            ${isRetiro 
              ? 'bg-vete-primary text-white border-vete-primary shadow-md' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-vete-secondary'}

            /* --- Animación --- */
            transition-all               /* Transición suave */
            duration-200                 /* Velocidad de cambio */
            active:scale-95              /* Efecto de pulsación */
          `}
        >
          <MapPin size={14} className={isRetiro ? "text-white" : "text-vete-primary"} />
          <span>Retiro en Local</span>
        </button>
        
        {/* 2. Botón para Envío a Domicilio (Corregido) */}
        <button
          type="button"
          onClick={() => {
            if (isRetiro) setAddress("");
          }}
          className={`
            /* --- Posición --- */
            flex                         /* Contenedor flexible */
            items-center                 /* Centrado vertical */
            justify-center               /* Centrado horizontal */
            gap-1.5                      /* Espacio icono-texto */

            /* --- Dimensiones --- */
            py-2.5                       /* Altura de botón cómoda */
            px-3                         /* Padding lateral */

            /* --- Texto --- */
            text-xs                      /* Tamaño estándar */
            font-bold                    /* Negrita */

            /* --- Estilo --- */
            rounded-xl                   /* Bordes redondeados */
            border-2                     /* Borde visible de 2px */

            /* --- Colores Dinámicos --- */
            ${!isRetiro 
              ? 'bg-vete-primary text-white border-vete-primary shadow-md' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-vete-secondary'}

            /* --- Animación --- */
            transition-all               /* Transición suave */
            duration-200                 /* Velocidad de cambio */
            active:scale-95              /* Efecto de pulsación */
          `}
        >
          <Truck size={14} className={!isRetiro ? "text-white" : "text-vete-primary"} />
          <span>Envío a Domicilio</span>
        </button>
      </div>

      {/* Input Manual: Solo se muestra si NO es retiro en local */}
      {!isRetiro && (
        <div className={`
          /* --- Posición --- */
          relative
          /* --- Animación --- */
          animate-in fade-in slide-in-from-top-2 duration-200
        `}>
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vete-text-muted pointer-events-none" />
          <input 
            type="text"
            required
            autoFocus
            placeholder="Ingresa calle, número y esquina..."
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

/* =============================================================================
   COMPONENTE-Principal: 
   ============================================================================= */

/**
 * Propiedades del componente `PedidoFooterCollapsible`.
 * 
 * @interface PedidoFooterCollapsibleProps
 * @property {function(): void} onClearCart - Callback disparado al presionar el botón de vaciado de carrito (abre modal de confirmación en el padre).
 */
interface PedidoFooterCollapsibleProps {
  onClearCart: () => void;
}


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
  const [address, setAddress] = useState('Retiro en Local');  /* --- Estado inicial para dirección de entrega --- */

  /* Obtener el método de pago activo */
  const currentPayment = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];
  const CurrentIcon = currentPayment.icon;

  /* Manejo de Confirmación y Construcción del WhatsApp */
  const handleConfirmOrder = () => {
    
    /* Validación: Debe ser 'Retiro en Local' o tener texto ingresado */
    if (address !== 'Retiro en Local' && !address.trim()) {
      alert("Por favor, ingresa una dirección de entrega válida o selecciona 'Retiro en Local'.");
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
        <CheckoutSummaryBar 
          paymentLabel={currentPayment.label}
          PaymentIcon={CurrentIcon}
          address={address}
          onExpand={() => setIsExpanded(true)}
        />
      ) : (


        /* Botón fino centrado (Recuadro Rojo) */
        <div className="flex justify-center w-full py-0.5">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            title="Plegar menú"
            aria-label="Plegar menú"
            className={`
              /* --- Posición --- */
              flex items-center justify-center gap-1
              /* --- Dimensiones --- */
              px-4 py-1
              /* --- Colores --- */
              bg-vete-dark/50 text-vete-text-muted hover:text-vete-primary hover:bg-vete-dark
              /* --- Estilo --- */
              rounded-full border border-vete-light-border/30 text-[9px] font-bold uppercase tracking-wider
              /* --- Animación --- */
              transition-all duration-200 hover:scale-105
            `}
          >
            <span>Plegar</span>
            <ChevronDown size={13} className="rotate-180 transition-transform" />
          </button>
        </div>


        // <button
        //   type="button"
        //   onClick={() => setIsExpanded(false)}
        //   className="flex items-center justify-between w-full py-1.5 px-3 bg-vete-dark/40 text-vete-text-muted hover:text-vete-primary rounded-lg border border-vete-light-border/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
        // >
        //   {/* <!> Esto es lo que yo quiero que sea mas chico solo una flecha estetica y cuado estes ensima que te muestre una lejenda si estas un rato parado  */}
        //   <span>Ocultar Configuración</span>
        //   <ChevronDown size={14} className="rotate-180 transition-transform" />
        // </button>


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
