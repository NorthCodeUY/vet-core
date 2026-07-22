import { WhatsAppButton } from '../../../components/WhatsAppButtonProps.tsx';
import companyInfo from '../../../data/companyInfo.json';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';

// Componente principal del pie de página.
// bgColor: color de fondo que recibe el footer desde el componente padre.
const Footer = ({ bgColor }: { bgColor: string }) => {
  return (
    <>
      {/* 1. BARRA FLOTANTE DE PASTO + ACCESOS RÁPIDOS */}
      {/* Esta barra queda fija en la parte inferior de la pantalla y contiene los accesos principales. */}
      <div className="fixed bottom-0 left-0 w-full h-24 z-20 flex items-end justify-between px-4 md:px-16 pb-4 pointer-events-none">

        {/* Imagen de fondo de pasto que ocupa toda la barra flotante. */}
        <img
          src="/images/branding/NavPasto.png"
          alt="Nav Pasto"
          className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-40 pointer-events-none z-0"
        />

        {/* LADO IZQUIERDO: BOTÓN DE ADMINISTRACIÓN */}
        {/* WhatsAppButton crea un acceso directo para contactar con administración. */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Administración"
            phone={companyInfo.contact.adminPhone}
            bgColor="bg-vete-tertiary"
          />
        </div>

        {/* BARRA CENTRAL: REDES SOCIALES Y UBICACIÓN */}
        {/* Los botones se posicionan en el centro de la pantalla mediante left-1/2 y -translate-x-1/2. */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 pointer-events-auto">

          {/* Link: Facebook */}
          {/* Abre el perfil de Facebook guardado en companyInfo. */}
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
          {/* Lleva al usuario a la sección de ubicación identificada con el id #mapa. */}
          <a
            href="#mapa"
            className="p-3.5 bg-vete-primary text-white rounded-full border border-vete-primary/10 shadow-[0_6px_16px_rgba(0,0,0,0.1)] hover:bg-vete-primary/90 hover:shadow-[0_10px_24px_rgba(var(--vete-primary-rgb),0.2)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 ease-out group"
            title="Ver Ubicación"
          >
            <MapPin size={22} className="group-hover:scale-105 transition-transform duration-300" />
          </a>

          {/* Link: Instagram */}
          {/* Abre el perfil de Instagram guardado en companyInfo. */}
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

        {/* LADO DERECHO: BOTÓN DE EMERGENCIA 24HS */}
        {/* Utiliza el número de emergencias y activa el diseño invertido del botón. */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Emergencia"
            phone={companyInfo.contact.emergencyPhone}
            bgColor="bg-vete-error"
            isReversed={true}
          />
        </div>

      </div>

      {/* 2. FOOTER PRINCIPAL */}
      {/* Es la sección inferior permanente de la página con la información de la veterinaria. */}
      <footer className={`${bgColor} relative z-40 px-6 md:px-16 lg:px-24 py-12 mt-40 shadow-[0_-10px_35px_rgba(0,0,0,0.02)]`}>
        
        {/* Línea decorativa superior que separa visualmente el footer del contenido anterior. */}
        <div className="absolute top-0 left-0 w-full h-[3px] pointer-events-none z-50 bg-gradient-to-r from-vete-primary/0 via-vete-primary to-vete-primary/0" />

        {/* Contenedor principal que limita el ancho del contenido. */}
        <div className="max-w-7xl mx-auto">

          {/* Divide el footer en tres columnas en pantallas medianas y grandes. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start pb-10">

            {/* SECCIÓN A: IDENTIDAD */}
            {/* Muestra el logo, nombre de la veterinaria y su eslogan. */}
            <div className="flex flex-col items-center justify-start text-center">
              
              {/* Logo principal de la veterinaria. */}
              <img
                src="/logo.png"
                className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-500 cursor-pointer select-none"
                alt="Veterinaria Logo"
              />

              {/* Nombre de la empresa obtenido desde companyInfo. */}
              <h3 className="mt-3 font-bold text-xl text-vete-text-dark tracking-tight leading-tight">
                {companyInfo.name}
              </h3>

              {/* Eslogan principal de la veterinaria. */}
              <p className="mt-1.5 text-vete-primary text-xs font-semibold tracking-[0.12em] select-none">
                Cuidamos
                <span className="text-vete-text-light font-normal"> a quienes</span> amas
              </p>

            </div>

            {/* SECCIÓN B: INFORMACIÓN DE CONTACTO */}
            {/* Contiene teléfono, correo electrónico y ubicación de la veterinaria. */}
            <div className="space-y-4">

              {/* Título de la sección de contacto. */}
              <h4 className="text-vete-text-dark font-bold text-xs uppercase tracking-widest select-none">
                Contacto Directo
              </h4>

              <ul className="space-y-3.5 text-sm">

                {/* TELÉFONO */}
                {/* Crea un enlace que permite iniciar una llamada desde el dispositivo. */}
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

                {/* CORREO ELECTRÓNICO */}
                {/* Abre el programa de correo del usuario mediante el protocolo mailto. */}
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

                {/* UBICACIÓN */}
                {/* Muestra la ciudad donde se encuentra la veterinaria. */}
                <li className="flex items-center gap-3 text-vete-text-light select-none">
                  <MapPin size={16} className="text-vete-primary shrink-0" />
                  <span className="font-semibold">Salto, Uruguay</span>
                </li>

              </ul>
            </div>

            {/* SECCIÓN C: GUARDIA + PRESENTACIÓN */}
            {/* Informa de forma compacta que el servicio de guardia está activo y disponible. */}
            <div className="flex flex-col items-center justify-start">

              {/* INDICADOR COMPACTO DE GUARDIA */}
              {/* Muestra visualmente que la guardia está activa y disponible las 24 horas. */}
              <div className="relative flex items-center gap-3 rounded-xl border border-vete-primary/15 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-vete-primary/30 hover:shadow-md">

                {/* Indicador visual animado del estado activo. */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50"></span>
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>

                {/* Información del servicio de guardia. */}
                <div className="flex flex-col text-left">

                  {/* Indica que el servicio de guardia está activo. */}
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                    Guardia activa
                  </span>

                  {/* Indica que se atienden emergencias durante las 24 horas. */}
                  <span className="mt-0.5 text-xs font-medium text-vete-text-light">
                    Emergencias · 24 HS
                  </span>

                </div>

                {/* Separador visual entre la información y el estado. */}
                <span className="ml-2 h-6 w-px bg-vete-primary/15"></span>

                {/* Estado actual de disponibilidad del servicio. */}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-vete-primary">
                  Disponible
                </span>

              </div>

              {/* DESCRIPCIÓN */}
              {/* Texto breve que resume la identidad y el compromiso de la veterinaria. */}
              <div className="mt-6 max-w-sm self-center border-l-2 border-vete-primary/20 pl-4 text-left">
                <p className="text-sm leading-relaxed text-vete-text-light">
                  Clínica veterinaria comprometida con la excelencia médica y el cuidado integral de su mascota en Salto, Uruguay.
                </p>
              </div>

            </div>

          </div>

          {/* BARRA INFERIOR DE CRÉDITOS */}
          {/* Muestra derechos de autor, enlaces legales y el nombre del equipo desarrollador. */}
          <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-vete-text-light/60 font-medium">

            {/* Copyright dinámico: el año se actualiza automáticamente. */}
            <span>© {new Date().getFullYear()} {companyInfo.name}. Todos los derechos reservados.</span>

            {/* Enlaces legales y crédito de desarrollo. */}
            <div className="flex items-center gap-4">

              {/* Enlace a los términos de servicio. */}
              <a href="#terminos" className="hover:text-vete-primary transition-colors">
                Términos de Servicio
              </a>

              <span>•</span>

              {/* Enlace a la política de privacidad. */}
              <a href="#privacidad" className="hover:text-vete-primary transition-colors">
                Política de Privacidad
              </a>

              <span>•</span>

              {/* Crédito del equipo o empresa que desarrolló el sitio. */}
              <span>
                Desarrollado por <span className="text-vete-text-dark font-semibold">NorthCode Infrastructure</span>
              </span>

            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;