/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../types/pedido_types';

interface CartItemRowProps {
  item: CartItem;
}

/**
 * Representa una "Línea de Pedido" dentro del Drawer del carrito.
 * Implementa controles de cantidad y visualización de subtotal por producto.
 */
export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { addToCart, removeFromCart } = useCart();

  /* Cálculo del subtotal de esta línea específica */
  const subtotal = item.producto.prod_precio * item.cantidad;

  return (
    <div key className= {`
      /* --- Posición --- */
      flex                         /* Contenedor flexible horizontal */
      items-center                 /* Centrado vertical de elementos */
      gap-4                        /* Espacio entre imagen e información */
      
      /* --- Dimensiones --- */
      w-full                       /* Ocupa todo el ancho del drawer */
      p-3                          /* Padding interno */
      
      /* --- Colores --- */
      bg-white                     /* Fondo blanco para resaltar sobre el gris */
      border                       /* Borde habilitado */
      border-slate-100             /* Color de borde muy suave */
      
      /* --- Estilo --- */
      rounded-2xl                  /* Bordes redondeados modernos */
      shadow-sm                    /* Sombra leve para profundidad */
    `} >
  
     {/* Miniatura del Producto */}
      <div className={`
        /* --- Dimensiones --- */
        w-16                         /* Ancho fijo de 4rem */
        h-16                         /* Altura fija de 4rem */
        flex-shrink-0                /* Evita que la imagen se achique */
        
        /* --- Estilo --- */
        rounded-xl                   /* Bordes redondeados */
        overflow-hidden              /* Corta la imagen al borde */
        bg-slate-50                  /* Fondo de respaldo */
      `}>
        <img 
          src={item.producto.rel_imagen_url[0]?.img_url} 
          alt={item.producto.prod_nombre}
          className="w-full h-full object-cover"
        />
      </div>    
  
    </div>
  );
};





   

      {/* Información del Producto */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */
        flex-1                       /* Ocupa el espacio central sobrante */
        min-w-0                      /* Permite que el texto trunque si es largo */
      `}>
        <h4 className={`
          /* --- Texto --- */
          text-sm                      /* Tamaño de fuente pequeño */
          font-bold                    /* Negrita */
          text-slate-800               /* Color oscuro */
          truncate                     /* Corta con puntos suspensivos si no entra */
        `}`}>
          {item.producto.prod_nombre}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400 font-medium">
            ${item.producto.prod_precio.toLocaleString('es-UY')} c/u
          </span>
        </div>
      </div>

      {/* Controles y Subtotal */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Alineación vertical */
        items-end                    /* Alineado a la derecha */
        gap-2                        /* Espacio entre precio y botones */
      `}`}>
        <span className={`
          /* --- Texto --- */
          text-sm                      /* Tamaño pequeño */
          font-black                   /* Peso máximo */
          text-emerald-900             /* Color verde institucional */
        `}`}>
          ${subtotal.toLocaleString('es-UY')}
        </span>

        <div className={`
          /* --- Posición --- */
          flex                         /* Contenedor de botones */
          items-center                 /* Centrado vertical */
          gap-1                        /* Espacio mínimo entre botones */
          
          /* --- Colores --- */
          bg-slate-50                  /* Fondo gris muy claro */
          
          /* --- Estilo --- */
          rounded-lg                   /* Bordes suavizados */
          border                       /* Borde sutil */
          border-slate-100             /* Color de borde */
        `}`}>
          <button 
            onClick={() => removeFromCart(item.producto.prod_id)}
            className={`
              /* --- Dimensiones --- */
              p-1.5                        /* Espaciado del icono */
              /* --- Colores --- */
              text-slate-400               /* Color gris apagado */
              /* --- Animación --- */
              hover:text-red-500           /* Cambia a rojo al hover */
              transition-colors            /* Suavidad */
            `}
          >
            {item.cantidad === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
          </button>

          <span className="text-xs font-bold text-slate-700 w-5 text-center">
            {item.cantidad}
          </span>

          <button 
            onClick={() => addToCart(item.producto)}
            className={`
              /* --- Dimensiones --- */
              p-1.5                        /* Espaciado */
              /* --- Colores --- */
              text-emerald-600             /* Color verde marca */
              /* --- Animación --- */
              hover:bg-emerald-50          /* Fondo tenue al hover */
              transition-all               /* Suavidad */
            `}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>