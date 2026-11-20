// apps/admin-portal/lib/screens/login_screen.dart

import 'package:flutter/material.dart';

/// Componente de presentación puro (Stateless) para la vista de inicio de sesión.
///
/// Diseñado bajo el principio de inversión de dependencias:
/// - No contiene llamadas a servicios de red ni lógica de validación interna.
/// - Delega las acciones al controlador [LoginHandler] mediante callbacks.
/// - Se adapta dinámicamente al [ColorScheme] inyectado por el tenant activo.
class LoginScreen extends StatelessWidget {
  /// Clave global utilizada para activar las validaciones del formulario.
  final GlobalKey<FormState> formKey;

  /// Controlador de texto para capturar el identificador o correo del usuario.
  final TextEditingController userController;

  /// Controlador de texto para capturar la contraseña de acceso.
  final TextEditingController passwordController;

  /// Bandera booleana que controla la ofuscación del campo de contraseña.
  final bool isPasswordVisible;

  /// Estado de carga que inhabilita el botón e inserta un spinner durante la petición HTTP.
  final bool isLoading;

  /// Callback ejecutado al presionar el icono de visibilidad (ojo) en el campo de clave.
  final VoidCallback onPasswordVisibilityToggle;

  /// Callback ejecutado al presionar el botón principal o confirmar el formulario.
  final VoidCallback onSubmit;

  const LoginScreen({
    super.key,
    required this.formKey,
    required this.userController,
    required this.passwordController,
    required this.isPasswordVisible,
    required this.isLoading,
    required this.onPasswordVisibilityToggle,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    // Extracción de tokens semánticos dinámicos del tenant actual (Material 3)
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: Center(
        // Garantiza scroll en pantallas pequeñas o cuando el teclado virtual emerge
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: ConstrainedBox(
            // Limita el ancho del contenedor en navegadores de escritorio y tablets
            constraints: const BoxConstraints(maxWidth: 420),
            child: Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(
                  color: colorScheme.outlineVariant.withValues(alpha: 0.5),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // =======================================================
                      // 1. ISOLOGO DINÁMICO DEL TENANT
                      // =======================================================
                      Image.asset(
                        'assets/tenant/logo.png',
                        height: 70,
                        // Fallback: Si el comercio no configuró logo local, muestra icono genérico
                        errorBuilder: (context, error, stackTrace) => Icon(
                          Icons.storefront_rounded,
                          size: 70,
                          color: colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Título institucional
                      Text(
                        'Acceso Administrativo',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Subtítulo informativo
                      Text(
                        'Ingrese credenciales para gestionar el comercio',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // =======================================================
                      // 2. CAMPO: IDENTIFICADOR / USUARIO
                      // =======================================================
                      TextFormField(
                        controller: userController,
                        textInputAction: TextInputAction.next,
                        decoration: InputDecoration(
                          labelText: 'Usuario o Correo',
                          prefixIcon: const Icon(Icons.person_outline),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'El usuario es obligatorio';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // =======================================================
                      // 3. CAMPO: CONTRASEÑA OFUSCABLE
                      // =======================================================
                      TextFormField(
                        controller: passwordController,
                        obscureText: !isPasswordVisible,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => onSubmit(),
                        decoration: InputDecoration(
                          labelText: 'Contraseña',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(
                              isPasswordVisible
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                            onPressed: onPasswordVisibilityToggle,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'La contraseña es obligatoria';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 28),

                      // =======================================================
                      // 4. ACCIÓN: BOTÓN DE AUTENTICACIÓN REACTIVO
                      // =======================================================
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: FilledButton(
                          // Inhabilita interacciones concurrentes durante la petición a FastAPI
                          onPressed: isLoading ? null : onSubmit,
                          style: FilledButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: isLoading
                              ? SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: colorScheme.onPrimary,
                                  ),
                                )
                              : const Text(
                                  'Iniciar Sesión',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}