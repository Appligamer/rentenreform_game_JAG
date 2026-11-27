# Entwicklungs- und Änderungsprotokoll (`Protocoll.md`)

**Projekt:** `Generation Zukunft` (`pension_game_simulation`) — Bundeswettbewerb **econo=me** (*„Rente gut, alles gut?“*)  
**Repository:** `https://github.com/Appligamer/rentenreform_game_JAG`  
**Protokollregel:** Für jeden Kalendertag existiert **genau ein Abschnitt** (`## YYYY-MM-DD`). Alle Änderungen am selben Tag werden direkt in den bestehenden Abschnitt des jeweiligen Tages eingepflegt; erst an einem neuen Kalendertag wird oben ein neuer Tagesabschnitt angelegt.

--
## 2026-11-27

### GitHub-Commits (Chronologisch)
- **`6475376`** *(refactor(macos): add iOS support to Xcode project)* — `MainFlutterWindow` in `MacGameViewController` refaktoriert und das iOS-Target/Scheme **`Runner-iOS`** direkt in `macos/Runner.xcodeproj` integriert (`Runner-iOS.xcscheme`, `START_GAME_IOS.command`, `.github/workflows/main.yml`).
- **`8800d93`** *(refactor(ios/macos): rewrite local HTTP server and update app branding)* — `NWListener` in `macos/Shared/BundleSchemeHandler.swift` und `ios/Runner/BundleSchemeHandler.swift` durch einen synchron bindenden POSIX-BSD-Socket-Loopback-Server (`LocalBundleHTTPServer` auf `127.0.0.1`) ersetzt, um `WKWebView`-CORS- und ES-Modul-Probleme (schwarzer Bildschirm) endgültig zu beseitigen; `WKUIDelegate` ergänzt; macOS-Menüs/Info.plist auf „Generation Zukunft“ umgestellt; WebBundle-Assets aktualisiert.
- **`0e52c5b`** *(Update project.pbxproj)* — Xcode-Projektdatei `macos/Runner.xcodeproj/project.pbxproj` auf `objectVersion = 56` aktualisiert und das Signatur-Team `DEVELOPMENT_TEAM = Y4K9X2HCX2` für `Runner` und `Runner-iOS` (Debug & Release) eingetragen.

### Weitere lokale Optimierungen & Bugfixes (Workspace)
- **WebBundle- & Xcode-Härtung:**
  - `macos/Shared/BundleSchemeHandler.swift` & `ios/Runner/BundleSchemeHandler.swift`: Pfadabgrenzung im Loopback-Server und Scheme-Handler auf exakten `rootPath`- bzw. `rootPath + "/"`-Abgleich verschärft.
  - `macos/Runner/MainFlutterWindow.swift` & `ios/Runner/GameViewController.swift`: `WKUIDelegate`-Handling, `autoresizingMask`, `minSize = 960×640` (macOS) und robustere `2,5s`-`#root`-Readiness-Prüfung mit sauberem `components(separatedBy: "::")` ergänzt.
  - `macos/Runner/Info.plist`: `CFBundleDisplayName` auf `Generation Zukunft` gesetzt.
  - `START_GAME_IOS.command`: Automatische Erkennung bereits gebooteter sowie beliebiger iPhone-Simulatoren plus `simctl bootstatus -b` vor App-Installation und Start ergänzt.
  - `.github/workflows/main.yml`: WebBundle-Synchronisation für sowohl `macos/Runner/WebBundle` als auch `ios/Runner/WebBundle` im CI-Workflow hinterlegt.
- **Gezielte Laufzeit-Stabilisierung in `src/` (ohne Änderung an Spielmechanik oder UI-Design):**
  - `src/utils/scoreHistory.ts`: Lesen und Schreiben von `window.localStorage` vollständig in `try/catch` gekapselt, damit ein `SecurityError` in restriktiven Safari-/WKWebView-Kontexten den App-Start nicht mehr blockiert.
  - `src/utils/consoleLogger.ts`: Re-entrancy-Schutz (`isNotifying`) und `typeof ErrorEvent`-Guard ergänzt, um Endlos-Rekursionen bei `console.error` während eines React-Renders auszuschließen.
  - `src/components/PlatformExportHub.tsx` & `src/components/DesignerAssetExplorer.tsx`: `navigator.clipboard.writeText` mit `try/catch` und `execCommand('copy')`-Fallback abgesichert.
  - `src/utils/soundEffects.ts`: `AudioContext`-Erzeugung gekapselt und automatisches `resume()` bei Status `suspended` ergänzt.
- **Verifikation & Dokumentation:**
  - `npm run lint` (`tsc --noEmit`), Vite-Production-Build, `dist/`-Abgleich mit `macos/Runner/WebBundle` & `ios/Runner/WebBundle`, Vite-SSR-Renderprüfung aller Views sowie Laufzeit-Simulation (`normal`, `hard`, `hardcore`) erfolgreich geprüft.
  - `Protocoll.md` mit vollständiger GitHub-Historie (`2026-10-20` bis `2026-11-27`) und Projekt-System-Prompt angelegt.

---

## 2026-11-26

### GitHub-Commits (Chronologisch)
- **`ca5f6e6`** *(build: update web production assets)* — Produktions-Web-Assets neu gebaut und im Repository aktualisiert.
- **`9ad8d75`** *(chore(macos): improve launcher scripts and MIME support)* — macOS-Launcher-Skripte verbessert und MIME-Typ-Unterstützung für ausgelieferte Web-Assets erweitert.
- **`15c5472`** *(fix(macos): ensure launcher script persists in foreground)* — `START_GAME_MAC.command` so umgebaut, dass der Server-Prozess aktiv im Vordergrund bleibt (kein sofortiges `[Prozess beendet]` mehr) und `npm install` automatisch bei fehlendem `vite` greift.
- **`9ec6798`** *(chore: ignore Xcode workspace files)* — `.gitignore` erweitert, um flüchtige Xcode-Workspace- und User-Dateien (`xcuserdata/`, `project.xcworkspace/`) auszuschließen.
- **`9a81b36`** *(ci: add GitHub Actions workflow for web and macOS)* — `.github/workflows/main.yml` für automatisches Linting, Web-Build und macOS-Xcode-Builds inklusive Artefakt-Upload eingerichtet.
- **`761c136`** *(chore(build): update macOS launch scripts and project settings)* — Verzeichnisstruktur bereinigt/abgeflacht (Flutter/Assets/Root-Starter vereinheitlicht), Startskripte (`START_GAME_MAC.command`, `GenerationZukunft.app`) und Xcode-Projektkonfigurationen überarbeitet.
- **`efea65b`** *(feat: implement local HTTP server for WKWebView)* — Lokalen Loopback-HTTP-Server in `BundleSchemeHandler.swift` für macOS und iOS eingeführt, um ES-Module, CSS und `localStorage` in `WKWebView` nativ zu laden; macOS-Entitlements (`Release.entitlements`), Window-Management und Plattform-Starter (`START_GAME_MAC.command`, `START_GAME_IOS.command`, `START_GAME_WINDOWS.bat`, `build_windows_portable.ps1`) angepasst.

---

## 2026-11-25

### GitHub-Commits (Chronologisch)
- **`393e83b`** *(docs: simplify graphic designer briefing)* — `graphic_designer_briefing.md` verschlankt und für Grafik-Zulieferungen klarer strukturiert.
- **`5e2bc05`** *(fix 3,8)* — Anpassungen in `macos/Runner.xcodeproj/project.pbxproj` und `macos/Runner/Base.lproj/MainMenu.xib` für die macOS-Xcode-Kompatibilität.
- **`09b46ae`** *(Update license from MIT to PolyForm Noncommercial 1.0.0)* — Lizenzwechsel von MIT auf **PolyForm Noncommercial 1.0.0**.
- **`6e59e31`** *(Add LICENSE.md file)* — Lizenzdatei `LICENSE.md` hinzugefügt.
- **`f990fcf`** *(Update LICENSE.md with new copyright notice)* — Copyright-Hinweis in `LICENSE.md` aktualisiert.
- **`91faa82`** *(Update README with license and section heading changes)* — `README.md` an die neue Lizenz und aktualisierte Abschnittsüberschriften angepasst.
- **`8edc93a`** *(Change commercial use contact email in README)* — Kontaktadresse für kommerzielle Anfragen in `README.md` aktualisiert.

---

## 2026-11-24

### GitHub-Commits (Chronologisch)
- **`8786e52`** *(feat: add early log capture for webview2)* — Frühe Log-Erfassung (`__EARLY_LOGS__`) für die WebView-Diagnose integriert.
- **`ff5095b`** *(bh)* — Aktualisierung von Xcode-Metadaten (`UserInterfaceState.xcuserstate` und `Runner-iOS.xcscheme`).
- **`9f0c4eb`** *(unnötiger ballast)* — Nicht benötigte Screenshot-/Testdateien aus `WebBundle/assets/aistudio/` entfernt.
- **`b36104a`** *(Remove synchronization note from README)* — Synchronisationshinweis aus `README.md` entfernt.
- **`7dc5113`** *(refactor(windows): improve build automation and stability)* — Windows-Build-Skript und Desktop-Stabilität verbessert.
- **`d7d6ba2`** *(refactor: simplify project and update assets)* — Projektstruktur vereinfacht und WebBundle-/Asset-Dateien aktualisiert.
- **`f1a5073`** *(Update UserInterfaceState.xcuserstate)* — Xcode-Benutzeroberflächenstatus aktualisiert.
- **`cece7a8`** *(Merge branch 'main' of https://github.com/Appligamer/rentenreform_game_JAG)* — Branch-Zusammenführung auf `main`.
- **`0fc8008`** *(fix: update font loading and assets)* — Schriftarten-Laden und Asset-Referenzen korrigiert.
- **`b98ad74`** *(Create UserInterfaceState.xcuserstate)* — Xcode-Workspace-Zustandsdatei angelegt.
- **`7eb57e4`** *(chore: update gitignore and remove IDE user data)* — `.gitignore` gepflegt und IDE-Benutzerdaten entfernt.
- **`eed16f6`** *(docs(windows): simplify portable build process)* — Dokumentation für den portablen Windows-Build vereinfacht.
- **`ba35869`** *(chore: add favicon support and update build docs)* — Favicon-Unterstützung (`index.html`) und Build-Dokumentation ergänzt.
- **`1d13bb9`** *(chore: add MIT license and improve build script)* — Lizenzdatei ergänzt und Build-Skript weiter verbessert.

---

## 2026-11-20

### GitHub-Commits (Chronologisch)
- **`6425e30`** *(feat: update simulation logic and card architecture)* — Simulationslogik (Rentenmathematik, Balance-Engine, Schwierigkeitsgrade) und Reformkarten-Architektur erweitert.
- **`a473726`** *(Create launch.json)* — VS-Code-Startkonfiguration (`.vscode/launch.json`) erstellt.
- **`b06fcf2`** *(feat(ios): initialize native iOS runner project)* — Natives iOS-Runner-Projekt (`ios/Runner.xcodeproj`, `GameViewController.swift`, `BundleSchemeHandler.swift`) initialisiert.
- **`bf79056`** *(fix)* — Xcode-Workspace- und Scheme-Dateien für macOS korrigiert (`Runner.xcscheme`).
- **`e1f6064`** *(build: update documentation and Windows configuration)* — Projektdokumentation und Windows-Konfiguration aktualisiert.
- **`66f35c0`** *(Update UserInterfaceState.xcuserstate)* — Xcode-UI-Status aktualisiert.
- **`845db69`** *(Update UserInterfaceState.xcuserstate)* — Xcode-UI-Status aktualisiert.
- **`c984077`** *(feat(ios): implement SceneDelegate and add CORS support)* — `SceneDelegate.swift` für iOS-Lifecycle ergänzt und CORS-Header im Bundle-Handler implementiert.
- **`6796c81`** *(Update UserInterfaceState.xcuserstate)* — Xcode-UI-Status aktualisiert.

---

## 2026-10-21

### GitHub-Commits (Chronologisch)
- **`027e187`** *(feat: implement core game loop and UI styling)* — Kern-Spielschleife, Jahresdilemmata, Bürger-Lebenslauf und Apple-Dark-Mode-UI (`#000000` / `#161617`) umgesetzt.
- **`29a14c5`** *(fix(macos): correct typo in MainMenu.xib)* — Tippfehler in `MainMenu.xib` behoben.
- **`2beb734`** *(chore(macos): initialize main menu configuration)* — macOS-Hauptmenü (`MainMenu.xib`) initialisiert.
- **`6c69ef0`** *(chore(macos): update MainMenu XIB configuration)* — macOS-`MainMenu.xib`-Konfiguration aktualisiert.

---

## 2026-10-20

### GitHub-Commits (Chronologisch)
- **`8c906e8`** *(Initial commit)* — Erstes Initial-Commit des Repositories `rentenreform_game_JAG`.
- **`86da6d3`** *(feat: initialize project structure for pension simulation)* — Grundstruktur des plattformübergreifenden Rentensimulations-Projekts (`pension_game_simulation`) mit Web-/TypeScript- und Flutter-/Desktop-Basis aufgebaut.
