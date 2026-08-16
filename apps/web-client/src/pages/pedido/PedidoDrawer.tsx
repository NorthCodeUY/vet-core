/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */

import { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, MapPin, Send, Package, Trash2, Edit, Plus, ChevronDown } from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context';
import { PedidoItemRow } from './PedidoItemRow';
import { ConfirmationModal } from '../../components/ConfirmationModal';

import { useAddressManagement } from '../../hooks/useAddressManagement'
import type { UserAddress } from '../../hooks/useAddressManagement'

import companyInfo from '../../data/companyInfo.json';

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
 */
interface PedidoDrawerProps {
  isOpen: boolean;    // Controla la visibilidad del drawer.
  onClose: () => void; // Función para cerrar el drawer.
}

/**
 * Drawer que muestra el carrito de compras y permite confirmar el pedido.
 * Incorpora un sistema de gestión de direcciones, un modal de confirmación,
 * y optimizaciones de UI/UX para una experiencia "Premium".
 *
 * @param {PedidoDrawerProps} props - Propiedades para el drawer.
 * @returns {React.FC} Un componente de drawer para el pedido.
 */
export const PedidoDrawer = ({ isOpen, onClose }: PedidoDrawerProps) => {
  const {
    pedido,
    total,
    itemCount,
    getWhatsAppUrl,
    clearPedido
  } = usePedidoStore();

  const {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
    isAddressListOpen,
    setIsAddressListOpen,
    toggleAddressList
  } = useAddressManagement();

  const { defaultAddress: initialUserAddress, loadingUserAddress } = useUserInitialAddress();

  /* Estado local para la dirección del input que se está editando o agregando. */
  const [currentAddressInput, setCurrentAddressInput] = useState<string>('');
  /* Estado para controlar si el usuario está editando una dirección existente o agregando una nueva. */
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  /* Estado para la etiqueta de la dirección que se está agregando/editando. */
  const [currentAddressLabel, setCurrentAddressLabel] = useState<string>('');
  /* Estado para el ID de la dirección que se está editando (null si es nueva). */
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  /* Estado para controlar la visibilidad del modal de confirmación de vaciado. */
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  /* Estado para controlar la visibilidad del modal de confirmación de eliminación de dirección. */
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  /* Estado para almacenar el ID de la dirección a eliminar. */
  const [addressIdToDelete, setAddressIdToDelete] = useState<string | null>(null);


  /* Referencia para el elemento scrollable para asegurar que el footer permanezca visible. */
  const scrollableRef = useRef<HTMLDivElement>(null);

  /**
   * Efecto para inicializar el 'currentAddressInput' y 'currentAddressLabel'
   * cuando el drawer se abre o la dirección seleccionada cambia.
   */
  useEffect(() => {
    if (isOpen) {
      if (selectedAddress) {
        setCurrentAddressInput(selectedAddress.addressLine);
        setCurrentAddressLabel(selectedAddress.label);
      } else {
        setCurrentAddressInput('');
        setCurrentAddressLabel('');
      }
      setIsEditingAddress(false); // Por defecto, no estamos editando al abrir
      setEditingAddressId(null);
    }
  }, [isOpen, selectedAddress]);

  /**
   * Efecto para pre-cargar la dirección inicial del usuario si no hay direcciones guardadas
   * y se ha cargado la dirección inicial.
   */
  useEffect(() => {
    // Solo agregar la dirección inicial si NO hay direcciones guardadas y se ha cargado una dirección inicial.
    // Además, solo hacerlo UNA VEZ (por ejemplo, cuando el componente se monta por primera vez o el drawer se abre sin direcciones).
    if (isOpen && !loadingUserAddress && initialUserAddress && addresses.length === 0) {
      // Se utiliza un pequeño retraso para asegurar que la primera dirección
      // se agregue y establezca como predeterminada correctamente, evitando conflictos
      // si setSelectedAddress o setDefaultAddress ya están en cola.
      setTimeout(() => {
        const newId = addAddress(initialUserAddress, "Principal");
        setDefaultAddress(newId);
      }, 0);
    }
  }, [isOpen, loadingUserAddress, initialUserAddress, addresses.length, addAddress, setDefaultAddress]);

  /**
   * Efecto para cerrar el drawer automáticamente si el carrito se vacía.
   */
  useEffect(() => {
    if (isOpen && pedido.length === 0) {
      // Pequeño retraso para permitir que la animación de vaciado se muestre (si la hubiera)
      const timer = setTimeout(() => onClose(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pedido.length, onClose]);














/* --- Dentro de PedidoDrawer.tsx --- */

const handleConfirmOrder = () => {
  /* 1. Validaciones de seguridad */
  if (!selectedAddress || !selectedAddress.addressLine.trim()) {
    alert("Por favor, selecciona o ingresa una dirección de entrega válida.");
    return;
  }
  if (pedido.length === 0) {
    alert("El pedido está vacío.");
    return;
  }





  // <!> Mensaje feo ----------------------------------------->


  // /* 2. Captura de tiempo actual */
  // const now = new Date();
  // const dateStr = now.toLocaleDateString('es-UY');
  // const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
  
  // /* 3. El link actual ya contiene el ?cart=... gracias al useEffect de useProducts */
  // const shareUrl = window.location.href;

  // /* 4. Construcción del mensaje profesional */
  // let message = `🐾 *NUEVO PEDIDO - VETERINARIA BELTRAMELLI* 🐾\n`;
  // message += `📅 *Fecha:* ${dateStr} - ${timeStr} hs\n`;
  // message += `📍 *Entrega:* ${selectedAddress.addressLine}\n\n`;
  // message += `🛒 *Detalle de la compra:*\n`;
  
  // pedido.forEach(item => {
  //   const subtotal = item.precio_unitario_capturado * item.cantidad;
  //   message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${subtotal.toLocaleString('es-UY')}\n`;
  // });
  // message += `\n💰 *TOTAL ESTIMADO: $${total.toLocaleString('es-UY')}*\n`;
  // message += `----------------------------------\n\n`; // Doble salto de línea
  // message += `🔗 *Ver o Modificar este carrito en la web:*\n`;
  // message += `${shareUrl}\n\n`; // El link ahora queda aislado
  // message += `_Mensaje generado automáticamente._`;





  // /* 5. Apertura de WhatsApp */
  // window.open(`https://wa.me/59892444510?text=${encodeURIComponent(message)}`, '_blank');





  // Mensaje a mandar a whatsapp v2  <!> Esto deveria estar en un metodo aparte esta todo muy junto ----------------------------------------->
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-UY');
  const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
  
  /* 
     IMPORTANTE: El link debe ser absoluto. 
     En producción usará veterinaria-beltramelli.com 
  */
  const shareUrl = window.location.href;

  /* --- Construcción del Mensaje (Sin emojis problemáticos) --- */
  let message = `*NUEVO PEDIDO - VETERINARIA BELTRAMELLI*\n\n`;
  message += `*Fecha:* ${dateStr} - ${timeStr} hs\n`;
  message += `*Entrega:* ${selectedAddress.addressLine}\n\n`;
  
  message += `*Detalle de la compra:*\n`;
  
  pedido.forEach(item => {
    const subtotal = item.precio_unitario_capturado * item.cantidad;
    message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${subtotal.toLocaleString('es-UY')}\n`;
  });

  message += `\n*TOTAL ESTIMADO: $${total.toLocaleString('es-UY')}*\n`;
  message += `__________________________\n\n`;
  
  /* 
     <!> TRUCO PARA LA VISTA PREVIA:
     El link debe ir al final para que WhatsApp genere la tarjeta con el logo.
  */
  message += `*Ver o editar pedido en la web:*\n`;
  message += `${shareUrl}`;

  /* Usamos encodeURIComponent para que los espacios y saltos de línea no se rompan */
  const numero_mandarmensaje = companyInfo.contact.adminPhone;
  const whatsappUrl = `https://wa.me/${numero_mandarmensaje}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');









}; // Fin handleConfirmOrder





































  /**
   * Abre el modal de confirmación para vaciar el carrito.
   */
  const handleOpenClearCartModal = () => {
    if (pedido.length > 0) {
      setIsClearCartModalOpen(true);
    }
  };

  /**
   * Cierra el modal de confirmación para vaciar el carrito.
   */
  const handleCloseClearCartModal = () => {
    setIsClearCartModalOpen(false);
  };

  /**
   * Confirma y ejecuta la acción de vaciar el carrito.
   */
  const handleConfirmClearCart = () => {
    clearPedido();
    handleCloseClearCartModal();
  };

  /**
   * Inicia el modo de edición para una dirección, precargando sus datos en el input.
   *
   * @param {UserAddress} addressToEdit - La dirección a editar.
   */
  const startEditAddress = (addressToEdit: UserAddress) => {
    setCurrentAddressInput(addressToEdit.addressLine);
    setCurrentAddressLabel(addressToEdit.label);
    setIsEditingAddress(true);
    setEditingAddressId(addressToEdit.id);
    setIsAddressListOpen(false); // Cierra la lista al editar
  };

  /**
   * Guarda la dirección actual (ya sea nueva o editada).
   * Realiza validación básica.
   */
  const handleSaveAddress = () => {
    if (!currentAddressInput.trim()) {
      alert('La dirección no puede estar vacía.');
      return;
    }

    if (editingAddressId) {
      // Actualizar dirección existente
      updateAddress(editingAddressId, { addressLine: currentAddressInput, label: currentAddressLabel || currentAddressInput });
      setDefaultAddress(editingAddressId); // Selecciona la editada como default
    } else {
      // Agregar nueva dirección
      const newId = addAddress(currentAddressInput, currentAddressLabel || currentAddressInput);
      setDefaultAddress(newId); // Selecciona la nueva como default
    }

    // Resetear el estado de edición
    setIsEditingAddress(false);
    setEditingAddressId(null);
    setCurrentAddressLabel('');
    // El currentAddressInput se reseteará automáticamente via useEffect que observa selectedAddress
  };

  /**
   * Cancela la edición o adición de una dirección.
   * Vuelve a mostrar la dirección seleccionada (o vacía si no hay ninguna).
   */
  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    setEditingAddressId(null);
    if (selectedAddress) {
      setCurrentAddressInput(selectedAddress.addressLine);
      setCurrentAddressLabel(selectedAddress.label);
    } else {
      setCurrentAddressInput('');
      setCurrentAddressLabel('');
    }
  };

  /**
   * Abre el modal de confirmación para eliminar una dirección.
   * @param {string} id - ID de la dirección a eliminar.
   */
  const handleOpenDeleteAddressModal = (id: string) => {
    setAddressIdToDelete(id);
    setIsDeleteAddressModalOpen(true);
  };

  /**
   * Cierra el modal de confirmación para eliminar una dirección.
   */
  const handleCloseDeleteAddressModal = () => {
    setIsDeleteAddressModalOpen(false);
    setAddressIdToDelete(null);
  };

  /**
   * Confirma y ejecuta la acción de eliminar una dirección.
   */
  const handleConfirmDeleteAddress = () => {
    if (addressIdToDelete) {
      deleteAddress(addressIdToDelete);
      handleCloseDeleteAddressModal();
    }
  };





  

  // Determinar si los botones de acción deben estar deshabilitados
  const isOrderButtonDisabled = pedido.length === 0 || !selectedAddress?.addressLine.trim();

  return (
    <>
      {/* Overlay: Fondo oscuro traslúcido */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[150] bg-vete-overlay/60 backdrop-blur-sm
          transition-opacity duration-500
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      {/* Drawer: Menú Lateral */}
      <aside className={`
        fixed top-0 right-0 z-[160] flex flex-col
        h-full w-full max-w-md
        bg-vete-card-white shadow-[-10px_0_50px_rgba(0,0,0,0.2)]
        transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >

        {/* Header del Carrito */}
        <div className={`
          flex items-center justify-between p-4
          bg-vete-dark-green text-vete-card-white
        `}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} aria-hidden="true" />
            <h2 id="cart-title" className="text-xl font-black italic uppercase tracking-tight">Tu Carrito</h2>
            <span className="bg-vete-primary text-vete-card-white text-[10px] px-2 py-1 rounded-full font-bold">
              {itemCount} ITEMS
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-vete-card-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-vete-primary" aria-label="Cerrar carrito">
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo: Lista de Items (Scrollable) */}
        <div ref={scrollableRef} className={`
          flex-1 overflow-y-auto p-4
          bg-vete-dark
        `}>
          {pedido.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-vete-text-muted gap-4">
              <Package size={64} className="opacity-20" aria-hidden="true" />
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

        {/* Footer: Resumen y Confirmación */}
        <div className={`
          sticky bottom-0
          flex flex-col gap-4                           /* Espacio reducido de gap-5 a gap-4 */
          py-4 px-5                                     /* Padding reducido de p-5 a py-4 px-5 */
          bg-vete-card-white border-t border-vete-light-border
        `}>

          {/* Resumen de Totales */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-vete-text-muted tracking-widest">Resumen</span>
              <span className="text-base font-bold text-vete-text-light">Total del Pedido</span> {/* Fuente reducida de text-lg a text-base */}
            </div>
            <span className="text-xl font-black text-vete-dark-green"> {/* Fuente reducida de text-2xl a text-xl */}
              ${total.toLocaleString('es-UY')}
            </span>
          </div>

          {/* Sección de Dirección de Entrega Inteligente */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-vete-text-muted uppercase ml-1" htmlFor="delivery-address-input">
              <MapPin size={14} className="text-vete-dark-green" aria-hidden="true" />
              Dirección de Entrega
            </label>
            <div className="relative">
              {loadingUserAddress && addresses.length === 0 ? (
                 <div className="w-full py-3 pl-4 bg-vete-dark rounded-xl animate-pulse h-10"></div> /* Altura reducida de h-12 a h-10 */
              ) : isEditingAddress || !selectedAddress ? (
                // Input para nueva dirección o edición
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    id="delivery-address-input"
                    placeholder="Ej: Av. Italia 1543, Montevideo"
                    className={`
                      w-full py-2.5 pl-4 rounded-xl border-2 /* Altura reducida de py-3 a py-2.5 */
                      bg-vete-dark text-vete-text-light placeholder-vete-text-muted
                      border-transparent outline-none
                      focus:border-vete-primary transition-all
                    `}
                    value={currentAddressInput}
                    onChange={(e) => setCurrentAddressInput(e.target.value)}
                    aria-label="Ingresa o edita la dirección de entrega"
                  />
                  { (isEditingAddress || !selectedAddress) &&
                    <input
                      type="text"
                      placeholder="Etiqueta (Ej: Casa, Trabajo)"
                      className={`
                        w-full py-2.5 pl-4 rounded-xl border-2 /* Altura reducida de py-3 a py-2.5 */
                        bg-vete-dark text-vete-text-light placeholder-vete-text-muted
                        border-transparent outline-none
                        focus:border-vete-primary transition-all
                      `}
                      value={currentAddressLabel}
                      onChange={(e) => setCurrentAddressLabel(e.target.value)}
                      aria-label="Etiqueta para la dirección"
                    />
                  }
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 py-2 px-3 bg-vete-primary text-vete-card-white font-bold rounded-lg hover:bg-vete-primary/90 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-vete-primary"
                      aria-label={editingAddressId ? "Guardar cambios en dirección" : "Agregar dirección"}
                    >
                      {editingAddressId ? 'Guardar' : 'Agregar'}
                    </button>
                    <button
                      onClick={handleCancelAddressEdit}
                      className="flex-1 py-2 px-3 border border-vete-light-border text-vete-text-muted font-semibold rounded-lg hover:bg-vete-light-border transition-all text-sm focus:outline-none focus:ring-2 focus:ring-vete-primary"
                      aria-label="Cancelar edición de dirección"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Mostrar dirección seleccionada y opciones
                <div className="flex flex-col">
                  <div className={`
                    flex items-center justify-between
                    w-full py-2.5 pl-4 pr-2 /* Altura reducida de py-3 a py-2.5 */
                    bg-vete-dark rounded-xl border-2 border-transparent
                  `}>
                    <p className="text-vete-text-light text-sm font-medium mr-2 flex-1" id="delivery-address-input-display">
                      <span className="font-bold text-vete-primary mr-1">{selectedAddress.label}:</span> {selectedAddress.addressLine}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditAddress(selectedAddress)}
                        className="p-1.5 rounded-lg hover:bg-vete-light-border transition-colors focus:outline-none focus:ring-2 focus:ring-vete-primary"
                        aria-label="Editar dirección actual"
                      >
                        <Edit size={16} className="text-vete-primary" />
                      </button>
                      <button
                        onClick={toggleAddressList}
                        className={`
                          p-1.5 rounded-lg hover:bg-vete-light-border transition-colors
                          focus:outline-none focus:ring-2 focus:ring-vete-primary
                          ${isAddressListOpen ? 'bg-vete-light-border' : ''}
                        `}
                        aria-expanded={isAddressListOpen}
                        aria-controls="address-history-list"
                        aria-label="Ver historial de direcciones"
                      >
                        <ChevronDown size={16} className="text-vete-text-muted" />
                      </button>
                    </div>
                  </div>

                  {/* Historial de Direcciones */}
                  {isAddressListOpen && (
                    <div id="address-history-list" className="bg-vete-dark mt-2 rounded-xl border border-vete-light-border shadow-md max-h-40 overflow-y-auto">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={`
                          flex items-center justify-between p-3 border-b border-vete-light-border last:border-b-0
                          hover:bg-vete-light-border transition-colors
                          ${selectedAddress.id === addr.id ? 'bg-vete-light-border' : ''}
                        `}>
                          <button
                            onClick={() => selectAddress(addr.id)}
                            className="flex-1 text-left text-vete-text-light text-sm focus:outline-none focus:ring-2 focus:ring-vete-primary rounded-md p-1 -m-1"
                            aria-label={`Seleccionar dirección ${addr.label}: ${addr.addressLine}`}
                          >
                            <span className="font-bold text-vete-primary mr-1">{addr.label}{addr.isDefault && <span className="ml-1 text-xs text-vete-text-muted">(Principal)</span>}:</span> {addr.addressLine}
                          </button>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditAddress(addr)}
                              className="p-1.5 rounded-lg hover:bg-vete-light-border transition-colors focus:outline-none focus:ring-2 focus:ring-vete-primary"
                              aria-label={`Editar ${addr.label}`}
                            >
                              <Edit size={14} className="text-vete-primary" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteAddressModal(addr.id)} /* Usa el nuevo modal */
                              className="p-1.5 rounded-lg hover:bg-vete-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-vete-primary"
                              aria-label={`Eliminar ${addr.label}`}
                            >
                              <Trash2 size={14} className="text-vete-error" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => { setIsEditingAddress(true); setEditingAddressId(null); setCurrentAddressInput(''); setCurrentAddressLabel(''); setIsAddressListOpen(false); }}
                        className="flex items-center justify-center gap-2 w-full p-3 text-vete-primary font-bold hover:bg-vete-light-border transition-colors rounded-b-xl focus:outline-none focus:ring-2 focus:ring-vete-primary"
                        aria-label="Agregar nueva dirección"
                      >
                        <Plus size={16} aria-hidden="true" /> Nueva dirección
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contenedor de Botones (WhatsApp y Vaciar Carrito) */}
          <div className="flex flex-col gap-3">
            {/* Botón WhatsApp */}
            <button
              onClick={handleConfirmOrder}
              disabled={isOrderButtonDisabled}
              className={`
                
                flex items-center justify-center gap-3
                w-full py-3                                     /* Altura reducida de py-3.5 a py-3 */
                bg-vete-dark-green text-vete-card-white
                font-black uppercase tracking-widest
                rounded-xl shadow-xl shadow-vete-dark-green/20
                hover:bg-vete-dark-green-hover active:scale-98
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:shadow-none disabled:active:scale-100
                focus:outline-none focus:ring-2 focus:ring-vete-primary
              `}
              aria-label="Confirmar pedido por WhatsApp"
            >
              Confirmar por WhatsApp
              <Send size={18} aria-hidden="true" />
            </button>

            {/* Botón "Vaciar Carrito" */}
            <button
              onClick={handleOpenClearCartModal}
              disabled={pedido.length === 0}
              className={`
                flex items-center justify-center gap-2
                w-full py-2                                     /* Altura reducida de py-2.5 a py-2 */
                bg-transparent border-2 border-vete-error
                text-vete-error font-bold uppercase tracking-wide
                rounded-xl
                transition-all duration-200
                hover:bg-vete-error/10 active:scale-98
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:border-vete-text-muted/50 disabled:text-vete-text-muted/50
                disabled:hover:bg-transparent disabled:active:scale-100
                focus:outline-none focus:ring-2 focus:ring-vete-primary
              `}
              aria-label="Vaciar carrito"
            >
              <Trash2 size={16} aria-hidden="true" />
              Vaciar Carrito
            </button>
          </div>
        </div>
      </aside>

      {/* Modal de Confirmación para Vaciar Carrito */}
      <ConfirmationModal
        isOpen={isClearCartModalOpen}
        onClose={handleCloseClearCartModal}
        onConfirm={handleConfirmClearCart}
        title="Vaciar Carrito"
        message={
          <>
            ¿Estás seguro de que deseas eliminar todos los productos del carrito?
            <p className="text-vete-text-muted text-sm mt-2">Esta acción no puede deshacerse.</p>
          </>
        }
        confirmButtonText="Vaciar carrito"
        confirmButtonColor="red"
        icon={<Trash2 size={24} />}
      />

      {/* Nuevo Modal de Confirmación para Eliminar Dirección */}
      <ConfirmationModal
        isOpen={isDeleteAddressModalOpen}
        onClose={handleCloseDeleteAddressModal}
        onConfirm={handleConfirmDeleteAddress}
        title="Eliminar Dirección"
        message={
          <>
            ¿Estás seguro de que deseas eliminar la dirección
            <span className="font-bold ml-1">
              "{addresses.find(addr => addr.id === addressIdToDelete)?.label || 'seleccionada'}"
            </span>
            ?
            <p className="text-vete-text-muted text-sm mt-2">Esta acción no puede deshacerse.</p>
          </>
        }
        confirmButtonText="Eliminar"
        confirmButtonColor="red"
        icon={<Trash2 size={24} />}
      />
    </>
  );
};