// lib/screens/login_handler.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/auth_models.dart';
import 'package:admin_portal/repositories/auth_repository.dart';
import 'package:admin_portal/screens/dashboard_handler.dart';
import 'login_screen.dart';

/// Controlador de Estado para la pantalla de Autenticación.
class LoginHandler extends StatefulWidget {
  const LoginHandler({super.key});

  // CREACESTATE LIMPIO: Función flecha directa sin bloques de lógica interna
  @override
  State<LoginHandler> createState() => _LoginHandlerState();
}

/// Estado asociado a [LoginHandler].
// DEFINICIÓN CORRECTA: Debe extender State<LoginHandler>
class _LoginHandlerState extends State<LoginHandler> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final AuthRepository _authRepository = AuthRepository();

  bool _isPasswordVisible = false;
  bool _isLoading = false;

  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final credentials = LoginCredentials(
        username: _userController.text.trim(),
        password: _passwordController.text.trim(),
      );

      await _authRepository.login(credentials);

      if (!mounted) return;

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const DashboardHandler()),
        (route) => false,
      );
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

  @override
  void dispose() {
    _userController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LoginScreen(
      formKey: _formKey,
      userController: _userController,
      passwordController: _passwordController,
      isPasswordVisible: _isPasswordVisible,
      isLoading: _isLoading,
      onPasswordVisibilityToggle: _togglePasswordVisibility,
      onSubmit: _submitForm,
    );
  }
}