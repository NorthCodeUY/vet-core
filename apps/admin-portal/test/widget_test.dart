// test/widget_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:admin_portal/core/config/tenant_config.dart';
import 'package:admin_portal/main.dart';

void main() {
  testWidgets('Portal Administrativo Smoke Test - Carga Inicial', (WidgetTester tester) async {
    // <!> CONFIGURACIÓN MOCK: Se inyecta la configuración por defecto resiliente para pruebas
    final testConfig = TenantConfig.fallback();

    // Renderiza la raíz de la aplicación
    await tester.pumpWidget(VetCoreAdminApp(config: testConfig));

    // Valida que el árbol de widgets se monte sin excepciones
    expect(tester.takeException(), isNull);
  });
}