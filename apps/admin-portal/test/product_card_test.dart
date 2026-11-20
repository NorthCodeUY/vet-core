import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/widgets/product_card_item.dart';

void main() {
  testWidgets('ProductCardItem invoca onDelete al presionar el botón Eliminar', (tester) async {
    bool deleteCalled = false;

    const product = Product(
      id: 101,
      name: 'Alimento Premium Canino',
      salePrice: 4500.0,
      stock: 25,
      categoryId: 1,
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductCardItem(
            product: product,
            onToggleShowcase: (_) {},
            onToggleAvailability: () {},
            onEdit: () {},
            onDelete: () {
              deleteCalled = true;
            },
          ),
        ),
      ),
    );

    expect(find.text('Alimento Premium Canino'), findsOneWidget);
    expect(find.text('Eliminar'), findsOneWidget);

    await tester.tap(find.text('Eliminar'));
    await tester.pump();

    expect(deleteCalled, isTrue);
  });
}
