// apps/admin-portal/lib/widgets/product_card_item.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/config/app_environment.dart';
import 'package:admin_portal/models/product/product.dart';

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