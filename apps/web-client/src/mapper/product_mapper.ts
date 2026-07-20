/* --- apps/web-client/src/mappers/product_mapper.ts --- */
import type { ApiProduct, ApiImageProducto } from '../types/product_types';

/**
 * Transforma un producto crudo del Backend al formato ApiProduct del Frontend.
 */
export const productMapper = {

  /**
   * Transforma un producto crudo del Backend al formato ApiProduct del Frontend.
   * @param p - Producto crudo del Backend 
   * @param catNombre - Nombre de la categoría 
   * @param catId - ID de la categoría 
   * @returns Producto transformado 
   */
  toUI(p: any, catNombre: string, catId: number): ApiProduct {
    /* 1. Calculamos la imagen principal primero (y corregimos el typo de ipmg -> img) */
    const mainImage: ApiImageProducto = p.rel_imagen_url?.find((img: any) => img.img_principal) // Recorro el array de imagenes y filtro las que no son principales 
                                       || p.rel_imagen_url?.[0] // Si no hay imagen principal toma la primera imagen 
                                       || { img_url: '/images/placeholder.png', img_id: 0 }; // Si no hay ninguna imagen toma la imagen por defecto 

    /* 2. Ahora sí, retornamos el objeto estructurado limpiamente */
    return {
      prod_id: p.prod_id, // Id del producto 
      prod_nombre: p.prod_nombre, // Nombre del producto 
      prod_precio: p.prod_precio, // Precio del producto 
      prod_descripcion: p.prod_descripcion, // Descripción del producto 
      cat_nombre: catNombre, // Nombre de la categoría 
      cat_id: catId, // Id de la categoría
      imagen_principal_url: mainImage,

      /* Filtramos las que no son principales (agregamos ?. por si las moscas si viene null) */
      imagenes_secundarias_url: p.rel_imagen_url?.filter ((img: any) => // Recorro el array de imagenes y filtro las que no son principales 
                                                                !img.img_principal) // Si no es la imagen principal la agrego al array de imagenes secundarias 
                                                                || [], // Si no hay ninguna imagen secundaria la devuelvo como un array vacio 
      
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

// Array de emeplo que voy a esplorar 
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
//                         "img_url": "/static/productos/3.png",
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
//                         "img_url": "/static/productos/2.png",
//                         "img_principal": true
//                     }
//                 ],
//                 "rel_subcategoria": [
//                     {
//                         "subc_nombre": "Gato"
//                     }
//                 ]
//             },
