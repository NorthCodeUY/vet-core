/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */



// <!> Cosas a arreglar

// 1. La paleta de colores todos los colores tiene que si o si trabajar con la paleta de colores 





import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, MapPin, Send, Package, Trash2, Edit, Plus, ChevronDown } from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context';
import { PedidoItemRow } from './PedidoItemRow';
import { ConfirmationModal } from '../../components/ConfirmationModal';


import { useAddressManagement } from '../../hooks/useAddressManagement'
import type { UserAddress } from '../../hooks/useAddressManagement'

import companyInfo from '../../data/companyInfo.json'; // Datos de la empresa 

/**
 * Interfaz para la dirección de usuario simulada (si aún se usa para pre-cargar inicial).
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
    // <!> Cosas a arreglar
    // 1. El logo no me gusta tendria que ser o un carrrito o uno de esos canastos del super 
    // 2. Que aparesca Veterinaria beltrameli Vamos a ponerlo como una variable a el menu porque hay que emensar a
    // estraer los datos que no vay para ponerlo a varialbe de entorno 
    // 3. me gustaria poner  
    <div className={`
      /* --- Posición --- */
      flex items-center justify-between
      /* --- Dimensiones --- */
      p-4
      /* --- Colores --- */
      bg-vete-dark-green text-vete-card-white
    `}>
      <div className="flex items-center gap-3">
        <ShoppingBag size={24} />
        <h2 className="text-xl font-black italic uppercase tracking-tight">Tu Carrito</h2>
        <span className="bg-vete-primary text-vete-card-white text-[10px] px-2 py-1 rounded-full font-bold">
          {itemCount} ITEMS
        </span>
      </div>
      <button onClick={onClose} className="p-1.5 hover:bg-vete-card-white/10 rounded-full transition-colors">
        <X size={24} />
      </button>
    </div>
  );






































//<!> Falta implementar este metodo Cambiar nobre yo le pondri footerPedidoDrawer 
/**
 * Menu del footer para mostrar el total del pedido y los botones de acción
 * @param param0 
 * @returns 
 */
const CartCheckoutSection = ({ 
  pedido, 
  total, 
  selectedAddress, 
  addressProps, 
  onConfirm, 
  onClear 
}: any) => {
  return (
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Alineación vertical */
      gap-4                        /* Espacio entre elementos */
      mt-4                         /* Margen superior */
    `}>
      






      {/*<!> Gestión de direcciones No Borrar Para sprin Pedido sentralizado */}
      {/* <AddressManager {...addressProps} selectedAddress={selectedAddress} /> */}





      {/* Botonera de Acción */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={onConfirm} 
          // disabled={pedido.length === 0 || !selectedAddress} //<!> Capas que es util si tenemos la ubicacion vemos 
          className={`
            /* --- Posición --- */
            flex items-center justify-center gap-3
            /* --- Dimensiones --- */
            w-full py-3
            /* --- Colores --- */
            bg-vete-dark-green text-white
            /* --- Texto --- */
            font-black uppercase tracking-widest
            /* --- Estilo --- */
            rounded-xl shadow-xl
            /* --- Animación --- */
            disabled:opacity-50 transition-all
          `}
        >
          Confirmar por WhatsApp <Send size={18} />
        </button>

        <button 
          onClick={onClear} 
          disabled={pedido.length === 0} 
          className={`
            /* --- Posición --- */
            flex items-center justify-center gap-2
            /* --- Dimensiones --- */
            w-full py-2
            /* --- Colores --- */
            bg-transparent border-2 border-vete-error text-vete-error
            /* --- Texto --- */
            font-bold uppercase
            /* --- Estilo --- */
            rounded-xl
            /* --- Animación --- */
            disabled:opacity-30 transition-all
          `}
        >
          <Trash2 size={16} /> Vaciar Carrito
        </button>
      </div>
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
 * Componente principal que orquesta el drawer de pedidos, manejando el estado 
 * global del carrito y las direcciones del usuario.
 * @param isOpen Estado que controla si el drawer está abierto o cerrado.
 * @param onClose Función que se ejecuta cuando se intenta cerrar el drawer.
 * @returns 
 */
export const PedidoDrawer = ({ isOpen, onClose }: PedidoDrawerProps) => {
  const { pedido, total, itemCount, clearPedido } = usePedidoStore();
  
  const { 
    addresses, // Array de direcciones guardadas
    selectedAddress, // Dirección seleccionada actual
    addAddress, // Función para agregar una nueva dirección
    updateAddress, // Función para actualizar una dirección existente
    deleteAddress, // Función para eliminar una dirección
    selectAddress, // Función para seleccionar una dirección como la actual para el pedido
    setDefaultAddress, // Función para establecer una dirección como predeterminada
    isAddressListOpen, // Estado que controla si el historial de direcciones está abierto o cerrado
    setIsAddressListOpen, // Setter para el estado de visibilidad del historial
    toggleAddressList // Función para alternar la visibilidad del historial
  } = useAddressManagement(); // Logica de guardado y seleccion de direcciones















 // <!> Version Borrar 

 
  /* Estados locales para edición de dirección */
  // const [
  //   currentAddressInput,
  //   setCurrentAddressInput // 
  //   ] =  useState(''); // 
  
  // const [
  //   currentAddressLabel, 
  //   setCurrentAddressLabel
  //   ] = useState('');

  // const [
  //   isEditingAddress,
  //   setIsEditingAddress
  // ] = useState(false);
  
  // const [
  //   editingAddressId,
  //   setEditingAddressId
  // ] = useState<string | null>(null);
  
  // const [
  //   isClearCartModalOpen,
  //   setIsClearCartModalOpen
  // ] = useState(false);
  
  // const [
  //   isDeleteAddressModalOpen,
  //   setIsDeleteAddressModalOpen
  // ] = useState(false);

  // const [
  //   addressIdToDelete,
  //   setAddressIdToDelete
  // ] = useState<string | null>(null);






  /* =============================================================================
     ESTADOS LOCALES: GESTIÓN DE DIRECCIONES Y MODALES
     ============================================================================= */

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

  /**
   * Sincroniza los campos de texto locales con la dirección seleccionada globalmente.
   * Se dispara cada vez que el Drawer se abre o cambia la dirección activa.
   */
  useEffect(() => {
    /* Solo sincronizamos si el Drawer está abierto y existe una dirección seleccionada */
    if (isOpen && selectedAddress) {
      setCurrentAddressInput(selectedAddress.addressLine);
      setCurrentAddressLabel(selectedAddress.label);
    }
  }, [isOpen, selectedAddress]);























  // /* Sincronización de input con dirección seleccionada */ <!> Eliminar 17 ago 
  // useEffect(() => {
  //   if (isOpen && selectedAddress) {
  //     setCurrentAddressInput(selectedAddress.addressLine);
  //     setCurrentAddressLabel(selectedAddress.label);
  //   }
  // }, [isOpen, selectedAddress]);



























  /**
   * Lógica de WhatsApp con Link al final para previsualización 
   * @param selectedAddress  direccion seleccionada actual
   * @param total total del pedido
   * @param itemCount cantidad de items del pedido
   * @param clearPedido limpiar pedido
   * <!> No  se porque pero me ase raro que esto este aca denro tendria que estar fuera de pedidoDrawer de este metodo y llamarlo pero ta
  */
  const handleConfirmOrder = () => {
    const rawPhone = companyInfo.contact.adminPhone; // Numero de watsap del cliente 
    const cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone; // para corregir el 0 al inicio
    const finalPhone = `598${cleanPhone}`; // para agregar el codigo de pais <!> a futuro tiene que ir a configuracion por si el carrito espande a otro pais 

    const now = new Date(); // Fecha actual
    const dateStr = now.toLocaleDateString('es-UY'); // Fecha en formato uruguayo <!> Esto tambien tengo que podes setiar con configuracion jeison la moneda que voy a usar 
    const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }); // Hora actual en formato uruguayo
    const shareUrl = window.location.href; /* El link actual ya tiene el ?cart=... gracias al hook useProducts */

    let message = `*NUEVO PEDIDO - ${companyInfo.name.toUpperCase()}*\n\n`; //<!> Estoy tiene que el archvio de configuracio 
    message += `*Fecha:* ${dateStr} - ${timeStr} hs\n`;
    
    // message += `*Entrega:* ${selectedAddress?.addressLine}\n\n`; // <!> Esto es opcional
        
    // Direccion de entrega Opcional <!> En la interfase tengo que buscar como achicarlo queda muy grande 
    const entrega = selectedAddress?.addressLine 
    ? selectedAddress.addressLine 
    : "A coordinar / Retiro en local";
    message += `*Entrega:* ${entrega}\n\n`;  
    
    
    
    
    
    message += `*Detalle:*\n`;

    // Linea de articulos 
    pedido.forEach(item => {
      message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${(item.producto.prod_precio * item.cantidad).toLocaleString('es-UY')}\n`;
    });

    message += `\n*TOTAL: $${total.toLocaleString('es-UY')}*\n`;
    message += `__________________________\n\n`;





    // <!> en le falta no se ve como un link a apretar 

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





        {/* Menu inferior  */}
        <CartCheckoutSection 
          pedido={pedido}
          total={total}
          onConfirm={handleConfirmOrder}
          onClear={() => setIsClearCartModalOpen(true)}
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
    /* <!> CORRECCIÓN: Cambiar TrAanitaash2 por Trash2 */
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












































































