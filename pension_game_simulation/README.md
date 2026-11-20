# pension_game_simulation

Cross-Platform Video Game & Simulation Core for the German Pension Insurance System (`econo=me` Wettbewerb, Rentenpaket II, Generationenkapital).

Built by Jacob Glathe & Team for **macOS (Xcode)**, **iOS / iPadOS**, **Windows**, and **Web**.

Repository: `https://github.com/Appligamer/rentenreform_game_JAG.git`

---

## 🚀 Schnellstart

### 1. Voraussetzungen
- Flutter SDK (>= 3.16.0)
- Auf macOS: Xcode (für macOS Desktop & iOS Builds)
- Auf Windows: Visual Studio 2022 mit Workload **„Desktopentwicklung mit C++“**

### 2. Projekt klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/Appligamer/rentenreform_game_JAG.git pension_game_simulation
cd pension_game_simulation
flutter pub get
```

---

## 🍎 macOS, 📱 iOS & Xcode Ausführung

### A. Direkt über Flutter starten:
```bash
flutter run -d macos
# bzw. für iOS Simulator / iPhone:
flutter run -d ios
```

### B. Direkt in Xcode öffnen & debuggen:
```bash
open macos/Runner.xcodeproj
# oder für reines iOS-Projekt:
open ios/Runner.xcodeproj
```
In Xcode:
1. Wähle das Target **`Runner`** (My Mac) oder **`Runner-iOS`** (iPhone / iPad Simulator).
2. Klicke auf den Play-Button (`Cmd + R`) zum Kompilieren und Ausführen.

---

## 🪟 Windows: Ausführen & als einzelne `.exe` zum Versenden bauen

### 1. Direkt starten / entwickeln
```powershell
flutter config --enable-windows-desktop
flutter run -d windows
```

### 2. Versandfertige Release-`.exe` bauen
```powershell
flutter config --enable-windows-desktop
flutter pub get
flutter build windows --release
```
Die fertige Windows-App liegt anschließend in:
`build\windows\x64\runner\Release\` (`pension_game_simulation.exe`, `flutter_windows.dll` und `data\`).

> **Wichtig:** Die `.exe` funktioniert nur zusammen mit den `.dll`-Dateien und dem `data\`-Ordner im selben Verzeichnis.

### 3. Als EINE Datei verpacken & verschicken
- **Per ZIP (empfohlen & sofort startklar):** Den kompletten `Release\`-Ordner zippen (`GenerationZukunft_Windows.zip`) oder im Hauptverzeichnis `powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1` ausführen. Der Empfänger entpackt die ZIP und startet `pension_game_simulation.exe`.
- **Als einzelne Installer-`.exe` (`Setup.exe`):** Mit dem kostenlosen Tool **[Inno Setup](https://jrsoftware.org/isinfo.php)** den kompletten Inhalt von `build\windows\x64\runner\Release\` (inkl. Unterordner `data\`) zu einer einzigen `GenerationZukunft_Setup.exe` kompilieren.
