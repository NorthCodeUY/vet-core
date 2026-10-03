// app/vet-core/apps/web-client/src/components/studio/TenantStudioDrawer.tsx
/* =============================================================================
   HERRAMIENTA DEV: TENANT STUDIO INTEGRAL (Live Customizer Pro)
   ============================================================================= */

import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Copy, 
  X, 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Layers, 
  Phone, 
  CreditCard,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useConfig } from '../../context/tenant_context';
import type { TenantConfig } from '../../types/tenant_types';

/**
 * Pestañas de navegación del estudio.
 */
type StudioTab = 'identity' | 'theme' | 'images' | 'services' | 'plans' | 'features' | 'contact';

/**
 * Estudio flotante en vivo para prototipado y generación de nuevos tenants.
 * 
 * @component
 * @returns {JSX.Element | null} Panel lateral retráctil multi-pestaña.
 */
export const TenantStudioDrawer: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<StudioTab>('identity');

  if (!config) return null;

  /* ---------------------------------------------------------------------------
     1. MANEJADORES DE ESTADO EN VIVO
     --------------------------------------------------------------------------- */

  /* A. Cambio de Colores */
  const handleColorChange = (key: string, value: string) => {
    updateConfig({
      ...config,
      theme: { ...config.theme, [key]: value },
    });
  };

  /* B. Carga de Imágenes Locales en Vivo (Blob Preview) */
  const handleImageUpload = (
    field: 'logo' | 'hero' | 'mision' | 'vision' | 'valores',
    file: File
  ) => {
    const previewUrl = URL.createObjectURL(file);

    const updated: TenantConfig = JSON.parse(JSON.stringify(config));

    if (field === 'logo') {
      updated.branding.logo_url = previewUrl;
    } else if (field === 'hero') {
      // Si tienes un hero_image_url lo actualiza, o busca por id
      const heroImg = document.querySelector<HTMLImageElement>('img[alt*="Portada"], img[alt*="Hero"]');
      if (heroImg) heroImg.src = previewUrl;
    } else {
      // Actualiza en el array institutional
      const section = updated.institutional.sections.find((s) => s.id === field);
      if (section) section.image_url = previewUrl;
    }

    updateConfig(updated);
  };

  /* C. Actualización de Textos de Identidad */
  const handleTextChange = (path: string, value: string) => {
    const updated: TenantConfig = JSON.parse(JSON.stringify(config));
    
    if (path === 'business_name') updated.business_name = value;
    if (path === 'hero.title_html') updated.hero.title_html = value;
    if (path === 'hero.description') updated.hero.description = value;
    if (path === 'plans.title_html') updated.plans_section.title_html = value;
    if (path === 'services.title_html') updated.services_section.title_html = value;

    updateConfig(updated);
  };

  /* D. Toggle de Features */
  const handleFeatureToggle = (key: keyof typeof config.features, checked: boolean) => {
    updateConfig({
      ...config,
      features: { ...config.features, [key]: checked },
    });
  };

  /* E. Toggle de Métodos de Pago */
  const handlePaymentToggle = (key: keyof typeof config.payment_methods, checked: boolean) => {
    updateConfig({
      ...config,
      payment_methods: { ...config.payment_methods, [key]: checked },
    });
  };

  /* ---------------------------------------------------------------------------
     2. EXPORTACIÓN Y DESCARGA
     --------------------------------------------------------------------------- */

  /* Sanitiza las URLs de blob temporales para que el JSON quede limpio con /tenant/ */
  const getCleanExportConfig = (): TenantConfig => {
    const clean: TenantConfig = JSON.parse(JSON.stringify(config));
    if (clean.branding.logo_url.startsWith('blob:')) clean.branding.logo_url = '/tenant/logo.png';
    clean.institutional.sections.forEach((s) => {
      if (s.image_url.startsWith('blob:')) s.image_url = `/tenant/${s.id}.png`;
    });
    return clean;
  };

  const handleDownloadJSON = () => {
    const clean = getCleanExportConfig();
    const jsonStr = JSON.stringify(clean, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const clean = getCleanExportConfig();
    navigator.clipboard.writeText(JSON.stringify(clean, null, 2)).then(() => {
      alert('📋 ¡config.json copiado al portapapeles con rutas de producción limpias!');
    });
  };

  return (
    <>
      {/* BOTÓN FLOTANTE GATILLO */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          /* --- Posición --- */
          fixed                      /* Fijo */
          bottom-6                   /* Anclado abajo */
          left-6                     /* Anclado a la izquierda */
          z-[9999]                   /* Capa máxima */
          flex                       /* Flexbox */
          items-center               /* Centrado vertical */
          gap-2.5                    /* Espaciado */

          /* --- Dimensiones --- */
          px-4.5                     /* Padding horizontal */
          py-3.5                     /* Padding vertical */

          /* --- Colores --- */
          bg-slate-900               /* Fondo oscuro */
          text-emerald-400           /* Verde neón */
          border                     /* Borde habilitado */
          border-emerald-500/40      /* Borde suave */
          shadow-2xl                 /* Sombra profunda */

          /* --- Texto --- */
          text-xs                    /* Tamaño compacto */
          font-black                 /* Grosor 900 */
          uppercase                  /* Mayúsculas */
          tracking-wider             /* Espaciado */

          /* --- Estilo --- */
          rounded-2xl                /* Bordes redondeados */

          /* --- Animación --- */
          transition-all             /* Transición fluida */
          duration-300               /* 300ms */
          hover:scale-105            /* Aumento en hover */
        `}
        title="Abrir Live Tenant Studio"
      >
        <Settings size={18} className="animate-spin" style={{ animationDuration: '10s' }} />
        <span>Tenant Studio</span>
      </button>

      {/* PANEL LATERAL RETRÁCTIL */}
      <aside
        className={`
          /* --- Posición --- */
          fixed                      /* Fijo sobre toda la ventana */
          top-0                      /* Anclado arriba */
          left-0                     /* Anclado a la izquierda */
          z-[9999]                   /* Capa superior */
          flex                       /* Flexbox */
          flex-col                   /* Disposición vertical */
          justify-between            /* Distribución */

          /* --- Dimensiones --- */
          w-[440px]                  /* Ancho de 440px */
          max-w-[95vw]               /* Límite en pantallas chicas */
          h-screen                   /* Altura completa */
          p-6                        /* Padding general */

          /* --- Colores --- */
          bg-slate-950/95            /* Fondo oscuro translúcido */
          backdrop-blur-xl           /* Desenfoque */
          border-r                   /* Borde derecho */
          border-slate-800           /* Color de borde */
          shadow-2xl                 /* Sombra */

          /* --- Animación --- */
          transition-transform       /* Deslizamiento lateral */
          duration-300               /* 300ms */
          ease-in-out                /* Aceleración suave */
          ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}
        `}
      >
        {/* CABECERA Y SELECTOR DE PESTAÑAS */}
        <div className="space-y-4 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles size={18} />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Live Customizer</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Menú de Pestañas */}
          <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('identity')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'identity' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Identidad
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'theme' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Colores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'images' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Fotos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'features' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Módulos
            </button>
          </div>
        </div>

        {/* CUERPO DEL EDITOR CON SCROLL */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          
          {/* ===================================================================
             PESTAÑA 1: IDENTIDAD Y TEXTOS
             =================================================================== */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={config.business_name}
                  onChange={(e) => handleTextChange('business_name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-xl font-bold focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Título Portada Hero (HTML)
                </label>
                <textarea
                  rows={2}
                  value={config.hero.title_html}
                  onChange={(e) => handleTextChange('hero.title_html', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-xl font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Descripción Portada Hero
                </label>
                <textarea
                  rows={2}
                  value={config.hero.description}
                  onChange={(e) => handleTextChange('hero.description', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-xl focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Título Sección Servicios
                </label>
                <input
                  type="text"
                  value={config.services_section.title_html}
                  onChange={(e) => handleTextChange('services.title_html', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-xl font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 2: PALETA DE COLORES EN VIVO
             =================================================================== */}
          {activeTab === 'theme' && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Selectores de Color (:root)
              </span>
              {Object.entries(config.theme).map(([key, hex]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-mono text-[11px] text-slate-300">{key}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-16 bg-slate-950 border border-slate-700 text-white font-mono text-[10px] p-1 rounded text-center"
                    />
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 3: GESTOR DE FOTOS E IMÁGENES EN VIVO
             =================================================================== */}
          {activeTab === 'images' && (
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Probar Imágenes Locales en Vivo
              </span>

              {/* 1. Logo */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src={config.branding.logo_url} alt="Logo" className="w-9 h-9 object-contain bg-slate-950 p-1 rounded-lg border border-slate-800" />
                  <div>
                    <span className="text-xs font-bold text-white block">Logo Principal</span>
                    <span className="text-[9px] text-slate-500 font-mono">/tenant/logo.png</span>
                  </div>
                </div>
                <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                  <Upload size={12} />
                  <span>Subir</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload('logo', e.target.files[0])} />
                </label>
              </div>

              {/* 2. Misión */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src={config.institutional.sections[0]?.image_url} alt="Misión" className="w-9 h-9 object-cover rounded-lg border border-slate-800" />
                  <div>
                    <span className="text-xs font-bold text-white block">Foto Misión</span>
                    <span className="text-[9px] text-slate-500 font-mono">/tenant/mision.png</span>
                  </div>
                </div>
                <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                  <Upload size={12} />
                  <span>Subir</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload('mision', e.target.files[0])} />
                </label>
              </div>

              {/* 3. Visión */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src={config.institutional.sections[1]?.image_url} alt="Visión" className="w-9 h-9 object-cover rounded-lg border border-slate-800" />
                  <div>
                    <span className="text-xs font-bold text-white block">Foto Visión</span>
                    <span className="text-[9px] text-slate-500 font-mono">/tenant/vision.png</span>
                  </div>
                </div>
                <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                  <Upload size={12} />
                  <span>Subir</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload('vision', e.target.files[0])} />
                </label>
              </div>
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 4: FEATURES Y MÉTODOS DE PAGO
             =================================================================== */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Módulos de la Web (Features)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(config.features).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => handleFeatureToggle(key as any, e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="truncate">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Métodos de Pago Activos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(config.payment_methods).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => handlePaymentToggle(key as any, e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BOTONERA INFERIOR DE EXPORTACIÓN */}
        <div className="pt-4 border-t border-slate-800 space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Download size={16} />
            <span>Descargar config.json Listo</span>
          </button>
          
          <button
            type="button"
            onClick={handleCopyJSON}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-800"
          >
            <Copy size={14} />
            <span>Copiar al Portapapeles</span>
          </button>
        </div>
      </aside>
    </>
  );
};