// apps/admin-portal/lib/features/presentation/login_handler.dart
import 'package:flutter/material.dart';
import 'package:admin_portal/screens/main_website/main_handler.dart';
import '../data/auth_repository.dart';
import '../domain/auth_models.dart';
import 'login_screen.dart';

/// Controlador que orquesta la lógica de autenticación y transiciones de estado.
class LoginHandler extends StatefulWidget {
  const LoginHandler({super.key});

  @override
  State<LoginHandler> createState() => _LoginHandlerState();
}

class _LoginHandlerState extends State<LoginHandler> {
  final _formKey = GlobalKey<FormState>();
  final _userController = TextEditingController();
  final _passwordController = TextEditingController();

  final AuthRepository _authRepository = AuthRepository();

  bool _isPasswordVisible = false;
  bool _isLoading = false;

  /// Alterna la visibilidad de la contraseña.
  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  /// Envía el formulario y valida contra FastAPI.
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

      // Navegación limpia al Dashboard eliminando el Login del stack
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const MainHandler()),
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
      if (mounted) {
        setState(() => _isLoading = false);
      }
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