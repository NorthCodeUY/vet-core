/**
 * @fileoverview Contratos de datos para el Catálogo Público de la Web (product_types.ts)
 * 
 * Modela exclusivamente la información transaccional visible para el cliente final.
 * Los filtros de visibilidad, costos internos y umbrales de stock mínimo son
 * gestionados por el backend y reservados para el Portal Administrativo en Flutter.
 * 
 * @module types/product_types
 */

// --- Importaciones de dominios especializados ---
import type { ApiImage, Color } from './common_types';
import type { SubcategoriaItem } from './category_types';

// Re-exportamos para conveniencia en componentes
export type { ApiImage, Color, SubcategoriaItem };

/**
 * Presentación vendible de un producto (Talle, Medida, Volumen, Color).
 * 
 * @interface ProductoVariante
 * @property {number} var_id - ID único de la variante en base de datos.
 * @property {number} prod_id - ID del producto padre.
 * @property {string} var_tipo - Tipo de dimensión (ej: 'Talle', 'Presentación').
 * @property {string} var_nombre - Valor específico visible (ej: 'S', 'M', '1 Litro').
 * @property {number} var_precio_venta - Precio final de venta absoluto para esta variante.
 * @property {number} var_stock - Stock físico disponible.
 * @property {string | null} [var_sku] - Código alfanumérico SKU del inventario.
 * @property {string | null} [var_codigo_barra] - Código de barras EAN/UPC opcional.
 * @property {boolean} var_disponible - Interruptor maestro (false: aparece tachada/pausada).
 * @property {boolean} var_permitir_sin_stock - Habilita compras por encargo si stock es 0.
 * @property {Color | null} [color] - Color normalizado asociado.
 */
export interface ProductoVariante {
  var_id: number;
  prod_id: number;
  var_tipo: string;
  var_nombre: string;
  
  /* --- Precio y Existencia --- */
  var_precio_venta: number;
  var_stock: number;
  var_sku?: string | null;
  var_codigo_barra?: string | null;

  /* --- Disponibilidad Comercial --- */
  var_disponible: boolean;
  var_permitir_sin_stock: boolean;

  color?: Color | null;
}

/**
 * Entidad de Producto para la tienda web pública.
 * 
 * @interface ApiProduct
 * @property {number} prod_id - Identificador único del producto.
 * @property {string} prod_nombre - Nombre comercial del producto.
 * @property {string | null} [prod_descripcion] - Ficha descriptiva.
 * @property {number} prod_precio_venta - Precio oficial de venta (usado en productos simples o como precio base).
 * @property {number | null} [prod_stock] - Stock físico (usado si el producto no tiene variantes).
 * @property {number} cat_id - ID de la categoría a la que pertenece.
 * @property {string} cat_nombre - Nombre de la categoría asociada.
 * @property {boolean} prod_solo_variantes - Si es true, exige elegir talle/medida para comprar.
 * @property {boolean} prod_disponible - Interruptor maestro (false: pausa producto y opciones).
 * @property {boolean} prod_per_sin_stock - Habilita venta sin stock (por encargo) a nivel general.
 * @property {ApiImage | null} [imagen_principal_url] - Imagen destacada para la tarjeta.
 * @property {ApiImage[]} [imagenes_secundarias_url] - Galería adicional para el detalle.
 * @property {SubcategoriaItem[]} [subcategorias] - Especies o tags asociados con íconos.
 * @property {ProductoVariante[]} variantes - Variantes disponibles para compra.
 */
export interface ApiProduct {
  prod_id: number;
  prod_nombre: string;
  prod_descripcion?: string | null;

  /* --- Precio y Existencia Base --- */
  prod_precio_venta: number;
  prod_stock?: number | null;

  /* --- Categorización --- */
  cat_id: number;
  cat_nombre: string;

  /* --- Reglas Comerciales de Venta --- */
  prod_solo_variantes: boolean;
  prod_disponible: boolean;
  prod_per_sin_stock: boolean;

  /* --- Multimedia y Subcategorías --- */
  imagen_principal_url?: ApiImage | null;
  imagenes_secundarias_url?: ApiImage[];
  subcategorias?: SubcategoriaItem[];

  /* --- Variantes Vendibles --- */
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
   ALIAS DE TIPADO
   ============================================================================= */
export type Producto = ApiProduct;
export type ApiImageProducto = ApiImage;