// apps/admin-portal/lib/screens/dashboard_screen.dart
// Propósito: Vista declarativa pura del Shell Administrativo que ensambla la barra
// superior, el banner de ciclo de vida PWA, el cuerpo persistente y la barra inferior.

import 'package:flutter/material.dart';
import 'package:admin_portal/widgets/dashboard_bottom_bar.dart';
import 'package:admin_portal/widgets/dashboard_top_bar.dart';
import 'package:admin_portal/widgets/pwa_status_banner.dart';

/// Vista puramente declarativa del Shell Administrativo.
///
/// Sigue el patrón `Screen + Handler`: no administra estado de sesión, índices
/// de navegación ni lógica de red; recibe el contenido activo desde
/// `DashboardHandler` y delega todas las intenciones mediante callbacks.
class DashboardScreen extends StatelessWidget {
  // ===========================================================================
  // 1. ESTADO Y CALLBACKS DELEGADOS POR EL HANDLER
  // ===========================================================================

  /// Índice de la pestaña actualmente activa en [DashboardBottomBar].
  final int activeIndex;

  /// Contenido principal del módulo seleccionado (habitualmente un `IndexedStack`).
  final Widget activeBody;

  /// Callback disparado al seleccionar una pestaña en la barra inferior.
  final ValueChanged<int> onTabSelected;

  /// Callback disparado desde el menú superior para abrir ajustes del comercio.
  final VoidCallback onSettings;

  /// Callback disparado desde el menú superior para revocar la sesión JWT.
  final VoidCallback onLogout;

  // ===========================================================================
  // 2. CONSTRUCTOR
  // ===========================================================================

  /// Construye el contenedor estructural [DashboardScreen].
  const DashboardScreen({
    super.key,
    required this.activeIndex,
    required this.activeBody,
    required this.onTabSelected,
    required this.onSettings,
    required this.onLogout,
  });

  // ===========================================================================
  // 3. CONSTRUCCIÓN DE INTERFAZ
  // ===========================================================================

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      // Resuelve el fondo desde el ColorScheme del tenant (Zero Hardcoding).
      backgroundColor: colorScheme.surface,
      appBar: DashboardTopBar(
        onSettingsPressed: onSettings,
        onLogoutPressed: onLogout,
      ),
      // Coloca PwaStatusBanner sobre el módulo activo sin alterar el espacio de tabs.
      body: Column(
        children: [
          const PwaStatusBanner(),
          Expanded(child: activeBody),
        ],
      ),
      bottomNavigationBar: DashboardBottomBar(
        currentIndex: activeIndex,
        onTabSelected: onTabSelected,
      ),
    );
  }
}