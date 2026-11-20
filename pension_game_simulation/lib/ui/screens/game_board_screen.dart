import 'dart:math';
import 'package:flutter/material.dart';
import '../../models/macro_state.dart';
import '../../models/decision_card.dart';
import '../../simulation/pension_engine.dart';
import '../../simulation/game_events.dart';
import '../../simulation/difficulty_config.dart';
import '../theme/app_theme.dart';
import '../widgets/hand_drawn_slot.dart';

enum GameStatus { playing, victory, gameOver }

class GameBoardScreen extends StatefulWidget {
  const GameBoardScreen({super.key});

  @override
  State<GameBoardScreen> createState() => _GameBoardScreenState();
}

class _GameBoardScreenState extends State<GameBoardScreen> {
  DifficultyLevel _difficulty = DifficultyLevel.hard;
  late MacroState _state;
  final List<MacroState> _history = [];
  final List<DecisionCard> _availableCards = GameEventsCatalog.getAvailableCards();
  final List<String> _playedCardIds = [];

  // Kampagnen- & Gleichgewichtswerte
  int _politicalCapital = 50;
  int _youthSatisfaction = 68;
  int _retireeSatisfaction = 70;
  double _reserveMonths = 1.35;
  GameStatus _status = GameStatus.playing;
  String? _statusMessage;

  // Strukturelle Policy-Hebel & Modifikatoren
  double _extraCredit = 0.0;
  double _retirementAgeShift = 0.0;
  double _structuralContributionDelta = 0.0;
  double _structuralPensionLevelDelta = 0.0;
  double _oneTimeFederalSubsidyDelta = 0.0;
  int _marketBoostYearsRemaining = 0;
  double _marketBoostPercent = 0.0;
  bool _forceHaltelinie = true;

  @override
  void initState() {
    super.initState();
    _initCampaign(_difficulty);
  }

  void _initCampaign(DifficultyLevel level) {
    final cfg = DifficultyConfigs.get(level);
    _difficulty = level;
    _state = PensionEngine.createInitialState();
    _history
      ..clear()
      ..add(_state);
    _playedCardIds.clear();
    _politicalCapital = cfg.startingPoliticalCapital;
    _youthSatisfaction = cfg.startingYouthSatisfaction;
    _retireeSatisfaction = cfg.startingRetireeSatisfaction;
    _reserveMonths = cfg.startingReserveMonths;
    _status = GameStatus.playing;
    _statusMessage = null;
    _extraCredit = 0.0;
    _retirementAgeShift = 0.0;
    _structuralContributionDelta = 0.0;
    _structuralPensionLevelDelta = 0.0;
    _oneTimeFederalSubsidyDelta = 0.0;
    _marketBoostYearsRemaining = 0;
    _marketBoostPercent = 0.0;
    _forceHaltelinie = true;
  }

  void _switchDifficulty(DifficultyLevel level) {
    setState(() {
      _initCampaign(level);
    });
  }

  void _resetSimulation() {
    setState(() {
      _initCampaign(_difficulty);
    });
  }

  void _nextTurn() {
    if (_status != GameStatus.playing) return;
    final cfg = DifficultyConfigs.get(_difficulty);
    final nextYear = _state.year + 1;
    final shock = cfg.marketShocks[nextYear];

    double marketReturn = 6.5;
    if (_marketBoostYearsRemaining > 0) {
      marketReturn = shock != null
          ? (shock.returnPercent + _marketBoostPercent) / 2.0
          : _marketBoostPercent;
    } else if (shock != null) {
      marketReturn = shock.returnPercent;
    }

    late MacroState nextState;
    String? snackMsg;

    setState(() {
      nextState = PensionEngine.stepNextYear(
        current: _state,
        extraCapitalCredit: _extraCredit,
        marketReturnOverride: marketReturn,
        loanInterestRatePercent: cfg.loanInterestRate,
        extraRetirementAgeMonths: _retirementAgeShift,
        federalSubsidyDelta: _oneTimeFederalSubsidyDelta,
        structuralContributionDelta: _structuralContributionDelta,
        structuralPensionLevelDelta: _structuralPensionLevelDelta,
        forceHaltelinie48: _forceHaltelinie,
      );

      // Zufriedenheit & Rücklage aktualisieren
      final rateExcess =
          max(0.0, nextState.contributionRate - cfg.ratePenaltyThreshold);
      final youthDelta = rateExcess > 0
          ? -(rateExcess * cfg.youthPenaltyMultiplier).round()
          : (nextState.contributionRate <= 19.6 ? 2 : 0);

      final pensionShortfall = max(0.0, 48.0 - nextState.pensionLevel);
      final retireeDelta = pensionShortfall > 0
          ? -(pensionShortfall * cfg.retireePenaltyMultiplier).round()
          : (nextState.pensionLevel >= 48.0 ? 1 : 0);

      _youthSatisfaction = (_youthSatisfaction + youthDelta).clamp(0, 100);
      _retireeSatisfaction = (_retireeSatisfaction + retireeDelta).clamp(0, 100);

      final isPeakWave = nextYear >= 2030 && nextYear <= 2039;
      final waveStress = isPeakWave ? 0.08 : 0.015;
      final ratePressure = max(0.0, nextState.contributionRate - 19.4) * 0.045;
      final fundRelief = nextState.fundPayoutToGRV * 0.012;
      _reserveMonths = double.parse(
        (_reserveMonths - cfg.reserveBurnBase - waveStress - ratePressure + fundRelief)
            .clamp(0.0, 2.5)
            .toStringAsFixed(2),
      );

      final regen = (nextState.contributionRate <= cfg.ratePenaltyThreshold &&
              nextState.pensionLevel >= 47.2)
          ? cfg.capitalRegenGood
          : cfg.capitalRegenLow;
      _politicalCapital = min(100, _politicalCapital + regen);

      // Einmalige & zeitlich begrenzte Boni verbrauchen
      _extraCredit = 0.0;
      _oneTimeFederalSubsidyDelta = 0.0;
      if (_marketBoostYearsRemaining > 0) {
        _marketBoostYearsRemaining -= 1;
      }

      _state = nextState;
      _history.add(nextState);

      // Sieges- / Niederlagebedingungen prüfen
      if (nextState.contributionRate > cfg.maxContributionRate ||
          _youthSatisfaction <= 15) {
        _status = GameStatus.gameOver;
        _statusMessage =
            'Beitragssatz (${nextState.contributionRate.toStringAsFixed(1)} %) oder Jugend-Protest überlastet.';
      } else if (nextState.pensionLevel < cfg.minPensionLevel ||
          _retireeSatisfaction <= 15) {
        _status = GameStatus.gameOver;
        _statusMessage =
            'Rentenniveau (${nextState.pensionLevel.toStringAsFixed(1)} %) unter kritischer Grenze.';
      } else if (_reserveMonths <= 0.1) {
        _status = GameStatus.gameOver;
        _statusMessage = 'Nachhaltigkeitsrücklage der Rentenkasse erschöpft.';
      } else if (nextState.year >= 2045) {
        _status = GameStatus.victory;
        _statusMessage =
            'Jahr 2045 erfolgreich im Modus ${cfg.label} gemeistert!';
      }

      if (shock != null) {
        snackMsg = '${shock.label} in $nextYear';
      }
    });

    if (snackMsg != null && mounted) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.surfaceCard,
            content: Text(
              snackMsg!,
              style: const TextStyle(color: AppTheme.goldAccent),
            ),
            duration: const Duration(seconds: 3),
          ),
        );
    }
  }

  void _playCard(DecisionCard card) {
    if (_status != GameStatus.playing) return;
    if (_playedCardIds.contains(card.id)) return;
    if (_politicalCapital < card.politicalCapitalCost) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.surfaceCard,
            content: Text(
              'Zu wenig politisches Kapital (${card.politicalCapitalCost} benötigt).',
              style: const TextStyle(color: AppTheme.redAccent),
            ),
            duration: const Duration(seconds: 2),
          ),
        );
      return;
    }

    setState(() {
      _playedCardIds.add(card.id);
      _politicalCapital -= card.politicalCapitalCost;
      _extraCredit += card.deltaGenerationFundMrd;
      _retirementAgeShift += card.deltaRetirementAge;
      _structuralContributionDelta = (_structuralContributionDelta + card.deltaContributionRate)
          .clamp(-1.6, 1.6);
      _structuralPensionLevelDelta = (_structuralPensionLevelDelta + card.deltaPensionLevel)
          .clamp(-2.5, 2.5);
      _oneTimeFederalSubsidyDelta += card.deltaFederalSubsidyMrd;
      _youthSatisfaction =
          (_youthSatisfaction + card.deltaYouthSatisfaction).clamp(0, 100);
      _retireeSatisfaction =
          (_retireeSatisfaction + card.deltaRetireeSatisfaction).clamp(0, 100);

      if (card.marketBoostYears > 0) {
        _marketBoostYearsRemaining += card.marketBoostYears;
        _marketBoostPercent = max(_marketBoostPercent, card.marketBoostPercent);
      }

      if (card.deltaGenerationFundMrd > 0) {
        _state = _state.copyWith(
          generationCapitalFund: double.parse(
            (_state.generationCapitalFund + card.deltaGenerationFundMrd)
                .toStringAsFixed(1),
          ),
        );
      }
    });

    if (mounted) {
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.surfaceCard,
            content: Text(
              'Reform beschlossen: ${card.title}',
              style: const TextStyle(color: AppTheme.goldAccent),
            ),
            duration: const Duration(seconds: 2),
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cfg = DifficultyConfigs.get(_difficulty);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceCard,
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.account_balance_rounded,
                color: AppTheme.goldAccent, size: 20),
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
                color: Colors.white.withAlpha(15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                'econo=me · ${cfg.label}',
                style: const TextStyle(
                    fontSize: 11, color: AppTheme.textSecondary),
              ),
            ),
          ],
        ),
        actions: [
          for (final level in DifficultyLevel.values)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 10),
              child: TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: _difficulty == level
                      ? AppTheme.goldAccent
                      : Colors.white.withAlpha(13),
                  foregroundColor:
                      _difficulty == level ? Colors.black : AppTheme.textSecondary,
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _switchDifficulty(level),
                child: Text(
                  DifficultyConfigs.get(level).label,
                  style: const TextStyle(
                      fontSize: 11, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded,
                color: AppTheme.textSecondary),
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
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
                            Text(
                              'Kapital: $_politicalCapital Pkt · Rücklage: ${_reserveMonths.toStringAsFixed(2)} Mon.',
                              style: const TextStyle(
                                  fontSize: 11, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _status == GameStatus.playing
                                ? AppTheme.goldAccent
                                : Colors.white.withAlpha(20),
                            foregroundColor: _status == GameStatus.playing
                                ? Colors.black
                                : AppTheme.textSecondary,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed:
                              _status == GameStatus.playing ? _nextTurn : _resetSimulation,
                          icon: Icon(
                            _status == GameStatus.playing
                                ? Icons.fast_forward_rounded
                                : Icons.replay_rounded,
                            size: 18,
                          ),
                          label: Text(
                            _status == GameStatus.playing ? '+1 Jahr' : 'Neu starten',
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                    if (_statusMessage != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: (_status == GameStatus.victory
                                  ? AppTheme.greenAccent
                                  : AppTheme.redAccent)
                              .withAlpha(28),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: _status == GameStatus.victory
                                ? AppTheme.greenAccent
                                : AppTheme.redAccent,
                          ),
                        ),
                        child: Text(
                          _statusMessage!,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: _status == GameStatus.victory
                                ? AppTheme.greenAccent
                                : AppTheme.redAccent,
                          ),
                        ),
                      ),
                    ],
                    const SizedBox(height: 16),

                    // Kennzahlen-Grid
                    _buildMetricCard(
                      label: 'Beitragssatz Rentenkasse (Limit ${cfg.maxContributionRate}%)',
                      value: '${_state.contributionRate.toStringAsFixed(2)} %',
                      subtext: _state.contributionRate > cfg.ratePenaltyThreshold
                          ? 'Erhöhte Belastung für Beitragszahler'
                          : 'Stabil im Zielkorridor',
                      accentColor:
                          _state.contributionRate > cfg.ratePenaltyThreshold
                              ? AppTheme.redAccent
                              : AppTheme.blueAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Generationenkapital (Aktienfonds)',
                      value:
                          '${_state.generationCapitalFund.toStringAsFixed(1)} Mrd. €',
                      subtext: _state.year >= 2035
                          ? 'Ausschüttung an GRV: ${_state.fundPayoutToGRV.toStringAsFixed(1)} Mrd. €/Jahr'
                          : 'Aufbauphase bis 2035 (Ziel: ~200 Mrd. €)',
                      accentColor: AppTheme.goldAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Altenquotient & Zufriedenheit',
                      value: '${_state.dependencyRatio.toStringAsFixed(2)} : 1',
                      subtext:
                          'Jugend: $_youthSatisfaction% · Rentner: $_retireeSatisfaction%',
                      accentColor: _state.dependencyRatio < 1.6
                          ? AppTheme.redAccent
                          : AppTheme.greenAccent,
                    ),
                    const SizedBox(height: 12),

                    _buildMetricCard(
                      label: 'Rentenniveau (Min. ${cfg.minPensionLevel}%)',
                      value: '${_state.pensionLevel.toStringAsFixed(1)} %',
                      subtext: _forceHaltelinie
                          ? 'Haltelinie 48% aktiv (bis 2039)'
                          : 'Nachhaltigkeitsfaktor aktiv',
                      accentColor: _state.pensionLevel < cfg.minPensionLevel + 0.5
                          ? AppTheme.redAccent
                          : AppTheme.greenAccent,
                    ),
                    const SizedBox(height: 20),

                    const Text(
                      'POLITISCHE STELLSCHRAUBEN',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 10),

                    Row(
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Haltelinie 48% erzwingen',
                                  style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600)),
                              Text(
                                'Rentenpaket II: Garantiert Niveau bis 2039',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        Switch(
                          value: _forceHaltelinie,
                          activeTrackColor: AppTheme.goldAccent.withAlpha(140),
                          thumbColor: WidgetStateProperty.resolveWith((states) {
                            if (states.contains(WidgetState.selected)) {
                              return AppTheme.goldAccent;
                            }
                            return AppTheme.textSecondary;
                          }),
                          onChanged: _status == GameStatus.playing
                              ? (val) => setState(() => _forceHaltelinie = val)
                              : null,
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),
                    Text(
                      'Zusatzkredit Generationenkapital: +${_extraCredit.toInt()} Mrd. €',
                      style: const TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                    Slider(
                      value: _extraCredit,
                      min: 0,
                      max: 30,
                      divisions: 6,
                      activeColor: AppTheme.goldAccent,
                      onChanged: _status == GameStatus.playing
                          ? (v) => setState(() => _extraCredit = v)
                          : null,
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
                    const HandDrawnSlot(
                      assetPath:
                          'assets/images/backgrounds/bg_berlin_future_skyline.png',
                      title: 'Szenario-Hintergrund: Berlin 2026–2060',
                      designerInstruction:
                          'Reichstag & Zukunftsskyline mit Solar und Finanzviertel. Stil: Hand-Drawn Ink & Wash, Dark Mode tauglich.',
                      width: double.infinity,
                      height: 160,
                    ),
                    const SizedBox(height: 24),

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
                          '${_playedCardIds.length}/${_availableCards.length} ausgespielt · Kapital: $_politicalCapital Pkt',
                          style: const TextStyle(
                              fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.92,
                      ),
                      itemCount: _availableCards.length,
                      itemBuilder: (context, index) {
                        final card = _availableCards[index];
                        final isPlayed = _playedCardIds.contains(card.id);
                        final canAfford =
                            _politicalCapital >= card.politicalCapitalCost;

                        return Container(
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceCard,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isPlayed
                                  ? AppTheme.goldAccent
                                  : AppTheme.borderHairline,
                              width: isPlayed ? 1.5 : 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              HandDrawnSlot(
                                assetPath: card.artworkAssetPath,
                                title: card.title,
                                designerInstruction: card.requiredSketchNotes,
                                width: double.infinity,
                                height: 105,
                                borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(11)),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            card.title,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                        ),
                                        Text(
                                          '${card.politicalCapitalCost} Pkt',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: canAfford
                                                ? AppTheme.goldAccent
                                                : AppTheme.redAccent,
                                          ),
                                        ),
                                      ],
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
                                              ? Colors.white.withAlpha(20)
                                              : canAfford
                                                  ? AppTheme.goldAccent
                                                  : Colors.white.withAlpha(15),
                                          foregroundColor: isPlayed || !canAfford
                                              ? AppTheme.textSecondary
                                              : Colors.black,
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 8),
                                        ),
                                        onPressed: isPlayed || !canAfford
                                            ? null
                                            : () => _playCard(card),
                                        child: Text(
                                          isPlayed
                                              ? 'Bereits aktiv'
                                              : canAfford
                                                  ? 'Ausspielen'
                                                  : 'Zu wenig Kapital',
                                          style: const TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700),
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
              color: AppTheme.textSecondary.withAlpha(230),
            ),
          ),
        ],
      ),
    );
  }
}
