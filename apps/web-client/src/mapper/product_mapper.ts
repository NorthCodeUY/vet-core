// apps/web-client/src/mapper/product_mapper.ts

/**
 * @fileoverview Mapeador y Transformador de DTOs del Backend hacia la UI (product_mapper.ts)
 * 
 * Transforma la estructura cruda retornada por FastAPI (con SQLAlchemy 2.0) al 
 * modelo estricto de la UI. Resuelve URLs de Cloudflare R2 y sanitiza variantes.
 * 
 * @module mapper/product_mapper
 */

import type { 
  ApiProduct, 
  ApiImageProducto, 
  ProductoVariante 
} from '../types/product_types';

export const productMapper = {
  /**
   * Resuelve y sanitiza la URL de una imagen.
   * Si la URL ya es absoluta (Cloudflare R2 / S3), la mantiene intacta.
   * Si es relativa local, le antepone la ruta de fallback.
   * 
   * @private
   */
  _formatImage(rawImg: any): ApiImageProducto {
    if (!rawImg) {
      return { img_id: 0, img_url: '/tenant/producto_no_disponible.png' };
    }

    const rawUrl = String(rawImg.img_url || '');
    let finalUrl = rawUrl;

    // Si no es una URL externa de Cloudflare R2 (https://...)
    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      finalUrl = `/static/productos/${rawUrl}`;
    }

    return {
      img_id: Number(rawImg.img_id || 0),
      img_url: finalUrl || '/tenant/producto_no_disponible.png',
    };
  },

  /**
   * Mapea un producto individual crudo del Backend a la entidad ApiProduct.
   * 
   * @param {any} p - DTO del producto emitido por FastAPI.
   * @param {string} [catNombre='General'] - Nombre de la categoría padre.
   * @param {number} [catId=0] - ID de la categoría padre.
   * @returns {ApiProduct}
   */
  toUI(p: any, catNombre: string = 'General', catId: number = 0): ApiProduct {
    const rawImages = Array.isArray(p.rel_imagen_url) ? p.rel_imagen_url : [];
    
    // Identificar imagen principal
    const principalData = rawImages.find((img: any) => img.img_principal) || rawImages[0];
    const imagenPrincipal = principalData ? this._formatImage(principalData) : null;

    // Imágenes secundarias
    const imagenesSecundarias = rawImages
      .filter((img: any) => img !== principalData)
      .map((img: any) => this._formatImage(img));

    // Mapeo seguro de Variantes de Talle / Color
    const variantesMapeadas: ProductoVariante[] = Array.isArray(p.variantes)
      ? p.variantes.map((v: any): ProductoVariante => ({
          var_id: Number(v.var_id),
          prod_id: Number(v.prod_id || p.prod_id),
          var_tipo: String(v.var_tipo || 'Talle'),
          var_nombre: String(v.var_nombre || ''),
          var_precio_adicional: Number(v.var_precio_adicional || 0),
          var_stock: Number(v.var_stock || 0),
          sku: v.sku ? String(v.sku) : undefined,
          color: v.color
            ? {
                col_id: Number(v.color.col_id),
                col_nombre: String(v.color.col_nombre),
                col_hex: String(v.color.col_hex),
              }
            : undefined,
        }))
      : [];

    return {
      prod_id: Number(p.prod_id),
      prod_nombre: String(p.prod_nombre || ''),
      prod_descripcion: String(p.prod_descripcion || ''),
      prod_precio: Number(p.prod_precio || 0),
      prod_stock: Number(p.prod_stock || 0),
      cat_id: Number(p.cat_id || catId),
      cat_nombre: String(p.cat_nombre || catNombre),
      imagen_principal_url: imagenPrincipal,
      imagenes_secundarias_url: imagenesSecundarias,
      subcategorias: Array.isArray(p.rel_subcategoria)
        ? p.rel_subcategoria.map((sub: any) => String(sub.subc_nombre || ''))
        : [],
      variantes: variantesMapeadas,
    };
  },

  /**
   * Transforma una lista de productos crudos.
   * Responde a tu duda: toUIList simplemente ejecuta toUI en cada elemento del array.
   * 
   * @param {any[]} products - Lista de productos crudos.
   * @param {string} catNombre - Nombre de la categoría.
   * @param {number} catId - ID de la categoría.
   * @returns {ApiProduct[]}
   */
  toUIList(products: any[], catNombre: string, catId: number): ApiProduct[] {
    if (!Array.isArray(products)) return [];
    return products.map((p) => this.toUI(p, catNombre, catId));
  },
};