/* --- apps/web-client/src/services/product.service.ts --- */
const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  /**
   * Petición pura al endpoint de productos agrupados.
   */
  async fetchProductosAgrupados() {
    const response = await fetch(`${API_URL}/productos/agrupados`);
    if (!response.ok) throw new Error('Error en la red'); // <!> esto deberia ir al log de errores para el bakend que quiero programar para monitoreo de erroes de frontend 
    return await response.json();
  },

  /**
   * Petición pura al endpoint de productos por categoría.
   */
  async fetchProductosPorCategoria(catId: number) {
    const response = await fetch(`${API_URL}/productos?cat_id=${catId}`);
    if (!response.ok) throw new Error('Error en la red'); 
    return await response.json();// <!> esto deberia ir al log de errores para el bakend que quiero programar para monitoreo de erroes de frontend 
  }
};



// <!> Version anterior creo que nuca la use 
// apps/web-client/src/services/product.service.ts 
// import type { ApiCategory } from '../types/product_types';

// const API_URL = import.meta.env.VITE_API_URL;

// export const productService = {
//   /**
//    * Obtiene el catálogo completo agrupado por categorías
//    * <!> Este método centraliza la llamada a /productos
//    */
//   async getCatalog(): Promise<ApiCategory[]> {
//     try {

    // ! <!> Tengo la siguiete duda no wes mejor capturar el error y mandrlo por consola 
//       const response = await fetch(`${API_URL}/productos`);
//       if (!response.ok) throw new Error('Error al conectar con el servidor');
//       return await response.json();
//     } catch (error) {
//       console.error("Error en productService.getCatalog:", error);
//       throw error;
//     }
//   },

//   /**
//    * Podrás agregar más métodos aquí, por ejemplo:
//    * getProductById, getProductsByCategory, etc.
//    */
// };