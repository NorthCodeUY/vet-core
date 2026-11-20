// lib/widgets/product_form/pricing_finance_section.dart

import 'package:flutter/material.dart';
import 'form_section_card.dart';

class PricingFinanceSection extends StatelessWidget {
  final TextEditingController salePriceController;
  final TextEditingController costPriceController;
  final double marginPercentage;

  const PricingFinanceSection({
    super.key,
    required this.salePriceController,
    required this.costPriceController,
    required this.marginPercentage,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.payments_outlined,
      title: 'Estructura Comercial y Precios',
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: colorScheme.secondaryContainer,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          'Margen: ${marginPercentage >= 0 ? '+' : ''}${marginPercentage.toStringAsFixed(1)}%',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSecondaryContainer,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Precio Venta (PVP)
              Expanded(
                child: TextFormField(
                  controller: salePriceController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Precio Venta Público *',
                    prefixText: '\$ ',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      v == null || double.tryParse(v) == null ? 'Obligatorio' : null,
                ),
              ),
              const SizedBox(width: 12),

              // Precio Costo Proveedor
              Expanded(
                child: TextFormField(
                  controller: costPriceController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Costo Proveedor',
                    prefixText: '\$ ',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

