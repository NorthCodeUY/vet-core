/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { usePedidoStore } from '../../context/pedido_context';
import type { PedidoItem } from '../../types/pedido_types';

/**
 * Interfaz que define las props del componente PedidoItemRow
 * @param item - Objeto de tipo PedidoItem que representa un producto en el carrito
 */
interface PedidoItemRowProps {
  item: PedidoItem;
}

/**
 * Representa una "Línea de Pedido" dentro del Drawer del carrito.
 * Implementa controles de cantidad y visualización de subtotal por producto.
 */
export const PedidoItemRow = ({ item }: PedidoItemRowProps) => {


  const {
    addToPedido, // <!> Esto me parece totalmente al reves si esto es para agregar items al pedido 
    removeFromPedido // Accion para remover productos del pedido 
  } = usePedidoStore();


  /* Cálculo del subtotal de esta línea específica */
  const subtotal = item.producto.prod_precio * item.cantidad;

  return (
    <div className={`
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

          /* 
             Lógica de visualización:
             1. Intenta cargar la URL del backend.
             2. Si es null o undefined, carga la imagen local de "No disponible".
          */
          src={item.producto.imagen_principal_url?.img_url || '/images/producto_no_disponible.png'}
          // Alt para accesibilidad
          alt={item.producto.imagen_principal_url ? item.producto.prod_nombre : "Imagen no encontrada"}
          className={`
            /* --- Dimensiones --- */
            w-full                       /* Ocupa todo el ancho disponible */
            h-full                       /* Ocupa toda la altura disponible */
            object-cover                 /* Ajusta la imagen para cubrir todo el contenedor sin distorsionarse */
          `}
        />
      </div>


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
        `}>
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
      `}>
        <span className={`
          /* --- Texto --- */
          text-sm                      /* Tamaño pequeño */
          font-black                   /* Peso máximo */
          text-emerald-900             /* Color verde institucional */
        `}>
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
        `}>

          {/* Boton Para quitar el producto del Carrito */}

          <button
            onClick={() => removeFromPedido(item.producto.prod_id)}
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

          {/* Boton Para agregar el producto al Carrito <!> Esto no tiene mucho sentido para mi no tendria que aber un boton alta en los item de carrito */}
          <button
            onClick={() => addToPedido(item.producto)}
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


    </div>
  );
};






