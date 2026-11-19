// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:admin_portal/core/config/tenant_config.dart';
import 'package:admin_portal/features/auth/presentation/login_handler.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Carga inicial agnóstica de configuración del tenant
  final tenantConfig = await TenantConfig.loadFromAssets();

  runApp(VetCoreAdminApp(config: tenantConfig));
}

class VetCoreAdminApp extends StatelessWidget {
  final TenantConfig config;

  const VetCoreAdminApp({super.key, required this.config});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: config.businessName,
      debugShowCheckedModeBanner: false,
      
      // Localización estándar
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('es', 'ES'),
      ],

      // <!> TEMA DINÁMICO: Inyección de color primario y secundario del tenant
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

      // Inicia directamente en la pantalla de autenticación
      home: const LoginHandler(),
    );
  }
}