import 'package:flutter/material.dart';
import 'ui/theme/app_theme.dart';
import 'ui/screens/game_board_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const PensionGameApp());
}

class PensionGameApp extends StatelessWidget {
  const PensionGameApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generation Zukunft - Renten-Simulation',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const GameBoardScreen(),
    );
  }
}
