/* --- apps/web-client/src/context/pedido_context.tsx --- */ 
// <!> Creo que si esto lo que ase es crear linias de productos poe la funcionalidad le quiero llamar pedido_context


import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ApiProduct } from '../types/product_types';

interface PedidoContextType {
  pedido: PedidoItem[];
  addToPedido: (product: ApiProduct) => void;
  removeFromPedido: (productId: number) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<PedidoItem[]>([]);

  /* Método: Alta de línea de producto */
  const addToCart = (product: ApiProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.producto.prod_id === product.prod_id);
      if (existing) {
        return prev.map(item => 
          item.producto.prod_id === product.prod_id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...prev, { 
        producto: product, 
        cantidad: 1, 
        precio_unitario_capturado: product.prod_precio 
      }];
    });
  };

  /* Método: Baja de línea de producto */
  const removeFromPedido = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.producto.prod_id === productId);
      if (existing?.cantidad === 1) {
        return prev.filter(item => item.producto.prod_id !== productId);
      }
      return prev.map(item => 
        item.producto.prod_id === productId 
          ? { ...item, cantidad: item.cantidad - 1 } 
          : item
      );
    });
  };

  /* --- PATRÓN OBSERVER (useMemo) --- */
  /* Se recalcula automáticamente cada vez que 'cart' cambia */
  const total = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.precio_unitario_capturado * item.cantidad), 0)
  , [cart]);

  const itemCount = useMemo(() => 
    cart.reduce((acc, item) => acc + item.cantidad, 0)
  , [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const usePedidoStore = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};

//<!> Esto no tengo caro para que es solo lo puse aca depues lo miro 

const getWhatsAppUrl = (address: string) => {
  let message = `🐾 *PEDIDO - VETERINARIA BELTRAMELLI* 🐾\n\n`;
  message += `📍 *Entrega:* ${address}\n`;
  message += `----------------------------------\n`;
  
  cart.forEach(item => {
    message += `✅ ${item.cantidad}x ${item.producto.prod_nombre} - $${item.producto.prod_precio * item.cantidad}\n`;
  });
  
  message += `----------------------------------\n`;
  message += `💰 *TOTAL:* $${total}\n`;
  
  return `https://wa.me/59892444510?text=${encodeURIComponent(message)}`;
};