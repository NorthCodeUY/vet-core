// apps/admin-portal/lib/main.dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

// Inyección de configuración agnóstica del tenant (Zero-Hardcoding)
import 'package:admin_portal/config/tenant_config.dart';

// Controlador de autenticación inicial
import 'package:admin_portal/screens/login_handler.dart';





/// Punto de entrada principal (Bootstrap) del Portal Administrativo VetCore.
///
/// Ciclo de inicialización:
/// 1. Garantiza el enlace de canales de comunicación nativos (`WidgetsFlutterBinding`).
/// 2. Lee e hidrata en memoria el archivo de configuración del comercio activo (`TenantConfig`).
/// 3. Inyecta la instancia en el árbol raíz para parametrizar temas, rutas y características.
void main() async {
  // Asegura la comunicación entre la capa nativa y el framework antes de ejecutar tareas asíncronas
  WidgetsFlutterBinding.ensureInitialized();

  // Lectura del archivo assets/tenant/config.json inyectado por Docker o entorno local
  final tenantConfig = await TenantConfig.loadFromAssets();

  // Montaje de la aplicación con la identidad corporativa resuelta
  runApp(VetCoreAdminApp(config: tenantConfig));
}

/// Contenedor maestro de la aplicación (Root Widget).
///
/// Gestiona la configuración global de Material 3, localización en español
/// y la inyección dinámica de la paleta cromática corporativa.
class VetCoreAdminApp extends StatelessWidget {
  /// Configuración tipada que contiene colores, feature flags y marcas del cliente.
  final TenantConfig config;

  const VetCoreAdminApp({super.key, required this.config});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Título en pestañas de navegador y switcher de tareas en móviles
      title: config.businessName,
      debugShowCheckedModeBanner: false,

      // Delegados de localización regional (Formateo de fechas, números y textos base)
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('es', 'ES'), // Localización en idioma español por defecto
      ],

      // =======================================================================
      // MOTOR DE TEMA DINÁMICO (ZERO HARDCODING)
      // Genera un ColorScheme armónico a partir de los códigos hex del cliente
      // =======================================================================
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: config.theme.primary,
          primary: config.theme.primary,
          secondary: config.theme.secondary,
          error: config.theme.error,
          surface: config.theme.surface,
        ),
      ),

      // Entrada inicial del flujo operativo: Controlador de Autenticación
      home: const LoginHandler(),
    );
  }
}