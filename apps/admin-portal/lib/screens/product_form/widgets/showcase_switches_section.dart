// lib/widgets/product_form/showcase_switches_section.dart

import 'package:flutter/material.dart';
import 'form_section_card.dart';

class ShowcaseSwitchesSection extends StatelessWidget {
  final bool isVisible;
  final bool isAvailable;
  final bool onlyVariants;
  final bool allowBackorder;
  final ValueChanged<bool> onVisibleChanged;
  final ValueChanged<bool> onAvailableChanged;
  final ValueChanged<bool> onOnlyVariantsChanged;
  final ValueChanged<bool> onAllowBackorderChanged;

  const ShowcaseSwitchesSection({
    super.key,
    required this.isVisible,
    required this.isAvailable,
    required this.onlyVariants,
    required this.allowBackorder,
    required this.onVisibleChanged,
    required this.onAvailableChanged,
    required this.onOnlyVariantsChanged,
    required this.onAllowBackorderChanged,
  });

  @override
  Widget build(BuildContext context) {
    return FormSectionCard(
      icon: Icons.toggle_on_outlined,
      title: 'Reglas de Exhibición y Venta',
      child: Column(
        children: [
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Mostrar en Vitrina Digital (prod_visible)'),
            subtitle: const Text('Visible para clientes en el catálogo web'),
            value: isVisible,
            onChanged: onVisibleChanged,
          ),
          const Divider(height: 1),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Disponible para Compra (prod_disponible)'),
            subtitle: const Text('Habilita el botón de añadir al carro y checkout'),
            value: isAvailable,
            onChanged: onAvailableChanged,
          ),
          const Divider(height: 1),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Venta Exclusiva por Variantes (prod_solo_variantes)'),
            subtitle: const Text('Requiere elegir presentación (talle, peso o color)'),
            value: onlyVariants,
            onChanged: onOnlyVariantsChanged,
          ),
          const Divider(height: 1),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Permitir Pedidos por Encargo (prod_per_sin_stock)'),
            subtitle: const Text('Backorder: permite comprar aunque el stock físico sea 0'),
            value: allowBackorder,
            onChanged: onAllowBackorderChanged,
          ),
        ],
      ),
    );
  }
}