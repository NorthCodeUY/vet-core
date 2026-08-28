/* --- apps/web-client/src/components/ProductCard/ProductCardV1.tsx --- */

import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { SUBCATEGORY_ICONS } from '../../utils/categoryHelpers';

import { usePedidoStore } from '../../context/pedido_context';
import type { ApiProduct, ApiImageProducto } from '../../types/product_types';
import companyInfo from '../../data/companyInfo.json';

interface Props {
  producto: ApiProduct
}

/**
 * Componente de UI para representar una tarjeta de producto en el catálogo.
 * Formateado para máxima legibilidad y soporte de subcategorías.
 */
export function ProductCardV1({ producto }: Props) {
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

  // Creamos el link del producto: .origin guarda el link de la pagina, .pathname guarda el subdominio, # el id del producto
  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#prod-${producto.prod_id}`
    : '';

  // Limpieza de número de teléfono para evitar errores de WhatsApp
  const cleanPhone = companyInfo.contact.adminPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `598${cleanPhone.slice(1)}` : cleanPhone;

  /* --- Generación de Link de WhatsApp --- */
  const whatsappLink = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(
    `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*, *$${producto.prod_precio}*\n\n Ver Producto: \n\n${productUrl}`
  )}`;

  // 1. Método separado para manejar la eliminación
  const handleRemoveFromPedido = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que se dispare el click del contenedor padre
    removAllPedido(producto.prod_id);
  };

  return (
    <div 
      /* Al tocar la tarjeta, se agrega una unidad automáticamente */
      id={`prod-${producto.prod_id}`}  /* identificador de cada producto */
      onClick={() => addToPedido(producto)}
    
      className={`
        /* --- Posición --- */
        relative                     /* Base para badges absolutos */
        flex                         /* Contenedor flexible */
        flex-col                     /* Alineación vertical de elementos */
        gap-2                        /* Espacio entre hijos de 0.5rem */
        
        /* --- Dimensiones --- */
        h-full                       /* Altura total */ 
        w-full                       /* Toma el ancho de la celda */
        min-w-0                      /* Evita desbordamiento en grillas */
        p-4 sm:p-6                   /* Padding adaptativo */

        /* --- Colores --- */
        ${estaSeleccionado ? 
          'bg-vete-primary/20 border-vete-primary' : 
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
          top-3 left-3 sm:top-4 sm:left-4 /* Ubicación exacta */
          z-20                         /* Por encima de la imagen */
          
          /* --- Dimensiones --- */
          flex                        /* Alineación icono-texto */
          items-center                /* Centrado verticalmente */
          gap-2                       /* Espaciado interno */
          px-3 py-1.5                 /* Espaciado interno */
          
          /* --- Colores --- */
          bg-vete-primary             /* Color Fondo */
          text-white                  /* Texto blanco */
          
          /* --- Estilo --- */
          rounded-full                 /* Forma de píldora */
          shadow-lg                    /* Sombra de profundidad */ 
          text-xs sm:text-lg           /* Texto responsivo */
          animate-in                   /* Animación de aparición */
          fade-in                    /* Animación de aparición */
          zoom-in                    /* Animación de zoom */
        `}>
          <ShoppingCart size={18} />
          <span>
            Can:{cantidad} / 
            ${subtotal.toLocaleString('es-UY')}
          </span>
        </div>
      )}

      {/* --- BOTÓN CANCELAR (Top Right) --- */}
      {estaSeleccionado && (
        <button
          onClick={handleRemoveFromPedido}
          className={`
            /* --- Posición --- */
            absolute top-3 right-3 sm:top-4 sm:right-4 z-20
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
        src={producto.imagen_principal_url?.img_url || '/images/producto_no_disponible.png'}
        alt={producto.imagen_principal_url ? producto.prod_nombre : "Imagen no encontrada"}
        className={`
          /* --- Dimensiones --- */
          w-full                   /* Ocupa todo el ancho disponible */
          h-40 sm:h-48              /* Altura adaptable para mobile/desktop */
          
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
            {SUBCATEGORY_ICONS[sub.subc_nombre] || null}
          </div>
        ))}
      </div>

      {/* Titulo del producto */}
      <h4 className={`
        /* --- Texto --- */
        text-vete-primary          /* Color verde principal */
        font-bold                  /* Peso de fuente negrita */
        text-base sm:text-lg       /* Tamaño de fuente */
        /* --- Dimensiones --- */
        mt-1                       /* Margen superior mínimo */
      `}>
        {producto.prod_nombre}
      </h4>

      {/* Descripcion del producto (Con Scroll Interno sin desaparecer) */}
      <p className={`
        /* --- Texto --- */
        text-vete-text-light        /* Color oscuro para legibilidad */
        text-xs sm:text-sm          /* Tamaño de fuente pequeño */
        
        /* --- Scroll Interno --- */
        max-h-12                    /* Limita la altura para no desplazar botones */
        overflow-y-auto             /* Activa scroll si la descripción es muy larga */
        pr-1                        /* Padding derecho para la barra de scroll */
      `}>
        {producto.prod_descripcion}
      </p>

      {/* Precio y botones de accion */}
      <div className={`
        /* --- Posición --- */
        flex
        justify-between
        items-center
        mt-auto                    /* Empuja este bloque al fondo del contenedor */
        pt-3                       /* Agrega un padding superior para separar del texto */

        /* --- Dimensiones --- */
        w-full                     /* Asegura que ocupe todo el ancho */ 
        shrink-0                   /* Impide que este contenedor se comprima o desaparezca */
      `}>

        {/* Precio del producto con formato Uruguay */}
        <span className={`
          /* --- Texto --- */
          text-vete-primary          /* Color verde principal */
          font-black                 /* Peso de fuente máximo */
          text-lg sm:text-xl         /* Tamaño de fuente grande */
        `}>
          ${producto.prod_precio.toLocaleString('es-UY')}
        </span>

        {/* Botones de accion */}
        <div className="flex gap-2 items-center shrink-0">
          {/* Boton de whatsapp */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()} 
          >
            <img
              src="/images/branding/LogoWhtSapp.svg"
              alt="WhatsApp"
              className={`
                /* --- Dimensiones --- */
                w-7 h-7 sm:w-8 sm:h-8      /* Tamaños ajustados */
                /* --- Animación --- */
                hover:scale-110          /* Crece levemente al pasar el mouse */
                transition-transform     /* Transición suave */
                cursor-pointer           /* Cursor de mano */
              `}
            />
          </a>

          <div
            onClick={(e) => {
              e.stopPropagation();
              addToPedido(producto);
            }}
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
              shrink-0                   /* Previene compresión */
            `}>
            <ShoppingCart size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}