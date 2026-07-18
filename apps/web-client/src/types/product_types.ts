// apps/web-client/src/types/product_types.ts

/**
 * Interfaz que representa una imagen del producto
 * @prop img_url - URL de la imagen
 * @prop img_principal - Indica si es la imagen principal 
 */
export interface ApiImageProducto {
  img_id: number;
  img_url: string;
}

/**
 * Interfaz que representa un producto
 * @prop prod_id - ID del producto
 * @prop prod_nombre - Nombre del producto
 * @prop cat_id - ID de la categoría
 * @prop cat_nombre - Nombre de la categoría
 * @prop prod_precio - Precio del producto
 * @prop prod_descripcion - Descripción del producto
 * @prop imagen_principal_url - Imagen principal del producto, Campo Opcional
 * @prop imagenes_secundarias_url - Array de imágenes secundarias del producto, Campo Opcional
 * @prop subcategoria - Array de subcategorías del producto
 */

export interface ApiProduct { 
  prod_id: number;
  prod_nombre: string;
  cat_id: number;
  cat_nombre: string;
  prod_precio: number;
  prod_descripcion: string; 
  imagen_principal_url?: ApiImageProducto; 
  imagenes_secundarias_url?: ApiImageProducto[];
  subcategoria: { subc_nombre: string }[];
}

/**
 * Interfaz que representa una categoría
 * @prop cat_id - ID de la categoría
 * @prop cat_nombre - Nombre de la categoría
 * @prop productos - Array de productos
 */ 
export interface ApiCategory {
  cat_id: number;
  cat_nombre: string;
  productos: ApiProduct[]; 
}