import 'package:flutter/material.dart';
import '../../models/macro_state.dart';
import '../../models/decision_card.dart';
import '../../simulation/pension_engine.dart';
import '../../simulation/game_events.dart';
import '../theme/app_theme.dart';
import '../widgets/hand_drawn_slot.dart';

class GameBoardScreen extends StatefulWidget {
  const GameBoardScreen({super.key});

  @override
  State<GameBoardScreen> createState() => _GameBoardScreenState();
}

class _GameBoardScreenState extends State<GameBoardScreen> {
  late MacroState _state;
  final List<MacroState> _history = [];
  final List<DecisionCard> _availableCards = GameEventsCatalog.getAvailableCards();
  final List<String> _playedCardIds = [];

  // Steuerelemente
  double _extraCredit = 0.0;
  double _retirementAgeShift = 0.0;
  bool _forceHaltelinie = true;

  @override
  void initState() {
    super.initState();
    _state = PensionEngine.createInitialState();
    _history.add(_state);
  }

  void _nextTurn() {
    setState(() {
      _state = PensionEngine.stepNextYear(
        current: _state,
        extraCapitalCredit: _extraCredit,
        extraRetirementAgeMonths: _retirementAgeShift,
        forceHaltelinie48: _forceHaltelinie,
      );
      _history.add(_state);
      // Reset temporäre Runden-Hebel
      _extraCredit = 0.0;
    });
  }

  void _resetSimulation() {
    setState(() {
      _state = PensionEngine.createInitialState();
      _history.clear();
      _history.add(_state);
      _playedCardIds.clear();
      _extraCredit = 0.0;
      _retirementAgeShift = 0.0;
    });
  }

  void _playCard(DecisionCard card) {
    if (_playedCardIds.contains(card.id)) return;
    setState(() {
      _playedCardIds.add(card.id);
      _extraCredit += card.deltaGenerationFundMrd;
      _retirementAgeShift += card.deltaRetirementAge;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppTheme.surfaceCard,
          content: Text(
            'Karte ausgespielt: ${card.title}',
            style: const TextStyle(color: AppTheme.goldAccent),
          ),
          duration: const Duration(seconds: 2),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceCard,
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.account_balance_rounded, color: AppTheme.goldAccent, size: 20),
            const SizedBox(width: 8),
            const Text(
              'GENERATION ZUKUNFT',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.06),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'econo=me Wettbewerb · Rentenpaket II',
                style: TextStyle(fontSize: 11, color: AppTheme.textSecondary),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.textSecondary),
            tooltip: 'Simulation zurücksetzen (2026)',
            onPressed: _resetSimulation,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // LINKE SPALTE: Makro-Status & Reform-Hebel
          Expanded(
            flex: 4,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                border: Border(right: BorderSide(color: AppTheme.borderHairline)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Simulationsjahr-Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'JAHR ${_state.year}',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                            color: AppTheme.goldAccent,
                          ),
                        ),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.goldAccent,
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: _nextTurn,
                          icon: const Icon(Icons.fast_forward_rounded, size: 18),
                          label: const Text(
                            '+1 Jahr',
                            style: TextStyle(fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Kennzahlen-Grid
                    _buildMetricCard(
                      label: 'Beitragssatz Rentenkasse',
                      value: '${_state.contributionRate.toStringAsFixed(1)} %',
                      subtext: _state.contributionRate > 22.0
                          ? 'Kritische Belastung für Beitragszahler'
                          : 'Stabil dank Dämpfungsmaßnahmen',
                      accentColor: _state.contributionRate > 22.0
                          ? AppTheme.redAccent
                          : AppTheme.blueAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Generationenkapital (Aktienfonds)',
                      value: '${_state.generationCapitalFund.toStringAsFixed(1)} Mrd. €',
                      subtext: _state.year >= 2035
                          ? 'Ausschüttung an GRV: ${_state.fundPayoutToGRV.toStringAsFixed(1)} Mrd. €/Jahr'
                          : 'Aufbauphase bis 2035 (Ziel: ~200 Mrd. €)',
                      accentColor: AppTheme.goldAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Altenquotient (Verhältnis)',
                      value: '${_state.dependencyRatio.toStringAsFixed(2)} : 1',
                      subtext:
                          '${_state.contributorsCount.toStringAsFixed(1)} Mio. Zahler vs. ${_state.pensionersCount.toStringAsFixed(1)} Mio. Rentner',
                      accentColor: _state.dependencyRatio < 1.6
                          ? AppTheme.redAccent
                          : AppTheme.greenAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Rentenniveau (Haltelinie)',
                      value: '${_state.pensionLevel.toStringAsFixed(1)} %',
                      subtext: 'Gesetzlich fixiert bei 48% (Standardrente)',
                      accentColor: AppTheme.greenAccent,
                    ),
                    const SizedBox(height: 24),

                    // Reform-Stellschrauben
                    const Text(
                      'POLITISCHE STELLSCHRAUBEN',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Switch Haltelinie
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      activeColor: AppTheme.goldAccent,
                      title: const Text('Haltelinie 48% erzwingen'),
                      subtitle: const Text(
                        'Rentenpaket II: Garantiert Rentenniveau bis 2039',
                        style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                      value: _forceHaltelinie,
                      onChanged: (val) => setState(() => _forceHaltelinie = val),
                    ),

                    const SizedBox(height: 12),
                    // Kredite für Generationenkapital
                    Text(
                      'Zusatzkredit Generationenkapital: +${_extraCredit.toInt()} Mrd. €',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    Slider(
                      value: _extraCredit,
                      min: 0,
                      max: 40,
                      divisions: 8,
                      activeColor: AppTheme.goldAccent,
                      onChanged: (v) => setState(() => _extraCredit = v),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // RECHTE SPALTE: Spielfeld, Artworks & Entscheidungskarten
          Expanded(
            flex: 6,
            child: Container(
              padding: const EdgeInsets.all(24),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Hand-Drawn Cityscape / Scenario Frame
                    HandDrawnSlot(
                      assetPath: 'assets/images/backgrounds/bg_berlin_future_skyline.png',
                      title: 'Szenario-Hintergrund: Berlin 2026–2060',
                      designerInstruction:
                          'Reichstag & Zukunftsskyline mit Solar und Finanzviertel. Stil: Hand-Drawn Ink & Wash, Dark Mode tauglich.',
                      width: double.infinity,
                      height: 180,
                    ),
                    const SizedBox(height: 24),

                    // Sektion Entscheidungskarten
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'ENTSCHEIDUNGS- & REFORMKARTEN',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.5,
                          ),
                        ),
                        Text(
                          '${_playedCardIds.length}/${_availableCards.length} ausgespielt',
                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Grid der Karten
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.95,
                      ),
                      itemCount: _availableCards.length,
                      itemBuilder: (context, index) {
                        final card = _availableCards[index];
                        final isPlayed = _playedCardIds.contains(card.id);

                        return Container(
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceCard,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isPlayed ? AppTheme.goldAccent : AppTheme.borderHairline,
                              width: isPlayed ? 1.5 : 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Handgezeichneter Slot der Karte
                              HandDrawnSlot(
                                assetPath: card.artworkAssetPath,
                                title: card.title,
                                designerInstruction: card.requiredSketchNotes,
                                width: double.infinity,
                                height: 110,
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(11)),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      card.title,
                                      style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      card.subtitle,
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.goldAccent,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      card.description,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: isPlayed
                                              ? Colors.white.withOpacity(0.08)
                                              : AppTheme.goldAccent,
                                          foregroundColor: isPlayed ? AppTheme.textSecondary : Colors.black,
                                          padding: const EdgeInsets.symmetric(vertical: 8),
                                        ),
                                        onPressed: isPlayed ? null : () => _playCard(card),
                                        child: Text(
                                          isPlayed ? 'Bereits aktiv' : 'Ausspielen',
                                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String label,
    required String value,
    required String subtext,
    required Color accentColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderHairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: accentColor,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtext,
            style: TextStyle(
              fontSize: 11,
              color: AppTheme.textSecondary.withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }
}
