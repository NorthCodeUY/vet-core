import { WhatsAppButton } from '../../../components/WhatsAppButtonProps.tsx';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useMemo } from 'react';

/** Tipos de datos */
interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

interface ScheduleItem {
  label: string;
  hours: string;
}

interface CompanyInfo {
  name: string;
  location: {
    address: string;
    city: string;
    country: string;
    googleMapsUrl: string;
    schedule: {
      weekdays: { label: string; start: number; end: number };
      saturdays: { label: string; start: number; end: number };
      sundays: { label: string; start: number; end: number; isClosed: boolean };
    };
  };
  contact: {
    adminPhone: string;
    emergencyPhone: string;
    email: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

interface FooterProps {
  bgColor: string;
  companyInfo: CompanyInfo;
}

/**
 * Calcula si el negocio está abierto en base al horario dinámico del backend
 * @param schedule - Configuración de horarios desde companyInfo
 * @returns boolean - true si está abierto, false si está cerrado
 */
const useIsOpen = (schedule: CompanyInfo['location']['schedule']): boolean => {
  return useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();

    // Domingo = cerrado
    if (day === 0) return schedule.sundays.isClosed ? false : true;

    // Sábado
    if (day === 6) {
      return hours >= schedule.saturdays.start && hours < schedule.saturdays.end;
    }

    // Lunes a Viernes
    return hours >= schedule.weekdays.start && hours < schedule.weekdays.end;
  }, [schedule]);
};

/**
 * Valida y sanitiza datos de contacto
 * @param contact - Datos de contacto del companyInfo
 * @param location - Datos de ubicación del companyInfo
 * @returns Objeto con datos validados y fallbacks
 */
const useSafeContactInfo = (
  contact: CompanyInfo['contact'],
  location: CompanyInfo['location']
) => {
  return useMemo(() => ({
    phone: contact.adminPhone || 'No disponible',
    email: contact.email || 'No disponible',
    city: location.city || '',
    country: location.country || '',
    mapsUrl: location.googleMapsUrl || '#',
  }), [contact, location]);
};

/**
 * Valida redes sociales
 * @param socials - Redes sociales del companyInfo
 * @returns Objeto con URLs validadas
 */
const useSafeSocials = (socials: CompanyInfo['socials']) => {
  return useMemo(() => ({
    facebook: socials.facebook || '#',
    instagram: socials.instagram || '#',
    tiktok: socials.tiktok || '#',
  }), [socials]);
};

/**
 * Construye el array de horarios dinámicamente desde el backend
 * @param schedule - Configuración de horarios
 * @returns Array con los horarios formateados
 */
const useFormattedSchedule = (
  schedule: CompanyInfo['location']['schedule']
): ScheduleItem[] => {
  return useMemo(() => [
    {
      label: schedule.weekdays.label,
      hours: `${schedule.weekdays.start}:00 – ${schedule.weekdays.end}:00`,
    },
    {
      label: schedule.sundays.label,
      hours: schedule.sundays.isClosed ? 'Cerrado' : `${schedule.sundays.start}:00 – ${schedule.sundays.end}:00`,
    },
  ], [schedule]);
};

/**
 * Footer profesional con datos dinámicos desde backend
 * @component
 * @param {FooterProps} props - Props del componente
 * @returns {JSX.Element} Footer renderizado
 */
const Footer = ({ bgColor, companyInfo }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  // Hooks personalizados para datos validados
  const safeContactInfo = useSafeContactInfo(
    companyInfo.contact,
    companyInfo.location
  );
  const safeSocials = useSafeSocials(companyInfo.socials);
  const formattedSchedule = useFormattedSchedule(companyInfo.location.schedule);
  const isOpen = useIsOpen(companyInfo.location.schedule);

  /**
   * Array de items de contacto reutilizable
   * Evita código repetido y facilita mantenimiento
   */
  const contactItems: ContactItem[] = useMemo(() => [
    {
      icon: <Phone size={16} className="text-vete-primary/70 transition-colors" strokeWidth={2.5} />,
      label: 'Teléfono',
      value: safeContactInfo.phone,
      href: `tel:${safeContactInfo.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: <Mail size={16} className="text-vete-primary/70 transition-colors" strokeWidth={2.5} />,
      label: 'Email',
      value: safeContactInfo.email,
      href: `mailto:${safeContactInfo.email}`,
    },
    {
      icon: <MapPin size={16} className="text-vete-primary/70 transition-colors" strokeWidth={2.5} />,
      label: 'Ubicación',
      value: `${safeContactInfo.city}, ${safeContactInfo.country}`,
      href: safeContactInfo.mapsUrl,
      isExternal: true,
    },
  ], [safeContactInfo]);

  return (
    <>
      {/* 1. BARRA FLOTANTE DE PASTO + ACCESOS RÁPIDOS */}
      <div className="fixed bottom-0 left-0 w-full h-24 z-20 flex items-end justify-between px-4 md:px-16 pb-4 pointer-events-none">
        <img
          src="/images/branding/NavPasto.png"
          alt="Nav Pasto"
          className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-40 pointer-events-none z-0"
        />

        {/* Botón Administración */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Administración"
            phone={companyInfo.contact.adminPhone}
            bgColor="bg-vete-tertiary"
          />
        </div>

        {/* BARRA CENTRAL: ACCESOS RÁPIDOS Y REDES */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-auto">

          {/* Link: Facebook */}
          <a 
            href={safeSocials.facebook} 
            target="_blank" 
            rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
            title="Síguenos en Facebook"
            aria-label="Facebook - Veterinaria Beltramelli"
          >
            <Facebook size={20} />
          </a>

          {/* ACCESO A MAPA / UBICACIÓN */}
          <a 
            href={safeContactInfo.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-vete-primary transition-all shadow-xl text-white hover:scale-125 group"
            title="Ver ubicación en Google Maps"
            aria-label="Google Maps - Ubicación"
          >
            <MapPin size={26} className="group-hover:text-white transition-colors" />
          </a>

          {/* Link: Instagram */}
          <a 
            href={safeSocials.instagram} 
            target="_blank" 
            rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
            title="Síguenos en Instagram"
            aria-label="Instagram - Veterinaria Beltramelli"
          >
            <Instagram size={20} />
          </a>

        </div>

        {/* Botón Emergencia */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Emergencia"
            phone={companyInfo.contact.emergencyPhone}
            bgColor="bg-vete-error"
            isReversed={true}
          />
        </div>
      </div>

      {/* 2. FOOTER COMPACTO Y PROFESIONAL */}
      <footer className={`${bgColor} relative z-40 px-6 md:px-16 lg:px-24 py-8 mt-40 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]`}>
        
        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none z-50 bg-gradient-to-r from-vete-primary/0 via-vete-primary/15 to-vete-primary/0" />
        
        <div className="max-w-7xl mx-auto">
          
          {/* GRID PRINCIPAL - COMPACTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pb-6">

            {/* SECCIÓN 1: LOGO + IDENTIDAD */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <img
                src="/logo.png"
                className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-400 cursor-pointer filter drop-shadow-sm"
                alt={`${companyInfo.name} - Logo`}
              />
              
              <div className="text-center md:text-left">
                <h3 className="font-bold text-base text-vete-text-light leading-tight">
                  {companyInfo.name}
                </h3>
                <p className="mt-0.5 text-vete-primary text-[11px] font-semibold tracking-[0.08em]">
                  Cuidamos
                  <span className="text-vete-text-light font-normal"> a quienes amas</span>
                </p>
              </div>
            </div>

            {/* SECCIÓN 2: CONTACTO */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">
                Contacto
              </h4>

              <div className="space-y-2.5">
                {contactItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href || '#'}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noreferrer' : undefined}
                    className="group flex items-start gap-2.5 text-xs text-vete-text-light hover:text-vete-primary transition-colors duration-300"
                    aria-label={item.label}
                  >
                    <div className="mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-semibold text-vete-primary/60 uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="font-medium group-hover:underline decoration-vete-primary/30 underline-offset-2">
                        {item.value}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: HORARIOS */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">
                Horarios
              </h4>

              <div className="space-y-2">
                {formattedSchedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-semibold text-vete-primary/60 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="text-xs font-medium text-vete-text-light">
                      {item.hours}
                    </span>
                  </div>
                ))}

                {/* Status - Dinámico basado en horario */}
                <div className="mt-2 pt-2 border-t border-vete-primary/10 flex items-center gap-1.5">
                  <span className={`relative flex h-1.5 w-1.5 shrink-0 ${isOpen ? 'animate-pulse' : ''}`}>
                    <span className={`absolute inset-0 rounded-full opacity-75 ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                    <span className={`relative h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  </span>
                  <span className="text-xs font-semibold text-vete-text-light">
                    {isOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: REDES SOCIALES */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">
                Síguenos
              </h4>

              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={safeSocials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_12px_rgba(24,119,242,0.2)] transition-all duration-300 overflow-hidden"
                  title="Síguenos en Facebook"
                  aria-label="Facebook"
                >
                  <Facebook size={14} className="text-vete-primary group-hover:text-white group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
                </a>

                {/* Instagram */}
                <a
                  href={safeSocials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-gradient-to-br hover:from-[#5B51D8] hover:via-[#E1306C] hover:to-[#F77737] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(224,50,130,0.2)] transition-all duration-300 overflow-hidden"
                  title="Síguenos en Instagram"
                  aria-label="Instagram"
                >
                  <Instagram size={14} className="text-vete-primary group-hover:text-white group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
                </a>

                {/* TikTok */}
                <a
                  href={safeSocials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-black hover:text-white hover:border-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden"
                  title="Síguenos en TikTok"
                  aria-label="TikTok"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-vete-primary group-hover:text-white group-hover:scale-110 transition-all duration-300"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.54-.05z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* SEPARATOR */}
          <div className="h-px bg-gradient-to-r from-vete-primary/0 via-vete-primary/10 to-vete-primary/0 my-6" />

          {/* BOTTOM BAR - CRÉDITOS COMPACTO */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-xs text-vete-text-light/60 font-medium">
            <span>© {currentYear} {companyInfo.name}. Todos los derechos reservados.</span>
            <span className="hidden sm:block text-vete-primary/20">•</span>
            <a
              href="https://northcode-uy.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-vete-primary transition-colors duration-300"
              aria-label="Desarrollado por NorthCode"
            >
              Desarrollado por <strong>NorthCode</strong>
            </a>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;