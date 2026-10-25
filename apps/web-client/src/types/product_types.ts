/**
 * @fileoverview Contratos de datos para el Catálogo de Productos, Variantes y Colores.
 * @module types/product_types
 */

/**
 * Entidad normalizada de Color.
 * 
 * @interface Color
 * @property {number} col_id - ID único del color.
 * @property {string} col_nombre - Nombre visible (ej: 'Negro Mate', 'Azul').
 * @property {string} col_hex - Código hexadecimal (#RRGGBB) para estilos CSS.
 */
export interface Color {
  col_id: number;
  col_nombre: string;
  col_hex: string;
}

/**
 * Presentación vendible específica de un producto (Talle, Medida, Volumen).
 * 
 * @interface ProductoVariante
 * @property {number} var_id - ID único de la variante.
 * @property {number} prod_id - ID del producto padre.
 * @property {string} var_tipo - Tipo de dimensión ('Talle', 'Medida', 'Volumen').
 * @property {string} var_nombre - Valor específico ('S', 'M', 'L', 'XL', '500ml').
 * @property {number} var_precio_adicional - Sobrecosto a sumar al precio base.
 * @property {number} var_stock - Stock disponible exclusivo para esta combinación.
 * @property {string} [sku] - Código alfanumérico único para inventario.
 * @property {Color} [color] - Objeto de color normalizado opcional.
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
 * Representación de una imagen asociada a un producto.
 * 
 * @interface ApiImageProducto
 * @property {number} img_id - ID único de la imagen.
 * @property {string} img_url - URL absoluta (Cloudflare R2) o relativa.
 */
export interface ApiImageProducto {
  img_id: number;
  img_url: string;
}

/**
 * Entidad unificada de Producto consumida por la UI.
 * 
 * @interface ApiProduct
 * @property {number} prod_id - Identificador único del producto.
 * @property {string} prod_nombre - Nombre comercial del producto.
 * @property {string} prod_descripcion - Detalle técnico o comercial.
 * @property {number} prod_precio - Precio base del producto.
 * @property {number} prod_stock - Stock base disponible.
 * @property {number} cat_id - ID de la categoría a la que pertenece.
 * @property {string} cat_nombre - Nombre de la categoría asociada.
 * @property {ApiImageProducto | null} [imagen_principal_url] - Imagen destacada.
 * @property {ApiImageProducto[]} [imagenes_secundarias_url] - Galería adicional.
 * @property {string[]} [subcategorias] - Nombres de subcategorías asignadas.
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
  imagen_principal_url?: ApiImageProducto | null;
  imagenes_secundarias_url?: ApiImageProducto[];
  subcategorias?: string[];
  variantes: ProductoVariante[];
}

/**
 * Agrupación de catálogo por categoría.
 * 
 * @interface ApiCategory
 */
export interface ApiCategory {
  cat_id: number;
  cat_nombre: string;
  productos: ApiProduct[];
}

/**
 * Alias de compatibilidad hacia atrás para no romper código existente.
 */
export type Producto = ApiProduct;