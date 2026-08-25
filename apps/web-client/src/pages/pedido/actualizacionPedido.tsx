  // <!> Esto lo voy a usar cuando tenga pedidos sentralizados 
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

Store();
  

// Es ta pensado para guardar direcciones de clietes 
// Tiene qeu estar ubicado al principio de  PedidoDrawer 
const {  // <!> Esto no lo voy a usar por haora 
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