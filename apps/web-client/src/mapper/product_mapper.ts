// apps/web-client/src/mapper/product_mapper.ts

/**
 * @fileoverview Mapeador y Transformador de DTOs del Backend hacia la UI (product_mapper.ts)
 * 
 * Transforma la estructura cruda retornada por FastAPI (SQLAlchemy 2.0) al modelo
 * estricto del frontend. Resuelve imágenes alojadas en Cloudflare R2 / CDN,
 * desempaqueta subcategorías tipadas con íconos y normaliza variantes de producto.
 * 
 * @module mapper/product_mapper
 */

import type { 
  ApiProduct, 
  ApiImage, 
  ProductoVariante,
  SubcategoriaItem,
} from '../types/product_types';

export const productMapper = {
  /**
   * Resuelve y valida la URL de una imagen.
   * Si la URL proviene de Cloudflare R2 o storage externo (https://...), la respeta.
   * Si es relativa local, antepone la ruta de fallback correspondiente.
   * 
   * @private
   * @param {any} rawImg - Nodo de imagen crudo del backend.
   * @returns {ApiImage} Objeto normalizado con ID y URL absoluta o fallback.
   */
  _formatImage(rawImg: any): ApiImage {
    if (!rawImg) {
      return { img_id: 0, img_url: '/tenant/producto_no_disponible.png' };
    }

    const rawUrl = String(rawImg.img_url || '');
    let finalUrl = rawUrl;

    // Si no es una URL absoluta de Cloudflare R2 / S3 / CDN
    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      finalUrl = `/static/productos/${rawUrl}`;
    }

    return {
      img_id: Number(rawImg.img_id || 0),
      img_url: finalUrl || '/tenant/producto_no_disponible.png',
    };
  },

  /**
   * Transforma un producto crudo del backend al modelo unificado del frontend.
   * 
   * @param {any} p - Objeto DTO del producto emitido por FastAPI.
   * @param {string} [catNombre='General'] - Nombre de la categoría asociada.
   * @param {number} [catId=0] - ID de la categoría asociada.
   * @returns {ApiProduct} Producto tipado listo para renderizar en UI.
   */
  toUI(p: any, catNombre: string = 'General', catId: number = 0): ApiProduct {
    /* =========================================================================
       1. RESOLUCIÓN DE IMÁGENES
       ========================================================================= */
    /* <!> CORRECCIÓN: El backend envía "rel_imagenes" (en plural con 'es').
       Antes solo buscaba "imagenes" y "rel_imagen_url", dejando rawImages siempre vacío ([]). */
    const rawImages = Array.isArray(p.rel_imagenes) 
      ? p.rel_imagenes 
      : Array.isArray(p.imagenes) 
        ? p.imagenes 
        : Array.isArray(p.rel_imagen_url) 
          ? p.rel_imagen_url 
          : [];
    
    // Identifica la imagen principal marcada como img_principal: true o toma la primera
    const principalData = rawImages.find((img: any) => img.img_principal === true) || rawImages[0];
    
    /* <!> Se asegura un fallback consistente invocando _formatImage incluso si no hay datos */
    const imagenPrincipal = this._formatImage(principalData);

    // Mapea las imágenes secundarias restantes
    const imagenesSecundarias: ApiImage[] = rawImages
      .filter((img: any) => img !== principalData)
      .map((img: any) => this._formatImage(img));

    /* =========================================================================
       2. RESOLUCIÓN DE VARIANTES CON PRECIOS ABSOLUTOS
       ========================================================================= */
    const rawVariantes = Array.isArray(p.variantes) 
      ? p.variantes 
      : Array.isArray(p.rel_variantes) 
        ? p.rel_variantes 
        : [];
    
    const variantesMapeadas: ProductoVariante[] = rawVariantes
      // Filtro defensivo: Si viene una variante inactiva u oculta, no entra a la UI pública
      .filter((v: any) => v.var_activo !== false && v.var_visible !== false)
      .map((v: any): ProductoVariante => ({
        var_id: Number(v.var_id),
        prod_id: Number(v.prod_id || p.prod_id),
        var_tipo: String(v.var_tipo || 'Presentación'),
        var_nombre: String(v.var_nombre || ''),
        var_precio_venta: Number(v.var_precio_venta ?? v.var_precio ?? p.prod_precio_venta ?? p.prod_precio ?? 0),
        var_stock: Number(v.var_stock ?? 0),
        var_sku: v.var_sku ? String(v.var_sku) : v.sku ? String(v.sku) : null,
        var_codigo_barra: v.var_codigo_barra ? String(v.var_codigo_barra) : null,
        var_disponible: Boolean(v.var_disponible ?? true),
        var_permitir_sin_stock: Boolean(v.var_permitir_sin_stock ?? false),
        color: v.color
          ? {
              col_id: Number(v.color.col_id),
              col_nombre: String(v.color.col_nombre),
              col_hex: String(v.color.col_hex),
            }
          : null,
      }));

    /* =========================================================================
       3. RESOLUCIÓN DE SUBCATEGORÍAS ANIDADAS (subcategorias[].subcategoria)
       ========================================================================= */
    const rawSubc = Array.isArray(p.subcategorias) 
      ? p.subcategorias 
      : Array.isArray(p.rel_subcategoria) 
        ? p.rel_subcategoria 
        : [];
    
    const subcategoriasMapeadas: SubcategoriaItem[] = rawSubc.map((item: any) => {
      // Desempaqueta la entidad real según el schema del backend
      const sub = item.subcategoria || item.rel_subcategoria || item;
      return {
        subc_id: Number(sub.subc_id || item.subc_id),
        subc_nombre: String(sub.subc_nombre || ''),
        subc_icono: sub.subc_icono || null,
        subc_imagen_url: sub.subc_imagen_url || null,
      };
    });

    /* =========================================================================
       4. MAPEO DEL OBJETO PRINCIPAL (PRODUCTO)
       ========================================================================= */
    const precioVentaFinal = Number(p.prod_precio_venta ?? p.prod_precio ?? 0);

    return {
      prod_id: Number(p.prod_id),
      prod_nombre: String(p.prod_nombre || ''),
      prod_descripcion: p.prod_descripcion ? String(p.prod_descripcion) : null,
      prod_precio_venta: precioVentaFinal,
      prod_stock: p.prod_stock !== null && p.prod_stock !== undefined ? Number(p.prod_stock) : null,
      cat_id: Number(p.cat_id || catId),
      cat_nombre: String(p.cat_nombre || catNombre),

      // Banderas comerciales maestras
      prod_solo_variantes: Boolean(p.prod_solo_variantes ?? false),
      prod_disponible: Boolean(p.prod_disponible ?? true),
      prod_per_sin_stock: Boolean(p.prod_per_sin_stock ?? false),

      // Multimedia y Relaciones
      imagen_principal_url: imagenPrincipal,
      imagenes_secundarias_url: imagenesSecundarias,
      subcategorias: subcategoriasMapeadas,
      variantes: variantesMapeadas,
    };
  },

  /**
   * Transforma una lista completa de productos crudos descartando registros ocultos.
   * 
   * @param {any[]} products - Array de productos del backend.
   * @param {string} catNombre - Nombre de la categoría padre.
   * @param {number} catId - ID de la categoría padre.
   * @returns {ApiProduct[]}
   */
  toUIList(products: any[], catNombre: string, catId: number): ApiProduct[] {
    if (!Array.isArray(products)) return [];
    return products
      // Guardia: Solo renderiza si no viene explícitamente apagado
      .filter((p) => p.prod_activo !== false && p.prod_visible !== false)
      .map((p) => this.toUI(p, catNombre, catId));
  },
};