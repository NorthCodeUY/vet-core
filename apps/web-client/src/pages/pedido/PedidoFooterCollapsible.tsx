
/* --- apps/web-client/src/pages/pedido/PedidoFooterCollapsible.tsx

<!> 

Cosas a corregir
- Tengo que convinarlo con el componente que traigo de PedidoDrawer
- Separa a sub componte forma de pago / Direccion 
- Meterlo comentario de metodo para cerrar e menu 
- El nombre no me ocmbese cambiarlo  
--- */

import React, { useState } from 'react';
import { 
  Banknote, 
  Building2, 
  CreditCard, 
  QrCode, 
  MapPin, 
  ChevronDown, 
  Trash2, 
  Send 
} from 'lucide-react';

// --------------------------------------------------------------------- 


import companyInfo from '../../data/companyInfo.json';
import { usePedidoStore } from '../../context/pedido_context';



// --------------------------------------------------------------------- 
/* =============================================================================
   CONFIGURACIÓN CENTRALIZADA DE MÉTODOS DE PAGO
   ============================================================================= */
const PAYMENT_METHODS = [
  {
    id: 'efectivo',
    label: 'Efectivo',
    description: 'Pago en mano al recibir',
    icon: Banknote,
    getMessage: () => '_Forma de pago: Efectivo (coordinar cambio con el vendedor)_'
  },
  {
    id: 'transferencia',
    label: 'Transferencia',
    description: 'BROU / PREX / Santander',
    icon: Building2,
    getMessage: () => 
      `*Datos de Transferencia:*\n- Banco: ${companyInfo.bank.name}\n- Cuenta: ${companyInfo.bank.accountNumber}\n- Titular: ${companyInfo.bank.beneficiary}\n_Adjuntaré el comprobante por este medio._`
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    description: 'Débito o Crédito al entregar',
    icon: CreditCard,
    getMessage: () => '_Forma de pago: Tarjeta de Débito/Crédito (coordinar pos con el vendedor)_'
  },
  {
    id: 'mercadopago',
    label: 'Mercado Pago',
    description: 'Link de pago / Código QR',
    icon: QrCode,
    getMessage: () => '_Forma de pago: Mercado Pago (solicito link de pago / QR)_'
  }
];

interface PedidoFooterCollapsibleProps {
  onClearCart: () => void;
}

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
      


















      {/* 1. BARRA COLAPSABLE / RESUMEN RÁPIDO 
      <!> Esto tiene que desapareser cuando se esteinde para que no sea 
      reiterativo que la trancicion no sea grosera
        */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          /* --- Posición --- */
          flex                         /* Contenedor flexible */
          items-center                 /* Centrado vertical */
          justify-between              /* Separa resumen de flecha */
          cursor-pointer               /* Cursor interactivo */
          select-none                  /* Evita selección accidental */

          /* --- Dimensiones --- */
          p-3                          /* Espacio de toque */

          /* --- Colores --- */
          bg-vete-dark                 /* Fondo oscuro suave */
          border                       /* Borde sutil */
          border-vete-light-border/40  /* Borde translúcido */

          /* --- Estilo --- */
          rounded-xl                   /* Bordes redondeados */

          /* --- Animación --- */
          hover:bg-vete-dark/80        /* Feedback hover */
          transition-colors            /* Transición suave */
        `}
      >
        <div className={`
          /* --- Posición --- */
          flex                         /* Elementos en línea */
          items-center                 /* Centrado */
          gap-3                        /* Separación entre método y dirección */
          overflow-hidden              /* Corta texto que desborde */
        `}>






 



          {/* <!> Me gustaria que este item colapsable en el menu me gusaria que desapareciese cuando esta extraido */}

          {/* <!> Aca tien eque ir un texto que diga forma de pago  para que sea esplisito */}
          {/* <!> Preview Método Forma de pago */}
          <div className="
            /* --- Posición --- */
            flex 
            items-center 
            gap-1.5 
            text-vete-primary 
            shrink-0
          ">
            <CurrentIcon size={16} /> 
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {currentPayment.label} {}
            </span>
          </div>

          <div className="h-3 w-px bg-vete-light-border shrink-0" />

          {/* Preview Dirección */}
          <div className="flex items-center gap-1.5 text-vete-text-muted truncate">
            <MapPin size={14} className="shrink-0" />
            <span className="text-[11px] font-medium truncate max-w-[140px]">
              {address.trim() || 'Dirección de entrega...'}
            </span>
          </div>
        </div>

        {/* Flecha Toggle con rotación */}
        <button 
          type="button"
          className="p-1 text-vete-text-muted hover:text-vete-primary transition-colors"
          aria-label="Expandir configuración de pedido"
        >
          <ChevronDown 
            size={18} 
            className={`
              /* --- Animación --- */
              transition-transform       /* Rotación suave */
              duration-300               /* Velocidad de giro */
              ${isExpanded ? 'rotate-180 text-vete-primary' : ''}
            `} 
          />
        </button>
      </div>

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      {/* 2. CONTENIDO DESPLEGABLE (Animado por clases) */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Organización en columna */
        gap-4                        /* Separación de secciones */
        overflow-hidden              /* Evita desbordes durante animación */

        /* --- Animación --- */
        transition-all               /* Anima altura y opacidad */
        duration-300                 /* Tiempo de transición */
        ${isExpanded 
          ? 'max-h-[400px] opacity-100 pt-1' 
          : 'max-h-0 opacity-0 pointer-events-none'
        }
      `}>
        
        {/* Selector de Método de Pago <!> Desplegado creo  */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-vete-text-muted tracking-widest ml-1">
            Método de Pago
          </label>


          <div className="relative">
            
            {/* Item de forma de pago <!> Esto hay que mejrorarlo  */}
            <CurrentIcon size={16} className="
              /* --- Posición --- */
              absolute 
              left-3.5 
              top-1/2 
              /* --- Colores --- */
              text-vete-primary 
              /* --- Estilo --- */
              pointer-events-none" />

              
              
              
              
              
              
              
              
              
              
              {/* El desplegable 
              
              
              <!> El formato del desplegable anterior era mejor traer para aca */}
            <select
              value={selectedMethod} // Determina que selecciono el menu desplegable
              onChange={(e) => setSelectedMethod(e.target.value)} // Detecta cuando cambia la seleccion y actualiza el estado
              className={`
                /* --- Dimensiones --- */
                w-full                      /* Ocupa todo el ancho disponible */
                py-2.5                      /* Relleno vertical */
                pl-10                     /* Relleno a la izquierda */
                pr-8                      /* Relleno a la derecha */
                /* --- Colores --- */
                bg-vete-dark                /* Fondo oscuro de la marca */
                text-vete-text-light        /* Texto blanco */
                border                      /* Borde */
                border-vete-light-border/40 /* Borde translúcido */
                /* --- Texto --- */
                text-xs font-bold           /* Texto pequeño en negrita */
                uppercase                   /* Texto en mayúsculas */
                /* --- Estilo --- */
                rounded-xl                  /* Bordes redondeados */
                outline-none                /* Sin borde al hacer foco */
                appearance-none             /* Sin estilo de navegador */
                cursor-pointer              /* Cursor de mano */
                focus:border-vete-primary   /* Borde verde al hacer foco */
                transition-colors           /* Transición suave */
              `}
            >
              
              {/* <!> Comentame esto porque no tengo ni idea que es  */}
              {PAYMENT_METHODS.map((pm) => (  
                <option key={pm.id} value={pm.id} className="bg-slate-900 text-white">
                  {pm.label} — {pm.description}
                </option>
              ))}
            </select>
              
            {/* Icono que permite abrir y cerrar  */}
            <ChevronDown size={14} className={`
              /* --- Posición --- */
              absolute 
              right-3.5 
              top-1/2 
              /* --- Estilo --- */
              -translate-y-1/2 
              text-vete-text-muted 
              pointer-events-none
              `} />
          </div>
        </div>

        {/* Detalle Banco si es Transferencia */}
        {selectedMethod === 'transferencia' && (
          <div className={`
            /* --- Posición --- */
            p-3                          /* Espaciado interno */
            /* --- Colores --- */
            bg-vete-primary/10           /* Fondo de resalte */
            border                       /* Borde con trazos */
            border-dashed                /* Borde punteado */
            border-vete-primary/40       /* Color verde marca */
            /* --- Estilo --- */
            rounded-xl                   /* Bordes suaves */
            animate-in fade-in           /* Entrada visual */
          `}>
            <p className={`
              /* --- Colores --- */
              text-vete-text-light 
              /* --- Texto --- */
              text-xs font-medium 
              /* --- Estilo --- */
              leading-tight
            `}>
              <span className="font-bold text-vete-primary">Datos Bancarios:</span><br />
              Banco: {companyInfo.bank.name}<br />
              Cuenta: {companyInfo.bank.accountNumber}<br />
              Titular: {companyInfo.bank.beneficiary}
            </p>
          </div>
        )}
















        

        {/* Entrada de Direccción */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-vete-text-muted tracking-widest">
              Dirección de Entrega
            </label>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Salto+Uruguay" 
              target="_blank" 
              rel="noreferrer"
              className="text-[9px] font-bold uppercase text-vete-primary hover:underline"
            >
              Buscar en Maps
            </a>
          </div>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vete-text-muted" />
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
                rounded-xl outline-none
                focus:border-vete-primary transition-all
              `}
            />
          </div>
        </div>
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
