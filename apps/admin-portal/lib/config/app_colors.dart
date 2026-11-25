// apps/admin-portal/lib/config/app_colors.dart

import 'package:flutter/material.dart';







// <!> Extensión tipada ThemeExtension para tokens de estado (verde éxito/disponible/WhatsApp).
/// Extensión de tema para resolver colores de estado semánticos desde `BuildContext`. <!> mejora el comentario 
class AppStatusColors extends ThemeExtension<AppStatusColors> {
  // <!> comenta mejor esto no se tien ni dea para que es 
  final Color success;
  final Color onSuccess;
  final Color successContainer;
  final Color onSuccessContainer;
  final Color whatsapp;

//<!> constructro  
  const AppStatusColors({
    required this.success,
    required this.onSuccess,
    required this.successContainer,
    required this.onSuccessContainer,
    required this.whatsapp,
  });

  /// Instancia por defecto alineada con la paleta base VetCore.
  static const AppStatusColors fallback = AppStatusColors(
    success: AppColors.success,
    onSuccess: Color(0xFFFFFFFF),
    successContainer: Color(0xFFD1FAE5),
    onSuccessContainer: Color(0xFF065F46),
    whatsapp: AppColors.tertiary,
  );

  /// Resuelve los tokens de estado desde el tema activo con respaldo seguro.
  static AppStatusColors of(BuildContext context) =>
      Theme.of(context).extension<AppStatusColors>() ?? fallback;

  @override
  AppStatusColors copyWith({
    Color? success,
    Color? onSuccess,
    Color? successContainer,
    Color? onSuccessContainer,
    Color? whatsapp,
  }) {
    return AppStatusColors(
      success: success ?? this.success,
      onSuccess: onSuccess ?? this.onSuccess,
      successContainer: successContainer ?? this.successContainer,
      onSuccessContainer: onSuccessContainer ?? this.onSuccessContainer,
      whatsapp: whatsapp ?? this.whatsapp,
    );
  }

//<!> mejora el comentario 
  @override
  AppStatusColors lerp(ThemeExtension<AppStatusColors>? other, double t) {
    if (other is! AppStatusColors) return this;
    return AppStatusColors(
      success: Color.lerp(success, other.success, t) ?? success,
      onSuccess: Color.lerp(onSuccess, other.onSuccess, t) ?? onSuccess,
      successContainer:
          Color.lerp(successContainer, other.successContainer, t) ??
              successContainer,
      onSuccessContainer:
          Color.lerp(onSuccessContainer, other.onSuccessContainer, t) ??
              onSuccessContainer,
      whatsapp: Color.lerp(whatsapp, other.whatsapp, t) ?? whatsapp,
    );
  }
}










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