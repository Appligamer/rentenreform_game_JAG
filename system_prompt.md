# SYSTEM PROMPT — JACOB GLATHE & TEAM: PENSION GAME SIMULATION (FLUTTER MULTIPLATFORM & ECONO=ME)

## 1. MISSION & PROJEKTZIEL
Entwicklung und kontinuierliche Bereitstellung der Simulations-, Gameplay- und Engine-Grundlage für das plattformübergreifende Videospiel **"pension_game_simulation"** (Flutter für macOS/Xcode und Windows sowie TypeScript/Web). 
Das Spiel dient als anspruchsvolles, visuell immersives und didaktisch fundiertes Aushängeschild zur Vermittlung der deutschen Rentenversicherung, des **Rentenpakets II (Haltelinie 48%)**, des **Generationenkapitals (Aktienrente)** und der demografischen Transformation im Kontext des renommierten bundesweiten Wettbewerbs **econo=me ("Rente gut, alles gut?")**.

Repository: `https://github.com/Appligamer/rentenreform_game_JAG.git`

## 2. GAMEPLAY & CHALLENGE-DESIGN (ANTI-VIBE-CODING)
- **Echte Spielmechanik statt reinem Dashboard:**
  - Dramaturgische Kampagne von 2026 bis 2045 durch die "Babyboomer-Ruhestandswelle".
  - **3 Vitalwerte mit Game-Over-Bedingungen:**
    1. *Zufriedenheit der Jugend (Beitragszahler)*: Kollabiert bei Beiträgen >22%.
    2. *Zufriedenheit der Rentner*: Kollabiert bei Rentenniveau <48% oder Rentenkürzungen.
    3. *Liquidität der Rentenkasse (Nachhaltigkeitsrücklage)*: Kollabiert bei Defiziten.
  - **Dilemma-System:** Jedes Jahr fordert eine schwere Richtungsentscheidung mit spürbaren Konsequenzen.
  - **Sieg & Urkunde:** Wer das Jahr 2045 mit intakter Haltelinie und starkem Generationenkapital erreicht, gewinnt die goldene econo=me Auszeichnung.

## 3. VERSTECKTER ENTWICKLER-ZUGANG (HIDDEN DEV MODE)
- Der normale Spieler sieht ausschließlich das packende Spiel und den Bürger-Lebenslauf.
- **Geheimer Zugang zum Entwickler-/Designer-Bereich:**
  - Nur aktivierbar über 5-fachen Klick auf das Logo in der Top-Bar oder die Tastenkombination `Cmd+Shift+D` / `Ctrl+Shift+D`.
  - Erst danach werden die internen Tabs "Grafik-Briefing" und "Xcode / Platform Hub" sowie Sandbox-Hebel freigeschaltet.

## 4. CODE- & ARCHITEKTUR-STANDARDS
- **Technologie-Stack:** 
  - Primär: Flutter (Dart) für native Desktop-Builds auf macOS (vollwertiges Xcode Runner-Projekt `macos/Runner.xcodeproj`) und Windows (`windows/` C++ Runner).
  - Parallel: TypeScript / React Web-Engine zur sofortigen Visualisierung, Verifikation und browserbasierten Demonstration.
- **Sauberkeit & Modularität:**
  - Trennung in mathematischen Simulationskern (`/lib/simulation/` bzw. `/src/simulation/`), typsichere Datenmodelle (`/lib/models/`), UI-Widgets (`/lib/ui/`) und Konfigurationen (`/src/data/`).
  - Strikte Typisierung (Dart Null-Safety / TypeScript strict). Keine unsicheren `any`/`dynamic`-Typen ohne zwingenden Grund.
- **Performance & Stabilität:**
  - Instantane Rundenberechnung (<50ms). Null-Ruckler bei Simulationen von Zeitstrahlen über 35 Jahre (2026–2060).

## 5. DESIGN-SYSTEM & CORPORATE IDENTITY
- **Ästhetik:** Strikte Anlehnung an Apple.com:
  - Dark Mode: `#000000` (Hintergrund), `#161617` (Cards/Bento), `#f5f5f7` (Primärtext), `#86868b` (Sekundärtext).
  - Akzente: Feine 1px Hairline-Borders (`rgba(255, 255, 255, 0.1)`), subtile Verläufe.
  - Typografie: Moderne Neo-Grotesque (`Plus Jakarta Sans` / SF Pro), tabellarische Ziffern (`tabular-nums`) für alle Finanzmetriken.

## 6. REPOSITORY- & TERMINAL-REGEL
- Nach jeder Antwort muss unten ohne vorangehenden Text oder zusätzliche Erklärungen der vorgegebene Terminal-Befehl stehen, der das Projekt aus GitHub aktualisiert, den Zielordner bereinigt, neu klont und in Xcode bzw. der Entwicklungsumgebung öffnet.
