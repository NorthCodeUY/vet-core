// apps/admin-portal/lib/widgets/product_store_preview_dialog.dart
// Propósito: Previsualización fiel en Flutter de cómo se renderiza el producto en
// la tienda pública React (`ProductCardV2.tsx`), con selector de variantes y acordeón.

import 'package:flutter/material.dart';
import 'package:admin_portal/config/app_colors.dart';
import 'package:admin_portal/config/app_environment.dart';
import 'package:admin_portal/models/product/product.dart';

/// Modal interactivo que simula `ProductCardV2.tsx` usando los tokens del tenant.
class ProductStorePreviewDialog extends StatefulWidget {
  final Product product;

  const ProductStorePreviewDialog({super.key, required this.product});

  static Future<void> show(BuildContext context, {required Product product}) {
    return showDialog<void>(
      context: context,
      builder: (_) => ProductStorePreviewDialog(product: product),
    );
  }

  @override
  State<ProductStorePreviewDialog> createState() =>
      _ProductStorePreviewDialogState();
}

class _ProductStorePreviewDialogState extends State<ProductStorePreviewDialog> {
  ProductVariant? _selectedVariant;
  bool _isExpanded = false;

  @override
  void initState() {
    super.initState();
    final p = widget.product;
    if (p.variants.isNotEmpty && !p.onlyVariants) {
      _selectedVariant = p.variants.firstWhere(
        (v) => v.isAvailable && (v.stock > 0 || v.allowBackorder || p.allowBackorder),
        orElse: () => p.variants.first,
      );
    }
  }

  bool get _hasVariants => widget.product.variants.isNotEmpty;

  ({bool isAvailable, bool isEncargo}) get _availabilityState {
    final p = widget.product;
    if (!p.isAvailable) return (isAvailable: false, isEncargo: false);

    final v = _selectedVariant;
    if (v != null) {
      if (!v.isAvailable) return (isAvailable: false, isEncargo: false);
      final hasStock = v.stock > 0;
      final canBackorder = v.allowBackorder || p.allowBackorder;
      if (!hasStock && canBackorder) return (isAvailable: true, isEncargo: true);
      if (!hasStock) return (isAvailable: false, isEncargo: false);
      return (isAvailable: true, isEncargo: false);
    }

    final hasStock = p.stock > 0;
    if (!hasStock && p.allowBackorder) return (isAvailable: true, isEncargo: true);
    if (!hasStock) return (isAvailable: false, isEncargo: false);
    return (isAvailable: true, isEncargo: false);
  }

  double get _finalPrice =>
      _selectedVariant?.salePrice ?? widget.product.salePrice;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final statusColors = AppStatusColors.of(context);
    final p = widget.product;
    final status = _availabilityState;
    final requiresVariant =
        p.onlyVariants && _hasVariants && _selectedVariant == null;
    final imageUrl = p.primaryImageUrl != null
        ? AppEnvironment.resolveMediaUrl(p.primaryImageUrl!)
        : '';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 340),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Cabecera de aviso de vista previa
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: colorScheme.inverseSurface,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.visibility_outlined,
                    size: 14,
                    color: colorScheme.onInverseSurface,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    p.isVisibleInShowcase
                        ? 'Vista previa en tienda pública'
                        : 'Vista previa (Producto oculto en vitrina)',
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: colorScheme.onInverseSurface,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Tarjeta clon de ProductCardV2.tsx
            Opacity(
              opacity: status.isAvailable ? 1.0 : 0.72,
              child: Container(
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: colorScheme.outlineVariant.withValues(alpha: 0.6),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: colorScheme.shadow.withValues(alpha: 0.14),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                clipBehavior: Clip.antiAlias,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // 1. Contenedor superior: Imagen + Agotado + Subcategorías
                    Container(
                      color: colorScheme.surface,
                      padding: const EdgeInsets.all(16),
                      height: 170,
                      child: Stack(
                        children: [
                          Center(
                            child: imageUrl.isNotEmpty
                                ? ColorFiltered(
                                    colorFilter: status.isAvailable
                                        ? const ColorFilter.mode(
                                            Colors.transparent,
                                            BlendMode.multiply,
                                          )
                                        : const ColorFilter.matrix([
                                            0.33, 0.33, 0.33, 0, 0,
                                            0.33, 0.33, 0.33, 0, 0,
                                            0.33, 0.33, 0.33, 0, 0,
                                            0, 0, 0, 1, 0,
                                          ]),
                                    child: Image.network(
                                      imageUrl,
                                      fit: BoxFit.contain,
                                      errorBuilder: (_, __, ___) => Icon(
                                        Icons.image_not_supported_outlined,
                                        size: 48,
                                        color: colorScheme.outline,
                                      ),
                                    ),
                                  )
                                : Icon(
                                    Icons.inventory_2_outlined,
                                    size: 52,
                                    color: colorScheme.outline,
                                  ),
                          ),
                          if (!status.isAvailable)
                            Center(
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: colorScheme.onSurface
                                      .withValues(alpha: 0.88),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.error_outline,
                                      size: 14,
                                      color: colorScheme.error,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'AGOTADO',
                                      style: theme.textTheme.labelSmall
                                          ?.copyWith(
                                        color: colorScheme.surface,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          if (p.subcategories.isNotEmpty)
                            Positioned(
                              bottom: 0,
                              left: 0,
                              child: Wrap(
                                spacing: 4,
                                children: p.subcategories.map((sub) {
                                  return Tooltip(
                                    message: sub.name,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                        vertical: 3,
                                      ),
                                      decoration: BoxDecoration(
                                        color: colorScheme.primary
                                            .withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: colorScheme.primary
                                              .withValues(alpha: 0.25),
                                        ),
                                      ),
                                      child: Text(
                                        sub.name,
                                        style: theme.textTheme.labelSmall
                                            ?.copyWith(
                                          color: colorScheme.primary,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                        ],
                      ),
                    ),

                    // 2. Contenedor inferior: Título, Variantes, Precio, Botón, Acordeón
                    Container(
                      color: colorScheme.surfaceContainerLowest,
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text(
                            p.name,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (_hasVariants) ...[
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 6,
                              runSpacing: 6,
                              children: p.variants.map((v) {
                                final isSelected =
                                    _selectedVariant?.id == v.id;
                                final isDisabled = !v.isAvailable ||
                                    (v.stock <= 0 &&
                                        !v.allowBackorder &&
                                        !p.allowBackorder);
                                return ChoiceChip(
                                  label: Text(
                                    v.name,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      decoration: isDisabled
                                          ? TextDecoration.lineThrough
                                          : null,
                                    ),
                                  ),
                                  selected: isSelected,
                                  onSelected: isDisabled
                                      ? null
                                      : (_) =>
                                          setState(() => _selectedVariant = v),
                                  visualDensity: VisualDensity.compact,
                                );
                              }).toList(),
                            ),
                          ],
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                '\$ ${_finalPrice.toStringAsFixed(0)}',
                                style: theme.textTheme.titleLarge?.copyWith(
                                  color: colorScheme.primary,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              if (!status.isAvailable)
                                Text(
                                  'AGOTADO',
                                  style: theme.textTheme.labelSmall?.copyWith(
                                    color: colorScheme.error,
                                    fontWeight: FontWeight.bold,
                                  ),
                                )
                              else if (status.isEncargo)
                                Text(
                                  'POR ENCARGO',
                                  style: theme.textTheme.labelSmall?.copyWith(
                                    color: statusColors.success,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          FilledButton.icon(
                            onPressed:
                                (!status.isAvailable || requiresVariant)
                                    ? null
                                    : () {},
                            icon: Icon(
                              status.isEncargo
                                  ? Icons.schedule
                                  : Icons.shopping_cart_outlined,
                              size: 16,
                            ),
                            label: Text(
                              !status.isAvailable
                                  ? 'No disponible'
                                  : requiresVariant
                                      ? 'Elegir opción'
                                      : status.isEncargo
                                          ? 'Pedir por Encargo'
                                          : 'Comprar',
                            ),
                          ),
                          IconButton(
                            onPressed: () =>
                                setState(() => _isExpanded = !_isExpanded),
                            icon: Icon(
                              _isExpanded
                                  ? Icons.keyboard_arrow_up
                                  : Icons.keyboard_arrow_down,
                            ),
                            visualDensity: VisualDensity.compact,
                          ),
                          if (_isExpanded) ...[
                            const Divider(height: 8),
                            Text(
                              p.description?.trim().isNotEmpty == true
                                  ? p.description!
                                  : 'Sin descripción disponible.',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 8),
                            FilledButton.icon(
                              style: FilledButton.styleFrom(
                                backgroundColor: statusColors.whatsapp,
                                foregroundColor: statusColors.onSuccess,
                              ),
                              onPressed: () {},
                              icon: const Icon(Icons.chat_outlined, size: 16),
                              label: const Text('Consultar por WhatsApp'),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            TextButton.icon(
              style: TextButton.styleFrom(
                foregroundColor: colorScheme.surface,
              ),
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.close),
              label: const Text('Cerrar vista previa'),
            ),
          ],
        ),
      ),
    );
  }
}