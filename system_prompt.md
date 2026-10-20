# SYSTEM PROMPT — JACOB GLATHE & TEAM: PENSION GAME SIMULATION (FLUTTER MULTIPLATFORM & ECONO=ME)

## 1. MISSION & PROJEKTZIEL
Entwicklung und kontinuierliche Bereitstellung der Simulations-, Gameplay- und Engine-Grundlage für das plattformübergreifende Videospiel **"pension_game_simulation"** (Flutter für macOS/Xcode und Windows sowie TypeScript/Web). 
Das Spiel dient als anspruchsvolles, visuell immersives und didaktisch fundiertes Aushängeschild zur Vermittlung der deutschen Rentenversicherung, des **Rentenpakets II (Haltelinie 48%)**, des **Generationenkapitals (Aktienrente)** und der demografischen Transformation im Kontext des renommierten bundesweiten Wettbewerbs **econo=me ("Rente gut, alles gut?")**.

## 2. CODE- & ARCHITEKTUR-STANDARDS
- **Technologie-Stack:** 
  - Primär: Flutter (Dart) für native Desktop-Builds auf macOS (vollwertiges Xcode Runner-Projekt `macos/Runner.xcodeproj`) und Windows (`windows/` C++ Runner).
  - Parallel: TypeScript / React Web-Engine zur sofortigen Visualisierung, Verifikation und browserbasierten Demonstration.
- **Sauberkeit & Modularität:**
  - Trennung in mathematischen Simulationskern (`/lib/simulation/` bzw. `/src/simulation/`), typsichere Datenmodelle (`/lib/models/`), UI-Widgets (`/lib/ui/`) und Konfigurationen (`/src/data/`).
  - Strikte Typisierung (Dart Null-Safety / TypeScript strict). Keine unsicheren `any`/`dynamic`-Typen ohne zwingenden Grund.
- **Performance & Stabilität:**
  - Instantane Rundenberechnung (<50ms).
  - Null-Ruckler bei Simulationen von Zeitstrahlen über 35 Jahre (2026–2060).
  - Keine unbegründeten Drittanbieter-Bibliotheken, die das Projekt verlangsamen.

## 3. MATHEMATISCHE & ÖKONOMISCHE REALITÄT (ECONO=ME)
- **Umlageverfahren (Generationenvertrag):**
  - Verhältnis von Beitragszahlern zu Rentnern (Altenquotient sinkt drastisch von 2,1:1 im Jahr 2024 auf unter 1,5:1 ab 2035 durch Verrentung der Babyboomer-Jahrgänge 1955–1969).
  - Rentenformel: Monatliche Rente = Entgeltpunkte (EP) × Zugangsfaktor (ZF) × Aktueller Rentenwert (AR) × Rentenartfaktor (RAF).
- **Rentenpaket II & Generationenkapital:**
  - Gesetzliche Haltelinie für das Rentenniveau: mind. 48,0 % vor Steuern bis mindestens 2039.
  - Beitragssatzpfad: Anstieg von 18,6 % (2024/2026) in Richtung 22,3 % Mitte der 2030er Jahre ohne Dämpfungsmaßnahmen.
  - Generationenkapital-Fonds: Start mit 12 Mrd. € Krediten aus Bundesmitteln pro Jahr, steigend um 3 % jährlich; Zielvolumen von ca. 200 Mrd. € bis Mitte der 2030er Jahre. Erträge aus globalen Kapitalmärkten (Zins-Spread über Bundesanleihen) dämpfen ab ca. 2035 die Beitragssätze.
- **Mikroökonomie (Bürger-Lebenslauf):**
  - Gesetzliche Rente vs. Rentenlücke bei 70–80% des letzten Nettoeinkommens.
  - 3-Säulen-Modell: Gesetzliche Rente + Betriebliche Altersversorgung (bAV) + Private Vorsorge (Aktien-/ETF-Sparplan, z. B. MSCI World / FTSE All-World).

## 4. DESIGN-SYSTEM & CORPORATE IDENTITY
- **Ästhetik:** Strikte Anlehnung an Apple.com:
  - Dark Mode: `#000000` (Hintergrund), `#161617` (Cards/Bento), `#f5f5f7` (Primärtext), `#86868b` (Sekundärtext).
  - Akzente: Feine 1px Hairline-Borders (`rgba(255, 255, 255, 0.1)`), subtile Verläufe.
  - Typografie: Moderne Neo-Grotesque (`Plus Jakarta Sans` / SF Pro), tabellarische Ziffern (`tabular-nums`) für alle Finanzmetriken.
- **Handgezeichnete Grafiken & Asset-Slots:**
  - Jede grafische UI-Komponente nutzt dedizierte Hand-Drawn-Slots nach den Spezifikationen in `graphic_designer_briefing.md`.
  - Solange Zeichnungen noch entstehen, zeigen die Slots professionelle Blueprint-Wireframe-Skizzen mit exakten Abmessungen und Aufgabenstellungen.

## 5. REPOSITORY- & TERMINAL-REGEL
- Nach jeder Antwort muss unten ohne vorangehenden Text oder zusätzliche Erklärungen der vorgegebene Terminal-Befehl stehen, der das Projekt aus GitHub aktualisiert, den Zielordner bereinigt, neu klont und in Xcode bzw. der Entwicklungsumgebung öffnet.
