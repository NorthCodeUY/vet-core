/* =============================================================================
   CAPA DE SERVICIOS: PRODUCT SERVICE (HTTP CLIENT)
   Ruta: apps/web-client/src/services/product_service.ts
   Descripción: Servicio puro de consumo HTTP para el catálogo de productos.
                Conecta con la API REST y centraliza la telemetría de errores.
   ============================================================================= */

// -----------------------------------------------------------------------------
// 1. Tipos e Infraestructura
// -----------------------------------------------------------------------------
import { logErrorToBackend } from './logger';
/* <!> Tipos reales importados directamente desde tu archivo product_types.ts */
import type { ApiCategory, ApiProduct } from '../types/product_types';

// -----------------------------------------------------------------------------
// 2. Constantes de Enrutamiento
// -----------------------------------------------------------------------------
const API_BASE = '/api/productos';

// -----------------------------------------------------------------------------
// 3. Objeto de Servicio
// -----------------------------------------------------------------------------
export const productService = {
  /**
   * Petición pura al endpoint de productos agrupados por categoría.
   * 
   * @async
   * @function fetchProductosAgrupados
   * @returns {Promise<ApiCategory[]>} Lista de categorías con sus productos anidados.
   * @throws {Error} Propaga el error a la capa superior tras reportarlo al log.
   */
  async fetchProductosAgrupados(): Promise<ApiCategory[]> { 
    /* <!> URL unificada en variable para evitar desincronización entre fetch y logger */
    const endpoint = `${API_BASE}/agrupados`;

    try {
      /* 1. Solicitud HTTP al backend */
      const response = await fetch(endpoint);

      /* 2. Validación de código de estado (200-299) */
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
      }

      /* 3. Deserialización y casteo al contrato real ApiCategory[] */
      return (await response.json()) as ApiCategory[];
    } catch (error) {
      /* <!> Corrección de ruta en el log: antes enviaba "/api/productos/productos/agrupados" */
      await logErrorToBackend(error, endpoint);

      /* 4. Propagación para que el hook maneje su estado de error */
      throw error;
    }
  },

  /**
   * Petición pura al endpoint de productos filtrados por una categoría específica.
   * 
   * @async
   * @function fetchProductosPorCategoria
   * @param {number} catId - ID de la categoría a consultar.
   * @returns {Promise<ApiProduct[]>} Lista plana de productos de la categoría.
   * @throws {Error} Propaga el error tras despacharlo a la telemetría del backend.
   */
  async fetchProductosPorCategoria(catId: number): Promise<ApiProduct[]> {
    const endpoint = `${API_BASE}?cat_id=${catId}`;

    /* <!> Se añade try/catch para enviar el fallo a logErrorToBackend antes de lanzar el error */
    try {
      /* 1. Solicitud con parámetro de búsqueda */
      const response = await fetch(endpoint);

      /* 2. Validación de respuesta del servidor */
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
      }

      /* 3. Retorno tipado con la interfaz real ApiProduct[] */
      return (await response.json()) as ApiProduct[];
    } catch (error) {
      /* 4. Reporte centralizado de errores de frontend hacia el backend */
      await logErrorToBackend(error, endpoint);

      /* 5. Propagación del error */
      throw error;
    }
  }
};