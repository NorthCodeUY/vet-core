/* --- apps/web-client/src/pages/landing/sessions/HeaderSession.tsx --- */

import React, { useState, useEffect } from 'react';

import { Menu, X, ShoppingCart, User } from "lucide-react";
import { usePedidoStore } from '../../../context/pedido_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';


import { Stethoscope, Tag, ShoppingBag, Users, MapPin } from "lucide-react";

/**  
 * Configuración de Navegación Centralizada con Iconos (SVGs)
 */
const NAV_LINKS = [
  { label: 'Servicios', href: '#ServicioSeccion', icon: Stethoscope },
  { label: 'Promociones', href: '#ProgramsSection', icon: Tag },
  { label: 'Tienda', href: '#ProductsSession', icon: ShoppingBag }, // <!> El logo no me gusta tendria que ser algo mas como un carrito o un maletin esos de un shoping qeu son mas triangular 
  { label: 'Nosotros', href: '#AboutSection', icon: Users },
  { label: 'Local', href: '#MapsSection', icon: MapPin },
];

/**
 *  Componente de Link con estilos base 
 * @param href URL a la que apunta el enlace
 * @param label Etiqueta del enlace
 * @param onClick Función a ejecutar al hacer clic 
 * @param icon Icono a mostrar   
 * @param className Clases CSS adicionales
 * @returns
 * */

const NavLink = ({
  href,
  label,
  onClick,
  icon: Icon,
  className = ""
}: {
  href: string;
  label: string;
  onClick?: () => void;
  icon?: any;
  className?: string
}) => (

  <a
    href={href}
    onClick={onClick}
    className={`
      /* --- Posición --- */
      flex items-center            /* Alinea icono y texto */
      gap-3                        /* Espacio entre icono y texto */
      
      /* --- Animación --- */
      hover:text-vete-primary      /* Color marca al pasar mouse */
      transition-all               /* Suaviza el cambio */
      duration-300                 
      ${className}                 
    `}
  >
    {/* Renderizado dinámico del icono SVG */}
    {Icon && <Icon size={20} className={`
      /* --- Animación --- */
      opacity-70                /* Opracion de 70% cuando no se tiene el focus */
      group-hover:opacity-100   /* Opracion de 100% cuando se tiene el focus */
      ${className} 
      `} />}
    <span>{label}</span>
  </a>
);




/**
 *  Compone un enlace de navegación con estilos base y opciones de personalización.
 * @param href URL a la que apunta el enlace
 * @param children Contenido del enlace
 * @param className Clases CSS adicionales
 * @returns 
 */
const NavigationButton = ({ href, children }: { href: string; children: React.ReactNode }) => (

  <a href={href} className={`
      /* --- Animación --- */
      hover:text-vete-primary     /* Color al pasar mouse */
      transition-colors            /* Suaviza el cambio de color */
      duration-300                 /* Velocidad de transición */
      
      /* --- Texto --- */
      text-3xl 
      font-black 
      italic uppercase 
            
      /* --- Colores --- */
      text-vete-light             /* Color baseline de los enlaces */  
      
      /* --- Estilo --- */
      border-b 
      border-slate-50 
      pb-4
    `}>{children}</a>
);


/**
 * <!> Este menu deberia toar una parte de la pantalla no dodo ponelo el contenido del menu y un poquito mas nada mas
 * Componente Interno: Menú Desplegable Móvil
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
  <>
    {/* Overlay: Fondo oscuro para resaltar el menú y permitir cerrar al tocar fuera */}
    <div
      onClick={onClose}
      className={`
        /* --- Posición --- */
        fixed inset-0 z-[80]
        /* --- Animación --- */
        transition-opacity duration-500
        ${isOpen ?
          'opacity-100 visible' :
          'opacity-0 invisible'}

        /* --- Colores --- */
        bg-slate-900/20 backdrop-blur-sm
      `}
    />

    <div className={`
      /* --- Posición --- */
      fixed                        /* Queda flotando sobre la web */
      top-24                       /* Justo debajo del header */
      left-0                       /* Alineado al inicio izquierdo */
      z-[90]                       /* Por encima del overlay */
      
      /* --- Dimensiones --- */
      w-[85%]                      /* <!> Ocupa el 85% del ancho para dejar ver el fondo */
      max-w-[320px]                /* Límite de ancho para que no se estire de más */
      h-fit                        /* <!> Altura ajustada al contenido de los links */
      p-8                          /* Padding interno */

      /* --- Colores --- */
      bg-white                     /* Fondo blanco limpio */
      shadow-2xl                   /* Sombra profunda para dar relieve */
      
      /* --- Estilo --- */
      rounded-br-[3rem]            /* <!> Bordes redondeados solo en la esquina inferior derecha */
      border-r border-b            /* Bordes sutiles de cierre */
      border-slate-100

      /* --- Animación --- */
      transition-all               /* Transición suave de posición y opacidad */
      duration-500                 /* Velocidad de medio segundo */
      ease-in-out                  /* Curva de aceleración fluida */

      /* Lógica de visibilidad */
      ${isOpen ?
        'translate-x-0 opacity-100' :
        '-translate-x-full opacity-0'
      }

    `}>
      <nav className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */
        gap-6                        /* Espacio entre links */
      `}>
        {/* Mapeo de links centralizados */}
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            onClick={onClose}
            className={`
              /* --- Texto --- */
               
              font-black 
              italic uppercase 
            `}
          />
        ))}

        {/* Línea decorativa final */}
        <div className="h-1 w-12 bg-vete-primary rounded-full mt-2" />
      </nav>
    </div>
  </>
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
            heder-vete:hidden        /*  Quiero que aparesaca cuando se borra el menu de en el av  */
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
        <nav className={` 

        /* -- Animacion --*/
        heder-vete:flex 
        /* -- Dimensiones -- */
        hidden
        /* -- Posición -- */
        items-center
        gap-6
        font-bold
        text-sm`}>
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