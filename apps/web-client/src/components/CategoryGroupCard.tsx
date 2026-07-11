/* --- apps/web-client/src/components/CategoryGroupCard.tsx --- */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCard } from './ProductCard.tsx';

interface CategoryGroupProps {
  title: string; // Nombre de la categoría
  catId: string; // Agregamos el ID para poder pedir más datos 
  data: any[];  //  Datos de los productos
}

/**
 * Componente que agrupa productos por categoría.
 * Adaptado para la estructura de datos del Backend (FastAPI) y 
 * siguiendo el estándar estricto de legibilidad de Tailwind.
 */
export const CategoryGroupCard = ({ title, catId, initialData }: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir y contraer la lista de productos 
  const [products, setProducts] = useState(initialData); // Estado local para los productos
  const [hasLoadedFull, setHasLoadedFull] = useState(false); // Control para no pedir 2 veces

  /* Lógica de visualización responsiva */
  const mobileLimit = isExpanded ? 5 : 1;
  
  /* URL base para imágenes desde variables de entorno */
  const IMAGES_BASE_URL = import.meta.env.VITE_API_IMAGES;

  return (
    <div className={`
      /* --- Dimensiones --- */
      w-full                       /* Ocupa el ancho total del contenedor */
    `}>
      {/* Contenedor del título y botón de acción */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Activa el contenedor flexible */
        justify-between              /* Separa el título del botón */
        items-end                    /* Alinea los elementos al fondo */
        
        /* --- Dimensiones --- */

        mb-8                         /* Margen inferior de 2rem */
        pb-4                         /* Padding inferior de 1rem */
        /* --- Colores --- */
        border-b                     /* Agrega borde en la parte inferior */
        border-vete-primary/30       /* Color verde marca con transparencia */
      `}>
        {/* Título de la categoría */}
        <h3 className={`
          /* --- Texto --- */
          text-5xl                     /* Tamaño de fuente extra grande */
          font-black                   /* Peso de fuente máximo (900) */
          leading-none                 /* Altura de línea mínima */
          uppercase                    /* Transforma texto a mayúsculas */
          italic                       /* Estilo de letra cursiva */

          /* --- Colores --- */
          text-vete-primary            /* Color verde principal de la marca */
        `}>
          {title}
        </h3>
        
        {/* Botón de expandir/ocultar */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            /* --- Posición --- */
            flex                         /* Contenedor flexible para icono y texto */
            items-center                 /* Centrado vertical */
            gap-2                        /* Espacio entre texto e icono */

            /* --- Texto --- */
            font-bold                    /* Peso de fuente negrita */

            /* --- Colores --- */
            text-vete-primary            /* Color verde principal */

            /* --- Animación --- */
            hover:underline              /* Subraya al pasar el mouse */
            transition-all               /* Transición suave para cambios */
          `}
          
        >
          <span className="hidden sm:inline">
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Grid de productos adaptado a la nueva estructura de datos */}
      <div className={`
        /* --- Posición --- */
        grid                         /* Activa el sistema de grilla */
        grid-cols-1                  /* 1 columna en móviles */
        sm:grid-cols-2               /* 2 columnas en tablets */
        lg:grid-cols-3               /* 3 columnas en laptops */
        xl:grid-cols-4               /* 4 columnas en pantallas grandes */
        2xl:grid-cols-5              /* 5 columnas en pantallas extra grandes */
        justify-items-center         /* Centra las tarjetas horizontalmente */

        /* --- Dimensiones --- */
        gap-y-10                     /* Espacio vertical entre filas */
        gap-x-6                      /* Espacio horizontal entre columnas */
      `}>
        {data.map((p, index) => {
          /* Lógica de visibilidad basada en el índice y estado de expansión */
          const isHiddenOnMobile = index >= mobileLimit;
          const isHiddenOnDesktop = index >= 5;

          return (
            <div 
              key={p.prod_id} 
              className={`
                /* --- Posición --- */
                ${isHiddenOnMobile ? 'hidden' : 'flex'} 
                ${isHiddenOnDesktop ? 'xl:hidden' : 'xl:flex'}

                /* --- Animación --- */
                animate-in                   /* Activa animación de entrada */
                fade-in                      /* Efecto de desvanecimiento */
                duration-300                 /* Duración de 300ms */
              `}
            >
              <ProductCard 
                title={p.prod_nombre} 
                desc={p.prod_descripcion} 
                price={p.prod_precio} 
                /* Construcción dinámica de la URL de imagen */
                //img={`${IMAGES_BASE_URL}/${p.rel_imagen_url[0]?.img_url}`} <!> sacar
                img={p.rel_imagen_url[0]?.img_url}
                /* Inyección de subcategorías para los iconos de mascotas */
                subcategories={p.rel_subcategoria}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};