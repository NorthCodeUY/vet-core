//apps/web-client/src/types/tenant_types.ts
// <!> Por lo qu eenteido esto es el jeson que traito de clietes/Cliete-puntual/config.json 
// y lo paso a esta estructura de clases vos adesirlo p[orque no entiedo bien y es donde voy a tomr los datos etc
// 


/**
 * Paleta de colores institucionales en formato Hexadecimal (#RRGGBB).
 * 
 * @interface ThemeColors
 * @property {string} primary - Color principal de marca (Botones CTA, enlaces activos).
 * @property {string} primary_hover - Estado hover del botón principal.
 * @property {string} secondary - Color secundario para badges y acentos complementarios.
 * @property {string} tertiary - Color para canales directos (WhatsApp, llamadas).
 * @property {string} dark - Fondo oscuro institucional para header, footer y modales.
 * @property {string} surface - Fondo para tarjetas y áreas de contenido claro.
 * @property {string} soft - Tinte suave con color de marca para chips pasivos.
 * @property {string} overlay - Fondo con oscurecimiento para capas superiores (backdrops).
 * @property {string} text_base - Color tipográfico principal para lectura continua.
 * @property {string} text_muted - Color tipográfico secundario para subtítulos y placeholders.
 * @property {string} border_subtle - Color para bordes suaves y separadores.
 * @property {string} error - Color para cancelaciones y alertas destructivas.
 */
export interface ThemeColors {
  primary: string;
  primary_hover: string;
  secondary: string;
  tertiary: string;
  dark: string;
  surface: string;
  soft: string;
  overlay: string;
  text_base: string;
  text_muted: string;
  border_subtle: string;
  error: string;
}

/**
 * Eslogan segmentado para formato y resaltado de texto dinámico.
 * 
 * @interface SloganConfig
 * @property {string} prefix - Texto previo al resaltado.
 * @property {string} highlight - Frase destacada con color principal.
 * @property {string} suffix - Texto posterior al resaltado.
 */
export interface SloganConfig {
  prefix: string;
  highlight: string;
  suffix: string;
}

/**
 * Rutas estandarizadas de activos multimedia del cliente.
 * 
 * @interface BrandingConfig
 * @property {string} logo_url - Ruta relativa al logo institucional en /tenant/.
 * @property {string} [favicon_url] - Ruta relativa al favicon institucional.
 */
export interface BrandingConfig {
  logo_url: string;
  favicon_url?: string;
}

/**
 * Variantes visuales activas de la interfaz.
 * 
 * @interface UIVariantsConfig
 * @property {string} header - Identificador de variante de cabecera ('v1' | 'v2' | 'v3').
 * @property {string} footer - Identificador de variante de pie de página ('v1' | 'v2').
 * @property {string} product_card - Identificador de tarjeta de producto ('v1' | 'v2').
 * @property {string} hero - Identificador de portada principal ('v1' | 'v2').
 */
export interface UIVariantsConfig {
  header: string;
  footer: string;
  product_card: string;
  hero: string;
}

/**
 * Banderas booleanas de activación/desactivación de módulos.
 * 
 * @interface FeaturesConfig
 * @property {boolean} has_cart - Habilita el carrito y drawer de pedidos.
 * @property {boolean} has_appointments - Habilita el módulo de reservas.
 * @property {boolean} has_health_plans - Habilita la sección de planes/suscripciones.
 * @property {boolean} has_services - Habilita la sección de servicios ofrecidos.
 * @property {boolean} has_emergency_button - Habilita el botón flotante de urgencias 24h.
 */
export interface FeaturesConfig {
  has_cart: boolean;
  has_appointments: boolean;
  has_health_plans: boolean;
  has_services: boolean;
  has_emergency_button: boolean;
}

/**
 * Contenido de la sección de portada (Hero).
 * 
 * @interface HeroSectionConfig
 * @property {string} title_html - Encabezado enriquecido con soporte de etiquetas HTML.
 * @property {string} description - Bajada explicativa institucional.
 */
export interface HeroSectionConfig {
  title_html: string;
  description: string;
}

/**
 * Ítem individual de servicio.
 * 
 * @interface ServiceItem
 * @property {string} id - Identificador único del servicio.
 * @property {string} title - Nombre del servicio.
 * @property {string} description - Detalle y alcance del procedimiento.
 * @property {string} icon_name - Nombre del icono de Lucide a renderizar.
 */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  // <!> Esto no se si esta vien pero bueno lo purebo y voy bienod 
  // Lo que me generia ruido mentarl es que yo lo que ise en el codiog en la 
  // tarjeta es importe un icono y lo seleccione con los dtaos del jeson como 
  // ago aca tnedria que en proyecto tener todos los icons que he seleccionado 
  // de todos lso carrito y en esta seccion meterlo o simpre trabajar con un
  //  svg para que eso sea estandar no se tengo que ver 
  icon_name: string; 
}

/**
 * Módulo de servicios ofrecidos.
 * 
 * @interface ServicesSectionConfig
 * @property {string} title_html - Título con soporte de etiquetas HTML.
 * @property {string} description - Resumen explicativo de los servicios.
 * @property {ServiceItem[]} items - Lista de servicios disponibles.
 */
export interface ServicesSectionConfig {
  title_html: string;
  description: string;
  items: ServiceItem[];
}

/**
 * Sección institucional estructurada (Misión, Visión, Valores).
 * 
 * @interface InstitutionalSectionItem
 * @property {string} id - Identificador único de la sección.
 * @property {string} title - Título del bloque.
 * @property {string} image_url - Ruta de la imagen ilustrativa en /tenant/.
 * @property {boolean} reversed - Invierte la posición de la imagen y el texto.
 * @property {string} content_html - Texto enriquecido con soporte HTML.
 */
export interface InstitutionalSectionItem {
  id: string;
  title: string;
  image_url: string;
  reversed: boolean;
  content_html: string;
}

/**
 * Configuración institucional completa.
 * 
 * @interface InstitutionalConfig
 * @property {InstitutionalSectionItem[]} sections - Listado de bloques informativos.
 */
export interface InstitutionalConfig {
  sections: InstitutionalSectionItem[];
}

/**
 * Ítem de plan o paquete promocional.
 * 
 * @interface PlanItem
 * @property {string} id - Identificador único del plan.
 * @property {string} title - Título comercial del plan.
 * @property {string} description - Resumen de cobertura.
 * @property {string[]} benefits - Lista de ítems o ventajas incluidas.
 * @property {boolean} is_featured - Destaca la tarjeta visualmente como más elegida.
 * @property {string} whatsapp_message - Mensaje predefinido para consulta por WhatsApp.
 */
export interface PlanItem {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  is_featured: boolean;
  whatsapp_message: string;
}

/**
 * Configuración de la sección de planes de salud o suscripciones.
 * 
 * @interface PlansSectionConfig
 * @property {string} title_html - Título principal con soporte de etiquetas HTML.
 * @property {string} description - Texto secundario o bajada.
 * @property {PlanItem[]} items - Lista de planes a renderizar.
 */
export interface PlansSectionConfig {
  title_html: string;
  description: string;
  items: PlanItem[];
}

/**
 * Horarios de apertura comercial.
 * 
 * @interface ScheduleConfig
 * @property {string} weekdays - Horarios de lunes a viernes o sábados.
 * @property {string} [saturdays] - Horarios específicos de sábados.
 */
export interface ScheduleConfig {
  weekdays: string;
  saturdays?: string;
}

/**
 * Canales de comunicación y geolocalización.
 * 
 * @interface ContactConfig
 * @property {string} admin_phone - Teléfono principal de recepción de pedidos.
 * @property {string} [emergency_phone] - Teléfono para urgencias 24h.
 * @property {string} whatsapp_country_code - Código de país sin signo '+' (ej: '598').
 * @property {string} email - Correo corporativo.
 * @property {string} address - Dirección física del local.
 * @property {string} google_maps_url - Enlace directo al mapa de Google Maps.
 * @property {ScheduleConfig} [schedule] - Horarios de atención.
 * @property {Record<string, string>} [social_networks] - Enlaces a redes sociales.
 */
export interface ContactConfig {
  admin_phone: string;
  emergency_phone?: string;
  whatsapp_country_code: string;
  email: string;
  address: string;
  google_maps_url: string;
  schedule?: ScheduleConfig;
  social_networks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

/**
 * Datos de cuenta bancaria institucional para liquidación por transferencia.
 * 
 * @interface BankAccountItem
 * @property {string} bank_name - Entidad bancaria o billetera digital (ej: 'PREX', 'BROU').
 * @property {string} currency - Moneda de la cuenta (ej: 'UYU', 'USD').
 * @property {string} account_number - Número de cuenta de destino.
 * @property {string} beneficiary - Nombre del titular registrado.
 */
export interface BankAccountItem {
  bank_name: string;
  currency: string;
  account_number: string;
  beneficiary: string;
}

/**
 * Banderas de métodos de pago activos en el checkout.
 * 
 * @interface PaymentMethodsConfig
 * @property {boolean} efectivo - Pago en mano al recibir.
 * @property {boolean} transferencia - Pago por transferencia bancaria.
 * @property {boolean} tarjeta - Pago con tarjeta débito/crédito en el delivery (POS).
 * @property {boolean} mercadopago - Pago digital vía link o código QR.
 */
export interface PaymentMethodsConfig {
  efectivo: boolean;
  transferencia: boolean;
  tarjeta: boolean;
  mercadopago: boolean;
}

/**
 * Textos para la construcción del mensaje de WhatsApp.
 * 
 * @interface CustomMessagesConfig
 * @property {string} whatsapp_order_prefix - Encabezado del mensaje.
 * @property {string} cash_payment_note - Instrucción para pago en efectivo.
 * @property {string} pos_payment_note - Instrucción para pago con tarjeta en puerta.
 * @property {string} transfer_note - Instrucción de transferencia bancaria.
 */
export interface CustomMessagesConfig {
  whatsapp_order_prefix: string;
  cash_payment_note: string;
  pos_payment_note: string;
  transfer_note: string;
}

/**
 * Textos de la sección de ubicación y mapa.
 * 
 * @interface LocationSectionConfig
 * @property {string} title_html - Título con soporte HTML.
 * @property {string} description_html - Bajada explicativa enriquecida.
 */
export interface LocationSectionConfig {
  title_html: string;
  description_html: string;
}

/**
 * Estructura raíz completa del archivo `client_info.json`.
 * 
 * @interface TenantConfig
 */
export interface TenantConfig {
  _version: string;
  id: string;
  business_name: string;
  slogan: SloganConfig;
  theme: ThemeColors;
  branding: BrandingConfig;
  ui_variants: UIVariantsConfig;
  features: FeaturesConfig;
  hero: HeroSectionConfig;
  services_section: ServicesSectionConfig;
  institutional: InstitutionalConfig;
  plans_section: PlansSectionConfig;
  contact: ContactConfig;
  bank_accounts: BankAccountItem[];
  payment_methods: PaymentMethodsConfig;
  custom_messages: CustomMessagesConfig;
  location_section: LocationSectionConfig;
}