/* --- apps/web-client/src/mappers/product_mapper.ts --- */
import type { ApiProduct, ApiImageProducto } from '../types/product_types';

/**
 * Transforma un producto crudo del Backend al formato ApiProduct del Frontend.
 */
export const productMapper = {

  /**
   * Helper interno para formatear el objeto de imagen.
   * Centraliza la construcción de la ruta relativa.
   */
  _formatImage(rawImg: any): ApiImageProducto {
    return {
      img_id: rawImg.img_id, // Fallback al ID del producto si no hay ID de imagen
      /* 
         RUTAS RELATIVAS: 
         No necesitamos la URL del archivo de configuración. 
         Al empezar con '/', el navegador busca automáticamente en el dominio actual.
         El 'proxy' de vite.config.ts solo actúa como un "desviador" en desarrollo.
      */
      img_url: rawImg.img_url ? `/static/productos/${rawImg.img_url}` : ''
    };
  },


  /**
   * Transforma un producto crudo del Backend al formato ApiProduct del Frontend.
   * @param p - Producto crudo del Backend 
   * @param catNombre - Nombre de la categoría 
   * @param catId - ID de la categoría 
   * @returns Producto transformado 
   */
  toUI(p: any, catNombre: string, catId: number): ApiProduct {

    /* Procesamos la lista de imágenes una sola vez para optimizar */
    const rawImages = p.rel_imagen_url || [];
    
    /* Identificamos la imagen principal */
    const principalData = rawImages.find((img: any) => img.img_principal) || rawImages[0];
    
    /* Construimos la instancia de imagen principal (puede ser null si no hay datos) */ //<!> Cambiarlo cuando modifique el bakend  
    const imagenPrincipal = principalData ? this._formatImage(principalData) : null;

    /* Filtramos y mapeamos las secundarias en un solo paso */
    const imagenesSecundarias = rawImages
      .filter((img: any) => img !== principalData) // Excluimos la que ya elegimos como principal
      .map((img: any) => this._formatImage(img));


    /* Ahora sí, retornamos el objeto estructurado limpiamente */
    return {
      prod_id: p.prod_id, // Id del producto 
      prod_nombre: p.prod_nombre, // Nombre del producto 
      prod_precio: p.prod_precio, // Precio del producto 
      prod_descripcion: p.prod_descripcion, // Descripción del producto 
      cat_nombre: catNombre, // Nombre de la categoría 
      cat_id: catId, // Id de la categoría
      imagen_principal_url: imagenPrincipal,

      /* Lista de imagenes secundarias */
      imagenes_secundarias_url: imagenesSecundarias,

      /* Mapeamos las subcategorías de forma segura */
      subcategoria: p.rel_subcategoria?.map((sub: any) => ({ subc_nombre: sub.subc_nombre })) || []
    };
  },

  /**
   * Transforma una lista de productos crudos.
   * @param products - Array de productos crudos 
   * @param catNombre - Nombre de la categoría 
   * @param catId - ID de la categoría 
   * @returns Array de productos transformados 
   */
  toUIList(products: any[], catNombre: string, catId: number): ApiProduct[] { //<!>  esto medescoserta un poc para que uso estosi tenog toUI(p: any, catNombre: string, catId: number): ApiProduct {
    return products.map(p => this.toUI(p, catNombre, catId));
  }
};

// Json Esperado 

// [
//     {
//         "cat_nombre": "Accesorios",
//         "cat_id": 1,
//         "productos": [
//             {
//                 "prod_id": 1,
//                 "prod_nombre": "Durapets Bandeja",
//                 "prod_precio": 308.0,
//                 "prod_descripcion": "Kit Bandeja, pala y plato",
//                 "cat_id": 1,
//                 "rel_imagen_url": [
//                     {
//                         "img_url": "3.png",
//                         "img_principal": true
//                     }
//                 ],
//                 "rel_subcategoria": [
//                     {
//                         "subc_nombre": "Gato"
//                     }
//                 ]
//             },
//             {
//                 "prod_id": 2,
//                 "prod_nombre": "Baño cerrado ",
//                 "prod_precio": 690.0,
//                 "prod_descripcion": "Baño cerrado (56x40x40cm) +pala",
//                 "cat_id": 1,
//                 "rel_imagen_url": [
//                     {
//                         "img_url": "2.png",
//                         "img_principal": true
//                     }
//                 ],
//                 "rel_subcategoria": [
//                     {
//                         "subc_nombre": "Gato"
//                     }
//                 ]
//             },