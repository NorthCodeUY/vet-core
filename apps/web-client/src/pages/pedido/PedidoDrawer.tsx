/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */

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
 */
interface PedidoDrawerProps {
  isOpen: boolean;    // Controla la visibilidad del drawer.
  onClose: () => void; // Función para cerrar el drawer.
}








  /* =============================================================================
   SUB-COMPONENTE 1: HEADER DEL CARRITO
   ============================================================================= */
  const DrawerHeader = ({ itemCount, onClose }: { itemCount: number; onClose: () => void }) => (
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


  /* =============================================================================
    SUB-COMPONENTE 2: LISTA DE PRODUCTOS
    ============================================================================= */
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


/* =============================================================================
   SUB-COMPONENTE 3: GESTIÓN DE DIRECCIONES (Lógica Pesada)
   ============================================================================= */
const AddressManager = ({ 
  selectedAddress, isEditingAddress, currentAddressInput, setCurrentAddressInput,
  currentAddressLabel, setCurrentAddressLabel, isAddressListOpen, addresses,
  onSave, onCancel, onStartEdit, onToggleList, onSelect, onDelete, onNew
}: any) => (
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2 text-xs font-bold text-vete-text-muted uppercase ml-1">
      <MapPin size={14} className="text-vete-dark-green" />
      Dirección de Entrega
    </label>
    
    <div className="relative">
      {isEditingAddress || !selectedAddress ? (
        <div className="flex flex-col gap-2">
          <input 
            type="text" placeholder="Ej: Av. Italia 1543"
            className="w-full py-2.5 pl-4 rounded-xl border-2 bg-vete-dark text-vete-text-light border-transparent focus:border-vete-primary outline-none transition-all"
            value={currentAddressInput} onChange={(e) => setCurrentAddressInput(e.target.value)}
          />
          <input 
            type="text" placeholder="Etiqueta (Casa, Trabajo)"
            className="w-full py-2.5 pl-4 rounded-xl border-2 bg-vete-dark text-vete-text-light border-transparent focus:border-vete-primary outline-none transition-all"
            value={currentAddressLabel} onChange={(e) => setCurrentAddressLabel(e.target.value)}
          />
          <div className="flex gap-2 mt-1">
            <button onClick={onSave} className="flex-1 py-2 bg-vete-primary text-white font-bold rounded-lg text-sm">Guardar</button>
            <button onClick={onCancel} className="flex-1 py-2 border border-vete-light-border text-vete-text-muted rounded-lg text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full py-2.5 pl-4 pr-2 bg-vete-dark rounded-xl">
            <p className="text-vete-text-light text-sm font-medium truncate flex-1">
              <span className="font-bold text-vete-primary">{selectedAddress.label}:</span> {selectedAddress.addressLine}
            </p>
            <div className="flex gap-1">
              <button onClick={() => onStartEdit(selectedAddress)} className="p-1.5"><Edit size={16} className="text-vete-primary" /></button>
              <button onClick={onToggleList} className="p-1.5"><ChevronDown size={16} /></button>
            </div>
          </div>
          {isAddressListOpen && (
            <div className="bg-vete-dark mt-2 rounded-xl border border-vete-light-border shadow-md max-h-40 overflow-y-auto z-50">
              {addresses.map((addr: any) => (
                <div key={addr.id} className="flex items-center justify-between p-3 border-b border-vete-light-border last:border-b-0">
                  <button onClick={() => onSelect(addr.id)} className="flex-1 text-left text-vete-text-light text-sm">
                    <span className="font-bold text-vete-primary">{addr.label}:</span> {addr.addressLine}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => onDelete(addr.id)}><Trash2 size={14} className="text-vete-error" /></button>
                  </div>
                </div>
              ))}
              <button onClick={onNew} className="w-full p-3 text-vete-primary font-bold text-sm">+ Nueva dirección</button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);







/* =============================================================================
   COMPONENTE PRINCIPAL: PEDIDO DRAWER (ORQUESTADOR)
   ============================================================================= */
export const PedidoDrawer = ({ isOpen, onClose }: PedidoDrawerProps) => {
  const { pedido, total, itemCount, clearPedido } = usePedidoStore();
  const { addresses, selectedAddress, addAddress, updateAddress, deleteAddress, selectAddress, setDefaultAddress, isAddressListOpen, setIsAddressListOpen, toggleAddressList } = useAddressManagement();

  /* Estados locales para edición de dirección */
  const [currentAddressInput, setCurrentAddressInput] = useState('');
  const [currentAddressLabel, setCurrentAddressLabel] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState<string | null>(null);

  /* Sincronización de input con dirección seleccionada */
  useEffect(() => {
    if (isOpen && selectedAddress) {
      setCurrentAddressInput(selectedAddress.addressLine);
      setCurrentAddressLabel(selectedAddress.label);
    }
  }, [isOpen, selectedAddress]);

  /* Lógica de WhatsApp con Link al final para previsualización */
  const handleConfirmOrder = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-UY');
    const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    const shareUrl = window.location.href;

    let message = `*NUEVO PEDIDO - VETERINARIA BELTRAMELLI*\n\n`;
    message += `*Fecha:* ${dateStr} - ${timeStr} hs\n`;
    message += `*Entrega:* ${selectedAddress?.addressLine}\n\n`;
    message += `*Detalle:*\n`;
    pedido.forEach(item => {
      message += `• ${item.cantidad}x ${item.producto.prod_nombre} — $${(item.producto.prod_precio * item.cantidad).toLocaleString('es-UY')}\n`;
    });
    message += `\n*TOTAL: $${total.toLocaleString('es-UY')}*\n`;
    message += `__________________________\n\n`;
    message += `*Ver/Editar pedido:* ${shareUrl}`;

    window.open(`https://wa.me/${companyInfo.contact.adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-[150] bg-vete-overlay/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />
      
      <aside className={`fixed top-0 right-0 z-[160] flex flex-col h-full w-full max-w-md bg-vete-card-white shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <DrawerHeader itemCount={itemCount} onClose={onClose} />
        
        <DrawerContent pedido={pedido} />

        <div className="sticky bottom-0 flex flex-col gap-4 py-4 px-5 bg-vete-card-white border-t border-vete-light-border">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-vete-text-muted tracking-widest">Resumen</span>
              <span className="text-base font-bold text-vete-text-light">Total del Pedido</span>
            </div>
            <span className="text-xl font-black text-vete-dark-green">${total.toLocaleString('es-UY')}</span>
          </div>

          <AddressManager 
            selectedAddress={selectedAddress} isEditingAddress={isEditingAddress}
            currentAddressInput={currentAddressInput} setCurrentAddressInput={setCurrentAddressInput}
            currentAddressLabel={currentAddressLabel} setCurrentAddressLabel={setCurrentAddressLabel}
            isAddressListOpen={isAddressListOpen} addresses={addresses}
            onSave={() => {
              if (editingAddressId) updateAddress(editingAddressId, { addressLine: currentAddressInput, label: currentAddressLabel });
              else setDefaultAddress(addAddress(currentAddressInput, currentAddressLabel));
              setIsEditingAddress(false);
            }}
            onCancel={() => setIsEditingAddress(false)}
            onStartEdit={(addr: any) => { setIsEditingAddress(true); setEditingAddressId(addr.id); setIsAddressListOpen(false); }}
            onToggleList={toggleAddressList} onSelect={selectAddress}
            onDelete={(id: string) => { setAddressIdToDelete(id); setIsDeleteAddressModalOpen(true); }}
            onNew={() => { setIsEditingAddress(true); setEditingAddressId(null); setCurrentAddressInput(''); setCurrentAddressLabel(''); setIsAddressListOpen(false); }}
          />

          <div className="flex flex-col gap-3">
            <button onClick={handleConfirmOrder} disabled={pedido.length === 0 || !selectedAddress} className="flex items-center justify-center gap-3 w-full py-3 bg-vete-dark-green text-white font-black uppercase rounded-xl disabled:opacity-50">
              Confirmar por WhatsApp <Send size={18} />
            </button>
            <button onClick={() => setIsClearCartModalOpen(true)} disabled={pedido.length === 0} className="flex items-center justify-center gap-2 w-full py-2 border-2 border-vete-error text-vete-error font-bold uppercase rounded-xl disabled:opacity-30">
              <Trash2 size={16} /> Vaciar Carrito
            </button>
          </div>
        </div>
      </aside>

    
    
    
    
    
    
      {/* <ConfirmationModal isOpen={isClearCartModalOpen} onClose={() => setIsClearCartModalOpen(false)} onConfirm={() => { clearPedido(); setIsClearCartModalOpen(false); }} title="Vaciar Carrito" message="¿Estás seguro de eliminar todo?" confirmButtonColor="red" icon={<Trash2 size={24} />} />
      <ConfirmationModal isOpen={isDeleteAddressModalOpen} onClose={() => setIsDeleteAddressModalOpen(false)} onConfirm={() => { if (addressIdToDelete) deleteAddress(addressIdToDelete); setIsDeleteAddressModalOpen(false); }} title="Eliminar Dirección" message="¿Deseas eliminar esta dirección?" confirmButtonColor="red" icon={<Trash2 size={24} />} />
     */}
    
    
    
    /* --- Corrección en los Modales al final de PedidoDrawer --- */
    
    
    
    /* --- Corrección en los Modales al final de PedidoDrawer --- */

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

  <ConfirmationModal 
    isOpen={isDeleteAddressModalOpen} 
    onClose={() => setIsDeleteAddressModalOpen(false)} 
    onConfirm={() => { if (addressIdToDelete) deleteAddress(addressIdToDelete); setIsDeleteAddressModalOpen(false); }} 
    title="Eliminar Dirección" 
    message="¿Deseas eliminar esta dirección?" 
    confirmButtonText="Eliminar" /* <!> AGREGAR ESTA LÍNEA */
    confirmButtonColor="red" 
    icon={<Trash2 size={24} />} 
  />


    
    </>
  );
};












































































