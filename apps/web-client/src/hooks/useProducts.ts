/* --- apps/web-client/src/hooks/useProducts.ts --- */
import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/product_service';
import { productMapper } from '../mapper/product_mapper';
import type { ApiCategory } from '../types/product_types';

export const useProducts = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Guardo el termino de busqueda
  const [categories, setCategories] = useState<ApiCategory[]>([]); // Guardo las categorias 
  const [loading, setLoading] = useState(true); // Guardo el estado de carga 

  /* Carga inicial y mapeo <!> NO enteindo como llama esto */ 
  useEffect(() => {// Se ejecuta solo una vez cuando el componente se monta
    const loadData = async () => { // Funcion asincrona que se encarga de cargar los datos iniciales y mapearlos
      try {
        const rawData = await productService.fetchAgrupados(); // Llamo al endpoint de productos agrupados
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