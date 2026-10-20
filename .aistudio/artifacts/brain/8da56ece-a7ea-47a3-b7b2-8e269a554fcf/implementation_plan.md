# Renten-Simulation: "Generation Zukunft" — Flutter & Multiplattform Architekturplan

Revidierter Umsetzungs- und Architekturplan für das plattformübergreifende Videospiel zur neuen Rentenversicherung (econo=me Wettbewerb, Rentenpaket II, Generationenkapital), basierend auf **Flutter** für macOS (Xcode) und Windows, inklusive dedizierter Dateien für den **System-Prompt** und ein **vollständiges UI-Asset-Briefing für den Grafikdesigner**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Aktualisierte Weichenstellungen (Revision):**
> - **Framework-Wechsel zu Flutter (`pension_game_simulation`):** Die native Ausführung erfolgt als vollwertiges Flutter-Projekt mit nativer Unterstützung für **macOS (direkt in Xcode als Runner-Projekt öffenbar)** und **Windows (C++ Desktop Runner)**.
> - **Dual-Layer-Strategie für Entwicklungs- & Live-Test-Zwecke:**
>   1. Das vollständige, saubere Flutter-Projekt `pension_game_simulation/` wird inklusive aller Dart-Modelle, Simulationslogik, Widgets und Plattform-Runner für Xcode/Windows bereitgestellt.
>   2. Die Web-Vorschau in AI Studio stellt parallel den interaktiven Simulationskern live im Browser bereit, damit alle mathematischen Formeln und Szenarien sofort verifiziert und demonstriert werden können.
> - **Dokumentationsdateien im Projekt-Root:**
>   - `system_prompt.md`: Der dauerhafte System-Prompt für Jacob Glathe & Team.
>   - `graphic_designer_briefing.md`: Eine detaillierte, komponentenweise Anleitung für den Grafikdesigner mit genauen Pixel-Maßen, Safe-Zones, Stimmungen, Farbpaletten und Exportformaten.

---

## 1. Overview & Core Concept

- **Projektname:** `pension_game_simulation`
- **Didaktisches Ziel:** Spielerische, immersive und mathematisch korrekte Vermittlung der Rentenreformen für Schüler und Bürger im Rahmen des bundesweiten Wettbewerbs **econo=me ("Rente gut, alles gut?")**:
  - Gesetzliche Rentenversicherung (GRV) und der Generationenvertrag im demografischen Wandel.
  - Das neue **Rentenpaket II** mit gesetzlicher **Haltelinie von 48%** bis mind. 2039.
  - Das **Generationenkapital (Aktienrente)**: Aufbau eines kreditfinanzierten Kapitalstocks (Start 12 Mrd. € p.a., 3% Dynamik, 200 Mrd. € Ziel Mitte der 2030er) und globale Marktrenditen zur Beitragsstabilisierung.
  - Bürgerperspektive: Eigene Karriere, Sparquote, Aktien-Vorsorge und das Schließen der persönlichen Rentenlücke.

---

## 2. Projekt-Dateistruktur (Flutter Cross-Platform)

```
pension_game_simulation/
├── pubspec.yaml                      # Flutter-Abhängigkeiten (fl_chart, provider, google_fonts, etc.)
├── README.md                         # Schnellstart für macOS (Xcode) und Windows
├── system_prompt.md                  # Projekt-System-Prompt für das Team
├── graphic_designer_briefing.md      # Sehr ausführliche Anleitung für den Illustrator/Grafiker
├── assets/
│   ├── images/
│   │   ├── backgrounds/              # Hintergrund-Artworks (macOS/Win Auflösungen)
│   │   ├── characters/               # Handgezeichnete Charaktere (Ausdrucke, Generationen)
│   │   ├── cards/                    # Ereignis- & Reformkarten-Artworks
│   │   └── icons/                    # Handgezeichnete UI-Icons & Ressourcen-Symbole
├── macos/                            # Xcode-Projekt für macOS
│   ├── Runner.xcodeproj             # Direkt mit "open macos/Runner.xcodeproj" in Xcode öffenbar!
│   ├── Runner.xcworkspace
│   └── Runner/
├── windows/                          # Windows Desktop Runner (CMake & C++ Runner)
│   ├── CMakeLists.txt
│   └── runner/
└── lib/
    ├── main.dart                     # Flutter App Entry Point
    ├── simulation/
    │   ├── pension_engine.dart       # Mathematische Formeln: Umlageverfahren & Rentenwert
    │   ├── generation_capital.dart   # Rendite- und Kreditsimulation (Generationenkapital)
    │   ├── demography_model.dart     # Altenquotient & Erwerbstätigen-zu-Rentner-Kurve
    │   └── game_events.dart          # 15+ Reform- und Marktereignisse (Börsen-Crash, Boom, etc.)
    ├── models/
    │   ├── macro_state.dart          # Bundeshaushalt, Beitragssatz, Haltelinie, Fondsvermögen
    │   ├── citizen_profile.dart      # Individuelle Sparquote, Gehalt, Entgeltpunkte, Rentenlücke
    │   └── decision_card.dart        # Politische Hebel & persönliche Lebenslauf-Karten
    ├── ui/
    │   ├── theme/
    │   │   └── app_theme.dart        # Apple-Aesthetic Dark Theme (#000000, #161617)
    │   ├── widgets/
    │   │   ├── hand_drawn_slot.dart  # Universeller Placeholder für handgezeichnete Grafiken
    │   │   ├── metric_badge.dart     # Statusanzeigen mit tabular-nums
    │   │   ├── card_deck_view.dart   # Animierte Entscheidungs-Karten
    │   │   └── live_trend_chart.dart # Demografie- & Liquiditätsgraphen
    │   └── screens/
    │       ├── game_board_screen.dart # Haupt-Spielfeld (Runden 2026 bis 2060)
    │       ├── comparison_screen.dart # Reformpaket II vs. Reines Umlageverfahren
    │       └── evaluation_screen.dart # econo=me Auswertung & Urkunden-Score
```

---

## 3. UI-Komponenten & Ausführliches Grafikdesigner-Briefing (Auszug)

In der separaten Datei `graphic_designer_briefing.md` wird jede einzelne UI-Komponente aufgeschlüsselt:

1. **Charakter-Porträts (Handgezeichnet, 512×512 px, PNG mit Alpha):**
   - *Berufseinsteiger 2026 (Gen Z / Alpha):* Optimistisch, besorgt, reflektiert.
   - *Babyboomer vor Renteneintritt:* Zufrieden, fordernd, gelassen.
   - *Finanzminister / Wirtschaftsberater:* Analytisch, gestresst, souverän.
2. **Entscheidungs- & Ereigniskarten (Handgezeichnet, 600×900 px, 2:3 Ratio):**
   - *Generationenkapital-Start:* Kredite fließen in einen globalen Aktienfonds.
   - *Haltelinie-Garantie (48%):* Waage zwischen Generationengerechtigkeit und Altersarmut.
   - *Demografie-Tsunami:* Babyboomer wechseln von Beitragszahlern zu Leistungsempfängern.
   - *Börsencrash & Zinswende:* Stresstest für den Aktienfonds.
3. **Spielfeld-Hintergrund & Szenerie (1920×1080 px & 2560×1440 px):**
   - Zentrale Bundeshauptstadt / Zukunfts-Skyline im minimalistischen Hand-Drawn-Line-Art-Stil auf tiefschwarzem Grund.
4. **Icons & Ressourcen (128×128 px SVG/PNG):**
   - Rentenpunkte, Generationenkapital-Goldfonds, Demografie-Verhältnis, Rentenlücken-Warnsymbol.

---

## 4. Setup- & Ausführungsanweisungen für Xcode und Windows

### A. Ausführung auf macOS (inklusive Xcode)
```bash
# 1. In das Projekt wechseln
cd pension_game_simulation

# 2. Abhängigkeiten laden
flutter pub get

# 3. Direkt auf macOS ausführen
flutter run -d macos

# 4. In Xcode öffnen (um native macOS-Funktionen, Signing oder Build-Settings zu verwalten)
open macos/Runner.xcodeproj
```

### B. Ausführung auf Windows
```bash
# 1. Desktop-Unterstützung aktivieren
flutter config --enable-windows-desktop

# 2. Windows-App bauen und starten
flutter run -d windows
```

---

## 5. Nächste Schritte nach Freigabe

1. **Dateierstellung im Projekt:**
   - Erstellung von `system_prompt.md` mit den vollständigen Team-Richtlinien.
   - Erstellung von `graphic_designer_briefing.md` mit der detaillierten Spezifikation für jede Illustration.
   - Bereitstellung der sauberen Flutter-Projektdateien (`pubspec.yaml`, `lib/`, `macos/Runner.xcodeproj`, `windows/`).
2. **Interaktive Web-Simulation in AI Studio:**
   - Bereitstellung des mathematischen Simulationskerns in der React-Oberfläche für sofortige Tests im Browser.
3. **Prüfung und Verifikation:**
   - Syntax- und Build-Validierung.
