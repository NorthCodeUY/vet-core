// apps/admin-portal/lib/config/subcategory_icon_registry.dart

import 'package:flutter/material.dart';

/// Metadato de un icono estándar sincronizado entre el portal Flutter y el cliente React.
/// 
/// <!> eca el tema con el ico es qeu yo cebo poder selecionar svg o el otro depende de alguos que son medios espesifico por eso debo saber cuado selecione es pores qeu tenia los 2 
class SubcategoryIconOption {
  /// Clave exacta esperada por Lucide en el frontend React (ej. `'Scissors'`).
  final String lucideKey;

  /// Etiqueta legible en español para búsqueda rápida en el selector cuadrado.
  final String label;

  /// Representación visual Material 3 dentro del portal administrativo Flutter.
  final IconData materialIcon;

  /// Crea una opción del catálogo de iconografía.
  const SubcategoryIconOption({
    required this.lucideKey,
    required this.label,
    required this.materialIcon,
  });
}

/// Catálogo centralizado de iconos compatibles con `subc_icono`.
///
/// Garantiza que cada selección visual en Flutter persista una clave válida
/// para Lucide en React y provee resolución segura con fallback si llega una
/// clave nueva desde la API.
abstract final class SubcategoryIconRegistry {
  /// Listado curado de iconos multipropósito y veterinarios/retail.
  static const List<SubcategoryIconOption> options = [
    SubcategoryIconOption(lucideKey: 'Dog', label: 'Caninos', materialIcon: Icons.pets),
    SubcategoryIconOption(lucideKey: 'Cat', label: 'Felinos', materialIcon: Icons.cruelty_free),
    SubcategoryIconOption(lucideKey: 'Bone', label: 'Snacks', materialIcon: Icons.cookie_outlined),
    SubcategoryIconOption(lucideKey: 'HeartPulse', label: 'Salud', materialIcon: Icons.monitor_heart_outlined),
    SubcategoryIconOption(lucideKey: 'Stethoscope', label: 'Clínica', materialIcon: Icons.medical_services_outlined),
    SubcategoryIconOption(lucideKey: 'Pill', label: 'Farmacia', materialIcon: Icons.medication_outlined),
    SubcategoryIconOption(lucideKey: 'Syringe', label: 'Vacunas', materialIcon: Icons.vaccines_outlined),
    SubcategoryIconOption(lucideKey: 'Scissors', label: 'Peluquería', materialIcon: Icons.content_cut),
    SubcategoryIconOption(lucideKey: 'Sparkles', label: 'Higiene', materialIcon: Icons.cleaning_services_outlined),
    SubcategoryIconOption(lucideKey: 'Shirt', label: 'Indumentaria', materialIcon: Icons.checkroom_outlined),
    SubcategoryIconOption(lucideKey: 'ShoppingBag', label: 'Accesorios', materialIcon: Icons.shopping_bag_outlined),
    SubcategoryIconOption(lucideKey: 'Package', label: 'Bolsas / Pack', materialIcon: Icons.inventory_2_outlined),
    SubcategoryIconOption(lucideKey: 'Snowflake', label: 'Refrigerado', materialIcon: Icons.ac_unit),
    SubcategoryIconOption(lucideKey: 'FileCheck2', label: 'Receta / Rx', materialIcon: Icons.assignment_turned_in_outlined),
    SubcategoryIconOption(lucideKey: 'ShieldCheck', label: 'Cuidado', materialIcon: Icons.verified_user_outlined),
    SubcategoryIconOption(lucideKey: 'Leaf', label: 'Natural', materialIcon: Icons.eco_outlined),
    SubcategoryIconOption(lucideKey: 'Fish', label: 'Acuario', materialIcon: Icons.set_meal_outlined),
    SubcategoryIconOption(lucideKey: 'Bird', label: 'Aves', materialIcon: Icons.flutter_dash),
    SubcategoryIconOption(lucideKey: 'Tag', label: 'Etiqueta', materialIcon: Icons.sell_outlined),
    SubcategoryIconOption(lucideKey: 'Star', label: 'Destacado', materialIcon: Icons.star_outline),
  ];

  /// Resuelve el [IconData] de Flutter a partir del valor `subc_icono` de la API.
  static IconData resolve(
    String? lucideKey, {
    IconData fallback = Icons.sell_outlined,
  }) {
    if (lucideKey == null || lucideKey.trim().isEmpty) return fallback;
    final normalized = lucideKey.trim().toLowerCase();

    for (final option in options) {
      if (option.lucideKey.toLowerCase() == normalized) {
        return option.materialIcon;
      }
    }
    return fallback;
  }
}