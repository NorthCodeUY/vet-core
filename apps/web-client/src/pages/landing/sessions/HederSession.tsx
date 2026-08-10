/* --- apps/web-client/src/pages/landing/sessions/HeaderSession.tsx --- */

import React, { useState, useEffect } from 'react';

import {Menu, X, ShoppingCart, User } from "lucide-react";
import { usePedidoStore } from '../../../context/pedido_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';


/**  
 * Configuración de Navegación Centralizada 
 * 
 * <!> En este me gustaria agregar logitos en
 *  svg que agan referencia a esto 
 * 
 * label: Nombre control
 * href: URL a la que apunta el enlace
 */
const NAV_LINKS = [
  { label: 'Servicios',   href: '#ServicioSeccion' },
  { label: 'Promociones', href: '#ProgramsSection' },
  { label: 'Tienda',      href: '#ProductsSession' },
  { label: 'Nosotros',    href: '#AboutSection' },
  { label: 'Local',       href: '#MapsSection' },
];

/**
 *  Componente de Link con estilos base 
 * @param href URL a la que apunta el enlace
 * @param label Etiqueta del enlace
 * @param onClick Función a ejecutar al hacer clic
 * @param className Clases CSS adicionales
 * @returns
 * */
const NavLink = ({ href, label, onClick, className = "" }: 
  { href: string;            
    label: string;            
    onClick?: () => void;     
    className?: string        
  }) => (
  <a 
    href={href} 
    onClick={onClick}
    className={`
      /* --- Animación --- */
      hover:text-vete-primary      /* Color marca al pasar mouse */
      transition-colors            /* Suaviza el cambio de color */
      duration-300                 /* Velocidad de transición */
      ${className}                 /* Clases extra (ej: tamaño de fuente) */
    `}
  >
    {label}
  </a>
);




/**
 *  Compone un enlace de navegación con estilos base y opciones de personalización.
 * @param href URL a la que apunta el enlace
 * @param children Contenido del enlace
 * @param className Clases CSS adicionales
 * @returns 
 */
const NavigationButton = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
  // <!> A futuro estaria bueno agregarle un logito por Menu relacionado
  //  algo en sfv o algo para que quede bonto
  <a href={href} className={`
      /* --- Animación --- */
      hover:text-vete-primary      /* Color marca al pasar mouse */
      transition-colors            /* Suaviza el cambio de color */
      duration-300                 /* Velocidad de transición */
      ${className}                 /* Clases extra (ej: tamaño de fuente) */
    `}>{children}</a>
);


/**
 *  Componente Interno: Menú Desplegable Móvil
 * @param isOpen Estado del menú
 * @param onClose Función para cerrar el menú
 * @returns
*/
const MobileNavigationDrawer = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => (
  <div className={`
    /* --- Posición --- */
    fixed                        /* Queda fijo sobre la pantalla */
    top-24                       /* Justo debajo del header (h-24) */
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

    /* Lógica de visibilidad basada en el estado */
    ${isOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'}
  `}>
    <nav className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Dirección vertical */
      gap-8                        /* Espacio entre links */
    `}>

      {/* Botones navegador  <!> Aca estaria bueno usar el NavigationButton y ya ponerle logitos  */}
      
      {NAV_LINKS.map((link) => (
        <NavLink 
          key={link.href} 
          {...link} 
          onClick={onClose} 
          className="text-2xl font-black italic uppercase text-vete-secondary"
        />
      ))}

      <div className="h-[1px] w-full bg-slate-100 my-2" />
      
      {/* Espacio para Perfil de Usuario (Sprint 3) */}
      <div className="flex items-center gap-4 text-sm font-bold text-vete-primary">
        <User size={20} />
        <span>Mi Perfil</span>
      </div>
    </nav>
  </div>
);










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
              flex                          /* Contenedor flexible */
              items-center                  /* Centrado vertical del contenido */
              justify-center               /* Centrado horizontal del contenido */
              
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
            desktop-vete:hidden        /* <!> Oculto en desktop  Quiero que aparesaca cuando se borra el menu de en el av  */
            flex                       /* Activa flex */
            items-center               /* Centrado vertical */
            
            /* --- Colores --- */
            text-vete-primary          /* Color marca */
          `}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>


        {/*  Bloque Logo: Texto apilado en móvil y lineal en desktop */}
        
        <a 
          href="#HeroSession" 
          className={`
            /* --- Posición --- */
            flex                         /* Contenedor principal */
            items-center                 /* Alinea el logo con el bloque de texto */
            gap-3                        /* Espacio entre logo y letras */
            
            /* --- Estilo --- */
            cursor-pointer               /* Indica que es un link */
            group                        /* Para efectos de hover */
          `}
        >
          {/* Imagen del Logo */}
          <img
            src="/logo.png"
            className={`
              /* --- Dimensiones --- */
              w-10                       /* Tamaño más grande en móvil para balancear las 2 líneas */
              tablet-vete:w-12           /* Un poco más grande en desktop */
              shrink-0                   /* Evita que se deforme */
            `}
            alt="Logo Beltramelli"
          />

          {/* Contenedor de Texto: Aquí ocurre la magia del apilado */}
          <div className={`
            /* --- Posición --- */
            flex                         /* Activa flexbox */
            flex-col                     /* <!> Apila: Veterinaria arriba, Beltramelli abajo */
            tablet-vete:flex-row         /* <!> En desktop: vuelve a ponerlos en una sola línea */
            tablet-vete:gap-1.5          /* Espacio entre palabras en desktop */
            
            /* --- Texto --- */
            leading-[0.9]                /* Altura de línea muy junta para que se vea como un bloque */
            tablet-vete:leading-none     /* Altura normal en desktop */
          `}>
            
            <span className={`
              /* --- Texto --- */
              font-black                 /* Peso máximo */
              uppercase                    /* Mayúsculas */
              tracking-tighter             /* Estilo moderno */
              
              /* --- Tamaño --- */
              text-[12px]                  /* Tamaño legible para "Veterinaria" */
              tablet-vete:text-xl          /* Tamaño original en PC */

              /* --- Colores --- */
              text-vete-text-light         /* Color claro */
              group-hover:text-vete-primary /* Cambio de color al pasar el mouse */
              transition-colors
            `}>
              Veterinaria
            </span>

            <span className={`
              /* --- Texto --- */
              font-black                   /* Peso máximo */
              uppercase                    /* Mayúsculas */
              tracking-tighter             /* Estilo moderno */
              
              /* --- Tamaño --- */
              text-[16px]                  /* <!> Más grande para resaltar la marca en móvil */
              tablet-vete:text-xl          /* Igual al anterior en PC */

              /* --- Colores --- */
              text-vete-text-light         /* Color claro */
              group-hover:text-vete-primary /* Cambio de color */
              transition-colors
            `}>
              Beltramelli<span className="text-vete-primary">.</span>
            </span>
          </div>
        </a>


      {/* 
          NAV DESKTOP 
          También usa el mapeo centralizado para no repetir código
      */}
      <nav className="hidden desktop-vete:flex items-center gap-6 font-bold text-sm">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
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

      <MobileNavigationDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />


    </>
  );


}



export default HeaderSession;