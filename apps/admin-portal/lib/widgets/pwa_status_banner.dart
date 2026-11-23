// apps/admin-portal/lib/widgets/pwa_status_banner.dart
// Propósito: Banner compacto reutilizable para sugerir instalación inmediata en móvil
// o aplicar actualizaciones del portal en 1 toque usando tokens del tenant.

import 'package:flutter/material.dart';
import 'package:admin_portal/services/pwa/pwa_service.dart';

/// Muestra avisos prioritarios de actualización o acceso rápido a instalación PWA.
class PwaStatusBanner extends StatefulWidget {
  const PwaStatusBanner({super.key});

  @override
  State<PwaStatusBanner> createState() => _PwaStatusBannerState();
}

class _PwaStatusBannerState extends State<PwaStatusBanner> {
  PwaInstallState _installState = PwaInstallState.unsupported;
  bool _hasUpdate = false;
  bool _dismissedInstall = false;
  bool _isBusy = false;

  @override
  void initState() {
    super.initState();
    _syncState();
    PwaService.setOnStateChanged(_syncState);
  }

  @override
  void dispose() {
    PwaService.setOnStateChanged(null);
    super.dispose();
  }

  void _syncState() {
    if (!mounted) return;
    setState(() {
      _installState = PwaService.getInstallState();
      _hasUpdate = PwaService.hasUpdateAvailable();
    });
  }

  Future<void> _onInstallPressed() async {
    if (_isBusy) return;

    if (_installState == PwaInstallState.promptReady) {
      setState(() => _isBusy = true);
      await PwaService.triggerInstall();
      if (mounted) {
        setState(() => _isBusy = false);
        _syncState();
      }
      return;
    }

    if (!mounted) return;
    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        icon: Icon(
          Icons.install_mobile_outlined,
          color: Theme.of(ctx).colorScheme.primary,
        ),
        title: const Text('Instalar Portal Admin'),
        content: Text(
          _installState == PwaInstallState.iosSafari
              ? '1. Toca el botón Compartir (cuadro con flecha arriba) en Safari.\n'
                  '2. Desliza y elige "Agregar a inicio".\n'
                  '3. Confirma con "Agregar".'
              : '1. Abre el menú (⋮) arriba a la derecha en Chrome.\n'
                  '2. Toca "Instalar aplicación" o "Agregar a pantalla principal".\n'
                  'Nota: con HTTPS se instala directo en 1 toque.',
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Entendido'),
          ),
        ],
      ),
    );
  }

  Future<void> _onUpdatePressed() async {
    if (_isBusy) return;
    setState(() => _isBusy = true);
    await PwaService.applyUpdateAndReload();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // Prioridad 1: Nueva versión disponible.
    if (_hasUpdate) {
      return Material(
        color: colorScheme.tertiaryContainer,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Row(
            children: [
              Icon(Icons.system_update_alt, size: 18, color: colorScheme.onTertiaryContainer),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Hay una nueva versión disponible.',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: colorScheme.onTertiaryContainer,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              FilledButton.tonal(
                onPressed: _isBusy ? null : _onUpdatePressed,
                child: Text(_isBusy ? 'Actualizando...' : 'Actualizar'),
              ),
            ],
          ),
        ),
      );
    }

    // Prioridad 2: Sugerencia inmediata de instalación en móvil/navegador compatible.
    final canSuggestInstall = !_dismissedInstall &&
        (_installState == PwaInstallState.promptReady ||
            _installState == PwaInstallState.iosSafari ||
            _installState == PwaInstallState.androidManual);

    if (!canSuggestInstall) return const SizedBox.shrink();

    return Material(
      color: colorScheme.primaryContainer.withValues(alpha: 0.55),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: Row(
          children: [
            Icon(Icons.install_mobile, size: 18, color: colorScheme.onPrimaryContainer),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Instala el portal para operar más rápido en tu celular.',
                style: theme.textTheme.labelSmall?.copyWith(
                  color: colorScheme.onPrimaryContainer,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            TextButton(
              onPressed: _isBusy ? null : _onInstallPressed,
              child: Text(
                _installState == PwaInstallState.promptReady ? 'Instalar' : 'Cómo',
              ),
            ),
            IconButton(
              visualDensity: VisualDensity.compact,
              tooltip: 'Ocultar',
              icon: Icon(Icons.close, size: 16, color: colorScheme.onPrimaryContainer),
              onPressed: () => setState(() => _dismissedInstall = true),
            ),
          ],
        ),
      ),
    );
  }
}