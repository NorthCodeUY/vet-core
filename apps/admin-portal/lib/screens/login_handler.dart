// apps/admin-portal/lib/screens/login_handler.dart
// Propósito: Controlar el ciclo de autenticación, restaurar sesión JWT activa y notificar autofill al SO.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:admin_portal/models/auth_models.dart';
import 'package:admin_portal/repositories/auth_repository.dart';
import 'package:admin_portal/screens/dashboard_handler.dart';
import 'package:admin_portal/screens/login_screen.dart';

/// Controlador de estado encargado del flujo de autenticación y restauración de sesión.
///
/// Al montarse en el árbol de widgets, consulta [AuthRepository] para determinar
/// si existe un JWT vigente. En caso afirmativo, redirige al [DashboardHandler]
/// evitando mostrar el formulario de credenciales.
class LoginHandler extends StatefulWidget {
  /// Crea el controlador de inicio de sesión.
  const LoginHandler({super.key});

  @override
  State<LoginHandler> createState() => _LoginHandlerState();
}

/// Estado interno de [LoginHandler].
class _LoginHandlerState extends State<LoginHandler> {
  // --- Estado y Dependencias ---

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final AuthRepository _authRepository = AuthRepository();

  bool _isPasswordVisible = false;
  bool _isLoading = false;
  bool _isCheckingSession = true;

  // --- Ciclo de Vida / Inicialización ---

  @override
  void initState() {
    super.initState();
    _restoreSessionOrPrefillUser();
  }

  @override
  void dispose() {
    _userController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // --- Acciones Públicas ---

  @override
  Widget build(BuildContext context) {
    return LoginScreen(
      formKey: _formKey,
      userController: _userController,
      passwordController: _passwordController,
      isPasswordVisible: _isPasswordVisible,
      isLoading: _isLoading,
      isCheckingSession: _isCheckingSession,
      onPasswordVisibilityToggle: _togglePasswordVisibility,
      onSubmit: _submitForm,
    );
  }

  // --- Helpers Privados ---

  /// Hidrata la sesión al arranque; si no hay token válido, precarga el último usuario.
  Future<void> _restoreSessionOrPrefillUser() async {
    final hasSession = await _authRepository.hasActiveSession();
    if (!mounted) return;

    if (hasSession) {
      _navigateToDashboard();
      return;
    }

    final lastUser = await _authRepository.getLastUsername();
    if (!mounted) return;

    if (lastUser != null && lastUser.isNotEmpty) {
      _userController.text = lastUser;
    }

    setState(() => _isCheckingSession = false);
  }

  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  Future<void> _submitForm() async {
    if (_isLoading || !_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final credentials = LoginCredentials(
        username: _userController.text.trim(),
        password: _passwordController.text.trim(),
      );

      await _authRepository.login(credentials);

      // Notifica al navegador/SO que el login fue exitoso para ofrecer guardar la contraseña.
      TextInput.finishAutofillContext(shouldSave: true);

      if (!mounted) return;
      _navigateToDashboard();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceAll('Exception: ', '')),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _navigateToDashboard() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const DashboardHandler()),
      (route) => false,
    );
  }
}