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
        {/* SECCIÓN 1: Hero */}
        {hasHeroSession && (
          <section id="HeroSession" className="relative z-20">
            <HeroSession bgColor="bg-transparent" />
          </section>
        )}

        {/* SECCIÓN 2: Productos (Fondo Oscuro) */}
        {hasProductsSession && (
          <section id="ProductsSession" className="relative">
            {/* Divisor en Capa 1 (z-0): el video pasa por encima */}
            {hasDividers && (
              <div className="relative z-0">
                <SectionDivider
                  topColor="bg-vete-secondary"
                  bottomColor="text-vete-dark"
                />
              </div>
            )}
            {/* Contenido en Capa 3 (z-20): los textos pasan por encima del video */}
            <div className="relative z-20">
              <ProductsSession bgColor="bg-transparent" />
            </div>
          </section>
        )}

        {/* SECCIÓN 3: Servicios (Fondo Secundario) */}
        {hasServicesSession && (
          <section id="ServicioSession" className="relative">
            {hasDividers && (
              <div className="relative z-0">
                <SectionDivider
                  topColor="bg-vete-dark"
                  bottomColor="text-vete-secondary"
                />
              </div>
            )}
            <div className="relative z-20">
              <ServicioSession bgColor="bg-transparent" />
            </div>
          </section>
        )}

        {/* SECCIÓN 4: Planes / Membresías */}
        {hasPlansSessions && (
          <section id="PlanSession" className="relative">
            {hasDividers && (
              <div className="relative z-0">
                <SectionDivider
                  topColor="bg-vete-secondary"
                  bottomColor="text-vete-dark"
                />
              </div>
            )}
            <div className="relative z-20">
              <PlanSession bgColor="bg-transparent" />
            </div>
          </section>
        )}

        {/* SECCIÓN 5: Ubicación y Mapas */}
        {hasMapsSession && (
          <section id="MapsSection" className="relative">
            {hasDividers && (
              <div className="relative z-0">
                <SectionDivider
                  topColor="bg-vete-dark"
                  bottomColor="text-vete-secondary"
                />
              </div>
            )}
            <div className="relative z-20">
              <MapsSession bgColor="bg-transparent" />
            </div>
          </section>
        )}gh 

      </main>

      {/* Footer */}
      <Footer bgColor="bg-vete-dark" />
    </div>
  );
}