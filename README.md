# Generation Zukunft — Renten-Simulation (`econo=me`)

Plattformübergreifendes Simulations- und Strategiespiel zur deutschen Rentenversicherung, dem **Rentenpaket II (Haltelinie 48 %)** und dem **Generationenkapital (Aktienrente)** — entwickelt von **Jacob Glathe & Team** für **macOS**, **iOS/iPadOS**, **Windows** und **Web**.

---

## 🍎 macOS & 📱 iOS / iPadOS (Xcode)

Das Projekt enthält ein vorkompiliertes Offline-`WebBundle` und einen eigenen `BundleSchemeHandler` (`app://local/index.html`) — es wird **kein laufender Localhost-Server** benötigt.

1. Öffne **`macos/Runner.xcodeproj`** (enthält beide Targets) oder **`ios/Runner.xcodeproj`** in Xcode.
2. Wähle oben in Xcode das gewünschte Schema:
   - **`Runner`** → **My Mac** (native macOS Desktop-App)
   - **`Runner-iOS`** → **iPhone / iPad Simulator** oder angeschlossenes iPhone/iPad (ab iOS 15.0)
3. Klicke auf **Play (`Cmd + R`)**.

---

## 🪟 Windows: Eine versandfertige `.exe` erstellen (Schritt-für-Schritt)

### Methode 1 (Am einfachsten — nur Windows-Bordmittel, **ohne** Flutter & Visual Studio)

Auf jedem Windows-10/11-PC ist bereits alles vorinstalliert (PowerShell, .NET-Compiler `csc.exe`, Microsoft Edge).

1. Öffne **Windows PowerShell** und wechsle in deinen geklonten Projektordner (wichtig: **Anführungszeichen**, falls dein Benutzername ein Leerzeichen enthält):
   ```powershell
   cd "$HOME\rentenreform_game_JAG"
   ```
2. Starte das Packaging-Skript:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1
   ```
3. Fertig! Im neuen Ordner **`dist_windows\`** liegen sofort:
   - **`dist_windows\GenerationZukunft.exe`** → **Eine einzige, direkt startbare & versendbare `.exe`-Datei** (mit App-Icon und eingebettetem Offline-Spielpaket).
   - **`dist_windows\GenerationZukunft_Windows_Portable.zip`** → Komplettes Offline-Paket als ZIP.

---

### Methode 2 (Optional): Nativ mit Flutter & Visual Studio kompilieren

Falls du eine native C++/Flutter-`.exe` statt des Offline-WebBundles bauen möchtest:

1. **[Git for Windows](https://git-scm.com/download/win)** installieren.
2. **[Flutter SDK für Windows](https://docs.flutter.dev/get-started/install/windows)** als ZIP herunterladen, nach `C:\src\flutter` entpacken und `C:\src\flutter\bin` in den Windows-`PATH` eintragen.
3. **[Visual Studio 2022 Community](https://visualstudio.microsoft.com/de/downloads/)** mit dem Workload **„Desktopentwicklung mit C++“** installieren.
4. *(Optional für Installer)*: **[Inno Setup 6](https://jrsoftware.org/isinfo.php)** installieren.
5. Danach denselben Befehl wie oben ausführen (`powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1`) — das Skript erkennt Flutter automatisch.

---

### Methode 2: Manuell mit Flutter & Inno Setup

Falls du die Schritte lieber einzeln im Terminal ausführen möchtest:

```powershell
cd pension_game_simulation
flutter config --enable-windows-desktop
flutter pub get
flutter build windows --release
```

Die fertigen Dateien liegen anschließend unter:
```text
pension_game_simulation\build\windows\x64\runner\Release\
├── pension_game_simulation.exe
├── flutter_windows.dll
└── data\
```

#### So machst du daraus EINE versandfertige Datei:
- **Option A — Portable ZIP (keine Zusatztools nötig):**
  Rechtsklick auf den Ordner `Release` → **„In ZIP-Datei komprimieren“**. Der Empfänger entpackt die ZIP-Datei und startet `pension_game_simulation.exe`.
- **Option B — Eine einzige `.exe` (`Setup.exe`) mit Inno Setup:**
  1. Öffne **`dist_windows\GenerationZukunft_Setup.iss`** (nach Lauf von Schritt 2) in **[Inno Setup](https://jrsoftware.org/isinfo.php)** — oder erstelle über *File → New* ein Skript, füge als Haupt-EXE `pension_game_simulation.exe` und unter *Other application files → Add folder* den kompletten `Release\`-Ordner (inkl. Unterordner `data\`) hinzu.
  2. Drücke **`Ctrl + F9`** (*Compile*).
  3. Fertig: **`GenerationZukunft_Windows_Setup.exe`** enthält alles in einer einzigen `.exe`-Datei ohne Adminrechte und legt beim Empfänger direkt eine Desktop-Verknüpfung an.

---

### Methode 3 (Ohne Visual Studio & ohne Flutter): Offline-Starter für Windows 10/11

Falls auf deinem Windows-Rechner weder Visual Studio noch Flutter installiert ist:
1. Führe im Projektordner `npm install && npm run build` aus (oder nutze das mitgelieferte `macos\Runner\WebBundle`).
2. Starte **`scripts\build_windows_portable.ps1`** (oder kopiere `START_GAME_WINDOWS.exe`, `start_game_windows.bat` und `WebBundle\` zusammen in einen Ordner).
3. Ein Doppelklick auf **`START_GAME_WINDOWS.exe`** startet lokal und komplett offline ein eigenes App-Fenster über PowerShell + Microsoft Edge/Chrome/Standardbrowser.

---

### Häufige Fehler unter Windows & schnelle Lösung
- **„VCRUNTIME140.dll / flutter_windows.dll fehlt“ beim Empfänger:** Nur die `.exe` ohne `flutter_windows.dll` und `data\` verschickt. Immer den **kompletten `Release`-Ordner zippen** oder die **`GenerationZukunft_Windows_Setup.exe`** über Inno Setup bauen.
- **CMake-Fehler in Visual Studio (`winres.h not found`):** Bereits behoben (`winresrc.h` aus dem Standard-Windows-SDK wird verwendet). Prüfe per `flutter doctor -v`, ob unter *Visual Studio* der Haken bei **Desktopentwicklung mit C++** sitzt.
- **PowerShell blockiert `.ps1`-Skripte:** Immer mit `-ExecutionPolicy Bypass` starten (siehe Befehl oben).

---

## 🌐 Web-Entwicklung (Browser)

```bash
npm install
npm run dev
```
Öffnet die Live-Simulation unter `http://localhost:3000`.
