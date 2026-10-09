// apps/web-client/src/pages/landing/sessions/ProductsSession.tsx
/* =============================================================================
   COMPONENTE: SECCIÓN DE CATÁLOGO Y BÚSQUEDA DE PRODUCTOS (ProductsSession)
   ============================================================================= */

import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CategoryGroupCard } from '../../../components/CategoryGroupCard';
import { ProductCard } from '../../../components/ProductCard/ProductCard';
import { useConfig } from '../../../context/tenant_context';
import { useProducts } from '../../../hooks/useProducts';

/**
 * Propiedades del componente `ProductsSession`.
 * 
 * @interface ProductsSessionProps
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el fondo de la sección.
 */
export interface ProductsSessionProps {
  bgColor?: string;
}

/**
 * Sección principal de catálogo de productos conectada a la API de FastAPI (`ProductsSession`).
 * 
 * Gestiona el ciclo de vida de carga de productos, el filtrado interactivo por buscador global,
 * la visualización segmentada por categorías y la habilitación condicional mediante la
 * bandera de activación `features.has_cart`. Soporta títulos híbridos en SVG o texto HTML.
 *
 * @component
 * @param {ProductsSessionProps} props - Propiedades de configuración visual.
 * @returns {JSX.Element | null} Catálogo dinámico o `null` si el cliente tiene el módulo apagado.
 */
export const ProductsSession: React.FC<ProductsSessionProps> = ({ bgColor = 'bg-transparent' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DE HOOKS Y CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();
  const {
    searchTerm,
    setSearchTerm,
    categories,
    loading,
    filteredResults,
  } = useProducts();

  /* ---------------------------------------------------------------------------
     2. CONTROL DE VISIBILIDAD (Feature Flag Guard)
     --------------------------------------------------------------------------- */
  const isEnabled = config?.features?.has_cart ?? true;

  if (!isEnabled) {
    return null;
  }

  /* ---------------------------------------------------------------------------
     3. RENDERIZADO DE ESTADO DE CARGA ASÍNCRONO
     --------------------------------------------------------------------------- */
  if (loading) {
    return (
      <div
        className={`
          /* --- Posición --- */
          flex                       /* Layout flexible */
          flex-col                   /* Disposición vertical */
          items-center               /* Centrado horizontal */
          justify-center             /* Centrado vertical */
          
          /* --- Dimensiones --- */
          py-40                      /* Espaciado vertical amplio */
          gap-4                      /* Separación icono-texto */
        `}
      >
        <Loader2 className="animate-spin text-vete-primary" size={48} />
        
        <p
          className={`

            /* --- Colores --- */
            text-vete-primary        /* Color principal de marca */

            /* --- Texto --- */
            text-base                /* Tamaño estándar */
            font-bold                /* Grosor 700 */
            italic                   /* Cursiva */

            /* --- Animación --- */
            animate-pulse            /* Pulso suave de carga */
          `}
        >
          {config?.custom_messages?.whatsapp_order_prefix
            ? `Cargando catálogo de ${config?.business_name}...`
            : `Cargando catálogo de ${config?.business_name || 'productos'}...`}
        </p>
      </div>
    );
  }

  return (
    <section
      id="ProductsSession"
      className={`
        /* --- Posición --- */
        relative                     /* Contexto para elementos internos */
        
        /* --- Dimensiones --- */
        w-full                       /* Ocupa el 100% del ancho */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral escritorio */
        py-20                        /* Espaciado vertical */
        mt-10                        /* Margen superior */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico recibido por props */

      `}
    >
      <div
        className={`
          /* --- Posición --- */
          mx-auto                    /* Centrado horizontal */

          /* --- Dimensiones --- */
          max-w-[1400px]             /* Límite de ancho para pantallas amplias */
          w-full                     /* Ancho completo */
        `}
      >
        {/* ===================================================================
           CABECERA: Título Híbrido (SVG / HTML) y Buscador Global
           =================================================================== */}
        <div
          className={`
            /* --- Posición --- */
            flex                     /* Layout flexible */
            flex-col                 /* Columna en móvil */
            lg:flex-row              /* Fila en escritorio */
            lg:justify-between       /* Distribución a los extremos */
            items-center             /* Centrado vertical */
            gap-8                    /* Separación título-buscador */
            
            /* --- Dimensiones --- */
            mb-16                    /* Margen inferior del bloque */
          `}
        >
          {/* Título: Soporta Imagen SVG o Texto con Formato HTML */}
          <h2
            dangerouslySetInnerHTML={{
              __html: 'Lista de <span class="text-vete-primary">Productos</span>',
            }}
            className={`

              /* --- Colores --- */
              text-vete-text-base    /* Color tipográfico principal (text_base) */

              /* --- Texto --- */
              text-4xl               /* Tamaño grande en móvil */
              md:text-5xl            /* Tamaño destacado en escritorio */
              font-black             /* Grosor 900 */
              italic                 /* Estilo cursivo */
              uppercase              /* Mayúsculas institucionales */
              tracking-tighter       /* Espaciado de letras compacto */

            `}
          />

          {/* Contenedor del Buscador Global */}
          <div
            className={`
              /* --- Posición --- */
              relative               /* Contexto para icono flotante */
              
              /* --- Dimensiones --- */
              w-full                 /* Ancho total móvil */
              max-w-md               /* Límite de ancho desktop */

              /* --- Animación --- */
              group                  /* Agrupador para efectos de foco */
            `}
          >
            <Search
              size={20}
              className={`
                /* --- Posición --- */
                absolute             /* Flotante dentro del input */
                left-4               /* Anclado a la izquierda */
                top-1/2              /* Centrado vertical */
                -translate-y-1/2     /* Ajuste fino de eje */

                /* --- Colores --- */
                text-vete-text-muted /* Color atenuado (text_muted) */

                /* --- Animación --- */
                group-focus-within:text-vete-primary /* Resalta con color de marca */
                transition-colors    /* Transición suave */
              `}
            />

            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                /* --- Dimensiones --- */
                w-full               /* Ancho total */
                pl-12                /* Espacio izquierdo para la lupa */
                pr-4                 /* Padding derecho */
                py-4                 /* Altura de campo cómoda */
                
                /* --- Colores --- */
                bg-vete-surface      /* Fondo de tarjeta blanco/claro */
                border-2             /* Borde visible de 2px */
                border-vete-border-subtle /* Borde suave institucional */
                text-vete-text-base  /* Color del texto que escribe el usuario */
                shadow-xl            /* Sombra para profundidad */

                /* --- Texto --- */
                placeholder:text-vete-text-muted /* Color del placeholder */
                text-sm              /* Tamaño de texto */
                font-medium          /* Grosor medio */

                /* --- Estilo --- */
                rounded-2xl          /* Bordes redondeados */
                
                /* --- Animación --- */
                focus:outline-none   /* Quita contorno nativo */
                focus:border-vete-primary /* Resalta borde en foco */
                transition-all       /* Transición en todos los estados */
              `}
            />
          </div>
        </div>

        {/* ===================================================================
           ÁREA DE CONTENIDO: Resultados de Búsqueda o Grupos por Categoría
           =================================================================== */}
        <div className="w-full">
          {searchTerm ? (
            /* Vista 1: Resultados Filtrados por Búsqueda */
            <div
              className={`
                /* --- Animación --- */
                animate-in           /* Entrada animada */
                fade-in              /* Desvanecimiento */
                slide-in-from-bottom-4 /* Desplazamiento vertical suave */
                duration-300         /* Tiempo de 300ms */
              `}
            >
              <h3
                className={`
                  /* --- Dimensiones --- */
                  mb-8               /* Margen inferior */

                  /* --- Colores --- */
                  text-vete-primary  /* Color de marca */

                  /* --- Texto --- */
                  text-2xl           /* Tamaño intermedio */
                  font-bold          /* Grosor 700 */
                  italic             /* Cursiva */
                `}
              >
                Resultados para "{searchTerm}"
              </h3>

              <div
                className={`
                  /* --- Posición --- */
                  grid               /* Grilla responsiva */
                  grid-cols-1        /* 1 columna móvil */
                  sm:grid-cols-2     /* 2 columnas tablet */
                  lg:grid-cols-3     /* 3 columnas laptop */
                  xl:grid-cols-4     /* 4 columnas desktop */
                  justify-items-center /* Centrado horizontal */

                  /* --- Dimensiones --- */
                  gap-6              /* Separación entre tarjetas */
                `}
              >
                {filteredResults?.map((p) => (
                  <ProductCard key={p.prod_id} producto={p} />
                ))}

                {filteredResults?.length === 0 && (
                  <p
                    className={`
                      /* --- Dimensiones --- */
                      col-span-full  /* Ocupa todo el ancho */
                      py-10          /* Padding vertical */

                      /* --- Colores --- */
                      text-vete-text-muted /* Color atenuado */

                      /* --- Texto --- */
                      text-center    /* Centrado */
                      font-medium    /* Grosor medio */
                    `}
                  >
                    No se encontraron productos que coincidan con su búsqueda.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Vista 2: Catálogo Normal Agrupado por Categorías */
            <div
              className={`
                /* --- Posición --- */
                flex                 /* Layout flexible */
                flex-col             /* Disposición en columna */
                
                /* --- Dimensiones --- */
                gap-20               /* Separación amplia entre categorías */
              `}
            >
              {categories.map((cat) => (
                <CategoryGroupCard
                  key={cat.cat_id}
                  title={cat.cat_nombre}
                  catId={cat.cat_id}
                  initialData={cat.productos}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSession;