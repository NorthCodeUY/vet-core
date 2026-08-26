

/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */





import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, MapPin, Send, Package, Trash2, Edit, Plus, ChevronDown, ShoppingCart ,Banknote, Building2, Coins, DollarSign} from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context';
import { PedidoItemRow } from './PedidoItemRow';
import { ConfirmationModal } from '../../components/ConfirmationModal';


import { PedidoFooterCollapsible } from './PedidoFooterCollapsible';


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
 * Propiedades para el sub-componente `DrawerHeader`.
 * 
 * @interface DrawerHeaderProps
 * @property {number} itemCount - Cantidad total consolidada de productos en el pedido para el badge numérico.
 * @property {function(): void} onClose - Callback disparador para alternar el estado y cerrar la vista del drawer.
 */
interface DrawerHeaderProps {
  itemCount: number;
  onClose: () => void;
}


/**
 * 
 * Barra superior de navegación y marca para el Drawer de Pedidos (`DrawerHeader`).
 * 
 * Proporciona el ancla visual del panel lateral. Integra la identidad corporativa
 * de Veterinaria Beltramelli (isotipo y logotipo tipográfico), la textura de fondo
 * con efecto de pasto invertido mediante transformación CSS, un indicador dinámico 
 * de volumen de compra (badge) y el botón accesible de cierre del menú.
 *
 * @component
 * @param {DrawerHeaderProps} props - Propiedades de visualización y control de eventos.
 * @returns {JSX.Element} Encabezado estructurado con fondo decorativo y controles de acción.
 */
const DrawerHeader: React.FC<DrawerHeaderProps> = ({ itemCount, onClose }) => (
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
    </>
  );
}; // FIN Componente PedidoDrawer----------------------------------------------------------------------------------------------------------------