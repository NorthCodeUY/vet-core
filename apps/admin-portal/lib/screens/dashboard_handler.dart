// lib/screens/dashboard_handler.dart

import 'package:flutter/material.dart';

// Repositorios de infraestructura
import 'package:admin_portal/repositories/auth_repository.dart';

// Controladores de módulos secundarios
import 'package:admin_portal/screens/catalog_handler.dart';
import 'package:admin_portal/screens/product_form/product_form_handler.dart';

// IMPORT VERIFICADO: Resuelve la pantalla de destino para el cierre de sesión
import 'package:admin_portal/screens/login_handler.dart';

// Vista de presentación pura (Shell UI)
import 'dashboard_screen.dart';





/// Controlador maestro de navegación y estado para el Dashboard administrativo.
///
/// Implementa el patrón **Screen + Handler**:
/// 1. Coordina el índice de navegación inferior (`IndexedStack`) preservando
///    el estado de los formularios y listados en memoria sin reconstruirlos.
/// 2. Administra la revocación segura de credenciales JWT mediante [AuthRepository].
/// 3. Redirige al flujo de autenticación destruyendo la pila previa de navegación.
class DashboardHandler extends StatefulWidget {
  /// Constructor constante para optimización de árbol de widgets.
  const DashboardHandler({super.key});

  @override
  State<DashboardHandler> createState() => _DashboardHandlerState();
}

/// Estado asociado a [DashboardHandler].
class _DashboardHandlerState extends State<DashboardHandler> {
  /// Instancia de acceso a almacenamiento seguro y revocación de sesión.
  final AuthRepository _authRepository = AuthRepository();

  /// Índice actual de la barra de navegación inferior.
  /// 0: Inventario/Vitrina | 1: Alta de Producto | 2: Cajas/Depósito
  int _currentIndex = 0;

  /// Cambia de pestaña activa sin destruir las vistas subyacentes.
  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  /// Cierra la sesión activa en el silo FastAPI y limpia el árbol de rutas.
  Future<void> _handleLogout() async {
    // 1. Elimina el token JWT almacenado en FlutterSecureStorage
    await _authRepository.logout();

    // 2. Verificación de resiliencia ante desmontaje del widget durante el await
    if (!mounted) return;

    // 3. Destrucción total de la pila: impide que el botón 'Atrás' regrese al dashboard
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginHandler()),
      (Route<dynamic> route) => false,
    );
  }

  /// Despliega opciones de parametrización del comercio (En desarrollo).
  void _handleSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Ajustes del comercio en desarrollo...'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Definición de las 3 páginas hijas persistentes
    final List<Widget> pages = [
      const CatalogHandler(),          // Índice 0: Catálogo y control de vitrina
      const ProductFormHandler(),       // Índice 1: Alta / edición rápida
      const Center(                     // Índice 2: Logística y trazabilidad física
        child: Text(
          'Módulo de Cajas y Depósito (Próximamente)',
          style: TextStyle(fontWeight: FontWeight.w500),
        ),
      ),
    ];

    // Delegación limpia a la pantalla puramente declarativa
    return DashboardScreen(
      activeIndex: _currentIndex,
      activeBody: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      onTabSelected: _onTabSelected,
      onSettings: _handleSettings,
      onLogout: _handleLogout,
    );
  }
}