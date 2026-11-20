// apps/admin-portal/lib/widgets/product_card_item.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';

/// Componente visual atómico que renderiza una tarjeta de producto del catálogo.
///
/// Refleja la estructura de Stitch:
/// - Mini carrusel interactivo de imágenes con navegación por flechas y dots.
/// - Taxonomía segmentada (`Categoría › Subcategoría`) y switch de vitrina.
/// - Chips de variantes con precios directos por presentación.
/// - Barra de acciones rápidas: Pausar/Disponibilidad, Edición y Baja lógica.
class ProductCardItem extends StatelessWidget {
  /// Entidad inmutable del producto a representar.
  final Product product;

  /// Callback ejecutado al conmutar el switch de vitrina web.
  final ValueChanged<bool> onToggleShowcase;

  /// Callback para alternar disponibilidad operativa (Pausar compra).
  final VoidCallback onToggleAvailability;

  /// Callback para navegar a la pantalla de edición.
  final VoidCallback onEdit;

  /// Callback para solicitar la eliminación o baja lógica del ítem.
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
      // Atenúa la tarjeta completa al 65% cuando el producto está oculto de la vitrina
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
              // 1. FILA SUPERIOR: CARRUSEL MULTIMEDIA + INFORMACIÓN DESCRIPTIVA
              // ===============================================================
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Mini-carrusel atómico de fotografías con badges <!> aca no nada muestra la imagen no se si no la trae o que esta mal 
                  _ProductThumbnailCarousel(
                    images: product.images,
                    variantsCount: product.variants.length,
                    fallbackUrl: product.primaryImageUrl,
                  ),
                  const SizedBox(width: 12),

                  // Bloque de metadatos, categoría, switch y variantes
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
              // 2. BARRA INFERIOR DE ACCIONES ADMINISTRATIVAS
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
  final String fallbackUrl;

  const _ProductThumbnailCarousel({
    required this.images,
    required this.variantsCount,
    required this.fallbackUrl,
  });

  @override
  State<_ProductThumbnailCarousel> createState() => _ProductThumbnailCarouselState();
}
// <!> cOMETAR 
class _ProductThumbnailCarouselState extends State<_ProductThumbnailCarousel> {
  int _currentIndex = 0;

  List<String> get _resolvedUrls {
    if (widget.images.isNotEmpty) {
      return widget.images.map((img) => img.url).toList();
    }
    if (widget.fallbackUrl.isNotEmpty) {
      return [widget.fallbackUrl];
    }
    return [];
  }

  void _nextImage(int total) {
    setState(() {
      _currentIndex = (_currentIndex + 1) % total;
    });
  }

  void _prevImage(int total) {
    setState(() {
      _currentIndex = (_currentIndex - 1 + total) % total;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final urls = _resolvedUrls;
    final total = urls.length;

    return SizedBox(
      width: 76,
      height: 76,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Imagen principal redondeada
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: urls.isNotEmpty
                  ? Image.network(
                      urls[_currentIndex],
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: colorScheme.surfaceContainerHighest,
                        child: Icon(Icons.image_not_supported_outlined,
                            size: 20, color: colorScheme.outline),
                      ),
                    )
                  : Container(
                      color: colorScheme.surfaceContainerHighest,
                      child: Icon(Icons.image_outlined,
                          size: 20, color: colorScheme.outline),
                    ),
            ),
          ),

          // Badge superior izquierdo: Cantidad de variantes ('3 VAR')
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

          // Flecha de navegación izquierda (<)
          if (total > 1)
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

          // Flecha de navegación derecha (>)
          if (total > 1)
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

          // Puntos indicadores inferiores (Dots)
          if (total > 1)
            Positioned(
              bottom: 3,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(total, (index) {
                  final isSelected = index == _currentIndex;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    margin: const EdgeInsets.symmetric(horizontal: 1),
                    width: isSelected ? 5 : 3.5,
                    height: isSelected ? 5 : 3.5,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSelected
                          ? Colors.white
                          : Colors.white.withValues(alpha: 0.5),
                    ),
                  );
                }),
              ),
            ),
        ],
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

        // Fila 3: Código de barras / Identificador
        Text(
          skuText,
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
            fontSize: 10,
          ),
        ),
        const SizedBox(height: 6),

        // Fila 4: Chips de Variantes con Precio Directo
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
          // Precio base si no tiene variantes
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

    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        // 1. Botón: Marcar No disponible / Pausar
        _ActionButton(
          label: isAvailable ? 'No disponible' : 'Disponible',
          icon: isAvailable ? Icons.pause_circle_outline : Icons.play_circle_outline,
          backgroundColor: colorScheme.surfaceContainerHigh,
          foregroundColor: colorScheme.onSurfaceVariant,
          onPressed: onToggleAvailability,
        ),
        const SizedBox(width: 6),

        // 2. Botón: Editar
        _ActionButton(
          label: 'Editar',
          icon: Icons.edit_outlined,
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          onPressed: onEdit,
        ),
        const SizedBox(width: 6),

        // 3. Botón: Eliminar / Baja lógica
        _ActionButton(
          label: 'Eliminar',
          icon: Icons.delete_outline,
          backgroundColor: colorScheme.errorContainer,
          foregroundColor: colorScheme.error,
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
  final VoidCallback onPressed;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.backgroundColor,
    required this.foregroundColor,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
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
  }
}