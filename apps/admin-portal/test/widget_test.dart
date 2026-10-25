// test/widget_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:admin_portal/main.dart';

void main() {
  testWidgets('Portal Administrativo Smoke Test - Carga Inicial', (WidgetTester tester) async {
    // <!> PARÁMETRO REQUERIDO: Se inyecta 'hasToken: false' para simular estado inicial sin sesión
    await tester.pumpWidget(const MyApp(hasToken: false));

    // Valida que el árbol de widgets se monte sin excepciones de renderizado
    expect(tester.takeException(), isNull);
  });
}