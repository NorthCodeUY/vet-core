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
  ProductoVariante,
  SubcategoriaItem,
} from '../types/product_types';

export const productMapper = {
  _formatImage(rawImg: any): ApiImageProducto {
    if (!rawImg) return { img_id: 0, img_url: '/tenant/producto_no_disponible.png' };

    const rawUrl = String(rawImg.img_url || '');
    let finalUrl = rawUrl;

    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      finalUrl = `/static/productos/${rawUrl}`;
    }

    return {
      img_id: Number(rawImg.img_id || 0),
      img_url: finalUrl || '/tenant/producto_no_disponible.png',
    };
  },

  toUI(p: any, catNombre: string = 'General', catId: number = 0): ApiProduct {
    const rawImages = Array.isArray(p.rel_imagen_url) ? p.rel_imagen_url : [];
    const principalData = rawImages.find((img: any) => img.img_principal) || rawImages[0];
    const imagenPrincipal = principalData ? this._formatImage(principalData) : null;
    const imagenesSecundarias = rawImages
      .filter((img: any) => img !== principalData)
      .map((img: any) => this._formatImage(img));

    //  1. Mapeo de Variantes (Soporta 'rel_variantes' o 'variantes')
    const rawVariantes = p.rel_variantes || p.variantes || [];
    const variantesMapeadas: ProductoVariante[] = Array.isArray(rawVariantes)
      ? rawVariantes.map((v: any): ProductoVariante => ({
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

    //  2. Mapeo de Subcategorías (Desempaqueta la tabla intermedia rel_subcategoria)
    const rawSubc = Array.isArray(p.rel_subcategoria) ? p.rel_subcategoria : [];
    const subcategoriasMapeadas: SubcategoriaItem[] = rawSubc.map((item: any) => {
      // Si viene anidado en rel_subcategoria, extraemos el objeto real
      const sub = item.rel_subcategoria || item;
      return {
        subc_id: Number(sub.subc_id || item.subc_id),
        subc_nombre: String(sub.subc_nombre || ''),
        subc_icono: sub.subc_icono || null,
        subc_imagen_url: sub.subc_imagen_url || null,
      };
    });

    return {
      prod_id: Number(p.prod_id),
      prod_nombre: String(p.prod_nombre || ''),
      prod_descripcion: String(p.prod_descripcion || ''),
      prod_precio: Number(p.prod_precio || 0),
      prod_stock: p.prod_stock !== null ? Number(p.prod_stock) : 99, // Fallback si es null
      cat_id: Number(p.cat_id || catId),
      cat_nombre: String(p.cat_nombre || catNombre),
      imagen_principal_url: imagenPrincipal,
      imagenes_secundarias_url: imagenesSecundarias,
      subcategorias: subcategoriasMapeadas,
      variantes: variantesMapeadas,
    };
  },

  toUIList(products: any[], catNombre: string, catId: number): ApiProduct[] {
    if (!Array.isArray(products)) return [];
    return products.map((p) => this.toUI(p, catNombre, catId));
  },
};