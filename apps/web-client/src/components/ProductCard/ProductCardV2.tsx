/* --- apps/web-client/src/components/ProductCard/ProductCardV2.tsx --- */

import { ShoppingCart,  X, Plus, Minus } from 'lucide-react';
import { SUBCATEGORY_ICONS } from '../utils/categoryHelpers';

import { usePedidoStore } from '../context/pedido_context';
import type { ApiProduct, ApiImageProducto } from '../types/product_types';
import companyInfo from '../data/companyInfo.json';



interface Props {
  producto: ApiProduct
}

/**
 * Componente de UI para representar una tarjeta de producto en el catálogo.
 * Formateado para máxima legibilidad y soporte de subcategorías.
 */
export function ProductCard({ producto }: Props) {
  /* --- Fachada: Extraemos lo que necesitamos --- */
  const {
    pedido, // 🔍 Esto nos da la lista de productos agregados (array)
    addToPedido, // ➕ Esta función agrega pedidos
    removAllPedido // ➖ Esta función saca pedidos
  } = usePedidoStore();

 /* --- Lógica de Estado Local del Producto --- */
  const lineaActual = pedido.find(item => item.producto.prod_id === producto.prod_id); // Linea actual del producto en el pedido
  const cantidad = lineaActual?.cantidad || 0; // Cantidad actual del producto en el pedido
  const subtotal = producto.prod_precio * cantidad; // Subtotal del producto en el pedido
  const estaSeleccionado = cantidad > 0; // Esta seleccionado el producto

  /* --- Generación de Link de WhatsApp  <!> Los menaje yo lo quiero sentralizado por fuer asi que depues lo saco --- */
  const whatsappLink = `https://wa.me/${companyInfo.contact.adminPhone}?text=${encodeURIComponent(
    `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*`
  )}`;

  // 1. Método separado para manejar la eliminación
  const handleRemoveFromPedido = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que se dispare el click del contenedor padre
    removAllPedido(producto.prod_id);
  };




  return (
    <div 
      /* Al tocar la tarjeta, se agrega una unidad automáticamente */
      onClick={() => addToPedido(producto)}
    
      className={`
        /* --- Posición --- */
        relative                     /* Base para badges absolutos <!> Lo agrege por no se para que */
        flex                         /* Contenedor flexible */
        flex-col                     /* Alineación vertical de elementos */
        gap-2                        /* Espacio entre hijos de 0.5rem */
        
        /* --- Dimensiones --- */
        h-full                       /* Altura total */ 
        min-w-[280px]                /* Ancho mínimo para consistencia */
        p-6                          /* Padding interno de 1.5rem */

        /* --- Colores --- */
        
        ${estaSeleccionado ?  //  Cambio de color si está seleccionado
          'bg-vete-primary/20 border-vete-primary' :  // Si esta seleccionado
          'bg-vete-soft/50 border-transparent'} /* Si no esta seleccionado */
          border-2                     /* Borde para resaltar selección */
        
        /* --- Estilo --- */
        rounded-[2rem]               /* Bordes Figma */
        cursor-pointer               /* Indica que toda la tarjeta es clickeable */
      
        /* --- Animación --- */
        transition-all               /* Suaviza cambios de color y borde */
        duration-300                 /* Velocidad de transición */
        hover:shadow-xl              /* Elevación al pasar el mouse */
      `}>





















      {/* --- BADGE SUPERIOR IZQUIERDO: Subtotal --- */}
      {estaSeleccionado && (
        <div className={`
          /* --- Posición --- */
          absolute                     /* Flota sobre la tarjeta */
          top-4 left-4                 /* Ubicación exacta */
          z-20                         /* Por encima de la imagen */
          
          /* --- Dimensiones --- */
          flex                        /* Alineación icono-texto */
          items-center                /* Centrado verticalmente */
          gap-2                       /* Espaciado interno */
          px-3 py-1.5                 /* Espaciado interno */
          
          /* --- Colores --- */
          bg-vete-primary             /* Color Fondo */
          text-white                   /* Texto blanco */
          
          /* --- Estilo --- */
          rounded-full                 /* Forma de píldora */
          shadow-lg                    /* Sombra de profundidad *               
          text-lg                      /* Texto tamaño pequeño */
          animate-in                   /* Animación de aparición */
          fade-in                    /* Animación de aparición */
          zoom-in                    /* Animación de zoom */
        `}>
          <ShoppingCart size={20} />
          <span>
            Can:{cantidad} / 
            ${subtotal.toLocaleString('es-UY')}
          </span>
        </div>
      )}

      {/* --- BOTÓN CANCELAR (Top Right) --- */}
      {estaSeleccionado && (
        <button
          /*  stopPropagation: Evita que al cancelar se agregue otro producto <!> Sacar a un metodo aparte  */
          onClick={handleRemoveFromPedido}
          className={`
            /* --- Posición --- */
            absolute top-4 right-4 z-20
            /* --- Dimensiones --- */
            p-2
            /* --- Colores --- */
            bg-red-500 text-white
            /* --- Estilo --- */
            rounded-full shadow-md
            /* --- Animación --- */
            hover:bg-red-600 transition-colors
          `}
        >
          <X size={16} />
        </button>
      )}
















      {/* Imagen del producto */}
      <img
        /* 
           Lógica de visualización:
           1. Intenta cargar la URL del backend.
           2. Si es null o undefined, carga la imagen local de "No disponible".
        */
        src={producto.imagen_principal_url?.img_url || '/images/producto_no_disponible.png'}
        // Alt para accesibilidad
        alt={producto.imagen_principal_url ? producto.prod_nombre : "Imagen no encontrada"}
        className={`

          /* --- Dimensiones --- */
          w-full                   /* Ocupa todo el ancho disponible */
          h-48                     /* Altura fija de 12rem */
          
          /* --- Estilo --- */
          object-cover             /* Asegura que la imagen no se deforme */
          rounded-2xl              /* Bordes redondeados para la imagen */
        `}
      />

      {/* Sección de Subcategorías (Iconos de Perro, Gato, etc.) */}
      <div className={`
        /* --- Posición --- */
        flex                       /* Alineación horizontal de iconos */
        gap-2                      /* Espacio entre badges */
        mt-2                       /* Margen superior */
      `}>
        {/* Subcategoria Especies que aparesen en la tarjeta */}
        {producto.subcategoria?.map((sub, idx) => (
          <div key={idx} title={sub.subc_nombre} className={`
            /* --- Posición --- */
            flex items-center justify-center
            /* --- Dimensiones --- */
            p-1.5                      /* Espaciado interno del icono */
            /* --- Colores --- */
            bg-vete-primary/10         /* Fondo verde muy tenue */
            text-vete-primary          /* Color del icono verde marca */
            /* --- Estilo --- */
            rounded-lg                 /* Bordes suavizados */
          `}>
            {/* Renderiza el icono desde el helper según el nombre del backend */}
            {SUBCATEGORY_ICONS[sub.subc_nombre] || null}
          </div>
        ))}
      </div>

      {/* Titulo del producto */}
      <h4 className={`
        /* --- Texto --- */
        text-vete-primary          /* Color verde principal */
        font-bold                  /* Peso de fuente negrita */
        text-lg                    /* Tamaño de fuente grande */
        /* --- Dimensiones --- */
        mt-1                       /* Margen superior mínimo */
      `}>
        {producto.prod_nombre}
      </h4>

      {/* Descripcion del producto */}
      <p className={`
        /* --- Texto --- */
        text-vete-text-light        /* Color oscuro para legibilidad */
        text-sm                    /* Tamaño de fuente pequeño */
        line-clamp-2               /* Corta el texto a 2 líneas máximo */
      `}>
        {producto.prod_descripcion}
      </p>

      {/* Precio y botones de accion */}
      <div className={`
        /* --- Posición --- */
        flex
        justify-between
        items-center
        mt-auto                      /* Empuja este bloque al fondo del contenedor */
        pt-4                         /* Agrega un padding superior para separar del texto */

        /* --- Dimensiones --- */
        w-full                       /* Asegura que ocupe todo el ancho */      

      `}>

        {/* Precio del producto con formato Uruguay */}
        <span className={`
          /* --- Texto --- */
          text-vete-primary          /* Color verde principal */
          font-black                 /* Peso de fuente máximo */
          text-xl                    /* Tamaño de fuente extra grande */
        `}>
          ${producto.prod_precio.toLocaleString('es-UY')}
        </span>

        {/* Botones de accion */}
        <div className="flex gap-2 items-center">
          {/* Boton de whatsapp <!> Aca tengo que agregar algo para que 
          me mande a un mensaje de watsa pero que me genere un link
          para que cea este producot algo como desde el selular del clite
          mande algo como estoy interesado en este producot algo asi al celular
          de la beterinaria que ya tenog en los datos globales */}
          <img
            src="/images/branding/LogoWhtSapp.svg"
            alt="WhatsApp"
            className={`
              /* --- Dimensiones --- */
              w-8 h-8                  /* Tamaño fijo de 2rem */
              /* --- Animación --- */
              hover:scale-110          /* Crece levemente al pasar el mouse */
              transition-transform     /* Transición suave */
              cursor-pointer           /* Cursor de mano */
            `}
          />

          <div
            onClick={() => { addToPedido(producto) }}
            className={`
            /* --- Posición --- */
            p-2                        /* Espaciado interno */
            cursor-pointer             /* Cursor de mano */
            
            /* --- Colores --- */
            bg-vete-primary            /* Fondo verde principal */
            
            /* --- Estilo --- */
            rounded-full               /* Forma circular */
            
            /* --- Animación --- */
            hover:bg-vete-primary/80   /* Oscurece un poco al hover */
            transition-colors          /* Transición de color */
          `}>
            {/* <!> Tengo que ver como hago para que aparezca 
            el numero del producto y poder modificar la cantidad */}
            <ShoppingCart size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
