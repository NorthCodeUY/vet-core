// apps/admin-portal/lib/widgets/product_card_item.dart
// Propósito: Tarjeta administrativa responsive de producto con edición rápida de foto,
// checks explícitos (Visible, Disponible verde, Encargar) y barra adaptativa con menú ⋮.

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:admin_portal/config/app_colors.dart';
import 'package:admin_portal/config/app_environment.dart';
import 'package:admin_portal/models/product/product.dart';

/// Tarjeta visual atómica de producto para el catálogo administrativo.
class ProductCardItem extends StatelessWidget {
  final Product product;
  final ValueChanged<bool> onToggleShowcase;
  final VoidCallback onToggleAvailability;
  final ValueChanged<bool> onToggleBackorder;
  final ValueChanged<ImageSource> onQuickPickImage;
  final VoidCallback onPreview;
  final VoidCallback onGenerateQr;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const ProductCardItem({
    super.key,
    required this.product,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onToggleBackorder,
    required this.onQuickPickImage,
    required this.onPreview,
    required this.onGenerateQr,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isHidden = !product.isVisibleInShowcase;

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 200),
      opacity: isHidden ? 0.72 : 1.0,
      child: Card(
        elevation: 0,
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(
            color: colorScheme.outlineVariant.withValues(alpha: 0.35),
          ),
        ),
        color: colorScheme.surfaceContainerLowest,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Fila superior: Miniatura interactiva + Metadatos
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ProductThumbnailCarousel(
                    images: product.images,
                    variantsCount: product.variants.length,
                    fallbackUrl: product.primaryImageUrl ?? '',
                    onQuickPickImage: onQuickPickImage,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ProductMetaInfo(product: product),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // 2. Fila de checks explícitos: Visible | Disponible (verde) | Encargar
              _ProductStateChecksRow(
                isVisible: product.isVisibleInShowcase,
                isAvailable: product.isAvailable,
                allowBackorder: product.allowBackorder,
                onToggleShowcase: onToggleShowcase,
                onToggleAvailability: onToggleAvailability,
                onToggleBackorder: onToggleBackorder,
              ),
              const SizedBox(height: 10),

              // 3. Barra de acciones responsive (colapsa acciones en ⋮ según el ancho)
              _ResponsiveActionBar(
                onPreview: onPreview,
                onGenerateQr: onGenerateQr,
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
// SUBCOMPONENTE 1: MINIATURA CON CARRUSEL Y MENÚ RÁPIDO DE CÁMARA/GALERÍA
// =============================================================================

class _ProductThumbnailCarousel extends StatefulWidget {
  final List<ProductImage> images;
  final int variantsCount;
  final String? fallbackUrl;
  final ValueChanged<ImageSource> onQuickPickImage;

  const _ProductThumbnailCarousel({
    required this.images,
    required this.variantsCount,
    required this.onQuickPickImage,
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
    final total = _resolvedUrls.length;
    if (total == 0 || _currentIndex >= total) {
      _currentIndex = 0;
    }
  }

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

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final urls = _resolvedUrls;
    final total = urls.length;
    final hasValidImages = urls.isNotEmpty && urls.first.isNotEmpty;

    return SizedBox(
      width: 78,
      height: 78,
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: hasValidImages
                  ? Image.network(
                      urls[_currentIndex],
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          _buildPlaceholder(colorScheme),
                    )
                  : _buildPlaceholder(colorScheme),
            ),
          ),

          if (widget.variantsCount > 0)
            Positioned(
              top: 3,
              left: 3,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1.5),
                decoration: BoxDecoration(
                  color: colorScheme.primary.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '${widget.variantsCount} VAR',
                  style: TextStyle(
                    color: colorScheme.onPrimary,
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

          if (total > 1) ...[
            Positioned(
              left: 2,
              top: 0,
              bottom: 0,
              child: Center(
                child: InkWell(
                  onTap: () => setState(
                    () => _currentIndex = (_currentIndex - 1 + total) % total,
                  ),
                  child: Container(
                    width: 17,
                    height: 17,
                    decoration: BoxDecoration(
                      color: colorScheme.scrim.withValues(alpha: 0.65),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.chevron_left,
                      size: 13,
                      color: colorScheme.surface,
                    ),
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
                  onTap: () => setState(
                    () => _currentIndex = (_currentIndex + 1) % total,
                  ),
                  child: Container(
                    width: 17,
                    height: 17,
                    decoration: BoxDecoration(
                      color: colorScheme.scrim.withValues(alpha: 0.65),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.chevron_right,
                      size: 13,
                      color: colorScheme.surface,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 4,
              left: 4,
              right: 24,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  total > 4 ? 4 : total,
                  (i) => Container(
                    width: i == _currentIndex ? 6 : 4,
                    height: i == _currentIndex ? 6 : 4,
                    margin: const EdgeInsets.symmetric(horizontal: 1),
                    decoration: BoxDecoration(
                      color: i == _currentIndex
                          ? colorScheme.surface
                          : colorScheme.surface.withValues(alpha: 0.55),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
            ),
          ],

          // Botón rápido desplegable para cambiar/subir foto (cámara o galería) sin entrar a Editar
          Positioned(
            bottom: 3,
            right: 3,
            child: kIsWeb
                ? Tooltip(
                    message: 'Cambiar / subir foto',
                    child: InkWell(
                      onTap: () => widget.onQuickPickImage(ImageSource.gallery),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.photo_camera,
                          size: 13,
                          color: colorScheme.onPrimary,
                        ),
                      ),
                    ),
                  )
                : PopupMenuButton<ImageSource>(
                    tooltip: 'Cambiar foto rápido',
                    padding: EdgeInsets.zero,
                    onSelected: widget.onQuickPickImage,
                    itemBuilder: (_) => const [
                      PopupMenuItem(
                        value: ImageSource.camera,
                        child: Row(
                          children: [
                            Icon(Icons.photo_camera_outlined, size: 18),
                            SizedBox(width: 10),
                            Text('Tomar foto con cámara'),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: ImageSource.gallery,
                        child: Row(
                          children: [
                            Icon(Icons.photo_library_outlined, size: 18),
                            SizedBox(width: 10),
                            Text('Elegir de galería'),
                          ],
                        ),
                      ),
                    ],
                    child: Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.photo_camera,
                        size: 13,
                        color: colorScheme.onPrimary,
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholder(ColorScheme colorScheme) {
    return Container(
      color: colorScheme.surfaceContainerHigh,
      child: Center(
        child: Icon(
          Icons.inventory_2_outlined,
          size: 28,
          color: colorScheme.outline.withValues(alpha: 0.7),
        ),
      ),
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 2: TAXONOMÍA, TÍTULO, STOCK Y VARIANTES
// =============================================================================

class _ProductMetaInfo extends StatelessWidget {
  final Product product;

  const _ProductMetaInfo({required this.product});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final categoryName = product.category?.name ?? 'Sin categoría';
    final subcategoryName = product.subcategories.isNotEmpty
        ? product.subcategories.first.name
        : null;
    final skuText = product.barcode != null && product.barcode!.isNotEmpty
        ? 'EAN: ${product.barcode}'
        : 'ID: #${product.id}';
    final isOutOfStock = product.totalStock <= 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Taxonomía (Categoría › Subcategoría) + badge de estado/stock
        Wrap(
          spacing: 4,
          runSpacing: 4,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            _MiniBadge(
              label: categoryName.toUpperCase(),
              background: colorScheme.secondaryContainer,
              foreground: colorScheme.onSecondaryContainer,
            ),
            if (subcategoryName != null) ...[
              Text(
                '›',
                style: TextStyle(
                  color: colorScheme.onSurfaceVariant,
                  fontSize: 12,
                ),
              ),
              Text(
                subcategoryName,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                  fontSize: 10,
                ),
              ),
            ],
            if (!product.isActive)
              _MiniBadge(
                label: 'INACTIVO',
                background: colorScheme.errorContainer,
                foreground: colorScheme.onErrorContainer,
              ),
            _MiniBadge(
              label: isOutOfStock ? 'SIN STOCK' : 'STOCK: ${product.totalStock}',
              background: isOutOfStock
                  ? colorScheme.tertiaryContainer
                  : colorScheme.surfaceContainerHigh,
              foreground: isOutOfStock
                  ? colorScheme.onTertiaryContainer
                  : colorScheme.onSurfaceVariant,
            ),
          ],
        ),
        const SizedBox(height: 4),

        Text(
          product.name,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w700,
            height: 1.2,
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 2),

        Text(
          skuText,
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
            fontSize: 10,
          ),
        ),
        const SizedBox(height: 6),

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

class _MiniBadge extends StatelessWidget {
  final String label;
  final Color background;
  final Color foreground;

  const _MiniBadge({
    required this.label,
    required this.background,
    required this.foreground,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: foreground,
              fontWeight: FontWeight.bold,
              fontSize: 9,
              letterSpacing: 0.4,
            ),
      ),
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 3: CHECKS EXPLÍCITOS (VISIBLE, DISPONIBLE VERDE, ENCARGAR)
// =============================================================================

class _ProductStateChecksRow extends StatelessWidget {
  final bool isVisible;
  final bool isAvailable;
  final bool allowBackorder;
  final ValueChanged<bool> onToggleShowcase;
  final VoidCallback onToggleAvailability;
  final ValueChanged<bool> onToggleBackorder;

  const _ProductStateChecksRow({
    required this.isVisible,
    required this.isAvailable,
    required this.allowBackorder,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onToggleBackorder,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final statusColors = AppStatusColors.of(context);

    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: [
        // 1. Visible / No visible en vitrina
        _StateCheckPill(
          label: isVisible ? 'Visible' : 'No visible',
          isChecked: isVisible,
          activeBackground: colorScheme.primaryContainer,
          activeForeground: colorScheme.onPrimaryContainer,
          inactiveBackground: colorScheme.surfaceContainerHigh,
          inactiveForeground: colorScheme.onSurfaceVariant,
          onTap: () => onToggleShowcase(!isVisible),
        ),

        // 2. Disponible (VERDE cuando está activo) / No disponible (gris neutro)
        _StateCheckPill(
          label: isAvailable ? 'Disponible' : 'No disponible',
          isChecked: isAvailable,
          activeBackground: statusColors.successContainer,
          activeForeground: statusColors.onSuccessContainer,
          inactiveBackground: colorScheme.surfaceContainerHigh,
          inactiveForeground: colorScheme.onSurfaceVariant,
          onTap: onToggleAvailability,
        ),

        // 3. Encargar (permite venta sin stock) / Sin encargo
        _StateCheckPill(
          label: allowBackorder ? 'Encargar' : 'Sin encargo',
          isChecked: allowBackorder,
          activeBackground: colorScheme.secondaryContainer,
          activeForeground: colorScheme.onSecondaryContainer,
          inactiveBackground: colorScheme.surfaceContainerHigh,
          inactiveForeground: colorScheme.onSurfaceVariant,
          onTap: () => onToggleBackorder(!allowBackorder),
        ),
      ],
    );
  }
}

/// Píldora compacta tipo checkbox que muestra explícitamente el estado actual.
class _StateCheckPill extends StatelessWidget {
  final String label;
  final bool isChecked;
  final Color activeBackground;
  final Color activeForeground;
  final Color inactiveBackground;
  final Color inactiveForeground;
  final VoidCallback onTap;

  const _StateCheckPill({
    required this.label,
    required this.isChecked,
    required this.activeBackground,
    required this.activeForeground,
    required this.inactiveBackground,
    required this.inactiveForeground,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bg = isChecked ? activeBackground : inactiveBackground;
    final fg = isChecked ? activeForeground : inactiveForeground;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isChecked
                  ? Icons.check_box_outlined
                  : Icons.check_box_outline_blank,
              size: 15,
              color: fg,
            ),
            const SizedBox(width: 5),
            Text(
              label,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: fg,
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 4: BARRA DE ACCIONES RESPONSIVE CON COLAPSO PROGRESIVO A ⋮
// =============================================================================

enum _OverflowAction { preview, qr, delete }

class _ResponsiveActionBar extends StatelessWidget {
  final VoidCallback onPreview;
  final VoidCallback onGenerateQr;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _ResponsiveActionBar({
    required this.onPreview,
    required this.onGenerateQr,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        // Según el ancho disponible, oculta progresivamente acciones dentro de ⋮
        final showPreviewInline = width >= 370;
        final showQrInline = width >= 295;
        final showDeleteInline = width >= 335;
        final hasOverflow =
            !showPreviewInline || !showQrInline || !showDeleteInline;

        return Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            if (showPreviewInline) ...[
              _ActionButton(
                label: 'Vista previa',
                icon: Icons.visibility_outlined,
                backgroundColor: colorScheme.surfaceContainerHigh,
                foregroundColor: colorScheme.onSurface,
                tooltip: 'Previsualizar como se ve en la tienda',
                onPressed: onPreview,
              ),
              const SizedBox(width: 6),
            ],
            if (showQrInline) ...[
              _ActionButton(
                label: 'Generar QR',
                icon: Icons.qr_code_2,
                backgroundColor: colorScheme.surfaceContainerHigh,
                foregroundColor: colorScheme.onSurface,
                tooltip: 'Generar código QR del producto',
                onPressed: onGenerateQr,
              ),
              const SizedBox(width: 6),
            ],
            _ActionButton(
              label: 'Editar',
              icon: Icons.edit_outlined,
              backgroundColor: colorScheme.primary,
              foregroundColor: colorScheme.onPrimary,
              tooltip: 'Edición completa del producto',
              onPressed: onEdit,
            ),
            if (showDeleteInline) ...[
              const SizedBox(width: 6),
              _ActionButton(
                label: 'Eliminar',
                icon: Icons.delete_outline,
                backgroundColor: colorScheme.errorContainer,
                foregroundColor: colorScheme.error,
                tooltip: 'Dar de baja del catálogo',
                onPressed: onDelete,
              ),
            ],
            if (hasOverflow) ...[
              const SizedBox(width: 4),
              PopupMenuButton<_OverflowAction>(
                tooltip: 'Más acciones',
                padding: EdgeInsets.zero,
                onSelected: (action) {
                  switch (action) {
                    case _OverflowAction.preview:
                      onPreview();
                      break;
                    case _OverflowAction.qr:
                      onGenerateQr();
                      break;
                    case _OverflowAction.delete:
                      onDelete();
                      break;
                  }
                },
                itemBuilder: (_) => [
                  if (!showPreviewInline)
                    const PopupMenuItem(
                      value: _OverflowAction.preview,
                      child: Row(
                        children: [
                          Icon(Icons.visibility_outlined, size: 18),
                          SizedBox(width: 10),
                          Text('Vista previa tienda'),
                        ],
                      ),
                    ),
                  if (!showQrInline)
                    const PopupMenuItem(
                      value: _OverflowAction.qr,
                      child: Row(
                        children: [
                          Icon(Icons.qr_code_2, size: 18),
                          SizedBox(width: 10),
                          Text('Generar QR'),
                        ],
                      ),
                    ),
                  if (!showDeleteInline)
                    PopupMenuItem(
                      value: _OverflowAction.delete,
                      child: Row(
                        children: [
                          Icon(
                            Icons.delete_outline,
                            size: 18,
                            color: colorScheme.error,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            'Eliminar',
                            style: TextStyle(color: colorScheme.error),
                          ),
                        ],
                      ),
                    ),
                ],
                child: Container(
                  height: 30,
                  width: 30,
                  decoration: BoxDecoration(
                    color: colorScheme.surfaceContainerHigh,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.more_vert,
                    size: 18,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
            ],
          ],
        );
      },
    );
  }
}

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

    return tooltip != null ? Tooltip(message: tooltip!, child: button) : button;
  }
}