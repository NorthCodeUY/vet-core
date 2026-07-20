/* --- apps/web-client/src/pages/landing/sessions/HeaderSession.tsx --- */

import React, { useState, useEffect } from 'react';

import { ShoppingCart } from "lucide-react";
import { usePedidoStore } from '../../../context/pedido_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';


/**
 * Header evolucionado para Veterinaria Beltramelli.
 * Implementa: Sticky behavior, Carrito con contador/total y Perfil de usuario.
 */
export const HeaderSession = ({ bgColor }: { bgColor: string }) => {
  const [isScrolled, setIsScrolled] = useState(false); 

  // Componente para el menu desplegable <!> no lo tengo calro 
  const [isCartOpen, setIsCartOpen] = useState(false);

  /* --- Sustituye tus constantes por el Hook de la Fachada --- */
  const { 
    total, // Total de la compra
    itemCount // Cantidad de productos
  } = usePedidoStore(); 

  /* --- Para el usuario, lo ideal es usar un Contexto de Auth --- */
  // const { user, isAuthenticated } = useAuth(); 
  // const user = { isLoggedIn: true, name: "Ary" }; // Mantenlo así hasta que hagamos el AuthContext

  

  /* Detecta el scroll para aplicar el efecto de transparencia/blur */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const newLocal = `
              /* --- Posición --- */
              absolute                     /* Flota sobre el icono */
              -top-1                       /* Ajuste superior */
              -right-1                     /* Ajuste derecho */
              
              /* --- Dimensiones --- */
              w-5 h-5                      /* Tamaño del círculo */
              flex items-center justify-center
              
              /* --- Colores --- */
              bg-red-500                   /* Color de alerta */
              text-white                   /* Texto blanco */
              border-2                     /* Borde de separación */
              border-white                 /* Color del borde */
              
              /* --- Texto --- */
              text-[10px] font-black       /* Fuente mínima y gruesa */
              
              /* --- Estilo --- */
              rounded-full                 /* Círculo perfecto */
            `;
  return (
    <>
    <header className= {` 
      /* --- Posición --- */
      fixed                        /* Mantiene el header siempre visible */
      top-0                        /* Alineado al tope superior */
      left-0                       /* Alineado al inicio izquierdo */
      z-[100]                      /* Capa superior máxima */
      flex                         /* Contenedor flexible */
      items-center                 /* Centrado vertical de elementos */
      justify-between              /* Separa logo de navegación */

      /* --- Dimensiones --- */
      w-full                       /* Ancho total de la pantalla */
      h-24                         /* Altura fija de 6rem */
      px-6                         /* Padding lateral móvil */
      md:px-16                     /* Padding lateral desktop */

      /* --- Colores de fondo --- */
      ${isScrolled ? 
        ' bg-white/80 ' +       /*  80% de blanco con transparencia*/
        ' backdrop-blur-md ' +  /*  Efecto de desenfoque */
        ' shadow-md '           /* sombra */
        : 
        bgColor 
        }             /* Es el color de fondo que se le pasa como parametro */
    
      text-vete-light  /* Color de texto negro*/
      

      /* --- Animación --- */
      transition-all               /* Transición suave para cambios de color */
      duration-300    
    `}>


      {/* Bloque Logo */}
      
      <div className={`
        /* --- Posición --- */
        flex                         /* Alineación horizontal */
        items-center                 /* Centrado vertical */
        gap-2                        /* Espacio entre logo y texto */
      `}>
        <img 
          src="/logo.png" 
          className="w-10 shrink-0" 
          alt="Logo Beltramelli" 
        />
        <span className={`
          /* --- Posición --- */
          hidden                       /* Oculto en móviles pequeños */
          tablet-vete:inline           /* Visible en tablets/desktop */
          whitespace-nowrap            /* Evita salto de línea */

          /* --- Texto --- */
          font-black                   /* Peso máximo de fuente */
          text-xl                      /* Tamaño de fuente grande */
          uppercase                    /* Mayúsculas institucionales */
          tracking-tighter             /* Letras más juntas para estilo moderno */
        `}>
          VETERINARIA BELTRAMELLI<span className="text-vete-primary">.</span>
        </span>
      </div>



      {/* Bloque Navegación y Acciones */}
      <nav className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        items-center                 /* Centrado vertical */
        gap-4                        /* Espacio entre elementos móvil */
        md:gap-8                     /* Espacio extendido en desktop */
      `}>
        
            {/* Links Principales <!> Esto depues tendria ue navegar por por la web a las diferentes secciones del LandingPage */} 
            <div className="hidden md:flex items-center gap-6 font-bold text-sm">
            <a href="#" className="hover:text-vete-primary transition-colors">Servicios</a>
            <a href="#" className="hover:text-vete-primary transition-colors">Tienda</a>
            <a href="#" className="hover:text-vete-primary transition-colors">Contacto</a>
            </div>
            {/*  <!> Esto despues lo miro esparanavegar a landing pague y al precionar que me vallaa dode tiene que ir en la landig pague pero no lo tengo claro 
                    y me gustaria ver lo de carrito primero 

            <div className="hidden md:flex items-center gap-6 font-bold text-sm">
              <a href="#servicios" className="hover:text-vete-primary transition-colors">Servicios</a>
              <a href="#tienda" className="hover:text-vete-primary transition-colors">Tienda</a>
              <a href="#contacto" className="hover:text-vete-primary transition-colors">Contacto</a>
            </div>
            */}
        
        </nav>

        {/* Carrito con Contador y Total */}
        <div 
          onClick={() => setIsCartOpen(true)}
          className={`
          /* --- Posición --- */
          flex                         /* Alineación horizontal */
          items-center                 /* Centrado vertical */
          gap-3                        /* Espacio entre precio e icono */
          cursor-pointer               /* Cursor de mano */
          group                        /* Grupo para hover */
        `}>


          {/* Visualización de Gasto */}
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] uppercase opacity-60 font-bold">Total</span>
            <span className="text-vete-primary font-black text-lg">${total.toFixed(2)}</span>
          </div>

          {/* Icono con Badge <!> Esto supongo que engloba todo lo correspondiente a carrito
          me tustaria que al acer clic me desplegue aca el menu PedidoDreawer.tsx
          */}
          <div className={`
            /* --- Posición --- */
            relative                     /* Base para el badge absoluto */
            p-2.5                        /* Espaciado interno */
            
            /* --- Colores --- */
            bg-vete-primary              /* Fondo verde marca */
            text-white                   /* Icono blanco */
            
            /* --- Estilo --- */
            rounded-full                 /* Forma circular */
            shadow-lg                    /* Sombra de profundidad */
            
            /* --- Animación --- */
            group-hover:scale-110        /* Crece al pasar el mouse */
            transition-transform         /* Suavidad */
          `}>

            {/* <!> Aca me gustaria que el carrito me mostrar la cantidad de articulos total*/}
            <ShoppingCart size={18} />
            {/* Badge Numérico */}
            <span className={newLocal}>
              {itemCount}
            </span>


          </div>
        </div>


    </header>
      {/* Menu desplegable del carrito */}
      <PedidoDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
  </>
  );


}



export default HeaderSession;