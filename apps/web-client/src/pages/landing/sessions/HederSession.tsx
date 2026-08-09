/* --- apps/web-client/src/pages/landing/sessions/HeaderSession.tsx --- */

import React, { useState, useEffect } from 'react';

import {Menu, X, ShoppingCart, User } from "lucide-react";
import { usePedidoStore } from '../../../context/pedido_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';


/**
 * Header evolucionado para Veterinaria Beltramelli.
 * Implementa: Sticky behavior, Carrito con contador/total y Perfil de usuario.
 */
export const HeaderSession = ({ bgColor }: { bgColor: string }) => {
  const [isScrolled, setIsScrolled] = useState(false); // Detecta el scroll para aplicar el efecto de transparencia/blur, Si es true se aplica el efecto
  const [isCartOpen, setIsCartOpen] = useState(false); // Componente para el menu desplegable del carrito 
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Componente para el menu desplegable del header

  /* --- Sustituye tus constantes por el Hook de la Fachada --- */
  const {
    total, // Total de la compra
    itemCount // Cantidad de productos
  } = usePedidoStore();

  /* --- No Borrar!!!!! <!> Para el usuario, lo ideal es usar un Contexto de Auth Lo voy a usar en el sprin 3  --- */
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
      <header className={` 
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










         {/* Botón Hamburguesa (Solo visible en móvil) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`
            /* --- Posición --- */
            md:hidden                  /* Oculto en desktop */
            flex                       /* Activa flex */
            items-center               /* Centrado vertical */
            
            /* --- Colores --- */
            text-vete-primary          /* Color marca */
          `}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>










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
            /* tablet-vete:inline   <!> Sacar si queda fijo como quiero         Visible en tablets/desktop */
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

          <div className={`
              /* --- Posición --- */
              hidden                       /* Oculto en móviles */
              /* md:flex   <!> Sacar si queda fijo como quiero  */           /* Visible en desktop */
              desktop-vete:flex            /* Visible en desktop */
              items-center                 /* Centrado vertical */
              gap-6                        /* Espacio entre links */

              /* --- Texto --- */
              font-bold                    /* Negrita */
              text-sm                      /* Tamaño pequeño */
            `}>
              {/* Link para navegar en la web  <!> Esto me gustaria que se uniera con lo de abajo par sacarlo a un metodo solo para no repetir 
               Ademas veo que las cases es son reetitivas no se si se pudiera meter a el div para que me quede a mi me hace mas sentido   */}
              <a href="#ServicioSeccion" className="hover:text-vete-primary transition-colors">Servicios</a>
              <a href="#ProgramsSection" className="hover:text-vete-primary transition-colors">Promociones</a>
              <a href="#ProductsSession" className="hover:text-vete-primary transition-colors">Tienda</a>
              <a href="#AboutSection" className="hover:text-vete-primary transition-colors">Nosotros</a>
              <a href="#MapsSection" className="hover:text-vete-primary transition-colors">Local</a>
              
          </div>



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


      {/* --- MENÚ DESPLEGABLE MÓVIL (Drawer) --- */}
      <div className={`
        /* --- Posición --- */
        fixed                        /* Queda fijo sobre la pantalla */
        top-24                       /* Justo debajo del header */
        left-0                       /* Alineado al inicio */
        z-[90]                       /* Por debajo del header pero sobre el contenido */
        
        /* --- Dimensiones --- */
        w-full                       /* Ancho total */
        h-screen                     /* Altura total */
        p-8                          /* Padding interno */

        /* --- Colores --- */
        bg-white                     /* Fondo blanco */
        
        /* --- Animación --- */
        transition-all               /* Transición suave */
        duration-500                 /* Velocidad */

        /*Lanza el menu cuando isMenuOpen es true y lo oculta cuando es false */
        ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}>
        <nav className={`
            /* --- Posición --- */
            flex                       /* Alineación horizontal */
            flex-col                   /* Columna vertical */
            items-center               /* Centrado vertical */
            gap-8                      /* Espacio entre items */

            /* --- Tipografía --- */
            text-2xl                   /* Tamaño de fuente grande */
            font-black                 /* Peso máximo de fuente */
            italic                     /* Cursiva */
            uppercase                  /* Mayúsculas */

            /* --- Colores --- */
            text-vete-secondary
          `}>
          
          {/* <!> Estariba bueno que esto link y los de arriba fuera a un solo punto y los traiga con un metodo 
          par sentralizar peo no se como hacerlo y no me quiero compliar adeas queir ver andando lo que si la diferencia
          es que este teine un metodo para salir y el otor tiene clases de estilo caps si agrupo los etilo al nav que los contien
          y aca no podria andar tendria que pensarlo  */}
          <a href="#ServicioSeccion" >Servicios</a>
          <a href="#ProgramsSection" >Promociones</a>
          <a href="#ProductsSession" >Tienda</a>
          <a href="#AboutSection" >Nosotros</a>
          <a href="#MapsSection" >Local</a>

          
          <div className="h-[1px] w-full bg-slate-100 my-4" />
          
          {/* No Borrar !!!  Info extra en el menú móvil <!> Esto es para el sprin 3 es para cuando aya udario  */}
          {/* <div className="flex items-center gap-4 text-sm not-italic font-bold text-vete-primary">
            <User size={20} />
            <span>Mi Perfil</span>
          </div> */}
        </nav>
      </div>

    </>
  );


}



export default HeaderSession;