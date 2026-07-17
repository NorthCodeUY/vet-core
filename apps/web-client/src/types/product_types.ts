// apps/web-client/src/types/product_types.ts

/**
 * Interfaz que representa una imagen del producto
 * @prop img_url - URL de la imagen
 * @prop img_principal - Indica si es la imagen principal 
 */
export interface ApiImage {
  img_url: string;
  img_principal: boolean;
}

/**
 * Interfaz que representa un producto
 * @prop prod_id - ID del producto
 * @prop prod_nombre - Nombre del producto
 * @prop prod_precio - Precio del producto
 * @prop prod_descripcion - Descripción del producto
 * @prop rel_imagen_url - Array de imágenes del producto
 * @prop rel_subcategoria - Array de subcategorías del producto
 */
export interface ApiProduct {
  prod_id: number;
  prod_nombre: string;
  prod_precio: number;
  prod_descripcion: string;
  rel_imagen_url: ApiImage[];
  rel_subcategoria: { subc_nombre: string }[];
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
  productos: ApiProduct[]; // <!> Esto no se si esta bine funciona porque me trae con el conjunto de de productos pero no estoy tan seguro 
}