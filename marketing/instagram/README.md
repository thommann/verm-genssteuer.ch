# Instagram-Material — Vermögenssteuer

Leuchtende, auffällige Sharepics für eine Instagram-Karussell-Kampagne, gebaut als
reines HTML/CSS und als PNG exportierbar. Farben und Logo stammen aus der
Website-Palette (`src/styles/main.css`, `public/logo.svg`), hier in einer kräftigeren,
„leuchtenden" Variante.

## Format

Instagram-Feed 2026: **Hochformat 4:5, 1080 × 1350 px** (volle Feed-Breite, der von
Instagram empfohlene Standard und auch für die Profil-Vorschau optimal). Jeder
`.slide` in `slides.html` ist exakt 1080 × 1350 px.

> Für Stories/Reels (9:16, 1080 × 1920 px) müssten die Slides oben/unten mit Rand
> versehen werden; das ist hier bewusst nicht enthalten, da das Karussell auf den
> Feed zielt.

## Slides

| # | Datei | Inhalt |
| --- | --- | --- |
| 01 | `slide-01.png` | Cover: „Wem gehört die Schweiz?" |
| 02 | `slide-02.png` | Problem: sinkender Lebensstandard ↔ Ungleichheit |
| 03 | `slide-03.png` | Problem: schwächelnde Wirtschaft ↔ Ungleichheit |
| 04 | `slide-04.png` | Problem: nie ein eigenes Haus ↔ Ungleichheit |
| 05 | `slide-05.png` | Warum es der Schweiz gut geht (Vermögenssteuer) |
| 06 | `slide-06.png` | Die Mittelklasse muss entlastet werden |
| 07 | `slide-07.png` | **Die Ungerechtigkeit:** Milliardäre zahlen nur halb so viel Einkommenssteuer wie der Mittelstand |
| 08 | `slide-08.png` | 2 % Mindeststeuer (Lösung) |
| 09 | `slide-09.png` | Niemand wandert aus |
| 10 | `slide-10.png` | Trifft fair Besteuerte nicht |
| 11 | `slide-11.png` | Call to action: vermögenssteuer.ch |

Die Slides tragen bewusst **keinen** „X / N"-Zähler mehr, damit Reihenfolge und Anzahl
ohne Renummerierung änderbar bleiben; Instagram zeigt die Position ohnehin als Punkte.

## Export (PNG erzeugen)

```bash
npm install                       # einmalig
npx playwright install chromium   # einmalig
node marketing/instagram/export.mjs       # scale 2 -> 2160x2700, scharf
node marketing/instagram/export.mjs 1     # exakt 1080x1350
```

Die PNGs landen in `marketing/instagram/out/` und sind direkt postbar. `out/` ist
nicht eingecheckt (generierte Artefakte); die Quelle der Wahrheit ist `slides.html`.

Alternativ ohne Skript: `slides.html` im Browser öffnen und jeden `.slide` per
Screenshot/„Drucken als PDF" abgreifen.

## Texte bearbeiten

Alle Aussagen stehen direkt im `slides.html`. Verlaufsfarben je Slide werden über die
Custom Properties `--g1..--g4` im `style`-Attribut der `section.slide` gesetzt. Sehr
lange Aussagen bekommen `data-len="long"` bzw. `"xlong"` für eine kleinere Schriftgrösse.

## Quellen-Hinweis (wichtig)

Slide 07 macht die zentrale Aussage **ohne Zahlen**: „Milliardäre zahlen nur halb so viel
Steuern auf ihr Einkommen wie der Mittelstand."

Quelle: **Gabriel Zucman, „A blueprint for a coordinated minimum effective taxation
standard for ultra-high-net-worth individuals", G20-Report 2024**
([PDF](https://gabriel-zucman.eu/files/report-g20.pdf), Quelle `zucman_g20` in
`sources.json`). Der Report bündelt die nationalen Studien (Bach u. a. für Frankreich,
Bruil u. a. für die Niederlande, Saez/Zucman für die USA, Berlusconi-Fall für Italien)
mit einheitlicher Methode; alle Sätze als Anteil des Vor-Steuer-Einkommens.

Die Zahlen hinter der „Hälfte" (zur Belegbarkeit, nicht auf dem Slide):

- **Alle Steuern zusammen (Abb. 1):** in Frankreich ~**27 %** für die Milliardäre
  gegenüber ~**50 %** für fast alle anderen Gruppen, also gut die Hälfte. Dieselbe
  Regressivität an der Spitze in den USA, Italien und den Niederlanden.
- **Nur die individuelle Einkommenssteuer (Abb. 2):** noch krasser, Milliardäre
  ~0 % (NL), 1,7 % (FR), ~8 % (US), normale Erwerbstätige bis ~15–20 %.

Der Slogan „halb so viel" ist die konservative, gut belegte Variante (Gesamtsteuersatz).

Einordnung für die Transparenz:

- Die Werte sind **international** (FR/NL/US/IT), nicht schweizspezifisch; eine sauber
  belegte CH-Entsprechung existiert so nicht. Die Länderstudie von I. Martínez (Oxfam /
  Netzwerk Steuergerechtigkeit, 2024; Quellen `reichensteuer_studie` /
  `reichensteuer_studie_ch`) zeigt für die Schweiz beim *Vermögens*satz sogar eher das
  Gegenteil. Wer eine rein schweizbezogene Zahl will, nimmt die „Recovery"-Kennzahl der
  Website (Superreiche verdienen die 2 % in ~103 Tagen wieder, Medianhaushalt ~3,4 Jahre;
  Quellen `zucman_g20` + `bfs_habe`).

## Caption-Vorschläge

**Karussell (gesamt):**

> Wem gehört die Schweiz? 🇨🇭 Neun Karten über Ungleichheit, eine starke Mittelklasse
> und eine faire Mindeststeuer auf die grössten Vermögen. Alle Zahlen und Quellen:
> vermögenssteuer.ch
>
> #Vermögenssteuer #Steuergerechtigkeit #Schweiz #TaxTheRich #Ungleichheit #Mittelstand

**Einzelpost Slide 07:**

> Milliardäre zahlen nur halb so viel Steuern auf ihr Einkommen wie der Mittelstand. Das
> ist keine Meinung, das ist gemessen. Quelle: G. Zucman, G20-Report 2024. Mehr:
> vermögenssteuer.ch
