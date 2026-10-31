// apps/admin-portal/lib/features/presentation/login_screen.dart

import 'package:flutter/material.dart';

/// Pantalla puramente visual para la autenticación de administradores.
class LoginScreen extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController userController;
  final TextEditingController passwordController;
  final bool isPasswordVisible;
  final bool isLoading;
  final VoidCallback onPasswordVisibilityToggle;
  final VoidCallback onSubmit;

  const LoginScreen({Paso 5: El Endpoint que espera FastAPI
En tu backend (FastAPI), el endpoint esperado para este login es el estándar:
code
Python
￼
download
￼
content_copy
￼
expand_less
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Aquí validas contra la base de datos PostgreSQL de este tenant
    # form_data.username y form_data.password
    if form_data.username != "admin" or form_data.password != "admin123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generas el JWT
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
    super.key,
    required this.formKey, // la llave del formulario
    required this.userController, // el controlador del usuario
    required this.passwordController, // el controlador de la contraseña
    required this.isPasswordVisible, // si la contraseña es visible
    required this.isLoading, // si el usuario está cargando
    required this.onPasswordVisibilityToggle, // el toggle de la contraseña
    required this.onSubmit, // el submit del formulario
  });

  @override
  Widget build(BuildContext context) { // build es el método que se encarga de construir la interfaz de usuario
    final theme = Theme.of(context); // el tema de la aplicación
    final colorScheme = theme.colorScheme; // el esquema de colores de la aplicación

    return Scaffold(
      backgroundColor: colorScheme.surface, // el color de fondo de la pantalla
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0), // padding horizontal y vertical
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420), // el ancho máximo de la pantalla
            child: Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: colorScheme.outlineVariant.withOpacity(0.5)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // LOGO DINÁMICO: Carga el logo inyectado por el tenant
                      Image.asset(
                        'assets/tenant/logo.png',
                        height: 70,
                        errorBuilder: (_, __, ___) => Icon(
                          Icons.storefront_rounded,
                          size: 70,
                          color: colorScheme.primary,
                        ),
                      ),
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
                        'Ingrese sus credenciales para gestionar el comercio',
                        textAlign: TextAlign.center,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Campo de Usuario
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

                      // Campo de Contraseña
                      TextFormField(
                        controller: passwordController,
                        obscureText: !isPasswordVisible,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => onSubmit(),
                        decoration: InputDecoration(
                          labelText: 'Contraseña',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton( // boton para mostrar u ocultar la contraseña
                            icon: Icon(
                              isPasswordVisible // si la contraseña es visible
                                  ? Icons.visibility_outlined // mostrar la contraseña
                                  : Icons.visibility_off_outlined, // ocultar la contraseña
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

                      // Botón de Inicio de Sesión Reactivo
                      SizedBox(
                        width: double.infinity, // el boton ocupa todo el ancho disponible
                        height: 48, // el boton tiene una altura de 48 pixeles
                        child: FilledButton( // boton de tipo "FilledButton"
                          onPressed: isLoading ? null : onSubmit, // si el usuario está cargando, el boton no se puede presionar
                          style: FilledButton.styleFrom( // estilo del boton
                            shape: RoundedRectangleBorder( // forma del boton
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: isLoading // si el usuario está cargando
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