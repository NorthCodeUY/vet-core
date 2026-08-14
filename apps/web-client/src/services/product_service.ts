/* --- apps/web-client/src/services/product_service.ts --- */

const API_BASE = '/api/productos';


import { logErrorToBackend } from './logger';

export const productService = {
  /**
   * Petición pura al endpoint de productos agrupados.
   */
  async fetchProductosAgrupados() { 
  try {
    const response = await fetch(`${API_BASE}/agrupados`);
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
  } catch (error) {
    await logErrorToBackend(error, `${API_BASE}/productos/agrupados`);
    throw error; // <!> Esto deberia ir allog de errores 
  }
},



  /**
   * Petición pura al endpoint de productos por categoría.
   */
  async fetchProductosPorCategoria(catId: number) {
    const response = await fetch(`${API_BASE}?cat_id=${catId}`);
    if (!response.ok) throw new Error('Error en la red');  // <!> esto deberia ir al log de errores para el bakend que quiero programar para monitoreo de erroes de frontend 
    return await response.json();
  }
};



