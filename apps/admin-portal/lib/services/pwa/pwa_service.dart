// apps/admin-portal/lib/services/pwa/pwa_service.dart
// Propósito: Contrato multiplataforma para gestionar instalación rápida PWA y actualizaciones.

import 'pwa_service_stub.dart'
    if (dart.library.js_interop) 'pwa_service_web.dart';

/// Estados posibles de instalación de la PWA en el navegador móvil o escritorio.
enum PwaInstallState {
  /// Ya se está ejecutando instalada en modo standalone.
  installed,

  /// El navegador capturó `beforeinstallprompt` y permite instalar en 1 toque.
  promptReady,

  /// iOS Safari requiere compartir -> "Agregar a pantalla de inicio".
  iosSafari,

  /// Android sin prompt nativo (p.ej. HTTP en LAN): requiere menú ⋮ -> Instalar.
  androidManual,

  /// Entorno nativo (Linux/Android APK) o navegador sin soporte de instalación.
  unsupported,
}

/// Puente multiplataforma hacia las capacidades PWA del navegador.
abstract final class PwaService {
  /// Suscribe un callback cuando cambia el estado de instalación o llega una nueva versión.
  static void setOnStateChanged(void Function()? callback) =>
      setPwaStateChangedCallbackImpl(callback);

  /// Consulta el estado actual de instalación PWA.
  static PwaInstallState getInstallState() => getPwaInstallStateImpl();

  /// Indica si hay una nueva versión lista esperando en el Service Worker.
  static bool hasUpdateAvailable() => hasPwaUpdateImpl();

  /// Lanza el diálogo nativo de instalación (`beforeinstallprompt`) cuando está disponible.
  static Future<String> triggerInstall() => triggerPwaInstallImpl();

  /// Verifica manualmente si existe una nueva compilación en el servidor.
  static Future<bool> checkForUpdate() => checkPwaUpdateImpl();

  /// Limpia caché del Service Worker, activa la versión nueva y recarga la app.
  static Future<void> applyUpdateAndReload() => applyPwaUpdateImpl();
}