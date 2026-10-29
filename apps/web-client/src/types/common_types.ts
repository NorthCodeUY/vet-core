/**
 * @fileoverview Tipos y Entidades Universales Reutilizables en todo el SaaS.
 * @module types/common_types
 */

/**
 * Recurso gráfico o multimedia genérico (Imágenes de productos, avatares, comprobantes).
 * 
 * @interface ApiImage
 * @property {number} img_id - Identificador único de la imagen en base de datos.
 * @property {string} img_url - URL absoluta (Cloudflare R2) o relativa local.
 */
export interface ApiImage {
  img_id: number;
  img_url: string;
}

/**
 * Entidad normalizada de Color para componentes cromáticos y swatches.
 * 
 * @interface Color
 * @property {number} col_id - ID único del color.
 * @property {string} col_nombre - Nombre descriptivo (ej: 'Negro Mate', 'Azul Eléctrico').
 * @property {string} col_hex - Código hexadecimal (#RRGGBB) para renderizado CSS nativo.
 */
export interface Color {
  col_id: number;
  col_nombre: string;
  col_hex: string;
}