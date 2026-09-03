// apps/web-client/src/types/tenant.ts

// <!> Los voy a utilizar para tipiar los archivos de configuracion lo 
// que se si cmabian hay que ver qeu pasa si agrego contenido a modificar
//  ppara los diferetes portales es probale que tenga que actualizar esto 

/**
 * Esquema de colores institucionales en formato Hexadecimal (#RRGGBB).
 * 
 * @interface ThemeColors
 * @property {string} primary - Color principal de marca.
 * @property {string} primary_hover - Variante hover de marca.
 * @property {string} secondary - Color secundario para badges y acentos.
 * @property {string} tertiary - Color para WhatsApp y llamadas.
 * @property {string} dark - Fondo oscuro institucional.
 * @property {string} surface - Fondo para tarjetas y contenedores claros.
 * @property {string} soft - Tinte suave con color de marca.
 * @property {string} overlay - Fondo para modales.
 * @property {string} text_base - Color principal para tipografía.
 * @property {string} text_muted - Color para subtítulos y placeholders.
 * @property {string} border_subtle - Color para bordes y separadores.
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
 * Título segmentado para formato y resaltado de texto dinámico.
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
 * Rutas de activos multimedia montados por volumen.
 * 
 * @interface BrandingConfig
 * @property {string} logo_url - Ruta relativa al logo institucional.
 * @property {string} favicon_url - Ruta relativa al favicon.
 */
export interface BrandingConfig {
  logo_url: string;
  favicon_url: string;
}

/**
 * Variantes visuales activas de la interfaz.
 * 
 * @interface UIVariantsConfig
 * @property {string} header - Identificador de variante de cabecera.
 * @property {string} footer - Identificador de variante de pie de página.
 * @property {string} product_card - Identificador de tarjeta de producto.
 */
export interface UIVariantsConfig {
  header: string;
  footer: string;
  product_card: string;
}

/**
 * Textos institucionales para secciones informativas de la empresa.
 * 
 * @interface InstitutionalConfig
 * @property {string} mission - Misión de la empresa.
 * @property {string} vision - Visión a futuro.
 * @property {string} about_us - Reseña histórica o descripción del equipo.
 */
export interface InstitutionalConfig {
  mission: string;
  vision: string;
  about_us: string;
}

/**
 * Canales de comunicación y ubicación geográfica.
 * 
 * @interface ContactConfig
 * @property {string} admin_phone - Teléfono principal de recepción de pedidos.
 * @property {string} emergency_phone - Teléfono para urgencias 24h.
 * @property {string} whatsapp_country_code - Código de país sin signo '+'.
 * @property {string} email - Correo corporativo.
 * @property {string} address - Dirección física del local.
 * @property {string} google_maps_url - Enlace directo a Google Maps.
 * @property {Record<string, string>} [social_networks] - Enlaces a redes sociales.
 */
export interface ContactConfig {
  admin_phone: string;
  emergency_phone?: string;
  whatsapp_country_code: string;
  email: string;
  address: string;
  google_maps_url: string;
  social_networks?: {
    instagram?: string;
    facebook?: string;
  };
}

/**
 * Datos bancarios institucionales para transferencias.
 * 
 * @interface BankInfoConfig
 * @property {string} bank_name - Entidad bancaria.
 * @property {string} account_number - Número de cuenta.
 * @property {string} beneficiary - Titular de la cuenta.
 */
export interface BankInfoConfig {
  bank_name: string;
  account_number: string;
  beneficiary: string;
}

/**
 * Mensajes personalizados para la comunicación por WhatsApp.
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
 * Banderas booleanas para activación o desactivación de módulos.
 * 
 * @interface FeaturesConfig
 * @property {boolean} has_cart - Habilita el carrito de compras.
 * @property {boolean} has_appointments - Habilita el módulo de reservas.
 * @property {boolean} has_health_plans - Habilita la visualización de planes.
 * @property {boolean} has_emergency_button - Habilita el botón flotante de urgencias.
 */
export interface FeaturesConfig {
  has_cart: boolean;
  has_appointments: boolean;
  has_health_plans: boolean;
  has_emergency_button: boolean;
}

/**
 * Estructura raíz de configuración del cliente.
 * 
 * @interface TenantConfig
 */
export interface TenantConfig {
  id: string;
  business_name: string;
  slogan: SloganConfig;
  theme: ThemeColors;
  branding: BrandingConfig;
  ui_variants: UIVariantsConfig;
  institutional: InstitutionalConfig;
  contact: ContactConfig;
  bank_info: BankInfoConfig;
  custom_messages: CustomMessagesConfig;
  features: FeaturesConfig;
}