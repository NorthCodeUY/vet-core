// apps/web-client/scripts/switch-tenant.js
// <!> Esto supuestemete sirve para cambiar de cliete y de carrito simpre y cuado este la estrucutra cargada en el directoiro cliete
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 1. Capturar el nombre del cliente por parámetro (ej: npm run dev:tenant valeria) */
const tenantName = process.argv[2] || '_template';

/* 2. Definir rutas de origen y destino */
const rootClientsDir = path.resolve(__dirname, '../../../clients');
const clientSourceDir = path.join(rootClientsDir, tenantName);
const publicConfigDir = path.resolve(__dirname, '../public/config');
const publicTenantDir = path.resolve(__dirname, '../public/tenant');

/* 3. Validación de existencia del cliente */
if (!fs.existsSync(clientSourceDir)) {
  console.error(`\n❌ ERROR: No se encontró la carpeta del cliente: "${tenantName}"`);
  console.log(`📁 Buscado en: ${clientSourceDir}`);
  console.log('\nClientes disponibles:');
  
  if (fs.existsSync(rootClientsDir)) {
    const available = fs.readdirSync(rootClientsDir).filter(f => fs.statSync(path.join(rootClientsDir, f)).isDirectory());
    available.forEach(c => console.log(` - ${c}`));
  }
  process.exit(1);
}

/* 4. Asegurar que las carpetas de destino existen en /public */
fs.mkdirSync(publicConfigDir, { recursive: true });
fs.mkdirSync(publicTenantDir, { recursive: true });

/* 5. Copiar config.json */
const sourceConfigFile = path.join(clientSourceDir, 'config.json');
const destConfigFile = path.join(publicConfigDir, 'client_info.json');

if (fs.existsSync(sourceConfigFile)) {
  fs.copyFileSync(sourceConfigFile, destConfigFile);
} else {
  console.warn(`⚠️ Advertencia: No se encontró "config.json" para ${tenantName}`);
}

/* 6. Copiar assets multimedia (logo, favicon, banners) */
const sourceAssetsDir = path.join(clientSourceDir, 'assets');

if (fs.existsSync(sourceAssetsDir)) {
  fs.cpSync(sourceAssetsDir, publicTenantDir, { recursive: true });
} else {
  console.warn(`⚠️ Advertencia: No se encontró carpeta "assets" para ${tenantName}`);
}

console.log(`\n✅ Tenant [${tenantName}] sincronizado correctamente en /public\n`);