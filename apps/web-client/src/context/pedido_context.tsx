/* --- apps/web-client/src/context/pedido_context.tsx --- */

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ApiProduct } from '../types/product_types';
import type { PedidoItem } from '../types/pedido_types';

/**
 * Interfaz del Contrato de la Fachada.
 * Define qué puede HACER la UI (métodos) y qué puede VER (estado).
 * Se mantiene aquí porque es específica de este Contexto, no es una entidad de datos pura.
 */ 
interface PedidoContextType {
  pedido: PedidoItem[];                                    /*  Lista de líneas de productos seleccionados */
  addToPedido: (product: ApiProduct) => void;              /*  Método para dar de alta o incrementar producto */
  removeFromPedido: (productId: number) => void;           /*  Método para dar de baja o decrementar producto */
  clearPedido: () => void;                                 /*  Método para vaciar el pedido actual */
  getWhatsAppUrl: (address: string) => string;             /*  Generador de link de comunicación con Salto */
  total: number;                                           /*  Sumatoria total del pedido (Observador) */
  itemCount: number;                                       /* Cantidad total de artículos (Observador) */
}

/* Creación del contexto con valor inicial indefinido */
const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

/**
 * Proveedor del Contexto de Pedidos (Fachada / Singleton).
 * Envuelve la aplicación para mantener una única instancia de los datos en memoria.
 * 
 */
export const PedidoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /* Estado reactivo que almacena el array de líneas de pedido */
  const [pedido, setPedido] = useState<PedidoItem[]>([]); 

  /**
   * Agrega un producto al pedido.
   * Si el producto ya existe en una línea, incrementa su cantidad.
   * Si no existe, crea una nueva instancia de LineaPedidoItem.
   * 
   * @param {ApiProduct} product - Entidad del producto proveniente del Backend.
   */
  const addToPedido = (product: ApiProduct) => {
    setPedido((prev) => { 
      const existing = prev.find(item => item.producto.prod_id === product.prod_id);
      
      if (existing) {
        /* Si existe, mapeamos el array incrementando solo el item correspondiente */
        return prev.map(item => 
          item.producto.prod_id === product.prod_id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      
      /* Si es nuevo, agregamos la línea capturando el precio actual del backend */
      return [...prev, { 
        producto: product, 
        cantidad: 1, 
        precio_unitario_capturado: product.prod_precio 
      }];
    });
  };

  /**
   * Remueve o decrementa un producto del pedido.
   * Si la cantidad es 1, elimina la línea completa.
   * 
   * @param {number} productId - Identificador único del producto a remover.
   */
  const removeFromPedido = (productId: number) => {
    setPedido((prev) => {
      const existing = prev.find(item => item.producto.prod_id === productId);
      
      /* Si solo queda una unidad, filtramos el array para eliminar la línea */
      if (existing?.cantidad === 1) {
        return prev.filter(item => item.producto.prod_id !== productId);
      }
      
      /* Si hay más de una, decrementamos la cantidad manteniendo la inmutabilidad */
      return prev.map(item => 
        item.producto.prod_id === productId 
          ? { ...item, cantidad: item.cantidad - 1 } 
          : item
      );
    });
  };

  /**
   * Limpia el estado del pedido, dejándolo vacío.
   */
  const clearPedido = () => setPedido([]);

  /**
   * Genera la URL de WhatsApp formateada profesionalmente.
   * 
   * @param {string} address - Dirección de entrega ingresada por el usuario.
   * @returns {string} Link de WhatsApp con el mensaje codificado.
   */
  const getWhatsAppUrl = (address: string): string => {
    let message = `🐾 *PEDIDO - VETERINARIA BELTRAMELLI* 🐾\n\n`;
    message += `📍 *Entrega:* ${address}\n`;
    message += `----------------------------------\n`;
    
    /* Iteramos las líneas para construir el cuerpo del mensaje */
    pedido.forEach(item => {
      const subtotal = item.precio_unitario_capturado * item.cantidad;
      message += `✅ ${item.cantidad}x ${item.producto.prod_nombre} - $${subtotal}\n`;
    });
    
    message += `----------------------------------\n`;
    message += `💰 *TOTAL:* $${total}\n\n`;
    message += `_Enviado desde la Web de Salto_`;
    
    return `https://wa.me/59892444510?text=${encodeURIComponent(message)}`;
  };

  /* --- LÓGICA DE OBSERVADORES (useMemo) --- */

  /**
   * Calcula el monto total del pedido.
   * Se recalcula automáticamente solo cuando el array 'pedido' sufre cambios.
   */
  const total = useMemo(() => 
    pedido.reduce((acc, item) => acc + (item.precio_unitario_capturado * item.cantidad), 0)
  , [pedido]);

  /**
   * Calcula la cantidad total de artículos en el pedido.
   * Útil para mostrar en el badge del Header.
   */
  const itemCount = useMemo(() => 
    pedido.reduce((acc, item) => acc + item.cantidad, 0)
  , [pedido]);

  return (
    <PedidoContext.Provider value={{ 
      pedido, 
      addToPedido, 
      removeFromPedido, 
      clearPedido,
      getWhatsAppUrl,
      total, 
      itemCount 
    }}>
      {children}
    </PedidoContext.Provider>
  );
};

/**
 * Hook personalizado para acceder a la Fachada de Pedidos.
 * Lanza un error si se intenta usar fuera del PedidoProvider.
 */
export const usePedidoStore = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoStore debe usarse dentro de un PedidoProvider');
  }
  return context;
};
