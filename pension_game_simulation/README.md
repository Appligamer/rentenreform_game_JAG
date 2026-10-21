# pension_game_simulation

Cross-Platform Video Game & Simulation Core for the German Pension Insurance System (econo=me Wettbewerb, Rentenpaket II, Generationenkapital).

Built by Jacob Glathe & Team for **macOS (Xcode)**, **Windows**, and **Web**.

Repository: `https://github.com/Appligamer/rentenreform_game_JAG.git`

---

## 🚀 Schnellstart

### 1. Voraussetzungen
- Flutter SDK (>= 3.16.0)
- Auf macOS: Xcode (für macOS Desktop & iOS Builds)
- Auf Windows: Visual Studio 2022 mit Desktop-C++-Workload

### 2. Projekt klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/Appligamer/rentenreform_game_JAG.git pension_game_simulation
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
```
In Xcode:
1. Wähle das Target **"Runner"** und dein Ziel **"My Mac"**.
2. Klicke auf den Play-Button (Cmd + R) zum Kompilieren und Ausführen.

---

## 🪟 Windows Ausführung

```bash
flutter config --enable-windows-desktop
flutter run -d windows
```
