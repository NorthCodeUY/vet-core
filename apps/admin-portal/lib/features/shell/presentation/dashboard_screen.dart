// lib/features/shell/presentation/dashboard_screen.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/features/catalog/presentation/catalog_screen.dart';

/// Pantalla base del Dashboard administrativo.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {

    return const CatalogScreen();

    // final theme = Theme.of(context);
    // final colorScheme = theme.colorScheme;

    // return Scaffold(
    //   appBar: AppBar(
    //     title: const Text('Panel de Control - Vitrina'),
    //     backgroundColor: colorScheme.primary,
    //     foregroundColor: colorScheme.onPrimary,
    //     actions: [
    //       IconButton(
    //         tooltip: 'Cerrar sesión',
    //         icon: const Icon(Icons.logout),
    //         onPressed: () async {
    //           await AuthRepository().logout();
    //           if (context.mounted) {
    //             Navigator.of(context).pushAndRemoveUntil(
    //               MaterialPageRoute(builder: (_) => const LoginHandler()),
    //               (route) => false,
    //             );
    //           }
    //         },
    //       ),
    //     ],
    //   ),
    //   body: Center(
    //     child: Column(
    //       mainAxisAlignment: MainAxisAlignment.center,
    //       children: [
    //         Icon(Icons.check_circle_outline, size: 80, color: colorScheme.primary),
    //         const SizedBox(height: 16),
    //         Text(
    //           '¡Sesión iniciada correctamente!',
    //           style: theme.textTheme.headlineSmall,
    //         ),
    //         const SizedBox(height: 8),
    //         Text(
    //           'Próximo paso: Gestión de productos y vitrina',
    //           style: theme.textTheme.bodyMedium?.copyWith(
    //             color: colorScheme.onSurfaceVariant,
    //           ),
    //         ),
    //       ],
    //     ),
    //   ),
    // );
  
  
  }
}