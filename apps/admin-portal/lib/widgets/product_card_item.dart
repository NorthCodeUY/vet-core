// apps/admin-portal/lib/widgets/product_card_item.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/config/app_environment.dart';
import 'package:admin_portal/models/product/product.dart';

































<!> ALGO ASI QUIERO QUE QUEDE OVIATE HAY QUE IMPLEMNETRAR EL METODO PARA GENERAR QR EN EL BAKEND DAME EL PROM PARA PASARLE 
PERO ASEMOS LA ESTRUTURA DE NUESTRO LADO 

EL BOTON MODIFICAR EN LA FOTO PARA UN MENU EL MENU TIENE QUE USAR LA CAMAR Y Y LA FOTO ALGO DESPELGABLE Y FACIL SIN MAS OTROS CONTROLES SI QUIERE UNA ESICION COMPLEJA VA A BOTON EDINT
CUADO LA TERJETA ESTA MAS CICOA TENE QUE IR ESCONDIENDOSE ELEMENOTOS Y  PROPONGO USAR EL BOTON DE LOS 3PUNTOS Y QUE SE VAJA ESCONDIENDO 


el boton no disponible qeu pase a un chek como el de alado de la tareta pero que cada uno digan que asoe el no disponble que aparsca epro diga no disponible el no visible  y el encargar eso deberia desir que es lo qaue tengo 

<article class="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col gap-2 relative">
<div class="flex items-start gap-3">
<!-- Thumbnail & Quick Indicator -->
<div class="relative w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0"><img class="w-full h-full object-cover" data-alt="Bolsa médica premium de alimento veterinario Royal Canin Veterinary Diet Renal para caninos sobre un fondo clínico limpio de estudio fotográfico con iluminación suave e institucional" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeo5PtrSKmLIQzJ8n1fL7WslUQ4X1T_nFAqd2v0TjPxi0n69t-S-QuLopNKerUltu-vhEFtae6QdlGqxDXD636RnEFOIBQhUMmcFb_yQ4BVXnlDD76xnCzC6deP4zhFnTLPqy2CskSFOH2YrMR3istfLj9rbQSI0oLMCoVmbYNYjzvsN6bh2Nonymg4OlMPF7_u-WFne7QxmNkNZ7mJjKNnAxbS9JGJQypbPIMt-E"><div class="absolute top-1 left-1 bg-primary/80 backdrop-blur-sm text-on-primary text-[9px] font-bold px-1 rounded z-10">3 VAR</div><button aria-label="Foto anterior" class="absolute left-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/70 hover:bg-primary text-on-primary rounded-full flex items-center justify-center cursor-pointer shadow-sm z-10" type="button"><span class="material-symbols-outlined text-[10px]">chevron_left</span></button><button aria-label="Foto siguiente" class="absolute right-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/70 hover:bg-primary text-on-primary rounded-full flex items-center justify-center cursor-pointer shadow-sm z-10" type="button"><span class="material-symbols-outlined text-[10px]">chevron_right</span></button><div class="absolute bottom-1 inset-x-0 flex items-center justify-center gap-0.5 z-10"><span class="w-1.5 h-1.5 rounded-full bg-surface-container-lowest shadow-sm"></span><span class="w-1 h-1 rounded-full bg-surface-container-lowest/60"></span><span class="w-1 h-1 rounded-full bg-surface-container-lowest/60"></span></div><button type="button" aria-label="Cambiar foto" title="Cambiar foto" class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-primary/80 hover:bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow-sm z-10 transition-transform active:scale-90"><span class="material-symbols-outlined text-[12px]">photo_camera</span></button></div>
<!-- Meta Information -->
<div class="flex-1 min-w-0 flex flex-col">
<div class="flex items-center justify-between gap-1"><div class="flex items-center gap-1 min-w-0 flex-wrap"><span class="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider truncate">Nutrición Clínica</span><span class="text-on-surface-variant text-[12px]">›</span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium truncate">Dietas Terapéuticas Caninas</span></div><label class="relative inline-flex items-center cursor-pointer flex-shrink-0" title="Visible en Vitrina"><input checked="" class="sr-only peer" type="checkbox"><div class="w-8 h-4.5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-secondary"></div></label></div>
<h3 class="font-label-lg text-label-lg text-on-surface font-semibold truncate leading-tight mt-0.5">Alimento Royal Vet Renal Support</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant truncate">SKU: VET-REN-09 • EAN: 779012345671</p><div class="mt-1 flex items-center"><a href="#" data-path="cajas-empaque" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors active:scale-95"><span class="material-symbols-outlined text-[14px] text-secondary">package_2</span><span>Caja #04 (Depósito Central)</span><span class="material-symbols-outlined text-[13px] text-on-surface-variant">chevron_right</span></a></div>
<!-- Variant Chips Stack -->
<div class="flex items-center gap-1 mt-1.5 flex-wrap"><span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">3kg • $22.800</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">7.5kg • $48.500</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">15kg • $84.200</span></div>
</div>
</div>
<!-- Financial & Stock Ledger Row -->

<!-- Administrative Quick Action Bar -->
<div class="flex items-center justify-between pt-1 gap-2">

<div class="flex items-center gap-1.5 flex-wrap"><button class="h-8 px-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center gap-1 font-semibold shadow-sm active:bg-secondary active:text-on-secondary transition-colors" type="button" title="Estado de disponibilidad (tocar para alternar)"><span class="material-symbols-outlined text-[16px] text-secondary">check_circle</span><span>Disponible</span></button><button class="h-8 px-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 hover:bg-surface-container-high active:scale-95 transition-all shadow-sm" type="button" title="Generar código QR para estante o digital"><span class="material-symbols-outlined text-[16px]">qr_code_2</span><span>Generar QR</span></button><button class="h-8 px-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1 active:bg-surface-tint transition-colors" type="button"><span class="material-symbols-outlined text-[16px]">edit</span><span>Editar</span></button><button class="h-8 px-2 rounded-lg bg-error-container text-error font-label-md text-label-md flex items-center gap-1 active:bg-error active:text-on-error transition-colors" type="button" title="Eliminar producto"><span class="material-symbols-outlined text-[16px]">delete</span><span>Eliminar</span></button></div>
</div>
</article>
*/


 a ademas me encantaria que aya algo par previsualizr 
 yo tengo en 





/* --- apps/web-client/src/components/ProductCard/ProductCardV2.tsx --- */
 como se ve en react si se puede traerlo a fluter y que swe vea igual ideal oviamte ambos contendores corren a al ves por si tiene que se compliado en react si o lo que sea mas facil 



 ary@ThinkPad-L390  ~/Documentos/proyect/app/vet-core/apps/admin-portal  ↱ main ±  bash run_admin.sh veterinaria web-server
============================================================
🚀 [VETCORE SAAS] - INICIANDO PORTAL ADMINISTRATIVO
🏢 Tenant Activo  : veterinaria
📄 Config Admin   : ../../clients/veterinariabeltrameli/config_admin.json
🌐 Backend Port   : 8001
🖥️  Target Device  : web-server
============================================================
  ➜  Local  : http://localhost:5050/
  ➜  Network: http://192.168.1.10:5050/
  ➜  Network: http://10.252.1.1:5050/
  ➜  Network: http://172.18.0.1:5050/
  ➜  Network: http://172.17.0.1:5050/
  ➜  Network: http://172.19.0.1:5050/
  ➜  Network: http://2800:a4:220:5600:9e61:991b:21a6:4fde:5050/
  ➜  Network: http://2800:a4:220:5600:e8d6:a239:beae:5ccc:5050/
============================================================
Launching lib/main.dart on Web Server in debug mode...
Waiting for connection from debug service on Web Server...         44,1s
lib/main.dart is being served at http://0.0.0.0:5050
The web-server device requires the Dart Debug Chrome extension for debugging. Consider using the
Chrome or Edge devices for an improved development workflow.

Flutter run key commands.
r Hot reload. 🔥🔥🔥
R Hot restart.
h List all available interactive commands.
d Detach (terminate "flutter run" but leave application running).
c Clear the screen
q Quit (terminate the application on the device).

Debug service listening on ws://127.0.0.1:35079/h1rBUCuIPuA=/ws
A Dart VM Service on Web Server is available at: http://127.0.0.1:35079/h1rBUCuIPuA=
The Flutter DevTools debugger and profiler on Web Server is available at:
http://127.0.0.1:35079/h1rBUCuIPuA=/devtools/?uri=ws://127.0.0.1:35079/h1rBUCuIPuA=/ws
 ary@ThinkPad-L390  ~/Documentos/proyect/app/vet-core/apps/admin-portal  ↱ main ±  >....                                                     
  lib/config/app_theme.dart \ 
  assets/tenant/config.json; do
  echo "========== $f =========="
  cat "$f"
  echo ""
done
========== lib/config/app_colors.dart ==========
// apps/admin-portal/lib/config/app_colors.dart

import 'package:flutter/material.dart';

/// Paleta de colores base y tokens semánticos del sistema VetCore.
///
/// Sirve como referencia estática para valores por defecto (fallback)
/// y provee utilidades para extraer colores contextuales inyectados por el tenant.
abstract final class AppColors {
  // ===========================================================================
  // 1. VALORES POR DEFECTO (FALLBACKS RESILIENTES)
  // ===========================================================================
  static const Color primary = Color(0xFF275D9E);
  static const Color primaryHover = Color(0xFF1E4B82);
  static const Color secondary = Color(0xFFDAEBD4);
  static const Color tertiary = Color(0xFF1FAF38); // WhatsApp / Canales directos

  // Fondos y Superficies
  static const Color dark = Color(0xFF004D40);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color soft = Color(0xFFDBECD5);
  static const Color overlay = Color(0x80000000); // 50% de opacidad

  // Tipografía y Jerarquía
  static const Color textBase = Color(0xFF0B1C30);
  static const Color textMuted = Color(0xFF64748B);

  // Bordes y Estados
  static const Color borderSubtle = Color(0xFFE2E8F0);
  static const Color error = Color(0xFFDC2626);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color success = Color(0xFF006C4A);
  static const Color warning = Color(0xFFFFB95F);
  static const Color background = Color(0xFFF8FAFC);
  

  // ===========================================================================
  // 2. RESOLUCIÓN DINÁMICA POR CONTEXTO (ZERO HARDCODING)
  // ===========================================================================
  /// Resuelve el color primario del tenant montado en el BuildContext actual.
  static Color ofPrimary(BuildContext context) =>
      Theme.of(context).colorScheme.primary;

  /// Resuelve el color secundario del tenant montado en el BuildContext actual.
  static Color ofSecondary(BuildContext context) =>
      Theme.of(context).colorScheme.secondary;

  /// Resuelve la superficie neutra del tenant actual.
  static Color ofSurface(BuildContext context) =>
      Theme.of(context).colorScheme.surface;

  /// Resuelve el color de error semántico del tenant actual.
  static Color ofError(BuildContext context) =>
      Theme.of(context).colorScheme.error;
}
========== lib/config/app_theme.dart ==========
// apps/admin-portal/lib/config/app_theme.dart


import 'package:flutter/material.dart'; // Importa la librería principal de Flutter para usar Material Design
import 'app_colors.dart'; // Importa el archivo que contiene los colores definidos en la app

/// Clase que define el tema general de la aplicación.
/// Configura colores, estilos de botones, campos de texto, etc.
class AppTheme {
  // Método getter para obtener el tema claro de la aplicación (lightTheme)
  
  static ThemeData get lightTheme {
    return ThemeData(
      // Define el color principal para la aplicación, que se usará en elementos como el AppBar, botones, etc.
      primaryColor: const Color.fromARGB(157, 152, 109, 53),

      // Establece el color de fondo de la pantalla principal (scaffold) en la aplicación
      scaffoldBackgroundColor: AppColors.background,

      // Tema personalizado para el widget ElevatedButton (botones elevados)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          // Establece el color de fondo del ElevatedButton usando el color primario de la app
          backgroundColor: const Color.fromARGB(255, 152, 109, 53),

          // Define el color del texto del botón como blanco
          foregroundColor: Colors.white,

          // Establece el tamaño mínimo del botón (ancho infinito y altura de 50 píxeles)
          minimumSize: const Size(double.infinity, 50),

          // Define la forma del botón, especificando bordes redondeados
          shape: RoundedRectangleBorder(
            // Aplica un redondeo de 8 píxeles a los bordes del botón
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),

      // Tema para la decoración de los campos de texto (InputDecoration)
      inputDecorationTheme: InputDecorationTheme(
        // Habilita el relleno de los campos de texto
        filled: true,

        // Define el color de fondo de los campos de texto como blanco
        fillColor: Colors.white,

        // Establece el borde del campo de texto cuando no está enfocado
        border: OutlineInputBorder(
          // Aplica bordes redondeados con un radio de 8 píxeles
          borderRadius: BorderRadius.circular(8),

          // Define el color del borde como el color primario de la app
          borderSide: const BorderSide(color: AppColors.primary),
        ),

        // Establece el borde del campo de texto cuando está habilitado
        enabledBorder: OutlineInputBorder(
          // Aplica bordes redondeados con un radio de 8 píxeles
          borderRadius: BorderRadius.circular(8),

          // Define el color del borde con una opacidad del 50% sobre el color primario
          // ignore: deprecated_member_use
          borderSide: BorderSide(color: AppColors.primary.withOpacity(0.5)),
        ),

        // Establece el borde cuando el campo de texto está enfocado (activo)
        focusedBorder: OutlineInputBorder(
          // Aplica bordes redondeados con un radio de 8 píxeles
          borderRadius: BorderRadius.circular(8),

          // Define el color del borde como el color primario, con un grosor de 2 píxeles
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),

        // Establece el borde cuando hay un error en el campo de texto
        errorBorder: OutlineInputBorder(
          // Aplica bordes redondeados con un radio de 8 píxeles
          borderRadius: BorderRadius.circular(8),

          // Define el color del borde como el color de error de la app
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
    );
  }
}

========== assets/tenant/config.json ==========
{
  "_version": "1.0.0",
  "tenant_id": "valeria_beltramelli",
  "business_name": "Veterinaria Beltramelli - Panel de Control",
  "business_type": "veterinary",
  "theme": {
    "primary": "#275D9E",
    "secondary": "#daebd4",
    "dark": "#004D40",
    "surface": "#FFFFFF",
    "error": "#DC2626"
  },
  "admin_modules": {
    "has_products_catalog": true,
    "has_medical_records": true,
    "has_appointments_agenda": true,
    "has_orders_monitoring": true,
    "has_business_settings": true
  },
  "product_schema": {
    "supports_variants": false,
    "requires_brand": true,
    "requires_stock": true,
    "requires_images": true,
    "max_images_per_product": 5
  }
}

 ary@ThinkPad-L390  ~/Documentos/proyect/app/vet-core/apps/admin-portal  ↱ main ±  


































/// Componente visual atómico que representa una tarjeta de producto en el catálogo.
///
/// Implementa:
/// 1. Mini-carrusel de imágenes con soporte multi-foto, fallback y badge de variantes.
/// 2. Taxonomía segmentada (`Categoría`), metadatos de identificación y switch de vitrina.
/// 3. Chips de variantes con precios directos por presentación.
/// 4. Barra de acciones rápidas: Pausar/Disponibilidad, Editar y Eliminar (Baja lógica).
class ProductCardItem extends StatelessWidget {
  /// Entidad inmutable del producto a representar.
  final Product product;

  /// Callback ejecutado al conmutar el switch de vitrina web pública.
  final ValueChanged<bool> onToggleShowcase;

  /// Callback para alternar disponibilidad operativa (Pausar/Reanudar venta).
  final VoidCallback onToggleAvailability;

  /// Callback para abrir el formulario de edición de este producto.
  final VoidCallback onEdit;

  /// Callback para solicitar la baja lógica del producto en FastAPI.
  final VoidCallback onDelete;

  const ProductCardItem({
    super.key,
    required this.product,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isInactive = !product.isVisibleInShowcase;

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 200),
      // Atenúa la tarjeta al 65% cuando el producto está oculto de la vitrina pública
      opacity: isInactive ? 0.65 : 1.0,
      child: Card(
        elevation: 0,
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: colorScheme.outlineVariant.withValues(alpha: 0.3),
          ),
        ),
        color: colorScheme.surfaceContainerLowest,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ===============================================================
              // 1. FILA PRINCIPAL: CARRUSEL MULTIMEDIA + INFORMACIÓN DESCRIPTIVA
              // ===============================================================
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Mini-carrusel de fotos con resolución segura de URLs
                  _ProductThumbnailCarousel(
                    images: product.images,
                    variantsCount: product.variants.length,
                    // <!> FIX SOUND NULL SAFETY: Garantiza string no nulo
                    fallbackUrl: product.primaryImageUrl ?? '',
                  ),
                  const SizedBox(width: 12),

                  // Metadatos descriptivos, categoría, switch y variantes
                  Expanded(
                    child: _ProductMetaInfo(
                      product: product,
                      onToggleShowcase: onToggleShowcase,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // ===============================================================
              // 2. BARRA DE ACCIONES ADMINISTRATIVAS RÁPIDAS
              // ===============================================================
              _ProductActionBar(
                isAvailable: product.isAvailable,
                onToggleAvailability: onToggleAvailability,
                onEdit: onEdit,
                onDelete: onDelete,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 1: MINI-CARRUSEL INTERACTIVO DE FOTOS (WIDGET PRIVADO)
// =============================================================================
class _ProductThumbnailCarousel extends StatefulWidget {
  final List<ProductImage> images;
  final int variantsCount;
  final String? fallbackUrl;

  const _ProductThumbnailCarousel({
    required this.images,
    required this.variantsCount,
    this.fallbackUrl,
  });

  @override
  State<_ProductThumbnailCarousel> createState() =>
      _ProductThumbnailCarouselState();
}

class _ProductThumbnailCarouselState extends State<_ProductThumbnailCarousel> {
  int _currentIndex = 0;

  @override
  void didUpdateWidget(covariant _ProductThumbnailCarousel oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Previene RangeError si la lista de imágenes cambia dinámicamente
    final total = _resolvedUrls.length;
    if (total == 0 || _currentIndex >= total) {
      _currentIndex = 0;
    }
  }

  /// Retorna la lista de URLs normalizadas listas para Image.network.
  List<String> get _resolvedUrls {
    if (widget.images.isNotEmpty) {
      final sorted = List<ProductImage>.from(widget.images)
        ..sort((a, b) => (b.isFeatured ? 1 : 0).compareTo(a.isFeatured ? 1 : 0));
      return sorted
          .map((img) => AppEnvironment.resolveMediaUrl(img.url))
          .where((url) => url.isNotEmpty)
          .toList();
    }
    if (widget.fallbackUrl != null && widget.fallbackUrl!.isNotEmpty) {
      final fallback = AppEnvironment.resolveMediaUrl(widget.fallbackUrl!);
      if (fallback.isNotEmpty) return [fallback];
    }
    return const [];
  }

  void _nextImage(int total) {
    setState(() => _currentIndex = (_currentIndex + 1) % total);
  }

  void _prevImage(int total) {
    setState(() => _currentIndex = (_currentIndex - 1 + total) % total);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final urls = _resolvedUrls;
    final total = urls.length;
    final bool hasValidImages = urls.isNotEmpty && urls.first.isNotEmpty;

    return SizedBox(
      width: 76,
      height: 76,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // 1. Imagen del producto o Placeholder médico si no tiene fotos
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: hasValidImages
                  ? Image.network(
                      urls[_currentIndex],
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildPlaceholder(colorScheme),
                    )
                  : _buildPlaceholder(colorScheme),
            ),
          ),

          // 2. Badge de Variantes: '3 VAR'
          if (widget.variantsCount > 0)
            Positioned(
              top: 3,
              left: 3,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1.5),
                decoration: BoxDecoration(
                  color: colorScheme.scrim.withValues(alpha: 0.75),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '${widget.variantsCount} VAR',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

          // 3. Flechas de navegación (solo si hay más de una imagen)
          if (total > 1) ...[
            Positioned(
              left: 2,
              top: 0,
              bottom: 0,
              child: Center(
                child: InkWell(
                  onTap: () => _prevImage(total),
                  child: Container(
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      color: colorScheme.scrim.withValues(alpha: 0.6),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chevron_left, size: 12, color: Colors.white),
                  ),
                ),
              ),
            ),
            Positioned(
              right: 2,
              top: 0,
              bottom: 0,
              child: Center(
                child: InkWell(
                  onTap: () => _nextImage(total),
                  child: Container(
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      color: colorScheme.scrim.withValues(alpha: 0.6),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.chevron_right, size: 12, color: Colors.white),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  /// Placeholder neutro cuando no hay fotos cargadas en el backend
  Widget _buildPlaceholder(ColorScheme colorScheme) {
    return Container(
      color: colorScheme.surfaceContainerHigh,
      child: Center(
        child: Icon(
          Icons.medication_outlined,
          size: 28,
          color: colorScheme.outline.withValues(alpha: 0.7),
        ),
      ),
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 2: INFORMACIÓN, SWITCH Y VARIANTES (WIDGET PRIVADO)
// =============================================================================
class _ProductMetaInfo extends StatelessWidget {
  final Product product;
  final ValueChanged<bool> onToggleShowcase;

  const _ProductMetaInfo({
    required this.product,
    required this.onToggleShowcase,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final categoryName = product.category?.name ?? 'General';
    final skuText = product.barcode != null && product.barcode!.isNotEmpty
        ? 'EAN: ${product.barcode}'
        : 'ID: #${product.id}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Fila 1: Taxonomía y Switch de Vitrina
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: colorScheme.secondaryContainer,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      categoryName.toUpperCase(),
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSecondaryContainer,
                        fontWeight: FontWeight.bold,
                        fontSize: 9,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Switch compacto de vitrina
            Transform.scale(
              scale: 0.75,
              child: Switch(
                value: product.isVisibleInShowcase,
                onChanged: onToggleShowcase,
              ),
            ),
          ],
        ),

        // Fila 2: Nombre comercial
        Text(
          product.name,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w700,
            height: 1.2,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 2),

        // Fila 3: Código de barras o ID
        Text(
          skuText,
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
            fontSize: 10,
          ),
        ),
        const SizedBox(height: 6),

        // Fila 4: Chips de Variantes con Precio Directo o Precio Base
        if (product.variants.isNotEmpty)
          Wrap(
            spacing: 4,
            runSpacing: 4,
            children: product.variants.map((variant) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${variant.name} • \$${variant.salePrice.toStringAsFixed(0)}',
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
              );
            }).toList(),
          )
        else
          Text(
            '\$ ${product.salePrice.toStringAsFixed(0)}',
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: colorScheme.primary,
            ),
          ),
      ],
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 3: BARRA DE ACCIONES RÁPIDAS (WIDGET PRIVADO)
// =============================================================================
class _ProductActionBar extends StatelessWidget {
  final bool isAvailable;
  final VoidCallback onToggleAvailability;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _ProductActionBar({
    required this.isAvailable,
    required this.onToggleAvailability,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Wrap(
      alignment: WrapAlignment.end,
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 6,
      runSpacing: 6,
      children: [
        // 1. Botón: Marcar No disponible / Pausar
        _ActionButton(
          label: isAvailable ? 'No disponible' : 'Disponible',
          icon: isAvailable
              ? Icons.pause_circle_outline
              : Icons.play_circle_outline,
          backgroundColor: colorScheme.surfaceContainerHigh,
          foregroundColor: colorScheme.onSurfaceVariant,
          tooltip: isAvailable
              ? 'Pausar compra del producto'
              : 'Reanudar disponibilidad',
          onPressed: onToggleAvailability,
        ),

        // 2. Botón: Editar (Abre product_form_handler.dart)
        _ActionButton(
          label: 'Editar',
          icon: Icons.edit_outlined,
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          tooltip: 'Editar detalles y stock del producto',
          onPressed: onEdit,
        ),

        // 3. Botón: Eliminar / Baja lógica
        _ActionButton(
          label: 'Eliminar',
          icon: Icons.delete_outline,
          backgroundColor: colorScheme.errorContainer,
          foregroundColor: colorScheme.error,
          tooltip: 'Dar de baja del catálogo (baja lógica)',
          onPressed: onDelete,
        ),
      ],
    );
  }
}

/// Botón estilizado reutilizable para la barra de acciones.
class _ActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color backgroundColor;
  final Color foregroundColor;
  final String? tooltip;
  final VoidCallback onPressed;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.backgroundColor,
    required this.foregroundColor,
    this.tooltip,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final button = SizedBox(
      height: 30,
      child: TextButton.icon(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          minimumSize: Size.zero,
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
        icon: Icon(icon, size: 14, color: foregroundColor),
        label: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: foregroundColor,
          ),
        ),
      ),
    );

    if (tooltip != null) {
      return Tooltip(
        message: tooltip!,
        child: button,
      );
    }

    return button;
  }
}