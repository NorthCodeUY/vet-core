/* --- apps/web-client/src/pages/landing/sessions/ProductsSession.tsx --- */

import { useState, useMemo, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CategoryGroupCard } from '../../../components/CategoryGroupCard.tsx';
import { ProductCard } from '../../../components/ProductCard.tsx';

import { useProducts } from '../../../hooks/useProducts.ts';






/**
 * Sección de Productos conectada al Backend (FastAPI).
 * Gestiona la carga de datos, el filtrado global y la visualización por categorías.
 */
export const ProductsSession = ({ bgColor }: { bgColor: string }) => {
    const { 
      searchTerm, // Guardara lo que escriba el usuario y esto me ayudara a filtrar los resultados  
      setSearchTerm, // Me va a permitir modificar el searchTerm
      categories, // Todas las categorias
      loading, // Estado de carga 
      filteredResults // Resultados filtrados 
    } = useProducts();

  
  
  
  
      
 



  /* --- Renderizado de Estado de Carga --- */
  if (loading) {
    return (

      // Cartel de carga mientras no hay datos
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Alineación vertical */
        items-center                 /* Centrado horizontal */
        justify-center               /* Centrado vertical */
        
        /* --- Dimensiones --- */
        py-40                        /* Espaciado vertical amplio */
        gap-4                        /*  Espacio entre icono y texto */
      `}>
        
        {/* Icono de carga */}
        <Loader2 className="animate-spin text-vete-primary" size={48} />

        {/* Mensaje de carga datos */}
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