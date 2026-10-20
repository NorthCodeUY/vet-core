/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

/**
 * @fileoverview Fila de Ítem de Pedido en Drawer de Checkout (PedidoItemRow)
 * 
 * Gestiona la visualización individual de un producto dentro del carrito, 
 * el cálculo en tiempo real de subtotales por línea y el control granular 
 * de cantidades mediante controles incrementales o entrada manual.
 * 
 * @module pages/pedido/PedidoItemRow
 */

import React, { useState, useEffect } from 'react';
// --- Iconografía Vectorial Lucide ---
import { Plus, Minus, Trash2 } from 'lucide-react';

// --- Estado Global y Tipos de Dominio ---
import { usePedidoStore } from '../../context/pedido_context';
import type { PedidoItem } from '../../types/pedido_types';

/**
 * Propiedades del componente `PedidoItemRow`.
 * 
 * @interface PedidoItemRowProps
 * @property {PedidoItem} item - Entidad del producto agregado con cantidad y precio capturado.
 */
interface PedidoItemRowProps {
  item: PedidoItem;
}

/**
 * Línea interactiva de producto dentro del carrito de compras (`PedidoItemRow`).
 *
 * @component
 * @param {PedidoItemRowProps} props - Propiedades del ítem de pedido.
 * @returns {JSX.Element} Fila con miniatura, detalle de producto y selector de cantidad.
 */
export const PedidoItemRow: React.FC<PedidoItemRowProps> = ({ item }) => {
  /* ===========================================================================
     1. CONSUMO DEL STORE GLOBAL Y ESTADOS LOCALES
     =========================================================================== */
  const { updateItemQuantity } = usePedidoStore();

  // Estado buffer local para permitir al usuario tipear valores libremente antes de sincronizar
  const [quantityInput, setQuantityInput] = useState<string>(String(item.cantidad));

  /* 
   * Sincronización reactiva: Si la cantidad en el store cambia externamente
   * (ej: decremento que elimina el item o vaciado masivo), se actualiza el input.
   */
  useEffect(() => {
    setQuantityInput(String(item.cantidad));
  }, [item.cantidad]);

  // Subtotal inmutable calculado por ítem
  const subtotal = item.precio_unitario_capturado * item.cantidad;

  /* ===========================================================================
     2. MANEJADORES DE NEGOCIO Y CONTROL DE CANTIDAD
     =========================================================================== */

  /**
   * Procesa la entrada manual de caracteres en el input numérico.
   * Filtra caracteres no válidos y previene renders innecesarios.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuantityInput(value);

    // Sanitización: permite únicamente dígitos del 0 al 9
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericValue) || value.trim() === '') {
      return; // Permite el campo temporalmente vacío mientras el usuario tipea
    }

    // Regla de negocio: La cantidad mínima permitida en el carrito es 1
    const newQuantity = Math.max(1, numericValue);

    if (newQuantity !== item.cantidad) {
      updateItemQuantity(item.producto.prod_id, newQuantity);
    }
  };

  /**
   * Valida y asegura el valor final al perder el foco el input.
   * Si el usuario dejó el campo en blanco, restaura a la unidad mínima (1).
   * 
   * @param {React.FocusEvent<HTMLInputElement>} e - Evento de pérdida de foco.
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
      updateItemQuantity(item.producto.prod_id, finalQuantity);
    }

    setQuantityInput(String(finalQuantity));
  };

  /**
   * Reduce la cantidad unitaria. Si llega a cero, el store lo elimina del pedido.
   */
  const handleDecrement = (): void => {
    updateItemQuantity(item.producto.prod_id, item.cantidad - 1);
  };

  /**
   * Incrementa la cantidad unitaria en una posición.
   */
  const handleIncrement = (): void => {
    updateItemQuantity(item.producto.prod_id, item.cantidad + 1);
  };

  /* ===========================================================================
     3. RENDERIZADO VISUAL
     =========================================================================== */
  return (
    <div
      className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical de elementos */
        gap-3                        /* Separación horizontal interna */

        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del contenedor del drawer */
        p-2.5                        /* Padding interno compacto */

        /* --- Colores --- */
        bg-vete-surface              /* Fondo de tarjeta adaptado al tema */
        border                       /* Habilita trazo de borde */
        border-vete-border-subtle    /* Borde suave institucional */
        shadow-sm                    /* Sombra suave */
        focus-within:ring-1          /* Anillo de foco accesible */
        focus-within:ring-vete-primary/50 /* Color de foco institucional */

        /* --- Estilo --- */
        rounded-xl                   /* Esquinas redondeadas */

        /* --- Animación --- */
        transition-all               /* Transición fluida de propiedades */
        duration-200                 /* 200ms de respuesta */
        hover:shadow-md              /* Elevación sutil al pasar el cursor */
      `}
    >
      {/* 1. Miniatura del Producto */}
      <div
        className={`
          /* --- Posición --- */
          shrink-0                     /* Previene deformación o aplastamiento */

          /* --- Dimensiones --- */
          w-14                         /* Ancho fijo de 3.5rem */
          h-14                         /* Alto fijo de 3.5rem */

          /* --- Colores --- */
          bg-vete-dark/5               /* Fondo neutro de respaldo */

          /* --- Estilo --- */
          rounded-lg                   /* Bordes curvos */
          overflow-hidden              /* Contiene el radio de la imagen */
        `}
      >
        <img
          src={item.producto.imagen_principal_url?.img_url || '/tenant/producto_no_disponible.png'}
          alt={item.producto.prod_nombre}
          className={`
            /* --- Dimensiones --- */
            w-full
            h-full

            /* --- Estilo --- */
            object-cover               /* Preserva proporción fotográfica */
          `}
        />
      </div>

      {/* 2. Información del Producto */}
      <div
        className={`
          /* --- Posición --- */
          flex                         /* Layout en columna */
          flex-col
          flex-1                       /* Expansión flexible central */
          min-w-0                      /* Obligatorio para truncado de texto elíptico */
        `}
      >
        <h4
          className={`
            /* --- Colores --- */
            text-vete-text-base        /* Color principal de alto contraste */

            /* --- Texto --- */
            text-sm                    /* Tamaño compacto */
            font-bold                  /* Grosor tipográfico 700 */
            truncate                   /* Elipsis (...) si desborda */
          `}
        >
          {item.producto.prod_nombre}
        </h4>

        <div className="flex items-center gap-1 mt-0.5">
          <span
            className={`
              /* --- Colores --- */
              text-vete-text-muted     /* Color secundario legible */

              /* --- Texto --- */
              text-xs                  /* Tamaño micro */
              font-medium              /* Grosor 500 */
            `}
          >
            ${item.producto.prod_precio.toLocaleString('es-UY')} c/u
          </span>
        </div>
      </div>

      {/* 3. Controles de Cantidad y Subtotal */}
      <div
        className={`
          /* --- Posición --- */
          flex                         /* Disposición vertical */
          flex-col
          items-end                    /* Alineado al margen derecho */
          gap-1.5                      /* Espaciado vertical entre precio y botones */
        `}
      >
        {/* Subtotal Calculado */}
        <span
          className={`
            /* --- Colores --- */
            text-vete-primary          /* Color destacado institucional */

            /* --- Texto --- */
            text-sm                    /* Tamaño estándar */
            font-black                 /* Grosor máximo 900 */
          `}
        >
          ${subtotal.toLocaleString('es-UY')}
        </span>

        {/* Controles de Incremento / Decremento */}
        <div
          className={`
            /* --- Posición --- */
            flex                       /* Fila horizontal */
            items-center               /* Centrado vertical */
            gap-0.5                    /* Espacio mínimo entre controles */

            /* --- Colores --- */
            bg-vete-dark/5             /* Tinte estructural suave */
            border                     /* Borde delimitador */
            border-vete-border-subtle  /* Borde institucional */

            /* --- Estilo --- */
            rounded-lg                 /* Borde redondeado */

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
              p-1.5                    /* Área táctil de 6px */

              /* --- Colores --- */
              text-vete-error          /* Rojo semántico para acción destructiva */
              hover:bg-vete-error      /* Relleno rojo en hover */
              hover:text-white         /* Contraste blanco */

              /* --- Estilo --- */
              rounded-l-md             /* Radio curvo izquierdo */
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

          {/* <!> Input Numérico Editable Corregido (text-vete-text-base) */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            onChange={handleQuantityInputChange}
            onBlur={handleQuantityInputBlur}
            className={`
              /* --- Posición --- */
              text-center              /* Centrado del dígito */

              /* --- Dimensiones --- */
              w-9                      /* Ancho controlado de 2.25rem */

              /* --- Colores --- */
              bg-transparent           /* Fondo translúcido integrado al contenedor */
              /* <!> MODIFICACIÓN: Aplicación del token semántico principal para lectura nítida */
              text-vete-text-base      /* Contraste absoluto en cualquier tema */
              border-x                 /* Separadores verticales */
              border-vete-border-subtle/50

              /* --- Texto --- */
              text-xs                  /* Tamaño compacto */
              font-bold                /* Grosor 700 */

              /* --- Estilo --- */
              outline-none             /* Remueve foco predeterminado del navegador */
              appearance-none          /* Desactiva flechas nativas */
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
              text-vete-tertiary       /* Color de confirmación / acción */
              hover:bg-vete-tertiary   /* Relleno en hover */
              hover:text-white         /* Texto blanco */

              /* --- Estilo --- */
              rounded-r-md             /* Radio curvo derecho */
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