/* --- apps/web-client/src/context/pedido_context.tsx --- */

/**
 * @fileoverview Store Global y Proveedor de Estado del Carrito de Compras (pedido_context.tsx)
 * 
 * Orquesta la canasta de compras de forma agnóstica y multi-tenant.
 * Soporta productos simples y con variantes con precios absolutos (var_precio_venta),
 * blindando el cálculo de totales contra valores nulos o indefinidos (Anti-NaN).
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
 * 
 * @param {number} productId - ID del producto padre.
 * @param {number} [variantId] - ID de la variante (si aplica).
 * @returns {string} Clave única (ej: "2_base" o "3_1").
 */
export const getPedidoItemKey = (productId: number, variantId?: number | null): string => {
  return variantId ? `${productId}_${variantId}` : `${productId}_base`;
};

interface PedidoContextType {
  pedido: PedidoItem[];
  loadPedidoMasivo: (lineas: PedidoItem[]) => void;
  addToPedido: (product: ApiProduct, variant?: ProductoVariante | null) => void;
  addItem: (product: ApiProduct, variant?: ProductoVariante | null) => void;
  removeFromPedido: (productId: number, variantId?: number | null) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  removAllPedido: (productId: number, variantId?: number | null) => void;
  removeAllPedido: (productId: number, variantId?: number | null) => void;
  updateItemQuantity: (idOrKey: number | string, newQuantity: number, variantId?: number | null) => void;
  clearPedido: () => void;
  getWhatsAppUrl: (address: string) => string;
  total: number;
  itemCount: number;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  const [pedido, setPedido] = useState<PedidoItem[]>([]);

  const loadPedidoMasivo = (lineas: PedidoItem[]): void => {
    // Sanitiza cualquier línea defectuosa para asegurar números válidos
    const lineasSeguras = lineas.map((item) => ({
      ...item,
      precio_unitario_capturado: Number(item.precio_unitario_capturado) || 0,
      cantidad: Number(item.cantidad) || 1,
    }));
    setPedido(lineasSeguras);
  };

  /**
   * <!> RESOLUCIÓN DE PRECIO ABSOLUTO SIN NaN:
   * Prioriza var_precio_venta sobre prod_precio_venta y usa fallbacks seguros.
   */
  const addToPedido = (product: ApiProduct, variant?: ProductoVariante | null): void => {
    const itemKey = getPedidoItemKey(product.prod_id, variant?.var_id);

    // Resolución segura del precio numérico (cero NaN)
    const precioBase = Number(product.prod_precio_venta);
    const precioVariante = variant ? Number(variant.var_precio_venta ?? precioBase) : precioBase;
    const precioCapturado = isNaN(precioVariante) ? 0 : precioVariante;

    setPedido((prev: PedidoItem[]) => {
      const existingIndex = prev.findIndex((item) => item.item_key === itemKey);

      // Si ya existe, incrementamos cantidad
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      // Si es nuevo, lo agregamos con su precio capturado
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

  const removeFromPedido = (productId: number, variantId?: number | null): void => {
    const targetKey = getPedidoItemKey(productId, variantId);

    setPedido((prev) => {
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

  const removAllPedido = (productId: number, variantId?: number | null): void => {
    const targetKey = getPedidoItemKey(productId, variantId);

    setPedido((prev) =>
      prev.filter((item) => {
        if (variantId) return item.item_key !== targetKey;
        return item.producto.prod_id !== productId;
      })
    );
  };

  const updateItemQuantity = (
    idOrKey: number | string,
    newQuantity: number,
    variantId?: number | null
  ): void => {
    setPedido((prev) => {
      const validatedQuantity = Math.max(0, newQuantity);

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

  const clearPedido = (): void => setPedido([]);

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
      const precioUnit = Number(item.precio_unitario_capturado) || 0;
      const subtotalLinea = precioUnit * item.cantidad;
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
     <!> OBSERVADORES BLINDADOS CONTRA NaN:
     Aseguran que cualquier valor no numérico se convierta a 0.
     =========================================================================== */
  const total = useMemo(() => {
    return pedido.reduce((acc, item) => {
      const precioUnitario = Number(item.precio_unitario_capturado) || 0;
      const cantidad = Number(item.cantidad) || 0;
      return acc + (precioUnitario * cantidad);
    }, 0);
  }, [pedido]);

  const itemCount = useMemo(() => {
    return pedido.reduce((acc, item) => {
      const cantidad = Number(item.cantidad) || 0;
      return acc + cantidad;
    }, 0);
  }, [pedido]);

  return (
    <PedidoContext.Provider
      value={{
        pedido,
        loadPedidoMasivo,
        addToPedido,
        addItem: addToPedido,
        removeFromPedido,
        removeItem: removeFromPedido,
        removAllPedido,
        removeAllPedido: removAllPedido,
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