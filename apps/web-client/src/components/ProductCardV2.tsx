/* --- apps/web-client/src/components/ProductCardV2.tsx --- */

import React, { useState } from 'react';
import { ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SUBCATEGORY_ICONS } from '../utils/categoryHelpers';
import { usePedidoStore } from '../context/pedido_context';
import type { ApiProduct } from '../types/product_types';
import companyInfo from '../data/companyInfo.json';

interface Props {
  producto: ApiProduct;
}

/**
 * Componente de UI para representar una tarjeta de producto en el catálogo (Versión 2).
 * Incluye módulo acordeón para detalles expandibles y WhatsApp.
 */
export function ProductCardV2({ producto }: Props) {
  /* --- Estado Local para Control de Acordeón --- */
  const [isExpanded, setIsExpanded] = useState(false);

  /* --- Fachada del Store --- */
  const store = usePedidoStore() as any;
  const pedido = store.pedido || [];
  const addToPedido = store.addToPedido || (() => {});
  
  const handleRemove = store.removeAllPedido 
    || store.removePedido 
    || store.removeFromPedido 
    || (() => {});

  /* --- Lógica de Estado del Producto --- */
  const lineaActual = pedido.find((item: any) => item.producto?.prod_id === producto.prod_id);
  const cantidad = lineaActual?.cantidad || 0;
  const subtotal = producto.prod_precio * cantidad;
  const estaSeleccionado = cantidad > 0;

  // Creamos el link del producto: .origin guarda el link de la pagina, .pathname guarda el subdominio, # el id del producto
  
    const productUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${window.location.pathname}#prod-${producto.prod_id}`
      : '';
  
    /* ${companyInfo.contact.adminPhone} cambiar por un numero para probar si asi lo desea */
  
    /* --- Generación de Link de WhatsApp --- */
    const whatsappLink = `https://wa.me/${companyInfo.contact.adminPhone}?text=${encodeURIComponent(
      `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*, *$${producto.prod_precio}*\n\n Ver Producto: \n\n${productUrl}`
    )}`;

  /* --- Manejadores de Eventos --- */
  const handleRemoveFromPedido = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleRemove(producto.prod_id);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se agregue al pedido al tocar la flecha
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      id={`prod-${producto.prod_id}`}  /* identificador de cada producto */
      onClick={() => addToPedido(producto)}
      className={`
        /* --- Posición --- */
        relative                     /* Permite flotar los badges de selección y borrado */
        flex                         /* Activa flexbox */
        flex-col                     /* Dirección vertical de la tarjeta */
        justify-between              /* Separa el contenido superior del bloque de compra */

        /* --- Dimensiones --- */
        h-full                       /* Ocupa el 100% de la altura disponible */
        w-full                       /* Ocupa todo el ancho de la celda de la grilla */
        min-w-0                      /* Previene desbordamiento en mobile de 2 columnas */

        /* --- Colores --- */
        bg-white                     /* Fondo blanco limpio */
        ${estaSeleccionado 
          ? 'border-vete-primary border-2'  /* Borde verde destacado si está seleccionado */
          : 'border border-gray-200'         /* Borde gris sutil por defecto */
        }

        /* --- Estilo --- */
        rounded-md                   /* Bordes ligeramente redondeados */
        overflow-hidden              /* Contiene imágenes y bordes recortados */
        shadow-sm                    /* Sombra suave */
        cursor-pointer               /* Cursor de selección para toda la tarjeta */

        /* --- Animaciones --- */
        transition-all               /* Transición suave para todos los cambios */
        duration-200                 /* Duración de 200ms */
      `}
    >
      {/* --- BADGE SUPERIOR IZQUIERDO: Subtotal --- */}
      {estaSeleccionado && (
        <div className={`
          /* --- Posición --- */
          absolute                   /* Flota sobre la tarjeta */
          top-2                      /* Ubicación superior 0.5rem */
          left-2                     /* Ubicación izquierda 0.5rem */
          z-20                       /* Se superpone a la imagen */

          /* --- Posición interna --- */
          flex                       /* Alineación horizontal del icono y texto */
          items-center               /* Centrado vertical */
          gap-1                      /* Espacio de 0.25rem entre icono y texto */

          /* --- Dimensiones --- */
          px-2                       /* Padding horizontal de 0.5rem */
          py-1                       /* Padding vertical de 0.25rem */

          /* --- Colores --- */
          bg-vete-primary            /* Fondo verde de la marca */
          text-white                 /* Texto blanco */

          /* --- Texto y Estilo --- */
          text-xs                    /* Texto pequeño */
          font-bold                  /* Texto en negrita */
          rounded-md                 /* Bordes redondeados */
          shadow-md                  /* Sombra para destacar */

          /* --- Animación --- */
          animate-in                 /* Animación de entrada */
          fade-in                    /* Desvanecimiento */
          zoom-in                    /* Leve efecto de zoom al aparecer */
        `}>
          <ShoppingCart size={14} />
          <span>
            Can:{cantidad} / ${subtotal.toLocaleString('es-UY')}
          </span>
        </div>
      )}

      {/* --- BOTÓN CANCELAR (Top Right) --- */}
      {estaSeleccionado && (
        <button
          type="button"
          onClick={handleRemoveFromPedido}
          className={`
            /* --- Posición --- */
            absolute                 /* Flota en la esquina superior derecha */
            top-2                    /* Ubicación superior 0.5rem */
            right-2                  /* Ubicación derecha 0.5rem */
            z-20                     /* Capa superior */

            /* --- Dimensiones --- */
            p-1                      /* Padding de 0.25rem */

            /* --- Colores --- */
            bg-red-500               /* Fondo rojo */
            text-white               /* Icono blanco */

            /* --- Estilo --- */
            rounded-full             /* Botón completamente circular */
            shadow-md                /* Sombra leve */

            /* --- Animación --- */
            hover:bg-red-600         /* Oscurece el rojo al pasar el mouse */
            transition-colors        /* Transición de color suave */
          `}
        >
          <X size={14} />
        </button>
      )}

      {/* --- CONTENEDOR SUPERIOR: Imagen e Iconos --- */}
      <div className={`
        /* --- Posición --- */
        relative                     /* Contenedor relativo para los iconos de subcategoría */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */
        items-center                 /* Centra la imagen */
        justify-center               /* Centra el contenido verticalmente */
        flex-1                       /* Ocupa el espacio disponible superior */

        /* --- Dimensiones --- */
        p-3                          /* Padding interno de 0.75rem */

        /* --- Colores --- */
        bg-white                     /* Fondo blanco */
      `}>
        <img
          src={producto.imagen_principal_url?.img_url || '/images/producto_no_disponible.png'}
          alt={producto.imagen_principal_url ? producto.prod_nombre : "Imagen no encontrada"}
          className={`
            /* --- Dimensiones --- */
            w-full                   /* Ocupa todo el ancho disponible */
            h-32                     /* Altura de 8rem en móvil */
            sm:h-40                  /* Altura de 10rem en escritorio */

            /* --- Estilo --- */
            object-contain           /* Ajusta la imagen sin deformarla */
          `}
        />

        {/* Sección de Subcategorías (Iconos) */}
        <div className={`
          /* --- Posición --- */
          absolute                   /* Flota abajo a la izquierda del bloque superior */
          bottom-1                   /* Pegado al fondo */
          left-2                     /* Margen izquierdo */
          flex                       /* Alineación horizontal de badges */
          gap-1                      /* Espacio entre badges */
        `}>
          {producto.subcategoria?.map((sub, idx) => (
            <div
              key={idx}
              title={sub.subc_nombre}
              className={`
                /* --- Posición --- */
                flex                 /* Alineación */
                items-center         /* Centrado vertical */
                justify-center       /* Centrado horizontal */

                /* --- Dimensiones --- */
                p-1                  /* Padding pequeño */

                /* --- Colores --- */
                bg-vete-primary/10   /* Verde tenue */
                text-vete-primary    /* Icono verde principal */

                /* --- Estilo --- */
                rounded-md           /* Bordes redondeados */
              `}
            >
              {SUBCATEGORY_ICONS[sub.subc_nombre] || null}
            </div>
          ))}
        </div>
      </div>

      {/* --- CONTENEDOR INFERIOR GRIS --- */}
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */
        flex-1                       /* Toma el espacio restante */
        justify-between              /* Distribuye el texto arriba y el botón al fondo */
        gap-2                        /* Espaciado de 0.5rem */

        /* --- Dimensiones --- */
        p-3                          /* Padding de 0.75rem */

        /* --- Colores --- */
        bg-[#f2f2f2]                 /* Fondo gris e-commerce */
        border-t                     /* Línea divisoria superior */
        border-gray-100              /* Color suave para la divisoria */
      `}>
        <div>
          {/* Título en negrita (bold) */}
          <h4 className={`
            /* --- Texto --- */
            text-gray-900            /* Color gris muy oscuro */
            font-bold                /* Negrita requerida */
            text-sm                  /* Texto pequeño en móvil */
            sm:text-base             /* Texto mediano en escritorio */
            leading-tight            /* Interlineado ajustado */
            line-clamp-2             /* Máximo 2 líneas antes de cortar */
          `}>
            {producto.prod_nombre}
          </h4>
        </div>

        {/* Precio y Botón de Compra Limpio */}
        <div className={`
          /* --- Posición --- */
          flex                       /* Dirección flexible */
          flex-col                   /* Alineación vertical */
          gap-2                      /* Espacio entre precio y botón */
          mt-auto                    /* Empuja el bloque hacia el fondo */
          w-full                     /* Ancho completo */
        `}>
          <div className={`
            /* --- Posición --- */
            flex                     /* Alineación del símbolo y el precio */
            items-baseline           /* Alinea la moneda con la base del número */
            gap-1                    /* Espacio de 0.25rem */
          `}>
            <span className={`
              /* --- Texto --- */
              text-vete-primary      /* Color verde marca */
              font-bold              /* Negrita */
              text-xs                /* Moneda chica */
            `}>
              U$S
            </span>
            <span className={`
              /* --- Texto --- */
              text-vete-primary      /* Color verde marca */
              font-extrabold         /* Negrita reforzada */
              text-lg                /* Grande en móvil */
              sm:text-xl             /* Más grande en escritorio */
            `}>
              {producto.prod_precio.toLocaleString('es-UY')}
            </span>
          </div>

          {/* Botón de Compra Compacto (Sin WhatsApp en la vista principal) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToPedido(producto);
            }}
            className={`
              /* --- Posición --- */
              w-full                 /* Ocupa todo el ancho */
              flex                   /* Contenedor flex */
              items-center           /* Centra el icono y el texto */
              justify-center         /* Centrado horizontal */
              gap-1.5                /* Espacio de 0.375rem */

              /* --- Dimensiones --- */
              py-1.5                 /* Padding vertical compacto */
              px-3                   /* Padding horizontal */

              /* --- Colores --- */
              bg-vete-primary        /* Fondo verde de la marca */
              text-white             /* Texto e icono blancos */

              /* --- Texto y Estilo --- */
              font-bold              /* Texto en negrita */
              text-sm                /* Texto estándar */
              rounded-md             /* Bordes suavizados */
              shadow-sm              /* Sombra pequeña */

              /* --- Animaciones --- */
              hover:opacity-90       /* Suave cambio de opacidad */
              transition-opacity     /* Transición rápida */
            `}
          >
            Comprar
            <ShoppingCart size={15} className="text-white" />
          </button>
        </div>

        {/* --- MÓDULO ACORDEÓN: Botón Desplegable --- */}
        <button
          type="button"
          onClick={toggleExpand}
          title={isExpanded ? "Ver menos" : "Ver más detalles"}
          className={`
            /* --- Posición --- */
            flex                     /* Centrado del icono flecha */
            items-center             /* Centrado vertical */
            justify-center           /* Centrado horizontal */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo */
            pt-1                     /* Espacio superior */

            /* --- Colores --- */
            text-gray-500             /* Color gris medio por defecto */
            hover:text-vete-primary  /* Pasa a verde de marca al hover */

            /* --- Estilo --- */
            focus:outline-none       /* Quita el borde azul por defecto */
            transition-colors        /* Transición suave de color */
          `}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* --- CONTENIDO EXPANDIDO --- */}
        {isExpanded && (
          <div className={`
            /* --- Posición --- */
            flex                     /* Contenedor flexible vertical */
            flex-col                 /* Apilado de elementos */
            gap-2.5                  /* Espacio entre descripción y WhatsApp */

            /* --- Dimensiones --- */
            pt-2                     /* Padding superior */

            /* --- Colores --- */
            border-t                 /* Borde superior separador */
            border-gray-200/60       /* Borde gris claro semitransparente */

            /* --- Animaciones --- */
            animate-in               /* Animación de entrada */
            fade-in                  /* Aparece suavemente */
            duration-200             /* Duración de 200ms */
          `}>
            {/* Descripción Completa */}
            <p className={`
              /* --- Texto --- */
              text-gray-600          /* Texto gris oscuro */
              text-xs                /* Tamaño pequeño */
              leading-snug           /* Interlineado cómodo */
              break-words            /* Evita desbordamientos de palabras largas */
            `}>
              {producto.prod_descripcion || "Sin descripción disponible."}
            </p>

            {/* Botón de WhatsApp dentro del acordeón */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`
                /* --- Posición --- */
                flex                 /* Contenedor flex */
                items-center         /* Centrado vertical */
                justify-center       /* Centrado horizontal */
                gap-2                /* Espacio entre logo de WhatsApp y texto */

                /* --- Dimensiones --- */
                py-1.5               /* Padding vertical */
                px-3                 /* Padding horizontal */

                /* --- Colores --- */
                bg-[#25D366]         /* Verde oficial de WhatsApp */
                hover:bg-[#20bd5a]   /* Verde un poco más oscuro al hover */
                text-white           /* Texto blanco */

                /* --- Texto y Estilo --- */
                font-semibold        /* Seminegrita */
                text-xs              /* Texto compacto */
                rounded-md           /* Bordes suavizados */
                shadow-sm            /* Sombra suave */
                transition-colors    /* Transición suave */
              `}
            >
              <img
                src="/images/branding/LogoWhtSapp.svg"
                alt="WhatsApp"
                className={`
                  /* --- Dimensiones --- */
                  w-4 h-4            /* Icono de 1rem x 1rem */

                  /* --- Estilo --- */
                  brightness-0       /* Convierte el icono a color sólido */
                  invert             /* Lo vuelve blanco */
                `}
              />
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}