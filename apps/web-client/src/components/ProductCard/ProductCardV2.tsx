/* --- apps/web-client/src/components/ProductCard/ProductCardV2.tsx --- */

/**
 * @fileoverview Tarjeta de Producto V2 con Acordeón, Variantes y Control de Disponibilidad
 * 
 * Gestiona el catálogo desacoplándose del conteo numérico estricto de inventario.
 * Evalúa la disponibilidad comercial (activo/pausado) y permite parametrizar 
 * los textos de producto agotado desde la configuración runtime (config.json).
 * 
 * @module components/ProductCard/ProductCardV2
 */

import React, { useState, useMemo } from 'react';
// --- Iconografía Lucide ---
import { ShoppingCart, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
// --- Helpers y Contexto ---
import { DynamicIcon } from '../../components/DynamicIcon';
import { usePedidoStore } from '../../context/pedido_context';
import type { ApiProduct, ProductoVariante } from '../../types/product_types';
import { useConfig } from '../../context/tenant_context';

interface Props {
  producto: ApiProduct;
}

export function ProductCardV2({ producto }: Props) {
  /* ===========================================================================
     1. CONSUMO DEL CONTEXTO Y CONFIGURACIÓN DINÁMICA
     =========================================================================== */
  const { config } = useConfig();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // <!> Mensajes parametrizables desde config.json con fallback defensivo
  const unavailableBadgeText = config?.custom_messages?.product_unavailable_label || 'Agotado';
  const unavailableButtonText = config?.custom_messages?.product_unavailable_btn || 'No disponible';

  /* ===========================================================================
     2. GESTIÓN DE VARIANTES Y DISPONIBILIDAD COMERCIAL
     =========================================================================== */
  const hasVariantes = Boolean(producto.variantes && producto.variantes.length > 0);

  // Inicializa con la primera variante activa/disponible
  const [selectedVariant, setSelectedVariant] = useState<ProductoVariante | null>(() => {
    if (!hasVariantes) return null;
    return (
      producto.variantes.find((v: any) => v.var_disponible !== false && v.var_stock !== 0) ||
      producto.variantes[0] ||
      null
    );
  });

  /**
   * <!> EVALUACIÓN INTELIGENTE DE DISPONIBILIDAD (Sin acople a facturación)
   * 1. Prioriza la bandera booleana 'disponible' (manejada por el admin en Flutter).
   * 2. Si no existe la bandera, solo considera agotado si el stock se fijó explícitamente en 0.
   * 3. Si el stock es null, asume que el comercio no controla inventario y está disponible.
   */
  const isAvailable = useMemo(() => {
    // A. Evaluación a nivel de Variante seleccionada
    if (selectedVariant) {
      if (typeof (selectedVariant as any).var_disponible === 'boolean') {
        return (selectedVariant as any).var_disponible;
      }
      if (selectedVariant.var_stock !== null && selectedVariant.var_stock !== undefined) {
        return selectedVariant.var_stock > 0;
      }
      return true;
    }

    // B. Evaluación a nivel de Producto Padre
    if (typeof (producto as any).prod_disponible === 'boolean') {
      return (producto as any).prod_disponible;
    }
    if (producto.prod_stock !== null && producto.prod_stock !== undefined) {
      return producto.prod_stock > 0;
    }
    return true; // Disponible por defecto
  }, [producto, selectedVariant]);

  /* ===========================================================================
     3. GESTIÓN DEL STORE GLOBAL (CARRITO)
     =========================================================================== */
  const { pedido, addItem, removeItem } = usePedidoStore() as any;

  const lineaActual = useMemo(() => {
    if (!pedido) return null;
    return pedido.find((item: any) => {
      const matchProd = item.producto?.prod_id === producto.prod_id;
      if (!hasVariantes) return matchProd;
      return matchProd && item.variante_seleccionada?.var_id === selectedVariant?.var_id;
    });
  }, [pedido, producto.prod_id, hasVariantes, selectedVariant]);

  const cantidad = lineaActual?.cantidad || 0;
  const estaSeleccionado = cantidad > 0;

  /* ===========================================================================
     4. CÁLCULO DE PRECIO DINÁMICO
     =========================================================================== */
  const precioUnitario = useMemo(() => {
    const adicional = selectedVariant?.var_precio_adicional || 0;
    return producto.prod_precio + adicional;
  }, [producto.prod_precio, selectedVariant]);

  const subtotal = precioUnitario * cantidad;

  /* ===========================================================================
     5. WHATSAPP Y ENLACE SEGURO
     =========================================================================== */
  const rawPhone = config?.contact?.admin_phone || '';
  const countryCode = config?.contact?.whatsapp_country_code || '598';
  const digitsOnly = rawPhone.replace(/\D/g, '');
  const cleanPhone = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
  const formattedPhone = `${countryCode}${cleanPhone}`;

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#prod-${producto.prod_id}`
    : '';

  const variantText = selectedVariant ? ` (Opción: ${selectedVariant.var_nombre})` : '';
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*${variantText}, *$${precioUnitario.toLocaleString('es-UY')}*\n\nVer Producto:\n${productUrl}`
  )}`;

  /* ===========================================================================
     6. HANDLERS DE INTERACCIÓN
     =========================================================================== */
  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAvailable) return;
    
    if (typeof addItem === 'function') {
      addItem(producto, selectedVariant);
    }
  };

  const handleRemoveFromPedido = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (typeof removeItem === 'function') {
      removeItem(producto.prod_id, selectedVariant?.var_id);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      id={`prod-${producto.prod_id}`}
      onClick={() => handleAddToCart()}
      className={`
        /* --- Posición --- */
        relative
        flex
        flex-col
        justify-between

        /* --- Dimensiones --- */
        w-full
        h-full
        min-w-0

        /* --- Colores --- */
        bg-vete-surface
        ${estaSeleccionado 
          ? 'border-2 border-vete-primary' 
          : 'border border-vete-border-subtle hover:border-vete-primary/40'
        }

        /* --- Estilo --- */
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-md
        ${!isAvailable ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}

        /* --- Animación --- */
        transition-all
        duration-200
      `}
    >
      {/* BADGE SUPERIOR IZQUIERDO: Subtotal acumulado */}
      {estaSeleccionado && (
        <div
          className={`
            /* --- Posición --- */
            absolute
            top-2.5
            left-2.5
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

      {/* BOTÓN CANCELAR / QUITAR (Top Right) */}
      {estaSeleccionado && (
        <button
          type="button"
          onClick={handleRemoveFromPedido}
          title="Quitar del pedido"
          aria-label="Quitar del pedido"
          className={`
            /* --- Posición --- */
            absolute
            top-2.5
            right-2.5
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
          <X size={13} />
        </button>
      )}

      {/* =====================================================================
         CONTENEDOR SUPERIOR: Imagen, Badges y Marca de Agotado
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          relative
          flex
          flex-col
          items-center
          justify-center
          flex-1

          /* --- Dimensiones --- */
          p-4
          min-h-[140px]

          /* --- Colores --- */
          bg-vete-surface
        `}
      >
        <img
          src={producto.imagen_principal_url?.img_url || '/tenant/producto_no_disponible.png'}
          alt={producto.prod_nombre}
          className={`
            /* --- Dimensiones --- */
            w-full
            h-32
            sm:h-40

            /* --- Estilo --- */
            object-contain
            ${!isAvailable ? 'grayscale-[60%]' : ''}

            /* --- Animación --- */
            transition-all
            duration-300
            hover:scale-105
          `}
        />

        {/* <!> BADGE FLOTANTE DE NO DISPONIBLE / AGOTADO POR HOY */}
        {!isAvailable && (
          <div
            className={`
              /* --- Posición --- */
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              z-20
              flex
              items-center
              gap-1.5

              /* --- Dimensiones --- */
              px-3
              py-1.5

              /* --- Colores --- */
              bg-vete-dark/90
              text-white
              border
              border-vete-border-subtle/30
              shadow-xl

              /* --- Texto --- */
              text-xs
              font-black
              uppercase
              tracking-wider

              /* --- Estilo --- */
              rounded-xl
            `}
          >
            <AlertCircle size={14} className="text-vete-error" />
            <span>{unavailableBadgeText}</span>
          </div>
        )}

        {/* Badges de Subcategoría (Agnósticos) */}
        {producto.subcategorias && producto.subcategorias.length > 0 && (
          <div
            className={`
              /* --- Posición --- */
              absolute
              bottom-2
              left-2.5
              flex
              items-center

              /* --- Dimensiones --- */
              gap-1
            `}
          >
            {producto.subcategorias.map((sub) => (
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
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
         CONTENEDOR INFERIOR: Título, Variantes, Precios y Compra
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          justify-between
          flex-1

          /* --- Dimensiones --- */
          p-3.5
          gap-2.5

          /* --- Colores --- */
          bg-vete-dark/5
          border-t
          border-vete-border-subtle/50
        `}
      >
        <div>
          <h4
            className={`
              /* --- Colores --- */
              text-vete-text-base

              /* --- Texto --- */
              font-bold
              text-sm
              sm:text-base
              leading-snug
              line-clamp-2
            `}
          >
            {producto.prod_nombre}
          </h4>
        </div>

        {/* Selector de Variantes (Talles / Presentaciones) */}
        {hasVariantes && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`
              /* --- Posición --- */
              flex
              flex-col

              /* --- Dimensiones --- */
              gap-1.5
              pt-0.5
            `}
          >
            <div
              className={`
                /* --- Posición --- */
                flex
                flex-wrap
                items-center

                /* --- Dimensiones --- */
                gap-1.5
              `}
            >
              {producto.variantes.map((v: any) => {
                const isSelected = selectedVariant?.var_id === v.var_id;
                // <!> Evalúa disponibilidad de la opción puntual
                const isOptionUnavailable = v.var_disponible === false || v.var_stock === 0;

                return (
                  <button
                    key={v.var_id}
                    type="button"
                    disabled={isOptionUnavailable}
                    onClick={() => setSelectedVariant(v)}
                    className={`
                      /* --- Posición --- */
                      flex
                      items-center

                      /* --- Dimensiones --- */
                      px-2
                      py-0.5
                      gap-1

                      /* --- Colores --- */
                      ${isSelected
                        ? 'bg-vete-primary text-white border-vete-primary shadow-sm'
                        : isOptionUnavailable
                        ? 'bg-transparent text-vete-text-muted/40 border-vete-border-subtle/30 line-through cursor-not-allowed'
                        : 'bg-vete-surface text-vete-text-base border-vete-border-subtle hover:border-vete-primary/60'
                      }
                      border

                      /* --- Texto --- */
                      text-[10px]
                      font-bold

                      /* --- Estilo --- */
                      rounded-md
                      outline-none

                      /* --- Animación --- */
                      transition-all
                      duration-150
                      active:scale-95
                    `}
                    title={isOptionUnavailable ? unavailableBadgeText : `${v.var_tipo}: ${v.var_nombre}`}
                  >
                    <span>{v.var_nombre}</span>
                    {v.var_precio_adicional > 0 && (
                      <span className="text-[9px] opacity-80 font-normal">
                        (+${v.var_precio_adicional})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Muestrario de Color */}
            {selectedVariant?.color && (
              <div
                className={`
                  /* --- Posición --- */
                  flex
                  items-center

                  /* --- Dimensiones --- */
                  gap-1.5
                `}
              >
                <span
                  style={{ backgroundColor: selectedVariant.color.col_hex }}
                  className={`
                    /* --- Dimensiones --- */
                    w-3
                    h-3

                    /* --- Colores --- */
                    border
                    border-white
                    shadow-sm

                    /* --- Estilo --- */
                    rounded-full
                  `}
                />
                <span
                  className={`
                    /* --- Colores --- */
                    text-vete-text-muted

                    /* --- Texto --- */
                    text-[10px]
                    font-medium
                  `}
                >
                  {selectedVariant.color.col_nombre}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Precio y Botón de Compra */}
        <div
          className={`
            /* --- Posición --- */
            flex
            flex-col
            gap-2
            mt-auto
            w-full
          `}
        >
          <div
            className={`
              /* --- Posición --- */
              flex
              items-baseline
              justify-between
            `}
          >
            <div className="flex items-baseline gap-1">
              <span
                className={`
                  /* --- Colores --- */
                  text-vete-primary

                  /* --- Texto --- */
                  text-xs
                  font-bold
                `}
              >
                $
              </span>
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
                {precioUnitario.toLocaleString('es-UY')}
              </span>
            </div>

            {/* Indicador de estado al lado del precio */}
            {!isAvailable && (
              <span
                className={`
                  /* --- Colores --- */
                  text-vete-error

                  /* --- Texto --- */
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                `}
              >
                {unavailableBadgeText}
              </span>
            )}
          </div>

          {/* Botón Comprar / Agotado */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => handleAddToCart(e)}
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center
              gap-2

              /* --- Dimensiones --- */
              w-full
              py-2
              px-3

              /* --- Colores --- */
              ${isAvailable 
                ? 'bg-vete-primary text-white hover:bg-vete-primary-hover shadow-sm active:scale-95' 
                : 'bg-vete-dark/20 text-vete-text-muted/60 cursor-not-allowed'
              }

              /* --- Texto --- */
              text-xs
              font-bold
              uppercase
              tracking-wider

              /* --- Estilo --- */
              rounded-xl
              outline-none

              /* --- Animación --- */
              transition-all
              duration-150
            `}
          >
            <span>{isAvailable ? 'Comprar' : unavailableButtonText}</span>
            {isAvailable && <ShoppingCart size={14} className="text-white" />}
          </button>
        </div>

        {/* Botón Desplegable del Acordeón */}
        <button
          type="button"
          onClick={toggleExpand}
          title={isExpanded ? "Ver menos detalles" : "Ver más detalles"}
          className={`
            /* --- Posición --- */
            flex
            items-center
            justify-center

            /* --- Dimensiones --- */
            w-full
            pt-1

            /* --- Colores --- */
            text-vete-text-muted
            hover:text-vete-primary

            /* --- Estilo --- */
            outline-none

            /* --- Animación --- */
            transition-colors
          `}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Contenido Expandido del Acordeón */}
        {isExpanded && (
          <div
            className={`
              /* --- Posición --- */
              flex
              flex-col
              gap-2.5

              /* --- Dimensiones --- */
              pt-2

              /* --- Colores --- */
              border-t
              border-vete-border-subtle/40

              /* --- Animación --- */
              animate-in
              fade-in
              duration-200
            `}
          >
            <p
              className={`
                /* --- Colores --- */
                text-vete-text-muted

                /* --- Texto --- */
                text-xs
                leading-relaxed
                break-words
              `}
            >
              {producto.prod_descripcion || "Sin descripción disponible."}
            </p>

            {/* Botón WhatsApp Directo */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`
                /* --- Posición --- */
                flex
                items-center
                justify-center
                gap-2

                /* --- Dimensiones --- */
                w-full
                py-2
                px-3

                /* --- Colores --- */
                bg-vete-tertiary
                text-white
                shadow-sm

                /* --- Texto --- */
                text-xs
                font-bold

                /* --- Estilo --- */
                rounded-xl

                /* --- Animación --- */
                transition-all
                hover:opacity-90
              `}
            >
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardV2;