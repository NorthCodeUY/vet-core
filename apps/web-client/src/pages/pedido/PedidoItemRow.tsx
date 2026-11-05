/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

/**
 * @fileoverview Fila de Ítem de Pedido en Drawer de Checkout (PedidoItemRow)
 * 
 * Gestiona la visualización individual de un producto o variante dentro del carrito.
 * Diferencia claramente combinaciones de talles y colores mediante badges visuales,
 * calcula subtotales en vivo y aísla el control de cantidades por `item_key`.
 * 
 * @module pages/pedido/PedidoItemRow
 */

import React, { useState, useEffect } from 'react';
// --- Iconografía Vectorial Lucide ---
import { Plus, Minus, Trash2, Tag } from 'lucide-react';

// --- Estado Global y Tipos de Dominio ---
import { usePedidoStore } from '../../context/pedido_context';
import type { PedidoItem } from '../../types/pedido_types';

/**
 * Propiedades del componente `PedidoItemRow`.
 * 
 * @interface PedidoItemRowProps
 * @property {PedidoItem} item - Línea del pedido con producto, variante y precio congelado.
 */
interface PedidoItemRowProps {
  item: PedidoItem;
}

/**
 * Línea interactiva de producto/variante en el carrito (`PedidoItemRow`).
 *
 * @component
 * @param {PedidoItemRowProps} props - Propiedades del ítem de pedido.
 * @returns {JSX.Element} Fila con miniatura, badge de talle/color y selector de cantidad.
 */
export const PedidoItemRow: React.FC<PedidoItemRowProps> = ({ item }) => {
  /* ===========================================================================
     1. CONSUMO DEL STORE GLOBAL Y ESTADOS LOCALES
     =========================================================================== */
  const { updateItemQuantity } = usePedidoStore();

  // Estado buffer local para permitir al usuario tipear cantidades manualmente
  const [quantityInput, setQuantityInput] = useState<string>(String(item.cantidad));

  // Sincronización reactiva si la cantidad cambia externamente
  useEffect(() => {
    setQuantityInput(String(item.cantidad));
  }, [item.cantidad]);

  // Subtotal inmutable de la línea
  const subtotal = item.precio_unitario_capturado * item.cantidad;

  // Resolución segura de la imagen (Soporta contrato nuevo y viejo)
  const imagenUrl = 
    item.producto.imagen_principal_url?.img_url || 
    (item.producto as any).imagenes?.find((img: any) => img.img_principal)?.img_url ||
    (item.producto as any).imagenes?.[0]?.img_url ||
    '/tenant/producto_no_disponible.png';

  /* ===========================================================================
     2. MANEJADORES DE NEGOCIO (AISLADOS POR item_key)
     =========================================================================== */

  /**
   * Procesa la entrada manual en el input numérico.
   * <!> Usa item.item_key para no alterar otras variantes del mismo producto.
   */
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuantityInput(value);

    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericValue) || value.trim() === '') {
      return;
    }

    const newQuantity = Math.max(1, numericValue);

    if (newQuantity !== item.cantidad) {
      updateItemQuantity(item.item_key, newQuantity);
    }
  };

  /**
   * Valida la cantidad al perder el foco el input.
   */
  const handleQuantityInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim();
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    let finalQuantity = item.cantidad;

    if (!isNaN(numericValue) && value !== '') {
      finalQuantity = Math.max(1, numericValue);
    } else if (value === '') {
      finalQuantity = 1;
    }

    if (finalQuantity !== item.cantidad) {
      updateItemQuantity(item.item_key, finalQuantity);
    }

    setQuantityInput(String(finalQuantity));
  };

  /**
   * Reduce la cantidad unitaria de esta variante específica.
   */
  const handleDecrement = (): void => {
    updateItemQuantity(item.item_key, item.cantidad - 1);
  };

  /**
   * Incrementa la cantidad unitaria de esta variante específica.
   */
  const handleIncrement = (): void => {
    updateItemQuantity(item.item_key, item.cantidad + 1);
  };

  /* ===========================================================================
     3. RENDERIZADO VISUAL
     =========================================================================== */
  return (
    <div
      className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        gap-3                        /* Separación horizontal interna */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del drawer */
        p-2.5                        /* Padding interno compacto */

        /* --- Colores --- */
        bg-vete-surface              /* Fondo de tarjeta institucional */
        border                       /* Habilita borde */
        border-vete-border-subtle    /* Borde institucional suave */
        shadow-sm                    /* Sombra suave */
        focus-within:ring-1
        focus-within:ring-vete-primary/50

        /* --- Estilo --- */
        rounded-xl                   /* Esquinas redondeadas */

        /* --- Animación --- */
        transition-all
        duration-200
        hover:shadow-md
      `}
    >
      {/* 1. Miniatura del Producto */}
      <div
        className={`
          /* --- Posición --- */
          shrink-0                     /* Previene deformación */

          /* --- Dimensiones --- */
          w-14                         /* Ancho fijo de 3.5rem */
          h-14                         /* Alto fijo de 3.5rem */

          /* --- Colores --- */
          bg-vete-dark/5

          /* --- Estilo --- */
          rounded-lg
          overflow-hidden
        `}
      >
        <img
          src={imagenUrl}
          alt={item.producto.prod_nombre}
          className={`
            /* --- Dimensiones --- */
            w-full
            h-full

            /* --- Estilo --- */
            object-cover
          `}
        />
      </div>

      {/* 2. Información del Producto y Detalles de Variante */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          flex-1
          min-w-0
        `}
      >
        {/* Nombre del Producto */}
        <h4
          className={`
            /* --- Colores --- */
            text-vete-text-base

            /* --- Texto --- */
            text-sm
            font-bold
            truncate
          `}
        >
          {item.producto.prod_nombre}
        </h4>

        {/* ===================================================================
           <!> BADGE VISUAL DE VARIANTE (TALLE, MEDIDA Y COLOR)
           Diferencia claramente líneas del mismo producto con opciones distintas
           =================================================================== */}
        {item.variante_seleccionada ? (
          <div
            className={`
              /* --- Posición --- */
              inline-flex
              items-center
              gap-1.5

              /* --- Dimensiones --- */
              mt-1
              px-2
              py-0.5
              w-fit

              /* --- Colores --- */
              bg-vete-primary/10
              border
              border-vete-primary/20
              text-vete-primary

              /* --- Texto --- */
              text-[10px]
              font-bold

              /* --- Estilo --- */
              rounded-md
            `}
          >
            {/* Círculo de Color si está disponible */}
            {item.variante_seleccionada.color && (
              <span
                style={{ backgroundColor: item.variante_seleccionada.color.col_hex }}
                className={`
                  /* --- Dimensiones --- */
                  w-2.5
                  h-2.5

                  /* --- Colores --- */
                  border
                  border-white/50
                  shadow-sm

                  /* --- Estilo --- */
                  rounded-full
                `}
              />
            )}

            <span>
              {item.variante_seleccionada.var_tipo}: {item.variante_seleccionada.var_nombre}
            </span>

            {item.variante_seleccionada.color && (
              <span className="opacity-80 font-normal">
                ({item.variante_seleccionada.color.col_nombre})
              </span>
            )}
          </div>
        ) : (
          /* Indicador neutro para productos simples */
          <div
            className={`
              /* --- Posición --- */
              flex
              items-center
              gap-1

              /* --- Dimensiones --- */
              mt-0.5

              /* --- Colores --- */
              text-vete-text-muted

              /* --- Texto --- */
              text-[10px]
            `}
          >
            <Tag size={10} />
            <span>Estándar</span>
          </div>
        )}

        {/* Precio unitario capturado real */}
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`
              /* --- Colores --- */
              text-vete-text-muted

              /* --- Texto --- */
              text-xs
              font-medium
            `}
          >
            ${item.precio_unitario_capturado.toLocaleString('es-UY')} c/u
          </span>
        </div>
      </div>

      {/* 3. Controles de Cantidad y Subtotal */}
      <div
        className={`
          /* --- Posición --- */
          flex
          flex-col
          items-end
          gap-1.5
        `}
      >
        {/* Subtotal de esta línea específica */}
        <span
          className={`
            /* --- Colores --- */
            text-vete-primary

            /* --- Texto --- */
            text-sm
            font-black
          `}
        >
          ${subtotal.toLocaleString('es-UY')}
        </span>

        {/* Controles Incrementales */}
        <div
          className={`
            /* --- Posición --- */
            flex
            items-center
            gap-0.5

            /* --- Colores --- */
            bg-vete-dark/5
            border
            border-vete-border-subtle

            /* --- Estilo --- */
            rounded-lg

            /* --- Animación --- */
            transition-all
            duration-150
          `}
        >
          {/* Botón Decrementar / Eliminar */}
          <button
            type="button"
            onClick={handleDecrement}
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              p-1.5

              /* --- Colores --- */
              text-vete-error
              hover:bg-vete-error
              hover:text-white

              /* --- Estilo --- */
              rounded-l-md
              outline-none

              /* --- Animación --- */
              transition-colors
              duration-200
              focus:ring-2
              focus:ring-vete-primary
            `}
            aria-label={item.cantidad <= 1 ? "Eliminar producto" : "Decrementar cantidad"}
          >
            {item.cantidad <= 1 ? <Trash2 size={15} /> : <Minus size={15} />}
          </button>

          {/* Input Numérico Editable */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            onChange={handleQuantityInputChange}
            onBlur={handleQuantityInputBlur}
            className={`
              /* --- Posición --- */
              text-center

              /* --- Dimensiones --- */
              w-9

              /* --- Colores --- */
              bg-transparent
              text-vete-text-base
              border-x
              border-vete-border-subtle/50

              /* --- Texto --- */
              text-xs
              font-bold

              /* --- Estilo --- */
              outline-none
              appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
              [-moz-appearance:textfield]

              /* --- Animación --- */
              transition-colors
              duration-150
            `}
            aria-label={`Cantidad de ${item.producto.prod_nombre}`}
          />

          {/* Botón Incrementar */}
          <button
            type="button"
            onClick={handleIncrement}
            className={`
              /* --- Posición --- */
              flex
              items-center
              justify-center

              /* --- Dimensiones --- */
              p-1.5

              /* --- Colores --- */
              text-vete-tertiary
              hover:bg-vete-tertiary
              hover:text-white

              /* --- Estilo --- */
              rounded-r-md
              outline-none

              /* --- Animación --- */
              transition-colors
              duration-200
              focus:ring-2
              focus:ring-vete-primary
            `}
            aria-label="Incrementar cantidad"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoItemRow;