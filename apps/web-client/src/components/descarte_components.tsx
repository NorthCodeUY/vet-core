/* --- apps/web-client/src/components/ProductCard.tsx --- */

import { ShoppingCart } from 'lucide-react';
import { SUBCATEGORY_ICONS } from '../utils/categoryHelpers';

import { usePedidoStore } from '../context/pedido_context'; 
import type { ApiProduct } from '../types/product_types';

//interface Props { 
//  title: string; 
//  desc: string; 
//  price: number; 
//  img: string;
//  subcategories?: { subc_nombre: string }[]; 
//}


interface Props { 
  producto:ApiProduct
}

/**
 * Componente de UI para representar una tarjeta de producto en el catálogo.
 * Formateado para máxima legibilidad y soporte de subcategorías.
 */
//export const ProductCard = ({ title, desc, price, img, subcategories }: Props) => (                  
  export const ProductCard = ({ producto }: Props) => (
  <div className={`
    /* --- Posición --- */
    flex                         /* Contenedor flexible */
    flex-col                     /* Alineación vertical de elementos */
    gap-2                        /* Espacio entre hijos de 0.5rem */
    
    /* --- Dimensiones --- */
    h-full                       /* Altura total */ 
    min-w-[280px]                /* Ancho mínimo para consistencia */
    p-6                          /* Padding interno de 1.5rem */

    /* --- Colores --- */
    bg-vete-soft/50              /* Fondo suave con transparencia */
    
    /* --- Estilo --- */
    rounded-[2rem]               /* Bordes muy redondeados según diseño Figma */
  `}>
    
    {/* Imagen del producto */}
    <img 
      src={img} 
      alt={title} 
      className={`
        /* --- Dimensiones --- */
        w-full                   /* Ocupa todo el ancho disponible */
        h-48                     /* Altura fija de 12rem */
        
        /* --- Estilo --- */
        object-cover             /* Asegura que la imagen no se deforme */
        rounded-2xl              /* Bordes redondeados para la imagen */
      `} 
    />

    {/* Sección de Subcategorías (Iconos de Perro, Gato, etc.) */}
    <div className={`
      /* --- Posición --- */
      flex                       /* Alineación horizontal de iconos */
      gap-2                      /* Espacio entre badges */
      mt-2                       /* Margen superior */
    `}>
      {subcategories?.map((sub, idx) => (
        <div key={idx} title={sub.subc_nombre} className={`
          /* --- Posición --- */
          flex items-center justify-center
          /* --- Dimensiones --- */
          p-1.5                      /* Espaciado interno del icono */
          /* --- Colores --- */
          bg-vete-primary/10         /* Fondo verde muy tenue */
          text-vete-primary          /* Color del icono verde marca */
          /* --- Estilo --- */
          rounded-lg                 /* Bordes suavizados */
        `}>
          {/* Renderiza el icono desde el helper según el nombre del backend */}
          {SUBCATEGORY_ICONS[sub.subc_nombre] || null}
        </div>
      ))}
    </div>

    {/* Titulo del producto */}
    <h4 className={`
      /* --- Texto --- */
      text-vete-primary          /* Color verde principal */
      font-bold                  /* Peso de fuente negrita */
      text-lg                    /* Tamaño de fuente grande */
      /* --- Dimensiones --- */
      mt-1                       /* Margen superior mínimo */
    `}>
      {title}
    </h4>

    {/* Descripcion del producto */}
    <p className={`
      /* --- Texto --- */
      text-vete-text-light        /* Color oscuro para legibilidad */
      text-sm                    /* Tamaño de fuente pequeño */
      line-clamp-2               /* Corta el texto a 2 líneas máximo */
    `}>
      {desc}
    </p>

    {/* Precio y botones de accion */}
    <div className={`
      /* --- Posición --- */
      flex
      justify-between
      items-center
      mt-auto                      /* Empuja este bloque al fondo del contenedor */
      pt-4                         /* Agrega un padding superior para separar del texto */

      /* --- Dimensiones --- */
      w-full                       /* Asegura que ocupe todo el ancho */      

    `}>
      
      {/* Precio del producto con formato Uruguay */}
      <span className={`
        /* --- Texto --- */
        text-vete-primary          /* Color verde principal */
        font-black                 /* Peso de fuente máximo */
        text-xl                    /* Tamaño de fuente extra grande */
      `}>
        ${price.toLocaleString('es-UY')}
      </span>

      {/* Botones de accion */}
      <div className="flex gap-2 items-center">
        {/* Boton de whatsapp */}
        <img 
          src="/images/branding/LogoWhtSapp.svg" 
          alt="WhatsApp" 
          className={`
            /* --- Dimensiones --- */
            w-8 h-8                  /* Tamaño fijo de 2rem */
            /* --- Animación --- */
            hover:scale-110          /* Crece levemente al pasar el mouse */
            transition-transform     /* Transición suave */
            cursor-pointer           /* Cursor de mano */
          `} 
        />

        <div className={`
          /* --- Posición --- */
          p-2                        /* Espaciado interno */
          cursor-pointer             /* Cursor de mano */
          
          /* --- Colores --- */
          bg-vete-primary            /* Fondo verde principal */
          
          /* --- Estilo --- */
          rounded-full               /* Forma circular */
          
          /* --- Animación --- */
          hover:bg-vete-primary/80   /* Oscurece un poco al hover */
          transition-colors          /* Transición de color */
        `}>
          {/*  <!> Aca en este boton deberia conectarse a  PedidoContext
          y agregarlo a mi carrito tambien me gustaria que figurara esta tarjeta la cantidad que compor
          y ademas qeu la tarjeta tubiera otro color de fonodo para que la encutre rapido 
          Yo creo que en ningun momento le pase a este componente el objeto pedido que lo cotiene caps deba pasarle el objeto pedido 
          o algo por el estilo no se que se puede hace manteniendo la estructura que venios trabjando 
          
          */}
          <ShoppingCart size={16} className="text-white" />
        </div>
      </div>
    </div>
  </div>
);
