/* --- apps/web-client/src/pages/pedido/PedidoDrawer.tsx --- */

import React, { useState } from 'react';
import { X, ShoppingBag, MapPin, Send, Package } from 'lucide-react';
import { usePedidoStore } from '../../context/pedido_context';
import { CartItemRow } from './PedidoItemRow'; // Este lo crearemos a continuación

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, total, itemCount } = usePedidoStore();
  const [address, setAddress] = useState("");

  /* Función para generar el link de WhatsApp con el pedido formateado */
  const handleConfirmOrder = () => {
    if (!address) return alert("Por favor, ingresa una dirección de entrega.");
    
    let message = `🐾 *PEDIDO - VETERINARIA BELTRAMELLI* 🐾\n\n`;
    message += `📍 *Entrega:* ${address}\n`;
    message += `----------------------------------\n`;
    // <!> Depuse veo esto solo quiero ver como se ve lo que si 
    // <!> Para mi esto tendria que ir en una clase tipo fachada no se 
    // un lugar que guarde una unica instancia en memoria por aplicacion
    // poruqe tiene sentido que se guarde una sola instancia por web 
    // ya que un usuario ccomra en la aplicacion que esta usando tambien las compras 
    // tendrian que estar asi asi cuadno doy la horden de compra lo manda al bakend 
    // yo usaba un patron de disenio con construcctror para poder realizar esto no me acurdo
    // como se llamaba el patron de disenio pero si me lo mensionas lo busco y veo como adpatarlo 
    
    
    // cart.forEach(item => {
    //   message += `✅ ${item.cantidad}x ${item.producto.prod_nombre} - $${item.producto.prod_precio * item.cantidad}\n`;
    // });
    
    message += `----------------------------------\n`;
    message += `💰 *TOTAL:* $${total}\n\n`;
    message += `_Enviado desde la Web de Salto_`;

    window.open(`https://wa.me/59892444510?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Overlay: Fondo oscuro traslúcido */}
      <div 
        onClick={onClose}
        className={`
          /* --- Posición --- */
          fixed                        /* Cubre toda la pantalla */
          inset-0                      /* Top, bottom, left, right = 0 */
          z-[150]                      /* Por debajo del drawer pero sobre la web */
          
          /* --- Colores --- */
          bg-slate-900/60              /* Fondo oscuro con opacidad */
          backdrop-blur-sm             /* Efecto de desenfoque */
          
          /* --- Animación --- */
          transition-opacity           /* Transición suave */
          duration-500                 /* Velocidad de 500ms */
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      {/* Drawer: Menú Lateral */}
      <aside className={`
        /* --- Posición --- */
        fixed                        /* Queda fijo a la derecha */
        top-0                        /* Desde el tope */
        right-0                      /* Alineado a la derecha */
        z-[160]                      /* Capa superior máxima */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */

        /* --- Dimensiones --- */
        h-full                       /* Altura total */
        w-full                       /* Ancho total en móvil */
        max-w-md                     /* Límite de ancho en desktop */
        
        /* --- Colores --- */
        bg-white                     /* Fondo blanco limpio */
        shadow-[-10px_0_50px_rgba(0,0,0,0.2)] /* Sombra lateral profunda */

        /* --- Animación --- */
        transition-transform         /* Transición de movimiento */
        duration-500                 /* Velocidad igual al overlay */
        ease-in-out                  /* Curva de aceleración suave */
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Header del Carrito */}
        <div className={`
          /* --- Posición --- */
          flex                         /* Alineación horizontal */
          items-center                 /* Centrado vertical */
          justify-between              /* Separa título de cerrar */
          
          /* --- Dimensiones --- */
          p-6                          /* Padding interno */
          
          /* --- Colores --- */
          bg-emerald-900               /* Verde oscuro institucional */
          text-white                   /* Texto blanco */
        `}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <h2 className="text-2xl font-black italic uppercase tracking-tight">Tu Carrito</h2>
            <span className="bg-vete-primary text-white text-[10px] px-2 py-1 rounded-full font-bold">
              {itemCount} ITEMS
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo: Lista de Items (Scrollable) */}
        <div className={`
          /* --- Posición --- */
          flex-1                       /* Ocupa el espacio disponible */
          overflow-y-auto              /* Scroll vertical si hay muchos items */
          
          /* --- Dimensiones --- */
          p-6                          /* Padding interno */
          
          /* --- Colores --- */
          bg-slate-50                  /* Fondo gris muy tenue */
        `}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <Package size={64} className="opacity-20" />
              <p className="font-bold italic">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* <!> Despues le meto a esto solo quiero ver como se ve  */}
              {/* {cart.map((item) => (
                <CartItemRow key={item.producto.prod_id} item={item} />
              ))} */}
            </div>
          )}
        </div>

        {/* Footer: Resumen y Confirmación */}
        <div className={`
          /* --- Posición --- */
          flex                         /* Contenedor flexible */
          flex-col                     /* Dirección vertical */
          gap-6                        /* Espacio entre bloques */
          
          /* --- Dimensiones --- */
          p-8                          /* Padding generoso */
          
          /* --- Colores --- */
          bg-white                     /* Fondo blanco */
          border-t                     /* Línea superior */
          border-slate-100             /* Color de línea suave */
        `}>
          
          {/* Resumen de Totales */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resumen</span>
              <span className="text-xl font-bold text-slate-800">Total del Pedido</span>
            </div>
            <span className="text-3xl font-black text-emerald-900">
              ${total.toLocaleString('es-UY')}
            </span>
          </div>

          {/* Campo de Dirección */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase ml-1">
              <MapPin size={14} className="text-emerald-900" />
              Dirección de Entrega
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Calle, Número, Ciudad"
                className={`
                  /* --- Dimensiones --- */
                  w-full                       /* Ancho total */
                  py-4                         /* Padding vertical */
                  pl-4                         /* Padding izquierdo */
                  
                  /* --- Estilo --- */
                  bg-slate-50                  /* Fondo gris suave */
                  border-2                     /* Borde de 2px */
                  border-transparent           /* Borde invisible por defecto */
                  rounded-2xl                  /* Bordes redondeados */
                  outline-none                 /* Quita el aro azul */
                  
                  /* --- Animación --- */
                  focus:border-emerald-900     /* Resalta al escribir */
                  transition-all               /* Suavidad */
                `}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Botón WhatsApp */}
          <button 
            onClick={handleConfirmOrder}
            className={`
              /* --- Posición --- */
              flex                         /* Contenedor flexible */
              items-center                 /* Centrado vertical */
              justify-center               /* Centrado horizontal */
              gap-3                        /* Espacio icono-texto */
              
              /* --- Dimensiones --- */
              w-full                       /* Ancho total */
              py-5                         /* Padding vertical amplio */
              
              /* --- Colores --- */
              bg-emerald-900               /* Verde institucional */
              text-white                   /* Texto blanco */
              
              /* --- Texto --- */
              font-black                   /* Peso máximo */
              uppercase                    /* Mayúsculas */
              tracking-widest              /* Espaciado de letras */
              
              /* --- Estilo --- */
              rounded-2xl                  /* Bordes redondeados */
              shadow-xl                    /* Sombra de elevación */
              shadow-emerald-900/20        /* Color de sombra suave */
              
              /* --- Animación --- */
              hover:bg-emerald-800         /* Oscurece al pasar mouse */
              active:scale-95              /* Efecto de click */
              transition-all               /* Suavidad */
            `}
          >
            Confirmar por WhatsApp
            <Send size={20} />
          </button>
        </div>
      </aside>
    </>
  );
};