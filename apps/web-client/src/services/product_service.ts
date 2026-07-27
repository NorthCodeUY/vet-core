/* --- apps/web-client/src/services/product.service.ts --- */

// const API_URL = import.meta.env.DEV 
//   ? `http://${window.location.hostname}:8000/api` // Detecta automáticamente la IP de tu PC
//   : import.meta.env.VITE_API_URL; // Usa la del .env en producción

const API_BASE = '/api/productos';


import { logErrorToBackend } from './logger';

export const productService = {
  /**
   * Petición pura al endpoint de productos agrupados.
   */
  async fetchProductosAgrupados() { //<!> Esta vesriosn lo que quiero es que me traiga si es local en una ip de la red para probar con el celular o lo que tenga a mano 
  try {
    const response = await fetch(`${API_BASE}/agrupados`);
    if (!response.ok) throw new Error('Error en la red');//  <!> Esto tendria que unirlo al log de errores  para mandarlo al bakend 
    return await response.json();
  } catch (error) {
    await logErrorToBackend(error, `${API_BASE}/productos/agrupados`);
    throw error; // Lanzamos el error para que la UI lo maneje
  }
},



  /**
   * Petición pura al endpoint de productos por categoría.
   */
  async fetchProductosPorCategoria(catId: number) {
    const response = await fetch(`${API_BASE}?cat_id=${catId}`);
    if (!response.ok) throw new Error('Error en la red'); 
    return await response.json();// <!> esto deberia ir al log de errores para el bakend que quiero programar para monitoreo de erroes de frontend 
  }
};



