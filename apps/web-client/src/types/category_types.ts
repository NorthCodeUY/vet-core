/**
 * @fileoverview Contratos de datos para Categorías y Subcategorías del Catálogo.
 * @module types/category_types
 */

/**
 * Subcategoría o Especie con soporte de iconografía agnóstica.
 * 
 * @interface SubcategoriaItem
 * @property {number} subc_id - Identificador único de la subcategoría.
 * @property {string} subc_nombre - Nombre visible (ej: 'Perro', 'Gato', 'Remeras').
 * @property {string | null} [subc_icono] - Clave de icono vectorial Lucide (ej: 'Cat', 'Shirt').
 * @property {string | null} [subc_imagen_url] - URL pública de SVG personalizado en CDN/R2.
 */
export interface SubcategoriaItem {
  subc_id: number;
  subc_nombre: string;
  subc_icono?: string | null;
  subc_imagen_url?: string | null;
}

/**
 * Categoría base de agrupación.
 * 
 * @interface CategoriaBase
 * @property {number} cat_id - ID de la categoría.
 * @property {string} cat_nombre - Nombre de la categoría.
 */
export interface CategoriaBase {
  cat_id: number;
  cat_nombre: string;
}