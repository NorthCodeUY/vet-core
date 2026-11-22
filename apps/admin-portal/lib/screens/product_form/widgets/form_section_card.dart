// lib/widgets/product_form/form_section_card.dart

import 'package:flutter/material.dart';

/// Contenedor visual reutilizable para agrupar secciones lógicas dentro de
/// formularios extensos (ej. alta/edición de productos).
///
/// Resuelve colores, bordes y tipografía exclusivamente desde el [ThemeData]
/// activo en el contexto para garantizar compatibilidad multi-tenant sin
/// valores de marca hardcodeados.
class FormSectionCard extends StatelessWidget {
  /// Icono semántico que identifica visualmente el propósito de la sección.
  final IconData icon;

  /// Título principal mostrado en la cabecera de la tarjeta.
  final String title;

  /// Widget opcional alineado al extremo derecho de la cabecera
  /// (ej. badges de estado, contadores o botones de acción rápida).
  final Widget? trailing;

  /// Contenido principal del bloque de formulario renderizado bajo la cabecera.
  final Widget child;

  /// Crea una tarjeta de sección de formulario agnóstica al cliente.
  const FormSectionCard({
    super.key,
    required this.icon,
    required this.title,
    this.trailing,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    // Obtiene el esquema de diseño inyectado en runtime por el TenantConfig
    // para evitar colores o estilos estáticos dentro del widget.
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        // Usa la superficie más baja de Material 3 para generar contraste limpio
        // sobre fondos de pantalla sin depender de blancos puros fijos.
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Cabecera de sección: alinea identidad visual a la izquierda y acción opcional a la derecha.
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 20, color: colorScheme.primary),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              if (trailing != null) trailing!,
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}