# Generation Zukunft — Renten-Simulation (`econo=me`)

Plattformübergreifendes Simulations- und Strategiespiel zur deutschen Rentenversicherung, dem **Rentenpaket II (Haltelinie 48 %)** und dem **Generationenkapital (Aktienrente)** — entwickelt von **Jacob Glathe & Team** für **macOS**, **iOS/iPadOS**, **Windows** und **Web**.

---

## macOS &  iOS / iPadOS (Xcode)

Das Projekt enthält ein vorkompiliertes Offline-`WebBundle` und einen eigenen `BundleSchemeHandler` (`app://local/index.html`) — es wird **kein laufender Localhost-Server** benötigt.

1. Öffne **`macos/Runner.xcodeproj`** (enthält beide Targets) oder **`ios/Runner.xcodeproj`** in Xcode.
2. Wähle oben in Xcode das gewünschte Schema:
   - **`Runner`** → **My Mac** (native macOS Desktop-App)
   - **`Runner-iOS`** → **iPhone / iPad Simulator** oder angeschlossenes iPhone/iPad (ab iOS 15.0)
3. Klicke auf **Play (`Cmd + R`)**.

---

##  Windows: Eine versandfertige, signierte `.exe` erstellen (Schritt-für-Schritt)

### Methode 1 (Empfohlen — autarkes Build-Skript nur mit Windows-Bordmitteln)

Das Skript **`scripts\build_windows_portable.ps1`** automatisiert jeden Release-Build für aktuelle **und zukünftige Versionen**:
- Liest die Versionsnummer automatisch aus `package.json` (und baut bei installiertem `node_modules` automatisch neu via `npm run build`, sonst über das aktuelle `WebBundle`).
- Bettet das komplette Spiel, das mehrstufige App-Icon (`windows\runner\resources\app_icon.ico`, `16×16` bis `256×256`, inkl. `favicon.ico` für die Windows-Taskleiste), das Windows-Manifest und die Produkt-Metadaten in **eine einzige autarke `GenerationZukunft.exe`** ein.
- **Signiert automatisch (SHA-256 Authenticode):**
  1. Wenn du ein offizielles Code-Signing-Zertifikat besitzt (`code-signing.pfx` im Hauptordner/in `scripts\`, per `-PfxPath`, oder installiert im Windows-Zertifikatsspeicher), signiert das Skript automatisch damit inkl. Timestamp (`http://timestamp.digicert.com`).
  2. Falls (noch) kein offizielles Zertifikat vorhanden ist, erstellt und nutzt das Skript automatisch ein lokales Code-Signing-Zertifikat (`CN=Jacob Glathe (Generation Zukunft Local)`) für deinen PC.

#### Ausführung in Windows PowerShell:
```powershell
cd "$HOME\rentenreform_game_JAG"
powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1
```

*(Mit eigenem offiziellen Zertifikat:)*
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1 -PfxPath "C:\Pfad\mein_cert.pfx" -PfxPassword "DEIN_PASSWORT"
```

#### Ergebnis im Ordner `dist_windows\`:
- **`dist_windows\GenerationZukunft.exe`** → Eine einzige, eigenständige `.exe`-Datei (mit App-Icon in Explorer & Taskleiste, ohne externe `.dll`-Ordner).
- **`dist_windows\GenerationZukunft_Windows_Portable.zip`** → Versandfertige ZIP-Datei.

---

### Wichtig zu Windows 11 „Smart App Control“ (App-Steuerung) & Signierung

- **Warum blockiert Windows 11 Smart App Control selbst gebaute `.exe`-Dateien?**  
  Smart App Control (in Windows 11 22H2+ ab Werk aktiv) blockiert **jede** `.exe`, die nicht von einer **öffentlich vertrauenswürdigen Zertifizierungsstelle (CA)** digital signiert ist oder noch keine weltweite Microsoft-Cloud-Reputation besitzt — das gilt gleichermaßen für .NET-, C++-, Flutter- und Inno-Setup-`.exe`-Dateien. Eine kostenlose Selbst-Signatur (`New-SelfSignedCertificate`) vertraut die `.exe` nur auf deinem eigenen PC, **nicht** auf fremden Windows-11-PCs mit aktivem Smart App Control.
- **Wie die `.exe` auf ALLEN fremden Windows-11-PCs sofort ohne Blockierung startet:**
  1. **Für offiziellen Release / Wettbewerb (Empfohlen):** Signiere über ein echtes Code-Signing-Zertifikat (z. B. **Microsoft Azure Trusted Signing** oder **Certum Open Source / SimplySign**) und übergib es per `-PfxPath` oder Zertifikatsspeicher an `scripts\build_windows_portable.ps1`.
  2. **Alternativ auf einem eigenen Test-PC:** Unter *Windows-Sicherheit → App- & Browsersteuerung → Einstellungen für Smart App Control* prüfen (Hinweis: Ein Ausschalten von Smart App Control in Windows 11 lässt sich nur durch Zurücksetzen von Windows wieder aktivieren — auf Wettbewerbs-/Schul-PCs ist Smart App Control je nach Richtlinie meist „Aus“ oder „Evaluierung“).

---

### Methode 2 (Optional): Nativ mit Flutter & Visual Studio kompilieren

Falls du eine native C++/Flutter-`.exe` statt des eingebetteten WebBundles bauen möchtest:

1. **[Git for Windows](https://git-scm.com/download/win)** installieren.
2. **[Flutter SDK für Windows](https://docs.flutter.dev/get-started/install/windows)** als ZIP herunterladen, nach `C:\src\flutter` entpacken und `C:\src\flutter\bin` in den Windows-`PATH` eintragen.
3. **[Visual Studio 2022 Community](https://visualstudio.microsoft.com/de/downloads/)** mit dem Workload **„Desktopentwicklung mit C++“** installieren.
4. *(Optional für Installer)*: **[Inno Setup 6](https://jrsoftware.org/isinfo.php)** installieren.
5. Danach ebenfalls `powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1` ausführen — das Skript erkennt Flutter automatisch.

---

### Bei späteren Updates (Zukünftige Versionen bauen)
1. Versionsnummer in `package.json` erhöhen (z. B. `"version": "1.1.0"`).
2. Falls du Code lokal geändert hast: einmalig `npm install` (falls noch nicht geschehen) und danach `npm run build` (oder das Skript macht `npm run build` automatisch, sobald `node_modules` existiert).
3. `powershell -ExecutionPolicy Bypass -File scripts\build_windows_portable.ps1` ausführen → erzeugt automatisch die neue, versionierte und signierte `dist_windows\GenerationZukunft.exe`.

---

##  Web-Entwicklung (Browser)

```bash
npm install
npm run dev
```
Öffnet die Live-Simulation unter `http://localhost:3000`.

## License

This project is licensed under the **PolyForm Noncommercial License 1.0.0** – see the [LICENSE.md](LICENSE.md) file for details.

* **Personal & Educational Use:** Free to use, modify, and share for non-commercial purposes.
* **Commercial Use:** Strictly prohibited without prior written permission. For commercial licensing inquiries, please contact jcob.glathe@gmail.com

