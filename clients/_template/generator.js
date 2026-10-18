// clients/_template/generator.js

/**
 * @fileoverview Motor de Administración Visual de Clientes y Generador de Configuración (generator.js)
 * 
 * Implementa una arquitectura orientada a componentes en Vanilla JS.
 * Administra el estado global del tenant, sincroniza variables CSS con el DOM,
 * gestiona la vista previa modular y exporta el archivo `config.json` validado.
 * 
 * @module generator
 */

/* =============================================================================
   ESTADO GLOBAL DE LA APLICACIÓN (Single Source of Truth)
   ============================================================================= */
let activeConfig = {
  _version: "1.0.0",
  id: "nuevo_cliente",
  business_name: "Mi Comercio",
  slogan: { prefix: "Tu mejor opción en", highlight: "Calidad y Confianza", suffix: "para vos" },
  theme: {
    primary: "#275D9E",
    primary_hover: "#1E4B82",
    secondary: "#daebd4",
    tertiary: "#1FAF38",
    dark: "#fdfdf1",
    surface: "#FFFFFF",
    soft: "#649353",
    overlay: "#000000",
    text_base: "#000000",
    text_muted: "#64748B",
    border_subtle: "#E2E8F0",
    error: "#DC2626"
  },
  branding: {
    logo_url: "/tenant/logo.png",
    hero_animation_url: "/tenant/animations/hero_animation.json"
  },
  ui_variants: {
    header: "v1",
    footer: "v1",
    product_card: "v2",
    hero: "v1",
    portfolio_card: "v1"
  },
  features: {
    has_cart: true,
    has_products: true,
    has_services: true,
    has_health_plans: true,
    has_portfolio: false,
    has_locations: true,
    has_hero: true,
    has_emergency_button: false,
    has_background_animation: false,
    has_dividers: false
  },
  hero: {
    title_html: "Cuidamos <span class='text-vete-primary'>lo que más</span> querés",
    description: "Atención profesional en un entorno exclusivo pensado para tu tranquilidad y satisfacción."
  },
  services_section: {
    title_html: "Nuestros <span class='text-vete-primary'>Servicios</span>",
    description: "Soluciones a medida con los más altos estándares.",
    items: []
  },
  plans_section: {
    title_html: "Planes y <span class='text-vete-primary'>Membresías</span>",
    description: "Opciones convenientes diseñadas para acompañarte mes a mes.",
    items: []
  },
  portfolio_section: {
    title_html: "Nuestros <span class='text-vete-primary'>Trabajos</span>",
    description: "Galería de proyectos destacados y terminaciones de primer nivel.",
    items: []
  },
  contact: {
    admin_phone: "099123456",
    emergency_phone: "",
    whatsapp_country_code: "598",
    email: "contacto@micomercio.com",
    address: "Calle Principal 1234, Salto, Uruguay",
    google_maps_url: "",
    google_maps_direct_url: "",
    schedule: { weekdays: "Lunes a Viernes: 09:00 – 19:00", saturdays: "Sábados: 09:00 – 13:00" },
    social_networks: { facebook: "#", instagram: "#", tiktok: "#" }
  }
};

/* =============================================================================
   CATÁLOGO DE ICONOS SVG DISPONIBLES
   ============================================================================= */
const ICON_REGISTRY = {
  Stethoscope: `<svg class="w-5 h-5 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  Activity: `<svg class="w-5 h-5 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
  ShieldCheck: `<svg class="w-5 h-5 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
  Scissors: `<svg class="w-5 h-5 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="6" cy="6" r="3" stroke-width="2"/><circle cx="6" cy="18" r="3" stroke-width="2"/><line x1="20" y1="4" x2="8.12" y2="15.88" stroke-width="2"/><line x1="14.47" y1="14.48" x2="20" y2="20" stroke-width="2"/><line x1="8.12" y1="8.12" x2="12" y2="12" stroke-width="2"/></svg>`,
  Sparkles: `<svg class="w-5 h-5 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`
};

/* =============================================================================
   MOTOR DE COLOR DINÁMICO (HEX -> RGB PARA TAILWIND)
   ============================================================================= */
function hexToRgbTuple(hex) {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  const num = parseInt(cleanHex, 16);
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}

function syncThemeWithDOM(theme) {
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, hex]) => {
    const cssVar = `--vete-${key.replace(/_/g, '-')}`;
    root.style.setProperty(cssVar, hexToRgbTuple(hex));
  });
}

function stripComments(jsonStr) {
  return jsonStr.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, group) => (group ? "" : match));
}

/* =============================================================================
   SUB-COMPONENTES DEL FORMULARIO (Render Functions)
   ============================================================================= */

// 1. Identidad y Eslogan
function renderIdentitySection() {
  const el = document.getElementById('mount-identity-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3";
  el.innerHTML = `
    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
      🏷️ 1. Identidad Corporativa
    </h3>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-[11px] text-slate-400 font-medium">Tenant ID:</label>
        <input type="text" value="${activeConfig.id}" oninput="activeConfig.id = this.value; renderPreview();" class="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2 rounded-xl mt-1 outline-none font-mono" />
      </div>
      <div>
        <label class="text-[11px] text-slate-400 font-medium">Nombre Comercial:</label>
        <input type="text" value="${activeConfig.business_name}" oninput="activeConfig.business_name = this.value; renderPreview();" class="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2 rounded-xl mt-1 outline-none font-bold" />
      </div>
    </div>
    <div class="space-y-1">
      <label class="text-[11px] text-slate-400 font-medium">Eslogan (Prefix | Highlight | Suffix):</label>
      <div class="grid grid-cols-3 gap-2">
        <input type="text" value="${activeConfig.slogan?.prefix || ''}" oninput="activeConfig.slogan.prefix = this.value; renderPreview();" class="bg-slate-900 border border-slate-800 text-white text-xs p-1.5 rounded-lg" placeholder="Prefix" />
        <input type="text" value="${activeConfig.slogan?.highlight || ''}" oninput="activeConfig.slogan.highlight = this.value; renderPreview();" class="bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-xs p-1.5 rounded-lg" placeholder="Highlight" />
        <input type="text" value="${activeConfig.slogan?.suffix || ''}" oninput="activeConfig.slogan.suffix = this.value; renderPreview();" class="bg-slate-900 border border-slate-800 text-white text-xs p-1.5 rounded-lg" placeholder="Suffix" />
      </div>
    </div>
  `;
}

// 2. Paleta de Colores
function renderThemeSection() {
  const el = document.getElementById('mount-theme-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3";
  el.innerHTML = `
    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
      🎨 2. Paleta de Colores Dinámica
    </h3>
    <div id="theme-color-rows" class="grid grid-cols-2 gap-2"></div>
  `;

  const rows = document.getElementById('theme-color-rows');
  Object.entries(activeConfig.theme).forEach(([key, hex]) => {
    const box = document.createElement('div');
    box.className = "flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl";
    box.innerHTML = `
      <span class="text-[10px] font-mono text-slate-300 truncate max-w-[80px]">${key}</span>
      <div class="flex items-center gap-1.5">
        <input type="text" value="${hex}" onchange="updateColor('${key}', this.value)" class="w-14 bg-slate-950 text-white font-mono text-[10px] p-1 rounded text-center border border-slate-700" />
        <input type="color" value="${hex}" oninput="updateColor('${key}', this.value)" class="w-5 h-5 rounded cursor-pointer bg-transparent border-0" />
      </div>
    `;
    rows.appendChild(box);
  });
}

function updateColor(key, hex) {
  activeConfig.theme[key] = hex;
  syncThemeWithDOM(activeConfig.theme);
  renderPreview();
}

// 3. Módulos y Variantes de Diseño
function renderVariantsFeaturesSection() {
  const el = document.getElementById('mount-variants-features-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-4";
  el.innerHTML = `
    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
      ⚙️ 3. Módulos Activos y Variantes
    </h3>
    
    <!-- Toggles -->
    <div id="features-toggles-grid" class="grid grid-cols-2 gap-2"></div>

    <!-- Variantes Selector -->
    <div class="pt-2 border-t border-slate-800/80">
      <span class="text-[10px] font-bold text-slate-400 uppercase block mb-2">Variantes Visuales (Strategy Pattern):</span>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label class="text-[10px] text-slate-400">Hero:</label>
          <select onchange="activeConfig.ui_variants.hero = this.value; renderPreview();" class="w-full bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-800">
            <option value="v1" ${activeConfig.ui_variants.hero === 'v1' ? 'selected' : ''}>Hero V1 (Clásico)</option>
            <option value="v2" ${activeConfig.ui_variants.hero === 'v2' ? 'selected' : ''}>Hero V2 (3D Lateral)</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] text-slate-400">Cards Producto:</label>
          <select onchange="activeConfig.ui_variants.product_card = this.value; renderPreview();" class="w-full bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-800">
            <option value="v1" ${activeConfig.ui_variants.product_card === 'v1' ? 'selected' : ''}>Card V1 (Plana)</option>
            <option value="v2" ${activeConfig.ui_variants.product_card === 'v2' ? 'selected' : ''}>Card V2 (Acordeón)</option>
          </select>
        </div>
      </div>
    </div>
  `;

  const grid = document.getElementById('features-toggles-grid');
  Object.entries(activeConfig.features).forEach(([key, enabled]) => {
    const lbl = document.createElement('label');
    lbl.className = "flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer text-[11px] text-slate-300";
    lbl.innerHTML = `
      <input type="checkbox" ${enabled ? 'checked' : ''} onchange="activeConfig.features['${key}'] = this.checked; renderPreview();" class="accent-emerald-500 rounded" />
      <span class="truncate">${key.replace('has_', '')}</span>
    `;
    grid.appendChild(lbl);
  });
}

// 4. Hero Section Form
function renderHeroSection() {
  const el = document.getElementById('mount-hero-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3";
  el.innerHTML = `
    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider">
      ✨ 4. Sección Portada (Hero)
    </h3>
    <div>
      <label class="text-[11px] text-slate-400">Título enriquecido con HTML:</label>
      <textarea rows="2" oninput="activeConfig.hero.title_html = this.value; renderPreview();" class="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2 rounded-xl mt-1 font-mono">${activeConfig.hero?.title_html || ''}</textarea>
    </div>
    <div>
      <label class="text-[11px] text-slate-400">Bajada descriptiva:</label>
      <textarea rows="2" oninput="activeConfig.hero.description = this.value; renderPreview();" class="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2 rounded-xl mt-1">${activeConfig.hero?.description || ''}</textarea>
    </div>
  `;
}

// 5. Servicios Form
function renderServicesSection() {
  const el = document.getElementById('mount-services-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3";
  el.innerHTML = `
    <div class="flex justify-between items-center">
      <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider">🩺 5. Catálogo de Servicios</h3>
      <button onclick="addServiceItem()" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">+ Agregar</button>
    </div>
    <div id="services-form-items" class="space-y-3"></div>
  `;

  const container = document.getElementById('services-form-items');
  (activeConfig.services_section?.items || []).forEach((srv, idx) => {
    const card = document.createElement('div');
    card.className = "p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2";
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="text-[11px] font-bold text-slate-400">#${idx + 1}</span>
        <select onchange="activeConfig.services_section.items[${idx}].icon_name = this.value; renderPreview();" class="bg-slate-950 text-white text-[10px] p-1 rounded border border-slate-700">
          ${Object.keys(ICON_REGISTRY).map(k => `<option value="${k}" ${srv.icon_name === k ? 'selected' : ''}>${k}</option>`).join('')}
        </select>
        <button onclick="removeServiceItem(${idx})" class="text-red-400 hover:text-red-300 text-xs">✕</button>
      </div>
      <input type="text" value="${srv.title}" oninput="activeConfig.services_section.items[${idx}].title = this.value; renderPreview();" class="w-full bg-slate-950 border border-slate-800 text-white text-xs p-1.5 rounded-lg" placeholder="Nombre del servicio" />
      <textarea rows="1" oninput="activeConfig.services_section.items[${idx}].description = this.value; renderPreview();" class="w-full bg-slate-950 border border-slate-800 text-slate-300 text-[11px] p-1.5 rounded-lg" placeholder="Descripción">${srv.description}</textarea>
    `;
    container.appendChild(card);
  });
}

function addServiceItem() {
  if (!activeConfig.services_section) activeConfig.services_section = { items: [] };
  activeConfig.services_section.items.push({
    id: `servicio-${Date.now()}`,
    title: "Nuevo Servicio",
    description: "Detalle del procedimiento o consulta.",
    icon_name: "Stethoscope"
  });
  renderServicesSection();
  renderPreview();
}

function removeServiceItem(idx) {
  activeConfig.services_section.items.splice(idx, 1);
  renderServicesSection();
  renderPreview();
}

// 6. Trabajos Realizados (Portfolio) Form
function renderPortfolioSection() {
  const el = document.getElementById('mount-portfolio-section');
  el.className = "bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3";
  el.innerHTML = `
    <div class="flex justify-between items-center">
      <h3 class="text-xs font-black text-emerald-400 uppercase tracking-wider">💼 6. Trabajos / Portfolio</h3>
      <button onclick="addPortfolioItem()" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">+ Agregar Trabajo</button>
    </div>
    <div id="portfolio-form-items" class="space-y-3"></div>
  `;

  const container = document.getElementById('portfolio-form-items');
  (activeConfig.portfolio_section?.items || []).forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = "p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2";
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <input type="text" value="${item.category || ''}" oninput="activeConfig.portfolio_section.items[${idx}].category = this.value; renderPreview();" class="bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] p-1 rounded font-bold uppercase" placeholder="Categoría (ej: Corte, Rejas)" />
        <button onclick="removePortfolioItem(${idx})" class="text-red-400 hover:text-red-300 text-xs">✕</button>
      </div>
      <input type="text" value="${item.title}" oninput="activeConfig.portfolio_section.items[${idx}].title = this.value; renderPreview();" class="w-full bg-slate-950 border border-slate-800 text-white text-xs p-1.5 rounded-lg" placeholder="Título del trabajo" />
      <textarea rows="1" oninput="activeConfig.portfolio_section.items[${idx}].description = this.value; renderPreview();" class="w-full bg-slate-950 border border-slate-800 text-slate-300 text-[11px] p-1.5 rounded-lg" placeholder="Descripción breve">${item.description}</textarea>
      <input type="text" value="${(item.images || []).join(', ')}" oninput="activeConfig.portfolio_section.items[${idx}].images = this.value.split(',').map(s => s.trim()); renderPreview();" class="w-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono p-1 rounded" placeholder="Rutas de fotos: /tenant/trabajos/1-1.png, /tenant/trabajos/1-2.png" />
    `;
    container.appendChild(card);
  });
}

function addPortfolioItem() {
  if (!activeConfig.portfolio_section) activeConfig.portfolio_section = { items: [] };
  activeConfig.portfolio_section.items.push({
    id: `trabajo-${Date.now()}`,
    title: "Nuevo Trabajo Realizado",
    description: "Detalle técnico del resultado.",
    category: "Especialidad",
    images: ["/tenant/trabajos/1-1.png"]
  });
  renderPortfolioSection();
  renderPreview();
}

function removePortfolioItem(idx) {
  activeConfig.portfolio_section.items.splice(idx, 1);
  renderPortfolioSection();
  renderPreview();
}

/* =============================================================================
   SUB-COMPONENTES DE LIVE PREVIEW (DOM Synchronization)
   ============================================================================= */

function renderPreview() {
  if (!activeConfig) return;

  // Sincroniza variables CSS en el DOM
  syncThemeWithDOM(activeConfig.theme);

  // 1. Header Preview
  const headerContainer = document.getElementById('preview-header-container');
  headerContainer.innerHTML = `
    <div class="bg-vete-dark p-4 px-6 flex items-center justify-between border-b border-vete-border-subtle/30 shadow-md">
      <div class="flex items-center gap-3">
        <img src="${activeConfig.branding?.logo_url || './assets/logo.png'}" class="w-10 h-10 object-contain rounded-lg" onerror="this.src='./assets/producto_no_disponible.png'" />
        <span class="font-black text-vete-text-base text-sm uppercase tracking-tight">${activeConfig.business_name}</span>
      </div>
      <div class="flex items-center gap-4 text-xs font-bold text-vete-text-base">
        ${activeConfig.features?.has_products ? '<span>Tienda</span>' : ''}
        ${activeConfig.features?.has_services ? '<span>Servicios</span>' : ''}
        ${activeConfig.features?.has_portfolio ? '<span>Trabajos</span>' : ''}
        ${activeConfig.features?.has_locations ? '<span>Local</span>' : ''}
        ${activeConfig.features?.has_cart ? '<span class="p-2 bg-vete-primary text-white rounded-full">🛒</span>' : ''}
      </div>
    </div>
  `;

  // 2. Hero Preview
  const heroContainer = document.getElementById('preview-hero-container');
  heroContainer.innerHTML = `
    <div class="bg-vete-secondary/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-3 max-w-md">
        <h2 class="text-2xl font-black text-vete-text-base leading-tight">${activeConfig.hero?.title_html || 'Título Portada'}</h2>
        <p class="text-xs text-vete-text-muted leading-relaxed">${activeConfig.hero?.description || 'Descripción'}</p>
        <button class="px-5 py-2.5 bg-vete-primary text-white font-bold text-xs rounded-xl shadow-lg hover:bg-vete-primary-hover transition-all">
          Acción Principal
        </button>
      </div>
      <div class="w-44 h-44 bg-vete-surface rounded-2xl p-2 border border-vete-border-subtle shadow-lg shrink-0">
        <img src="./assets/hero.png" class="w-full h-full object-cover rounded-xl" onerror="this.src='./assets/producto_no_disponible.png'" />
      </div>
    </div>
  `;

  // 3. Services Preview
  const servicesContainer = document.getElementById('preview-services-container');
  if (activeConfig.features?.has_services && activeConfig.services_section?.items?.length) {
    servicesContainer.innerHTML = `
      <div class="p-6 bg-vete-dark border-t border-vete-border-subtle/20 space-y-4">
        <h3 class="text-base font-black text-vete-text-base text-center">${activeConfig.services_section.title_html}</h3>
        <div class="grid grid-cols-2 gap-3">
          ${activeConfig.services_section.items.map(s => `
            <div class="p-3 bg-vete-surface rounded-xl border border-vete-border-subtle shadow-sm space-y-1">
              <div class="w-8 h-8 rounded-lg bg-vete-secondary/40 flex items-center justify-center">${ICON_REGISTRY[s.icon_name] || ICON_REGISTRY['Stethoscope']}</div>
              <h4 class="text-xs font-bold text-vete-text-base">${s.title}</h4>
              <p class="text-[10px] text-vete-text-muted leading-relaxed">${s.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    servicesContainer.innerHTML = '';
  }

  // 4. Portfolio Preview
  const portfolioContainer = document.getElementById('preview-portfolio-container');
  if (activeConfig.features?.has_portfolio && activeConfig.portfolio_section?.items?.length) {
    portfolioContainer.innerHTML = `
      <div class="p-6 bg-vete-secondary/20 border-t border-vete-border-subtle/20 space-y-4">
        <h3 class="text-base font-black text-vete-text-base text-center">${activeConfig.portfolio_section.title_html}</h3>
        <div class="grid grid-cols-2 gap-3">
          ${activeConfig.portfolio_section.items.map(p => `
            <div class="bg-vete-surface rounded-2xl overflow-hidden border border-vete-border-subtle shadow-sm flex flex-col justify-between">
              <div class="h-28 bg-slate-800 relative">
                <img src="${p.images?.[0] || './assets/producto_no_disponible.png'}" class="w-full h-full object-cover" onerror="this.src='./assets/producto_no_disponible.png'" />
                <span class="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-[9px] font-bold text-vete-primary rounded-full">${p.category || 'Trabajo'}</span>
              </div>
              <div class="p-3 space-y-1">
                <h4 class="text-xs font-bold text-vete-text-base">${p.title}</h4>
                <p class="text-[10px] text-vete-text-muted">${p.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    portfolioContainer.innerHTML = '';
  }

  // 5. Footer Preview
  const footerContainer = document.getElementById('preview-footer-container');
  footerContainer.innerHTML = `
    <div class="p-6 bg-vete-dark border-t border-vete-border-subtle/30 text-center space-y-2">
      <p class="text-xs font-bold text-vete-text-base uppercase">${activeConfig.business_name}</p>
      <p class="text-[10px] text-vete-text-muted">${activeConfig.contact?.address || ''} | WhatsApp: ${activeConfig.contact?.admin_phone || ''}</p>
      <span class="text-[9px] text-slate-500 block">© ${new Date().getFullYear()} NorthCode SaaS Engine</span>
    </div>
  `;
}

/* =============================================================================
   CARGA, IMPORTACIÓN Y EXPORTACIÓN DE ARCHIVOS
   ============================================================================= */
async function loadConfigFile() {
  const statusEl = document.getElementById('file-status');
  statusEl.textContent = 'Leyendo config.json...';

  try {
    const res = await fetch('./config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    activeConfig = JSON.parse(stripComments(raw));
    statusEl.textContent = `✅ Configuración cargada: [${activeConfig.business_name}]`;
    initSuite();
  } catch (e) {
    statusEl.innerHTML = `<span class="text-amber-400">⚠️ Modo local (sin servidor). Carga o edita manualmente.</span>`;
    initSuite();
  }
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(stripComments(e.target.result));
      activeConfig = parsed;
      document.getElementById('file-status').textContent = `✅ Importado: [${activeConfig.business_name}]`;
      initSuite();
    } catch (err) {
      alert("❌ Error: Archivo JSON inválido o malformado.");
    }
  };
  reader.readAsText(file);
}

function copyGeneratedJSON() {
  navigator.clipboard.writeText(JSON.stringify(activeConfig, null, 2)).then(() => {
    alert("📋 ¡config.json copiado al portapapeles con éxito!");
  });
}

function downloadJSONFile() {
  const blob = new Blob([JSON.stringify(activeConfig, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* =============================================================================
   INICIALIZACIÓN DEL ENTORNO
   ============================================================================= */
function initSuite() {
  renderIdentitySection();
  renderThemeSection();
  renderVariantsFeaturesSection();
  renderHeroSection();
  renderServicesSection();
  renderPortfolioSection();
  renderPreview();
}

window.addEventListener('DOMContentLoaded', loadConfigFile);