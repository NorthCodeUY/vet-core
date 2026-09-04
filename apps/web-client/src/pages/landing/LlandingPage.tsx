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













import React from 'react';

/**
 * Propiedades del bloque informativo `InfoSection`.
 * 
 * @interface InfoSectionProps
 * @property {string} title - Título del bloque.
 * @property {string} image - Ruta de la imagen ilustrativa.
 * @property {boolean} [reversed] - Determina si la imagen va a la izquierda o derecha.
 * @property {string} contentHtml - Texto estructurado en formato HTML.
 */
interface InfoSectionProps {
  title: string;
  image: string;
  reversed?: boolean;
  contentHtml: string;
}

/**
 * Componente modular para desplegar bloques de información con imagen lateral (`InfoSection`).
 * 
 * @component
 * @param {InfoSectionProps} props - Propiedades de renderizado.
 * @returns {JSX.Element} Bloque adaptable con soporte responsive.
 */
export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  image,
  reversed = false,
  contentHtml,
}) => {
  return (
    <article className={`
      /* --- Posición --- */
      flex                         /* Layout flexible */
      flex-col                     /* Columna por defecto en móvil */
      ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} /* Alterna orientación */
      items-center                 /* Centrado vertical */
      justify-between              /* Espaciado distribuido */

      /* --- Dimensiones --- */
      w-full                       /* Ancho completo */
      max-w-6xl                    /* Contenedor centralizado */
      mx-auto                      /* Centrado horizontal automático */
      py-10                        /* Padding vertical */
      px-6                         /* Padding horizontal */
      gap-8                        /* Separación entre texto e imagen */

      /* --- Colores --- */

      /* --- Texto --- */

      /* --- Animación --- */
    `}>
      {/* Columna de Texto */}
      <div className={`
        /* --- Posición --- */
        flex                       /* Layout flexible */
        flex-col                   /* Disposición en columna */

        /* --- Dimensiones --- */
        w-full                     /* Ancho total móvil */
        lg:w-1/2                   /* 50% en escritorio */

        /* --- Colores --- */

        /* --- Texto --- */

        /* --- Animación --- */
      `}>
        <h2 className={`
          /* --- Posición --- */

          /* --- Dimensiones --- */
          mb-4                     /* Margen inferior */

          /* --- Colores --- */
          text-vete-primary        /* Color institucional */

          /* --- Texto --- */
          text-3xl                 /* Tamaño base */
          md:text-4xl              /* Tamaño en pantallas medianas */
          font-extrabold           /* Grosor 800 */
          tracking-tight           /* Espaciado de letras ajustado */

          /* --- Animación --- */
        `}>
          {title}
        </h2>

        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */

            /* --- Colores --- */
            text-vete-text-base    /* Color tipográfico de lectura */

            /* --- Texto --- */
            text-base              /* Tamaño estándar */
            md:text-lg             /* Tamaño cómodo en desktop */
            leading-relaxed        /* Altura de línea cómoda */
            font-normal            /* Grosor regular */

            /* --- Animación --- */
          `}
        />
      </div>

      {/* Columna de Imagen */}
      <div className={`
        /* --- Posición --- */
        flex                       /* Layout flexible */
        items-center               /* Centrado */
        justify-center             /* Centrado */

        /* --- Dimensiones --- */
        w-full                     /* Ancho total móvil */
        lg:w-5/12                  /* Proporción balanceada */

        /* --- Colores --- */

        /* --- Texto --- */

        /* --- Animación --- */
      `}>
        <img
          src={image}
          alt={title}
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */
            w-full                 /* Ocupa el ancho asignado */
            max-w-md               /* Límite de ancho */
            h-auto                 /* Mantiene proporción */
            object-contain         /* Ajuste sin deformar */

            /* --- Colores --- */

            /* --- Texto --- */

            /* --- Animación --- */
            transition-transform   /* Transición suave */
            duration-300           /* Velocidad 300ms */
            hover:scale-105        /* Efecto sutil al pasar el cursor */
          `}
        />
      </div>
    </article>
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
          <HeroSection bgColor='bg-vete-secondary' />
          {/* <HeroSession bgColor='bg-vete-secondary' /> */}
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