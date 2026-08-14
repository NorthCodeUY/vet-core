/* --- apps/web-client/src/types/pedido_types.ts --- */
import type { ApiProduct } from './product_types';

/**
 * Representa una "Línea de Pedido" (PedidoDetalle).
 * @param producto - El producto agregado al pedido.
 * @param cantidad - La cantidad del producto agregado al pedido.
 * @param precio_unitario_capturado - El precio unitario capturado del producto agregado al pedido.
 */
export interface PedidoItem {
  producto: ApiProduct;
  cantidad: number;
  precio_unitario_capturado: number;
}

/**
 * Estructura para persistir en el Backend (FastAPI).
 * Coincide con PedidoModel y PedidoDetalleModel.
 * @param cli_id - ID del cliente 
 * @param ped_direccion - Dirección del pedido
 * @param ped_ubicacion - Ubicación del pedido
 * @param items - Items del pedido
 */
export interface PedidoOrderRequest {
  
  cli_id: number;
  ped_direccion: string;
  ped_ubicacion: string;
  items: {
    prod_id: number;
    pd_cantidad: number;
    pd_precio: number;
  }[];
}

























