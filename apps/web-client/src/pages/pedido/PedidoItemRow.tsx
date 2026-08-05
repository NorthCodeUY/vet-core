/* --- apps/web-client/src/pages/pedido/PedidoItemRow.tsx --- */

import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { usePedidoStore } from '../../context/pedido_context';
import type { PedidoItem } from '../../types/pedido_types';

/**
 * Interfaz que define las props del componente PedidoItemRow
 * @param item - Objeto de tipo PedidoItem que representa un producto en el carrito
 */
interface PedidoItemRowProps {
  item: PedidoItem;
}

/**
 * Representa una "Línea de Pedido" dentro del Drawer del carrito.
 * Implementa controles de cantidad editables y visualización de subtotal por producto.
 */
export const PedidoItemRow = ({ item }: PedidoItemRowProps) => {


  const {
    updateItemQuantity
  } = usePedidoStore();

  /* Estado local para el valor del input de cantidad, se inicializa con la cantidad del item */
  const [quantityInput, setQuantityInput] = useState(String(item.cantidad));

  /*
   * Sincroniza el estado local del input con la cantidad del item del contexto.
   * Esto es crucial para que el input se actualice si la cantidad cambia externamente
   * (ej. si se presiona el botón '-' y el ítem se elimina).
   */
  useEffect(() => {
    setQuantityInput(String(item.cantidad));
  }, [item.cantidad]);


  /* Cálculo del subtotal de esta línea específica */
  const subtotal = item.precio_unitario_capturado * item.cantidad;

  /**
   * Maneja el cambio manual en el input de cantidad.
   * Actualiza el estado local del input y el contexto si es una entrada válida.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
   */
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantityInput(value); // Actualiza el estado local inmediatamente para feedback visual

    // Elimina caracteres no numéricos y permite vaciar temporalmente
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericValue) || value.trim() === '') {
      // Si no es un número válido o está vacío, no actualizamos el contexto todavía
      // La validación final y sincronización se hará en onBlur
      return;
    }

    // Validar cantidad mínima de 1 para el contexto, si el usuario escribe 0, se mostrará 1.
    const newQuantity = Math.max(1, numericValue);

    // Solo actualizar el contexto si la cantidad es diferente para evitar renders innecesarios
    if (newQuantity !== item.cantidad) {
      updateItemQuantity(item.producto.prod_id, newQuantity);
    }
  };

  /**
   * Maneja el evento blur del input de cantidad para forzar la validación final
   * y asegurar que el estado del input coincida con el estado del pedido.
   * Esto corrige entradas incompletas o no numéricas al perder el foco.
   *
   * @param {React.FocusEvent<HTMLInputElement>} e - Evento blur.
   */
  const handleQuantityInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    let finalQuantity = item.cantidad; // Por defecto, mantén la cantidad actual si el input es inválido

    if (!isNaN(numericValue) && value !== '') {
      finalQuantity = Math.max(1, numericValue); // Asegura que no sea menos de 1
    } else if (value === '') {
      finalQuantity = 1; // Si se dejó vacío, se asume 1 para no eliminar inesperadamente
    }

    // Si la cantidad final difiere del estado actual, actualizar el contexto
    if (finalQuantity !== item.cantidad) {
      updateItemQuantity(item.producto.prod_id, finalQuantity);
    }
    // Siempre sincroniza el input local con la cantidad real del ítem del contexto después del blur
    setQuantityInput(String(item.cantidad));
  };


  /**
   * Decrementa la cantidad del producto.
   * Si la cantidad es 1, al decrementar a 0 se eliminará el ítem del pedido.
   */
  const handleDecrement = () => {
    updateItemQuantity(item.producto.prod_id, item.cantidad - 1);
  };

  /**
   * Incrementa la cantidad del producto.
   */
  const handleIncrement = () => {
    updateItemQuantity(item.producto.prod_id, item.cantidad + 1);
  };

  return (
    <div  className={`
      /* --- Posición --- */
      flex
      items-center
      gap-3                          /* Espacio reducido de 4 a 3 */

      /* --- Dimensiones --- */
      w-full
      p-2.5                          /* Padding reducido de p-3 a p-2.5 */

      /* --- Colores --- */
      bg-vete-card-white
      border
      border-vete-light-border

      /* --- Estilo --- */
      rounded-xl                     /* Bordes ligeramente más pequeños */
      shadow-sm
      hover:shadow-md                /* Microinteracción: Sombra al pasar el mouse */
      transition-all duration-200    /* Transición suave para todos los cambios */
      focus-within:ring-1 focus-within:ring-vete-primary/50 /* Borde azul sutil al enfocar el grupo */
    `} >

     {/* Miniatura del Producto */}
      <div className={`
        /* --- Dimensiones --- */
        w-14                         /* Ancho reducido de 16 a 14 */
        h-14                         /* Altura reducida de 16 a 14 */
        flex-shrink-0

        /* --- Estilo --- */
        rounded-lg                   /* Bordes ligeramente más pequeños */
        overflow-hidden
        bg-vete-dark
      `}>
        <img
        src={item.producto.imagen_principal_url?.img_url || '/images/producto_no_disponible.png'}
        alt={item.producto.imagen_principal_url ? item.producto.prod_nombre : "Imagen no encontrada"}
          className={`
            /* --- Dimensiones --- */
            w-full
            h-full
            object-cover
          `}
        />
      </div>


      {/* Información del Producto */}
      <div className={`
        /* --- Posición --- */
        flex
        flex-col
        flex-1
        min-w-0
      `}>
        <h4 className={`
          /* --- Texto --- */
          text-sm
          font-bold
          text-vete-text-light
          truncate
        `}>
          {item.producto.prod_nombre}
        </h4>
        <div className="flex items-center gap-1 mt-0.5"> {/* Margen y gap reducidos */}
          <span className="text-xs text-vete-text-muted font-medium">
            ${item.producto.prod_precio.toLocaleString('es-UY')} c/u
          </span>
        </div>
      </div>

      {/* Controles y Subtotal */}
      <div className={`
        /* --- Posición --- */
        flex
        flex-col
        items-end
        gap-1.5                      /* Espacio reducido de 2 a 1.5 */
      `}>
        <span className={`
          /* --- Texto --- */
          text-sm
          font-black
          text-vete-dark-green
        `}>
          ${subtotal.toLocaleString('es-UY')}
        </span>

        <div className={`
          /* --- Posición --- */
          flex
          items-center
          gap-0.5                      /* Espacio mínimo entre botones */

          /* --- Colores --- */
          bg-vete-dark
          /* Eliminado el borde del div contenedor para evitar el borde azul*/
          rounded-lg
          transition-all duration-150  /* Microinteracción: transición al interactuar */
          /* focus-within:ring-2 focus-within:ring-vete-primary/50  --- Ahora está en el div principal del item --- */
        `}>

          {/* Boton para decrementar o quitar el producto del Carrito */}
          <button
            onClick={handleDecrement}
            className={`
              p-1.5
              text-vete-error           /* Color rojo para el botón de eliminar/decrementar */
              hover:text-white          /* Texto blanco al pasar el mouse */
              hover:bg-vete-error       /* Fondo rojo al pasar el mouse */
              rounded-l-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-vete-primary /* Mantener focus visual */
            `}
            aria-label={item.cantidad <= 1 ? "Eliminar producto" : "Decrementar cantidad"}
          >
            {item.cantidad <= 1 ? <Trash2 size={16} /> : <Minus size={16} />} {/* Icono ligeramente más grande */}
          </button>

          {/* Input de Cantidad Editable */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            onChange={handleQuantityInputChange}
            onBlur={handleQuantityInputBlur}
            className={`
              w-9                          /* Ancho ligeramente reducido */
              text-center
              text-sm                      /* Tamaño de fuente ligeramente mayor */
              font-bold
              text-vete-text-light
              bg-transparent
              border-y border-vete-light-border /* Borde sutil solo en Y para separar botones */
              outline-none
              appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
              [-moz-appearance:textfield]
              transition-all duration-150    /* Microinteracción: transición suave al escribir */
              focus:outline-none focus:ring-0 /* Asegurarse de que el input no tenga un focus ring propio */
            `}
            aria-label={`Cantidad de ${item.producto.prod_nombre}`}
          />

          {/* Boton para incrementar el producto en el Carrito */}
          <button
            onClick={handleIncrement}
            className={`
              p-1.5
              text-vete-tertiary           /* Color verde para el botón de incrementar */
              hover:bg-vete-tertiary       /* Fondo verde al pasar el mouse */
              hover:text-white             /* Texto blanco al pasar el mouse */
              rounded-r-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-vete-primary /* Mantener focus visual */
            `}
            aria-label="Incrementar cantidad"
          >
            <Plus size={16} /> {/* Icono ligeramente más grande */}
          </button>
        </div>
      </div>
    </div>
  );
};