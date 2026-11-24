import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Rendert optionale handgezeichnete Artworks aus dem zentralen artworks/-Verzeichnis.
/// Fehlt eine Datei noch, wird automatisch eine saubere, zum Motiv passende
/// dunkle Vektor-Illustration angezeigt, ohne Entwickler-Texte im Spiel einzublenden.
class HandDrawnSlot extends StatelessWidget {
  final String assetPath;
  final String title;
  final String designerInstruction;
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const HandDrawnSlot({
    super.key,
    required this.assetPath,
    required this.title,
    required this.designerInstruction,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  IconData _pickIcon() {
    if (assetPath.contains('generationenkapital')) return Icons.trending_up_rounded;
    if (assetPath.contains('haltelinie')) return Icons.shield_rounded;
    if (assetPath.contains('retirement_age')) return Icons.schedule_rounded;
    if (assetPath.contains('bav_matching')) return Icons.handshake_rounded;
    if (assetPath.contains('market_bull')) return Icons.show_chart_rounded;
    if (assetPath.contains('boomer_wave')) return Icons.waves_rounded;
    if (assetPath.contains('trophy')) return Icons.emoji_events_rounded;
    if (assetPath.contains('char_')) return Icons.person_rounded;
    return Icons.account_balance_rounded;
  }

  Color _pickAccent() {
    if (assetPath.contains('haltelinie') || assetPath.contains('boomer')) {
      return AppTheme.blueAccent;
    }
    if (assetPath.contains('market_bull') || assetPath.contains('bav')) {
      return AppTheme.greenAccent;
    }
    return AppTheme.goldAccent;
  }

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = borderRadius ?? BorderRadius.circular(12);
    final accent = _pickAccent();

    return ClipRRect(
      borderRadius: effectiveRadius,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: const Color(0xFF111113),
          borderRadius: effectiveRadius,
          border: Border.all(color: AppTheme.borderHairline, width: 1),
        ),
        child: Image.asset(
          assetPath,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 0.9,
                  colors: [
                    accent.withAlpha(42),
                    const Color(0xFF0D0D10),
                  ],
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: accent.withAlpha(24),
                        shape: BoxShape.circle,
                        border: Border.all(color: accent.withAlpha(90)),
                      ),
                      child: Icon(
                        _pickIcon(),
                        size: 24,
                        color: accent,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
