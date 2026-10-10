// apps/web-client/src/pages/landing/LlandingPage.tsx


/* =============================================================================
   PÁGINA PRINCIPAL: ORQUESTADOR DE LANDING PAGE (LlandingPage)
   ============================================================================= */

import React from 'react';
import { useConfig } from '../../context/tenant_context';

/* --- Componentes Visuales y Divisores --- */
import { SectionDivider } from '../../components/SectionDivider';
/* Importaciones para 3D*/
import { AmbientScrollAnimation } from '../../components/animations/AmbientScrollAnimation';


/* --- Secciones Modulares de la Landing --- */
import HeaderSession from './sessions/HederSession';
import HeroSession from './sessions/HeroSession';
import ProductsSession from './sessions/ProductsSession';
import ServicioSession from './sessions/ServicioSession';
import { PlanSession } from './sessions/PlanSession';
import MapsSession from './sessions/MapsSession';
import Footer from './sessions/FooterSession';

/**
 * Página de Aterrizaje Principal Multi-tenant (`LandingPage`).
 * 
 * Orquesta secuencialmente las secciones de la plataforma, alternando contrastes
 * de color de fondo y evaluando los feature flags del cliente activo (`has_services`,
 * `has_health_plans`) para renderizar únicamente los módulos habilitados junto
 * con sus respectivas transiciones ondulatorias SVG.
 *
 * @component
 * @returns {JSX.Element} Estructura completa de la landing page.
 */
export default function LandingPage(): React.JSX.Element {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();

  /* ---------------------------------------------------------------------------
     2. Traigo la configuracion de la landing page que muestro y que no dependei de configs/config.json
     --------------------------------------------------------------------------- */
  
  
  const hasProductsSession = Boolean( // Determina si se muestra la sección de productos
    config?.features?.has_products
  );
  
  const hasServicesSession = Boolean( // Determina si se muestra la sección de servicios
    config?.features?.has_services // Si esta en true, se muestra la sección de servicios
    && config?.services_section?.items?.length // Si hay servicios cargados
  );

  const hasPlansSessions = Boolean( // Determina si se muestra la sección de planes
    config?.features?.has_health_plans // Determina si se setio la condicion de oculatr planes en config.json
    && config?.plans_section?.items?.length // Determina si hay planes cargados
  );
  
  const hasMapsSession = Boolean( // Determina si se muestra la sección de mapas
    config?.features?.has_locations // Determina si se setio la condicion de oculatr mapas en config.json
  );

  const hasHeroSession = Boolean( // Determina si se muestra la sección de heroe
    config?.features?.has_hero
  )

  const hasDividers = Boolean( // Determina si se muestran los divisores decorativo
   config?.features?.has_dividers 
  )
  

  return (


      <div className="bg-vete-dark min-h-screen font-sans text-vete-text-base overflow-x-hidden w-full relative border-0 m-0 p-0">

            {/* 🚀 Animación 3D Ambiental de Fondo (Se mueve con el scroll detrás de todo) */}
      <AmbientScrollAnimation />

      {/* CABECERA PRINCIPAL (Navbar Fijo) */}
      <HeaderSession bgColor="bg-vete-secondary" />

      {/* CUERPO PRINCIPAL (Main con compensación de altura del Header) */}      
      <main
        className={`
          /* --- Posición --- */
          relative                   /* Flujo normal del documento */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          pt-24                      /* Compensa los 96px (h-24) del header fixed */

        `}
      >
        {/* SECCIÓN 1: Portada Principal (Hero) */}
        {hasHeroSession && (
          <section id="HeroSession">
            <HeroSession bgColor="bg-vete-secondary" />
          </section>
        )}

        {/* SECCIÓN 2: Catálogo de Productos y Buscador */}
        {hasProductsSession && (
          <section id="ProductsSession">
            {hasDividers && (
              <SectionDivider
                topColor="bg-vete-secondary"
                bottomColor="text-vete-dark"
              />
            )}
            <ProductsSession bgColor="bg-vete-dark" />
          </section>
        )}

        {/* <!> aco no se si esta bien pero abira que verlo visualmente SECCIÓN 3: Módulo de Servicios (Condicional por Feature Flag) */}
        {hasServicesSession && (
          <section id="ServicioSession">
            {hasDividers && (
              <SectionDivider
                topColor="bg-vete-dark"
                bottomColor="text-vete-secondary"
              />
            )}
            <ServicioSession bgColor="bg-vete-secondary" />
          </section>
        )}

        {/* SECCIÓN 4: Módulo de Planes / Suscripciones (Condicional) */}
        {hasPlansSessions && (
          <section id="PlanSession">
            {/* Si no hubo sección de servicios previa, la onda viene desde fondo oscuro */}
            {hasDividers && (
              <SectionDivider
                topColor="bg-vete-dark"
                bottomColor="text-vete-secondary"
              />
            )}
            <PlanSession bgColor="bg-vete-secondary" />
          </section>
        )}

        {/* SECCIÓN 5: Ubicación Física y Google Maps */}
        {hasMapsSession && (
          <section id="MapsSection">
            {/* Si hubo servicios o planes (fondo secundario), dibuja la onda hacia fondo oscuro */}
            {hasDividers && (
              <SectionDivider
                topColor="bg-vete-secondary"
                bottomColor="text-vete-dark"
              />
            )}
            <MapsSession bgColor="bg-vete-dark" />
          </section>
        )}
        {/* aca me faltan ver las secciones que faltan que son la de pregunta o consultas y la de testimonios */}
      </main>

      {/* ===================================================================
         6. PIE DE PÁGINA Y CRÉDITOS
         =================================================================== */}
      <Footer bgColor="bg-vete-dark" />
    </div>
  );
}