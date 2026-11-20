// lib/widgets/product_form/inventory_stock_section.dart

import 'package:flutter/material.dart';
import 'form_section_card.dart';

class InventoryStockSection extends StatelessWidget {
  final TextEditingController stockController;
  final TextEditingController minStockController;

  const InventoryStockSection({
    super.key,
    required this.stockController,
    required this.minStockController,
  });

  @override
  Widget build(BuildContext context) {
    return FormSectionCard(
      icon: Icons.inventory_2_outlined,
      title: 'Inventario y Límite Crítico',
      child: Row(
        children: [
          Expanded(
            child: TextFormField(
              controller: stockController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Existencias Actuales',
                suffixText: 'unidades',
                border: OutlineInputBorder(),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextFormField(
              controller: minStockController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Punto de Pedido (Mínimo)',
                suffixText: 'unidades',
                border: OutlineInputBorder(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}