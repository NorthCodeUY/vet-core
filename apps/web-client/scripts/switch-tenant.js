/**
 * @file switch-tenant.js
 * @description Orquestador de Sincronización de Identidad y Assets para Entorno de Desarrollo Multi-tenant.
 * 
 * Este script automatiza la inyección en caliente de la configuración institucional y activos multimedia:
 * 1. Valida la existencia del cliente en `/clients/<tenantName>`.
 * 2. Limpia el directorio `/public/tenant/` para evitar contaminación cruzada de imágenes entre clientes.
 * 3. Copia el archivo `config.json` hacia `/public/config/client_info.json`.
 * 4. Copia los activos multimedia desde `/clients/<tenantName>/assets/` hacia `/public/tenant/`.
 * 
 * @module Scripts/SwitchTenant
 * @author Ary Giménez <NorthCode>
 * 
 * @example
 * // Sincroniza los datos de Veterinaria Valeria:
 * node scripts/switch-tenant.js valeria
 * 
 * // Sincroniza la plantilla por defecto:
 * node scripts/switch-tenant.js _template
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* =============================================================================
   CONFIGURACIÓN DE RUTAS Y CONSTANTES
   ============================================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Nombre del cliente solicitado por argumento de consola.
 * Si no se provee ningún parámetro, toma '_template' como valor por defecto.
 * @constant {string}
 */
const TENANT_NAME = process.argv[2] || '_template';

/**
 * Rutas absolutas del sistema de archivos.
 * @constant {Object}
 */
const PATHS = {
  /** Directorio raíz donde residen todas las carpetas de clientes */
  rootClients: path.resolve(__dirname, '../../../clients'),
  /** Directorio específico del cliente de origen */
  clientSource: path.resolve(__dirname, `../../../clients/${TENANT_NAME}`),
  /** Directorio público de destino para el archivo JSON */
  publicConfig: path.resolve(__dirname, '../public/config'),
  /** Directorio público de destino para las imágenes y logos del cliente */
  publicTenant: path.resolve(__dirname, '../public/tenant'),
};

/* =============================================================================
   MÉTODOS AUXILIARES DE SINCRONIZACIÓN
   ============================================================================= */

/**
 * Valida la existencia del directorio del cliente solicitado en `/clients`.
 * Si el cliente no existe, imprime en consola la lista de comercios disponibles y aborta la ejecución.
 * 
 * @function validateTenantExistence
 * @param {string} clientDir - Ruta absoluta del directorio del cliente.
 * @param {string} tenantName - Nombre o slug del cliente a buscar.
 * @returns {void}
 */
const validateTenantExistence = (clientDir, tenantName) => {
  if (!fs.existsSync(clientDir)) {
    console.error(`\n❌ ERROR: No se encontró la carpeta del cliente: "${tenantName}"`);
    console.log(`📁 Ruta buscada: ${clientDir}`);
    console.log('\nClientes disponibles en /clients:');

    if (fs.existsSync(PATHS.rootClients)) {
      const availableClients = fs.readdirSync(PATHS.rootClients).filter((file) => {
        return fs.statSync(path.join(PATHS.rootClients, file)).isDirectory();
      });
      availableClients.forEach((client) => console.log(`  - ${client}`));
    }
    
    process.exit(1);
  }
};

/**
 * Prepara los directorios públicos de destino en `/public`.
 * Limpia el directorio de assets para garantizar que no queden imágenes del cliente anterior.
 * 
 * @function preparePublicDirectories
 * @returns {void}
 */
const preparePublicDirectories = () => {
  /* 1. Asegura la existencia de la carpeta para client_info.json */
  fs.mkdirSync(PATHS.publicConfig, { recursive: true });

  /* 2. Limpieza total de la carpeta /public/tenant para evitar basura de clientes anteriores */
  if (fs.existsSync(PATHS.publicTenant)) {
    fs.rmSync(PATHS.publicTenant, { recursive: true, force: true });
  }

  /* 3. Recrea la carpeta limpia */
  fs.mkdirSync(PATHS.publicTenant, { recursive: true });
};

/**
 * Sincroniza el archivo de configuración JSON del cliente hacia la carpeta pública.
 * 
 * @function syncConfigurationFile
 * @param {string} sourceDir - Directorio del cliente de origen.
 * @param {string} targetDir - Directorio público de destino.
 * @returns {void}
 */
const syncConfigurationFile = (sourceDir, targetDir) => {
  const sourceConfigFile = path.join(sourceDir, 'config.json');
  const targetConfigFile = path.join(targetDir, 'client_info.json');

  if (fs.existsSync(sourceConfigFile)) {
    fs.copyFileSync(sourceConfigFile, targetConfigFile);
  } else {
    console.warn(`⚠️ Advertencia: No se encontró "config.json" en ${sourceDir}`);
  }
};

/**
 * Sincroniza todos los archivos multimedia (logos, favicon, imágenes) hacia `/public/tenant`.
 * 
 * @function syncMediaAssets
 * @param {string} sourceDir - Directorio del cliente de origen.
 * @param {string} targetDir - Directorio público de destino.
 * @returns {void}
 */
const syncMediaAssets = (sourceDir, targetDir) => {
  const sourceAssetsDir = path.join(sourceDir, 'assets');

  if (fs.existsSync(sourceAssetsDir)) {
    fs.cpSync(sourceAssetsDir, targetDir, { recursive: true });
  } else {
    console.warn(`⚠️ Advertencia: No se encontró la carpeta "assets" en ${sourceDir}`);
  }
};

/* =============================================================================
   FUNCIÓN PRINCIPAL DE EJECUCIÓN (Orquestador)
   ============================================================================= */

/**
 * Ejecuta el flujo secuencial de sincronización de tenant.
 * 
 * @function runTenantSwitch
 * @returns {void}
 */
const runTenantSwitch = () => {
  console.log(`\n⏳ Sincronizando entorno para el cliente: [${TENANT_NAME}]...`);

  /* Paso 1: Validar que el cliente exista en /clients */
  validateTenantExistence(PATHS.clientSource, TENANT_NAME);

  /* Paso 2: Limpiar y preparar directorios en /public */
  preparePublicDirectories();

  /* Paso 3: Copiar archivo de configuración JSON */
  syncConfigurationFile(PATHS.clientSource, PATHS.publicConfig);

  /* Paso 4: Copiar imágenes, logos y favicon */
  syncMediaAssets(PATHS.clientSource, PATHS.publicTenant);

  console.log(`✅ Tenant [${TENANT_NAME}] sincronizado con éxito en /public\n`);
};

/* Ejecución del proceso */
runTenantSwitch();