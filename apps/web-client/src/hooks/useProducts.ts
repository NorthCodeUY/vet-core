/**
 * @fileoverview Hook de Negocio y Fachada para Catálogo de Productos (useProducts.ts)
 * 
 * Gestiona la carga asíncrona del catálogo categorizado desde FastAPI, la persistencia
 * bidireccional del carrito en los parámetros de búsqueda de la URL (Deep Linking)
 * y el filtrado reactivo en memoria para el buscador de la Landing Page.
 * 
 * @module hooks/useProducts
 */

import { useState, useEffect, useMemo } from 'react';

// --- Capa de Servicios e Infraestructura HTTP ---
import { productService } from '../services/product_service';
import { productMapper } from '../mapper/product_mapper';

// --- Estado Global de la Aplicación ---
import { usePedidoStore } from '../context/pedido_context';
import { useConfig } from '../context/tenant_context';

// --- Contratos de Dominio ---
import type { ApiCategory, ApiProduct } from '../types/product_types';
import type { PedidoItem } from '../types/pedido_types';

/**
 * Hook orquestador del catálogo y sincronización de compras (`useProducts`).
 *
 * @returns {{
 *   searchTerm: string,
 *   setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
 *   categories: ApiCategory[],
 *   loading: boolean,
 *   filteredResults: ApiProduct[] | null
 * }}
 */
export const useProducts = () => {
  /* ===========================================================================
     1. ESTADOS LOCALES Y DEPENDENCIAS GLOBALES
     =========================================================================== */
  const { config } = useConfig();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { pedido, loadPedidoMasivo } = usePedidoStore();
  
  // Bandera de control para evitar que el efecto de escritura sobreescriba la URL antes de leerla
  const [isRehydrated, setIsRehydrated] = useState<boolean>(false);

  /* ===========================================================================
     2. LÓGICA A: PERSISTENCIA DEL CARRITO EN LA URL (Shareable Links)
     Serializa el carrito en formato compacto (ej: "?cart=1:2,45_102:1") en el historial.
     =========================================================================== */
  useEffect(() => {
    // Si no se completó la rehidratación inicial, bloqueamos la sincronización hacia la URL
    if (!isRehydrated) return;

    if (pedido.length === 0) {
      // Limpia el query param si el carrito quedó vacío
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, '', cleanPath);
      return;
    }

    // Serialización compacta de ítems con clave única y cantidad
    const cartParamValue = pedido
      .map((item) => `${item.producto.prod_id}:${item.cantidad}`)
      .join(',');

    const updatedUrl = `${window.location.pathname}?cart=${cartParamValue}`;
    window.history.replaceState({}, '', updatedUrl);
  }, [pedido, isRehydrated]);

  /* ===========================================================================
     3. LÓGICA B: REHIDRATACIÓN DESDE LA URL (Deep Linking al Iniciar)
     Reconstruye el pedido si un usuario abre un enlace compartido con "?cart=..."
     =========================================================================== */
  useEffect(() => {
    // Solo rehidrata una vez que las categorías bajaron de la API y no fue procesado aún
    if (categories.length > 0 && !isRehydrated) {
      const urlParams = new URLSearchParams(window.location.search);
      const cartQuery = urlParams.get('cart');

      if (cartQuery) {
        const allProducts = categories.flatMap((cat) => cat.productos);
        const lineasRehidratadas: PedidoItem[] = [];

        cartQuery.split(',').forEach((pair) => {
          const [id, qty] = pair.split(':').map(Number);
          const productoEncontrado = allProducts.find((p) => p.prod_id === id);

          if (productoEncontrado && qty > 0) {
            /* =================================================================
               <!> CORRECCIÓN CRÍTICA DE TYPESCRIPT:
               Se inyecta 'item_key' obligatorio para respetar el nuevo contrato
               de PedidoItem que soporta variantes y transacciones independientes.
               ================================================================= */
            lineasRehidratadas.push({
              item_key: `${productoEncontrado.prod_id}_base`,
              producto: productoEncontrado,
              cantidad: qty,
              precio_unitario_capturado: productoEncontrado.prod_precio,
            });
          }
        });

        if (lineasRehidratadas.length > 0) {
          loadPedidoMasivo(lineasRehidratadas);
        }
      }

      // Habilitamos la escritura en la URL a partir de este momento
      setIsRehydrated(true);
    }
  }, [categories, isRehydrated, loadPedidoMasivo]);

  /* ===========================================================================
     4. LÓGICA C: CONSUMO DE LA API REST (Catálogo Agrupado)
     =========================================================================== */
  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      // Guardia de seguridad: Si el cliente apaga el catálogo, omitimos la llamada HTTP
      if (config?.features?.has_products === false) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const rawData = await productService.fetchProductosAgrupados();
        
        if (isMounted) {
          const transformed: ApiCategory[] = rawData.map((cat: any) => ({
            cat_id: Number(cat.cat_id),
            cat_nombre: String(cat.cat_nombre || 'General'),
            productos: productMapper.toUIList(cat.productos || [], cat.cat_nombre, cat.cat_id),
          }));

          setCategories(transformed);
        }
      } catch (error) {
        console.error('[useProducts] Error al consultar catálogo agrupado:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [config]);

  /* ===========================================================================
     5. LÓGICA D: BUSCADOR REACTIVO EN MEMORIA (useMemo Caché)
     =========================================================================== */
  const filteredResults = useMemo((): ApiProduct[] | null => {
    if (!searchTerm.trim()) return null;

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const allProducts = categories.flatMap((cat) => cat.productos);

    return allProducts.filter((p) => {
      const matchName = p.prod_nombre.toLowerCase().includes(normalizedTerm);
      const matchDesc = p.prod_descripcion.toLowerCase().includes(normalizedTerm);
      // Búsqueda en subcategorías tipadas
      const matchSub = p.subcategorias?.some((sub) =>
        sub.subc_nombre.toLowerCase().includes(normalizedTerm)
      );

      return matchName || matchDesc || matchSub;
    });
  }, [searchTerm, categories]);

  return {
    searchTerm,
    setSearchTerm,
    categories,
    loading,
    filteredResults,
  };
};

/**
 * Hook secundario para carga bajo demanda de productos por categoría individual.
 *
 * @param {number} catId - ID de la categoría a consultar.
 * @param {ApiProduct[]} initialData - Datos precargados en memoria.
 * @param {string} title - Nombre de la categoría padre.
 * @returns {{
 *   products: ApiProduct[],
 *   isExpanded: boolean,
 *   toggleExpand: () => Promise<void>
 * }}
 */
export const useCategoryProducts = (catId: number, initialData: ApiProduct[], title: string) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [products, setProducts] = useState<ApiProduct[]>(initialData);
  const [hasLoadedFull, setHasLoadedFull] = useState<boolean>(false);

  const toggleExpand = async (): Promise<void> => {
    // Si se expande y aún no se descargó la lista completa de la categoría
    if (!isExpanded && !hasLoadedFull) {
      try {
        const rawData = await productService.fetchProductosPorCategoria(catId);
        const mapped = productMapper.toUIList(rawData, title, catId);
        setProducts(mapped);
        setHasLoadedFull(true);
      } catch (error) {
        console.error(`[useCategoryProducts] Error cargando categoría ${catId}:`, error);
      }
    }
    setIsExpanded((prev) => !prev);
  };

  return {
    products,
    isExpanded,
    toggleExpand,
  };
};