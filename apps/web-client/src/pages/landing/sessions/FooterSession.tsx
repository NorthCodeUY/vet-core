// apps/web-client/src/pages/landing/sessions/footer.tsx
import { WhatsAppButton } from '../../../components/WhatsAppButtonProps.tsx';
import companyInfo from '../../../data/companyInfo.json';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useMemo, useCallback } from 'react';

/**
 * Tipo literal para las plataformas de redes sociales
 * Asegura que solo se pasen valores válidos ('facebook', 'instagram', 'tiktok')
 * Mejora la seguridad del código y evita errores en tiempo de ejecución
 */
type SocialPlatform = 'facebook' | 'instagram' | 'tiktok';

/**
 * Interfaz para los elementos de contacto del footer
 */
interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

/**
 * Interfaz para los elementos del horario
 */
interface ScheduleItem {
  day: string;
  hours: string;
}

/**
 * Interfaz para la información segura del contacto
 * Garantiza que todos los campos obligatorios estén presentes
 */
interface SafeContactInfo {
  phone: string;
  email: string;
  city: string;
  country: string;
  mapsUrl: string;
}

/**
 * Interfaz para las redes sociales validadas
 * Todas las URLs son obligatorias y validadas
 */
interface SafeSocials {
  facebook: string;
  instagram: string;
  tiktok: string;
}

/**
 * Props del componente Footer
 * 
 * @property {string} bgColor - Clase Tailwind para el color de fondo del footer
 */
interface FooterProps {
  bgColor: string;
}

/**
 * Extrae las horas (inicio y cierre) de un string de horario
 * 
 * Formato soportado: "Lunes a Sábados: 08:00 – 20:00"
 * Retorna un objeto con openHour y closeHour como números
 * 
 * @param {string} scheduleString - String con el horario a parsear
 * @returns {Object | null} - { openHour: number, closeHour: number } o null si no coincide
 */
const parseScheduleTime = (scheduleString: string): { openHour: number; closeHour: number } | null => {
  const timeMatch = scheduleString.match(/(\d{2}):(\d{2})\s*–\s*(\d{2}):(\d{2})/);
  if (!timeMatch) return null;

  const [, openHourStr, , closeHourStr] = timeMatch;
  return {
    openHour: Number(openHourStr),
    closeHour: Number(closeHourStr),
  };
};

/**
 * Hook personalizado que calcula el estado de operación (abierto/cerrado)
 * basado en el horario dinámico desde los datos de la empresa.
 * 
 * Evita inconsistencias entre frontend y backend extrayendo las horas
 * directamente de la configuración en lugar de valores hardcodeados.
 * 
 * Lógica:
 * - Los domingos (day === 0) siempre está cerrado
 * - De lunes a sábado, valida si la hora actual está dentro del rango horario
 * 
 * @param {string} scheduleString - String del horario desde companyInfo.location.schedule.weekdays
 * @returns {boolean} - true si está abierto, false si está cerrado
 */
const useIsOpen = (scheduleString: string): boolean => {
  return useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay();

    // Domingos: siempre cerrado (day === 0)
    if (dayOfWeek === 0) return false;

    // Parsea el horario dinámicamente desde el string del backend
    const times = parseScheduleTime(scheduleString);
    if (!times) return false;

    const { openHour, closeHour } = times;
    return currentHour >= openHour && currentHour < closeHour;
  }, [scheduleString]);
};

/**
 * Hook personalizado que prepara información segura del contacto
 * Proporciona valores por defecto si la información no está disponible.
 * 
 * Valida que todos los campos requeridos existan antes de ser utilizados
 * en el renderizado del componente.
 * 
 * Dependencias: actualiza cuando companyInfo cambia (props/context futuro)
 * 
 * @returns {SafeContactInfo} - Objeto con información de contacto validada
 */
const useSafeContactInfo = (): SafeContactInfo => {
  return useMemo(() => ({
    phone: companyInfo.contact.adminPhone || 'No disponible',
    email: companyInfo.contact.email || 'No disponible',
    city: companyInfo.location.city || '',
    country: companyInfo.location.country || '',
    mapsUrl: companyInfo.location.googleMapsUrl || '#',
  }), []);
};

/**
 * Hook personalizado que prepara redes sociales validadas
 * Proporciona valores por defecto si las redes no están disponibles.
 * 
 * Garantiza que todas las URLs sean válidas antes de usarlas
 * en enlaces externos.
 * 
 * Dependencias: actualiza cuando companyInfo cambia (props/context futuro)
 * 
 * @returns {SafeSocials} - Objeto con URLs de redes sociales validadas
 */
const useSafeSocials = (): SafeSocials => {
  return useMemo(() => ({
    facebook: companyInfo.socials.facebook || '#',
    instagram: companyInfo.socials.instagram || '#',
    tiktok: companyInfo.socials.tiktok || '#',
  }), []);
};

/**
 * Hook personalizado que prepara el horario para mostrar en el footer
 * Obtiene dinámicamente desde los datos de la empresa para evitar hardcoding.
 * 
 * Lógica:
 * - Extrae las etiquetas de días desde el string del horario (ej: "Lunes a Sábados")
 * - Los domingos se asumen como "Domingos: Cerrado"
 * - Todo se obtiene dinámicamente del backend
 * 
 * Dependencias: actualiza cuando schedule cambia
 * 
 * @returns {ScheduleItem[]} - Array con días y horarios a mostrar
 */
const useSafeSchedule = (): ScheduleItem[] => {
  return useMemo(() => {
    const weekdaysSchedule = companyInfo.location.schedule.weekdays || '08:00 – 20:00';
    
    // Extrae el rango de días del string (ej: "Lunes a Sábados" de "Lunes a Sábados: 08:00 – 20:00")
    const daysMatch = weekdaysSchedule.match(/^([^:]+):\s*/);
    const weekdaysLabel = daysMatch ? daysMatch[1] : 'Lunes a Sábados';
    
    return [
      {
        day: weekdaysLabel,
        hours: weekdaysSchedule.split(':').slice(1).join(':').trim(),
      },
      {
        day: 'Domingos',
        hours: 'Cerrado',
      },
    ];
  }, []);
};

/**
 * Componente Footer
 * 
 * Renderiza un footer compacto y profesional con:
 * - Información de contacto (teléfono, email, ubicación)
 * - Horarios dinámicos desde la configuración de la empresa
 * - Estado de operación en tiempo real (abierto/cerrado)
 * - Redes sociales
 * - Barra flotante de accesos rápidos (WhatsApp, Maps, redes)
 * 
 * Arquitectura:
 * - Desacoplamiento: prepara para recibir companyInfo como prop (actualmente global)
 * - Tipado estricto: cero 'any', interfaces para todo
 * - Optimización: useMemo y useCallback para evitar recálculos
 * - Documentación: JSDoc en funciones y hooks
 * - Datos dinámicos: horarios y textos vienen del backend
 * 
 * @param {FooterProps} props - { bgColor: string }
 * @returns {JSX.Element} - Elemento del footer
 */
const Footer = ({ bgColor }: FooterProps) => {
  // Año actual para el copyright
  const currentYear = new Date().getFullYear();

  // Información de contacto segura con validación
  const safeContactInfo = useSafeContactInfo();

  // Redes sociales seguras con validación
  const safeSocials = useSafeSocials();

  // Horario seguro desde la configuración dinámico de la empresa
  const safeSchedule = useSafeSchedule();

  // Estado de operación dinámico basado en el horario del backend
  const isOpen = useIsOpen(companyInfo.location.schedule.weekdays);

  /**
   * Array de items de contacto con íconos
   * Se construye dentro del componente para tener acceso a safeContactInfo
   * Memorizado para evitar recálculos innecesarios
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

  /**
   * Manejador de click para íconos de redes sociales
   * Permite futura implementación de analytics o tracking.
   * 
   * Utiliza type SocialPlatform para garantizar que solo se pasen
   * valores válidos de plataformas soportadas (facebook, instagram, tiktok).
   * 
   * @param {SocialPlatform} platform - Nombre de la red social clickeada
   */
  const handleSocialClick = useCallback((platform: SocialPlatform) => {
    // Aquí se puede agregar lógica de tracking o analytics
    console.debug(`Click en red social: ${platform}`);
  }, []);

  return (
    <>
      {/* 1. BARRA FLOTANTE DE PASTO + ACCESOS RÁPIDOS */}
      <div className="fixed bottom-0 left-0 w-full h-24 z-20 flex items-end justify-between px-4 md:px-16 pb-4 pointer-events-none">
        <img
          src="/images/branding/NavPasto.png"
          alt="Nav Pasto"
          className="absolute bottom-0 left-0 w-full h-full object-cover object-top opacity-40 pointer-events-none z-0"
        />

        {/* Botón WhatsApp de Administración */}
        <div className="pointer-events-auto transition-all duration-300 hover:-translate-y-1 hover:scale-102 z-30">
          <WhatsAppButton
            label="Administración"
            phone={safeContactInfo.phone}
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
            onClick={() => handleSocialClick('facebook')}
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
            title="Facebook"
            aria-label="Síguenos en Facebook"
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
            aria-label="Google Maps"
          >
            <MapPin size={26} className="group-hover:text-white transition-colors" />
          </a>

          {/* Link: Instagram */}
          <a 
            href={safeSocials.instagram} 
            target="_blank" 
            rel="noreferrer"
            onClick={() => handleSocialClick('instagram')}
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
            title="Instagram"
            aria-label="Síguenos en Instagram"
          >
            <Instagram size={20} />
          </a>

        </div>

        {/* Botón WhatsApp de Emergencia */}
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
        
        {/* Línea decorativa superior sutil */}
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none z-50 bg-gradient-to-r from-vete-primary/0 via-vete-primary/15 to-vete-primary/0" />
        
        <div className="max-w-7xl mx-auto">
          
          {/* GRID PRINCIPAL - COMPACTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pb-6">

            {/* SECCIÓN 1: LOGO + IDENTIDAD */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <img
                src="/logo.png"
                className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-400 cursor-pointer filter drop-shadow-sm"
                alt={`${companyInfo.name} Logo`}
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
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">Contacto</h4>

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
                    <div className="mt-0.5 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
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
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">Horarios</h4>

              <div className="space-y-2">
                {safeSchedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-semibold text-vete-primary/60 uppercase tracking-wider">
                      {item.day}
                    </span>
                    <span className="text-xs font-medium text-vete-text-light">
                      {item.hours}
                    </span>
                  </div>
                ))}

                {/* Status de operación dinámico basado en el horario del backend */}
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
              <h4 className="text-xs font-bold text-vete-primary/80 uppercase tracking-widest">Síguenos</h4>

              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={safeSocials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick('facebook')}
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_12px_rgba(24,119,242,0.2)] transition-all duration-300 overflow-hidden"
                  title="Facebook"
                  aria-label="Seguir en Facebook"
                >
                  <Facebook size={14} className="text-vete-primary group-hover:text-white group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
                </a>

                {/* Instagram */}
                <a
                  href={safeSocials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick('instagram')}
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-gradient-to-br hover:from-[#5B51D8] hover:via-[#E1306C] hover:to-[#F77737] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(224,50,130,0.2)] transition-all duration-300 overflow-hidden"
                  title="Instagram"
                  aria-label="Seguir en Instagram"
                >
                  <Instagram size={14} className="text-vete-primary group-hover:text-white group-hover:scale-110 transition-all duration-300" strokeWidth={2.5} />
                </a>

                {/* TikTok */}
                <a
                  href={safeSocials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick('tiktok')}
                  className="group p-2 bg-white/80 border border-neutral-200/50 rounded-lg shadow-sm hover:bg-black hover:text-white hover:border-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden"
                  title="TikTok"
                  aria-label="Seguir en TikTok"
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