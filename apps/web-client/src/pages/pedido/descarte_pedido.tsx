/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context'; 
import type { PedidoItem } from '../../types/pedido_types';

interface PedidoItemRowProps {
  item: PedidoItem;
}

export const PedidoItemRow = ({ item }: PedidoItemRowProps) => {
  /* 
     Extraemos los métodos de la Fachada. 
     El error "unused" desaparecerá en cuanto los usemos en los onClick de abajo.
  */
  const { addToPedido, removeFromPedido } = usePedidoStore();

  const subtotal = item.producto.prod_precio * item.cantidad;

  return (
    /* 
       <!> CORRECCIÓN: Se eliminó la palabra 'key' suelta. 
       En React, 'key' no puede ir sola, y aquí no es necesaria porque 
       ya la pusimos en el .map() del componente padre (PedidoDrawer).
    */
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible horizontal */
      items-center                 /* Centrado vertical */
      gap-4                        /* Espacio entre imagen e info */
      
      /* --- Dimensiones --- */
      w-full                       /* Ocupa todo el ancho */
      p-3                          /* Padding interno */
      
      /* --- Colores --- */
      bg-white                     /* Fondo blanco */
      border                       /* Borde habilitado */
      border-slate-100             /* Color de borde suave */
      
      /* --- Estilo --- */
      rounded-2xl                  /* Bordes redondeados */
      shadow-sm                    /* Sombra leve */
    `}>
  
      {/* Miniatura del Producto */}
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50">
        <img 
          src={item.producto.rel_imagen_url[0]?.img_url} 
          alt={item.producto.prod_nombre}
          className="w-full h-full object-cover"
        />
      </div> 

      {/* Información del Producto */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 truncate">
          {item.producto.prod_nombre}
        </h4>
        <p className="text-xs text-slate-400 font-medium">
          ${item.producto.prod_precio.toLocaleString('es-UY')} c/u
        </p>
      </div>

      {/* Controles y Subtotal */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-black text-emerald-900">
          ${subtotal.toLocaleString('es-UY')}
        </span>

        <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-100">

          <button 
            onClick={() => removeFromPedido(item.producto.prod_id)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
          >
            {item.cantidad === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
          </button>

          <span className="text-xs font-bold text-slate-700 w-5 text-center">
            {item.cantidad}
          </span>

          <button 
            onClick={() => addToPedido(item.producto)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};