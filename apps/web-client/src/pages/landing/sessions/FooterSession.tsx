/* =============================================================================
   COMPONENTE: PIE DE PÁGINA Y BARRA FLOTANTE REACTIVA (Footer)
   ============================================================================= */

import React, { useMemo, useCallback } from 'react';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { WhatsAppButton } from '../../../components/WhatsAppButtonProps';
import { useConfig } from '../../../context/tenant_context';

/**
 * Plataformas sociales soportadas por la plataforma.
 */
type SocialPlatform = 'facebook' | 'instagram' | 'tiktok';

/**
 * Elemento individual de contacto.
 * @interface ContactItem
 */
interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

/**
 * Elemento estructurado de horario comercial.
 * @interface ScheduleItem
 */
interface ScheduleItem {
  day: string;
  hours: string;
}

/**
 * Datos validados de contacto.
 * @interface SafeContactInfo
 */
interface SafeContactInfo {
  phone: string;
  email: string;
  city: string;
  country: string;
  mapsUrl: string;
}

/**
 * URLs validadas de redes sociales.
 * @interface SafeSocials
 */
interface SafeSocials {
  facebook: string;
  instagram: string;
  tiktok: string;
}

/**
 * Propiedades del componente `Footer`.
 * @interface FooterProps
 */
export interface FooterProps {
  bgColor?: string;
}

/**
 * Extrae las horas de apertura y cierre de un string formateado.
 * 
 * @param {string} scheduleString - Texto con rango horario (ej: "08:00 – 20:00").
 * @returns {{ openHour: number, closeHour: number } | null}
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
 * Hook para evaluar reactivamente si el local comercial se encuentra abierto.
 */
const useIsOpen = (scheduleString: string): boolean => {
  return useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 0) return false;

    const times = parseScheduleTime(scheduleString);
    if (!times) return false;

    const { openHour, closeHour } = times;
    return currentHour >= openHour && currentHour < closeHour;
  }, [scheduleString]);
};

/**
 * Hook que extrae datos seguros de contacto desde el contexto activo.
 */
const useSafeContactInfo = (config: ReturnType<typeof useConfig>['config']): SafeContactInfo => {
  return useMemo(() => ({
    phone: config?.contact?.admin_phone || 'No disponible',
    email: config?.contact?.email || 'No disponible',
    city: config?.contact?.address || '',
    country: config?.contact?.address || '',//<!> Esto no estoy muy seguro es lo mas pareseido que tenia e el archivo de configuraicon no se para que sirve 
    mapsUrl: config?.contact?.google_maps_url || '#',
  }), [config]);
};

/**
 * Hook que extrae enlaces seguros a redes sociales.
 */
const useSafeSocials = (config: ReturnType<typeof useConfig>['config']): SafeSocials => {
  return useMemo(() => ({
    facebook: config?.contact?.social_networks?.facebook || '#',
    instagram: config?.contact?.social_networks?.instagram || '#',
    tiktok: config?.contact?.social_networks?.tiktok || '#',
  }), [config]);
};

/**
 * Hook que genera el listado de horarios formateados.
 */
const useSafeSchedule = (weekdays?: string): ScheduleItem[] => {
  return useMemo(() => {
    const weekdaysSchedule = weekdays || 'Lunes a Sábados: 08:00 – 20:00';
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
  }, [weekdays]);
};

/**
 * Pie de página institucional y barra flotante de accesos rápidos (`Footer`).
 * 
 * @component
 * @param {FooterProps} props - Propiedades de configuración.
 * @returns {JSX.Element} Footer completo con enlaces, mapa y botones WhatsApp dinámicos.
 */
export const Footer: React.FC<FooterProps> = ({ bgColor = 'bg-vete-dark' }) => {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();
  const weekdaysSchedule = config?.contact?.schedule?.weekdays || '';

  const safeContactInfo = useSafeContactInfo(config);
  const safeSocials = useSafeSocials(config);
  const safeSchedule = useSafeSchedule(weekdaysSchedule);
  const isOpen = useIsOpen(weekdaysSchedule);

  /* Evaluación de presencia real de botón de emergencias */
  const hasEmergency = Boolean(
    config?.features?.has_emergency_button && 
    config?.contact?.emergency_phone && 
    config?.contact?.emergency_phone.trim() !== '' &&
    config?.contact?.emergency_phone !== '#'
  );

  const contactItems: ContactItem[] = useMemo(() => [
    {
      icon: <Phone size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Teléfono',
      value: safeContactInfo.phone,
      href: `tel:${safeContactInfo.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: <Mail size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Email',
      value: safeContactInfo.email,
      href: `mailto:${safeContactInfo.email}`,
    },
    {
      icon: <MapPin size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Ubicación',
      value: `${safeContactInfo.city}`,
      href: safeContactInfo.mapsUrl,
      isExternal: true,
    },
  ], [safeContactInfo]);

  const handleSocialClick = useCallback((platform: SocialPlatform) => {
    console.debug(`Click en red social: ${platform}`);
  }, []);

  return (
    <>
      {/* =====================================================================
         1. BARRA FLOTANTE INFERIOR: TEXTURA DE PASTO + ACCESOS RÁPIDOS
         ===================================================================== */}
      <div
        className={`
          /* --- Posición --- */
          fixed                      /* Fijo en pantalla */
          bottom-0                   /* Anclado abajo */
          left-0                     /* Anclado a la izquierda */
          z-[40]                     /* Capa por encima del contenido */
          flex                       /* Layout flexible */
          items-end                  /* Alineado al fondo */
          justify-between            /* Distribución a los extremos */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          h-24                       /* Altura de 6rem */
          px-4                       /* Padding lateral móvil */
          md:px-16                   /* Padding lateral escritorio */
          pb-4                       /* Separación inferior */

          /* --- Interacción --- */
          pointer-events-none        /* Clics pasan al fondo en áreas vacías */
        `}
      >
        {/* Fondo de pasto opcional montado desde /tenant/ */}
        <img
          src="/tenant/nav.png"
          alt=""
          className={`
            /* --- Posición --- */
            absolute                 /* Flotante detrás */
            bottom-0                 /* Anclado al fondo */
            left-0                   /* Anclado a la izquierda */
            z-0                      /* Capa trasera */
            pointer-events-none      /* Sin interferencia de clics */

            /* --- Dimensiones --- */
            w-full                   /* Ancho completo */
            h-full                   /* Altura completa */

            /* --- Colores --- */
            opacity-35               /* Transparencia sutil */

            /* --- Estilo --- */
            object-cover             /* Sin deformación */
            object-top               /* Anclado arriba */
          `}
        />

        {/* LADO IZQUIERDO: Solo muestra botón de Administración si existe emergencia a la derecha */}
        <div className="pointer-events-auto z-30">
          {hasEmergency && (
            <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <WhatsAppButton
                label="Administración"
                phone={safeContactInfo.phone}
                bgColor="bg-vete-tertiary"
              />
            </div>
          )}
        </div>

        {/* BARRA CENTRAL: Accesos Rápidos a Redes Sociales y Ubicación */}
        <div
          className={`
            /* --- Posición --- */
            absolute                 /* Centrado absoluto */
            bottom-4                 /* Elevado del fondo */
            left-1/2                 /* Centrado horizontal */
            -translate-x-1/2         /* Ajuste de eje */
            z-30                     /* Capa superior */
            flex                     /* Flexbox */
            items-center             /* Centrado vertical */
            gap-3.5                  /* Espaciado entre iconos */
            pointer-events-auto      /* Clickeable */
          `}
        >
          {/* Facebook */}
          {safeSocials.facebook !== '#' && (
            <a 
              href={safeSocials.facebook} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => handleSocialClick('facebook')}
              className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
              title="Síguenos en Facebook"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          )}

          {/* Acceso Directo a Mapa */}
          <a 
            href={safeContactInfo.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 hover:bg-vete-primary transition-all shadow-xl text-white hover:scale-125 group"
            title="Ver ubicación en Google Maps"
            aria-label="Google Maps"
          >
            <MapPin size={22} className="group-hover:text-white transition-colors" />
          </a>

          {/* Instagram */}
          {safeSocials.instagram !== '#' && (
            <a 
              href={safeSocials.instagram} 
              target="_blank" 
              rel="noreferrer"
              onClick={() => handleSocialClick('instagram')}
              className="p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-vete-primary transition-all shadow-lg text-white hover:scale-110"
              title="Síguenos en Instagram"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          )}
        </div>

        {/* LADO DERECHO: Prioridad móvil. Si hay emergencia va en rojo; si no hay emergencia, pasa aquí el contacto en verde */}
        <div className="pointer-events-auto z-30">
          {hasEmergency ? (
            <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <WhatsAppButton
                label="Emergencia"
                phone={config?.contact?.emergency_phone || '#'}
                bgColor="bg-vete-error"
                isReversed={true}
              />
            </div>
          ) : (
            <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <WhatsAppButton
                label="Contactenos"  // <!> Esto capas lo deberia aser agnostico por si quiero cmabiarlo 
                phone={safeContactInfo.phone}
                bgColor="bg-vete-tertiary"
                isReversed={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
         2. FOOTER ESTRUCTURADO Y CRÉDITOS
         ===================================================================== */}
      <footer
        className={`
          /* --- Posición --- */
          relative                   /* Contexto relativo */
          z-20                       /* Capa base sobre el fondo */

          /* --- Dimensiones --- */
          w-full                     /* Ancho completo */
          px-6                       /* Padding lateral móvil */
          md:px-16                   /* Padding lateral escritorio */
          lg:px-24                   /* Padding lateral pantallas grandes */
          py-12                      /* Padding vertical */
          mt-32                      /* Margen superior */

          /* --- Colores --- */
          ${bgColor}                 /* Fondo del tema inyectado */
          border-t                   /* Línea superior */
          border-vete-border-subtle/30 /* Borde sutil */
          shadow-lg                  /* Sombra suave */

        `}
      >
        <div className="max-w-7xl mx-auto">
          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            {/* SECCIÓN 1: Identidad y Marca */}
            <div className="flex flex-col items-center md:items-start gap-2.5">
              <img
                src={config?.branding?.logo_url || '/tenant/logo.png'}
                className="w-14 h-14 object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-sm"
                alt={`Logo ${config?.business_name || 'Comercio'}`}
              />
              <div className="text-center md:text-left">
                <h3 className="font-black text-base text-vete-text-base leading-tight uppercase">
                  {config?.business_name}
                </h3>
                <p className="mt-1 text-vete-primary text-[11px] font-bold tracking-wider">
                  {config?.slogan?.prefix}{' '}
                  <span className="text-vete-text-muted font-normal">
                    {config?.slogan?.highlight} {config?.slogan?.suffix}
                  </span>
                </p>
              </div>
            </div>

            {/* SECCIÓN 2: Contacto */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Contacto</h4>
              <div className="space-y-2.5">
                {contactItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href || '#'}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noreferrer' : undefined}
                    className="group flex items-start gap-2.5 text-xs text-vete-text-base hover:text-vete-primary transition-colors duration-200"
                    aria-label={item.label}
                  >
                    <div className="mt-0.5 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-vete-text-muted uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="font-medium group-hover:underline">
                        {item.value}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: Horarios de Atención */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Horarios</h4>
              <div className="space-y-2">
                {safeSchedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-vete-text-muted uppercase tracking-wider">
                      {item.day}
                    </span>
                    <span className="text-xs font-medium text-vete-text-base">
                      {item.hours}
                    </span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-vete-border-subtle flex items-center gap-2">
                  <span className={`relative flex h-2 w-2 shrink-0 ${isOpen ? 'animate-pulse' : ''}`}>
                    <span className={`absolute inset-0 rounded-full opacity-75 ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className={`relative h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </span>
                  <span className="text-xs font-bold text-vete-text-base">
                    {isOpen ? 'Abierto Ahora' : 'Cerrado Actualmente'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: Redes Sociales */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Síguenos</h4>
              <div className="flex items-center gap-2.5">
                {safeSocials.facebook !== '#' && (
                  <a
                    href={safeSocials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-vete-surface border border-vete-border-subtle rounded-xl shadow-sm hover:bg-[#1877F2] hover:text-white transition-all text-vete-primary"
                    title="Facebook"
                    aria-label="Facebook"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {safeSocials.instagram !== '#' && (
                  <a
                    href={safeSocials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-vete-surface border border-vete-border-subtle rounded-xl shadow-sm hover:bg-gradient-to-br hover:from-[#5B51D8] hover:via-[#E1306C] hover:to-[#F77737] hover:text-white transition-all text-vete-primary"
                    title="Instagram"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* DIVISOR DE CRÉDITOS */}
          <div className="h-px bg-vete-border-subtle/50 my-6" />

          {/* CRÉDITOS INFERIORES */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-vete-text-muted font-medium">
            <span>© {currentYear} {config?.business_name}. Todos los derechos reservados.</span>
            <a
              href="https://northcode-uy.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-vete-primary transition-colors duration-200"
            >
              Tecnología e Infraestructura por <strong>NorthCode</strong>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;