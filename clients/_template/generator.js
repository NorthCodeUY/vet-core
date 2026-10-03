/**
 * @file generator.js
 * @description Motor de gestión de configuración, vista previa en caliente de assets y exportación JSON.
 */

let activeConfig = null;

// Mapa de Iconos SVG disponibles para servicios
const AVAILABLE_ICONS = {
  Stethoscope: `<svg class="w-6 h-6 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  Activity: `<svg class="w-6 h-6 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
  ShieldCheck: `<svg class="w-6 h-6 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
  Tractor: `<svg class="w-6 h-6 text-vete-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
};

/**
 * Elimina comentarios // y /* *\/ de JSON.
 */
function stripJsonComments(str) {
  return str.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, group) => {
    return group ? "" : match;
  });
}

function hexToRgbChannels(hex) {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  const num = parseInt(cleanHex, 16);
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}

function applyThemeToDOM(theme) {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, hexValue]) => {
    const cssVarKey = key.replace('_', '-');
    root.style.setProperty(`--vete-${cssVarKey}`, hexToRgbChannels(hexValue));
  });
}

/**
 * Carga el archivo config.json local.
 */
async function loadConfigFile() {
  const statusEl = document.getElementById('file-status');
  statusEl.textContent = 'Leyendo ./config.json...';

  try {
    const response = await fetch('./config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const rawText = await response.text();
    const clean = stripJsonComments(rawText);
    activeConfig = JSON.parse(clean);

    statusEl.textContent = `✅ Configuración cargada: [${activeConfig.business_name}]`;
    populateForm();
    updateLivePreview();
  } catch (err) {
    statusEl.innerHTML = `<span class="text-amber-400">⚠️ Modo local (file://). Usa un servidor local para leer automático o edita en pantalla.</span>`;
  }
}

/**
 * Rellena los controles del formulario y gestores de imágenes.
 */
function populateForm() {
  if (!activeConfig) return;

  document.getElementById('input-business-name').value = activeConfig.business_name || '';
  document.getElementById('input-hero-title').value = activeConfig.hero?.title_html || '';
  document.getElementById('input-hero-desc').value = activeConfig.hero?.description || '';
  document.getElementById('input-phone').value = activeConfig.contact?.admin_phone || '';
  document.getElementById('input-emergency').value = activeConfig.contact?.emergency_phone || '';

  // 1. Gestor de Imágenes / Assets (Preview + Selector de archivo local)
  renderAssetsManager();

  // 2. Pickers de Colores
  renderThemePickers();

  // 3. Gestor de Servicios con Selección de Icono
  renderServicesManager();

  // 4. Checkboxes de Features
  renderFeaturesCheckboxes();
}

/**
 * Renderiza el gestor visual de assets/ con selector de fotos.
 */
function renderAssetsManager() {
  const container = document.getElementById('assets-manager-container');
  container.innerHTML = '';

  const assetsList = [
    { key: 'logo', label: 'Logo Principal (logo.png)', path: activeConfig.branding?.logo_url || '/tenant/logo.png', previewId: 'preview-logo-img', localFile: './assets/logo.png' },
    { key: 'hero', label: 'Imagen de Portada (hero.png)', path: '/tenant/hero.png', previewId: 'preview-hero-img', localFile: './assets/hero.png' },
    { key: 'mision', label: 'Imagen Misión (mision.png)', path: '/tenant/mision.png', previewId: 'preview-mision-img', localFile: './assets/mision.png' },
  ];

  assetsList.forEach(asset => {
    const card = document.createElement('div');
    card.className = "flex items-center justify-between gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800";
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <img id="thumb-${asset.key}" src="${asset.localFile}" class="w-10 h-10 object-cover rounded-lg border border-slate-800" onerror="this.src='./assets/producto_no_disponible.png'" />
        <div>
          <span class="text-xs font-bold text-white block">${asset.label}</span>
          <span class="text-[10px] text-slate-500 font-mono">${asset.path}</span>
        </div>
      </div>
      <label class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
        Cambiar Foto
        <input type="file" accept="image/*" class="hidden" onchange="handleAssetFileChange(event, '${asset.key}', '${asset.previewId}')" />
      </label>
    `;
    container.appendChild(card);
  });
}

/**
 * Permite cambiar una imagen localmente y verla en tiempo real en la preview.
 */
function handleAssetFileChange(event, key, previewElementId) {
  const file = event.target.files[0];
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  
  // Actualiza miniatura
  const thumb = document.getElementById(`thumb-${key}`);
  if (thumb) thumb.src = objectUrl;

  // Actualiza elemento de previsualización en la web
  const previewImg = document.getElementById(previewElementId);
  if (previewImg) previewImg.src = objectUrl;
}

/**
 * Renderiza los pickers de color.
 */
function renderThemePickers() {
  const container = document.getElementById('theme-controls');
  container.innerHTML = '';

  if (!activeConfig.theme) return;

  Object.entries(activeConfig.theme).forEach(([key, val]) => {
    const row = document.createElement('div');
    row.className = "flex items-center justify-between gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800";
    row.innerHTML = `
      <span class="font-mono text-[11px] text-slate-300">${key}</span>
      <div class="flex items-center gap-2">
        <input type="text" value="${val}" onchange="updateThemeColor('${key}', this.value)" class="w-16 bg-slate-900 border border-slate-700 text-white font-mono text-[10px] p-1 rounded text-center" />
        <input type="color" value="${val}" oninput="updateThemeColor('${key}', this.value)" class="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * Renderiza el gestor de servicios del comercio.
 */
function renderServicesManager() {
  const container = document.getElementById('services-manager-container');
  container.innerHTML = '';

  const services = activeConfig.services_section?.items || [];

  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = "p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2";
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="text-[11px] font-bold text-emerald-400">Servicio #${index + 1}</span>
        <select onchange="updateServiceIcon(${index}, this.value)" class="bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-800">
          <option value="Stethoscope" ${service.icon_name === 'Stethoscope' ? 'selected' : ''}>🩺 Stethoscope</option>
          <option value="Activity" ${service.icon_name === 'Activity' ? 'selected' : ''}>⚡ Activity</option>
          <option value="ShieldCheck" ${service.icon_name === 'ShieldCheck' ? 'selected' : ''}>🛡️ ShieldCheck</option>
          <option value="Tractor" ${service.icon_name === 'Tractor' ? 'selected' : ''}>🚜 Tractor</option>
        </select>
      </div>
      <input type="text" value="${service.title}" oninput="updateServiceTitle(${index}, this.value)" class="w-full bg-slate-900 border border-slate-800 text-white text-xs p-1.5 rounded-lg" placeholder="Título del servicio" />
      <textarea rows="1" oninput="updateServiceDesc(${index}, this.value)" class="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] p-1.5 rounded-lg" placeholder="Descripción">${service.description}</textarea>
    `;
    container.appendChild(card);
  });
}

function updateServiceIcon(index, iconName) {
  if (!activeConfig.services_section?.items[index]) return;
  activeConfig.services_section.items[index].icon_name = iconName;
  updateLivePreview();
}

function updateServiceTitle(index, title) {
  if (!activeConfig.services_section?.items[index]) return;
  activeConfig.services_section.items[index].title = title;
  updateLivePreview();
}

function updateServiceDesc(index, desc) {
  if (!activeConfig.services_section?.items[index]) return;
  activeConfig.services_section.items[index].description = desc;
  updateLivePreview();
}

/**
 * Renderiza los checkboxes de features.
 */
function renderFeaturesCheckboxes() {
  const container = document.getElementById('features-controls');
  container.innerHTML = '';

  if (!activeConfig.features) return;

  Object.entries(activeConfig.features).forEach(([key, isEnabled]) => {
    const label = document.createElement('label');
    label.className = "flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-[11px]";
    label.innerHTML = `
      <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="updateFeature('${key}', this.checked)" class="accent-emerald-500 rounded" />
      <span class="text-slate-300 truncate">${key}</span>
    `;
    container.appendChild(label);
  });
}

/**
 * Actualiza la previsualización en vivo.
 */
function updateLivePreview() {
  if (!activeConfig) return;

  if (activeConfig.theme) applyThemeToDOM(activeConfig.theme);

  document.getElementById('preview-header-title').textContent = activeConfig.business_name || 'MI NEGOCIO';
  document.getElementById('preview-hero-title').innerHTML = activeConfig.hero?.title_html || 'Título Principal';
  document.getElementById('preview-hero-desc').textContent = activeConfig.hero?.description || 'Descripción';

  // Renderizar tarjetas de servicios en la preview
  const previewServicesGrid = document.getElementById('preview-services-grid');
  previewServicesGrid.innerHTML = '';

  const services = activeConfig.services_section?.items || [];
  services.forEach(s => {
    const iconSvg = AVAILABLE_ICONS[s.icon_name] || AVAILABLE_ICONS['Stethoscope'];
    const card = document.createElement('div');
    card.className = "bg-vete-surface p-5 rounded-2xl border border-vete-border-subtle shadow-sm space-y-2";
    card.innerHTML = `
      <div class="w-10 h-10 bg-vete-secondary/30 rounded-xl flex items-center justify-center">${iconSvg}</div>
      <h5 class="text-sm font-bold text-vete-text-base">${s.title}</h5>
      <p class="text-[11px] text-vete-text-muted leading-relaxed">${s.description}</p>
    `;
    previewServicesGrid.appendChild(card);
  });

  // Toggle Carrito
  const cartBadge = document.getElementById('preview-cart-badge');
  cartBadge.style.display = activeConfig.features?.has_cart === false ? 'none' : 'block';
}

function updateField(key, value) {
  if (!activeConfig) return;
  activeConfig[key] = value;
  updateLivePreview();
}

function updateHeroTitle(value) {
  if (!activeConfig) return;
  if (!activeConfig.hero) activeConfig.hero = {};
  activeConfig.hero.title_html = value;
  updateLivePreview();
}

function updateHeroDesc(value) {
  if (!activeConfig) return;
  if (!activeConfig.hero) activeConfig.hero = {};
  activeConfig.hero.description = value;
  updateLivePreview();
}

function updateContactField(key, value) {
  if (!activeConfig) return;
  if (!activeConfig.contact) activeConfig.contact = {};
  activeConfig.contact[key] = value;
  updateLivePreview();
}

function updateThemeColor(key, hex) {
  if (!activeConfig || !activeConfig.theme) return;
  activeConfig.theme[key] = hex;
  renderThemePickers();
  updateLivePreview();
}

function updateFeature(key, checked) {
  if (!activeConfig || !activeConfig.features) return;
  activeConfig.features[key] = checked;
  updateLivePreview();
}

function copyGeneratedJSON() {
  if (!activeConfig) return;
  const str = JSON.stringify(activeConfig, null, 2);
  navigator.clipboard.writeText(str).then(() => {
    alert("📋 ¡config.json copiado al portapapeles con éxito!");
  });
}

function downloadJSONFile() {
  if (!activeConfig) return;
  const str = JSON.stringify(activeConfig, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
}

window.addEventListener('DOMContentLoaded', loadConfigFile);