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
export const CategoryGroupCard = ({ title, catId, data }: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir y contraer la lista de productos 
  //const [products, setProducts] = useState(initialData); // Estado local para los productos
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




// Nuevo componente 11 de julio no lo probe aun ------------------------------------------


/* --- apps/web-client/src/components/ProductCard.tsx --- */

export const ProductCard = ({ title, desc, price, img, quantity = 0 }: Props) => {
  /* Determinamos si el producto está seleccionado para cambiar el estilo */
  const isSelected = quantity > 0;

  return (
    <div className={`
      /* --- Posición --- */
      flex flex-col gap-2 h-full
      relative                     /* Para el badge de cantidad */

      /* --- Dimensiones --- */
      min-w-[280px] p-6
      
      /* --- Colores --- */
      /* Si está seleccionado, oscurecemos el fondo para feedback visual rápido */
      ${isSelected ? 'bg-vete-primary/20' : 'bg-vete-soft/50'}
      border-2
      ${isSelected ? 'border-vete-primary' : 'border-transparent'}

      /* --- Estilo --- */
      rounded-[2rem]
      
      /* --- Animación --- */
      transition-all               /* Transición suave de colores */
      duration-300                 /* Velocidad de la animación */
    `}`}>
      
      {/* Badge de cantidad sobre la imagen */}
      {isSelected && (
        <div className={`
          /* --- Posición --- */
          absolute top-4 right-4 z-10
          
          /* --- Dimensiones --- */
          w-10 h-10 flex items-center justify-center
          
          /* --- Colores --- */
          bg-vete-primary text-white
          
          /* --- Estilo --- */
          rounded-full font-black text-lg
          shadow-xl border-4 border-white
        `}`}>
          {quantity}
        </div>
      )}

      {/* ... (Imagen y textos) */}

      <div className={`
        /* --- Posición --- */
        flex justify-between items-center mt-auto pt-4
      `}`}>
        <span className="text-vete-primary font-black text-xl">
          ${(price * (quantity || 1)).toLocaleString('es-UY')}
        </span>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-2">
           {/* Aquí irían tus botones de + y - que disparan el estado global */}
        </div>
      </div>
    </div>
  );
};

























/* --- apps/web-client/src/components/CategoryGroupCard.tsx --- */

import { ShoppingCart } from 'lucide-react';

// ... (resto de imports e interfaces)

export const CategoryGroupCard = ({ title, data, catId }: CategoryGroupProps) => {
  /* 
     Calculamos cuántos productos de ESTA categoría hay en el carrito.
     Esto permite que el usuario vea el resumen por sección.
  */
  const itemsInThisCategory = data.reduce((acc, p) => acc + (p.quantity || 0), 0);

  return (
    <div className="w-full">
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        justify-between              /* Separa título de controles */
        items-center                 /* Centrado vertical */
        
        /* --- Dimensiones --- */
        mb-8                         /* Margen inferior */
        pb-4                         /* Padding inferior */

        /* --- Colores --- */
        border-b                     /* Borde inferior */
        border-vete-primary/30       /* Color verde marca tenue */
      `}`}>
        <div className={`
          /* --- Posición --- */
          flex                         /* Alineación horizontal */
          items-center                 /* Centrado vertical */
          gap-4                        /* Espacio entre título e icono */
        `}`}>
          <h3 className={`
            /* --- Texto --- */
            text-5xl font-black italic uppercase
            text-vete-primary
          `}`}>
            {title}
          </h3>

          {/* Badge de Carrito por Categoría */}
          {itemsInThisCategory > 0 && (
            <div className={`
              /* --- Posición --- */
              flex items-center gap-2
              
              /* --- Dimensiones --- */
              px-4 py-2                /* Espaciado interno */
              
              /* --- Colores --- */
              bg-vete-primary          /* Fondo verde marca */
              text-white               /* Texto blanco */
              
              /* --- Estilo --- */
              rounded-full             /* Forma de píldora */
              shadow-lg                /* Sombra de elevación */
              
              /* --- Animación --- */
              animate-in zoom-in       /* Animación de aparición */
            `}`}>
              <ShoppingCart size={18} />
              <span className="font-bold text-sm">{itemsInThisCategory}</span>
            </div>
          )}
        </div>

        {/* ... (Boton Ver más) */}
      </div>
      
      {/* ... (Grid de productos) */}
    </div>
  );
};












const handleConfirmOrder = (cartItems: any[], address: string) => {
  const phoneNumber = "59899123456"; // Número de la veterinaria
  
  let message = `🐾 *NUEVO PEDIDO - VETERINARIA BELTRAMELLI* 🐾\n\n`;
  message += `📍 *Dirección:* ${address}\n`;
  message += `----------------------------------\n`;
  
  cartItems.forEach(item => {
    message += `✅ ${item.qty}x ${item.name} - $${item.price * item.qty}\n`;
  });
  
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  message += `----------------------------------\n`;
  message += `💰 *TOTAL A PAGAR:* $${total}\n\n`;
  message += `_Por favor, confirme la recepción de este pedido._`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};