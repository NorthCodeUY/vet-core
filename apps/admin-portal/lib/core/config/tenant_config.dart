// lib/core/config/tenant_config.dart

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Modelo de identidad y personalización del comercio.
/// 
/// 100% agnóstico a la infraestructura de red.
class TenantConfig {
  final String id;
  final String businessName;
  final TenantTheme theme;
  final TenantFeatures features;
  final String logoUrl;

  const TenantConfig({
    required this.id,
    required this.businessName,
    required this.theme,
    required this.features,
    required this.logoUrl,
  });

  /// Carga el JSON de marca montado para el tenant activo
  static Future<TenantConfig> loadFromAssets() async {
    try {
      final jsonString = await rootBundle.loadString('assets/tenant/config.json');
      final Map<String, dynamic> data = json.decode(jsonString);
      return TenantConfig.fromJson(data);
    } catch (e) {
      debugPrint('⚠️ Advertencia: No se encontró assets/tenant/config.json, usando fallback: $e');
      return TenantConfig.fallback();
    }
  }

  factory TenantConfig.fromJson(Map<String, dynamic> json) {
    return TenantConfig(
      id: json['id'] ?? 'default_tenant',
      businessName: json['business_name'] ?? 'Portal Administrativo',
      theme: TenantTheme.fromJson(json['theme'] ?? {}),
      features: TenantFeatures.fromJson(json['features'] ?? {}),
      logoUrl: json['branding']?['logo_url'] ?? 'assets/tenant/logo.png',
    );
  }

  factory TenantConfig.fallback() {
    return const TenantConfig(
      id: 'default',
      businessName: 'VetCore Admin',
      theme: TenantTheme(
        primary: Color(0xFF275D9E),
        secondary: Color(0xFFDAEBD4),
        dark: Color(0xFF004D40),
        surface: Colors.white,
        error: Color(0xFFDC2626),
      ),
      features: TenantFeatures(
        hasProducts: true,
        hasServices: true,
        hasAppointments: false,
        hasHealthPlans: false,
      ),
      logoUrl: '',
    );
  }
}

class TenantTheme {
  final Color primary;
  final Color secondary;
  final Color dark;
  final Color surface;
  final Color error;

  const TenantTheme({
    required this.primary,
    required this.secondary,
    required this.dark,
    required this.surface,
    required this.error,
  });

  factory TenantTheme.fromJson(Map<String, dynamic> json) {
    return TenantTheme(
      primary: _hexToColor(json['primary'], const Color(0xFF275D9E)),
      secondary: _hexToColor(json['secondary'], const Color(0xFFDAEBD4)),
      dark: _hexToColor(json['dark'], const Color(0xFF004D40)),
      surface: _hexToColor(json['surface'], Colors.white),
      error: _hexToColor(json['error'], const Color(0xFFDC2626)),
    );
  }

  static Color _hexToColor(String? hexString, Color fallback) {
    if (hexString == null || hexString.isEmpty) return fallback;
    final cleanHex = hexString.replaceAll('#', '').trim();
    if (cleanHex.length == 6) {
      return Color(int.parse('FF$cleanHex', radix: 16));
    } else if (cleanHex.length == 8) {
      return Color(int.parse(cleanHex, radix: 16));
    }
    return fallback;
  }
}

class TenantFeatures {
  final bool hasProducts;
  final bool hasServices;
  final bool hasAppointments;
  final bool hasHealthPlans;

  const TenantFeatures({
    required this.hasProducts,
    required this.hasServices,
    required this.hasAppointments,
    required this.hasHealthPlans,
  });

  factory TenantFeatures.fromJson(Map<String, dynamic> json) {
    return TenantFeatures(
      hasProducts: json['has_products'] ?? false,
      hasServices: json['has_services'] ?? false,
      hasAppointments: json['has_appointments'] ?? false,
      hasHealthPlans: json['has_health_plans'] ?? false,
    );
  }
}