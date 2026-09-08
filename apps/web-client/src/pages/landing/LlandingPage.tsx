// apps/web-client/src/pages/landing/LlandingPage.tsx


import { ServiceCard } from '../../components/ServiceCard.tsx';

import { PlanCard } from '../../components/PlanCard.tsx';
import { SectionDivider } from '../../components/SectionDivider.tsx';
import { WhatsAppButton } from '../../components/WhatsAppButtonProps.tsx';



// <!> Esto creo que no va aca 
// import { PedidoProvider } from '../../context/pedido_context.tsx'; // Importa el proveedor

import { Clock, Stethoscope, Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';

// Secciones de la web
import ProductsSession from './sessions/ProductsSession.tsx'; // Seccion de productos
import HeaderSession from './sessions/HederSession.tsx'; // Seccion de productos
import HeroSession from './sessions/HeroSession.tsx';
import MapsSession from './sessions/MapsSession.tsx'; // Seccion de productos
import Footer from './sessions/FooterSession.tsx';
import ServicioSession from './sessions/ServicioSession.tsx';
import { PlanSession } from './sessions/PlanSession.tsx';
import { AboutSession } from './sessions/AboutSession.tsx'; 

export default function LandingPage() {
  return (
    /* Agregamos overflow-x-hidden para evitar la franja lateral */
    <div className="bg-vete-dark min-h-screen font-sans text-vete-text-light overflow-x-hidden w-full relative border-0 m-0 p-0">

      {/* --- 1. Componente de Header --- */}
      <HeaderSession bgColor='bg-vete-secondary' />

      <main className={`
        /* <!> Esto tendria que mejorarlo queda demaciado espacio para con el heder
        si lo dejo a pt a 4 me gusta pero a una resolucion de 767 de anco se parte lo dejo asi asi avansao */
        /* --- Posición --- */
        relative                     /* Mantiene el flujo del documento */

        /* --- Dimensiones --- */
        pt-24                        /* FIX: Compensa los 96px (h-24) del Header fixed */
        md:pt-24                    /* FIX: Compensa los 96px (h-24) del Header fixed */
   
        `}>


        <section id="HeroSession">
          <HeroSession bgColor='bg-vete-secondary' />
        </section>

        <section id="ProductsSession">
          {/* separador V1*/}
          <SectionDivider
            topColor="bg-vete-dark"
            bottomColor="text-vete-secondary"
          />
          {/* Productos */}
          <ProductsSession bgColor='bg-vete-dark' />
        </section>

        <section id="ServicioSeccion">
          {/* separador V2*/}
          <SectionDivider
            topColor="bg-vete-secondary"
            bottomColor="text-vete-dark"
          />
          {/* Seccion de programas de bienestar animal */}
          <ServicioSession bgColor='bg-vete-secondary' />
        </section>
        <section id="ProgramsSection">
          {/* Seccion de programas de bienestar animal  <!>Anda per agregr ala clase para que qude igual debe estar eredando algo */}
          <PlanSession/>
        </section>


        {/* separador V1*/}
        <SectionDivider
          topColor="bg-vete-dark"
          bottomColor="text-vete-secondary"
        />
        <section id="AboutSection">
          {/* Seccion de quienes somos */}
          <AboutSection bgColor='bg-vete-dark' />

          {/* separador V2*/}
          <SectionDivider
            topColor="bg-vete-secondary"
            bottomColor="text-vete-dark"
          />
        </section>

        <section id="MapsSection">
          {/* Seccion de mapa */}
          <MapsSession bgColor='bg-vete-secondary' />
        </section>

      </main>

      {/* Seccion inverior de la web Contacto etc*/}
      <Footer bgColor='bg-vete-secondary' />
    </div>
  )
};