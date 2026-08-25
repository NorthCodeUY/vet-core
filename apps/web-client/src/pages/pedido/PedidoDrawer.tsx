

/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */





import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, MapPin, Send, Package, Trash2, Edit, Plus, ChevronDown, ShoppingCart ,Banknote, Building2, Coins, DollarSign} from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context';
import { PedidoItemRow } from './PedidoItemRow';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useAddressManagement } from '../../hooks/useAddressManagement'
import type { UserAddress } from '../../hooks/useAddressManagement'
import { WhatsAppDynamicButton } from '../../components/WhatsAppDynamicButton';

import companyInfo from '../../data/companyInfo.json'; // Datos de la empresa 
import { PedidoFooterCollapsible } from './PedidoFooterCollapsible';

/**
 * Entidad de Perfil de Usuario (`UserProfile`).
 * 
 * Representa los datos esenciales de la cuenta del cliente para fines de precarga 
 * y logística en el proceso de compra. Utilizada para poblar automáticamente los campos 
 * de contacto y dirección predeterminada cuando el usuario inicia sesión.
 *
 * @interface UserProfile
 * @property {string} id - Identificador único del usuario/cliente.
 * @property {string} name - Nombre completo del cliente para la cabecera del pedido.
 * @property {string} email - Correo electrónico registrado para notificaciones.
 * @property {string} defaultAddress - Dirección de entrega habitual utilizada por defecto.
 */
interface UserProfile {
  id: string;
  name: string;
  email: string;
  defaultAddress: string; // Dirección predeterminada del usuario
}

/**
 * Hook simulado para obtener la dirección predeterminada del usuario logueado.
 * Esta es una ABSTRACCIÓN. Debes reemplazarla con tu lógica real de autenticación/perfil.
 * Ahora se usa para inicializar *si no hay direcciones guardadas*.
 *
 * @returns {{ defaultAddress: string | null, loadingUserAddress: boolean }}
 */
const useUserInitialAddress = () => {
  const [defaultAddress, setDefaultAddress] = useState<string | null>(null);
  const [loadingUserAddress, setLoadingUserAddress] = useState(true);

  useEffect(() => {
    const fetchUserAddress = async () => {
      setLoadingUserAddress(true);
      // Simula una llamada a la API o la obtención de datos del usuario logueado
      await new Promise(resolve => setTimeout(resolve, 800)); // Retraso para simular carga
      // <!- MODIFICAR AQUI -> Reemplazar con la lógica real para obtener el usuario y su dirección
      const loggedInUser: UserProfile | null = { // Simula un usuario logueado
        id: 'user-123',
        name: 'Cliente Ejemplo',
        email: 'cliente@ejemplo.com',
        defaultAddress: 'Av. Principal 1234, Barrio Centro, Ciudad Capital', // Dirección por defecto
      };
      // const loggedInUser: UserProfile | null = null; // Simula un usuario NO logueado o sin dirección

      if (loggedInUser?.defaultAddress) {
        setDefaultAddress(loggedInUser.defaultAddress);
      }
      setLoadingUserAddress(false);
    };

    fetchUserAddress();
  }, []);

  return { defaultAddress, loadingUserAddress };
};

/**
 * Interfaz para las props del componente PedidoDrawer.
 * @param isOpen - Controla la visibilidad del drawer.
 * @param onClose - Función para cerrar el drawer.
 */
interface PedidoDrawerProps {
  isOpen: boolean;    // Controla la visibilidad del drawer.
  onClose: () => void; // Función para cerrar el drawer.
}


/**
 * Header del carrito con el título y el contador de ítems.
 * @param itemCount - Número de ítems en el carrito
 * @param onClose - Función para cerrar el drawer
 */
const DrawerHeader = ({ itemCount, onClose }: { itemCount: number; onClose: () => void }) => (
  <div className={`
    /* --- Posición --- */
    relative                     /* Base para el fondo de pasto absoluto */
    flex                         /* Contenedor flexible */
    items-center                 /* Centrado vertical */
    justify-between              /* Separa identidad de botón cerrar */
    overflow-hidden              /* Corta el pasto que sobresalga */
    
    /* --- Dimensiones --- */
    p-5                          /* Padding interno generoso */
    min-h-[100px]                /* Altura mínima para lucir el diseño */

    /* --- Colores --- */
    bg-vete-secondary            /* Fondo azul pizarra de la marca */
    
    
  `}>
    
    {/* --- FONDO DE PASTO INVERTIDO --- */}
    <img
      src="/images/branding/NavPasto.png"
      alt=""
      className={`
        /* --- Posición --- */
        absolute                     /* Flota detrás del contenido */
        top-0                        /* Pegado al techo del drawer */
        left-0                       /* Alineado al inicio */
        z-0                          /* Capa inferior */
        pointer-events-none          /* No interfiere con clics */

        /* --- Dimensiones --- */
        w-full h-full                /* Cubre todo el header */
        
        /* --- Estilo --- */
        object-cover                 /* No deforma la imagen */
        opacity-35                   /* Transparencia sutil para no tapar texto */
        
        /* --- Transformación --- */
        scale-y-[-1]                 /*  EFECTO ESPEJO: Puntas hacia abajo */
      `}
    />

    {/* --- IDENTIDAD VISUAL (Logo + Título) --- */}
    <div className="relative z-10 flex items-center gap-3">
      {/* Logo de la Empresa */}
      <img 
        src="/logo.png" 
        alt="Logo" 
        className="w-10 h-10 object-contain shrink-0" 
      />
      
      {/* Título con patrón del Header General */}
      <div className={`
          /* --- Posición --- */
          relative /* Por encima del pasto */
          z-10     /* Encima del pasto */         
          flex     /* Flexbox */
          flex-col /* Columna */
          leading-[0.85] /* Altura de linea */
          text-vete-text-light                  /* Texto base blanco */
        `}>
        <span className={`
          /* --- Dimensiones --- */
          text-[10px]                        /* Tamaño de letra */
          
          /* --- Estilo --- */
          font-black                         /* Negrita */
          uppercase                          /* Letra mayuscula */
          tracking-tighter                   /* Espaciado entre letras */
          opacity-80                         /* Opacidad */
        `}>
          Veterinaria
        </span>
        <span className={`
          /* --- Dimensiones --- */
          text-lg 
          /* --- Colores ---   */
          font-black 
          uppercase 
          /* --- Estilo --- */
          tracking-tighter 
          /* --- Animación --- */
          opacity-80 
        `}>
          Beltramelli<span className="text-vete-primary">.</span>
        </span>
      </div>

      {/* Badge de Cantidad */}
      <div className={`
        /* --- Posición --- */
        flex items-center gap-1.5
        /* --- Dimensiones --- */
        ml-2 px-2.5 py-1
        /* --- Colores --- */
        bg-vete-primary              /* Verde marca */
        /* --- Estilo --- */
        rounded-full 
        shadow-lg
      `}>
        <ShoppingCart size={12} className="text-white" />
        <span className="text-[13px] font-black text-white">{itemCount}</span>
      </div>
    </div>


    {/* --- BOTÓN CERRAR --- */}
    <button 
      onClick={onClose} 
      className={`
        /* --- Posición --- */
        relative z-10                /* Se posiciona por encima del fondo de pasto */
        flex items-center            /* Centrado del icono X */
        justify-center               /* Centrado del icono X */
        
        /* --- Dimensiones --- */
        w-10 h-10                    /* Tamaño fijo para asegurar un círculo perfecto */
        p-2                          /* Espaciado interno */

        /* --- Colores --- */
        bg-vete-secondary            /* Fondo azul (mismo color que el badge del carrito) */
        text-vete-text-light                  /* Color de la cruz para máximo contraste */
        
        /* --- Estilo --- */
        rounded-full                 /* Forma circular */
        shadow-lg                    /* Sombra para dar profundidad sobre el pasto */
        
        /* --- Animación --- */
        hover:bg-vete-primary        /* Cambia al verde de la marca al pasar el mouse */
        active:scale-90              /* Efecto de pulsación al hacer clic */
        transition-all               /* Suaviza la transición de color y escala */
        duration-300                 /* Velocidad de la animación */
      `}
      aria-label="Cerrar carrito"
    >
      {/* 
          Reducimos el size a 20 o 24 para que respire mejor dentro del círculo de 10x10, 
          pero aumentamos el grosor (strokeWidth) para que sea bien legible. 
      */}
      <X size={20} strokeWidth={3} />
    </button>

  </div>
);

/**
 * Componente de Checkout y Cierre de Pedido (`CartCheckoutSection`).
 * 
 * Actúa como el pie de página (footer) interactivo del drawer del carrito.
 * Centraliza la visualización del monto total acumulado, la selección dinámica 
 * del método de pago (Efectivo/Transferencia) mediante un panel colapsable, 
 * la captura de la dirección de entrega y la botonera de acciones finales 
 * (Confirmación vía WhatsApp y Vaciado de carrito).
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {PedidoItem[]} props.pedido - Lista reactiva de productos seleccionados actualmente en el carrito.
 * @param {number} props.total - Monto total acumulado de la compra en Pesos Uruguayos (UYU).
 * @param {string} props.address - Valor actual del campo de texto de la dirección de entrega.
 * @param {function(string): void} props.setAddress - Función de despacho para actualizar la dirección de entrega.
 * @param {string} props.paymentMethod - Método de pago seleccionado ('efectivo' | 'transferencia').
 * @param {function(string): void} props.setPaymentMethod - Función para alternar el método de pago activo.
 * @param {function(): void} props.onConfirm - Callback que procesa el pedido y abre el chat de WhatsApp con el mensaje estructurado.
 * @param {function(): void} props.onClear - Callback para disparar el modal de confirmación de vaciado de carrito.
 * 
 * @returns {JSX.Element} Panel inferior fijo (sticky) con los controles de checkout del pedido.
 */
const CartCheckoutSection = ({ 
  pedido, 
  total, 
  address, 
  setAddress, 
  paymentMethod, 
  setPaymentMethod,
  onConfirm, 
  onClear 
}: any) => {

  /* Estado para mostrar/ocultar los detalles de pago y ahorrar espacio */
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  
  return (
    
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Alineación vertical base */
      gap-3                        /* <!> gap-4  Espacio entre bloques */
      /*mt-2                    <!>     Margen superior reducido */
      /* --- Dimensiones --- */
      p-4                          /* Padding */
      bg-vete-card-white           /* Fondo blanco */
      border-t                     /* Borde superior */
      border-vete-light-border     /* Borde superior gris */
    `}>

      {/* --- FILA 1: Método Rápido (Izquierda) + Total (Derecha) --- */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        justify-between              /* Separa etiqueta de monto */
        items-end                    /* Alinea a la base del texto */
        /* --- Dimensiones --- */
        px-1                         /* Ajuste lateral */
        `}>
        
        {/* Botón selector/toggle  */}
        <button
          type="button"
          onClick={() => setShowPaymentDetails(!showPaymentDetails)}
          className={`
            /* --- Posición --- */
            flex 
            items-center 
            gap-1.5
            /* --- Dimensiones --- */
            py-1.5 
            px-3
            /* --- Colores --- */
            bg-vete-dark 
            text-vete-text-light 
            hover:bg-vete-dark/80
            /* --- Estilo --- */
            rounded-lg 
            border 
            border-vete-light-border/30
            text-xs 
            font-bold 
            uppercase 
            transition-all
          `}
        >
          {paymentMethod === 'efectivo' ? <Banknote size={14} className="text-vete-primary" /> : <Building2 size={14} className="text-vete-primary" />}
          <span>{paymentMethod}</span>
          <ChevronDown size={12} className={`transition-transform duration-200 ${showPaymentDetails ? 'rotate-180' : ''}`} />
        </button>

        {/* Total destacado */}
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-black uppercase text-vete-text-muted">Total:</span>
          <span className="text-2xl font-black text-vete-dark-green">
            ${total.toLocaleString('es-UY')}
          </span>
        </div>
      </div>

      {/* --- PANEL DESPLEGABLE DE PAGO (Opcional, ahorra espacio) --- */}
      {showPaymentDetails && (
        <PaymentSelector 
          method={paymentMethod} 
          setMethod={setPaymentMethod} 
          bankInfo={`${companyInfo.bank.name} - Cta: ${companyInfo.bank.accountNumber} (${companyInfo.bank.beneficiary})`}
        />
      )}


      {/* Input de Dirección Compacto */}
      <SimpleAddressInput 
        value={address} 
        onChange={setAddress} 
      />




      {/*<!> Esto es para cuando tenga la parte de pedidos sentralizado no borrar  <AddressManager {...addressProps} selectedAddress={selectedAddress} />  */}

      {/* --- BOTONERA DE ACCIÓN (HORIZONTAL) --- */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Ahora es una fila */
        items-center                 /* Centrado vertical */
        gap-3                        /* Espacio entre botones */
        
        /* --- Dimensiones --- */
        w-full                       /* Ancho total */
      `}>
        
        {/* Botón Cancelar / Vaciar (Izquierda) */}
        <button 
          onClick={onClear} 
          disabled={pedido.length === 0} 
          className={`
            /* --- Posición --- */
            flex 
            items-center 
            justify-center gap-2
            
            /* --- Dimensiones --- */
            px-4 py-3                /* Padding equilibrado */
            
            /* --- Colores --- */
            bg-transparent           /* Sin fondo */
            border-2                 /* Borde visible */
            border-vete-error        /* Color rojo error */
            text-vete-error          /* Texto rojo */
            
            /* --- Estilo --- */
            rounded-xl               /* Bordes redondeados */
            font-bold                /* Negrita */
            uppercase                /* Mayúsculas */
            text-[10px]              /* Tamaño pequeño para el row */
            
            /* --- Animación --- */
            hover:bg-vete-error/10   /* Fondo tenue al pasar mouse */
            disabled:opacity-30      /* Transparencia si está vacío */
            transition-all
          `}
        >
          <Trash2 size={14} />
          <span className="hidden xs:inline">Vaciar</span>
        </button>

        {/* Botón Confirmar (Derecha - Usando el componente dinámico) */}


        <WhatsAppDynamicButton 
          label="Confirmar Pedido"
          hoverLabel="Enviar a WhatsApp" 
          phone={companyInfo.contact.adminPhone}
          colorToken="vete-tertiary"      
          onClick={onConfirm}
          disabled={pedido.length === 0}
        />


      </div>
    </div>
  );
};





























// <!> Bloque actual no inyectado 



          /* =============================================================================
            CONTRATO DE PROPIEDADES: SELECTOR DE PAGO
            ============================================================================= */

          /**
           * Propiedades para el sub-componente `PaymentSelector`.
           *
           * @interface PaymentSelectorProps
           * @property {string} method - Identificador del método de pago actualmente seleccionado (ej: 'efectivo', 'transferencia').
           * @property {function(string): void} setMethod - Función disparadora para actualizar el estado del método de pago en el componente padre.
           * @property {string} bankInfo - Cadena de texto preformateada con los datos bancarios institucionales para depósitos o transferencias.
           */
          interface PaymentSelectorProps {
            method: string;
            setMethod: (method: string) => void;
            bankInfo: string;
          }

//<!> Aqui es donde guardaria los datos por si se quiere usar mas adelente 

/* =============================================================================
   SUB-COMPONENTE: SELECTOR DE PAGO (COMBO BOX)
   <!> Por haora sacamos el campo monedas no lo deberia usar simpre la moneda es $ 
   ============================================================================= */



/* =============================================================================
   SUB-COMPONENTE: SELECTOR DE MÉTODO DE PAGO
   ============================================================================= */

/**
 * Selector desplegable de métodos de pago (`PaymentSelector`).
 * 
 * Renderiza un control de selección estilizado (combobox) que permite al cliente
 * elegir la modalidad de abono de su pedido. Incluye soporte visual condicional
 * para desplegar los datos bancarios oficiales cuando se selecciona la opción de transferencia.
 *
 * @component
 * @param {PaymentSelectorProps} props - Propiedades de configuración y control de estado.
 * @returns {JSX.Element} Control de formulario con select personalizado y panel condicional de datos bancarios.
 */
const PaymentSelector: React.FC<PaymentSelectorProps> = ({ 
  method, 
  setMethod, 
  bankInfo 
}) => {

// <!> Versio remover 
// const PaymentSelector = ({ 
//   method, 
//   setMethod, 
//   bankInfo 
// }: { 
//   method: string; 
//   setMethod: (m: string) => void; 
//   bankInfo: string;
// }) => {





  return (
    <div className={`
      /* --- Posición --- */
      flex flex-col gap-2
      /* --- Dimensiones --- */
      w-full mt-1
    `}>
      <div className="relative flex items-center">
        <Banknote size={14} className="absolute left-3 text-vete-primary pointer-events-none" />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`
            /* --- Dimensiones --- */
            w-full py-2 pl-9 pr-8
            /* --- Colores --- */
            bg-vete-dark text-vete-text-light border border-vete-light-border/40
            /* --- Texto --- */
            text-xs font-bold uppercase
            /* --- Estilo --- */
            rounded-xl outline-none appearance-none cursor-pointer
            focus:border-vete-primary
          `}
        >
          <option value="efectivo">💵 Efectivo (Pago al recibir)</option>
          <option value="transferencia">🏦 Transferencia Bancaria</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 text-vete-text-muted pointer-events-none" />
      </div>

      {/* Datos Bancarios: Solo si elige Transferencia */}
      {method === 'transferencia' && (
        <div className={`
          /* --- Posición --- */
          p-2.5
          /* --- Colores --- */
          bg-vete-primary/10 border border-dashed border-vete-primary/40
          /* --- Estilo --- */
          rounded-xl animate-in fade-in duration-200
        `}>
          <p className="text-[11px] text-vete-text-light leading-tight">
            <span className="font-bold text-vete-primary">Datos para el pago:</span><br />
            {bankInfo}
          </p>
        </div>
      )}
    </div>
  );
};


  /**
   * Renderiza el contenido del drawer, mostrando la lista de productos.
   * @param pedido - Array de ítems del pedido
   * @returns Componente DrawerContent
   */
  const DrawerContent = ({ pedido }: { pedido: any[] }) => (
    <div className={`
      /* --- Posición --- */
      flex-1 overflow-y-auto
      /* --- Dimensiones --- */
      p-4
      /* --- Colores --- */
      bg-vete-dark
    `}>
      {pedido.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-vete-text-muted gap-4">
          <Package size={64} className="opacity-20" />
          <p className="font-bold italic">Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pedido.map((item) => (
            <PedidoItemRow key={item.producto.prod_id} item={item} />
          ))}
        </div>
      )}
    </div>
  );










/**
 * Componente de Entrada de Dirección Simplificada (`SimpleAddressInput`).
 * 
 * Diseñado para la etapa MVP (sin persistencia en base de datos). Permite al cliente 
 * ingresar manualmente su dirección de entrega o referencias en la ciudad de Salto, 
 * e incluye un acceso directo para consultar la ubicación geográfica en Google Maps.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.value - Texto actual de la dirección ingresada por el usuario.
 * @param {function(string): void} props.onChange - Callback que actualiza el estado de la dirección en el componente padre.
 * 
 * @returns {JSX.Element} Campo de texto estilizado con botón de enlace a Google Maps.
 */
const SimpleAddressInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  
  /* Función para ayudar al usuario a encontrar su dirección en Salto */
  const openGoogleMaps = () => {
    const url = "https://www.google.com/maps/search/?api=1&query=Veterinaria+Beltramelli+Salto";
    window.open(url, '_blank');
  };

  return (
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Alineación vertical */
      gap-2                        /* Espacio entre etiqueta e input */
      
      /* --- Dimensiones --- */
      w-full                       /* Ancho total */
      mb-4                         /* Margen inferior */
    `}>
      
      {/* Cabecera con Link a Maps */}
      <div className="flex justify-between items-center px-1">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-vete-text-muted tracking-widest">
          <MapPin size={14} className="text-vete-primary" />
          Dirección de Entrega
        </label>
        
        <button 
          onClick={openGoogleMaps}
          className={`
            /* --- Texto --- */
            text-[9px] font-bold uppercase underline
            /* --- Colores --- */
            text-vete-primary/70 hover:text-vete-primary
            /* --- Animación --- */
            transition-colors
          `}
        >
          Buscar en Maps
        </button>
      </div>

      {/* Input Principal */}
      <div className="relative group">
        <input 
          type="text"
          placeholder="Calle, número o referencia (Salto)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            /* --- Dimensiones --- */
            w-full                       /* Ancho total */
            py-3                         /* Padding vertical cómodo */
            pl-4                         /* Padding izquierdo */
            pr-4                         /* Padding derecho */
            
            /* --- Colores --- */
            bg-vete-dark/40              /* Fondo oscuro sutil */
            text-vete-text-light         /* Texto claro */
            border-2                     /* Borde de 2px */
            border-transparent           /* Invisible por defecto */
            
            /* --- Estilo --- */
            rounded-2xl                  /* Bordes redondeados */
            outline-none                 /* Quita el aro azul */
            text-sm                      /* Tamaño de fuente de lectura */
            
            /* --- Animación --- */
            focus:border-vete-primary    /* Resalta al escribir */
            focus:bg-vete-dark/60        /* Oscurece un poco al foco */
            transition-all duration-300
          `}
        />
      </div>
      
      <p className="text-[9px] text-vete-text-muted italic ml-1">
        * Esta dirección se incluirá en tu mensaje de WhatsApp.
      </p>
    </div>
  );
};








  /**
   * <!> Esto no lo estamos usando aun hasta que tengamos pedido sentralizado 
   * Maneja la lógica de direcciones: selección, edición, guardado y eliminación.
   * Es el "cerebro" de la gestión de direcciones dentro del carrito.
   * @param selectedAddress - Dirección seleccionada actualmente
   * @param isEditingAddress - Estado de edición
   * @param currentAddressInput - Valor actual del input de dirección
   * @param setCurrentAddressInput - Setter para el input de dirección
   * @param currentAddressLabel - Valor actual de la etiqueta de dirección
   * @param setCurrentAddressLabel - Setter para la etiqueta de dirección
   * @param isAddressListOpen - Estado de la lista desplegable de direcciones
   * @param addresses - Lista de direcciones disponibles
   * @param onSave - Función para guardar la dirección
   * @param onCancel - Función para cancelar la edición
   * @param onStartEdit - Función para iniciar la edición
   * @param onToggleList - Función para alternar la lista de direcciones
   * @param onSelect - Función para seleccionar una dirección
   * @param onDelete - Función para eliminar una dirección
   * @param onNew - Función para crear una nueva dirección
   * 
   * <!> Hacerlo más pequeño. Que funcione con Google Maps y permita añadir texto 
   * para mayor claridad. Al principio no guardaremos direcciones porque no tenemos 
   * backend; en su lugar, ofrecer una opción para seleccionar la dirección y guardarla 
   * en el enlace para compartir, o incluirla en el mensaje predefinido. No me
   * interesa que el enlace almacene ese dato, ya que los usuarios pueden tenerlo en WhatsApp.
   * 
   */
  const AddressManager = ({ 
    selectedAddress, 
    isEditingAddress, 
    currentAddressInput, 
    setCurrentAddressInput,
    currentAddressLabel, 
    setCurrentAddressLabel, 
    isAddressListOpen, 
    addresses,
    onSave, 
    onCancel, 
    onStartEdit, 
    onToggleList, 
    onSelect, 
    onDelete, 
    onNew
  }: any) => (

    /* --- Bloque de Gestión de Direcciones --- */
    <div className={`
      /* --- Posición --- */
      flex                         /* Activa contenedor flexible */
      flex-col                     /* Alineación vertical */
      
      /* --- Dimensiones --- */
      gap-2                        /* Espacio entre etiqueta e input */
    `}>
      <label className={`
        /* --- Posición --- */
        flex                         /* Alineación para icono y texto */
        items-center                 /* Centrado vertical */
        
        /* --- Dimensiones --- */
        gap-2                        /* Espacio icono-texto */
        ml-1                         /* Margen izquierdo sutil */
        
        /* --- Texto --- */
        text-xs                      /* Tamaño de fuente pequeño */
        font-bold                    /* Peso de fuente negrita */
        uppercase                    /* Texto en mayúsculas */

        /* --- Colores --- */
        text-vete-text-muted         /* Color gris de la paleta */
      `}>
        <MapPin size={14} className="text-vete-dark-green" />
        Dirección de Entrega
      </label>
      
      <div className="relative">
        {isEditingAddress || !selectedAddress ? (
          <div className={`
            /* --- Posición --- */
            flex                         /* Contenedor de edición */
            flex-col                     /* Inputs apilados */
            
            /* --- Dimensiones --- */
            gap-2                        /* Espacio entre campos */
          `}>
            <input 
              type="text" 
              placeholder="Ej: Av. Italia 1543"
              className={`
                /* --- Dimensiones --- */
                w-full                       /* Ancho total */
                py-2.5                       /* Padding vertical */
                pl-4                         /* Padding izquierdo */
                
                /* --- Colores --- */
                bg-vete-dark                 /* Fondo oscuro de la paleta */
                text-vete-text-light         /* Texto claro */
                border-transparent           /* Sin borde inicial */
                
                /* --- Estilo --- */
                rounded-xl                   /* Bordes redondeados */
                border-2                     /* Grosor de borde */
                outline-none                 /* Quita el aro por defecto */
                
                /* --- Animación --- */
                focus:border-vete-primary    /* Resalta al escribir */
                transition-all               /* Suaviza el cambio */
              `}
              value={currentAddressInput} 
              onChange={(e) => setCurrentAddressInput(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Etiqueta (Casa, Trabajo)"
              className={`
                /* --- Dimensiones --- */
                w-full py-2.5 pl-4
                /* --- Colores --- */
                bg-vete-dark text-vete-text-light border-transparent
                /* --- Estilo --- */
                rounded-xl border-2 outline-none
                /* --- Animación --- */
                focus:border-vete-primary transition-all
              `}
              value={currentAddressLabel} 
              onChange={(e) => setCurrentAddressLabel(e.target.value)}
            />
            <div className="flex gap-2 mt-1">
              <button 
                onClick={onSave} 
                className={`
                  /* --- Posición --- */
                  flex-1                       /* Ocupa mitad del espacio */
                  
                  /* --- Dimensiones --- */
                  py-2                         /* Padding vertical */
                  
                  /* --- Colores --- */
                  bg-vete-primary              /* Verde principal */
                  text-white                   /* Texto blanco */
                  
                  /* --- Texto --- */
                  font-bold                    /* Negrita */
                  text-sm                      /* Tamaño pequeño */
                  
                  /* --- Estilo --- */
                  rounded-lg                   /* Bordes suavizados */
                `}
              >
                Guardar
              </button>
              <button 
                onClick={onCancel} 
                className={`
                  /* --- Posición --- */
                  flex-1
                  /* --- Dimensiones --- */
                  py-2
                  /* --- Colores --- */
                  border                       /* Borde habilitado */
                  border-vete-light-border     /* Color de borde suave */
                  text-vete-text-muted         /* Texto gris */
                  /* --- Estilo --- */
                  rounded-lg
                `}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className={`
              /* --- Posición --- */
              flex                         /* Contenedor de visualización */
              items-center                 /* Centrado vertical */
              justify-between              /* Separa texto de botones */
              
              /* --- Dimensiones --- */
              w-full                       /* Ancho total */
              py-2.5                       /* Padding vertical */
              pl-4                         /* Padding izquierdo */
              pr-2                         /* Padding derecho menor */
              
              /* --- Colores --- */
              bg-vete-dark                 /* Fondo oscuro */
              
              /* --- Estilo --- */
              rounded-xl                   /* Bordes redondeados */
            `}>
              <p className={`
                /* --- Texto --- */
                text-vete-text-light         /* Color claro */
                text-sm                      /* Tamaño pequeño */
                font-medium                  /* Peso medio */
                truncate                     /* Corta texto largo con ... */
                
                /* --- Posición --- */
                flex-1                       /* Toma el espacio central */
              `}>
                <span className="font-bold text-vete-primary">{selectedAddress.label}:</span> {selectedAddress.addressLine}
              </p>
              <div className="flex gap-1">
                <button onClick={() => onStartEdit(selectedAddress)} className="p-1.5 text-vete-primary">
                  <Edit size={16} />
                </button>
                <button onClick={onToggleList} className="p-1.5 text-vete-text-muted">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {isAddressListOpen && (
              <div className={`
                /* --- Posición --- */
                absolute                     /* Flota sobre el contenido */
                z-50                         /* Capa superior */
                
                /* --- Dimensiones --- */
                w-full                       /* Mismo ancho que el input */
                mt-2                         /* Separación superior */
                max-h-40                     /* Altura máxima con scroll */
                overflow-y-auto              /* Activa scroll vertical */
                
                /* --- Colores --- */
                bg-vete-dark                 /* Fondo oscuro */
                border                       /* Borde habilitado */
                border-vete-light-border     /* Color de borde */
                
                /* --- Estilo --- */
                rounded-xl                   /* Bordes redondeados */
                shadow-md                    /* Sombra para profundidad */
              `}>
                {addresses.map((addr: any) => (
                  <div 
                    key={addr.id} 
                    className={`
                      /* --- Posición --- */
                      flex items-center justify-between
                      /* --- Dimensiones --- */
                      p-3
                      /* --- Colores --- */
                      border-b border-vete-light-border last:border-b-0
                      /* --- Animación --- */
                      hover:bg-vete-light-border   /* Feedback al pasar mouse */
                      transition-colors
                    `}
                  >
                    <button 
                      onClick={() => onSelect(addr.id)} 
                      className="flex-1 text-left text-vete-text-light text-sm"
                    >
                      <span className="font-bold text-vete-primary">{addr.label}:</span> {addr.addressLine}
                    </button>
                    <button onClick={() => onDelete(addr.id)} className="p-1 text-vete-error">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={onNew} 
                  className={`
                    /* --- Dimensiones --- */
                    w-full p-3
                    /* --- Texto --- */
                    text-vete-primary font-bold text-sm
                    /* --- Colores --- */
                    hover:bg-vete-light-border
                    /* --- Animación --- */
                    transition-colors
                  `}
                >
                  + Nueva dirección
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    );



/**
 * Contenedor Maestro del Carrito de Compras (`PedidoDrawer`).
 * 
 * Componente orquestador que gestiona la visualización lateral (Drawer) del pedido.
 * Centraliza la interacción con la fachada `usePedidoStore`, coordina la lista de productos 
 * seleccionados, el cálculo reactivo de subtotales, la selección del método de pago, 
 * la dirección de entrega y los modales de confirmación.
 *
 * @component
 * @param {PedidoDrawerProps} props - Propiedades de control de visibilidad.
 * @param {boolean} props.isOpen - Bandera que determina si el menú lateral está visible o colapsado.
 * @param {function(): void} props.onClose - Callback para cerrar el menú lateral y ocultar el overlay.
 * 
 * @returns {JSX.Element} Panel lateral deslizable (Off-canvas) con el flujo completo de compra.
 */
export const PedidoDrawer = ({ isOpen, onClose }: PedidoDrawerProps) => {
  const { pedido, total, itemCount, clearPedido } = usePedidoStore();
  
  // const {  // <!> Esto no lo voy a usar por haora 
  //   addresses, // Array de direcciones guardadas
  //   selectedAddress, // Dirección seleccionada actual
  //   addAddress, // Función para agregar una nueva dirección
  //   updateAddress, // Función para actualizar una dirección existente
  //   deleteAddress, // Función para eliminar una dirección
  //   selectAddress, // Función para seleccionar una dirección como la actual para el pedido
  //   setDefaultAddress, // Función para establecer una dirección como predeterminada
  //   isAddressListOpen, // Estado que controla si el historial de direcciones está abierto o cerrado
  //   setIsAddressListOpen, // Setter para el estado de visibilidad del historial
  //   toggleAddressList // Función para alternar la visibilidad del historial
  // } = useAddressManagement(); // Logica de guardado y seleccion de direcciones



  /* =============================================================================
     ESTADOS LOCALES: GESTIÓN DE DIRECCIONES Y MODALES <!> Aca abajo debe aver sluno que no estoy usando por el tema de las direcicones 
     ============================================================================= */


  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [currency, setCurrency] = useState('UYU');

  /* --- Inputs de Formulario --- */
  const [currentAddressInput, setCurrentAddressInput] = useState(''); /* Almacena el texto de la calle y número */
  const [currentAddressLabel, setCurrentAddressLabel] = useState(''); /* Almacena la etiqueta (ej: "Casa", "Trabajo") */

  /* --- Control de Modos de UI --- */
  const [isEditingAddress, setIsEditingAddress] = useState(false);    /* Switch entre modo lectura y modo edición <!> Creo que esto es para el enable de whatspa */
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); /* ID de la dirección en edición (null = nueva) */

  /* --- Control de Modales de Confirmación --- */
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);     /* Visibilidad del modal para vaciar carrito */
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false); /* Visibilidad del modal para borrar dirección */
  const [addressIdToDelete, setAddressIdToDelete] = useState<string | null>(null); /* Referencia temporal del ID a eliminar */

  /* =============================================================================
     EFECTOS DE SINCRONIZACIÓN (OBSERVADORES)
     ============================================================================= */

  // <!> Esto lo voy a usar cuando tenga pedidos sentralizados 
  // /**
  //  * Sincroniza los campos de texto locales con la dirección seleccionada globalmente.
  //  * Se dispara cada vez que el Drawer se abre o cambia la dirección activa.
  //  */
  // useEffect(() => {
  //   /* Solo sincronizamos si el Drawer está abierto y existe una dirección seleccionada */
  //   if (isOpen && selectedAddress) {
  //     setCurrentAddressInput(selectedAddress.addressLine);
  //     setCurrentAddressLabel(selectedAddress.label);
  //   }
  // }, [isOpen, selectedAddress]);


/**
   * Controlador de Confirmación y Despacho de Pedido vía WhatsApp.
   * 
   * Extrae la instantánea (snapshot) del estado actual del carrito, formatea los datos 
   * de entrega, fecha, método de pago y el desglose de productos con la moneda local (UYU).
   * Genera una URL serializada del carrito para permitir la reconstrucción del pedido en la web
   * y abre una nueva pestaña hacia la API de WhatsApp con el mensaje estructurado.
   *
   * @function
   * @throws {Alert} Alerta al usuario si la dirección está vacía o si no hay productos en el pedido.
   * @returns {void}
   */
  const handleConfirmOrder = () => {
    const rawPhone = companyInfo.contact.adminPhone; // Numero de watsap del cliente 
    const cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone; // para corregir el 0 al inicio
    
    const finalPhone = `598${cleanPhone}`; // para agregar el codigo de pais <!> a futuro tiene que ir a configuracion por si el carrito espande a otro pais 

    const now = new Date(); // Fecha actual
    const dateStr = now.toLocaleDateString('es-UY'); // Fecha en formato uruguayo <!> Esto tambien tengo que podes setiar con configuracion jeison la moneda que voy a usar 
    const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }); // Hora actual en formato uruguayo
    const shareUrl = window.location.href; /* El link actual ya tiene el ?cart=... gracias al hook useProducts */
    
    
    // Titulo del mensaje 
    let message = `*NUEVO PEDIDO - ${companyInfo.name.toUpperCase()}*\n\n`;  
    message += `*Fecha:* ${dateStr} - ${timeStr} hs\n`;
    



    // <!> Cuando repare el tema de ubicacion
    // message += `*Entrega:* ${selectedAddress?.addressLine}\n\n`; 
  




  /* --- LÓGICA DE PAGO DINÁMICA --- */
  message += `*Pago:* ${paymentMethod.toUpperCase()} (${currency})\n`;
  
  if (paymentMethod === 'transferencia') {
    message += `*Datos de Transferencia:*\n`;
    message += `- Banco: ${companyInfo.bank.name}\n`;
    message += `- Cuenta: ${companyInfo.bank.accountNumber}\n`;
    message += `- Titular: ${companyInfo.bank.beneficiary}\n`;
    message += `_Adjuntaré comprobante por este medio._\n`;
  } else {
    message += `_Efectivo: Coordinar cambio con el vendedor._\n`;
  }




    // <!> Creo que no va 
    // // Direccion de entrega Opcional 
    // const entrega = selectedAddress?.addressLine 
    // ? selectedAddress.addressLine 
    // : "A coordinar / Retiro en local";
    // message += `*Entrega:* ${entrega}\n\n`;  
    
    message += `*Detalle:*\n`;

    // Linea de articulos 
    pedido.forEach(item => {
      message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${(item.producto.prod_precio * item.cantidad).toLocaleString('es-UY')}\n`;
    });

    message += `\n*TOTAL: $${total.toLocaleString('es-UY')}*\n`;
    message += `__________________________\n\n`;

    message += `*Ver o editar pedido en la web:*\n`;
    message += `${shareUrl}`;

    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank');
  
  
  
  

  };

  return ( // Retorno Componente --------------------------------------------------------------------------------------
    <>
      <div onClick={onClose} className={`fixed inset-0 z-[150] bg-vete-overlay/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />
      
      <aside className={`fixed top-0 right-0 z-[160] flex flex-col h-full w-full max-w-md bg-vete-card-white shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Menu superior de la interface */}
        <DrawerHeader itemCount={itemCount} onClose={onClose} />
        
        {/* Contenido del drawer: lista de productos */}
        <DrawerContent pedido={pedido} />

        

        {/* Footer con el nuevo componente colapsable */}
        <PedidoFooterCollapsible 
          onClearCart={() => setIsClearCartModalOpen(true)} 
        />



      </aside>



  {/* Modal Menu Eliminar Carrito */}
  <ConfirmationModal
    isOpen={isClearCartModalOpen}
    onClose={() => setIsClearCartModalOpen(false)}
    onConfirm={() => { clearPedido(); setIsClearCartModalOpen(false); }}
    title="Vaciar Carrito"
    message="¿Estás seguro de que deseas eliminar todos los productos del carrito?"
    confirmButtonText="Vaciar carrito"
    confirmButtonColor="red"
    icon={<Trash2 size={24} />} 
  />

  {/*!!!! NO borrar!!!!!!!   ->>  para Funcionalidad Cliete Sus direcciones 
  
  <ConfirmationModal 
    isOpen={isDeleteAddressModalOpen} 
    onClose={() => setIsDeleteAddressModalOpen(false)} 
    onConfirm={() => { if (addressIdToDelete) deleteAddress(addressIdToDelete); setIsDeleteAddressModalOpen(false); }} 
    title="Eliminar Dirección" 
    message="¿Deseas eliminar esta dirección?" 
    confirmButtonText="Eliminar" 
    confirmButtonColor="red" 
    icon={<Trash2 size={24} />} 
  /> 
  
  */}

    </>
  );
}; // FIN Componente PedidoDrawer----------------------------------------------------------------------------------------------------------------


