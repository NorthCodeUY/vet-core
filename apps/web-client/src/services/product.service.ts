// apps/web-client/src/services/product.service.ts 
import type { ApiCategory } from '../types/product_types';

const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  /**
   * Obtiene el catálogo completo agrupado por categorías
   * <!> Este método centraliza la llamada a /productos
   */
  async getCatalog(): Promise<ApiCategory[]> {
    try {
      const response = await fetch(`${API_URL}/productos`);
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      return await response.json();
    } catch (error) {
      console.error("Error en productService.getCatalog:", error);
      throw error;
    }
  },

  /**
   * Podrás agregar más métodos aquí, por ejemplo:
   * getProductById, getProductsByCategory, etc.
   */
};