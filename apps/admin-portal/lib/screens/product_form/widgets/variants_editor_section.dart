// apps/admin-portal/lib/screens/product_form/widgets/variants_editor_section.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'form_section_card.dart';

/// Sección del formulario encargada de listar, agregar, inspeccionar y remover
/// las variantes físicas (SKUs) asociadas a un [Product].
///
/// Sigue el patrón presentacional puro: no muta la lista directamente ni abre
/// diálogos por sí misma; delega todas las acciones al handler padre mediante callbacks.
class VariantsEditorSection extends StatelessWidget {
  /// Lista actual de variantes configuradas para el producto.
  final List<ProductVariant> variants;

  /// Callback invocado al solicitar el alta de una nueva variante/SKU.
  final VoidCallback onAddVariant;

  /// Callback invocado al eliminar una variante según su posición en [variants].
  final ValueChanged<int> onRemoveVariant;

  /// Callback opcional para abrir la edición detallada de una variante al tocar su tarjeta.
  final ValueChanged<int>? onEditVariant;

  /// Crea la sección de gestión de variantes físicas del formulario.
  const VariantsEditorSection({
    super.key,
    required this.variants,
    required this.onAddVariant,
    required this.onRemoveVariant,
    this.onEditVariant,
  });

  @override
  Widget build(BuildContext context) {
    // Resuelve tipografía y paleta semántica del tenant activo (Zero Hardcoding).
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.layers_outlined,
      title: 'Variantes Físicas (SKUs)',
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: colorScheme.secondaryContainer,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          '${variants.length} registradas',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSecondaryContainer,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (variants.isEmpty)
            // Estado vacío informativo cuando el producto opera con stock y PVP únicos.
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Text(
                'No hay variantes configuradas. El producto se venderá con el precio y stock general.',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            )
          else
            // Usa shrinkWrap dentro del ListView maestro del formulario delegando
            // el scroll al padre para evitar conflictos de desplazamiento.
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: variants.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) => _VariantListItem(
                variant: variants[index],
                onTap: onEditVariant != null ? () => onEditVariant!(index) : null,
                onRemove: () => onRemoveVariant(index),
              ),
            ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: onAddVariant,
              icon: const Icon(Icons.add_circle_outline, size: 18),
              label: const Text('Agregar Variante / SKU'),
            ),
          ),
        ],
      ),
    );
  }
}

/// Tarjeta compacta que representa una variante individual ([ProductVariant])
/// dentro del editor, protegida contra desbordamientos horizontales en móvil.
class _VariantListItem extends StatelessWidget {
  final ProductVariant variant;
  final VoidCallback? onTap;
  final VoidCallback onRemove;

  const _VariantListItem({
    required this.variant,
    required this.onTap,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Material(
      color: colorScheme.surfaceContainerLow,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: colorScheme.outlineVariant.withValues(alpha: 0.35),
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(
            children: [
              // Expanded evita RenderFlex overflow cuando el nombre o SKU son extensos.
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 7,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: colorScheme.secondaryContainer,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              variant.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.textTheme.labelSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: colorScheme.onSecondaryContainer,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            variant.sku ?? 'SKU-${variant.id}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.labelSmall?.copyWith(
                              fontFamily: 'monospace',
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'Stock: ${variant.stock} un. • EAN: ${variant.barcode ?? 'S/C'}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontSize: 11.5,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Bloque derecho fijo: PVP y acción destructiva de eliminación.
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '\$ ${variant.salePrice.toStringAsFixed(0)}',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    tooltip: 'Eliminar variante',
                    visualDensity: VisualDensity.compact,
                    icon: const Icon(Icons.delete_outline, size: 18),
                    color: colorScheme.error,
                    onPressed: onRemove,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}