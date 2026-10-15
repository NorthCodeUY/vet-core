// /apps/web-client/src/pages/landing/LlandingPage.tsx

/* =============================================================================
   PÁGINA PRINCIPAL: ORQUESTADOR DE LANDING PAGE MULTI-TENANT
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
import MapsSession from './sessions/MapsSession';
import FooterSession from './sessions/FooterSession';

interface ActiveSectionDefinition {
  id: string;
  renderComponent: (bgColor: string) => React.ReactNode;
  groupWithPrevious?: boolean;
}

type SectionThemeVariant = 'secondary' | 'dark';

interface ProcessedSection extends ActiveSectionDefinition {
  currentTheme: SectionThemeVariant;
  previousTheme: SectionThemeVariant;
  isFirst: boolean;
}

export default function LandingPage(): React.JSX.Element {
  const { config } = useConfig();

  const hasHero = Boolean(config?.features?.has_hero);
  const hasProducts = Boolean(config?.features?.has_products);
  const hasServices = Boolean(config?.features?.has_services && config?.services_section?.items?.length);
  const hasPlans = Boolean(config?.features?.has_health_plans && config?.plans_section?.items?.length);
  const hasMaps = Boolean(config?.features?.has_locations);
  const hasDividers = Boolean(config?.features?.has_dividers);

  /* Pipeline de secciones activas */
  const activeSectionsPipeline = useMemo<ActiveSectionDefinition[]>(() => {
    const pipeline: ActiveSectionDefinition[] = [];

    if (hasHero) pipeline.push({ id: 'HeroSession', renderComponent: (bg) => <HeroSession bgColor={bg} /> });
    if (hasProducts) pipeline.push({ id: 'ProductsSession', renderComponent: (bg) => <ProductsSession bgColor={bg} /> });
    if (hasServices) pipeline.push({ id: 'ServicioSession', renderComponent: (bg) => <ServicioSession bgColor={bg} /> });
    if (hasPlans) {
      pipeline.push({
        id: 'PlanSession',
        renderComponent: (bg) => <PlanSession bgColor={bg} />,
        groupWithPrevious: hasServices,
      });
    }
    if (hasMaps) pipeline.push({ id: 'MapsSection', renderComponent: (bg) => <MapsSession bgColor={bg} /> });

    return pipeline;
  }, [hasHero, hasProducts, hasServices, hasPlans, hasMaps]);

  /* Alternador dinámico de contrastes */
  const renderedSections = useMemo<ProcessedSection[]>(() => {
    let activeColor: SectionThemeVariant = 'secondary';

    return activeSectionsPipeline.map((section, index) => {
      const isFirst = index === 0;

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
        relative
        w-full
        min-h-screen
        m-0
        p-0
        bg-vete-dark
        text-vete-text-base
        font-sans
        overflow-x-hidden
      `}
    >
      {/* =====================================================================
         CAPA 5 (z-[45]): ANIMACIÓN AMBIENTAL VOLUMÉTRICA
          z-[45] con pointer-events-none: Flota por encima del Footer (z-40) 
         sin cortarse en mobile, permitiendo hacer clic en cualquier enlace del footer
         ===================================================================== */}
      {config?.features?.has_background_animation && (
        <AmbientScrollAnimation />
      )}

      {/* CAPA 6 (z-50): HEADER FIJO */}
      <HeaderSession bgColor="bg-vete-secondary" />

      {/* CUERPO PRINCIPAL */}
      <main className="relative w-full pt-24">
        {renderedSections.map((sec) => {
          const isCurrentSecondary = sec.currentTheme === 'secondary';
          const isPreviousSecondary = sec.previousTheme === 'secondary';

          const currentBgClass = isCurrentSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';
          const dividerTopColor = isPreviousSecondary ? 'bg-vete-secondary' : 'bg-vete-dark';
          const dividerBottomColor = isCurrentSecondary ? 'text-vete-secondary' : 'text-vete-dark';

          return (
            <section
              key={sec.id}
              id={sec.id}
              className={`relative w-full ${currentBgClass}`}
            >
              {hasDividers && !sec.isFirst && !sec.groupWithPrevious && (
                <div className="relative z-0">
                  <SectionDivider
                    topColor={dividerTopColor}
                    bottomColor={dividerBottomColor}
                    isReversed={true}
                  />
                </div>
              )}

              <div className="relative z-20">
                {sec.renderComponent('bg-transparent')}
              </div>
            </section>
          );
        })}
      </main>

      <FloatingBottomBar/>

      <FooterSession bgColor="bg-vete-dark" />
    </div>
  );
}