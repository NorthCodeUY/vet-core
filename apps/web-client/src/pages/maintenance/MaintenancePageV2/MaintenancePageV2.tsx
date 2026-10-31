/* =============================================================================
   PÁGINA: VISTA DE MANTENIMIENTO V2 - INAUGURACIÓN Y PLANES (MaintenancePageV2)
   ============================================================================= */

import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';
import { useConfig } from '../../../context/tenant_context';
import { MaintenanceHeader } from './MaintenanceHeader';
import { WellnessPlans } from './WellnessPlans';

/**
 * Pantalla de Mantenimiento y Próxima Inauguración Variante 2 (`MaintenancePageV2`).
 * Estructurada en subcomponentes modulares e integrada con planes de salud.
 */
export const MaintenancePageV2: React.FC = () => {
  const { config } = useConfig();
  const contact = config?.contact;
  const socials = contact?.social_networks;

  const phone = contact?.admin_phone || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const countryCode = contact?.whatsapp_country_code || '598';
  const whatsappUrl = `https://wa.me/${countryCode}${cleanPhone}?text=${encodeURIComponent(
    `¡Hola ${config?.business_name || ''}! Vi los planes de salud y me gustaría hacer una consulta.`
  )}`;

  return (
    <main className="relative flex items-center justify-center overflow-y-auto w-full min-h-screen p-4 sm:p-8 bg-vete-dark text-vete-text-base">
      
      {/* =====================================================================
         TARJETA EDITORIAL CENTRAL FLOTANTE (Bento Grid Global)
         ===================================================================== */}
      <div className="relative z-10 flex flex-col overflow-hidden w-full max-w-4xl bg-vete-surface border border-vete-border-subtle shadow-2xl rounded-3xl">
        
        {/* Halo Decorativo Superior */}
        <div className="absolute -top-20 -right-20 pointer-events-none w-60 h-60 bg-vete-primary/10 rounded-full blur-3xl" />

        {/* 1. SECCIÓN SUPERIOR: Encabezado e Inauguración */}
        <MaintenanceHeader businessName={config?.business_name} />

        {/* 2. SECCIÓN DE PLANES DE BIENESTAR Y TARIFAS */}
        <WellnessPlans whatsappUrl={whatsappUrl} />

        {/* ===================================================================
           3. BENTO GRID DE ATENCIÓN DIRECTA Y DATOS DE CONTACTO
           =================================================================== */}
        <div className="p-6 sm:p-10 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          
          {/* Tarjeta 1: Teléfono / WhatsApp */}
          <div className="flex flex-col justify-between p-4 bg-vete-soft/20 border border-vete-border-subtle rounded-2xl hover:border-vete-primary/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-vete-surface flex items-center justify-center text-vete-primary shadow-sm shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-vete-text-muted tracking-wider">Atención Directa</span>
                <h3 className="font-bold text-sm text-vete-text-base">Teléfono / WhatsApp</h3>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-vete-primary font-bold text-sm hover:underline mt-1"
            >
              <span>{contact?.admin_phone || 'Consultar'}</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Tarjeta 2: Correo Electrónico */}
          <div className="flex flex-col justify-between p-4 bg-vete-soft/20 border border-vete-border-subtle rounded-2xl hover:border-vete-primary/40 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-vete-surface flex items-center justify-center text-vete-primary shadow-sm shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-vete-text-muted tracking-wider">Consultas por Mail</span>
                <h3 className="font-bold text-sm text-vete-text-base">Escríbenos</h3>
              </div>
            </div>
            <a
              href={`mailto:${contact?.email || ''}`}
              className="text-xs text-vete-text-base font-medium hover:text-vete-primary transition-colors truncate mt-1"
            >
              {contact?.email || 'contacto@empresa.com'}
            </a>
          </div>

          {/* Tarjeta 3: Dirección y Ubicación (Colspan 2) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:col-span-2 p-4 bg-vete-soft/20 border border-vete-border-subtle rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-vete-surface flex items-center justify-center text-vete-primary shadow-sm shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-vete-text-muted tracking-wider">Ubicación Física</span>
                <h3 className="font-bold text-sm text-vete-text-base">{contact?.address || 'Salto, Uruguay'}</h3>
                <p className="text-xs text-vete-text-muted">Uruguay</p> 
              </div>
            </div>

            {contact?.google_maps_url && (
              <a
                href={contact.google_maps_direct_url || contact.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-vete-surface text-vete-text-base hover:bg-vete-primary hover:text-white shadow-sm text-xs font-bold rounded-xl transition-all"
              >
                <span>Ver en Maps</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* Tarjeta 4: Horarios de Atención (Colspan 2) */}
          {contact?.schedule && (
            <div className="sm:col-span-2 p-4 bg-vete-soft/20 border border-vete-border-subtle rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-vete-surface flex items-center justify-center text-vete-primary shadow-sm shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-vete-text-muted tracking-wider">Atención al Público</span>
                  <h3 className="font-bold text-sm text-vete-text-base">Horarios Comerciales</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-vete-surface/70">
                  <span className="text-vete-text-muted">Lunes a Viernes:</span>
                  <span className="font-bold text-vete-text-base">{contact.schedule.weekdays}</span>
                </div>
                {contact.schedule.saturdays && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-vete-surface/70">
                    <span className="text-vete-text-muted">Sábados:</span>
                    <span className="font-bold text-vete-text-base">{contact.schedule.saturdays}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
           4. REDES SOCIALES Y BOTÓN WHATSAPP DESTACADO
           =================================================================== */}
        <div className="p-6 sm:p-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-vete-border-subtle w-full bg-vete-surface">
          
          {/* Iconos de Redes Sociales */}
          <div className="flex items-center gap-2.5">
            {socials?.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-vete-soft/30 hover:bg-vete-primary hover:text-white text-vete-primary flex items-center justify-center transition-all shadow-sm"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
            )}
            {socials?.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-vete-soft/30 hover:bg-vete-primary hover:text-white text-vete-primary flex items-center justify-center transition-all shadow-sm"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
            )}
          </div>

          {/* Botón Principal de WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-vete-primary hover:bg-vete-primary-hover text-white shadow-lg shadow-vete-primary/20 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            <MessageCircle size={16} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  );
};

export default MaintenancePageV2;