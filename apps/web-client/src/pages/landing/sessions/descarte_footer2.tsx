import { WhatsAppButton } from '../../../components/WhatsAppButtonProps.tsx';
import companyInfo from '../../../data/companyInfo.json';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';

const Footer = ({ bgColor }: { bgColor: string }) => {
  return (
    <>
      {/* 1. BARRA FLOTANTE DE PASTO + ACCESOS RÁPIDOS */}
      <div className="fixed bottom-0 left-0 w-full h-24 z-20 flex items-end justify-between px-4 md:px-16 pb-4 pointer-events-none">

        {/* Imagen del pasto original */}
        <img
          src="/images/branding/NavPasto.png"
          alt="Nav Pasto"
          className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-40 pointer-events-none z-0"
        />

        {/* LADO IZQUIERDO: ADMINISTRACIÓN (Verde) */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Administración"
            phone={companyInfo.contact.adminPhone}
            bgColor="bg-vete-tertiary"
          />
        </div>

        {/* BARRA CENTRAL: BOTONES DE REDES Y UBICACIÓN */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 pointer-events-auto">

          {/* Link: Facebook */}
          <a
            href={companyInfo.socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-white/95 dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-200 rounded-full border border-neutral-200/50 dark:border-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-vete-primary hover:text-white hover:border-vete-primary hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out"
            title="Facebook"
          >
            <Facebook size={18} />
          </a>

          {/* ACCESO A MAPA */}
          <a
            href="#mapa"
            className="p-3.5 bg-vete-primary text-white rounded-full border border-vete-primary/10 shadow-[0_6px_16px_rgba(0,0,0,0.1)] hover:bg-vete-primary/90 hover:shadow-[0_10px_24px_rgba(var(--vete-primary-rgb),0.2)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 ease-out group"
            title="Ver Ubicación"
          >
            <MapPin size={22} className="group-hover:scale-105 transition-transform duration-300" />
          </a>

          {/* Link: Instagram */}
          <a
            href={companyInfo.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-white/95 dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-200 rounded-full border border-neutral-200/50 dark:border-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-vete-primary hover:text-white hover:border-vete-primary hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out"
            title="Instagram"
          >
            <Instagram size={18} />
          </a>

        </div>

        {/* LADO DERECHO: EMERGENCIA 24HS (Rojo) */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Emergencia"
            phone={companyInfo.contact.emergencyPhone}
            bgColor="bg-vete-error"
            isReversed={true}
          />
        </div>

      </div>

      {/* 2. EL FOOTER REAL */}
      <footer className={`${bgColor} relative z-40 px-6 md:px-16 lg:px-24 py-12 mt-40 shadow-[0_-10px_35px_rgba(0,0,0,0.02)]`}>
        
       {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-[3px] pointer-events-none z-50 bg-gradient-to-r from-vete-primary/0 via-vete-primary to-vete-primary/0" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start pb-10">

{/* SECCIÓN A: Identidad */}
<div className="flex flex-col items-center justify-start text-center">
  
  <img
    src="/logo.png"
    className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-500 cursor-pointer select-none"
    alt="Veterinaria Logo"
  />

  <h3 className="mt-3 font-bold text-xl text-vete-text-dark tracking-tight leading-tight">
    {companyInfo.name}
  </h3>

  <p className="mt-1.5 text-vete-primary text-xs font-semibold tracking-[0.12em] select-none">
    Cuidamos
    <span className="text-vete-text-light font-normal"> a quienes</span> amas
  </p>

</div>

            {/* SECCIÓN B: Información de Contacto */}
            <div className="space-y-4">
              <h4 className="text-vete-text-dark font-bold text-xs uppercase tracking-widest select-none">
                Contacto Directo
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <a 
                    href={`tel:${companyInfo.contact.adminPhone.replace(/\s+/g, '')}`}
                    className="group flex items-center gap-3 text-vete-text-light hover:text-vete-primary transition-all duration-300 py-0.5 hover:translate-x-1"
                  >
                    <Phone size={16} className="text-vete-primary shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold group-hover:underline decoration-vete-primary/30 underline-offset-4">
                      092 444 510
                    </span>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:contacto@vete.com" 
                    className="group flex items-center gap-3 text-vete-text-light hover:text-vete-primary transition-all duration-300 py-0.5 hover:translate-x-1"
                  >
                    <Mail size={16} className="text-vete-primary shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold group-hover:underline decoration-vete-primary/30 underline-offset-4">
                      contacto@vete.com
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-vete-text-light select-none">
                  <MapPin size={16} className="text-vete-primary shrink-0" />
                  <span className="font-semibold">Salto, Uruguay</span>
                </li>
              </ul>
            </div>

{/* SECCIÓN C: Guardia + Presentación */}
<div className="flex flex-col items-center justify-start">

  {/* Indicador compacto de guardia */}
  <div className="relative flex items-center gap-3 rounded-xl border border-vete-primary/15 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-vete-primary/30 hover:shadow-md">

    {/* Indicador activo */}
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50"></span>
      <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
    </span>

    {/* Información */}
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
        Guardia activa
      </span>

      <span className="mt-0.5 text-xs font-medium text-vete-text-light">
        Emergencias · 24 HS
      </span>
    </div>

    {/* Separador */}
    <span className="ml-2 h-6 w-px bg-vete-primary/15"></span>

    {/* Estado */}
    <span className="text-[10px] font-semibold uppercase tracking-wider text-vete-primary">
      Disponible
    </span>

  </div>

{/* Descripción */}
<div className="mt-6 max-w-sm self-center border-l-2 border-vete-primary/20 pl-4 text-left">
  <p className="text-sm leading-relaxed text-vete-text-light">
    Clínica veterinaria comprometida con la excelencia médica y el cuidado integral de su mascota en Salto, Uruguay.
  </p>
</div>

</div>

          </div>

          {/* BARRA INFERIOR DE CRÉDITOS */}
          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-vete-text-light/60 font-medium">
            <span>© {new Date().getFullYear()} {companyInfo.name}. Todos los derechos reservados.</span>
            <div className="flex items-center gap-4">
              <a href="#terminos" className="hover:text-vete-primary transition-colors">Términos de Servicio</a>
              <span>•</span>
              <a href="#privacidad" className="hover:text-vete-primary transition-colors">Política de Privacidad</a>
              <span>•</span>
              <span>Desarrollado por <span className="text-vete-text-dark font-semibold">NorthCode Infrastructure</span></span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;