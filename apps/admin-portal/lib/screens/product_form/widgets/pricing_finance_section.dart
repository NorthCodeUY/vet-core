// apps/admin-portal/lib/widgets/product_form/pricing_finance_section.dart

// Propósito: Sección atómica de presentación para capturar PVP, costo y visualizar margen comercial reactivo.

import 'package:flutter/material.dart';
import 'form_section_card.dart';

/// Sección de presentación pura encargada de los datos financieros de un producto.
///
/// Forma parte del formulario maestro de alta/edición (`ProductFormScreen`).
/// No calcula márgenes ni ejecuta peticiones HTTP; recibe los controladores
/// y el porcentaje ya computado desde `ProductFormHandler` y resuelve toda
/// su estilización mediante el [ColorScheme] y [TextTheme] del tenant activo.
class PricingFinanceSection extends StatelessWidget {
  // --- Estado y Dependencias ---

  /// Controlador de texto para el Precio de Venta al Público (PVP), campo obligatorio.
  final TextEditingController salePriceController;

  /// Controlador de texto para el costo de adquisición ante proveedor (campo opcional).
  final TextEditingController costPriceController;

  /// Porcentaje de rentabilidad precalculado por el handler a partir de PVP y costo.
  ///
  /// Valores negativos o en cero se muestran con su signo explícito en el badge superior.
  final double marginPercentage;

  // --- Ciclo de Vida / Inicialización ---

  /// Crea la sección comercial [PricingFinanceSection].
  ///
  /// Requiere [salePriceController] y [costPriceController] administrados por el
  /// estado padre para preservar su ciclo de vida (`dispose`), junto con
  /// [marginPercentage] para actualizar el indicador visual de margen.
  const PricingFinanceSection({
    super.key,
    required this.salePriceController,
    required this.costPriceController,
    required this.marginPercentage,
  });

  // --- Acciones Públicas ---

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.payments_outlined,
      title: 'Estructura Comercial y Precios',
      // El indicador de margen se delega al trailing del card para mantener jerarquía visual sin saturar los inputs.
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          // Usa tokens semánticos M3 para garantizar contraste legible sin importar la paleta del tenant.
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
              Expanded(
                child: TextFormField(
                  controller: salePriceController,
                  // Habilita teclado numérico con separador decimal en móviles iOS/Android.
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Precio Venta Público *',
                    prefixText: '\$ ',
                    border: OutlineInputBorder(),
                  ),
                  // Valida parseo numérico estricto para evitar errores 422 (Unprocessable Entity) en FastAPI.
                  validator: (v) =>
                      v == null || double.tryParse(v) == null ? 'Obligatorio' : null,
                ),
              ),
              const SizedBox(width: 12),
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