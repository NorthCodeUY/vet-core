// apps/web-client/src/pages/landing/LlandingPage.tsx


import { ServiceCard } from '../../components/ServiceCard.tsx';

import { PlanCard } from '../../components/PlanCard.tsx';
import { SectionDivider } from '../../components/SectionDivider.tsx';
import { WhatsAppButton } from '../../components/WhatsAppButtonProps.tsx';

// Datos de la aplicacion
import companyInfo from '../../data/companyInfo.json';
import serviciosData from '../../data/servicios.json';
import planData from '../../data/promociones.json';
// Iconos de la aplicacion 

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



// <!> Una ves que repare HederSession.tsx borar 
// bgColor: string -> Color de fondo de la seccion

// <!>  En la version desktop queda muy vasio queda todo al medio y no queda bien abria que plantear
// agrandar la letar o algo y que la imagen el limite sea mas grande NO quea bien en resoluiones grandes 
// Estaria bueno agregar animacion de 3 fotos para la version grande para que me jore el contenido 
// 

/*
const HeroSection = ({ bgColor }: { bgColor: string }) => {
  return (
    
      1. Agregamos un wrapper (div) o usamos la sección como contenedor.
      2. 'max-w-[1200px]' limita el crecimiento en pantallas ultra-anchas.
      3. 'mx-auto' centra todo el bloque horizontalmente.
    
    <section className={`relative w-full ${bgColor}`}>
      <div className=" max-w-[1200px] mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row items-center gap-10 relative z-10">

        { Lado del Texto: Limitamos el ancho para que no se estire de más }
        <div className="w-full desktop-vete:w-1/2 text-center desktop-vete:text-left flex flex-col items-center desktop-vete:items-start">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-vete-primary">
            <span className="whitespace-nowrap">Cuidamos <span className='text-vete-text-light'>a</span></span> <br />
            <span className="text-vete-text-light">quienes</span> amas
          </h1>

          { text-lg  _ text-white}
          <p className="text-vete-body opacity-90 max-w-md leading-relaxed ">
            Tu mascota merece la mejor atención médica en un ambiente cálido y
            profesional. Contamos con especialistas comprometidos con el bienestar
            integral de tus compañeros, brindando cuidado, dedicación y confianza
            en cada etapa de su vida.
          </p>
        </div>

        { Lado de la Imagen: Controlamos el tamaño máximo para que no sea 'gigante' }
        <div className="hidden desktop-vete:flex w-full md:w-1/2 justify-center desktop-vete:justify-end relative">
          <img
            src="/images/branding/HeroSection.png"
            className="rounded-[3rem] shadow-2xl object-cover max-w-full h-auto lg:max-h-[1100px]"
            alt="Mascotas"
          />
        </div>

      </div>

    </section>
  )
};

*/






const ProgramsSection = () => {

  return (
    <section className="w-full py-24 px-6 bg-vete-secondary flex flex-col items-center gap-16">
      <div className="max-w-3xl text-center space-y-4">
        {/* Usamos tu vete-h2 (36px) */}
        <h2 className="text-vete-h2 font-black text-vete- tracking-tighter uppercase italic">
          Programas de <span className="text-vete-primary">Bienestar Animal</span>
        </h2>
        <p className="text-vete-text-light text-vete-body font-medium opacity-80 max-w-xl mx-auto">
          Planes diseñados para asegurar la salud preventiva de tus animales a lo largo de toda su vida.
        </p>
      </div>


      {/* Contenedor de Tarjetas Planes o Promociones*/}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">

        {/* Carga de datos de Tarjeta Planes o Promociones */}
        {planData.map((plan, index) => (
          <PlanCard
            key={index}
            {...plan}
            phoneWhattsApp={companyInfo.contact.adminPhone} // Inyectamos el teléfono de la empresa
          />
        ))}

      </div>
    </section>
  );
};





// Componente auxiliar para evitar repetir código en Misión, Visión y Valores
const InfoSection = ({ title, children, image, reversed = false }: { title: string, children: React.ReactNode, image: string, reversed?: boolean }) => (
  <section className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-20 px-16`}>
    <div className="w-full md:w-1/2 space-y-6">
      <h2 className="text-5xl font-black text-vete-primary italic">{title}</h2>
      <div className="text-lg leading-relaxed opacity-90 space-y-4">
        {children}
      </div>
    </div>
    <div className="w-full md:w-1/2">
      <img
        src={image}
        alt={title}
        className="w-full h-[450px] object-cover rounded-[3rem] shadow-2xl border-2 border-vete-primary/10"
      />
    </div>
  </section>
);

const AboutSection = ({ bgColor }: { bgColor: string }) => {
  return (
    <div className={`${bgColor}`}>
      {/* Misión */}
      <InfoSection
        title="Misión"
        image="/images/branding/Mision.png"
      >
        <p>
          Brindar atención <strong className="text-vete-primary">veterinaria profesional</strong>, cálida y confiable, cuidando la salud y el bienestar de cada
          animal como parte fundamental de la vida de sus familias y de la producción responsable. Nos
          comprometemos a acompañar a cada mascota en todas las etapas de su vida, mediante tratamientos
          integrales, planes sanitarios, desparasitaciones y cirugías, incluyendo atención de emergencias. Al mismo
          tiempo, ofrecemos soluciones eficientes y basadas en el rigor profesional para animales de producción,
          contribuyendo al desarrollo y la sostenibilidad del sector agropecuario.
        </p>

      </InfoSection>

      {/* Visión */}
      <InfoSection
        title="Visión"
        image="/images/branding/Vision.png"
        reversed={true}
      >
        <p>
          Ser un referente en la medicina veterinaria, reconocido por la confianza, la calidad profesional y la cercanía con
          nuestros clientes.
        </p>
        <p>
          Aspiramos a consolidarnos como una clínica destacada en el cuidado de pequeños animales, sin dejar de aportar nuestra
          experiencia y eficiencia al servicio veterinario de grandes animales y producción, respaldados por años de trayectoria,
          formación constante y compromiso con la excelencia.
        </p>
      </InfoSection>

      {/* Valores */}
      <InfoSection
        title="Valores"
        image="/images/branding/Valores.png"
      >
        {/* text-white */}
        <div className="space-y-4">

          <p><strong className="text-vete-primary">Compromiso con la vida: </strong>
            Cuidamos cada animal con responsabilidad, vocación y respeto, entendiendo
            su importancia en la vida de las personas y en la producción.
          </p>

          <p><strong className="text-vete-primary">Profesionalismo y experiencia: </strong>
            Aplicamos conocimiento, criterio clínico y mejora continua, respaldados por años
            de trayectoria en el ámbito veterinario. Atención con calidez humana.
            Entendemos el vínculo emocional entre las personas y sus mascotas, brindando
            un trato cercano, empático y respetuoso.
          </p>

          <p><strong className="text-vete-primary">Responsabilidad y confianza: </strong>
            Actuamos con honestidad, transparencia y ética, generando relaciones duraderas
            basadas en la confianza. Eficiencia y seriedad profesional, ofrecemos soluciones
            veterinarias confiables tanto en clínica de pequeños animales como en el ámbito de
            la producción, donde la precisión y la eficiencia son fundamentales.
          </p>

        </div>
      </InfoSection>
    </div>
  );
};





















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
          <ProgramsSection />
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