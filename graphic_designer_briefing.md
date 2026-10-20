# Grafik- & Asset-Briefing für den Illustrator / Grafikdesigner
## Projekt: "Generation Zukunft" — Renten-Simulation (econo=me Wettbewerb)

> **Liebe/r Illustrator/in & Grafikdesigner/in,**  
> dieses Dokument enthält die **vollständigen, pixelgenauen Spezifikationen für jede einzelne UI-Komponente**, die im Spiel handgezeichnete Grafiken benötigt.  
> Das Spiel vermittelt Schülern und jungen Erwachsenen die Funktionsweise der neuen Rentenversicherung (Rentenpaket II, Generationenkapital, Demografie) auf spannende und immersive Weise. Die Grafiken sind das emotionale Herzstück der User Experience!

---

## 1. Übergeordnete Art Direction & Stilbibel

### 1.1 Ästhetischer Leitfaden ("Hand-Drawn Meets Apple Minimal")
- **Stilistik:** Hochwertiger, handgezeichneter Comic- & Editorial-Stil (vergleichbar mit den Illustrationen in *The New Yorker*, *Kurzgesagt* oder Story-Games wie *Gris* / *Reigns* / *Frostpunk*).
- **Linienführung:** Klare, organische Tusche-/Tinten-Outlines (strikte Vektoren oder saubere Raster-Outlines), nicht verwaschen, mit variabler Strichstärke (Line-Weight 2–5 px bei 100% Zoom).
- **Schattierung:** Subtiles Cel-Shading oder Schraffuren (keine weichgezeichneten Photoshop-Airbrush-Verläufe).
- **Integration in den Dark Mode:**  
  - Das Interface verwendet ein tiefes Schwarz (`#000000`) und dunkles Anthrazit (`#161617`) als Basis.
  - Hintergründe und Illustrationen müssen auf dunklem Grund leuchten, ohne grell zu wirken.
  - Freigestellte Assets (Charaktere, Badges, Icons) **MÜSSEN mit transparentem Alpha-Kanal (PNG-32 / WebP)** geliefert werden.

### 1.2 Farbpalette & Semantik
| Bereich | Farbton | Hex-Code | Semantische Bedeutung |
|---|---|---|---|
| **Generationenkapital / Zukunft** | Sanftes Gold / Bernstein | `#F59E0B` bis `#D97706` | Globale Aktienfonds, Erträge, Hoffnung |
| **Stabilität & Haltelinie (48%)** | Apple-Blau / Azur | `#38BDF8` bis `#0284C7` | Gesetzliche Sicherheit, Vertrauen |
| **Demografische Balance / Erfolg** | Frisches Smaragdgrün | `#34D399` bis `#059669` | Gesunde Rentenkasse, Nachhaltigkeit |
| **Krise / Überlastung (>22% Beitrag)** | Gedämpftes Korallenrot | `#F87171` bis `#DC2626` | Belastung der jungen Generation, Defizit |
| **Gedämpfte Konturen & Schatten** | Tiefes Schiefergrau | `#1E293B` / `#0F172A` | Formgebung, Linienkontrast |

---

## 2. Detaillierte Komponenten-Spezifikationen

Nachfolgend findest du für **jede einzelne Komponente**, die ein Artwork benötigt, die exakten Maße, Stimmungen, Bildinhalte und Dateinamen.

---

### KOMPONENTE A: Szenario- & Spielfeld-Hintergründe (Background Scenes)

Diese Hintergründe bilden den oberen bzw. zentralen Blickfang im Spiel und spiegeln den Wandel der Gesellschaft von 2026 bis 2060 wider.

#### A1. Hintergrund "Berlin Regierungsviertel & Zukunfts-Skyline"
- **Dateiname:** `assets/images/backgrounds/bg_berlin_future_skyline.png`
- **Abmessungen:** `2560 × 1440 px` (Standard 16:9, skalierbar auf `1920 × 1080 px`)
- **Format:** PNG-24 (optimiert) oder WebP, max. 1.5 MB
- **Motiv:** Reichstagskuppel und Spree im Vordergrund, im Hintergrund moderne Solartürme und Finanzzentren. Stimmung wandelt sich je nach Rundenstatus (Tag, Dämmerung, Abend).
- **Fokuszone:** Die unteren 30% des Bildes sollten ruhig verlaufen (abgedunkelt in `#000000` via Alpha-Gradient), da dort UI-Overlays und Diagramme sitzen.

#### A2. Hintergrund "Krise: Demografie-Winter"
- **Dateiname:** `assets/images/backgrounds/bg_demographic_winter.png`
- **Abmessungen:** `2560 × 1440 px` (16:9)
- **Motiv:** Wolkig-melancholische Stimmung, verlassene Baustellen oder stilisierte Sanduhren, die die schwindende Zeit für Reformen symbolisieren.

---

### KOMPONENTE B: Charakter-Porträts (Bürger, Generationen & Politik)

Die Charaktere kommentieren Entscheidungen, treten als Ratgeber auf und altern im Lebenslauf-Modus mit.

- **Einheitliche Abmessungen:** `512 × 512 px` (1:1 Quadrat)
- **Format:** PNG-32 mit transparentem Hintergrund (Alpha-Kanal)
- **Ausschnitt:** Brustbild / Porträt, leicht 3/4-gewandt nach rechts oder frontal.

#### B1. "Felix / Mia – Die Berufseinsteiger (Generation Z/Alpha)"
Repräsentieren die junge Generation, die heute in die Rentenkasse einzahlt und 2065 in Rente gehen wird.
- `assets/images/characters/char_worker_young_neutral.png`: Neugierig, mit Laptop/Rucksack, bereit für den Berufsstart 2026.
- `assets/images/characters/char_worker_young_worried.png`: Frustriert/erschöpft mit Blick auf den Gehaltszettel (wenn der Beitragssatz auf 22,5% steigt).
- `assets/images/characters/char_worker_young_prosperous.png`: Entspannt lächelnd mit Smartphone (Aktien-Sparplan und Generationenkapital greifen).

#### B2. "Monika & Klaus – Die Babyboomer (Jahrgang 1960–1964)"
Gehen zwischen 2025 und 2031 in Rente und hoffen auf Verlässlichkeit der 48%-Haltelinie.
- `assets/images/characters/char_boomer_satisfied.png`: Zufrieden im Garten/am Wandern, genießt den wohlverdienten Ruhestand mit stabiler Rente.
- `assets/images/characters/char_boomer_protesting.png`: Besorgt mit Rentenbescheid in der Hand, symbolisiert Angst vor Altersarmut oder Rentenkürzungen.

#### B3. "Der Reform-Architekt / Bundesfinanzminister"
Der Spieler in seiner Rolle als politischer Entscheider.
- `assets/images/characters/char_minister_visionary.png`: Entschlossen am Konferenztisch mit Aktenmappe "Rentenpaket II".
- `assets/images/characters/char_minister_under_pressure.png`: Zerzaustes Haar, Krawatte gelockert, rote Zahlen im Bundeshaushalt.

---

### KOMPONENTE C: Reform- und Entscheidungskarten (Decision Cards)

Kernelement des Gameplays: Der Spieler zieht und spielt politische Karten aus, die die Rentenparameter verändern.

- **Abmessungen:** `600 × 900 px` (Seitenverhältnis 2:3)
- **Format:** PNG-32 mit transparenter Vignette oder Kartenecken (Radius 24 px)
- **Layout-Aufbau jeder Karte:**
  - Obere 55% (`600 × 500 px`): Handgezeichnete Hauptillustration
  - Untere 45%: Bleibt frei für programmatischen Text (Titel, Kosten, Effekte) oder wird mit einem handgezeichneten Rahmenband versehen.

#### C1. "Generationenkapital Hebeln (Kreditfinanzierter Staatsfonds)"
- **Dateiname:** `assets/images/cards/card_generationenkapital_boost.png`
- **Motiv:** Ein riesiger Setzling oder Bonsai-Baum, der aus einem Tresor mit Bundesadler wächst und goldene Münzen/Aktiencharts trägt.
- **Symbolik:** Zukunftsinvestition, Kapitalmarkterträge für die Rente.

#### C2. "Gesetzliche Haltelinie 48% Garantieren"
- **Dateiname:** `assets/images/cards/card_haltelinie_48.png`
- **Motiv:** Ein stabiler Leuchtturm oder eine antike Waage, die auf der 48%-Marke verankert ist und stürmischen Wellen trotzt.
- **Symbolik:** Soziale Sicherheit und Schutz vor Rentenverfall.

#### C3. "Anhebung des Renteneintrittsalters auf 68"
- **Dateiname:** `assets/images/cards/card_retirement_age_68.png`
- **Motiv:** Ein Kalenderblatt mit Jahreszahlen, das nach vorne geblättert wird, daneben eine Wanderkarte mit etwas steilerem Anstieg.

#### C4. "Beitragssatz deckeln vs. erhöhen"
- **Dateiname:** `assets/images/cards/card_contribution_slider.png`
- **Motiv:** Ein industrieller Druckregler mit Prozentanzeigen (18,6% grün bis 23% rot), aus dem Dampf entweicht.

#### C5. "Börsen-Rallye (Kapitalmarkt-Boom)"
- **Dateiname:** `assets/images/cards/card_market_bull.png`
- **Motiv:** Ein kraftvoller, eleganter Bulle aus Licht- und Datenlinien, der die Rendite des Generationenkapitals in die Höhe treibt.

#### C6. "Globaler Börsencrash & Zinsanstieg"
- **Dateiname:** `assets/images/cards/card_market_bear.png`
- **Motiv:** Ein Bär im Sturm vor Kursverläufen, der den Stresstest für kreditfinanzierte Aktienrenten visualisiert.

#### C7. "Demografischer Kipppunkt (Die Babyboomer-Welle)"
- **Dateiname:** `assets/images/cards/card_boomer_wave.png`
- **Motiv:** Eine gewaltige Welle, bestehend aus Geburtstags-Jahrgängen 1960–1965, die auf eine schmale Brücke der Beitragszahler zurollt.

#### C8. "Betriebliche Altersvorsorge (bAV) & Arbeitgeber-Zuschuss"
- **Dateiname:** `assets/images/cards/card_bav_matching.png`
- **Motiv:** Ein Handschlag zwischen Arbeitnehmer und Betrieb vor einer Fabriksilhouette mit geteiltem Sparschwein.

---

### KOMPONENTE D: Status-Badges, Währungen & Metrik-Icons

Kompakte Icons, die in der oberen Statusleiste und neben den Diagrammen angezeigt werden.

- **Abmessungen:** `256 × 256 px` (Exportfähig auch als `128 × 128 px` und `64 × 64 px`)
- **Format:** PNG-32 mit Freistellung (transparenter Hintergrund)

1. `assets/images/icons/icon_demography_ratio.png`:  
   *Motiv:* Stilisierte Figuren – zwei junge Erwerbstätige, die einen rüstigen Rentner auf den Schultern tragen (Symbol für Umlage 2:1 bzw. 1.5:1).
2. `assets/images/icons/icon_generation_capital.png`:  
   *Motiv:* Stilisierte goldene Globus-Münze mit Aufwärtspfeil (Generationenkapital / globale Aktienanlage).
3. `assets/images/icons/icon_pension_level.png`:  
   *Motiv:* Ein Schutzschild mit der eingravierten Ziffer "48%".
4. `assets/images/icons/icon_contribution_rate.png`:  
   *Motiv:* Zahnrad mit Prozentzeichen `%`, das die Last der Abgaben symbolisiert.
5. `assets/images/icons/icon_federal_subsidy.png`:  
   *Motiv:* Das stilisierte Bundesadler-Siegel oder Bundesfinanzministerium mit Steuergroschen.
6. `assets/images/icons/icon_pension_gap.png`:  
   *Motiv:* Eine aufbrechende Schlucht zwischen "Aktuellem Gehalt" und "Gesetzlicher Rente" (Rentenlücke).

---

### KOMPONENTE E: Lebenslauf- & Karriere-Vignetten

Für den Mikro-Modus, in dem der Spieler seinen eigenen Lebenslauf von 20 bis 67 Jahren steuert.

- **Abmessungen:** `800 × 500 px` (16:10 Querformat)
- **Format:** PNG-32

1. `assets/images/life/illu_first_salary.png`: Erster Arbeitsvertrag und erste Gehaltsabrechnung mit Rentenversicherungsabzug.
2. `assets/images/life/illu_compound_interest.png`: Die Zinseszins-Maschine: Ein Schneeball, der zu einer gewaltigen Kugel anrollt.
3. `assets/images/life/illu_golden_years.png`: Ein erfüllter Lebensabend ohne Geldsorgen auf einer sonnigen Terrasse.

---

### KOMPONENTE F: Urkunden-Rahmen & Auszeichnungs-Medaillen (econo=me Award)

Nach Durchspielen der Simulation (z. B. im Jahr 2045 oder 2060) erhält der Spieler ein Ergebnis-Zeugnis für den Wettbewerb.

1. `assets/images/awards/trophy_generation_justice.png` (`512 × 512 px`):  
   Goldmedaille mit zwei ineinandergreifenden Händen (Generationengerechtigkeit gemeistert: Haltelinie gehalten und Beiträge unter 21,5% gehalten).
2. `assets/images/awards/trophy_fiscal_stability.png` (`512 × 512 px`):  
   Silbermedaille mit Bankgebäude und Waage (Solide Staatsfinanzen ohne Schuldenspirale).
3. `assets/images/awards/certificate_border_frame.png` (`1600 × 1200 px`, 4:3):  
   Eleganter, handgezeichneter Urkundenrahmen mit Lorbeerzweigen und filigranen Mustern.

---

## 3. Technische Richtlinien für die Dateilieferung

- **Farbprofil:** sRGB (Standard für Bildschirme).
- **Auflösung:** 72 bis 144 DPI (entscheidend sind die angegebenen Pixelmaße).
- **Dateibenennung:** Ausschließlich Kleinbuchstaben und Unterstriche (z. B. `card_generationenkapital_boost.png`). Keine Umlaute oder Leerzeichen.
- **Ebenen:** Bitte behalte offene Arbeitsdateien (`.psd`, `.procreate` oder `.fig`) bei dir im Archiv, falls nachträglich Farbvarianten oder Ebenen-Animationen benötigt werden.
- **Export-Ordner:** Alle finalen Assets gehören in den Ordner `pension_game_simulation/assets/images/...`.

---
*Vielen Dank für deinen kreativen Einsatz! Bei Rückfragen zu einzelnen Szenen wende dich direkt an Jacob Glathe & das Entwickler-Team.*
