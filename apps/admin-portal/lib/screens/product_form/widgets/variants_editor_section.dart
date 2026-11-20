// lib/widgets/product_form/variants_editor_section.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'form_section_card.dart';

class VariantsEditorSection extends StatelessWidget {
  final List<ProductVariant> variants;
  final VoidCallback onAddVariant;
  final ValueChanged<int> onRemoveVariant;

  const VariantsEditorSection({
    super.key,
    required this.variants,
    required this.onAddVariant,
    required this.onRemoveVariant,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.layers_outlined,
      title: 'Variantes Físicas (SKUs)',
      trailing: Text(
        '${variants.length} Registradas',
        style: theme.textTheme.labelSmall?.copyWith(color: colorScheme.outline),
      ),
      child: Column(
        children: [
          if (variants.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Text(
                'No hay variantes configuradas. El producto se venderá con el precio y stock general.',
                style: theme.textTheme.bodySmall?.copyWith(color: colorScheme.outline),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: variants.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final v = variants[index];
                return Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: colorScheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: colorScheme.secondaryContainer,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  v.name,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: colorScheme.onSecondaryContainer,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                v.sku ?? 'SKU-${v.id}',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontFamily: 'monospace',
                                  color: colorScheme.outline,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Stock: ${v.stock} un. • EAN: ${v.barcode ?? 'S/C'}',
                            style: theme.textTheme.bodySmall?.copyWith(fontSize: 11),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Text(
                            '\$ ${v.salePrice.toStringAsFixed(0)}',
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, size: 18),
                            color: colorScheme.error,
                            onPressed: () => onRemoveVariant(index),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: onAddVariant,
              icon: const Icon(Icons.add_circle_outline, size: 18),
              label: const Text('+ Agregar Variante / SKU'),
            ),
          ),
        ],
      ),
    );
  }
}