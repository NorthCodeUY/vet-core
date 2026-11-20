// lib/screens/dashboard_screen.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/widgets/dashboard_top_bar.dart';
import 'package:admin_portal/widgets/dashboard_bottom_bar.dart';

/// Vista puramente declarativa del Shell Administrativo.
class DashboardScreen extends StatelessWidget {
  final int activeIndex;
  final Widget activeBody;
  final ValueChanged<int> onTabSelected;
  final VoidCallback onSettings;
  final VoidCallback onLogout;

  const DashboardScreen({
    super.key,
    required this.activeIndex,
    required this.activeBody,
    required this.onTabSelected,
    required this.onSettings,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: DashboardTopBar(
        onSettingsPressed: onSettings,
        onLogoutPressed: onLogout,
      ),
      body: activeBody,
      bottomNavigationBar: DashboardBottomBar(
        currentIndex: activeIndex,
        onTabSelected: onTabSelected,
      ),
    );
  }
}