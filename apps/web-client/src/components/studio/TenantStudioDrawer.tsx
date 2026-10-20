// apps/web-client/src/components/studio/TenantStudioDrawer.tsx

/**
 * @file TenantStudioDrawer.tsx
 * @description Estudio de personalización en vivo para arquitectura Multi-tenant.
 * Permite modificar estilos, contenidos, imágenes y configuración operativa en tiempo de ejecución.
 * 
 * @module Components/Studio
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Copy, 
  X, 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Phone, 
  CreditCard,
  Upload,
  Plus,
  Trash2,
  MapPin,
  FileCode2
} from 'lucide-react';
import { useConfig } from '../../context/tenant_context';
import type { TenantConfig } from '../../types/tenant_types';

/**
 * Pestañas de navegación disponibles dentro del editor.
 */
type StudioTab = 'sections' | 'theme' | 'images' | 'contact_banks' | 'features';

/* =============================================================================
   SUB-COMPONENTE INTERNO: CAMPO DE TEXTO ESTILIZADO (InputField)
   ============================================================================= */

interface InputFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  isTextarea?: boolean;
  rows?: number;
  placeholder?: string;
}

/**
 * Input o Textarea parametrizado con diseño oscuro institucional.
 */
const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  isTextarea = false, 
  rows = 2,
  placeholder = ""
}) => (
  <div className={`
    /* --- Posición --- */
    flex                         /* Flex container */
    flex-col                     /* Disposición vertical */
    gap-1                        /* Espacio entre etiqueta y control */

    /* --- Dimensiones --- */
    w-full                       /* Ocupa el ancho completo */
  `}>
    <label className={`
      /* --- Texto --- */
      text-[10px]                /* Tipografía compacta */
      font-black                 /* Grosor 900 */
      uppercase                  /* Forzar mayúsculas */
      tracking-wider             /* Espaciado entre letras */
      text-slate-400             /* Tono atenuado */
    `}>
      {label}
    </label>
    {isTextarea ? (
      <textarea
        rows={rows}
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`
          /* --- Dimensiones --- */
          w-full                 /* Ancho total */
          p-2.5                  /* Padding interno */
          rounded-xl             /* Bordes redondeados */

          /* --- Colores --- */
          bg-slate-900           /* Fondo oscuro */
          border                 /* Aplica borde */
          border-slate-800       /* Borde suave */
          text-white             /* Texto en alto contraste */

          /* --- Texto --- */
          text-xs                /* Tamaño base */
          font-mono              /* Fuente monoespaciada */

          /* --- Animación --- */
          outline-none           /* Quita contorno nativo */
          focus:border-emerald-500 /* Borde activo */
          transition-colors      /* Suavizado */
        `}
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`
          /* --- Dimensiones --- */
          w-full                 /* Ancho total */
          p-2.5                  /* Padding interno */
          rounded-xl             /* Bordes redondeados */

          /* --- Colores --- */
          bg-slate-900           /* Fondo oscuro */
          border                 /* Aplica borde */
          border-slate-800       /* Borde suave */
          text-white             /* Texto en alto contraste */

          /* --- Texto --- */
          text-xs                /* Tamaño base */
          font-bold              /* Grosor intermedio */

          /* --- Animación --- */
          outline-none           /* Quita contorno nativo */
          focus:border-emerald-500 /* Borde activo */
          transition-colors      /* Suavizado */
        `}
      />
    )}
  </div>
);

/* =============================================================================
   SUB-COMPONENTE INTERNO: CABECERA DINÁMICA CON TOGGLE DE IMAGEN
   ============================================================================= */

interface SectionHeaderEditorProps {
  sectionName: string;
  titleHtml?: string;
  titleImageUrl?: string;
  description?: string;
  onUpdateTitleHtml: (val: string) => void;
  onUpdateTitleImage: (val: string) => void;
  onUpdateDescription?: (val: string) => void;
}

/**
 * Control modular para editar títulos mixtos (texto enriquecido vs. imagen gráfica).
 */
const SectionHeaderEditor: React.FC<SectionHeaderEditorProps> = ({
  sectionName,
  titleHtml,
  titleImageUrl = "",
  description,
  onUpdateTitleHtml,
  onUpdateTitleImage,
  onUpdateDescription,
}) => {
  const hasImage = Boolean(titleImageUrl && titleImageUrl.trim() !== '');

  return (
    <div className={`
      /* --- Posición --- */
      flex                         /* Contenedor flexible */
      flex-col                     /* Dirección en columna */
      gap-3                        /* Separación interna */

      /* --- Dimensiones --- */
      p-3.5                        /* Padding interno */
      rounded-xl                   /* Esquinas redondeadas */

      /* --- Colores --- */
      bg-slate-900/60              /* Fondo oscuro contrastado */
      border                       /* Borde estructural */
      border-slate-800             /* Color de borde */
    `}>
      <div className={`
        /* --- Posición --- */
        flex                         /* Layout en fila */
        justify-between              /* Extremos */
        items-center                 /* Centrado vertical */
      `}>
        <span className={`
          /* --- Texto --- */
          text-xs                    /* Texto mediano */
          font-black                 /* Grosor 900 */
          text-emerald-400           /* Color destacado */
          uppercase                  /* Mayúsculas */
        `}>
          {sectionName}
        </span>
        <label className={`
          /* --- Posición --- */
          flex                         /* Fila */
          items-center                 /* Centrado */
          gap-1.5                      /* Separación */
          cursor-pointer               /* Puntero de mano */

          /* --- Texto --- */
          text-[10px]                /* Texto pequeño */
          text-slate-400             /* Color atenuado */
        `}>
          <input
            type="checkbox"
            checked={hasImage}
            onChange={(e) => onUpdateTitleImage(e.target.checked ? `/tenant/${sectionName.toLowerCase()}-title.png` : '')}
            className="accent-emerald-500 rounded"
          />
          <span>Usar Logo/Imagen</span>
        </label>
      </div>

      {hasImage ? (
        <InputField 
          label="Ruta de Imagen Título (/tenant/...)" 
          value={titleImageUrl} 
          onChange={onUpdateTitleImage} 
        />
      ) : (
        <InputField 
          label="Título con Marcado HTML" 
          value={titleHtml} 
          onChange={onUpdateTitleHtml} 
        />
      )}

      {onUpdateDescription && description !== undefined && (
        <InputField 
          label="Descripción de Sección" 
          value={description} 
          onChange={onUpdateDescription} 
          isTextarea 
          rows={2} 
        />
      )}
    </div>
  );
};

/* =============================================================================
   COMPONENTE PRINCIPAL: TENANT STUDIO DRAWER
   ============================================================================= */

export const TenantStudioDrawer: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<StudioTab>('sections');

  if (!config) return null;

  /* Helper para mutación inmutable del estado global */
  const updateNestedConfig = (mutator: (draft: TenantConfig) => void) => {
    const draft: TenantConfig = JSON.parse(JSON.stringify(config));
    mutator(draft);
    updateConfig(draft);
  };

  /* ---------------------------------------------------------------------------
     ACCIONES DE DESCARGA Y PORTAPAPELES
     --------------------------------------------------------------------------- */
  const getSanitizedConfig = (): TenantConfig => {
    const clean: TenantConfig = JSON.parse(JSON.stringify(config));
    if (clean.branding.logo_url.startsWith('blob:')) clean.branding.logo_url = '/tenant/logo.png';
    clean.institutional?.sections.forEach((s) => {
      if (s.image_url.startsWith('blob:')) s.image_url = `/tenant/${s.id}.png`;
    });
    return clean;
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(getSanitizedConfig(), null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.id || 'client'}_config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(getSanitizedConfig(), null, 2)).then(() => {
      alert('📋 ¡config.json copiado al portapapeles!');
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
          bottom-6                   /* Inferior */
          left-6                     /* Izquierda */
          z-[9999]                   /* Capa superior */
          flex                       /* Flexible */
          items-center                 /* Centrado vertical */
          gap-2                      /* Espacio entre icono y texto */

          /* --- Dimensiones --- */
          px-4                       /* Padding lateral */
          py-3                       /* Padding vertical */
          rounded-2xl                /* Redondeado */

          /* --- Colores --- */
          bg-slate-900               /* Fondo oscuro */
          text-emerald-400           /* Verde acento */
          border                     /* Borde habilitado */
          border-emerald-500/40      /* Borde suave */
          shadow-2xl                 /* Sombra profunda */

          /* --- Texto --- */
          text-xs                    /* Tipografía pequeña */
          font-black                 /* Grosor 900 */
          uppercase                  /* Mayúsculas */
          tracking-wider             /* Espaciado */

          /* --- Animación --- */
          transition-transform       /* Suavizado */
          hover:scale-105            /* Escala en hover */
        `}
      >
        <Settings size={18} className="animate-spin" style={{ animationDuration: '10s' }} />
        <span>Tenant Studio</span>
      </button>

      {/* PANEL LATERAL RETRÁCTIL */}
      <aside
        className={`
          /* --- Posición --- */
          fixed                      /* Fijo */
          top-0                      /* Superior */
          left-0                     /* Izquierda */
          z-[9999]                   /* Máxima capa */
          flex                       /* Flexible */
          flex-col                   /* Columna */
          justify-between            /* Separación cabecera-pie */

          /* --- Dimensiones --- */
          w-[460px]                  /* Ancho del panel */
          max-w-[95vw]               /* Límite móvil */
          h-screen                   /* Altura completa */
          p-6                        /* Padding general */

          /* --- Colores --- */
          bg-slate-950/95            /* Fondo opaco */
          backdrop-blur-xl           /* Desenfoque */
          border-r                   /* Borde lateral */
          border-slate-800           /* Color divisorio */
          shadow-2xl                 /* Sombra */

          /* --- Animación --- */
          transition-transform       /* Suavizado */
          duration-300
          ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}
        `}
      >
        {/* CABECERA Y SELECTOR DE PESTAÑAS */}
        <div className="space-y-4 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles size={18} />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Live Customizer Pro</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Menú de Pestañas Estandarizado */}
          <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl text-[9px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'sections' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Secciones
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
              onClick={() => setActiveTab('contact_banks')}
              className={`py-1.5 rounded-lg transition-all ${activeTab === 'contact_banks' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Contacto/Banco
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

        {/* CUERPO DEL EDITOR SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">

          {/* ===================================================================
             PESTAÑA 1: SECCIONES Y CONTENIDOS (Renombrado de Identidad)
             =================================================================== */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <InputField
                label="Nombre de Empresa / Comercial"
                value={config.business_name}
                onChange={(val) => updateNestedConfig((d) => { d.business_name = val; })}
              />

              {/* 1. Hero Section */}
              <SectionHeaderEditor
                sectionName="Hero"
                titleHtml={config.hero.title_html || ''}
                titleImageUrl={config.hero.title_image_url || ''}
                description={config.hero.description || ''}
                onUpdateTitleHtml={(val) => updateNestedConfig((d) => { 
                  d.hero.title_html = val; 
                })}
                onUpdateTitleImage={(val) => updateNestedConfig((d) => { 
                  d.hero.title_image_url = val; 
                })}
                onUpdateDescription={(val) => updateNestedConfig((d) => { 
                  d.hero.description = val; 
                })}
              />

              {/* 2. Servicios */}
              <SectionHeaderEditor
                sectionName="Servicios"
                titleHtml={config.services_section?.title_html || ''}
                titleImageUrl={config.services_section?.title_image_url || ''}
                description={config.services_section?.description || ''}
                onUpdateTitleHtml={(val) => updateNestedConfig((d) => { 
                  if (d.services_section) d.services_section.title_html = val; 
                })}
                onUpdateTitleImage={(val) => updateNestedConfig((d) => { 
                  if (d.services_section) d.services_section.title_image_url = val; 
                })}
                onUpdateDescription={(val) => updateNestedConfig((d) => { 
                  if (d.services_section) d.services_section.description = val; 
                })}
              />

              {/* 3. Planes / Promociones */}
              <SectionHeaderEditor
                sectionName="Planes"
                titleHtml={config.plans_section?.title_html || ''}
                titleImageUrl={config.plans_section?.title_image_url || ''}
                description={config.plans_section?.description || ''}
                onUpdateTitleHtml={(val) => updateNestedConfig((d) => { 
                  if (d.plans_section) d.plans_section.title_html = val; 
                })}
                onUpdateTitleImage={(val) => updateNestedConfig((d) => { 
                  if (d.plans_section) d.plans_section.title_image_url = val; 
                })}
                onUpdateDescription={(val) => updateNestedConfig((d) => { 
                  if (d.plans_section) d.plans_section.description = val; 
                })}
              />

              {/* 4. Ubicación / Dónde Estamos */}
              <SectionHeaderEditor
                sectionName="Ubicación"
                titleHtml={config.location_section.title_html}
                titleImageUrl={config.location_section.title_image_url}
                description={config.location_section.description_html}
                onUpdateTitleHtml={(val) => updateNestedConfig((d) => { d.location_section.title_html = val; })}
                onUpdateTitleImage={(val) => updateNestedConfig((d) => { d.location_section.title_image_url = val; })}
                onUpdateDescription={(val) => updateNestedConfig((d) => { d.location_section.description_html = val; })}
              />
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 2: PALETA DE COLORES (:root)
             =================================================================== */}
          {activeTab === 'theme' && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Colores Institucionales Activos
              </span>
              {Object.entries(config.theme).map(([key, hex]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-mono text-[11px] text-slate-300">{key}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => updateNestedConfig((d) => { (d.theme as any)[key] = e.target.value; })}
                      className="w-18 bg-slate-950 border border-slate-700 text-white font-mono text-[10px] p-1 rounded text-center"
                    />
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => updateNestedConfig((d) => { (d.theme as any)[key] = e.target.value; })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 3: GESTOR DE FOTOS E IMÁGENES
             =================================================================== */}
          {activeTab === 'images' && (
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Visualización de Assets
              </span>
              <InputField
                label="URL Logo Principal"
                value={config.branding.logo_url}
                onChange={(val) => updateNestedConfig((d) => { d.branding.logo_url = val; })}
              />
              <InputField
                label="URL Animación Hero (Lottie JSON)"
                value={config.branding.hero_animation_url}
                onChange={(val) => updateNestedConfig((d) => { d.branding.hero_animation_url = val; })}
              />
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 4: CONTACTO Y CUENTAS BANCARIAS
             =================================================================== */}
          {activeTab === 'contact_banks' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Información de Contacto
                </span>
                <InputField
                  label="Teléfono Administrativo"
                  value={config.contact.admin_phone}
                  onChange={(val) => updateNestedConfig((d) => { d.contact.admin_phone = val; })}
                />
                <InputField
                  label="Teléfono de Emergencias"
                  value={config.contact.emergency_phone}
                  onChange={(val) => updateNestedConfig((d) => { d.contact.emergency_phone = val; })}
                />
                <InputField
                  label="Dirección Física"
                  value={config.contact.address}
                  onChange={(val) => updateNestedConfig((d) => { d.contact.address = val; })}
                />
                <InputField
                  label="URL Directa Google Maps"
                  value={config.contact.google_maps_url}
                  onChange={(val) => updateNestedConfig((d) => { d.contact.google_maps_url = val; })}
                />
              </div>

              {/* Cuentas Bancarias */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Cuentas Bancarias
                  </span>
                  <button
                    type="button"
                    onClick={() => updateNestedConfig((d) => {
                      d.bank_accounts.push({
                        bank_name: "BROU",
                        currency: "UYU",
                        account_number: "",
                        beneficiary: d.business_name
                      });
                    })}
                    className="p-1 text-emerald-400 bg-slate-900 hover:bg-slate-800 rounded flex items-center gap-1 text-[10px]"
                  >
                    <Plus size={12} /> Agregar
                  </button>
                </div>

                {config.bank_accounts.map((acc, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => updateNestedConfig((d) => { d.bank_accounts.splice(idx, 1); })}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="Banco"
                        value={acc.bank_name}
                        onChange={(val) => updateNestedConfig((d) => { d.bank_accounts[idx].bank_name = val; })}
                      />
                      <InputField
                        label="Moneda"
                        value={acc.currency}
                        onChange={(val) => updateNestedConfig((d) => { d.bank_accounts[idx].currency = val; })}
                      />
                    </div>
                    <InputField
                      label="Número de Cuenta"
                      value={acc.account_number}
                      onChange={(val) => updateNestedConfig((d) => { d.bank_accounts[idx].account_number = val; })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
             PESTAÑA 5: FEATURES, PAGOS Y VARIANTES UI
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
                        onChange={(e) => updateNestedConfig((d) => { (d.features as any)[key] = e.target.checked; })}
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
                        onChange={(e) => updateNestedConfig((d) => { (d.payment_methods as any)[key] = e.target.checked; })}
                        className="accent-emerald-500"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Variantes de UI Activas
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(config.ui_variants).map(([key, val]) => (
                    <InputField
                      key={key}
                      label={`Variante ${key}`}
                      value={val}
                      onChange={(newVal) => updateNestedConfig((d) => { (d.ui_variants as any)[key] = newVal; })}
                    />
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
            className={`
              /* --- Posición --- */
              flex items-center justify-center gap-2
              /* --- Dimensiones --- */
              w-full py-3 rounded-xl
              /* --- Colores --- */
              bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg
              /* --- Texto --- */
              font-black text-xs uppercase tracking-wider
              /* --- Animación --- */
              transition-all
            `}
          >
            <Download size={16} />
            <span>Descargar config.json Listo</span>
          </button>
          
          <button
            type="button"
            onClick={handleCopyJSON}
            className={`
              /* --- Posición --- */
              flex items-center justify-center gap-2
              /* --- Dimensiones --- */
              w-full py-2 rounded-xl
              /* --- Colores --- */
              bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800
              /* --- Texto --- */
              font-bold text-xs
              /* --- Animación --- */
              transition-all
            `}
          >
            <Copy size={14} />
            <span>Copiar al Portapapeles</span>
          </button>
        </div>
      </aside>
    </>
  );
};