/* --- apps/web-client/src/components/CategoryGroupCard.tsx --- */


import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { ProductCard } from './ProductCard.tsx'
import { usePedidoStore } from '../context/pedido_context';
import { useCategoryProducts } from '../hooks/useProducts';



/**
 * Interfaz que define las props del componente CategoryGroupCard.
 * @param title - Nombre de la categoría
 * @param catId - ID de la categoría
 * @param initialData - Datos que vienen desde el backend
 */
interface CategoryGroupProps {
  title: string; // Nombre de la categoría
  catId: number; // Agregamos el ID para poder pedir más datos 
  initialData: any[]; // Datos que vienen desde el backend
}

/**
 * Componente que agrupa productos por categoría.
 * Adaptado para la estructura de datos del Backend (FastAPI) y 
 * siguiendo el estándar estricto de legibilidad de Tailwind.
 * @param title - Nombre de la categoría
 * @param catId - ID de la categoría
 * @param initialData - Datos que vienen desde el backend
 * @returns 
 */
export const CategoryGroupCard = ({ title, catId, initialData }: CategoryGroupProps) => {
  /* --- Fachada de Lógica (Hook) --- */
  const {
    products,
    isExpanded,
    toggleExpand
  } = useCategoryProducts(catId, initialData, title);



  /* --- Fachada de Pedidos (Para el contador del título) --- */
  const { pedido } = usePedidoStore();


  const cantidadComprada = pedido // Me da el total de cantidad de productos de esta categoria que estan en el pedido 
    .filter(item => item.producto.cat_id === catId) // Me quedo con los productos de esta categoria
    .reduce((acc, item) => acc + item.cantidad, 0); // Me quedo con la cantidad de productos 




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

        <div className="flex items-center gap-4">

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

          {/* Badge de Carrito */}
          {cantidadComprada > 0 && (
            <div className={`
              /* --- Posición --- */
              flex                         /* Contenedor flexible */
              items-center                 /* Centrado vertical */
              gap-2                        /* Espacio entre icono y texto */
              
              /* --- Dimensiones --- */
              px-4                         /* Padding horizontal */
              py-2                         /* Padding vertical */
              
              /* --- Colores --- */
              bg-vete-primary              /* Fondo verde */
              text-white                   /* Texto blanco */
              rounded-full                 /* Forma redondeada */
              shadow-lg                    /* Sombra pronunciada */
              
              /* --- Animación --- */
              animate-in                   /* Animación de entrada */
              zoom-in                      /* Efecto de zoom */
            `}>
              <ShoppingCart size={18} />
              <span className={`
              /* --- Texto --- */
              font-bold                    /* Peso de fuente negrita */
              text-sm                      /* Tamaño de fuente pequeño */
              `}>
                {cantidadComprada}
              </span>
            </div>
          )}
        </div>

        {/* Botón de expandir/ocultar */}
        <button
          onClick={toggleExpand} /* funcion que dispara la espandir y ocultar de los productos */
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
        grid-cols-1                  /* 1 columna: Móvil (por defecto) */
        sm:grid-cols-2               /* 2 columnas: Tablet */
        lg:grid-cols-3               /* 3 columnas: Laptop */
        xl:grid-cols-4               /* 4 columnas: Desktop (Tu pedido) */
        2xl:grid-cols-5            /* 5 columnas: Pantallas extra grandes */
        justify-items-center         /* Centra las tarjetas */

        /* --- Dimensiones --- */
        gap-y-10                     /* Espacio vertical */
        gap-x-6                      /* Espacio horizontal */
      `}>



        {products.map((p, index) => {
          /* Lógica de visibilidad basada en el índice y estado de expansión */
          const isHiddenOnMobile = index >= (isExpanded ? products.length : 1);
          const isHiddenOnDesktop = !isExpanded && index >= 5;

          return (
            <div
              key={p.prod_id}
              className={`
                /* --- Lógica de Visibilidad Progresiva --- */
                /* Si está expandido, mostramos todos. Si no, aplicamos el escalonamiento: */
                ${isExpanded ? 'flex' : (
                  index === 0 ? 'flex' :                         /* El 1ero siempre visible */
                    index === 1 ? 'hidden sm:flex' :               /* El 2do aparece en Tablet */
                      index === 2 ? 'hidden lg:flex' :               /* El 3ero aparece en Laptop */
                        index === 3 ? 'hidden xl:flex' :               /* El 4to aparece en Desktop */
                          index === 4 ? 'hidden 2xl:flex' :               /* El 5to aparece en Desktop */
                          'hidden'                                       /* Del 6to en adelante ocultos */
                )}

                /* --- Animación --- */
                animate-in                   /* Entrada suave */
                fade-in                      /* Desvanecimiento */
                duration-300                 /* Velocidad */
              `}
            >

              <ProductCard producto={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
};