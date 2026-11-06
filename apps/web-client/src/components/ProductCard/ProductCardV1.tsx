/**
 * @fileoverview Tarjeta de Producto V1 (Plana / Minimalista)
 * 
 * Componente visual de catálogo optimizado para despliegue rápido.
 * Sincronizado con el nuevo contrato de precios absolutos (prod_precio_venta),
 * disponibilidad comercial e iconografía agnóstica para subcategorías.
 * 
 * @module components/ProductCard/ProductCardV1
 */

import React, { useMemo } from 'react';
// --- Iconografía Lucide y Componente Dinámico ---
import { ShoppingCart, X, MessageCircle } from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';

// --- Estado Global y Contratos de Dominio ---
import { usePedidoStore } from '../../context/pedido_context';
import type { ApiProduct } from '../../types/product_types';
import { useConfig } from '../../context/tenant_context';

interface ProductCardV1Props {
  producto: ApiProduct;
}

export function ProductCardV1({ producto }: ProductCardV1Props) {
  /* ===========================================================================
     1. CONSUMO DEL STORE GLOBAL Y COMPATIBILIDAD DEFENSIVA
     =========================================================================== */
  const store = usePedidoStore() as any;
  const pedido = store.pedido || [];
  
  const addItemToCart = store.addItem || store.addToPedido || (() => {});
  const removeItemFromCart = store.removeItem || store.removeAllPedido || store.removeFromPedido || (() => {});

  /* ===========================================================================
     2. RESOLUCIÓN DE PRECIO Y LÍNEA DE PEDIDO
     =========================================================================== */
  // <!> Sincronización con prod_precio_venta (elimina el fallo de compilación)
  const precioUnitario = Number(producto.prod_precio_venta ?? (producto as any).prod_precio ?? 0);

  const lineaActual = useMemo(() => {
    return pedido.find((item: any) => item.producto?.prod_id === producto.prod_id);
  }, [pedido, producto.prod_id]);

  const cantidad = lineaActual?.cantidad || 0;
  const subtotal = precioUnitario * cantidad;
  const estaSeleccionado = cantidad > 0;

  /* ===========================================================================
     3. EVALUACIÓN DE DISPONIBILIDAD COMERCIAL
     =========================================================================== */
  const isAvailable = useMemo(() => {
    if (producto.prod_disponible === false) return false;
    if (producto.prod_per_sin_stock) return true;
    if (producto.prod_stock !== null && producto.prod_stock !== undefined) {
      return producto.prod_stock > 0;
    }
    return true;
  }, [producto.prod_disponible, producto.prod_per_sin_stock, producto.prod_stock]);

  /* ===========================================================================
     4. WHATSAPP Y ENLACE SEGURO
     =========================================================================== */
  const { config } = useConfig();
  const rawPhone = config?.contact?.admin_phone || '';
  const countryCode = config?.contact?.whatsapp_country_code || '598';
  const cleanPhone = `${countryCode}${rawPhone.replace(/\D/g, '').replace(/^0/, '')}`;

  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#prod-${producto.prod_id}`
    : '';

  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*, *$${precioUnitario.toLocaleString('es-UY')}*.\n\nVer Producto:\n${productUrl}`
  )}`;

  /* ===========================================================================
     5. HANDLERS DE INTERACCIÓN
     =========================================================================== */
  const handleCardClick = () => {
    if (!isAvailable) return;
    addItemToCart(producto);
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeItemFromCart(producto.prod_id);
  };

  return (
    <div
      id={`prod-${producto.prod_id}`}
      onClick={handleCardClick}
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para badges absolutos */
        flex                         /* Layout en columna */
        flex-col
        justify-between              /* Distribuye contenido e interacción */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el ancho completo */
        h-full                       /* Altura total homogénea */
        min-w-0                      /* Previene desbordamiento en grillas */
        p-4                          /* Padding interno móvil */
        sm:p-5                       /* Padding interno escritorio */
        gap-3                        /* Separación vertical */

        /* --- Colores --- */
        ${estaSeleccionado 
          ? 'bg-vete-primary/10 border-vete-primary border-2 shadow-md' 
          : 'bg-vete-surface border-vete-border-subtle border hover:border-vete-primary/50'
        }

        /* --- Estilo --- */
        rounded-[1.75rem]            /* Curvatura moderna */
        overflow-hidden
        ${!isAvailable ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        shadow-sm

        /* --- Animación --- */
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      {/* BADGE: Subtotal acumulado */}
      {estaSeleccionado && (
        <div
          className={`
            /* --- Posición --- */
            absolute
            top-3
            left-3
            z-20
            flex
            items-center

            /* --- Dimensiones --- */
            gap-1.5
            px-2.5
            py-1

            /* --- Colores --- */
            bg-vete-primary
            text-white
            shadow-md

            /* --- Texto --- */
            text-xs
            font-bold

            /* --- Estilo --- */
            rounded-lg

            /* --- Animación --- */
            animate-in
            fade-in
            zoom-in-95
          `}
        >
          <ShoppingCart size={13} />
          <span>
            {cantidad} u. / ${subtotal.toLocaleString('es-UY')}
          </span>
        </div>
      )}

      {/* BOTÓN QUITAR DEL PEDIDO */}
      {estaSeleccionado && (
        <button
          type="button"
          onClick={handleRemoveClick}
          title="Quitar del pedido"
          aria-label="Quitar del pedido"
          className={`
            /* --- Posición --- */
            absolute
            top-3
            right-3
            z-20
            flex
            items-center
            justify-center

            /* --- Dimensiones --- */
            p-1.5

            /* --- Colores --- */
            bg-vete-error
            text-white
            shadow-md

            /* --- Estilo --- */
            rounded-full

            /* --- Animación --- */
            transition-all
            active:scale-90
            hover:opacity-90
          `}
        >
          <X size={14} />
        </button>
      )}

      {/* =====================================================================
         1. IMAGEN PRINCIPAL
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          relative
          flex
          items-center
          justify-center

          /* --- Dimensiones --- */
          w-full
          h-40
          sm:h-48
          overflow-hidden

          /* --- Colores --- */
          bg-vete-dark/5

          /* --- Estilo --- */
          rounded-2xl
        `}
      >
        <img
          src={producto.imagen_principal_url?.img_url || '/tenant/producto_no_disponible.png'}
          alt={producto.prod_nombre}
          className={`
            /* --- Dimensiones --- */
            w-full
            h-full

            /* --- Estilo --- */
            object-contain
            ${!isAvailable ? 'grayscale-[60%]' : ''}

            /* --- Animación --- */
            transition-transform
            duration-300
            hover:scale-105
          `}
        />
      </div>

      {/* =====================================================================
         2. SUBCATEGORÍAS CON ICONOGRAFÍA AGNÓSTICA (DynamicIcon)
         ===================================================================== */}
      {producto.subcategorias && producto.subcategorias.length > 0 && (
        <div
          className={`
            /* --- Posición --- */
            flex
            flex-wrap
            items-center

            /* --- Dimensiones --- */
            gap-1.5
            pt-1
          `}
        >
          {producto.subcategorias.map((subItem: any) => {
            const sub = subItem.subcategoria || subItem;
            return (
              <div
                key={sub.subc_id}
                title={sub.subc_nombre}
                className={`
                  /* --- Posición --- */
                  flex
                  items-center
                  justify-center

                  /* --- Dimensiones --- */
                  p-1.5

                  /* --- Colores --- */
                  bg-vete-primary/10
                  text-vete-primary
                  border
                  border-vete-primary/20

                  /* --- Estilo --- */
                  rounded-lg
                `}
              >
                {sub.subc_imagen_url ? (
                  <img 
                    src={sub.subc_imagen_url} 
                    alt={sub.subc_nombre} 
                    className="w-3.5 h-3.5 object-contain" 
                  />
                ) : (
                 <DynamicIcon name={sub.subc_icono} size={13} className="text-vete-primary" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
         3. TÍTULO Y DESCRIPCIÓN
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col

          /* --- Dimensiones --- */
          gap-1
        `}
      >
        <h4
          className={`
            /* --- Colores --- */
            text-vete-text-base

            /* --- Texto --- */
            font-bold
            text-base
            leading-snug
            line-clamp-2
          `}
        >
          {producto.prod_nombre}
        </h4>

        <p
          className={`
            /* --- Colores --- */
            text-vete-text-muted

            /* --- Texto --- */
            text-xs
            leading-relaxed
            line-clamp-2
          `}
        >
          {producto.prod_descripcion || "Sin descripción disponible."}
        </p>
      </div>

      {/* =====================================================================
         4. PRECIO Y ACCIONES (WHATSAPP + COMPRAR)
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          justify-between
          items-center

          /* --- Dimensiones --- */
          w-full
          pt-2
          mt-auto

          /* --- Colores --- */
          border-t
          border-vete-border-subtle/40
        `}
      >
        {/* Precio con Moneda */}
        <div
          className={`
            /* --- Posición --- */
            flex
            flex-col
          `}
        >
          <span
            className={`
              /* --- Colores --- */
              text-vete-primary

              /* --- Texto --- */
              text-lg
              sm:text-xl
              font-black
            `}
          >
            ${precioUnitario.toLocaleString('es-UY')}
          </span>

          {!isAvailable && (
            <span
              className={`
                /* --- Colores --- */
                text-vete-error

                /* --- Texto --- */
                text-[10px]
                font-bold
              `}
            >
              Agotado
            </span>
          )}
        </div>

        {/* Acciones */}
        <div
          className={`
            /* --- Posición --- */
            flex
            items-center

            /* --- Dimensiones --- */
            gap-2
          `}
        >
          {/* Botón WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Consultar por WhatsApp"
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              p-2.5

              /* --- Colores --- */
              bg-vete-tertiary
              text-white
              shadow-sm

              /* --- Estilo --- */
              rounded-xl

              /* --- Animación --- */
              transition-transform
              hover:scale-105
              active:scale-95
            `}
          >
            <MessageCircle size={16} />
          </a>

          {/* Botón Comprar / Agregar */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              p-2.5

              /* --- Colores --- */
              bg-vete-primary
              text-white
              shadow-sm

              /* --- Estilo --- */
              rounded-xl

              /* --- Animación --- */
              transition-all
              hover:bg-vete-primary-hover
              active:scale-95
              disabled:opacity-40
              disabled:cursor-not-allowed
            `}
            title={!isAvailable ? "No disponible" : "Agregar al pedido"}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardV1;