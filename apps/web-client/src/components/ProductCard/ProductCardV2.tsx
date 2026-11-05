/* --- apps/web-client/src/components/ProductCard/ProductCardV2.tsx --- */

/**
 * @fileoverview Tarjeta de Producto V2 con Acordeón, Variantes y Control de Disponibilidad
 * 
 * Gestiona el catálogo desacoplándose del conteo numérico estricto de inventario.
 * Evalúa la disponibilidad comercial (activo/pausado), soporta precios absolutos por
 * variante, ventas por encargo y renderizado agnóstico de subcategorías.
 * 
 * @module components/ProductCard/ProductCardV2
 */

import React, { useState, useMemo } from 'react';
// --- Iconografía Lucide ---
import { ShoppingCart, X, ChevronDown, ChevronUp, AlertCircle, Clock } from 'lucide-react';
// --- Helpers y Contexto ---
import { DynamicIcon } from '../DynamicIcon';
import { usePedidoStore } from '../../context/pedido_context';
import type { ApiProduct, ProductoVariante } from '../../types/product_types';
import { useConfig } from '../../context/tenant_context';

interface Props {
  producto: ApiProduct;
}

/**
 * Tarjeta interactiva de catálogo con acordeón expandible y variantes (`ProductCardV2`).
 *
 * @component
 * @param {Props} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
export function ProductCardV2({ producto }: Props) {
  /* ===========================================================================
     1. CONSUMO DEL CONTEXTO Y CONFIGURACIÓN DINÁMICA
     =========================================================================== */
  const { config } = useConfig();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Mensajes parametrizables desde config.json
  const unavailableBadgeText = config?.custom_messages?.product_unavailable_label || 'Agotado';
  const unavailableButtonText = config?.custom_messages?.product_unavailable_btn || 'No disponible';

  /* ===========================================================================
     2. GESTIÓN DE VARIANTES Y ESTADO INICIAL
     =========================================================================== */
  const hasVariantes = Boolean(producto.variantes && producto.variantes.length > 0);

  // <!> Si el producto exige elegir variante obligatoriamente, arranca en null
  const [selectedVariant, setSelectedVariant] = useState<ProductoVariante | null>(() => {
    if (!hasVariantes) return null;
    if (producto.prod_solo_variantes) return null;

    // Busca la primera variante disponible o con permiso de venta por encargo
    return (
      producto.variantes.find(
        (v) => v.var_disponible && (v.var_stock > 0 || v.var_permitir_sin_stock || producto.prod_per_sin_stock)
      ) ||
      producto.variantes[0] ||
      null
    );
  });

  /* ===========================================================================
     3. EVALUACIÓN DE DISPONIBILIDAD Y PEDIDOS POR ENCARGO
     =========================================================================== */
  const { isAvailable, isEncargo } = useMemo(() => {
    // 1. Si el producto padre fue pausado por el comercio, nada se puede comprar
    if (producto.prod_disponible === false) {
      return { isAvailable: false, isEncargo: false };
    }

    // 2. Evaluación a nivel de Variante seleccionada
    if (selectedVariant) {
      if (!selectedVariant.var_disponible) {
        return { isAvailable: false, isEncargo: false };
      }

      const hasStock = selectedVariant.var_stock > 0;
      const canBackorder = selectedVariant.var_permitir_sin_stock || producto.prod_per_sin_stock;

      if (!hasStock && canBackorder) {
        return { isAvailable: true, isEncargo: true };
      }
      if (!hasStock && !canBackorder) {
        return { isAvailable: false, isEncargo: false };
      }

      return { isAvailable: true, isEncargo: false };
    }

    // 3. Evaluación para Producto Simple (sin variantes)
    const hasStock = producto.prod_stock !== null && producto.prod_stock !== undefined ? producto.prod_stock > 0 : true;

    if (!hasStock && producto.prod_per_sin_stock) {
      return { isAvailable: true, isEncargo: true };
    }
    if (!hasStock && !producto.prod_per_sin_stock) {
      return { isAvailable: false, isEncargo: false };
    }

    return { isAvailable: true, isEncargo: false };
  }, [producto.prod_disponible, producto.prod_stock, producto.prod_per_sin_stock, selectedVariant]);

  // Bloqueo condicional si exige elegir talle
  const requiresVariantSelection = producto.prod_solo_variantes && hasVariantes && !selectedVariant;

  /* ===========================================================================
     4. GESTIÓN DEL STORE GLOBAL (CARRITO)
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
     5. CÁLCULO DE PRECIO ABSOLUTO (Sin sumas adicionales)
     =========================================================================== */
  // <!> Toma directamente el precio_venta final de la variante o del producto padre
  const precioFinal = useMemo((): number => {
    if (selectedVariant) {
      return selectedVariant.var_precio_venta;
    }
    return producto.prod_precio_venta;
  }, [producto.prod_precio_venta, selectedVariant]);

  const subtotal = precioFinal * cantidad;

  /* ===========================================================================
     6. WHATSAPP Y ENLACE SEGURO
     =========================================================================== */
  const rawPhone = config?.contact?.admin_phone || '';
  const countryCode = config?.contact?.whatsapp_country_code || '598';
  const cleanPhone = `${countryCode}${rawPhone.replace(/\D/g, '').replace(/^0/, '')}`;

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#prod-${producto.prod_id}`
    : '';

  const variantText = selectedVariant ? ` (Presentación: ${selectedVariant.var_nombre})` : '';
  const encargoNote = isEncargo ? ' [Pedido por Encargo]' : '';
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola! Estoy interesado en el producto: *${producto.prod_nombre}*${variantText}${encargoNote}, *$${precioFinal.toLocaleString('es-UY')}*.\n\nVer Producto:\n${productUrl}`
  )}`;

  /* ===========================================================================
     7. HANDLERS DE INTERACCIÓN
     =========================================================================== */
  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isAvailable || requiresVariantSelection) return;

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
    setIsExpanded((prev) => !prev);
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
          ? 'border-2 border-vete-primary shadow-md' 
          : 'border border-vete-border-subtle hover:border-vete-primary/40 shadow-sm'
        }

        /* --- Estilo --- */
        rounded-2xl
        overflow-hidden
        ${!isAvailable ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}

        /* --- Animación --- */
        transition-all
        duration-200
        hover:shadow-md
      `}
    >
      {/* BADGE: Subtotal y Cantidad Acumulada */}
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
         1. CONTENEDOR SUPERIOR: Imagen, Badges y Marca de Agotado
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

        {/* BADGE CENTRAL: No disponible / Agotado */}
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

        {/* BADGES DE SUBCATEGORÍA CON ÍCONOS DEL BACKEND */}
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
         2. CONTENEDOR INFERIOR: Título, Variantes, Precios y Compra
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

        {/* SELECTOR DE VARIANTES COMPACTO */}
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
              {producto.variantes.map((v) => {
                const isSelected = selectedVariant?.var_id === v.var_id;
                
                // Deshabilitado solo si está apagada por el dueño o agotada sin permiso de encargo
                const isOptionDisabled = 
                  !v.var_disponible || 
                  (v.var_stock <= 0 && !v.var_permitir_sin_stock && !producto.prod_per_sin_stock);

                return (
                  <button
                    key={v.var_id}
                    type="button"
                    disabled={isOptionDisabled}
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
                        : isOptionDisabled
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
                    title={`${v.var_tipo}: ${v.var_nombre} - $${v.var_precio_venta}`}
                  >
                    <span>{v.var_nombre}</span>
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

        {/* PRECIO Y BOTÓN DE COMPRA */}
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
                {precioFinal.toLocaleString('es-UY')}
              </span>
            </div>

            {/* Estados de Disponibilidad */}
            {!isAvailable ? (
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
            ) : isEncargo ? (
              <span
                className={`
                  /* --- Colores --- */
                  text-vete-tertiary

                  /* --- Texto --- */
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                `}
              >
                Por Encargo
              </span>
            ) : null}
          </div>

          {/* Botón Comprar / Por Encargo / Agotado */}
          <button
            type="button"
            disabled={!isAvailable || requiresVariantSelection}
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
              ${!isAvailable || requiresVariantSelection
                ? 'bg-vete-dark/20 text-vete-text-muted/60 cursor-not-allowed'
                : 'bg-vete-primary text-white hover:bg-vete-primary-hover shadow-sm active:scale-95'
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
            <span>
              {!isAvailable
                ? unavailableButtonText
                : requiresVariantSelection
                ? 'Elegir opción'
                : isEncargo
                ? 'Pedir por Encargo'
                : 'Comprar'}
            </span>
            {isAvailable && !requiresVariantSelection && (
              isEncargo ? <Clock size={14} className="text-white" /> : <ShoppingCart size={14} className="text-white" />
            )}
          </button>
        </div>

        {/* BOTÓN DESPLEGABLE DEL ACORDEÓN */}
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

        {/* CONTENIDO EXPANDIDO DEL ACORDEÓN */}
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