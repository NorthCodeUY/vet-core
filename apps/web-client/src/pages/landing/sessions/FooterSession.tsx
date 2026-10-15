
// /apps/web-client/src/pages/landing/sessions/FooterSession.tsx
/* =============================================================================
   COMPONENTE: PIE DE PÁGINA INSTITUCIONAL (FooterSession)
   ============================================================================= */

import React, { useMemo } from 'react';
import { MapPin, Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useConfig } from '../../../context/tenant_context';

/**
 * Representa un ítem individual de información de contacto.
 * 
 * @interface ContactInfoItem
 * @property {React.ReactNode} icon - Componente vectorial identificatorio.
 * @property {string} label - Título semántico (ej: 'Teléfono', 'Email').
 * @property {string} value - Valor textual legible.
 * @property {string} [href] - Enlace hipervínculo (tel:, mailto: o URL externa).
 * @property {boolean} [isExternal] - Determina si debe abrirse en nueva pestaña.
 */
interface ContactInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

/**
 * Segmento estructurado de horario para presentación en grilla.
 * 
 * @interface ScheduleDisplayItem
 * @property {string} day - Rango de días (ej: 'Lunes a Viernes', 'Sábados').
 * @property {string} hours - Franja horaria formateada o 'Cerrado'.
 */
interface ScheduleDisplayItem {
  day: string;
  hours: string;
}

/**
 * Intervalo horario numérico en minutos transcurridos desde las 00:00 hs.
 * 
 * @interface TimeRangeInMinutes
 * @property {number} startMinutes - Minuto de apertura.
 * @property {number} endMinutes - Minuto de cierre.
 */
interface TimeRangeInMinutes {
  startMinutes: number;
  endMinutes: number;
}

/**
 * Propiedades del componente `FooterSession`.
 * 
 * @interface FooterSessionProps
 * @property {string} [bgColor] - Clase Tailwind del color estructural de fondo.
 */
export interface FooterSessionProps {
  bgColor?: string;
}

/**
 * Isotipo vectorial oficial de TikTok.
 */
const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

/**
 * Extrae todos los intervalos horarios de una cadena admitiendo turnos fraccionados.
 * 
 * Soporta separadores estándar (`-`, `–`, `—`), símbolos de división (`|`, `/`)
 * y sufijos de hora (`hs`).
 * 
 * @param {string} text - Cadena cruda (ej: "09:00 - 12:00 | 14:00 - 21:00 hs").
 * @returns {TimeRangeInMinutes[]} Matriz de intervalos en minutos.
 */
const parseTimeIntervals = (text: string): TimeRangeInMinutes[] => {
  const intervals: TimeRangeInMinutes[] = [];
  const regex = /(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const startMinutes = Number(match[1]) * 60 + Number(match[2]);
    const endMinutes = Number(match[3]) * 60 + Number(match[4]);
    intervals.push({ startMinutes, endMinutes });
  }

  return intervals;
};

/**
 * Evalúa reactivamente si el local comercial se encuentra en horario operativo.
 * 
 * Discrimina entre días hábiles (Lunes a Viernes), Sábados y Domingos según la
 * configuración del cliente.
 * 
 * @param {ReturnType<typeof useConfig>['config']} config - Configuración activa del tenant.
 * @returns {boolean} True si la hora del sistema coincide con un horario de apertura.
 */
const useIsBusinessOpen = (config: ReturnType<typeof useConfig>['config']): boolean => {
  return useMemo(() => {
    const schedule = config?.contact?.schedule;
    if (!schedule) return false;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let dayString = '';

    if (currentDay === 0) {
      // Domingo: solo evalúa si se mencionó explícitamente en weekdays
      dayString = schedule.weekdays?.toLowerCase().includes('domingo') ? schedule.weekdays : '';
    } else if (currentDay === 6) {
      // Sábado
      dayString = schedule.saturdays || schedule.weekdays || '';
    } else {
      // Lunes a Viernes
      dayString = schedule.weekdays || '';
    }

    if (!dayString || dayString.toLowerCase().includes('cerrado')) {
      return false;
    }

    const intervals = parseTimeIntervals(dayString);
    if (intervals.length === 0) return false;

    return intervals.some(
      ({ startMinutes, endMinutes }) => currentMinutes >= startMinutes && currentMinutes < endMinutes
    );
  }, [config]);
};

/**
 * Transforma la estructura de horarios del JSON en una lista visualmente ordenada.
 * 
 * @param {ReturnType<typeof useConfig>['config']} config - Configuración activa del tenant.
 * @returns {ScheduleDisplayItem[]} Lista formateada para renderizado en columna.
 */
const useFormattedSchedule = (config: ReturnType<typeof useConfig>['config']): ScheduleDisplayItem[] => {
  return useMemo(() => {
    const schedule = config?.contact?.schedule;
    const items: ScheduleDisplayItem[] = [];

    // 1. Días hábiles
    if (schedule?.weekdays) {
      const parts = schedule.weekdays.split(':');
      items.push({
        day: parts.length > 1 ? parts[0].trim() : 'Lunes a Viernes',
        hours: parts.slice(1).join(':').trim(),
      });
    }

    // 2. Sábados
    if (schedule?.saturdays) {
      const parts = schedule.saturdays.split(':');
      items.push({
        day: parts.length > 1 ? parts[0].trim() : 'Sábados',
        hours: parts.slice(1).join(':').trim(),
      });
    } else {
      items.push({ day: 'Sábados', hours: 'Cerrado' });
    }

    // 3. Domingos (Default administrativo seguro)
    items.push({ day: 'Domingos', hours: 'Cerrado' });

    return items;
  }, [config]);
};

/**
 * Pie de página estructural con información corporativa, horarios y redes (`FooterSession`).
 * 
 * Opera en Capa z-40 para deslizarse por encima de la barra flotante (z-30) al finalizar el scroll.
 *
 * @component
 * @param {FooterSessionProps} props - Propiedades visuales.
 * @returns {JSX.Element}
 */
export const FooterSession: React.FC<FooterSessionProps> = ({ bgColor = 'bg-vete-dark' }) => {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();

  const isOpen = useIsBusinessOpen(config);
  const scheduleItems = useFormattedSchedule(config);

  const phone = config?.contact?.admin_phone || '';
  const email = config?.contact?.email || '';
  const address = config?.contact?.address || '';
  const mapsUrl = config?.contact?.google_maps_url || '#';

  const socials = {
    facebook: config?.contact?.social_networks?.facebook || '#',
    instagram: config?.contact?.social_networks?.instagram || '#',
    tiktok: config?.contact?.social_networks?.tiktok || '#',
  };

  const contactList: ContactInfoItem[] = useMemo(() => [
    {
      icon: <Phone size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Teléfono',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`,
    },
    {
      icon: <Mail size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <MapPin size={16} className="text-vete-primary/70" strokeWidth={2.5} />,
      label: 'Ubicación',
      value: address,
      href: mapsUrl,
      isExternal: true,
    },
  ], [phone, email, address, mapsUrl]);

  return (
    <footer
      className={`
        /* --- Posición --- */
        relative                     /* Contexto de apilamiento */
        z-40                       /*<Esto no queda por ensima de > */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral escritorio */
        lg:px-24                     /* Padding lateral pantallas grandes */
        py-12                        /* Padding vertical */
        mt-32                        /* Separación superior */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo institucional inyectado */
        border-t                     /* Borde superior */
        border-vete-border-subtle/30 /* Tinte sutil */
        shadow-2xl                   /* Elevación contra el contenido superior */
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          
          {/* SECCIÓN 1: Identidad Corporativa */}
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

          {/* SECCIÓN 2: Contacto Directo */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Contacto</h4>
            <div className="space-y-2.5">
              {contactList.map((item, idx) => (
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

          {/* SECCIÓN 3: Horarios de Atención Dinámicos */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Horarios</h4>
            <div className="space-y-2">
              {scheduleItems.map((item, idx) => (
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

          {/* SECCIÓN 4: Canales Sociales */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black text-vete-primary uppercase tracking-widest">Síguenos</h4>
            <div className="flex items-center gap-2.5">
              {socials.facebook !== '#' && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-vete-surface border border-vete-border-subtle rounded-xl shadow-sm hover:border-vete-primary text-vete-text-base hover:text-vete-primary transition-all"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {socials.instagram !== '#' && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-vete-surface border border-vete-border-subtle rounded-xl shadow-sm hover:border-vete-primary text-vete-text-base hover:text-vete-primary transition-all"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              {socials.tiktok !== '#' && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-vete-surface border border-vete-border-subtle rounded-xl shadow-sm hover:border-vete-primary text-vete-text-base hover:text-vete-primary transition-all"
                  title="TikTok"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className="h-px bg-vete-border-subtle/50 my-6" />
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
  );
};

export default FooterSession;