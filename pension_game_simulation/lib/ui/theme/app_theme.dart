import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Apple-Aesthetic Dark Theme für das Renten-Simulationsspiel
class AppTheme {
  static const Color background = Color(0xFF000000);
  static const Color surfaceCard = Color(0xFF161617);
  static const Color surfaceElevated = Color(0xFF1E1E20);
  static const Color borderHairline = Color(0x1AFFFFFF); // rgba(255, 255, 255, 0.1)

  // Akzente
  static const Color goldAccent = Color(0xFFF59E0B);
  static const Color blueAccent = Color(0xFF38BDF8);
  static const Color greenAccent = Color(0xFF34D399);
  static const Color redAccent = Color(0xFFF87171);

  static const Color textPrimary = Color(0xFFF5F5F7);
  static const Color textSecondary = Color(0xFF86868B);
  static const Color textTertiary = Color(0xFF6E6E73);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: goldAccent,
      canvasColor: background,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        ThemeData.dark().textTheme.apply(
              bodyColor: textPrimary,
              displayColor: textPrimary,
            ),
      ),
      cardTheme: CardTheme(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderHairline, width: 1),
        ),
      ),
    );
  }
}
