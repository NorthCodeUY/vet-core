
/* =============================================================================
   CAPA DE SERVICIOS: PRODUCT SERVICE (HTTP CLIENT)
   Ruta: apps/web-client/src/services/product_service.ts
   Descripción: Servicio puro de consumo HTTP para el catálogo de productos.
                Conecta con la API REST de FastAPI y centraliza la telemetría de errores.
   ============================================================================= */

// -----------------------------------------------------------------------------
// 1. Tipos e Infraestructura
// -----------------------------------------------------------------------------
import { logErrorToBackend } from './logger';
import type { ApiCategory, ApiProduct } from '../types/product_types';

// -----------------------------------------------------------------------------
// 2. Constantes de Enrutamiento
// -----------------------------------------------------------------------------
/** Prefijo base para las rutas del catálogo en FastAPI */
const API_BASE = '/api/productos';

// -----------------------------------------------------------------------------
// 3. Objeto de Servicio
// -----------------------------------------------------------------------------
export const productService = {
  /**
   * Petición pura al endpoint de productos agrupados por categoría.
   * Utilizado en la carga inicial de la Landing Page para renderizar la vitrina principal.
   * 
   * @async
   * @function fetchProductosAgrupados
   * @returns {Promise<ApiCategory[]>} Lista de categorías con sus productos anidados.
   * @throws {Error} Propaga el error a la capa superior tras reportarlo al log.
   */
  async fetchProductosAgrupados(): Promise<ApiCategory[]> { 
    const endpoint = `${API_BASE}/agrupados`;

    try {
      /* 1. Solicitud HTTP asíncrona al backend */
      const response = await fetch(endpoint);

      /* 2. Validación de código de estado (200-299) */
      if (!response.ok) {
        throw new Error(`Error en la red [${response.status}]: ${response.statusText}`);
      }

      /* 3. Deserialización y casteo al contrato real ApiCategory[] */
      return (await response.json()) as ApiCategory[];
    } catch (error) {
      /* 4. Telemetría centralizada de errores hacia el backend */
      await logErrorToBackend(error, endpoint);

      /* 5. Propagación para que el hook maneje su estado de error */
      throw error;
    }
  },

  /**
   * Petición al endpoint de catálogo filtrado por categoría específica.
   * Resuelve la carga completa bajo demanda (Lazy Loading) al pulsar "Ver más".
   * 
   * @async
   * @function fetchProductosPorCategoria
   * @param {number} catId - ID de la categoría a consultar.
   * @returns {Promise<ApiProduct[]>} Lista completa de productos de la categoría.
   * @throws {Error} Propaga el error tras despacharlo a la telemetría del backend.
   */
  async fetchProductosPorCategoria(catId: number): Promise<ApiProduct[]> {
    /* <!> CORRECCIÓN: Se apunta al endpoint real de FastAPI (/filtrados) en lugar de la raíz */
    const endpoint = `${API_BASE}/filtrados?cat_id=${catId}`;

    try {
      /* 1. Solicitud con query param de categoría */
      const response = await fetch(endpoint);

      /* 2. Validación de respuesta del servidor */
      if (!response.ok) {
        throw new Error(`Error en la red [${response.status}]: ${response.statusText}`);
      }

      /* 3. Retorno tipado con la interfaz real ApiProduct[] */
      return (await response.json()) as ApiProduct[];
    } catch (error) {
      /* 4. Reporte centralizado de errores de frontend hacia el backend */
      await logErrorToBackend(error, endpoint);

      /* 5. Propagación del error hacia el hook consumidor */
      throw error;
    }
  },

  /**
   * <!> NUEVO MÉTODO: Consulta al buscador público del backend con soporte multicriterio.
   * Permite filtrar concurrentemente por término de texto, categoría y subcategoría.
   * 
   * @async
   * @function fetchProductosFiltrados
   * @param {Object} params - Criterios opcionales de búsqueda.
   * @param {string} [params.search] - Texto a buscar (nombre, descripción, sku).
   * @param {number} [params.catId] - ID opcional de categoría para acotar el resultado.
   * @param {number} [params.subcId] - ID opcional de subcategoría (especie, tag).
   * @returns {Promise<ApiProduct[]>} Colección de productos coincidentes desde el servidor.
   * @throws {Error} Propaga el error tras loguearlo en el colector de incidentes.
   */
  async fetchProductosFiltrados(params: {
    search?: string;
    catId?: number;
    subcId?: number;
  }): Promise<ApiProduct[]> {
    /* 1. Construcción dinámica de parámetros de búsqueda */
    const query = new URLSearchParams();

    if (params.search?.trim()) {
      query.append('search', params.search.trim());
    }
    if (params.catId) {
      query.append('cat_id', params.catId.toString());
    }
    if (params.subcId) {
      query.append('subc_id', params.subcId.toString());
    }

    const queryString = query.toString();
    const endpoint = `${API_BASE}/filtrados${queryString ? `?${queryString}` : ''}`;

    try {
      /* 2. Ejecución de la solicitud HTTP */
      const response = await fetch(endpoint);

      /* 3. Validación de estado HTTP */
      if (!response.ok) {
        throw new Error(`Error en búsqueda [${response.status}]: ${response.statusText}`);
      }

      /* 4. Retorno de productos coincidentes */
      return (await response.json()) as ApiProduct[];
    } catch (error) {
      /* 5. Reporte de fallo en búsqueda hacia la telemetría */
      await logErrorToBackend(error, endpoint);
      throw error;
    }
  }
};