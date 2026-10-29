/**
 * @fileoverview Contratos de datos para Productos y Variantes de Inventario.
 * @module types/product_types
 */

// Importaciones de dominios especializados
import type { ApiImage, Color } from './common_types';
import type { SubcategoriaItem } from './category_types';

// Re-exportamos para conveniencia
export type { ApiImage, Color, SubcategoriaItem };

/**
 * Presentación vendible específica de un producto (Talle, Medida, Volumen).
 * 
 * @interface ProductoVariante
 * @property {number} var_id - ID único de la variante.
 * @property {number} prod_id - ID del producto padre.
 * @property {string} var_tipo - Tipo de dimensión ('Talle', 'Medida', 'Volumen').
 * @property {string} var_nombre - Valor específico ('S', 'M', 'L', 'XL', '500ml').
 * @property {number} var_precio_adicional - Sobrecosto a sumar al precio base del producto.
 * @property {number} var_stock - Stock disponible exclusivo para esta combinación.
 * @property {string} [sku] - Código alfanumérico único para inventario.
 * @property {Color} [color] - Color normalizado asociado.
 */
export interface ProductoVariante {
  var_id: number;
  prod_id: number;
  var_tipo: string;
  var_nombre: string;
  var_precio_adicional: number;
  var_stock: number;
  sku?: string;
  color?: Color;
}

/**
 * Entidad unificada de Producto consumida por la interfaz de usuario.
 * 
 * @interface ApiProduct
 * @property {number} prod_id - Identificador único del producto.
 * @property {string} prod_nombre - Nombre comercial del producto.
 * @property {string} prod_descripcion - Detalle técnico o comercial.
 * @property {number} prod_precio - Precio base del producto.
 * @property {number} prod_stock - Stock base disponible.
 * @property {number} cat_id - ID de la categoría a la que pertenece.
 * @property {string} cat_nombre - Nombre de la categoría asociada.
 * @property {ApiImage | null} [imagen_principal_url] - Imagen destacada.
 * @property {ApiImage[]} [imagenes_secundarias_url] - Galería adicional.
 * @property {SubcategoriaItem[]} [subcategorias] - Subcategorías tipadas con íconos.
 * @property {ProductoVariante[]} variantes - Variantes disponibles de talle/color.
 */
export interface ApiProduct {
  prod_id: number;
  prod_nombre: string;
  prod_descripcion: string;
  prod_precio: number;
  prod_stock: number;
  cat_id: number;
  cat_nombre: string;
  imagen_principal_url?: ApiImage | null;
  imagenes_secundarias_url?: ApiImage[];
  subcategorias?: SubcategoriaItem[];
  variantes: ProductoVariante[];
}

/**
 * Agrupación de catálogo por categoría para la Landing Page.
 * 
 * @interface ApiCategory
 */
export interface ApiCategory {
  cat_id: number;
  cat_nombre: string;
  productos: ApiProduct[];
}

/* =============================================================================
   ALIAS DE COMPATIBILIDAD HACIA ATRÁS
   ============================================================================= */
export type Producto = ApiProduct;
export type ApiImageProducto = ApiImage;