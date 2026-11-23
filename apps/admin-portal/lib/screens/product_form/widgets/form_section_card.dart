// apps/admin-portal/lib/screens/product_form/widgets/form_section_card.dart

import 'package:flutter/material.dart';

/// Contenedor visual reutilizable para agrupar secciones lógicas dentro de
/// formularios extensos (ej. alta y edición de productos).
///
/// Resuelve colores, bordes y tipografía exclusivamente desde el [ThemeData]
/// activo en el contexto (tokens dinámicos del tenant) y utiliza [Material]
/// como superficie raíz para garantizar que [ListTile] y [SwitchListTile]
/// internos rendericen su fondo e ink splashes sin excepciones en consola.
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

  /// Espaciado interno configurable de la tarjeta; por defecto `16.0` en todos los lados.
  final EdgeInsetsGeometry padding;

  /// Crea una tarjeta de sección de formulario agnóstica al cliente.
  const FormSectionCard({
    super.key,
    required this.icon,
    required this.title,
    this.trailing,
    required this.child,
    this.padding = const EdgeInsets.all(16.0),
  });

  @override
  Widget build(BuildContext context) {
    // Obtiene los tokens de diseño inyectados en runtime por el TenantConfig.
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Se usa Material directamente (sin Container/DecoratedBox intermedio con color)
    // para que cualquier ListTile/SwitchListTile descendiente encuentre una
    // superficie Material contigua donde pintar su selección y efecto ripple.
    return Material(
      color: colorScheme.surfaceContainerLowest,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: colorScheme.outlineVariant.withValues(alpha: 0.3),
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: padding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _SectionCardHeader(
              icon: icon,
              title: title,
              trailing: trailing,
            ),
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );
  }
}

/// Cabecera interna de [FormSectionCard] protegida contra desbordamientos
/// horizontales cuando el título o el widget [trailing] son extensos.
class _SectionCardHeader extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget? trailing;

  const _SectionCardHeader({
    required this.icon,
    required this.title,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Row(
            children: [
              Icon(icon, size: 20, color: colorScheme.primary),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
        if (trailing != null) ...[
          const SizedBox(width: 8),
          trailing!,
        ],
      ],
    );
  }
}