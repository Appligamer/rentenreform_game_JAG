import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Universeller Platzhalter für handgezeichnete Artworks.
/// Wenn das Asset existiert, wird das Artwork gerendert.
/// Solange der Illustrator die Zeichnung anfertigt, zeigt dieser Slot
/// eine hochwertige Blueprint-Skizze mit Maßangaben und Designanweisungen.
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

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = borderRadius ?? BorderRadius.circular(12);

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
            // Blueprint-Wireframe für den Grafikdesigner
            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xFF161619),
                    const Color(0xFF0D0D0F),
                  ],
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(
                    Icons.brush_outlined,
                    size: 28,
                    color: AppTheme.goldAccent.withOpacity(0.8),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${width.toInt()}×${height.toInt()} px · Handzeichnung',
                    style: const TextStyle(
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: AppTheme.goldAccent,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    designerInstruction,
                    textAlign: TextAlign.center,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 9,
                      color: AppTheme.textSecondary.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
