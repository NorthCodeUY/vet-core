// apps/admin-portal/lib/services/pwa/pwa_service_web.dart
// Propósito: Implementación Web mediante dart:js_interop hacia window.__vetcorePwa.

import 'dart:js_interop';
import 'pwa_service.dart';

@JS('__vetcorePwa')
external _VetcorePwaBridge? get _pwaBridge;

@JS('__vetcoreOnPwaChange')
external set _onPwaChangeCallback(JSFunction? fn);

extension type _VetcorePwaBridge(JSObject _) implements JSObject {
  external String getInstallState();
  external bool hasUpdate();
  external JSPromise<JSString> triggerInstall();
  external JSPromise<JSBoolean> checkForUpdate();
  external JSPromise<JSAny?> applyUpdateAndReload();
}

void setPwaStateChangedCallbackImpl(void Function()? callback) {
  _onPwaChangeCallback = callback?.toJS;
}

PwaInstallState getPwaInstallStateImpl() {
  final state = _pwaBridge?.getInstallState();
  return switch (state) {
    'installed' => PwaInstallState.installed,
    'prompt_ready' => PwaInstallState.promptReady,
    'ios_safari' => PwaInstallState.iosSafari,
    'android_manual' => PwaInstallState.androidManual,
    _ => PwaInstallState.unsupported,
  };
}

bool hasPwaUpdateImpl() => _pwaBridge?.hasUpdate() ?? false;

Future<String> triggerPwaInstallImpl() async {
  final bridge = _pwaBridge;
  if (bridge == null) return 'unsupported';
  final result = await bridge.triggerInstall().toDart;
  return result.toDart;
}

Future<bool> checkPwaUpdateImpl() async {
  final bridge = _pwaBridge;
  if (bridge == null) return false;
  final result = await bridge.checkForUpdate().toDart;
  return result.toDart;
}

Future<void> applyPwaUpdateImpl() async {
  final bridge = _pwaBridge;
  if (bridge == null) return;
  await bridge.applyUpdateAndReload().toDart;
}