/* --- apps/web-client/src/types/pedido_types.ts --- */
import type { ApiProduct, ProductoVariante } from './product_types';

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
 * Línea transaccional dentro del pedido.
 * 
 * @interface PedidoItem
 * @property {string} item_key - Identificador compuesto único: `${prod_id}_${var_id || 'simple'}`.
 * @property {Producto} producto - Datos del producto base.
 * @property {ProductoVariante} [variante_seleccionada] - Variante elegida por el cliente.
 * @property {number} cantidad - Unidades solicitadas.
 * @property {number} precio_unitario_capturado - Precio base + adicional congelado al agregar.
 */
export interface PedidoItem {
  item_key: string;
  producto: ApiProduct;
  variante_seleccionada?: ProductoVariante;
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

























