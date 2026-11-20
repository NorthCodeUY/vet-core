// apps/admin-portal/lib/config/app_colors.dart

import 'package:flutter/material.dart';

/// Paleta de colores base y tokens semánticos del sistema VetCore.
///
/// Sirve como referencia estática para valores por defecto (fallback)
/// y provee utilidades para extraer colores contextuales inyectados por el tenant.
abstract final class AppColors {
  // ===========================================================================
  // 1. VALORES POR DEFECTO (FALLBACKS RESILIENTES)
  // ===========================================================================
  static const Color primary = Color(0xFF275D9E);
  static const Color primaryHover = Color(0xFF1E4B82);
  static const Color secondary = Color(0xFFDAEBD4);
  static const Color tertiary = Color(0xFF1FAF38); // WhatsApp / Canales directos

  // Fondos y Superficies
  static const Color dark = Color(0xFF004D40);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color soft = Color(0xFFDBECD5);
  static const Color overlay = Color(0x80000000); // 50% de opacidad

  // Tipografía y Jerarquía
  static const Color textBase = Color(0xFF0B1C30);
  static const Color textMuted = Color(0xFF64748B);

  // Bordes y Estados
  static const Color borderSubtle = Color(0xFFE2E8F0);
  static const Color error = Color(0xFFDC2626);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color success = Color(0xFF006C4A);
  static const Color warning = Color(0xFFFFB95F);
  static const Color background = Color(0xFFF8FAFC);
  

  // ===========================================================================
  // 2. RESOLUCIÓN DINÁMICA POR CONTEXTO (ZERO HARDCODING)
  // ===========================================================================
  /// Resuelve el color primario del tenant montado en el BuildContext actual.
  static Color ofPrimary(BuildContext context) =>
      Theme.of(context).colorScheme.primary;

  /// Resuelve el color secundario del tenant montado en el BuildContext actual.
  static Color ofSecondary(BuildContext context) =>
      Theme.of(context).colorScheme.secondary;

  /// Resuelve la superficie neutra del tenant actual.
  static Color ofSurface(BuildContext context) =>
      Theme.of(context).colorScheme.surface;

  /// Resuelve el color de error semántico del tenant actual.
  static Color ofError(BuildContext context) =>
      Theme.of(context).colorScheme.error;
}