/* --- apps/web-client/src/components/CategoryGroupCard.tsx --- */


import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { ProductCard } from './ProductCard';
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

  // Funcion para llevar derecho al producto seleccionado

  // 1. Extraemos el ID directamente del link cuando entra el usuario
  const hash = window.location.hash; // Ej: "#prod-03"

  // 2. Si la URL trae un hash de producto, esperas a que cargue la lista
  if (hash && hash.startsWith('#prod-')) {
    const targetId = hash.replace('#', ''); // Guardas "prod-03" en una variable

    // 3. Le das unos segundos a la app para que cargue los productos de la API
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1500); // Espera 1.5 segundos antes de hacer el salto
  }

  /* --- Fachada de Lógica (Hook) --- */
  const {
    products,
    isExpanded,
    toggleExpand
  } = useCategoryProducts(catId, initialData, title);



  /* --- Fachada de Pedidos (Para el contador del título) --- */
  const { pedido } = usePedidoStore();


  const cantidadComprada = (pedido || []) // Me da el total de cantidad de productos de esta categoria que estan en el pedido 
    .filter(item => item?.producto?.cat_id === catId) // Me quedo con los productos de esta categoria (con acceso seguro ?.)
    .reduce((acc, item) => acc + (item?.cantidad || 0), 0); // Me quedo con la cantidad de productos 




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
        gap-3                        /* Espacio entre título y botón */
        
        /* --- Dimensiones --- */
        mb-8                         /* Margen inferior de 2rem */
        pb-4                         /* Padding inferior de 1rem */
        w-full                       /* Ocupa el ancho total del contenedor */
        
        /* --- Colores --- */
        border-b                     /* Agrega borde en la parte inferior */
        border-vete-primary/30       /* Color verde marca con transparencia */
      `}>
        {/* Bloque Izquierdo: Título + Badge (Con control de ancho) */}
        
        <div className={`
          /* --- Posición --- */
          flex                         /* Alineación horizontal */
          items-center                 /* Centrado vertical <!> Esto no estoy seguro*/
          gap-3                        /* Espacio entre letras y badge */
          
          /* --- Dimensiones --- */
          min-w-0                      /* CRÍTICO: Permite que el hijo trunque */
          flex-1                       /* Toma el espacio disponible */
        `}>

          {/* Título de la categoría */}
          <h3 className={`
            /* --- Texto --- */
            text-2xl                     /* Tamaño reducido en móvil */
            md:text-4xl                  /* Tamaño escalado para desktop */
            font-black                   /* Peso de fuente máximo (900) */
            leading-none                 /* Altura de línea mínima */
            uppercase                    /* Transforma texto a mayúsculas */
            italic                       /* Estilo de letra cursiva */
            
            /* --- Estilo --- */
            truncate                     /* Agrega puntos suspensivos si el texto es largo */

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
              flex-shrink-0                /* Evita que el badge se achique */

              /* --- Dimensiones --- */
              px-3                         /* Padding horizontal */
              py-1.5                       /* Padding vertical */
              
              /* --- Colores --- */
              bg-vete-primary              /* Fondo verde */
              text-white                   /* Texto blanco */
              rounded-full                 /* Forma redondeada */
              shadow-lg                    /* Sombra pronunciada */
              
              /* --- Estilo --- */
              rounded-full                 /* Forma redondeada */
              shadow-md                    /* Sombra pronunciada */
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
            flex-shrink-0                /* Garantiza que el botón nunca desaparezca */
            
            /* --- Texto --- */
            font-bold                    /* Peso de fuente negrita */
            text-sm                      /* Tamaño de fuente pequeño <!> Probar sacarlo para ver como se ve */
            
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

      {/* Grid de productos adaptado para 2 columnas en Mobile */}
      <div className={`
        /* --- Posición --- */
        grid                         /* Activa el sistema de grilla */
        grid-cols-2                  /* CRÍTICO: 2 columnas en Móvil por defecto cambiar a 1 si asi quiere */
        sm:grid-cols-2               /* 2 columnas: Tablet pequeña */
        md:grid-cols-3               /* 3 columnas: Tablet / Laptop corta */
        lg:grid-cols-4               /* 4 columnas: Laptop */
        xl:grid-cols-5               /* 5 columnas: Desktop grande */
        justify-items-center         /* Centra las tarjetas */

        /* --- Dimensiones --- */
        gap-2.5                      /* Gap compacto para mobile (10px) */
        sm:gap-4                     /* Gap medio para pantallas medianas */
        md:gap-6                     /* Gap amplio para pantallas grandes */
        w-full                       /* Ocupa todo el ancho disponible */
      `}>

        {products.map((p, index) => {
          /* 
            Lógica de visibilidad actualizada:
            - En mobile no expandido: muestra 2 productos (índices 0 y 1).
            - En desktop no expandido: muestra hasta 5 productos.
            - Al expandir (isExpanded = true): muestra todos los productos.
          */
          const isHiddenOnMobile = index >= (isExpanded ? products.length : 2);
          const isHiddenOnDesktop = !isExpanded && index >= 5;

          return (
            <div
              key={p.prod_id}
              className={`
                w-full                      /* Ocupa el 100% de la celda */
                min-w-0                     /* Previene desbordamiento de texto */
                flex-col                    /* Fuerza dirección vertical */

                /* --- Visibilidad según Breakpoints --- */
                ${isHiddenOnMobile ? 'hidden' : 'flex'} 
                ${isHiddenOnDesktop ? 'lg:hidden' : 'lg:flex'}

                /* --- Animación --- */
                animate-in                   /* Entrada suave */
                fade-in                      /* Desvanecimiento */
                duration-300                 /* Velocidad de la transición */
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