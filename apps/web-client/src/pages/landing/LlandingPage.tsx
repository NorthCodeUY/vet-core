// /apps/web-client/src/pages/landing/LlandingPage.tsx

/* =============================================================================
   PÁGINA PRINCIPAL: ORQUESTADOR DE LANDING PAGE MULTI-TENANT (LlandingPage)
   ============================================================================= */

import React, { useMemo } from 'react';
import { useConfig } from '../../context/tenant_context';

/* --- Componentes de Infraestructura Visual --- */
import { SectionDivider } from '../../components/SectionDivider';
import { AmbientScrollAnimation } from '../../components/animations/AmbientScrollAnimation';
import { FloatingBottomBar } from '../../components/FloatingBottomBar';

/* --- Módulos Seccionales de la Landing --- */
import HeaderSession from './sessions/HederSession';
import HeroSession from './sessions/HeroSession';
import ProductsSession from './sessions/ProductsSession';
import ServicioSession from './sessions/ServicioSession';
import { PlanSession } from './sessions/PlanSession';
import PortfolioSession from './sessions/PortfolioSession';
import MapsSession from './sessions/MapsSession';
import FooterSession from './sessions/FooterSession';

/**
 * Representa la definición base de una sección lista para renderizarse.
 * 
 * @interface ActiveSectionDefinition
 * @property {string} id - Identificador único de la sección (usado para anclas # y claves React).
 * @property {function(string): React.ReactNode} renderComponent - Función que despacha el JSX de la sección.
 * @property {boolean} [groupWithPrevious=false] - Si es true, conserva el mismo color de fondo que la sección anterior sin alternar.
 */
interface ActiveSectionDefinition {
  id: string;
  renderComponent: (bgColor: string) => React.ReactNode;
  groupWithPrevious?: boolean;
}

/**
 * Variantes de color permitidas para la alternancia de contrastes.
 */
type SectionThemeVariant = 'secondary' | 'dark';

/**
 * Sección procesada con sus colores de fondo y transiciones calculadas.
 * 
 * @interface ProcessedSection
 * @extends ActiveSectionDefinition
 * @property {SectionThemeVariant} currentTheme - Color de fondo de la sección actual.
 * @property {SectionThemeVariant} previousTheme - Color de fondo de la sección anterior (para la onda SVG).
 * @property {boolean} isFirst - Indica si es la primera sección de la página.
 */
interface ProcessedSection extends ActiveSectionDefinition {
  currentTheme: SectionThemeVariant;
  previousTheme: SectionThemeVariant;
  isFirst: boolean;
}

/**
 * Página principal multi-tenant (`LandingPage`).
 * 
 * Utiliza un motor de pipeline que inspecciona las banderas de activación (`features`),
 * filtra únicamente las secciones habilitadas por el cliente y calcula automáticamente
 * la alternancia de colores (`bg-vete-secondary` <-> `bg-vete-dark`) y las ondas SVG
 * para que nunca coincidan dos fondos iguales ni queden divisores dobles.
 *
 * @component
 * @returns {JSX.Element} Landing page orquestada dinámicamente.
 */
export default function LandingPage(): React.JSX.Element {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();

  /* ---------------------------------------------------------------------------
     2. EVALUACIÓN SEGURA DE FEATURE FLAGS
     --------------------------------------------------------------------------- */
  const hasHero = Boolean(config?.features?.has_hero);
  const hasProducts = Boolean(config?.features?.has_products);
  const hasServices = Boolean(config?.features?.has_services && config?.services_section?.items?.length);
  const hasPlans = Boolean(config?.features?.has_health_plans && config?.plans_section?.items?.length);
  const hasPortfolio = Boolean(config?.features?.has_portfolio && config?.portfolio_section?.items?.length);
  const hasMaps = Boolean(config?.features?.has_locations);
  const hasDividers = Boolean(config?.features?.has_dividers);
  const hasFloatingBottomBar = Boolean(config?.features?.has_floating_bottom_bar);

  /* ---------------------------------------------------------------------------
     3. PIPELINE DE SECCIONES ACTIVAS (Filtrado en Orden de Aparición)
     Para agregar una sección nueva, simplemente agregas un 'if' en esta lista.
     --------------------------------------------------------------------------- */
  const activeSectionsPipeline = useMemo<ActiveSectionDefinition[]>(() => {
    const pipeline: ActiveSectionDefinition[] = [];

    // 1. Portada Principal
    if (hasHero) {
      pipeline.push({
        id: 'HeroSession',
        renderComponent: (bg) => <HeroSession bgColor={bg} />
      });
    }

    // 2. Catálogo de Productos y Buscador
    if (hasProducts) {
      pipeline.push({
        id: 'ProductsSession',
        renderComponent: (bg) => <ProductsSession bgColor={bg} />
      });
    }

    // 3. Módulo de Servicios
    if (hasServices) {
      pipeline.push({
        id: 'ServicioSession',
        renderComponent: (bg) => <ServicioSession bgColor={bg} />
      });
    }

    // 4. Planes y Membresías (Se agrupa con servicios si ambos están presentes)
    if (hasPlans) {
      pipeline.push({
        id: 'PlanSession',
        renderComponent: (bg) => <PlanSession bgColor={bg} />,
        groupWithPrevious: hasServices,
      });
    }

    // 5. Galería de Portafolio / Trabajos Realizados
    if (hasPortfolio) {
      pipeline.push({
        id: 'PortfolioSession',
        renderComponent: (bg) => <PortfolioSession bgColor={bg} />,
      });
    }

    // 6. Ubicación Física y Google Maps
    if (hasMaps) {
      pipeline.push({
        id: 'MapsSection',
        renderComponent: (bg) => <MapsSession bgColor={bg} />
      });
    }

    return pipeline;
  }, [hasHero, hasProducts, hasServices, hasPlans, hasPortfolio, hasMaps]);

  /* ---------------------------------------------------------------------------
     4. MOTOR DE ALTERNANCIA AUTOMÁTICA DE FONDOS Y DIVISORES
     Calcula matemáticamente qué color le toca a cada sección para que nunca
     choquen dos fondos del mismo color, sin importar qué módulos se apaguen.
     --------------------------------------------------------------------------- */
  const renderedSections = useMemo<ProcessedSection[]>(() => {
    let activeColor: SectionThemeVariant = 'secondary';

    return activeSectionsPipeline.map((section, index) => {
      const isFirst = index === 0;

      // Si no es la primera sección y no está agrupada, invierte el color
      if (!isFirst && !section.groupWithPrevious) {
        activeColor = activeColor === 'secondary' ? 'dark' : 'secondary';
      }

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
        relative                     /* Contexto de apilamiento */
        overflow-x-hidden            /* Previene desbordamiento horizontal */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        min-h-screen                 /* Ocupa como mínimo el alto de pantalla */
        m-0                          /* Sin margen */
        p-0                          /* Sin padding */

        /* --- Colores --- */
        bg-vete-dark                 /* Fondo oscuro base */
        text-vete-text-base          /* Color tipográfico principal */

        /* --- Texto --- */
        font-sans                    /* Tipografía del sistema */

        /* --- Animación --- */
      `}
    >
      {/* =====================================================================
         CAPA AMBIENTAL (z-[45]): Animación 3D Flotante
         ===================================================================== */}
      {config?.features?.has_background_animation && (
        <AmbientScrollAnimation />
      )}

      {/* =====================================================================
         CABECERA INSTITUCIONAL: Navbar Fijo Superior
         ===================================================================== */}
      <HeaderSession bgColor="bg-vete-secondary" />

      {/* ===================================================================
         CUERPO PRINCIPAL: Renderizado Dinámico del Pipeline de Secciones
         =================================================================== */}
      <main className="relative w-full pt-24">
        {renderedSections.map((sec) => {
          const isCurrentSecondary = sec.currentTheme === 'secondary';
          const isPreviousSecondary = sec.previousTheme === 'secondary';

          // Asignación de tokens según el turno de color de la sección
          const currentBgClass = isCurrentSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';
          const dividerTopColor = isPreviousSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';
          const dividerBottomColor = isCurrentSecondary ? 'text-vete-secondary' : 'text-vete-dark';

          return (
            <section
              key={sec.id}
              id={sec.id}
              className={`relative w-full ${currentBgClass}`}
            >
              {/* Onda SVG Divisoria: Solo si están activos los divisores y no está agrupada */}
              {hasDividers && !sec.isFirst && !sec.groupWithPrevious && (
                <div className="relative z-0">
                  <SectionDivider
                    topColor={dividerTopColor}
                    bottomColor={dividerBottomColor}
                    isReversed={true}
                  />
                </div>
              )}

              {/* Contenido en Capa Frontal (z-20) */}
              <div className="relative z-20">
                {sec.renderComponent('bg-transparent')}
              </div>
            </section>
          );
        })}
      </main>

      {/* Barra de Navegación Flotante Inferior (Condicional por Feature Flag) */}
      {hasFloatingBottomBar && (
        <FloatingBottomBar />
      )}

      {/* Pie de Página Institucional */}
      <FooterSession bgColor="bg-vete-dark" />
    </div>
  );
}