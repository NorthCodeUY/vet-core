// apps/admin-portal/lib/screens/dashboard_handler.dart
// Propósito: Controlador maestro de navegación del Dashboard administrativo;
// coordina pestañas persistentes (IndexedStack), ajustes del comercio y cierre de sesión JWT.

import 'package:flutter/material.dart';
import 'package:admin_portal/repositories/auth_repository.dart';
import 'package:admin_portal/screens/catalog_handler.dart';
import 'package:admin_portal/screens/login_handler.dart';
import 'package:admin_portal/screens/product_form/product_form_handler.dart';
import 'dashboard_screen.dart';

/// Controlador maestro de navegación y sesión para el Dashboard administrativo.
///
/// Sigue el patrón `Screen + Handler`:
/// - Coordina el índice de navegación inferior (`IndexedStack`) preservando en
///   memoria el estado de cada pestaña sin reconstruir listados ni formularios.
/// - Administra el cierre de sesión seguro revocando el JWT en [AuthRepository].
/// - Delega el renderizado puro de la interfaz shell hacia [DashboardScreen].
class DashboardHandler extends StatefulWidget {
  /// Crea el controlador maestro [DashboardHandler].
  const DashboardHandler({super.key});

  @override
  State<DashboardHandler> createState() => _DashboardHandlerState();
}

class _DashboardHandlerState extends State<DashboardHandler> {
  // ===========================================================================
  // 1. DEPENDENCIAS Y ESTADO DE NAVEGACIÓN
  // ===========================================================================

  /// Repositorio encargado de la persistencia y revocación de tokens JWT.
  final AuthRepository _authRepository = AuthRepository();

  /// Índice activo de la barra inferior (`0`: Catálogo, `1`: Alta, `2`: Cajas).
  int _currentIndex = 0;

  /// Páginas persistentes del `IndexedStack`, declaradas como constantes para evitar recreaciones.
  static const List<Widget> _pages = [
    CatalogHandler(),
    ProductFormHandler(),
    Center(
      child: Text(
        'Módulo de Cajas y Depósito (Próximamente)',
        style: TextStyle(fontWeight: FontWeight.w500),
      ),
    ),
  ];

  // ===========================================================================
  // 2. ACCIONES DE NAVEGACIÓN Y SESIÓN
  // ===========================================================================

  /// Cambia la pestaña activa manteniendo vivo el estado de las demás vistas.
  void _onTabSelected(int index) {
    if (index == _currentIndex) return;
    setState(() => _currentIndex = index);
  }

  /// Despliega opciones operativas del comercio (en desarrollo).
  void _handleSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Ajustes del comercio en desarrollo...'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  /// Revoca la sesión activa en almacenamiento seguro y limpia la pila de rutas.
  Future<void> _handleLogout() async {
    await _authRepository.logout();
    if (!mounted) return;

    // Elimina todo el historial previo para impedir volver al panel con "Atrás".
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginHandler()),
      (Route<dynamic> route) => false,
    );
  }

  // ===========================================================================
  // 3. CONSTRUCCIÓN DE VISTA DECLARATIVA
  // ===========================================================================

  @override
  Widget build(BuildContext context) {
    return DashboardScreen(
      activeIndex: _currentIndex,
      activeBody: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      onTabSelected: _onTabSelected,
      onSettings: _handleSettings,
      onLogout: _handleLogout,
    );
  }
}