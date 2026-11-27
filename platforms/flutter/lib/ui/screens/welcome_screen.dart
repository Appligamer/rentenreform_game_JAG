import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../utils/score_history.dart';
import 'game_board_screen.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _TutorialStepData {
  final String title;
  final String subtitle;
  final String summary;
  final List<(String label, String detail, Color color)> points;

  const _TutorialStepData({
    required this.title,
    required this.subtitle,
    required this.summary,
    required this.points,
  });
}

const List<_TutorialStepData> _tutorialSteps = [
  _TutorialStepData(
    title: '1. Dein Ziel: Deutschland sicher bis 2045 steuern',
    subtitle: 'Du übernimmst die Verantwortung für die gesetzliche Rente.',
    summary:
        'Zwischen 2026 und 2045 gehen Millionen Babyboomer in den Ruhestand. Jedes Jahr triffst du eine Entscheidung, bis das Zieljahr 2045 erreicht ist.',
    points: [
      (
        '1 Runde = 1 Jahr',
        'Mit dem Button „Nächstes Jahr simulieren“ bewegst du Deutschland ein Jahr weiter.',
        AppTheme.goldAccent,
      ),
      (
        'Drei Grenzen beachten',
        'Beitragssatz zu hoch, Rentenniveau zu tief oder Rücklage bei 0,00 Monaten führt zum Game Over.',
        AppTheme.redAccent,
      ),
      (
        'Sieg bei 2045',
        'Kommst du stabil durch das Jahr 2045, gewinnst du die Kampagne.',
        AppTheme.greenAccent,
      ),
    ],
  ),
  _TutorialStepData(
    title: '2. Die 4 Kennzahlen einfach erklärt',
    subtitle: 'Diese vier Werte zeigen dir sofort, ob alles stabil bleibt.',
    summary:
        'Oben im Cockpit siehst du die wichtigsten Werte der Rentenversicherung auf einen Blick.',
    points: [
      (
        'Jugend & Zahler (Beitragssatz)',
        'Steigt der Beitragssatz zu stark, sinkt die Zufriedenheit der Erwerbstätigen.',
        AppTheme.goldAccent,
      ),
      (
        'Senioren & Rentner (Rentenniveau)',
        'Fällt das Rentenniveau unter die Mindestgrenze, droht Altersarmut.',
        AppTheme.redAccent,
      ),
      (
        'Rücklage & Generationenkapital',
        'Die Rücklage ist dein Kassenpuffer. Das Generationenkapital entlastet ab 2035 durch Kapitalmarkterträge.',
        AppTheme.blueAccent,
      ),
    ],
  ),
  _TutorialStepData(
    title: '3. So spielst du jede Runde',
    subtitle: 'Reformkarten ausspielen, Politik-Hebel steuern, Jahr beenden.',
    summary:
        'Vor jeder Reformkarte steht genau, wie viel Politisches Kapital sie kostet und was sie verändert.',
    points: [
      (
        'Reformkarten (Rechts)',
        'Aktiviere dauerhafte Gesetze wie Aktienrente-Ausbau oder Fachkräfte-Boost.',
        AppTheme.greenAccent,
      ),
      (
        'Schwierigkeitsgrad (Oben rechts)',
        'Standardmäßig startet „Schwer“. Zum Kennenlernen kannst du oben rechts jederzeit auf „Normal“ wechseln.',
        AppTheme.blueAccent,
      ),
      (
        'Nächstes Jahr starten',
        'Wenn du bereit bist, klicke auf „Nächstes Jahr simulieren“.',
        AppTheme.goldAccent,
      ),
    ],
  ),
  _TutorialStepData(
    title: '4. Drei einfache Tipps für deinen Sieg',
    subtitle: 'Damit kommst du sicher durch die Babyboomer-Welle.',
    summary: 'Mit diesen drei Faustregeln bist du optimal vorbereitet:',
    points: [
      (
        'Tipp 1: Früh Generationenkapital aufbauen',
        'Je früher der Fonds wächst, desto stärker dämpft er ab 2035 den Beitragssatz.',
        AppTheme.greenAccent,
      ),
      (
        'Tipp 2: Politisches Kapital einteilen',
        'Spare dir Reserven für Krisenjahre auf.',
        AppTheme.goldAccent,
      ),
      (
        'Tipp 3: Jugend und Rentner im Gleichgewicht halten',
        'Stabile Beiträge für Junge und verlässliche Renten für Ältere gewinnen gemeinsam.',
        AppTheme.blueAccent,
      ),
    ],
  ),
];

class _WelcomeScreenState extends State<WelcomeScreen> {
  List<SavedRunScore> _scores = [];
  bool _inTutorial = false;
  int _tutorialStep = 0;

  @override
  void initState() {
    super.initState();
    _loadScores();
  }

  Future<void> _loadScores() async {
    final loaded = await ScoreHistoryStore.load();
    if (!mounted) return;
    setState(() {
      _scores = loaded;
    });
  }

  Future<void> _openRegularGame() async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const GameBoardScreen(),
      ),
    );
    await _loadScores();
  }

  Future<void> _clearScores() async {
    final cleared = await ScoreHistoryStore.clear();
    if (!mounted) return;
    setState(() {
      _scores = cleared;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 860),
              child: _inTutorial ? _buildTutorial() : _buildLanding(),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLanding() {
    final bestScore = _scores.fold<int>(
      0,
      (maxVal, item) => item.score > maxVal ? item.score : maxVal,
    );
    final victories = _scores.where((s) => s.status == 'victory').length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: AppTheme.surfaceCard,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderHairline),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Generation Zukunft · Bundeswettbewerb econo=me',
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.goldAccent,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Willkommen zur Renten-Simulation',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Führe die deutsche Rentenversicherung von 2026 bis 2045 sicher durch die Rentenwelle der Babyboomer. Wähle deinen Einstieg:',
                style: TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              LayoutBuilder(
                builder: (context, constraints) {
                  final wide = constraints.maxWidth >= 560;
                  final startCard = InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: _openRegularGame,
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.goldAccent,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.play_arrow_rounded,
                              color: Colors.black, size: 28),
                          SizedBox(height: 14),
                          Text(
                            'Direkt starten',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: Colors.black,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Sofort ins reguläre Spiel einsteigen (2026–2045).',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );

                  final tutorialCard = InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () {
                      setState(() {
                        _tutorialStep = 0;
                        _inTutorial = true;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.menu_book_rounded,
                              color: AppTheme.goldAccent, size: 26),
                          SizedBox(height: 14),
                          Text(
                            'Tutorial machen',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            '4 einfache Schritte zum schnellen Verstehen — danach direkt starten.',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );

                  if (wide) {
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: startCard),
                        const SizedBox(width: 14),
                        Expanded(child: tutorialCard),
                      ],
                    );
                  }
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      startCard,
                      const SizedBox(height: 12),
                      tutorialCard,
                    ],
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: AppTheme.surfaceCard,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderHairline),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.emoji_events_rounded,
                          color: AppTheme.goldAccent, size: 18),
                      SizedBox(width: 8),
                      Text(
                        'Deine bisherigen Scores',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  if (_scores.isNotEmpty)
                    TextButton.icon(
                      onPressed: _clearScores,
                      icon: const Icon(Icons.delete_outline,
                          size: 15, color: AppTheme.textSecondary),
                      label: const Text(
                        'Verlauf löschen',
                        style: TextStyle(
                            fontSize: 12, color: AppTheme.textSecondary),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              if (_scores.isEmpty)
                const Text(
                  'Erster Start — noch keine gespeicherten Durchgänge vorhanden. Nach deiner ersten Runde erscheinen deine bisherigen Scores beim nächsten Start automatisch hier.',
                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                )
              else ...[
                Row(
                  children: [
                    _kpiBox('Bester Score', '$bestScore', AppTheme.goldAccent),
                    const SizedBox(width: 10),
                    _kpiBox(
                        'Durchgänge', '${_scores.length}', AppTheme.textPrimary),
                    const SizedBox(width: 10),
                    _kpiBox('Siege (2045)', '$victories', AppTheme.greenAccent),
                  ],
                ),
                const SizedBox(height: 12),
                for (final entry in _scores.take(8))
                  Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.borderHairline),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${_statusLabel(entry)} · Modus ${entry.difficultyLabel}',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: entry.status == 'victory'
                                      ? AppTheme.greenAccent
                                      : entry.status == 'gameOver'
                                          ? AppTheme.redAccent
                                          : AppTheme.goldAccent,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Beitrag ${entry.contributionRate.toStringAsFixed(1)} % · Rentenniveau ${entry.pensionLevel.toStringAsFixed(1)} % · Fonds ${entry.generationCapitalFund.toStringAsFixed(0)} Mrd. €',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          'Score ${entry.score}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.goldAccent,
                            fontFeatures: [FontFeature.tabularFigures()],
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _kpiBox(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppTheme.borderHairline),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
                style: const TextStyle(
                    fontSize: 11, color: AppTheme.textSecondary)),
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: color,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _statusLabel(SavedRunScore entry) {
    if (entry.status == 'victory') return 'Sieg ${entry.year}';
    if (entry.status == 'gameOver') return 'Gescheitert (${entry.year})';
    return 'Stand Jahr ${entry.year}';
  }

  Widget _buildTutorial() {
    final step = _tutorialSteps[_tutorialStep];
    final isLast = _tutorialStep == _tutorialSteps.length - 1;

    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppTheme.surfaceCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderHairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Schnell-Tutorial · Schritt ${_tutorialStep + 1} von ${_tutorialSteps.length}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.goldAccent,
                ),
              ),
              TextButton(
                onPressed: _openRegularGame,
                child: const Text(
                  'Überspringen & direkt starten →',
                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            step.title,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            step.subtitle,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.goldAccent,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            step.summary,
            style: const TextStyle(
              fontSize: 13,
              height: 1.5,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 18),
          for (final point in step.points)
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.background,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.borderHairline),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    point.$1,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: point.$3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    point.$2,
                    style: const TextStyle(
                      fontSize: 12,
                      height: 1.4,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.textPrimary,
                  side: const BorderSide(color: Colors.white24),
                ),
                onPressed: () {
                  setState(() {
                    if (_tutorialStep == 0) {
                      _inTutorial = false;
                    } else {
                      _tutorialStep -= 1;
                    }
                  });
                },
                child: Text(
                    _tutorialStep == 0 ? 'Zurück zur Übersicht' : 'Zurück'),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.goldAccent,
                  foregroundColor: Colors.black,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                onPressed: () {
                  if (isLast) {
                    _openRegularGame();
                  } else {
                    setState(() {
                      _tutorialStep += 1;
                    });
                  }
                },
                child: Text(
                  isLast
                      ? 'Verstanden — Jetzt reguläres Spiel starten!'
                      : 'Weiter zu Schritt ${_tutorialStep + 2}',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
