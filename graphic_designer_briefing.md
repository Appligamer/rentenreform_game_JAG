# Grafik- & Asset-Briefing für Grafik & Illustration
## Projekt: „Generation Zukunft“ — Renten-Simulation (`econo=me` Wettbewerb)

> **Aktueller Stand der App (Web, macOS, iOS/iPadOS & Windows `.exe`):**  
> - **Ablageort:** Alle fertigen Dateien gehören in **genau einen zentralen Ordner: `artworks/`** im Projekt-Hauptverzeichnis (mit dem exakten Unterordner und Dateinamen).  
> - **Vollautomatische Erkennung:** Sobald eine Datei mit dem passenden Namen in `artworks/` liegt, erkennt das Build-System (`vite.config.ts`, `WebBundle`, `scripts\build_windows_portable.ps1`) sie beim nächsten Build automatisch — ohne Code-Änderung.  
> - **100 % optional:** Fehlt eine Datei noch, zeigt die App automatisch ihre eingebauten dunklen Editorial-Vektor-Illustrationen (keine Fehlermeldungen oder kaputten Bildsymbole).

---

## 1. Projekt-Kontext & Spielaufbau (Aktuelle Screens)

Das Spiel führt Nutzer von einem **Begrüßungsscreen** (mit „Direkt starten“, 4-Schritte-Tutorial und bisherigen Bestwerten) durch folgende Bereiche:
1. **Kampagne (2026–2045):** 20 Jahresrunden mit 4 Status-Ringen (Jugend, Rentner, Generationenkapital, Bundeskasse), jährlichen Politik-Dilemmata, **6 aktiven Reformkarten**, Verlaufsdiagramm und Ergebnis-Zeugnis im Zieljahr **2045**.
2. **Bürger-Lebenslauf (3-Säulen-Modell):** Mikro-Rechner von Berufseinstieg bis Rentenalter (gesetzliche Rente, bAV, private ETF-Vorsorge).
3. **Regeln & Wettbewerb:** Erklärung der Mechaniken und der realen Rentenformel für den Bundeswettbewerb *econo=me*.

---

## 2. Art Direction & Farbpalette („Apple Dark Minimal Meets Editorial“)

- **Stilistik:** Klarer, moderner Editorial-Illustrationsstil (Anmutung wie *The New Yorker*, *Kurzgesagt* oder reduzierte Story-Games).
- **Linien & Flächen:** Saubere Tusche-/Vektor-Konturen, dezentes Cel-Shading (keine weichen Airbrush-Nebel).
- **Dark-Mode-Basis:** Die App nutzt `#000000` (Hintergrund), `#161617` (Cards/Bento) und feine 1px-Rahmen (`rgba(255,255,255,0.1)`). Illustrationen sollen auf dunklem Untergrund kontrastreich, aber edel und nicht grell wirken.
- **Transparenz:** Freigestellte Motive (Charaktere, Icons, Medaillen) als **PNG-32 mit transparentem Alpha-Kanal** (alternativ `.webp` / `.svg`).

| Bereich | Farbton | Hex-Code | Verwendung |
|---|---|---|---|
| **Generationenkapital / Akzent** | Bernstein / Gold | `#F59E0B` bis `#D97706` | Aktienfonds, Erträge, Primär-Buttons |
| **Stabilität / Gesetzliche Rente** | Azur / Apple-Blau | `#38BDF8` bis `#0284C7` | Haltelinie 48 %, Sicherheit |
| **Balance / Erfolg** | Smaragdgrün | `#34D399` bis `#059669` | Stabile Kasse, positive Effekte |
| **Krise / Belastung** | Korallenrot | `#F87171` bis `#DC2626` | > 22 % Beitrag, Defizit-Warnung |
| **Dunkle Flächen & Outlines** | Schiefer / Anthrazit | `#1E293B` / `#101012` | Konturen, Schatten, App-Icon-Basis |

---

## 3. Prioritäten: Was ist JETZT sofort im Spiel sichtbar?

### Priorität 1 — Direkt in der aktuellen Oberfläche eingebunden (8 Assets)
Diese 8 Dateien werden sofort im aktiven Spiel angezeigt, sobald du sie in `artworks/` ablegst:

#### A) Die 6 aktiven Reformkarten (`artworks/cards/`)
> **Wichtiger UI-Hinweis:** In der aktuellen Oberfläche sitzt das Kartenbild im **oberen Karten-Banner (`h-32`, `object-cover`)**. Kartentitel, Kosten und Beschreibungstext rendert die App darunter im UI-Block.  
> **Bitte daher keinen Text direkt ins Bild schreiben** und das **Hauptmotiv kompakt im mittleren Bilddrittel** platzieren!  
> Unterstützte Formate: `.png` (Standard `600 × 900 px`, alternativ `1200 × 600 px` Querformat — im `object-cover`-Banner bleibt das Motiv mittig zentriert), `.webp` oder `.svg`.

1. **`artworks/cards/card_generationenkapital_boost.png`** (*Generationenkapital-Turbo*)  
   *Motiv:* Goldener Setzling / Bonsai-Baum, der aus einem Tresor mit Bundesadler wächst und Münzen/Kurslinien trägt.
2. **`artworks/cards/card_haltelinie_48.png`** (*Haltelinie 48 % absichern*)  
   *Motiv:* Standhafter Leuchtturm mit eingemeißelter „48%“ gegen stürmische Meereswellen (Azur/Blau).
3. **`artworks/cards/card_retirement_age_68.png`** (*Lebensarbeitszeit koppeln*)  
   *Motiv:* Nach vorne geblättertes Kalenderblatt neben Wanderkarte / ansteigendem Wegweiser.
4. **`artworks/cards/card_bav_matching.png`** (*Betriebsrenten-Pflichtzuschuss*)  
   *Motiv:* Vertrauensvoller Handschlag zwischen Arbeitnehmer und Betrieb vor Werkssilhouette und Sparschwein.
5. **`artworks/cards/card_market_bull.png`** (*Globale Wachstums-Offensive*)  
   *Motiv:* Dynamischer Bulle aus goldenen Licht- und Chartlinien im Aufwärtstrend.
6. **`artworks/cards/card_boomer_wave.png`** (*Fachkräfte- & Erwerbspakt*)  
   *Motiv:* Mächtige Welle aus den Jahrgängen 1960–1965, die von einer tragfähigen Brücke aufgefangen wird.

#### B) Charakter im Lebenslauf-Modus (`artworks/characters/`)
7. **`artworks/characters/char_worker_young_neutral.png`** (`512 × 512 px`, PNG-32 transparent)  
   *Motiv:* Brustbild eines jungen Berufseinsteigers (ca. 22 J., Gen Z/Alpha, 2026) mit Laptop/Rucksack, optimistisch, klare Tusche-Outlines.

#### C) Sieges-Trophäe im Ergebnis-Modal 2045 (`artworks/awards/`)
8. **`artworks/awards/trophy_generation_justice.png`** (`512 × 512 px`, PNG-32 transparent)  
   *Motiv:* Handgravierte Goldmedaille mit zwei ineinandergreifenden Händen und Lorbeerzweigen.

---

### Priorität 2 — Flutter-Desktop-Header & vorbereitete Erweiterungs-Slots
Diese Slots sind im Ordner `artworks/` vorbereitet und für den nativen Flutter-Build bzw. geplante Ausbaustufen vorgesehen:

#### Szenario-Hintergründe (`artworks/backgrounds/`, `2560 × 1440 px`, 16:9)
- **`artworks/backgrounds/bg_berlin_future_skyline.png`** *(im nativen Flutter-Spielfeld bereits verknüpft)*: Reichstagskuppel & Spree mit modernen Solar-/Finanztürmen; untere 30 % ruhig nach `#000000` auslaufend.
- **`artworks/backgrounds/bg_demographic_winter.png`**: Gedimmte Krisenstimmung mit Sanduhren / Nebel über der Skyline.

#### Weitere Charakter-Stimmungen (`artworks/characters/`, `512 × 512 px`, PNG-32 transparent)
- `char_worker_young_worried.png` (Sorge beim Blick auf hohe Beitragsabzüge)
- `char_worker_young_prosperous.png` (entspannt dank ETF-Sparplan & Generationenkapital)
- `char_boomer_satisfied.png` (zufriedener Ruhestand, Outdoor-Weste/Lesebrille)
- `char_boomer_protesting.png` (besorgt mit Rentenbescheid)
- `char_minister_visionary.png` (am Konferenztisch mit Akte „Rentenpaket II“)
- `char_minister_under_pressure.png` (Krawatte gelockert, Haushaltsdruck)

#### Reserve-Karten (`artworks/cards/`)
- `card_contribution_slider.png` (Druckregler / Ventil von 18,6 % grün bis 23 % rot)
- `card_market_bear.png` (Bär im Sturm vor fallenden Kursen)

#### Metrik-Icons (`artworks/icons/`, `256 × 256 px`, PNG-32 transparent)
- `icon_demography_ratio.png` (zwei junge Erwerbstätige stützen einen Senior)
- `icon_generation_capital.png` (goldene Globus-Münze mit Aufwärtspfeil)
- `icon_pension_level.png` (Schutzschild mit „48%“)
- `icon_contribution_rate.png` (Zahnrad mit `%`-Symbol)
- `icon_federal_subsidy.png` (Bundesfinanz-Siegel / Steuergroschen)
- `icon_pension_gap.png` (Kluft zwischen letztem Gehalt und gesetzlicher Rente)

#### Lebenslauf-Vignetten (`artworks/life/`, `800 × 500 px`, 16:10) & weitere Awards (`artworks/awards/`)
- `illu_first_salary.png` (Erste Gehaltsabrechnung 2026)
- `illu_compound_interest.png` (Schneeball-Zinseszinseffekt)
- `illu_golden_years.png` (entspannter Ruhestand)
- `trophy_fiscal_stability.png` (`512 × 512 px`, Silbermedaille Staatsfinanzen)
- `certificate_border_frame.png` (`1600 × 1200 px`, Urkundenrahmen für 2045)

---

## 4. App-Icon (macOS, iOS & Windows EXE/Taskleiste)

Aktuell nutzt die App auf allen Plattformen ein einheitliches minimalistisches Signet: einen **Bernsteingold-Ring (`#F59E0B`) auf dunkelanthrazitfarbenem Hintergrund (`#101012`)**.  
Falls du ein final illustriertes App-Icon lieferst:
- **Master-PNG:** `1024 × 1024 px`, sRGB, **vollflächig quadratisch ohne selbst abgerundete Ecken** (macOS/iOS runden automatisch ab).
- Zielorte für das Team beim Einpflegen:
  - Apple: `macos/Runner/Assets.xcassets/AppIcon.appiconset/icon_1024.png` (bzw. `ios/Runner/Assets.xcassets/AppIcon.appiconset/`)
  - Windows (`.exe` & Taskleiste): `windows/runner/resources/app_icon.ico` (Multi-Size-ICO mit `16, 24, 32, 48, 64, 128, 256 px` — wird automatisch in `GenerationZukunft.exe` und als `favicon.ico` eingebettet).

---

## 5. Checkliste für deine Dateilieferung

- **Farbraum:** sRGB
- **Dateinamen:** exakt wie oben — nur Kleinbuchstaben, Ziffern und Unterstriche (`_`), keine Leerzeichen oder Umlaute
- **Format:** `.png` (empfohlen), `.webp`, `.jpg` oder `.svg`
- **Ablage:** einfach in `artworks/<unterordner>/<dateiname>` speichern — im Dev-Katalog (*DevMode über `Ctrl+Shift+D` → Tab „Grafik-Briefing“*) kannst du alle Slots jederzeit live vorab prüfen
- **Quelldateien:** offene Dateien (`.psd`, `.procreate`, `.fig`, `.ai`) bitte separat sichern
