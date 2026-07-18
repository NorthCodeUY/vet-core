/* --- apps/web-client/src/pages/landing/sessions/ProductsSession.tsx --- */

import { useState, useMemo, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CategoryGroupCard } from '../../../components/CategoryGroupCard.tsx';
import { ProductCard } from '../../../components/ProductCard.tsx';
import type { ApiCategory } from '../../../types/product_types';
import type { ApiProduct } from '../../../types/product_types';


// Array de emeplo que voy a esplorar 
// [
//     {
//         "cat_nombre": "Accesorios",
//         "cat_id": 1,
//         "productos": [
//             {
//                 "prod_id": 1,
//                 "prod_nombre": "Durapets Bandeja",
//                 "prod_precio": 308.0,
//                 "prod_descripcion": "Kit Bandeja, pala y plato",
//                 "cat_id": 1,
//                 "rel_imagen_url": [
//                     {
//                         "img_url": "/static/productos/3.png",
//                         "img_principal": true
//                     }
//                 ],
//                 "rel_subcategoria": [
//                     {
//                         "subc_nombre": "Gato"
//                     }
//                 ]
//             },
//             {
//                 "prod_id": 2,
//                 "prod_nombre": "Baño cerrado ",
//                 "prod_precio": 690.0,
//                 "prod_descripcion": "Baño cerrado (56x40x40cm) +pala",
//                 "cat_id": 1,
//                 "rel_imagen_url": [
//                     {
//                         "img_url": "/static/productos/2.png",
//                         "img_principal": true
//                     }
//                 ],
//                 "rel_subcategoria": [
//                     {
//                         "subc_nombre": "Gato"
//                     }
//                 ]
//             },



const mapApiToProduct = (nombreCategoria: string, idCategoria: number, backendProducts: any[]): ApiProduct[] => {
  return backendProducts.map(p => { // Recorro el array de productos y transformo cada uno 
    
    /* 1. Calculamos la imagen principal primero (y corregimos el typo de ipmg -> img) */
    const mainImage = p.rel_imagen_url?.find( // Busca la imagen principal
                        (img: any) => img.img_principal) // Si la eimagen es principal 
                                        || p.rel_imagen_url?.[0] // Si no hay imagen principal toma la primera imagen 
                                        || { img_url: '/images/placeholder.png', img_id: 0 }; // Si no hay ninguna imagen toma la imagen por defecto 
    
    /* 2. Ahora sí, retornamos el objeto estructurado limpiamente */
    return {
      prod_id: p.prod_id,
      prod_nombre: p.prod_nombre,
      prod_precio: p.prod_precio,
      prod_descripcion: p.prod_descripcion,
      cat_nombre: nombreCategoria, // Agregamos el nombre de la categoría
      cat_id: idCategoria, // Agregamos el ID de la categoría
      /* Usamos la constante que calculamos arriba. ¡Ya no necesitas repetir el .find()! */
      imagen_principal_url: mainImage,
      
      /* Filtramos las que no son principales (agregamos ?. por si las moscas si viene null) */
      imagenes_secundarias_url: p.rel_imagen_url?.filter ((img: any) => // Recorro el array de imagenes y filtro las que no son principales 
                                                                !img.img_principal) // Si no es la imagen principal la agrego al array de imagenes secundarias 
                                                                || [], // Si no hay ninguna imagen secundaria la devuelvo como un array vacio 
      
      /* Mapeamos las subcategorías de forma segura */
      subcategoria: p.rel_subcategoria?.map((sub: any) => ({ subc_nombre: sub.subc_nombre })) || []
    };

  });
};

/**
 * Sección de Productos conectada al Backend (FastAPI).
 * Gestiona la carga de datos, el filtrado global y la visualización por categorías.
 */
export const ProductsSession = ({ bgColor }: { bgColor: string }) => {
  /* --- Estado de la Aplicación --- */
  const [searchTerm, setSearchTerm] = useState(""); // Uso UseState porque voy a necesitar que se guarde el valor para filtras los productos y que se muestre en el input 
  const [categories, setCategories] = useState<ApiCategory[]>([]); // UseState para guardar los datos del backend 
  const [loading, setLoading] = useState(true); // Esto es para que carge y que no muestre error hasta que no tenga los datos 
  
  
  // Versio 17/07/2026 18:40

  // /* --- Conexión con el Backend --- */
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       /* Uso de variables de entorno para la URL de la API */
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}/productos/agrupados`);
  //       const data = await response.json();
  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Error cargando el catálogo de la vete:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

    /* --- Conexión con el Backend --- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/productos/agrupados`);
        const data = await response.json();

        /* --- TRANSFORMACIÓN --- */
        /* Convertimos cada categoría y sus productos al formato de nuestras Interfaces */
        const transformedData: ApiCategory[] = data.map((cat: any) => ({
          cat_id: cat.cat_id,
          cat_nombre: cat.cat_nombre,
          productos: mapApiToProduct(cat.cat_nombre , cat.cat_id , cat.productos) // Usamos la función de arriba
        }));

        setCategories(transformedData);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* --- Lógica de Filtrado Global --- */ 
  const filteredResults = useMemo(() => { // <!> Voy a nesesitar que me espliques este metodo porque no lo tengo claro 
    if (!searchTerm) return null;

    /* Aplanamos todas las categorías en una sola lista para la búsqueda global */
    const allProducts = categories.flatMap(cat => cat.productos); // 

    return allProducts.filter(p =>
      p.prod_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prod_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categories]);

  /* --- Renderizado de Estado de Carga --- */
  if (loading) {
    return (
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Alineación vertical */
        items-center                 /* Centrado horizontal */
        justify-center               /* Centrado vertical */
        
        /* --- Dimensiones --- */
        py-40                        /* Espaciado vertical amplio */
        gap-4                        /* Espacio entre icono y texto */
      `}>
        <Loader2 className="animate-spin text-vete-primary" size={48} />
        <p className="text-vete-primary font-bold italic animate-pulse">
          Cargando catálogo de Salto...
        </p>
      </div>
    );
  }

  return (
    <section className={`
      /* --- Posición --- */
      relative                     /* Contexto para elementos internos */
      
      /* --- Dimensiones --- */
      w-full                       /* Ancho total */
      px-6                         /* Padding lateral móvil */
      md:px-16                     /* Padding lateral desktop */
      py-20                        /* Espaciado vertical de la sección */
      mt-10                        /* Margen superior */

      /* --- Colores --- */
      ${bgColor}                   /* Fondo dinámico recibido por props */
    `}>
      <div className={`
        /* --- Dimensiones --- */
        max-w-[1400px]               /* Límite de ancho para pantallas ultra-wide */
        mx-auto                      /* Centrado horizontal del bloque */
      `}>

        {/* Cabecera de la Sección y Buscador */}
        <div className={`
          /* --- Posición --- */
          flex                         /* Contenedor flexible */
          flex-col                     /* Columna en móviles */
          tablet-vete:flex-row         /* Fila en breakpoint personalizado */
          tablet-vete:justify-between  /* Separación de extremos */
          items-center                 /* Centrado vertical */
          gap-8                        /* Espacio entre título y buscador */
          
          /* --- Dimensiones --- */
          mb-16                        /* Margen inferior del bloque */
        `}>

          <h2 className={`
            /* --- Texto --- */
            text-4xl                     /* Tamaño de fuente grande */
            font-black                   /* Peso de fuente máximo */
            italic                       /* Estilo cursivo */
            uppercase                    /* Mayúsculas institucionales */
            tracking-tighter             /* Espaciado de letras apretado */

            /* --- Colores --- */
            text-vete-text-light         /* Color de texto claro */
          `}>
            Lista de <span className="text-vete-primary">Productos</span>
          </h2>

          {/* Contenedor del Buscador */}
          <div className={`
            /* --- Posición --- */
            relative                     /* Para posicionar el icono de lupa */
            w-full                       /* Ancho total en móvil */
            max-w-md                     /* Límite de ancho en desktop */
            
            /* --- Animación --- */
            group                        /* Grupo para efectos de foco */
          `}>
            <Search className={`
              /* --- Posición --- */
              absolute                     /* Posicionamiento sobre el input */
              left-4                       /* Alineado a la izquierda */
              top-1/2                      /* Centrado verticalmente */
              -translate-y-1/2             /* Ajuste fino de centrado */

              /* --- Colores --- */
              text-vete-text-light/50      /* Color tenue por defecto */

              /* --- Animación --- */
              group-focus-within:text-vete-primary /* Cambia color al escribir */
              transition-colors            /* Transición suave */
            `} size={20} />
            
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className={`
                /* --- Dimensiones --- */
                w-full                       /* Ancho total */
                pl-12                        /* Espacio para el icono */
                pr-4                         /* Padding derecho */
                py-4                         /* Padding vertical */
                
                /* --- Colores --- */
                bg-white/10                  /* Fondo traslúcido */
                border-2                     /* Borde de 2px */
                border-vete-primary/30       /* Color de borde marca */
                text-vete-text-light         /* Color de texto */

                /* --- Estilo --- */
                rounded-2xl                  /* Bordes redondeados */
                placeholder:text-vete-text-light/40 /* Color del placeholder */
                
                /* --- Animación --- */
                focus:outline-none           /* Quita el borde por defecto */
                focus:border-vete-primary    /* Resalta el borde al foco */
                focus:bg-white/20            /* Aclara el fondo al foco */
                transition-all               /* Transición para todos los estados */
                shadow-xl                    /* Sombra para profundidad */
              `}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Área de Visualización de Contenido  */} 
        <div className="w-full">
          {searchTerm ? (
            /* Vista de Resultados de Búsqueda */
            <div className={`
              /* --- Animación --- */
              animate-in                   /* Animación de entrada */
              fade-in                      /* Desvanecimiento */
              slide-in-from-bottom-4       /* Desplazamiento hacia arriba */
              duration-500                 /* Duración de medio segundo */
            `}>
              <h3 className="text-2xl font-bold text-vete-primary mb-8 italic">
                Resultados para "{searchTerm}"
              </h3>
              
              <div className={`
                /* --- Posición --- */
                grid                         /* Sistema de grilla */
                grid-cols-1                  /* 1 columna móvil */
                sm:grid-cols-2               /* 2 columnas tablet */
                lg:grid-cols-3               /* 3 columnas laptop */
                xl:grid-cols-5               /* 5 columnas desktop */
                gap-6                        /* Espacio entre tarjetas */
                justify-items-center         /* Centrado horizontal */
              `}>
                {/* Tarjetas para mostrar productos filtrados por buscador */}
                {filteredResults?.map(p => (
                  // <!> Version antigua borrar  
                  // <ProductCard 
                  //   key={p.prod_id} 
                  //   title={p.prod_nombre} 
                  //   desc={p.prod_descripcion} 
                  //   price={p.prod_precio} 
                  //   img={`${import.meta.env.VITE_API_IMAGES}/${p.rel_imagen_url[0]?.img_url}`}
                  //   subcategories={p.rel_subcategoria}
                  // />

                  <ProductCard producto={p} />

                ))}

                {/* Si no tnego elemento de la busqueda muestra esto */}
                {filteredResults?.length === 0 && (
                  <p className="text-white/50 col-span-full py-10">
                    No se encontraron productos que coincidan con su búsqueda.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Vista Normal Agrupada por Categorías */
            <div className={`
              /* --- Posición --- */
              flex                         /* Contenedor flexible */
              flex-col                     /* Dirección vertical */
              
              /* --- Dimensiones --- */
              gap-20                       /* Espacio amplio entre categorías */
            `}>
              {categories.map((cat) => (
                <CategoryGroupCard 
                  key={cat.cat_id}
                  title={cat.cat_nombre} 
                  catId={cat.cat_id} 
                  initialData={cat.productos} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ProductsSession;