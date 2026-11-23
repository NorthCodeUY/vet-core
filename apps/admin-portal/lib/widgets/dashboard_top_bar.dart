// apps/admin-portal/lib/widgets/dashboard_top_bar.dart
// Propósito: Barra de navegación superior administrativa con identidad visual del tenant
// y menú contextual para ajustes, actualización rápida PWA y cierre de sesión.

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:admin_portal/services/pwa/pwa_service.dart';

/// Barra de navegación superior administrativa (`PreferredSizeWidget`).
///
/// Muestra el isotipo institucional inyectado en `assets/tenant/logo.png`,
/// el título contextual de la sección y un menú desplegable con perfil del
/// operador, ajustes del comercio, actualización PWA (en Web) y cierre de sesión.
class DashboardTopBar extends StatelessWidget implements PreferredSizeWidget {
  // ===========================================================================
  // 1. PROPIEDADES Y CALLBACKS
  // ===========================================================================

  /// Título principal mostrado junto al imagotipo del comercio.
  final String title;

  /// Subtítulo contextual de módulo o entorno activo.
  final String subtitle;

  /// Nombre visible del operador autenticado en la cabecera del menú.
  final String userName;

  /// Rol o nivel de acceso asignado al usuario dentro del silo.
  final String userRole;

  /// URL opcional del avatar del operador; si es nula, renderiza ícono por defecto.
  final String? userAvatarUrl;

  /// Callback ejecutado al seleccionar la opción `Configuración`.
  final VoidCallback onSettingsPressed;

  /// Callback ejecutado al seleccionar la opción `Cerrar Sesión`.
  final VoidCallback onLogoutPressed;

  // ===========================================================================
  // 2. CONSTRUCTOR
  // ===========================================================================

  /// Construye la barra superior [DashboardTopBar] con tokens del tema activo.
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

  // ===========================================================================
  // 3. CONSTRUCCIÓN DE INTERFAZ
  // ===========================================================================

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
          // 1. Isotipo inyectado por el tenant con respaldo semántico ante ausencia.
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
                child: Icon(
                  Icons.storefront,
                  size: 20,
                  color: colorScheme.primary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // 2. Títulos institucionales de la sección actual.
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
        // 3. Menú contextual de operador (Ajustes, actualización PWA y Logout).
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
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          onSelected: (action) {
            switch (action) {
              case _MenuAction.settings:
                onSettingsPressed();
                break;
              case _MenuAction.refreshApp:
                // Limpia cachés del Service Worker y recarga la versión más reciente.
                PwaService.applyUpdateAndReload();
                break;
              case _MenuAction.logout:
                onLogoutPressed();
                break;
            }
          },
          itemBuilder: (context) => [
            // Cabecera informativa no seleccionable con perfil del usuario.
            PopupMenuItem<_MenuAction>(
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
                        ? Icon(
                            Icons.person,
                            color: colorScheme.onPrimaryContainer,
                          )
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

            // Opción 1: Ajustes operativos del comercio.
            const PopupMenuItem<_MenuAction>(
              value: _MenuAction.settings,
              child: Row(
                children: [
                  Icon(Icons.settings_outlined, size: 20),
                  SizedBox(width: 12),
                  Text('Configuración'),
                ],
              ),
            ),

            // Opción 2: Actualización forzada en Web/PWA para reflejar deploys recientes.
            if (kIsWeb)
              const PopupMenuItem<_MenuAction>(
                value: _MenuAction.refreshApp,
                child: Row(
                  children: [
                    Icon(Icons.system_update_alt, size: 20),
                    SizedBox(width: 12),
                    Text('Actualizar versión'),
                  ],
                ),
              ),

            // Opción 3: Cierre de sesión seguro (token JWT).
            PopupMenuItem<_MenuAction>(
              value: _MenuAction.logout,
              child: Row(
                children: [
                  Icon(Icons.logout, size: 20, color: colorScheme.error),
                  const SizedBox(width: 12),
                  Text(
                    'Cerrar Sesión',
                    style: TextStyle(color: colorScheme.error),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(width: 16),
      ],
    );
  }

  /// Altura fija estándar incrementada en 4 px para mantener margen visual cómodo.
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 4);
}

/// Acciones disponibles dentro del menú contextual de [DashboardTopBar].
enum _MenuAction {
  /// Abre los ajustes generales del comercio.
  settings,

  /// Limpia caché del Service Worker y recarga la PWA.
  refreshApp,

  /// Revoca la sesión activa y regresa al login.
  logout,
}