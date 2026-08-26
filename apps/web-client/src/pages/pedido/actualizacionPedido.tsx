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
