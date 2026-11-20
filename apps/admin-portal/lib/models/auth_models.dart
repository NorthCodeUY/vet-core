// apps/admin-portal/lib/models/auth_models.dart

/// Credenciales necesarias para autenticarse en FastAPI mediante OAuth2 Password Flow.
class LoginCredentials {
  final String username;
  final String password;

  const LoginCredentials({
    required this.username,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
    'username': username,
    'password': password,
  };
}

/// Representación de la sesión autenticada con JWT.
class AuthSession {
  final String accessToken;
  final String tokenType;

  const AuthSession({
    required this.accessToken,
    required this.tokenType,
  });

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    return AuthSession(
      accessToken: json['access_token'] as String,
      tokenType: json['token_type'] as String? ?? 'bearer',
    );
  }
}