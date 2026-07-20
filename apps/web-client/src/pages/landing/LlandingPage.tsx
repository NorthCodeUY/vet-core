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


// <!> Una ves que repare HederSession.tsx borar 
// bgColor: string -> Color de fondo de la seccion

// <!>  En la version desktop queda muy vasio queda todo al medio y no queda bien abria que plantear
// agrandar la letar o algo y que la imagen el limite sea mas grande NO quea bien en resoluiones grandes 
// Estaria bueno agregar animacion de 3 fotos para la version grande para que me jore el contenido 
// 
const HeroSection = ({ bgColor }: { bgColor: string }) => {
  return (
    /* 
      1. Agregamos un wrapper (div) o usamos la sección como contenedor.
      2. 'max-w-[1200px]' limita el crecimiento en pantallas ultra-anchas.
      3. 'mx-auto' centra todo el bloque horizontalmente.
    */
    <section className={`relative w-full ${bgColor}`}>
      <div className=" max-w-[1200px] mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row items-center gap-10 relative z-10">

        {/* Lado del Texto: Limitamos el ancho para que no se estire de más */}
        <div className="w-full desktop-vete:w-1/2 text-center desktop-vete:text-left flex flex-col items-center desktop-vete:items-start">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-vete-primary">
            <span className="whitespace-nowrap">Cuidamos <span className='text-vete-text-light'>a</span></span> <br />
            <span className="text-vete-text-light">quienes</span> amas
          </h1>

          {/* text-lg  _ text-white*/}
          <p className="text-vete-body opacity-90 max-w-md leading-relaxed ">
            Tu mascota merece la mejor atención médica en un ambiente cálido y
            profesional. Contamos con especialistas comprometidos con el bienestar
            integral de tus compañeros, brindando cuidado, dedicación y confianza
            en cada etapa de su vida.
          </p>
        </div>

        {/* Lado de la Imagen: Controlamos el tamaño máximo para que no sea 'gigante' */}
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






//<!DMI>  Seccion donde muetro los servicios que proporciona la beterinaria 
// Divididad por 3 secciones  
// <> Animales produccion
// <> Pequeños Animales
// <> Equinos
// resivo por parametro el color de fonde de el componente pra intercalarlo con el disenio de terminacion
const ServicioSeccion = ({ bgColor }: { bgColor: string }) => {


  return (
    <section className={`${bgColor} w-full py-20 px-6 flex flex-col items-center`}>
      <div className="max-w-[1280px] w-full flex flex-col items-center gap-16">

        {/* Título Principal */}
        <div className="text-center">
          <h2 className="text-vete-h2 font-black text-vete-text-light italic uppercase tracking-tighter">
            Servicios con los que <span className="text-vete-primary">contamos</span>
          </h2>
          <p className="mt-4 text-vete-body text-vete-text-light opacity-60">
            Planes diseñados para asegurar la salud preventiva de sus animales.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {serviciosData.map((s, i) => (
            <ServiceCard
              key={i}
              {...s}
              phone={companyInfo.contact.adminPhone} />
          ))}
        </div>
      </div>``
    </section>
  );
};


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

// <!DMI> Pie de la web en este tien la animaion de pato y ademas el pie debajo 
// bgColor: string - Color de fondo del footer  
export const Footer = ({ bgColor }: { bgColor: string }) => {
  return (
    <>
      {/* 1. BARRA FLOTANTE DE PASTO + BOTONES */}
      <div className={`fixed bottom-0 left-0 w-full h-24 z-20 flex items-end justify-between px-4 md:px-16 pb-4 pointer-events-none`}>

        {/* Imagen del pasto */}
        <img
          src="/images/branding/NavPasto.png"
          alt="Nav Pasto"
          className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-60 pointer-events-none z-0"
        />

        {/* =========================================
            LADO IZQUIERDO: ADMINISTRACIÓN (Verde ) 
            ========================================= */}
        <WhatsAppButton
          label="Administración"
          phone={companyInfo.contact.adminPhone}
          bgColor="bg-vete-tertiary"
        />

        {/* 
          =============================================================================
          BARRA CENTRAL: ACCESOS RÁPIDOS Y REDES
          - Contenedor con Posicionamiento Absoluto (Centrado Horizontal)
          - Efecto Backdrop Blur para legibilidad sobre el pasto animado
          ============================================================================= 
        */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-auto">

          {/* Link: Facebook */}
          <a href={companyInfo.socials.facebook} target="_blank" rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110">
            <Facebook size={20} />
          </a>

          {/* 
            ACCESO A MAPA / UBICACIÓN
            Se incrementa el tamaño (size={26}) y se destaca visualmente.
          */}
          <a href="#mapa"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-vete-primary transition-all shadow-xl text-white hover:scale-125 group">
            <MapPin size={26} className="group-hover:text-white transition-colors" />
          </a>

          {/* Link: Instagram */}
          <a href={companyInfo.socials.instagram} target="_blank" rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110">
            <Instagram size={20} />
          </a>

        </div>


        {/* =========================================
            LADO DERECHO: EMERGENCIA 24HS (Rojo) 
            ========================================= */}
        <WhatsAppButton
          label="Emergencia"
          phone={companyInfo.contact.emergencyPhone}
          bgColor="bg-vete-error"
          isReversed={true} // <--- Este parámetro activa el modo espejo
        />

      </div>

      {/* 2. EL FOOTER REAL (El que aparece al final de la página)
          Tiene un z-index de 40 para "tapar" la barra flotante cuando llegas al final.
      */}
      <footer className={`${bgColor} relative z-40 border-t border-white/10 px-6 md:px-16 py-12 mt-40 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]`}>
        {/* text-white */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* SECCIÓN A: Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-xl">
              <img src="/logo.png" className="w-10" alt="Logo" />
              {companyInfo.name}<span className="text-vete-primary">.</span>
            </div>
            <p className="text-vete-primary text-sm">
              Cuidamos<span className='text-vete-text-light'> a quienes</span> amas
            </p>
          </div>

          {/* SECCIÓN B: Contacto */}
          <div className="space-y-4">
            <h4 className="text-vete-primary font-bold uppercase tracking-widest text-sm text-center md:text-left">Contacto</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-vete-primary" /> 092 444 510</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-vete-primary" /> contacto@vete.com</li>
            </ul>
          </div>

          {/* SECCIÓN C: Info Extra */}
          <div className="space-y-4 text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Atención 24hs en Salto</p>
            <p className="text-xs text-gray-500">© 2024 NorthCode Infrastructure</p>
          </div>

        </div>
      </footer>
    </>
  );
};



const MapsSection = ({ bgColor }: { bgColor: string }) => {
  return (
    <section className={`${bgColor} px-6 md:px-16 py-20`}>
      <div className="max-w-7xl mx-auto bg-vete-soft rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center">

        {/* LADO IZQUIERDO: Información */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-vete-primary text-4xl font-black  text-vete-header leading-tight italic">
              ¿<span className='text-vete-text-light'> Dónde estamos</span>?
            </h3>   {/* <!> text-vete-text Creo que no ase nada sacar   */}
            <p className=" text-lg opacity-90 leading-relaxed">
              Te esperamos en Salto con una <span className="text-vete-header  font-bold text-xl">instalación de primera</span>,
              equipada con sala de cirugía canina de vanguardia y atención especializada.
            </p>
          </div>

          {/* Bloques de Información */}
          <div className="grid grid-cols-1 gap-6">

            {/* Ubicación Geográfica */}
            <div className="flex items-start gap-4">
              <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0 mt-1">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-vete-header text-lg">Salto, Uruguay</p>
                <p className="text-vete-text opacity-70">Barrio Volcán, Salto Uruguay</p>
              </div>
            </div>

            {/* Horarios Detallados */}
            <div className="flex items-start gap-4">
              <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0 mt-1">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-vete-header text-lg">Horarios de Atención</p>
                <div className="text-vete-text text-sm space-y-1 opacity-80 font-medium">
                  {/* Dias de la semana que abre */}
                  <p>{companyInfo.location.schedule.weekdays}</p>

                </div>
              </div>
            </div>

            {/* Emergencias 24h - Resaltado */}
            <div className="flex items-center gap-4 bg-vete-header/5 p-4 rounded-3xl border border-vete-header/10">
              <div className="bg-red-500 p-3 rounded-2xl shadow-sm text-white shrink-0 animate-pulse">
                <Stethoscope size={24} />
              </div>
              <div>
                <p className="font-bold text-red-600 text-lg uppercase tracking-tight">Emergencias 24 Horas</p>
                <p className="text-vete-text text-sm opacity-70">Disponibles en todo momento para tu mascota</p>
              </div>
            </div>
          </div>


        </div>

        {/* LADO DERECHO: Mapa */}
        <div className="w-full lg:w-1/2 relative h-[450px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-vete-header/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10">
            <div className="bg-vete-primary p-2 rounded-lg">
              <MapPin size={20} className="text-white" />
            </div>
            <span className="text-white font-bold whitespace-nowrap">Salto, Uruguay</span>
          </div>

          <iframe
            title="Ubicación Veterinaria Beltramelli"
            className="w-full h-full rounded-[2.5rem] shadow-inner grayscale-[10%] hover:grayscale-0 transition-all duration-700"
            src={companyInfo.location.googleMapsUrl}
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

// Vercion Antigua funcional 16/07/2026  16:54 Sacar luego de terminar la otra 
// // <!DMI> Header de la web
// const Header = ({ bgColor }: { bgColor: string }) => {
//   return (
//     // Cambiamos px-16 por px-6 en móvil y md:px-16 en escritorio

//     <header className={`${bgColor} px-6 md:px-16 py-8 flex justify-between items-center w-full max-w-full overflow-hidden`}>
//       <div className="flex items-center gap-2 font-black text-xl">
//         <img src="/logo.png" className="w-10 shrink-0" alt="Logo" />

//         {/* 
//            hidden: oculta el texto por defecto (móvil)
//            md:inline: lo muestra como inline a partir de tablets/PC (768px)
//         */}

//         {/* <!> Agregar el tamanio de figma por variable telwind.config.js  text-white*/}
//         <span className="hidden tablet-vete:inline whitespace-nowrap ">
//           VETERINARIA BELTRAMELLI<span className="text-vete-primary">.</span>
//         </span>

//       </div>

//       {/* <!> Agregar el tamanio de figma por variable telwind.config.js  text-white */}
//       <nav className="flex items-center gap-4 md:gap-8 font-semibold ">
//         {/* Ocultamos los links en móvil para que no se amontonen, o podrías usar un menú hamburguesa luego */}
//         <a href="#" className=" hover:text-vete-primary transition-colors">Servicios</a>
//         <a href="#" className=" hover:text-vete-primary transition-colors">Tienda</a>
//         <a href="#" className="hover:text-vete-primary transition-colors">Contacto</a>

//         {/* Icono carrito de compras */}
//         <div className="bg-vete-primary p-2 rounded-full cursor-pointer hover:scale-110 transition-transform">
//           <ShoppingCart size={16} className="text-white" />
//         </div>

//       </nav>
//     </header>
//   )
// };

export default function LandingPage() {
  return (
    /* Agregamos overflow-x-hidden para evitar la franja lateral */
    <div className="bg-vete-dark min-h-screen font-sans text-vete-text-light overflow-x-hidden w-full relative border-0 m-0 p-0">

      {/* --- 1. Componente de Header --- */}
      {/* <Header bgColor='bg-vete-secondary' /> */}
      <HeaderSession bgColor='bg-vete-secondary' />

      <main>
        <HeroSection bgColor='bg-vete-secondary' />
        {/* <HeroSession bgColor='bg-vete-secondary' /> */}

        {/* separador V1*/}
        <SectionDivider
          topColor="bg-vete-dark"
          bottomColor="text-vete-secondary"
        />

        {/* Productos */}
        <ProductsSession bgColor='bg-vete-dark' />

        {/* separador V2*/}
        <SectionDivider
          topColor="bg-vete-secondary"
          bottomColor="text-vete-dark"
        />

        {/* Seccion de programas de bienestar animal */}
        <ServicioSeccion bgColor='bg-vete-secondary' />

        {/* Seccion de programas de bienestar animal  <!>Anda per agregr ala clase para que qude igual debe estar eredando algo */}
        <ProgramsSection />

        {/* separador V1*/}
        <SectionDivider
          topColor="bg-vete-dark"
          bottomColor="text-vete-secondary"
        />

        {/* Seccion de quienes somos */}
        <AboutSection bgColor='bg-vete-dark' />

        {/* separador V2*/}
        <SectionDivider
          topColor="bg-vete-secondary"
          bottomColor="text-vete-dark"
        />

        {/* Seccion de mapa */}
        <MapsSection bgColor='bg-vete-secondary' />
      </main>

      {/* Seccion inverior de la web Contacto etc*/}
      <Footer bgColor='bg-vete-secondary' />
    </div>
  )
};