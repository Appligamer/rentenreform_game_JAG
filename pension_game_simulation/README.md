# pension_game_simulation

Cross-Platform Video Game & Simulation Core for the German Pension Insurance System (econo=me Wettbewerb, Rentenpaket II, Generationenkapital).

Built by Jacob Glathe & Team for **macOS (Xcode)**, **Windows**, and **Web**.

---

## 🚀 Schnellstart

### 1. Voraussetzungen
- Flutter SDK (>= 3.16.0)
- Auf macOS: Xcode (für macOS Desktop & iOS Builds)
- Auf Windows: Visual Studio 2022 mit Desktop-C++-Workload

### 2. Projekt klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/JacobGlathe/pension_game_simulation.git
cd pension_game_simulation
flutter pub get
```

---

## 🍎 macOS & Xcode Ausführung

### A. Direkt über Flutter starten:
```bash
flutter run -d macos
```

### B. Direkt in Xcode öffnen & debuggen:
```bash
open macos/Runner.xcodeproj
# oder
open macos/Runner.xcworkspace
```
In Xcode:
1. Wähle das Target **"Runner"** und dein Ziel **"My Mac"**.
2. Klicke auf den Play-Button (Cmd + R) zum Kompilieren und Ausführen.
3. Signing & Capabilities können direkt im Xcode-Inspector verwaltet werden.

---

## 🪟 Windows Ausführung

```bash
# Einmalig: Windows Desktop Support aktivieren
flutter config --enable-windows-desktop

# Auf Windows starten
flutter run -d windows
```

---

## 📁 Projektarchitektur

```
pension_game_simulation/
├── lib/
│   ├── main.dart                      # Einstiegspunkt & State-Provider
│   ├── simulation/                    # Mathematischer Kern (econo=me Formeln)
│   │   ├── pension_engine.dart        # Umlageverfahren, Rentenwert, Haltelinie 48%
│   │   ├── generation_capital.dart    # Kredite, Marktrendite & Entlastungspfad
│   │   ├── demography_model.dart      # Altenquotient & Erwerbstätige (2026-2060)
│   │   └── game_events.dart           # Reale & hypothetische Schocks & Krisen
│   ├── models/                        # Typsichere Dart-Datenmodelle
│   │   ├── macro_state.dart           # Gesamtwirtschaftlicher Rentenstatus
│   │   ├── citizen_profile.dart       # Individueller Lebenslauf (Gen Z/Alpha)
│   │   └── decision_card.dart         # Ausspielbare Reformen & Karten
│   └── ui/                            # Apple-Aesthetic Benutzeroberfläche
│       ├── theme/app_theme.dart       # Dark Mode (#000000, #161617)
│       ├── widgets/hand_drawn_slot.dart # Platzhalter für handgezeichnete Artworks
│       └── screens/game_board_screen.dart # Haupt-Spielfeld
├── graphic_designer_briefing.md       # Vollständiges Briefing für den Illustrator
└── system_prompt.md                   # Dauerhafter System-Prompt des Teams
```
