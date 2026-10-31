/* --- apps/web-client/src/context/pedido_context.tsx --- */

/**
 * @fileoverview Store Global y Proveedor de Estado del Carrito de Compras (pedido_context.tsx)
 * 
 * Orquesta la canasta de compras de forma agnóstica y multi-tenant.
 * Soporta productos simples y productos con variantes (talles, medidas y colores),
 * administrando identificadores compuestos únicos (`item_key`) para permitir
 * que un cliente compre distintas variantes del mismo artículo en una sola orden.
 * 
 * @module context/pedido_context
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
// --- Contratos de Dominio ---
import type { ApiProduct, ProductoVariante } from '../types/product_types';
import type { PedidoItem } from '../types/pedido_types';
import { useConfig } from './tenant_context';

/**
 * Genera la clave compuesta única de la línea de pedido.
 * Evita colisiones cuando se compra el mismo producto en talles o colores distintos.
 * 
 * @param {number} productId - ID del producto padre.
 * @param {number} [variantId] - ID de la variante (si aplica).
 * @returns {string} Clave única (ej: "45_102" o "45_base").
 */
export const getPedidoItemKey = (productId: number, variantId?: number | null): string => {
  return variantId ? `${productId}_${variantId}` : `${productId}_base`;
};

/**
 * Contrato de la Fachada de Pedidos y Carrito.
 * @interface PedidoContextType
 */
interface PedidoContextType {
  pedido: PedidoItem[];
  loadPedidoMasivo: (lineas: PedidoItem[]) => void;
  //  Métodos preparados para recibir la variante opcional
  addToPedido: (product: ApiProduct, variant?: ProductoVariante | null) => void;
  addItem: (product: ApiProduct, variant?: ProductoVariante | null) => void; // Alias moderno
  removeFromPedido: (productId: number, variantId?: number | null) => void;
  removeItem: (productId: number, variantId?: number | null) => void; // Alias moderno
  removAllPedido: (productId: number, variantId?: number | null) => void;
  removeAllPedido: (productId: number, variantId?: number | null) => void; // Alias sin typo
  updateItemQuantity: (idOrKey: number | string, newQuantity: number, variantId?: number | null) => void;
  clearPedido: () => void;
  getWhatsAppUrl: (address: string) => string;
  total: number;
  itemCount: number;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

/**
 * Proveedor del Contexto de Pedidos (`PedidoProvider`).
 */
export const PedidoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  const [pedido, setPedido] = useState<PedidoItem[]>([]);

  /**
   * Carga masiva de líneas (utilizado en la rehidratación desde la URL).
   */
  const loadPedidoMasivo = (lineas: PedidoItem[]): void => {
    setPedido(lineas);
  };

  /**
   *  AGREGA O INCREMENTA UN PRODUCTO CON O SIN VARIANTE
   * Calcula el precio unitario capturado (Precio Base + Adicional de Talle).
   */
  const addToPedido = (product: ApiProduct, variant?: ProductoVariante | null): void => {
    const itemKey = getPedidoItemKey(product.prod_id, variant?.var_id);
    const adicional = variant?.var_precio_adicional || 0;
    const precioCapturado = product.prod_precio + adicional;

    setPedido((prev: PedidoItem[]) => {
      const existingIndex = prev.findIndex((item) => item.item_key === itemKey);

      // 1. Si la combinación exacta ya existe en el carrito, incrementamos su cantidad
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      // 2. Si es una línea nueva, creamos el PedidoItem completo con su item_key
      const nuevoItem: PedidoItem = {
        item_key: itemKey,
        producto: product,
        variante_seleccionada: variant || undefined,
        cantidad: 1,
        precio_unitario_capturado: precioCapturado,
      };

      return [...prev, nuevoItem];
    });
  };

  /**
   * Decrementa una unidad de la línea. Si llega a 0, se remueve del pedido.
   */
  const removeFromPedido = (productId: number, variantId?: number | null): void => {
    const targetKey = getPedidoItemKey(productId, variantId);

    setPedido((prev) => {
      // Búsqueda defensiva por clave compuesta o por ID simple
      const existing = prev.find(
        (item) => item.item_key === targetKey || item.producto.prod_id === productId
      );

      if (!existing) return prev;

      if (existing.cantidad <= 1) {
        return prev.filter((item) => item.item_key !== existing.item_key);
      }

      return prev.map((item) =>
        item.item_key === existing.item_key ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    });
  };

  /**
   * Elimina completamente la línea del pedido sin importar cuántas unidades tenga.
   */
  const removAllPedido = (productId: number, variantId?: number | null): void => {
    const targetKey = getPedidoItemKey(productId, variantId);

    setPedido((prev) =>
      prev.filter((item) => {
        if (variantId) return item.item_key !== targetKey;
        return item.producto.prod_id !== productId;
      })
    );
  };

  /**
   * Actualiza la cantidad exacta desde el input numérico editable de `PedidoItemRow`.
   */
  const updateItemQuantity = (
    idOrKey: number | string,
    newQuantity: number,
    variantId?: number | null
  ): void => {
    setPedido((prev) => {
      const validatedQuantity = Math.max(0, newQuantity);

      // Si la cantidad es 0, eliminamos la línea
      if (validatedQuantity === 0) {
        return prev.filter((item) => {
          if (typeof idOrKey === 'string') return item.item_key !== idOrKey;
          if (variantId) return item.item_key !== getPedidoItemKey(idOrKey, variantId);
          return item.producto.prod_id !== idOrKey;
        });
      }

      return prev.map((item) => {
        const matches =
          typeof idOrKey === 'string'
            ? item.item_key === idOrKey
            : variantId
            ? item.item_key === getPedidoItemKey(idOrKey, variantId)
            : item.producto.prod_id === idOrKey;

        return matches ? { ...item, cantidad: validatedQuantity } : item;
      });
    });
  };

  /**
   * Vacía el carrito por completo.
   */
  const clearPedido = (): void => setPedido([]);

  /**
   *  GENERADOR DE MENSAJE AGNÓSTICO PARA WHATSAPP
   * Elimina datos quemados. Lee el nombre de la empresa y teléfono desde config.json.
   */
  const getWhatsAppUrl = (address: string): string => {
    const businessName = config?.business_name || 'TIENDA WEB';
    const rawPhone = config?.contact?.admin_phone || '';
    const countryCode = config?.contact?.whatsapp_country_code || '598';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const finalPhone = `${countryCode}${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;

    let message = `🛒 *PEDIDO - ${businessName.toUpperCase()}*\n\n`;
    message += `📍 *Entrega:* ${address}\n`;
    message += `----------------------------------\n`;

    pedido.forEach((item) => {
      const subtotalLinea = item.precio_unitario_capturado * item.cantidad;
      const talleTxt = item.variante_seleccionada
        ? ` (${item.variante_seleccionada.var_tipo}: ${item.variante_seleccionada.var_nombre})`
        : '';
      message += `✅ ${item.cantidad}x ${item.producto.prod_nombre}${talleTxt} - $${subtotalLinea.toLocaleString('es-UY')}\n`;
    });

    message += `----------------------------------\n`;
    message += `💰 *TOTAL:* $${total.toLocaleString('es-UY')}\n\n`;
    message += `_Enviado desde el portal web oficial_`;

    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
  };

  /* ===========================================================================
     OBSERVADORES COMPUTADOS (useMemo)
     =========================================================================== */
  const total = useMemo(() => {
    return pedido.reduce(
      (acc, item) => acc + item.precio_unitario_capturado * item.cantidad,
      0
    );
  }, [pedido]);

  const itemCount = useMemo(() => {
    return pedido.reduce((acc, item) => acc + item.cantidad, 0);
  }, [pedido]);

  return (
    <PedidoContext.Provider
      value={{
        pedido,
        loadPedidoMasivo,
        addToPedido,
        addItem: addToPedido, // Alias moderno
        removeFromPedido,
        removeItem: removeFromPedido, // Alias moderno
        removAllPedido,
        removeAllPedido: removAllPedido, // Alias sin error ortográfico
        updateItemQuantity,
        clearPedido,
        getWhatsAppUrl,
        total,
        itemCount,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedidoStore = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoStore debe utilizarse dentro de un PedidoProvider');
  }
  return context;
};