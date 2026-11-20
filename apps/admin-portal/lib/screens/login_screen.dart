// apps/admin-portal/lib/screens/login_screen.dart
// Propósito: Renderizar la vista declarativa de inicio de sesión con soporte de autofill y tema del tenant.

import 'package:flutter/material.dart';

/// Vista declarativa (Stateless) de inicio de sesión administrativo.
///
/// Carece de lógica HTTP y delega intenciones a [LoginHandler]. Incorpora
/// [AutofillGroup] para habilitar el guardado y autocompletado de credenciales
/// en navegadores Web y gestores de contraseñas nativos.
class LoginScreen extends StatelessWidget {
  // --- Estado y Dependencias ---

  /// Clave global utilizada para validar el formulario antes del envío.
  final GlobalKey<FormState> formKey;

  /// Controlador del campo de usuario o correo electrónico.
  final TextEditingController userController;

  /// Controlador del campo de contraseña.
  final TextEditingController passwordController;

  /// Controla si la contraseña se muestra en texto claro u ofuscada.
  final bool isPasswordVisible;

  /// Bloquea múltiples envíos mientras la petición OAuth2 está en curso.
  final bool isLoading;

  /// Indica si se está verificando un JWT almacenado al iniciar la aplicación.
  final bool isCheckingSession;

  /// Callback al alternar la visibilidad de la contraseña.
  final VoidCallback onPasswordVisibilityToggle;

  /// Callback al confirmar el inicio de sesión.
  final VoidCallback onSubmit;

  /// Construye la vista pura de autenticación con los callbacks y controladores provistos por el handler.
  const LoginScreen({
    super.key,
    required this.formKey,
    required this.userController,
    required this.passwordController,
    required this.isPasswordVisible,
    required this.isLoading,
    required this.onPasswordVisibilityToggle,
    required this.onSubmit,
    this.isCheckingSession = false,
  });

  // --- Acciones Públicas ---

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Evita un parpadeo del formulario mientras se verifica el JWT en almacenamiento seguro.
    if (isCheckingSession) {
      return Scaffold(
        backgroundColor: colorScheme.surface,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildTenantLogo(colorScheme),
              const SizedBox(height: 24),
              const CircularProgressIndicator(),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: colorScheme.surface,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: ConstrainedBox(
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
                child: AutofillGroup(
                  child: Form(
                    key: formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildTenantLogo(colorScheme),
                        const SizedBox(height: 24),
                        Text(
                          'Acceso Administrativo',
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Ingrese credenciales para gestionar el comercio',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(height: 32),
                        TextFormField(
                          controller: userController,
                          keyboardType: TextInputType.emailAddress,
                          autofillHints: const [
                            AutofillHints.username,
                            AutofillHints.email,
                          ],
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
                        TextFormField(
                          controller: passwordController,
                          obscureText: !isPasswordVisible,
                          autofillHints: const [AutofillHints.password],
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
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: FilledButton(
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
      ),
    );
  }

  // --- Helpers Privados ---

  Widget _buildTenantLogo(ColorScheme colorScheme) {
    return Image.asset(
      'assets/tenant/logo.png',
      height: 70,
      errorBuilder: (context, error, stackTrace) => Icon(
        Icons.storefront_rounded,
        size: 70,
        color: colorScheme.primary,
      ),
    );
  }
}