/**
 * @fileoverview Hook de Negocio y Fachada para Catálogo de Productos (useProducts.ts)
 * 
 * Centraliza las 4 operaciones nucleares del catálogo en la Landing Page:
 * 1. Consumo asíncrono de la API REST (FastAPI) con control de clientes sin backend.
 * 2. Deep Linking / Persistencia bidireccional del carrito en la URL (?cart=id_var:cant).
 * 3. Rehidratación segura al cargar enlaces compartidos (sin errores de NaN).
 * 4. Motor de búsqueda reactivo multicampo en memoria (nombre, descripción y tags de subcategoría).
 * 
 * @module hooks/useProducts
 */

import { useState, useEffect, useMemo } from 'react';

// --- Infraestructura HTTP y Mappers ---
import { productService } from '../services/product_service';
import { productMapper } from '../mapper/product_mapper';

// --- Estado Global y Configuración ---
import { usePedidoStore } from '../context/pedido_context';
import { useConfig } from '../context/tenant_context';

// --- Contratos de Dominio ---
import type { ApiCategory, ApiProduct, ProductoVariante } from '../types/product_types';
import type { PedidoItem } from '../types/pedido_types';

/**
 * Hook principal de fachada para productos y buscador (`useProducts`).
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
     1. ESTADOS LOCALES Y DEPENDENCIAS
     =========================================================================== */
  const { config } = useConfig();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { pedido, loadPedidoMasivo } = usePedidoStore();

  // Bandera que bloquea la escritura en la URL hasta que se complete la lectura inicial
  const [isRehydrated, setIsRehydrated] = useState<boolean>(false);

  /* ===========================================================================
     2. LÓGICA A: PERSISTENCIA DEL CARRITO EN LA URL (Deep Linking Serializer)
     Convierte el estado del carrito en un parámetro compartible (ej: ?cart=3_1:2,2_base:1).
     =========================================================================== */
  useEffect(() => {
    // Si no se procesó la URL de entrada, evitamos pisarla en blanco
    if (!isRehydrated) return;

    if (pedido.length === 0) {
      // Si el carrito se vació, limpiamos los query params sin recargar la página
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, '', cleanPath);
      return;
    }

    // <!> Serialización con soporte de variantes (prodId_varId:cantidad)
    const cartParamValue = pedido
      .map((item) => {
        const varId = item.variante_seleccionada?.var_id || 'base';
        return `${item.producto.prod_id}_${varId}:${item.cantidad}`;
      })
      .join(',');

    const updatedUrl = `${window.location.pathname}?cart=${cartParamValue}`;
    window.history.replaceState({}, '', updatedUrl);
  }, [pedido, isRehydrated]);

  /* ===========================================================================
     3. LÓGICA B: REHIDRATACIÓN AL INICIAR (Deep Linking Parser)
     Reconstruye el pedido completo (con talle y precio real) si el usuario abre un enlace compartido.
     =========================================================================== */
  useEffect(() => {
    // Solo se ejecuta una vez cuando las categorías ya bajaron del backend
    if (categories.length > 0 && !isRehydrated) {
      const urlParams = new URLSearchParams(window.location.search);
      const cartQuery = urlParams.get('cart');

      if (cartQuery) {
        const allProducts = categories.flatMap((cat) => cat.productos);
        const lineasRehidratadas: PedidoItem[] = [];

        cartQuery.split(',').forEach((pair) => {
          const [keyPart, qtyStr] = pair.split(':');
          const qty = Number(qtyStr) || 1;

          if (!keyPart) return;

          // Soporte tanto para formato moderno (3_1 o 3_base) como legado (3)
          let prodId: number;
          let varId: number | null = null;

          if (keyPart.includes('_')) {
            const [pId, vId] = keyPart.split('_');
            prodId = Number(pId);
            varId = vId !== 'base' ? Number(vId) : null;
          } else {
            prodId = Number(keyPart);
          }

          const productoEncontrado = allProducts.find((p) => p.prod_id === prodId);

          if (productoEncontrado && qty > 0) {
            // Resolución de variante
            const varianteEncontrada: ProductoVariante | undefined = varId
              ? productoEncontrado.variantes?.find((v) => v.var_id === varId)
              : undefined;

            /* =================================================================
               <!> RESOLUCIÓN DEFENSIVA DE PRECIO (ANTI-NaN):
               Prioriza el precio absoluto de la variante, luego prod_precio_venta.
               ================================================================= */
            const precioCapturado = varianteEncontrada
              ? Number(varianteEncontrada.var_precio_venta)
              : Number(productoEncontrado.prod_precio_venta ?? (productoEncontrado as any).prod_precio ?? 0);

            const itemKey = varId ? `${prodId}_${varId}` : `${prodId}_base`;

            lineasRehidratadas.push({
              item_key: itemKey,
              producto: productoEncontrado,
              variante_seleccionada: varianteEncontrada,
              cantidad: qty,
              precio_unitario_capturado: isNaN(precioCapturado) ? 0 : precioCapturado,
            });
          }
        });

        if (lineasRehidratadas.length > 0) {
          loadPedidoMasivo(lineasRehidratadas);
        }
      }

      // Habilitamos la sincronización de salida
      setIsRehydrated(true);
    }
  }, [categories, isRehydrated, loadPedidoMasivo]);

  /* ===========================================================================
     4. LÓGICA C: CONSUMO DE LA API REST (FastAPI)
     Descarga y mapea el catálogo agrupado respetando los flags del tenant.
     =========================================================================== */
  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      // Si el cliente apaga el catálogo o no tiene backend, cortamos sin disparar errores
      if (config?.features?.has_products === false || (config?.features as any)?.has_backend === false) {
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
     5. LÓGICA D: BUSCADOR REACTIVO EN MEMORIA (Faceted Search Cache)
     Filtra en tiempo real por título, descripción y nombres de subcategoría.
     =========================================================================== */
  const filteredResults = useMemo((): ApiProduct[] | null => {
    if (!searchTerm.trim()) return null;

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const allProducts = categories.flatMap((cat) => cat.productos);

    return allProducts.filter((p) => {
      const matchName = p.prod_nombre.toLowerCase().includes(normalizedTerm);
      const matchDesc = p.prod_descripcion ? p.prod_descripcion.toLowerCase().includes(normalizedTerm) : false;

      // <!> Búsqueda robusta en subcategorías (soporta objetos planos o anidados)
      const matchSub = p.subcategorias?.some((subItem: any) => {
        const name = subItem.subcategoria?.subc_nombre || subItem.subc_nombre || '';
        return name.toLowerCase().includes(normalizedTerm);
      });

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
 * Hook secundario para carga bajo demanda (Lazy Loading) de productos por categoría.
 *
 * @param {number} catId - ID de la categoría a consultar.
 * @param {ApiProduct[]} initialData - Datos iniciales precargados.
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