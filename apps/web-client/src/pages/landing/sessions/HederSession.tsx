// app/web-client/src/pages/landing/sessions/HederSession.tsx

/* =============================================================================
   COMPONENTE: CABECERA DINÁMICA CON ICONOGRAFÍA AGNÓSTICA (HeaderSession)
   ============================================================================= */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Tag, 
  ShoppingBag, 
  Layers, 
  MapPin, 
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import { usePedidoStore } from '../../../context/pedido_context';
import { useConfig } from '../../../context/tenant_context';
import { PedidoDrawer } from '../../pedido/PedidoDrawer';

/**
 * Contrato de definición para un enlace individual de navegación.
 * 
 * @interface NavigationLinkItem
 * @property {string} label - Texto visible del enlace.
 * @property {string} href - Identificador de ancla de destino en la página (ej: '#ServicioSession').
 * @property {string} [iconImageUrl] - Ruta relativa a un icono SVG/PNG personalizado inyectado por tenant.
 * @property {LucideIcon} [fallbackIcon] - Icono genérico de Lucide utilizado como respaldo si no hay SVG.
 */
export interface NavigationLinkItem {
  label: string;
  href: string;
  iconImageUrl?: string;
  fallbackIcon?: LucideIcon;
}

/* =============================================================================
   SUB-COMPONENTE: ENLACE INDIVIDUAL CON SOPORTE DE ICONO HÍBRIDO (NavLink)
   ============================================================================= */

/**
 * Propiedades del componente `NavLink`.
 * 
 * @interface NavLinkProps
 * @property {string} href - Ruta o ancla a la que apunta el hipervínculo.
 * @property {string} label - Texto descriptivo del enlace.
 * @property {string} [iconImageUrl] - URL del icono gráfico personalizado.
 * @property {LucideIcon} [fallbackIcon] - Componente de icono vectorial estándar.
 * @property {function(): void} [onClick] - Función callback disparada al hacer clic.
 * @property {string} [className=''] - Clases adicionales de Tailwind para sobreescritura.
 */
export interface NavLinkProps {
  href: string;
  label: string;
  iconImageUrl?: string;
  fallbackIcon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

/**
 * Enlace atómico de navegación con soporte para imágenes SVG personalizadas o iconos Lucide (`NavLink`).
 *
 * @component
 * @param {NavLinkProps} props - Propiedades de control y diseño.
 * @returns {JSX.Element} Enlace estilizado con transición y microinteracción visual.
 */
const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  iconImageUrl,
  fallbackIcon: FallbackIcon,
  onClick,
  className = '',
}) => (
  <a
    href={href}
    onClick={onClick}
    className={`
      /* --- Posición --- */
      flex                         /* Layout flexible en línea */
      items-center                 /* Centrado vertical */
      gap-2.5                      /* Separación entre icono y etiqueta */

      /* --- Dimensiones --- */

      /* --- Colores --- */
      text-vete-text-base          /* Color tipográfico principal */
      hover:text-vete-primary      /* Resalta con color de marca en hover */

      /* --- Texto --- */
      font-bold                    /* Grosor tipográfico en 700 */
      text-sm                      /* Tamaño estándar de navegación */

      /* --- Animación --- */
      transition-colors            /* Transición fluida de color */
      duration-200                 /* Velocidad de respuesta de 200ms */
      group                        /* Agrupador para sincronizar hover en hijos */
      ${className}
    `}
  >
    {/* 1. Prioridad: Icono SVG/PNG personalizado provisto por el cliente */}
    {iconImageUrl ? (
      <img
        src={iconImageUrl}
        alt={label}
        className={`
          /* --- Dimensiones --- */
          w-4.5                        /* Ancho fijo de 1.125rem */
          h-4.5                        /* Alto fijo de 1.125rem */
          shrink-0                     /* Evita deformación */

          /* --- Estilo --- */
          object-contain               /* Ajuste proporcional */

          /* --- Animación --- */
          opacity-80                   /* Atenuación en reposo */
          group-hover:opacity-100      /* Opacidad completa en hover */
          transition-opacity           /* Suavizado */
        `}
      />
    ) : FallbackIcon ? (
      /* 2. Respaldo: Icono estándar de Lucide */
      <FallbackIcon
        size={18}
        className={`
          /* --- Colores --- */
          text-vete-primary/70         /* Tinte institucional atenuado */
          group-hover:text-vete-primary /* Color pleno de marca en hover */

          /* --- Animación --- */
          transition-colors            /* Transición suave */
          duration-200                 /* Tiempo de 200ms */
        `}
      />
    ) : null}

    <span>{label}</span>
  </a>
);

/* =============================================================================
   SUB-COMPONENTE: MENÚ LATERAL MÓVIL (MobileNavigationDrawer)
   ============================================================================= */

/**
 * Propiedades del componente `MobileNavigationDrawer`.
 * 
 * @interface MobileDrawerProps
 * @property {boolean} isOpen - Estado de apertura del panel lateral.
 * @property {function(): void} onClose - Despachador para cerrar el panel y remover backdrop.
 * @property {NavigationLinkItem[]} links - Colección de enlaces activos filtrados por configuración.
 */
export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavigationLinkItem[];
}

/**
 * Cajón desplegable de navegación adaptable para dispositivos móviles (`MobileNavigationDrawer`).
 *
 * @component
 * @param {MobileDrawerProps} props - Propiedades de control y listado de enlaces.
 * @returns {JSX.Element} Panel flotante con fondo difuminado y lista de rutas.
 */
const MobileNavigationDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, links }) => (
  <>
    {/* Fondo oscurecido táctil (Backdrop) */}
    <div
      onClick={onClose}
      className={`
        /* --- Posición --- */
        fixed                        /* Fijo sobre toda la ventana */
        inset-0                      /* 100% de alto y ancho */
        z-[80]                       /* Capa inmediatamente inferior al cajón */

        /* --- Colores --- */
        bg-vete-overlay/40           /* Fondo oscurecido con opacidad */
        backdrop-blur-sm             /* Desenfoque de fondo */

        /* --- Animación --- */
        transition-opacity           /* Transición de opacidad */
        duration-300                 /* 300ms */
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}
    />

    {/* Cajón de Enlaces */}
    <div
      className={`
        /* --- Posición --- */
        fixed                        /* Posición fija flotante */
        top-24                       /* Anclado debajo de la cabecera */
        left-0                       /* Anclado al borde izquierdo */
        z-[90]                       /* Por encima del backdrop */

        /* --- Dimensiones --- */
        w-[85%]                      /* 85% de la pantalla */
        max-w-[300px]                /* Límite máximo de ancho */
        h-auto                       /* Altura adaptativa al contenido */
        p-6                          /* Padding interno */

        /* --- Colores --- */
        bg-vete-surface              /* Fondo de tarjeta configurado en el tema */
        border-r                     /* Borde lateral derecho */
        border-b                     /* Borde inferior */
        border-vete-border-subtle    /* Borde suave institucional */
        shadow-2xl                   /* Sombra profunda */

        /* --- Estilo --- */
        rounded-br-[2.5rem]          /* Esquina inferior redondeada */

        /* --- Animación --- */
        transition-all               /* Desplazamiento y opacidad */
        duration-300                 /* 300ms */
        ease-in-out                  /* Curva de aceleración suave */
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
      `}
    >
      <nav className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        flex-col                     /* Organización en columna */
        gap-5                        /* Separación entre ítems */
      `}>
        {links.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            onClick={onClose}
            className="text-base font-black uppercase tracking-wide"
          />
        ))}

        {/* Separador Visual de Marca */}
        <div className={`
          /* --- Dimensiones --- */
          w-10                       /* Ancho de la barra */
          h-1                        /* Altura de 4px */
          mt-2                       /* Margen superior */

          /* --- Colores --- */
          bg-vete-primary            /* Color principal de marca */

          /* --- Estilo --- */
          rounded-full               /* Forma de píldora */
        `} />
      </nav>
    </div>
  </>
);

/* =============================================================================
   COMPONENTE PRINCIPAL: HEADER Y RESOLUCIÓN DINÁMICA DE ENLACES
   ============================================================================= */

/**
 * Propiedades del componente `HeaderSession`.
 * 
 * @interface HeaderSessionProps
 * @property {string} [bgColor='bg-transparent'] - Clase de color de fondo inicial de Tailwind.
 */
export interface HeaderSessionProps {
  bgColor?: string;
}

/**
 * Barra superior de navegación y anclas dinámicas (`HeaderSession`).
 * 
 * Filtra los enlaces de navegación según las banderas de activación (`features`) del cliente
 * e inyecta la iconografía personalizada en SVG configurada para cada sección.
 *
 * @component
 * @param {HeaderSessionProps} props - Propiedades de configuración.
 * @returns {JSX.Element} Barra de navegación completa.
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // Detecta el desplazamiento vertical para aplicar efecto vidrio
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // Detecta si el carrito está abierto
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // Detecta si el menú está abierto

  /* Detecta el desplazamiento vertical para aplicar efecto vidrio */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------------------------------------------------------------------------
     3. FILTRADO DINÁMICO DE ENLACES CON ICONOS AGNÓSTICOS
     --------------------------------------------------------------------------- */
  const activeNavLinks = useMemo((): NavigationLinkItem[] => {
    const links: NavigationLinkItem[] = [];

    // 1. Tienda / Catálogo
    if (config?.features?.has_products) {
      links.push({
        label: 'Tienda',
        href: '#ProductsSession',
        iconImageUrl: config.products_section?.icon_image_url,
        fallbackIcon: ShoppingBag,
      });
    }

    // 2. Servicios
    if (config?.features?.has_services && config.services_section?.items?.length) {
      links.push({
        label: 'Servicios',
        href: '#ServicioSession',
        iconImageUrl: config.services_section?.icon_image_url,
        fallbackIcon: Layers,
      });
    }

    // 3. Promociones / Planes / Membresías
    if (config?.features?.has_health_plans && config.plans_section?.items?.length) {
      links.push({
        label: 'Promociones',
        href: '#PlanSession',
        iconImageUrl: config.plans_section?.icon_image_url,
        fallbackIcon: Tag,
      });
    }

    // 4. Ubicación / Estudio
    if (config?.features?.has_locations) {
      links.push({
        label: 'Local',
        href: '#MapsSection',
        iconImageUrl: config.location_section?.icon_image_url,
        fallbackIcon: MapPin,
      });
    }

    return links;
  }, [config]);

  const hasCart = config?.features?.has_cart ?? true;

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
        
        {/* BOTÓN HAMBURGUESA MÓVIL */}
        {activeNavLinks.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              /* --- Posición --- */
              flex                   /* Visible en pantallas pequeñas */
              lg:hidden              /* Oculto en escritorio */
              items-center           /* Centrado vertical */

              /* --- Dimensiones --- */
              p-1.5                  /* Padding táctil */

              /* --- Colores --- */
              text-vete-primary      /* Color de marca */

              /* --- Animación --- */
              transition-transform   /* Transición suave */
              active:scale-90        /* Pulsación */
            `}
            title="Abrir menú de navegación"
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        ) : (
          <div className="lg:hidden w-7" />
        )}

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
          <img
            src={config?.branding?.logo_url || '/tenant/logo.png'}
            alt={`Logo ${config?.business_name || 'Comercio'}`}
            className={`
              /* --- Dimensiones --- */
              w-10                   /* Tamaño móvil */
              md:w-12                /* Tamaño escritorio */
              h-auto                 /* Proporcional */
              object-contain         /* Sin deformación */

              /* --- Animación --- */
              group-hover:scale-105  /* Aumento sutil en hover */
              transition-transform   /* Transición suave */
            `}
          />

          <span className={`
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
            {config?.business_name || 'Comercio'}
          </span>
        </a>

        {/* NAVEGACIÓN DESKTOP: Enlaces dinámicos */}
        <nav className={`
          /* --- Posición --- */
          hidden                     /* Oculto en móvil y tablet */
          lg:flex                    /* Visible en escritorio */
          items-center               /* Centrado vertical */
          gap-8                      /* Espaciado entre enlaces */
        `}>
          {activeNavLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* BOTÓN DEL CARRITO CON CONTADOR */}
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
            {/* Visualización de Total Acumulado */}
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

            {/* Icono Circular de Carrito */}
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

              {/* Badge Numérico Flotante */}
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

      {/* Drawer Desplegable del Carrito */}
      {hasCart && (
        <PedidoDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* Menú Lateral Móvil con Enlaces e Iconos Dinámicos */}
      <MobileNavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={activeNavLinks}
      />
    </>
  );
};

export default HeaderSession;