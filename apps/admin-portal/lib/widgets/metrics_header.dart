// apps/admin-portal/lib/widgets/metrics_header.dart

// <!> MEJORAR COMETARIOS 
import 'package:flutter/material.dart';

class MetricsHeader extends StatelessWidget {
  final int totalCount;
  final int showcaseCount;
  final int criticalCount;
  final int hiddenCount;

  const MetricsHeader({
    super.key,
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          _MetricCard(
            label: 'Total',
            value: '$totalCount',
            sublabel: 'SKUs',
            icon: Icons.inventory_2_outlined,
          ),
          const SizedBox(width: 8),
          _MetricCard(
            label: 'Vitrina',
            value: '$showcaseCount',
            sublabel: 'Públicos',
            icon: Icons.visibility_outlined,
            accentColor: colorScheme.primary,
          ),
          const SizedBox(width: 8),
          _MetricCard(
            label: 'Críticos',
            value: '$criticalCount',
            sublabel: 'Reponer',
            icon: Icons.warning_amber_rounded,
            accentColor: colorScheme.error,
          ),
          const SizedBox(width: 8),
          _MetricCard(
            label: 'Ocultos',
            value: '$hiddenCount',
            sublabel: 'Pausados',
            icon: Icons.visibility_off_outlined,
          ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final String sublabel;
  final IconData icon;
  final Color? accentColor;

  const _MetricCard({
    required this.label,
    required this.value,
    required this.sublabel,
    required this.icon,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final activeColor = accentColor ?? colorScheme.onSurface;

    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outlineVariant.withValues(alpha: 0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: theme.textTheme.labelSmall?.copyWith(
                color: accentColor ?? colorScheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: theme.textTheme.titleMedium?.copyWith(
                color: activeColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Row(
              children: [
                Icon(icon, size: 12, color: accentColor ?? colorScheme.onSurfaceVariant),
                const SizedBox(width: 3),
                Text(
                  sublabel,
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: accentColor ?? colorScheme.onSurfaceVariant,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}