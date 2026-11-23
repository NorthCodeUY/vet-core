// apps/admin-portal/lib/services/pwa/pwa_service_stub.dart
// Propósito: Implementación nula segura para plataformas nativas (Linux, Android, iOS).

import 'pwa_service.dart';

void setPwaStateChangedCallbackImpl(void Function()? callback) {}

PwaInstallState getPwaInstallStateImpl() => PwaInstallState.unsupported;

bool hasPwaUpdateImpl() => false;

Future<String> triggerPwaInstallImpl() async => 'unsupported';

Future<bool> checkPwaUpdateImpl() async => false;

Future<void> applyPwaUpdateImpl() async {}