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

## 🪟 Windows: App ausführen & eine versandfertige `.exe` bauen

Unter Windows gibt es **zwei Wege**, um aus dem Projekt eine vollständige, versandfertige Anwendung zu machen:

---

### Methode A (Empfohlen): Echte native Windows-`.exe` mit Flutter kompilieren

Eine Flutter-Windows-App besteht nach dem Kompilieren nicht nur aus einer einzelnen `.exe`, sondern aus einem **Release-Ordner** (`GenerationZukunft.exe` + `flutter_windows.dll` + `data\`-Ordner). Wenn man nur die `.exe` ohne die DLLs verschickt, startet sie auf anderen PCs nicht!

#### Schritt 1: Einmalige Voraussetzungen auf Windows installieren
1. **[Git for Windows](https://git-scm.com/download/win)** installieren.
2. **[Flutter SDK für Windows](https://docs.flutter.dev/get-started/install/windows)** installieren und `flutter\bin` zum `PATH` hinzufügen.
3. **[Visual Studio 2022 Community](https://visualstudio.microsoft.com/de/downloads/)** installieren und bei der Installation den Workload **„Desktopentwicklung mit C++“** (inkl. Windows 10/11 SDK und CMake) anhaken.

#### Schritt 2: Release-`.exe` bauen
Öffne die **PowerShell** oder Eingabeaufforderung im Projektordner:

```powershell
cd pension_game_simulation
flutter config --enable-windows-desktop
flutter pub get
flutter build windows --release
```

Die fertige App liegt danach unter:
```text
pension_game_simulation\build\windows\x64\runner\Release\
├── pension_game_simulation.exe
├── flutter_windows.dll
└── data\
```

#### Schritt 3: Als EINE versandfertige Datei verpacken

**Option 1 — Schnell per ZIP (sofort bereit zum Versenden):**
Rechtsklick auf den gesamten `Release`-Ordner → **„In ZIP-Datei komprimieren“** (oder führe unser Skript `powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1` aus).
Der Empfänger entpackt die ZIP-Datei und macht einfach einen **Doppelklick auf `pension_game_simulation.exe`** (bzw. `GenerationZukunft.exe`). Keine Installation nötig!

**Option 2 — Eine einzige Installer-`.exe` (`Setup.exe`) mit Inno Setup (wie bei PC-Spielen):**
Wenn du **wirklich nur eine einzige `.exe`-Datei** verschicken willst, die beim Empfänger alles automatisch entpackt und eine Desktop-Verknüpfung anlegt:
1. Lade das kostenlose Tool **[Inno Setup](https://jrsoftware.org/isinfo.php)** herunter und installiere es.
2. Erstelle in Inno Setup über *File → New* ein neues Skript:
   - **Application name:** `Generation Zukunft - Renten-Simulation`
   - **Application main executable file:** `pension_game_simulation\build\windows\x64\runner\Release\pension_game_simulation.exe`
   - **Other application files → Add folder:** Füge den kompletten `Release\`-Ordner (inkl. `data\` und allen `.dll`-Dateien, mit Haken bei *Include subfolders*) hinzu!
3. Klicke auf **Compile** (`Ctrl + F9`).
4. Ergebnis: Eine einzige **`Output\mysetup.exe`** (z. B. umbenennen in `GenerationZukunft_Windows_Setup.exe`), die du direkt per WhatsApp, Discord, E-Mail oder Upload-Link an die Jury / Freunde verschicken kannst!

---

### Methode B (Ohne Visual Studio & ohne Flutter): Offline-WebBundle für Windows

Falls auf deinem Windows-Rechner kein Visual Studio / Flutter installiert ist, kannst du trotzdem sofort ein **eigenständiges Windows-Paket** versenden:

1. Stelle sicher, dass `WebBundle` aktuell ist (`npm run build`, bzw. bereits im Ordner `macos\Runner\WebBundle` enthalten).
2. Packe zusammen in einen Ordner (oder starte automatisch `scripts\build_windows_portable.ps1`):
   - `START_GAME_WINDOWS.exe`
   - `start_game_windows.bat`
   - `WebBundle\` (mit `index.html` und `assets\`)
3. Beim Doppelklick auf **`START_GAME_WINDOWS.exe`** startet automatisch das integrierte Desktop-Fenster über Windows PowerShell + Microsoft Edge im App-Modus — **komplett offline** und ohne dass der Empfänger Node.js oder Flutter braucht!

---

## 🌐 Web-Entwicklung (Browser)

```bash
npm install
npm run dev
```
Öffnet die Live-Simulation unter `http://localhost:3000`.
