import { WhatsAppButton } from '../../../components/WhatsAppButtonProps.tsx';
import companyInfo from '../../../data/companyInfo.json';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';


// <!DMI> Pie de la web en este tien la animaion de pato y ademas el pie debajo 
// bgColor: string - Color de fondo del footer  
const Footer = ({ bgColor }: { bgColor: string }) => {
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

export default Footer;