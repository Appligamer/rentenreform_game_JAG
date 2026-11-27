# Generation Zukunft — Renten-Simulation (`econo=me`)

Plattformübergreifendes Simulations- und Strategiespiel zur deutschen Rentenversicherung, dem **Rentenpaket II (Haltelinie 48 %)** und dem **Generationenkapital (Aktienrente)** — entwickelt von **Jacob Glathe & Team** für **macOS**, **iOS/iPadOS**, **Windows** und **Web**.

<p>
  <a href="Protocoll.md">
    <img src="https://img.shields.io/badge/Entwicklungsprotokoll-Protocoll.md-f59e0b?style=for-the-badge&labelColor=18181b&logo=readthedocs&logoColor=f59e0b" height="32" alt="Entwicklungsprotokoll (Protocoll.md)" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="LICENSE.md">
    <img src="https://img.shields.io/badge/Lizenz-PolyForm_Noncommercial_1.0.0-2563eb?style=for-the-badge&labelColor=18181b&logo=opensourceinitiative&logoColor=ffffff" height="32" alt="Lizenz: PolyForm Noncommercial 1.0.0" />
  </a>
</p>

<p>
  <a href="#macos--ios--ipados-xcode">
    <img src="https://img.shields.io/badge/macOS-Xcode-27272a?style=for-the-badge&labelColor=18181b&logo=apple&logoColor=ffffff" height="28" alt="macOS Xcode" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="GenerationZukunft_iOS.xcodeproj">
    <img src="https://img.shields.io/badge/iOS_%26_iPadOS-Xcode-27272a?style=for-the-badge&labelColor=18181b&logo=apple&logoColor=ffffff" height="28" alt="iOS und iPadOS Xcode" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="#windows-eine-versandfertige-signierte-exe-erstellen-schritt-für-schritt">
    <img src="https://img.shields.io/badge/Windows-.exe_%2F_.bat-27272a?style=for-the-badge&labelColor=18181b&logo=windows&logoColor=ffffff" height="28" alt="Windows .exe Build" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="web/src">
    <img src="https://img.shields.io/badge/Web--App-web%2Fsrc-27272a?style=for-the-badge&labelColor=18181b&logo=react&logoColor=61dafb" height="28" alt="Web-App Quellcode" />
  </a>
</p>

<p>
  <a href="docs/graphic_designer_briefing.md">
    <img src="https://img.shields.io/badge/Design-Grafik--Briefing-27272a?style=for-the-badge&labelColor=18181b&logo=figma&logoColor=ffffff" height="28" alt="Grafik-Briefing" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href=".github/workflows/main.yml">
    <img src="https://img.shields.io/badge/CI_%2F_CD-GitHub_Actions-27272a?style=for-the-badge&labelColor=18181b&logo=githubactions&logoColor=ffffff" height="28" alt="GitHub Actions CI/CD" />
  </a>
</p>

---

## Schnellzugriff & Wichtigste Projekt-Infos

| Bereich | Datei / Pfad | Zweck & Hinweise |
| :--- | :--- | :--- |
| **Entwicklungsprotokoll** | [`Protocoll.md`](Protocoll.md) | Vollständiges Änderungs- & Commit-Protokoll (täglich aktualisiert) |
| **Lizenz** | [`LICENSE.md`](LICENSE.md) | **PolyForm Noncommercial 1.0.0** (nur nicht-kommerzielle Nutzung; Kontakt: `jcob.glathe@gmail.com`) |
| **macOS App (Xcode)** | [`GenerationZukunft_macOS.xcodeproj`](GenerationZukunft_macOS.xcodeproj) | Natives macOS-Projekt (Schema `Runner`, macOS 12.0+, Team `Y4K9X2HCX2`) |
| **iOS & iPadOS (Xcode)** | [`GenerationZukunft_iOS.xcodeproj`](GenerationZukunft_iOS.xcodeproj) | Natives iPhone/iPad-Projekt (Schema `GenerationZukunft_iOS`, iOS 15.0+, `TARGETED_DEVICE_FAMILY = 1,2`) |
| **Windows Starter** | [`GenerationZukunft_Windows.bat`](GenerationZukunft_Windows.bat) | Direkter Windows-Starter & portable `.exe`-Erstellung via [`scripts/build_windows_portable.ps1`](scripts/build_windows_portable.ps1) |
| **Web-Simulation** | [`web/src/`](web/src) | React + TypeScript + Tailwind Simulationskern (Web-Build nach [`web/dist/`](web/dist)) |
| **Plattform-Code** | [`platforms/`](platforms) | Native Swift-Bridge (`platforms/shared/`), iOS (`platforms/ios/`), macOS (`platforms/macos/`), Windows/Flutter |
| **Launcher-Skripte** | [`launchers/`](launchers) | Terminal-/Simulator-Starter (`START_GAME_MAC.command`, `START_GAME_IOS.command`, `GenerationZukunft.app`) |
| **Grafik & Artworks** | [`artworks/`](artworks) & [`docs/graphic_designer_briefing.md`](docs/graphic_designer_briefing.md) | Grafik-Slots (`HandDrawnFrame`) & Designer-Briefing |

---

## Entwicklungsprotokoll (`Protocoll.md`)



<details open>
<summary><strong>Aktueller Stand (2026-11-27) — Vollständiges Protokoll öffnen: <a href="Protocoll.md">Protocoll.md</a></strong></summary>

- **Xcode-Projekte strikt getrennt:** `GenerationZukunft_macOS.xcodeproj` (macOS-only, Schema `Runner`) und `GenerationZukunft_iOS.xcodeproj` (iOS & iPadOS 15.0+, Schema `GenerationZukunft_iOS`).
- **iPhone-11- & Watchdog-/SIGKILL-Fix:** `WKWebView`-Start und `LocalBundleHTTPServer` aus `viewDidLoad()`/`scene(_:willConnectTo:)` auf `viewDidAppear` + Hintergrund-GCD-Queue verlagert; natives Lade-/Retry-Overlay ergänzt; ATS-Ausnahmen (`127.0.0.1`, `localhost`), `es2020`/`safari15`-Build-Target, `EINTR`/`EAGAIN`-Socket-Härtung, Offline-Inline-Fallback (`buildInlinedAppHTML`) und explizites `WebKit.framework`-Linking integriert.
- **Haptisches Feedback:** Web (`Navigator.vibrate` in `web/src/utils/haptics.ts`) + native Swift-`HapticBridge` (iOS Taptic Engine / macOS Trackpad).
- **Root-Dateien:** `LICENSE.md` (PolyForm Noncommercial License 1.0.0), `README.md` und `Protocoll.md` liegen wieder direkt im Hauptverzeichnis.

👉 **[Komplette Historie ab 2026-10-20 in `Protocoll.md` lesen](Protocoll.md)**

</details>

---

## macOS & iOS / iPadOS (Xcode)

Das Projekt enthält ein vorkompiliertes Offline-`WebBundle` und einen lokalen Loopback-Server + `BundleSchemeHandler`-Fallback (`app://local/index.html`).

1. Öffne je nach Plattform das passende Xcode-Projekt direkt im Hauptordner:
   - **macOS:** **`GenerationZukunft_macOS.xcodeproj`** → Schema **`Runner`** → **My Mac** (strikt macOS-only)
   - **iOS & iPadOS:** **`GenerationZukunft_iOS.xcodeproj`** → Schema **`GenerationZukunft_iOS`** → **iPhone / iPad Simulator** oder angeschlossenes iPhone/iPad (ab iOS 15.0)
2. Klicke auf **Play (`Cmd + R`)**.

---

## Windows: Eine versandfertige, signierte `.exe` erstellen (Schritt-für-Schritt)

### Methode 1 (Empfohlen — autarkes Build-Skript nur mit Windows-Bordmitteln)

Das Skript **`scripts\build_windows_portable.ps1`** automatisiert jeden Release-Build für aktuelle **und zukünftige Versionen**:
- Liest die Versionsnummer automatisch aus `package.json` (und baut bei installiertem `node_modules` automatisch neu via `npm run build`, sonst über das aktuelle `WebBundle`).
- Bettet das komplette Spiel, das mehrstufige App-Icon (`platforms\windows\runner\resources\app_icon.ico`, `16×16` bis `256×256`, inkl. `favicon.ico` für die Windows-Taskleiste), das Windows-Manifest und die Produkt-Metadaten in **eine einzige autarke `GenerationZukunft.exe`** ein.
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

