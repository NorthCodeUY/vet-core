/* =============================================================================
   PÁGINA PRINCIPAL: ORQUESTADOR DE LANDING PAGE MULTI-TENANT
   ============================================================================= */

import React, { useMemo } from 'react';
import { useConfig } from '../../context/tenant_context';

/* --- Componentes de Infraestructura Visual --- */
import { SectionDivider } from '../../components/SectionDivider';
import { AmbientScrollAnimation } from '../../components/animations/AmbientScrollAnimation';

/* --- Módulos Seccionales de la Landing --- */
import HeaderSession from './sessions/HederSession';
import HeroSession from './sessions/HeroSession';
import ProductsSession from './sessions/ProductsSession';
import ServicioSession from './sessions/ServicioSession';
import { PlanSession } from './sessions/PlanSession';
import MapsSession from './sessions/MapsSession';
import Footer from './sessions/FooterSession';

/**
 * Contrato de definición para cada sección activa en la tubería de renderizado.
 * 
 * @interface ActiveSectionDefinition
 * @property {string} id - Identificador único de la sección en el DOM.
 * @property {function(string): React.ReactNode} renderComponent - Función constructora inyectando el color.
 * @property {boolean} [groupWithPrevious] - Si es true, comparte el fondo con la sección anterior sin onda.
 */
interface ActiveSectionDefinition {
  id: string;
  renderComponent: (bgColor: string) => React.ReactNode;
  groupWithPrevious?: boolean;
}

/**
 * Tokens de tema admitidos por la matriz de alternancia.
 */
type SectionThemeVariant = 'secondary' | 'dark';

/**
 * Sección procesada con sus metadatos de color calculados.
 * 
 * @interface ProcessedSection
 */
interface ProcessedSection extends ActiveSectionDefinition {
  currentTheme: SectionThemeVariant;
  previousTheme: SectionThemeVariant;
  isFirst: boolean;
}

/**
 * Orquestador principal de la Landing Page (`LandingPage`).
 * 
 * Implementa una máquina de estados para la alternancia de fondos y cálculo
 * dinámico de divisores vectoriales SVG, garantizando contraste continuo sin
 * importar qué módulos active o desactive el cliente en `config.json`.
 *
 * @component
 * @returns {JSX.Element} Árbol de componentes de la página de inicio.
 */
export default function LandingPage(): React.JSX.Element {
  const { config } = useConfig();

  /* ---------------------------------------------------------------------------
     PASO 1: EVALUACIÓN DE FEATURE FLAGS DEL TENANT
     Comprueba qué módulos tienen permiso de renderizado y contienen datos válidos.
     --------------------------------------------------------------------------- */
  const hasHero = Boolean(config?.features?.has_hero);
  const hasProducts = Boolean(config?.features?.has_products);
  const hasServices = Boolean(config?.features?.has_services && config?.services_section?.items?.length);
  const hasPlans = Boolean(config?.features?.has_health_plans && config?.plans_section?.items?.length);
  const hasMaps = Boolean(config?.features?.has_locations);
  const hasDividers = Boolean(config?.features?.has_dividers);

  /* ---------------------------------------------------------------------------
     PASO 2: CONSTRUCCIÓN DEL PIPELINE DE SECCIONES VISIBLES
     Filtra únicamente las secciones activas en una lista lineal en memoria.
     --------------------------------------------------------------------------- */
  const activeSectionsPipeline = useMemo<ActiveSectionDefinition[]>(() => {
    const pipeline: ActiveSectionDefinition[] = [];

    // 1. Portada (Hero)
    if (hasHero) {
      pipeline.push({
        id: 'HeroSession',
        renderComponent: (bg) => <HeroSession bgColor={bg} />,
      });
    }

    // 2. Catálogo de Productos
    if (hasProducts) {
      pipeline.push({
        id: 'ProductsSession',
        renderComponent: (bg) => <ProductsSession bgColor={bg} />,
      });
    }

    // 3. Servicios Profesionales
    if (hasServices) {
      pipeline.push({
        id: 'ServicioSession',
        renderComponent: (bg) => <ServicioSession bgColor={bg} />,
      });
    }

    // 4. Planes y Membresías
    // Nota: Si hay servicios activos inmediatamente antes, se agrupan bajo el mismo fondo.
    if (hasPlans) {
      pipeline.push({
        id: 'PlanSession',
        renderComponent: (bg) => <PlanSession bgColor={bg} />,
        groupWithPrevious: hasServices,
      });
    }

    // 5. Ubicación y Mapas
    if (hasMaps) {
      pipeline.push({
        id: 'MapsSection',
        renderComponent: (bg) => <MapsSession bgColor={bg} />,
      });
    }

    return pipeline;
  }, [hasHero, hasProducts, hasServices, hasPlans, hasMaps]);

  /* ---------------------------------------------------------------------------
     PASO 3: MÁQUINA DE ESTADOS - RESOLUCIÓN DE COLOR Y CONTRASTE
     Calcula matemáticamente qué color le toca a cada bloque y de qué color
     debe ser la cresta y el valle de cada divisor SVG.
     --------------------------------------------------------------------------- */
  const renderedSections = useMemo<ProcessedSection[]>(() => {
    // El Hero siempre arranca con el fondo secundario de marca
    let activeColor: SectionThemeVariant = 'secondary';

    return activeSectionsPipeline.map((section, index) => {
      const isFirst = index === 0;

      // Si no es la primera sección y no está agrupada con la anterior, invertimos el color
      if (!isFirst && !section.groupWithPrevious) {
        activeColor = activeColor === 'secondary' ? 'dark' : 'secondary';
      }

      // El color de la sección inmediatamente anterior
      const previousColor: SectionThemeVariant =
        activeColor === 'secondary' ? 'dark' : 'secondary';

      return {
        ...section,
        currentTheme: activeColor,
        previousTheme: previousColor,
        isFirst,
      };
    });
  }, [activeSectionsPipeline]);

  return (
    <div
      className={`
        /* --- Posición --- */
        relative                   /* Contenedor relativo estructural */

        /* --- Dimensiones --- */
        w-full                     /* Ancho completo del viewport */
        min-h-screen               /* Altura total mínima */
        m-0                        /* Reseteo de margen */
        p-0                        /* Reseteo de padding */

        /* --- Colores --- */
        bg-vete-dark               /* Fondo oscuro base institucional */
        text-vete-text-base        /* Color de lectura principal */

        /* --- Estilo --- */
        font-sans                  /* Tipografía configurada en Tailwind */
        overflow-x-hidden          /* Bloquea scroll horizontal por animaciones */
      `}
    >
      {/* =====================================================================
         CAPA 1 (z-10): ANIMACIÓN AMBIENTAL VOLUMÉTRICA
         Flota por encima de los fondos (z-0) y por debajo de los textos (z-20)
         ===================================================================== */}
      {config?.features?.has_background_animation && <AmbientScrollAnimation />}

      {/* =====================================================================
         CAPA 3 (z-50): CABECERA SUPERIOR FIJA (NAVBAR)
         ===================================================================== */}
      <HeaderSession bgColor="bg-vete-secondary" />

      {/* =====================================================================
         CUERPO PRINCIPAL DINÁMICO
         ===================================================================== */}
      <main
        className={`
          /* --- Posición --- */
          relative                 /* Mantiene el contexto de apilamiento */

          /* --- Dimensiones --- */
          w-full                   /* Ancho completo */
          pt-24                    /* Compensa la altura del header fijo (h-24) */
        `}
      >
        {renderedSections.map((sec) => {
          /* 1. Mapeo de Clases de Tailwind según el tema resuelto */
          const isCurrentSecondary = sec.currentTheme === 'secondary';
          const isPreviousSecondary = sec.previousTheme === 'secondary';

          // Fondo principal de esta sección
          const currentBgClass = isCurrentSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';

          const dividerTopColor = isPreviousSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';
          const dividerBottomColor = isCurrentSecondary ? 'text-vete-secondary' : 'text-vete-dark';

          return (
            <section
              key={sec.id}
              id={sec.id}
              className={`
                /* --- Posición --- */
                relative           /* Posicionamiento relativo para stacking context */

                /* --- Dimensiones --- */
                w-full             /* Ancho completo */

                /* --- Colores --- */
                ${currentBgClass}  /* Fondo calculado dinámicamente */
              `}
            >
              {/* CAPA 0 (z-0): DIVISOR ONDULATORIO SVG
                  Solo se dibuja si los divisores están activos, no es la primera sección
                  y no está fusionada con la sección anterior */}
              {hasDividers && !sec.isFirst && !sec.groupWithPrevious && (
                <div className="relative z-0">
                  {/* <!> Tengo que activar esto para que sea correcto   */}
                  <SectionDivider
                    topColor={dividerTopColor}
                    bottomColor={dividerBottomColor}
                    isReversed={true}
                  />
                </div>
              )}

              {/* CAPA 2 (z-20): CONTENIDO FUNCIONAL E INTERACTIVO
                  Se pasa 'bg-transparent' para que tome el fondo de la sección
                  y permita que el video 3D (z-10) pase por detrás de los textos */}
              <div className="relative z-20">
                {sec.renderComponent('bg-transparent')}
              </div>
            </section>
          );
        })}
      </main>

      {/* =====================================================================
         FOOTER INSTITUCIONAL (Capa z-40)
         <!> Aca en el futer esta mal el menu flotante esta bien que este por debajo pero cuando llega al final el menu que esta por ensima de todo esta bien que se esconda pero la animacion me gustaria que pasara ensima para segir viendose en la version selulares queda muy raro principalmete  
         ===================================================================== */}
      <Footer bgColor="bg-vete-dark" />
    </div>
  );
}   