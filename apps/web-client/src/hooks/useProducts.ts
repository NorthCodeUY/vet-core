/* --- apps/web-client/src/hooks/useProducts.ts --- */
import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/product_service';
import { usePedidoStore } from '../context/pedido_context';
import { productMapper } from '../mapper/product_mapper';
import type { ApiCategory, ApiProduct } from '../types/product_types';
import type { PedidoItem } from '../types/pedido_types';

/**
 * Hook para manejar el estado global de los productos
 */
export const useProducts = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Guardo el termino de busqueda
  const [categories, setCategories] = useState<ApiCategory[]>([]); // Guardo las categorias 
  const [loading, setLoading] = useState(true); // Guardo el estado de carga 

  const { pedido, loadPedidoMasivo } = usePedidoStore();
  
  
  const [isRehydrated, setIsRehydrated] = useState(false); // <!> Nuevo: Control de carga





  /* --- LÓGICA A: Se utiliza para que cuando se altera el carrito guarda la info en la URL --- */
  useEffect(() => {

    // <!> FIX: Si no hemos procesado la URL inicial, no permitimos que este efecto limpie la URL
    if (!isRehydrated) return; 
    
    if (pedido.length === 0) {
      /* Si el carrito está vacío, limpiamos el parámetro de la URL */
      const newUrl = window.location.pathname; // Tomamos la ruta actual
      window.history.replaceState({}, '', newUrl); // Reemplaza el estado actual del historial sin recargar la pagina
      return;
    }

    /* Convertimos el array [ {id:1, cant:2}, {id:29, cant:1} ] en "1:2,29:1" */
    const cartString = pedido // Recorro el array de productos 
      .map(item => `${item.producto.prod_id}:${item.cantidad}`) // Recorro el array de productos 
      .join(','); // Convierto el array en un string 

    const newUrl = `${window.location.pathname}?cart=${cartString}`;// Tomamos la ruta actual y le sumamos el string del carrito 
    /* replaceState actualiza la URL en la barra de direcciones sin recargar la página */
    window.history.replaceState({}, '', newUrl);
  }, [pedido, isRehydrated]); // Agregamos isRehydrated como dependencia




  /* --- LÓGICA B: REHIDRATACIÓN (Leer URL al iniciar) --- */
  useEffect(() => {
    /* Solo actuamos cuando las categorías ya bajaron del backend */
    if (categories.length > 0 && !isRehydrated) {
      const params = new URLSearchParams(window.location.search);
      const cartParam = params.get('cart');

      if (cartParam) {
        const allProducts = categories.flatMap(cat => cat.productos);
        const lineasRehidratadas: PedidoItem[] = [];

        cartParam.split(',').forEach(pair => {
          const [id, qty] = pair.split(':').map(Number);
          const productoEncontrado = allProducts.find(p => p.prod_id === id);

          if (productoEncontrado) {
            lineasRehidratadas.push({
              producto: productoEncontrado,
              cantidad: qty,
              precio_unitario_capturado: productoEncontrado.prod_precio
            });
          }
        });

        if (lineasRehidratadas.length > 0) {
          loadPedidoMasivo(lineasRehidratadas);
        }
      }

      /* 
         <!> FIX CRÍTICO: 
         Esta línea debe estar FUERA del 'if (cartParam)'.
         Dice: "Ya revisé la URL, ahora el sistema puede empezar a escribir".
      */
      setIsRehydrated(true); 
    }
  }, [categories, isRehydrated]);

  /* Carga inicial se utiliza cuando iniciamos el frontend para traer los datos de el bakend */ 
  useEffect(() => {// Se ejecuta solo una vez cuando el componente se monta
    const loadData = async () => { // Funcion asincrona que se encarga de cargar los datos iniciales y mapearlos
      try {
        const rawData = await productService.fetchProductosAgrupados(); // Llamo al endpoint de productos agrupados
        const transformed = rawData.map((cat: any) => ({// Recorro el array de categorias 
          cat_id: cat.cat_id, // ID de la categoria en base de datos 
          cat_nombre: cat.cat_nombre, // Nombre de la categoria 
          productos: productMapper.toUIList(cat.productos, cat.cat_nombre, cat.cat_id) // Mapeo los productos de la categoria 
        }));
        setCategories(transformed); // Actualizo el estado de las categorias 
      } catch (error) {
        console.error("Error:", error); // <!> Agregar a  log para mandar al bakend 
      } finally {
        setLoading(false); // Actualizo el estado de carga 
      }
    };
    
    loadData(); // llamo a la funcion loadData dearria
  }, []);



  /* Lógica de filtrado (useMemo actúa como caché) */
  const filteredResults = useMemo(() => { // Se ejecuta solo cuando el searchTerm o las categorias cambian 
    if (!searchTerm) return null; // Si no hay termino de busqueda retorno null
    const allProducts = categories.flatMap(cat => cat.productos); // Uso flattenMap para recorrer las categorias y obtener todos los productos 
    return allProducts.filter(p => // Recorro el array de productos 
      p.prod_nombre.toLowerCase().includes(searchTerm.toLowerCase()) || // Busco si el nombre del producto incluye el termino de busqueda
      p.prod_descripcion.toLowerCase().includes(searchTerm.toLowerCase()) // Busco si la descripcion del producto incluye el termino de busqueda
    );
  }, [searchTerm, categories]);

  return {
    searchTerm,
    setSearchTerm,
    categories,
    loading,
    filteredResults
  };
};

/**
 * Hook para manejar el estado de los productos de una categoria en specific
 * @param catId ID de la categoria
 * @param initialData Datos iniciales de la categoria
 * @param title Nombre de la categoria 
 * @returns 
 */
export const useCategoryProducts = (catId: number, initialData: ApiProduct[], title: string) => {
  const [isExpanded, setIsExpanded] = useState(false);// guardo si la categoria esta expandida o no 
  const [products, setProducts] = useState<ApiProduct[]>(initialData); // guardo los productos de la categoria 
  const [hasLoadedFull, setHasLoadedFull] = useState(false); // guardo si se han cargado todos los productos de la categoria 

  const toggleExpand = async () => {
    /* Si vamos a expandir y no hemos cargado el resto, llamamos al servicio */
    if (!isExpanded && !hasLoadedFull) { // Si no esta expandida y no hemos cargado todos los productos primero carga todos los productos 
      try {
        const rawData = await productService.fetchProductosPorCategoria(catId); // Llamo al endpoint de productos por categoria 
        const mapped = productMapper.toUIList(rawData, title, catId); // Mapeo los productos de la categoria 
        setProducts(mapped); // Actualizo el estado de los productos 
        setHasLoadedFull(true); // Actualizo el estado de carga 
      } catch (error) {
        console.error("Error cargando categoría:", error); // <!> Agregar a  log para mandar al bakend
      }
    }
    setIsExpanded(!isExpanded);
  };

  return {
    products,
    isExpanded,
    toggleExpand
  };
};