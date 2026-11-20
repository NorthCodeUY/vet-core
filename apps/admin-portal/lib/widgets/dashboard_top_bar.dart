// apps/admin-portal/lib/widgets/dashboard_top_bar.dart 

import 'package:flutter/material.dart';

/// Barra de navegación superior administrativa.
/// 
/// Muestra el logotipo institucional inyectado por el tenant y un botón 
/// hamburguesa que despliega el menú de perfil de usuario.
class DashboardTopBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String subtitle;
  final String userName;
  final String userRole;
  final String? userAvatarUrl;
  final VoidCallback onSettingsPressed;
  final VoidCallback onLogoutPressed;

  const DashboardTopBar({
    super.key,
    this.title = 'Vitrina & Catálogo',
    this.subtitle = 'Vitrina',
    this.userName = 'Administrador',
    this.userRole = 'Admin Silo',
    this.userAvatarUrl,
    required this.onSettingsPressed,
    required this.onLogoutPressed,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return AppBar(
      backgroundColor: colorScheme.surfaceContainerLowest,
      elevation: 0,
      scrolledUnderElevation: 1,
      titleSpacing: 16,
      title: Row(
        children: [
          // 1. Isotipo del tenant con fallback
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.asset(
              'assets/tenant/logo.png',
              height: 36,
              width: 36,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => Container(
                height: 36,
                width: 36,
                color: colorScheme.secondaryContainer,
                child: Icon(Icons.storefront, size: 20, color: colorScheme.primary),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // 2. Títulos institucionales
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: colorScheme.onSurface,
                ),
              ),
              Text(
                subtitle,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
      actions: [
        // 3. Menú de Usuario (Hamburguesa con Popup contextual)
        PopupMenuButton<_MenuAction>(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: colorScheme.surfaceContainerHigh,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.menu, size: 20, color: colorScheme.onSurface),
          ),
          offset: const Offset(0, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          onSelected: (action) {
            switch (action) {
              case _MenuAction.settings:
                onSettingsPressed();
                break;
              case _MenuAction.logout:
                onLogoutPressed();
                break;
            }
          },
          itemBuilder: (context) => [
            // Cabecera del popup con datos del perfil
            PopupMenuItem(
              enabled: false,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: colorScheme.primaryContainer,
                    backgroundImage: userAvatarUrl != null
                        ? NetworkImage(userAvatarUrl!)
                        : null,
                    child: userAvatarUrl == null
                        ? Icon(Icons.person, color: colorScheme.onPrimaryContainer)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        userName,
                        style: theme.textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: colorScheme.onSurface,
                        ),
                      ),
                      Text(
                        userRole,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const PopupMenuDivider(),
            // Opción 1: Configurar
            const PopupMenuItem(
              value: _MenuAction.settings,
              child: Row(
                children: [
                  Icon(Icons.settings_outlined, size: 20),
                  SizedBox(width: 12),
                  Text('Configuración'),
                ],
              ),
            ),
            // Opción 2: Cerrar sesión
            PopupMenuItem(
              value: _MenuAction.logout,
              child: Row(
                children: [
                  Icon(Icons.logout, size: 20, color: colorScheme.error),
                  const SizedBox(width: 12),
                  Text('Cerrar Sesión', style: TextStyle(color: colorScheme.error)),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(width: 16),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 4);
}

enum _MenuAction { settings, logout }