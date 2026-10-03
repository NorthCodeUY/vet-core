/* --- apps/web-client/src/pages/landing/sessions/HeaderSession.tsx --- */
/* =============================================================================
   COMPONENTE: CABECERA PRINCIPAL Y NAVEGACIÓN (HeaderSession)
   ============================================================================= */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Stethoscope, 
  Tag, 
  ShoppingBag, 
  Users, 
  MapPin 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { usePedidoStore } from '../../../context/pedido_context';
import { useConfig } from '../../../context/tenant_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';

/**
 * Enlace individual del menú de navegación.
 * @interface NavigationLinkItem
 */
interface NavigationLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Catálogo centralizado de enlaces de navegación con sus respectivos iconos.
 */
const NAV_LINKS: NavigationLinkItem[] = [
  { label: 'Tienda', href: '#ProductsSession', icon: ShoppingBag },
  { label: 'Servicios', href: '#ServicioSession', icon: Stethoscope },
  { label: 'Promociones', href: '#PlanSession', icon: Tag },
  { label: 'Local', href: '#MapsSection', icon: MapPin },
];

/* =============================================================================
   SUB-COMPONENTE: ENLACE INDIVIDUAL (NavLink)
   ============================================================================= */

interface NavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/**
 * Enlace atómico de navegación con icono interactivo (`NavLink`).
 */
const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  icon: Icon,
  onClick,
  className = '',
}) => (
  <a
    href={href}
    onClick={onClick}
    className={`
      /* --- Posición --- */
      flex                         /* Layout flexible */
      items-center                 /* Centrado vertical */
      gap-2.5                      /* Separación icono-texto */

      /* --- Dimensiones --- */

      /* --- Colores --- */
      text-vete-text-base          /* Color tipográfico principal */
      hover:text-vete-primary      /* Resalta con color de marca */

      /* --- Texto --- */
      font-bold                    /* Grosor 700 */
      text-sm                      /* Tamaño estándar */

      /* --- Animación --- */
      transition-colors            /* Transición suave */
      duration-200                 /* 200ms */
      group                        /* Permite animar el icono hijo */
      ${className}
    `}
  >
    {Icon && (
      <Icon
        size={18}
        className={`
          /* --- Colores --- */
          text-vete-primary/70     /* Tinte suave de marca */
          group-hover:text-vete-primary /* Opacidad completa en hover */

          /* --- Animación --- */
          transition-colors        /* Transición */
          duration-200             /* 200ms */
        `}
      />
    )}
    <span>{label}</span>
  </a>
);

/* =============================================================================
   SUB-COMPONENTE: MENÚ LATERAL MÓVIL (MobileNavigationDrawer)
   ============================================================================= */

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cajón desplegable de navegación para dispositivos móviles y tablets.
 */
const MobileNavigationDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => (
  <>
    {/* Backdrop oscurecido */}
    <div
      onClick={onClose}
      className={`
        /* --- Posición --- */
        fixed                        /* Fijo sobre la ventana */
        inset-0                      /* 100% alto y ancho */
        z-[80]                       /* Capa inferior al drawer */

        /* --- Colores --- */
        bg-vete-overlay/40           /* Fondo oscurecido */
        backdrop-blur-sm             /* Desenfoque */

        /* --- Animación --- */
        transition-opacity           /* Transición de opacidad */
        duration-300                 /* 300ms */
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}
    />

    {/* Panel Desplegable Lateral */}
    <div
      className={`
        /* --- Posición --- */
        fixed                        /* Flotante */
        top-24                       /* Justo debajo del header */
        left-0                       /* Anclado a la izquierda */
        z-[90]                       /* Por encima del backdrop */

        /* --- Dimensiones --- */
        w-[85%]                      /* 85% del ancho de pantalla */
        max-w-[300px]                /* Límite máximo */
        h-auto                       /* Altura adaptativa */
        p-6                          /* Padding interno */

        /* --- Colores --- */
        bg-vete-surface              /* Fondo blanco/tarjeta del tema */
        border-r                     /* Borde lateral derecho */
        border-b                     /* Borde inferior */
        border-vete-border-subtle    /* Color de borde suave */
        shadow-2xl                   /* Sombra profunda */

        /* --- Estilo --- */
        rounded-br-[2.5rem]          /* Esquina inferior derecha redondeada */

        /* --- Animación --- */
        transition-all               /* Transición fluida */
        duration-300                 /* 300ms */
        ease-in-out                  /* Aceleración suave */
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
      `}
    >
      <nav className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        flex-col                     /* Columna vertical */
        gap-5                        /* Separación entre enlaces */
      `}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            onClick={onClose}
            className="text-base font-black uppercase tracking-wide"
          />
        ))}

        {/* Línea decorativa institucional */}
        <div className={`
          /* --- Dimensiones --- */
          w-10                       /* Ancho de la barra */
          h-1                        /* Altura de 4px */
          mt-2                       /* Margen superior */

          /* --- Colores --- */
          bg-vete-primary            /* Color principal de marca */

          /* --- Estilo --- */
          rounded-full               /* Píldora */
        `} />
      </nav>
    </div>
  </>
);

/* =============================================================================
   COMPONENTE PRINCIPAL: HEADER Y ACCESOS RÁPIDOS
   ============================================================================= */

interface HeaderSessionProps {
  bgColor?: string;
}

/**
 * Barra de navegación principal (`HeaderSession`).
 * 
 * Gestiona el comportamiento pegajoso (`sticky/fixed`), la transición visual de desenfoque
 * al hacer scroll, el selector de menú móvil y el acceso al drawer del carrito de compras.
 *
 * @component
 * @param {HeaderSessionProps} props - Propiedades de configuración.
 * @returns {JSX.Element} Cabecera institucional fija.
 */
export const HeaderSession: React.FC<HeaderSessionProps> = ({ bgColor = 'bg-transparent' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DE CONTEXTOS GLOBALES
     --------------------------------------------------------------------------- */
  const { config } = useConfig();
  const { total, itemCount } = usePedidoStore();

  /* ---------------------------------------------------------------------------
     2. ESTADOS LOCALES DE INTERACCIÓN
     --------------------------------------------------------------------------- */
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // Estado para detectar el scroll y aplicar el efecto de desenfoque
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // Estado para detectar el estado del drawer del carrito
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // Estado para detectar el estado del menu navegacion

  /* Detecta el desplazamiento vertical para aplicar efecto vidrio */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40); // Se activa a partir de los 40px de scroll
    window.addEventListener('scroll', handleScroll); // Añade el event listener de scroll
    return () => window.removeEventListener('scroll', handleScroll); // Remueve el event listener de scroll
  }, []);

  const hasCart = config?.features?.has_cart ?? true; // Feature flag para habilitar el carrito

  return (
    <>
      <header className={`
        /* --- Posición --- */
        fixed                        /* Fijo en el borde superior */
        top-0                        /* Anclado arriba */
        left-0                       /* Anclado a la izquierda */
        z-[100]                      /* Capa máxima superior */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-between              /* Distribución a los extremos */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        h-24                         /* Altura fija de 6rem */
        px-6                         /* Padding horizontal móvil */
        md:px-16                     /* Padding horizontal escritorio */

        /* --- Colores --- */
        ${isScrolled
          ? 'bg-vete-surface/90 backdrop-blur-md shadow-md border-b border-vete-border-subtle/50'
          : bgColor}

        /* --- Texto --- */

        /* --- Animación --- */
        transition-all               /* Transición fluida */
        duration-300                 /* Tiempo de 300ms */
      `}>
        
        {/* BOTÓN HAMBURGUESA: Visible solo en Móvil/Tablet (<1024px) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`
            /* --- Posición --- */
            flex                     /* Visible en pantallas pequeñas */
            lg:hidden                /* Oculto en escritorio */
            items-center             /* Centrado vertical */

            /* --- Dimensiones --- */
            p-1.5                    /* Padding táctil */

            /* --- Colores --- */
            text-vete-primary        /* Color de marca */

            /* --- Animación --- */
            transition-transform     /* Transición suave */
            active:scale-90          /* Pulsación */
          `}
          title="Abrir menú de navegación"
          aria-label="Abrir menú de navegación"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* LOGO E IDENTIDAD CORPORATIVA DINÁMICA */}
        <a
          href="#HeroSession"
          className={`
            /* --- Posición --- */
            flex                     /* Layout flexible */
            items-center             /* Centrado vertical */
            gap-3                    /* Separación logo-texto */

            /* --- Estilo --- */
            cursor-pointer           /* Cursor interactivo */
            group                    /* Agrupador para hover */
          `}
        >
          {/* Logo del Comercio montado en /tenant/ */}
          <img
            src={config?.branding?.logo_url || '/tenant/logo.png'}
            alt={`Logo ${config?.business_name || 'Comercio'}`}
            className={`
              /* --- Dimensiones --- */
              w-10                   /* Tamaño móvil */
              md:w-12                /* Tamaño escritorio */
              h-auto                 /* Mantiene proporciones */
              object-contain         /* Sin deformación */

              /* --- Animación --- */
              group-hover:scale-105  /* Aumento sutil en hover */
              transition-transform   /* Transición suave */
            `}
          />

          {/* Nombre Comercial Dinámico */}
          <span className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */

            /* --- Colores --- */
            text-vete-text-base      /* Color principal de lectura */
            group-hover:text-vete-primary /* Cambio de color al pasar el cursor */

            /* --- Texto --- */
            font-black               /* Grosor 900 */
            text-lg                  /* Tamaño móvil */
            md:text-xl               /* Tamaño escritorio */
            uppercase                /* Mayúsculas */
            tracking-tight           /* Espaciado cerrado */

            /* --- Animación --- */
            transition-colors        /* Transición de color */
            duration-200             /* 200ms */
          `}>
            {config?.business_name || 'Veterinaria'}
          </span>
        </a>

        {/* NAVEGACIÓN DESKTOP: Visible solo en Escritorio (>=1024px) */}
        <nav className={`
          /* --- Posición --- */
          hidden                     /* Oculto en móvil y tablet */
          lg:flex                    /* Visible en escritorio */
          items-center               /* Centrado vertical */
          gap-8                      /* Espaciado holgado entre enlaces */

        `}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* ACCESO AL CARRITO CON TOTAL Y BADGE (Condicional por Feature Flag) */}
        {hasCart ? (
          <div
            onClick={() => setIsCartOpen(true)}
            className={`
              /* --- Posición --- */
              flex                   /* Layout flexible */
              items-center           /* Centrado vertical */
              gap-3                  /* Separación texto-botón */

              /* --- Estilo --- */
              cursor-pointer         /* Cursor interactivo */
              select-none            /* Previene selección accidental */

              /* --- Animación --- */
              hover:opacity-85       /* Atenuación en hover */
              active:scale-95        /* Efecto táctil */
              transition-all         /* Transición fluida */
              group                  /* Agrupador de animación */
            `}
          >
            {/* Visualización del Gasto Acumulado */}
            <div className={`
              /* --- Posición --- */
              hidden                 /* Oculto en móviles muy pequeños */
              sm:flex                /* Visible desde pantallas pequeñas */
              flex-col               /* Disposición vertical */
              items-end              /* Alineado a la derecha */
              leading-none           /* Sin interlineado sobrante */
            `}>
              <span className={`
                /* --- Texto --- */
                text-[9px]           /* Tamaño micro */
                uppercase            /* Mayúsculas */
                font-bold            /* Grosor 700 */
                text-vete-text-muted /* Color atenuado */
                tracking-widest      /* Espaciado amplio */
              `}>
                Total
              </span>
              <span className={`
                /* --- Texto --- */
                text-vete-primary    /* Color de marca */
                font-black           /* Grosor 900 */
                text-base            /* Tamaño destacado */
              `}>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Botón Circular con Badge Contador */}
            <div className={`
              /* --- Posición --- */
              relative               /* Contexto para el badge absoluto */
              flex                   /* Centrado flexbox */
              items-center           /* Centrado vertical */
              justify-center         /* Centrado horizontal */

              /* --- Dimensiones --- */
              p-2.5                  /* Padding interno */

              /* --- Colores --- */
              bg-vete-primary        /* Fondo de marca */
              text-white             /* Icono blanco */
              shadow-lg              /* Sombra pronunciada */
              shadow-vete-primary/25 /* Resplandor de color institucional */

              /* --- Estilo --- */
              rounded-full           /* Circular */

              /* --- Animación --- */
              group-hover:scale-105  /* Aumento sutil en hover */
              transition-transform   /* Transición suave */
            `}>
              <ShoppingCart size={18} />

              {/* Badge Numérico Flotante Cantidad de Compras*/}
              {itemCount > 0 && (
                <span className={`
                  /* --- Posición --- */
                  absolute           /* Flota sobre la esquina */
                  -top-1             /* Sobresale arriba */
                  -right-1           /* Sobresale a la derecha */
                  flex               /* Centrado */
                  items-center       /* Centrado vertical */
                  justify-center     /* Centrado horizontal */

                  /* --- Dimensiones --- */
                  w-5                /* Diámetro de 1.25rem */
                  h-5                /* Diámetro de 1.25rem */

                  /* --- Colores --- */
                  bg-vete-error      /* Color de alerta */
                  text-white         /* Texto blanco */
                  border-2           /* Borde separador */
                  border-white       /* Color de borde */

                  /* --- Texto --- */
                  text-[10px]        /* Tamaño micro */
                  font-black         /* Grosor 900 */

                  /* --- Estilo --- */
                  rounded-full       /* Círculo */

                  /* --- Animación --- */
                  animate-in         /* Entrada animada */
                  zoom-in-50         /* Efecto de zoom */
                `}>
                  {itemCount}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-8" />
        )}
      </header>

      {/* Drawer Desplegable de Carrito */}
      {hasCart && (
        <PedidoDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* Menú Lateral Móvil */}
      <MobileNavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default HeaderSession;