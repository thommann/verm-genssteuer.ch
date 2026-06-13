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
| 02 | `slide-02.png` | Sinkender Lebensstandard ↔ Ungleichheit |
| 03 | `slide-03.png` | Schwächelnde Wirtschaft ↔ Ungleichheit |
| 04 | `slide-04.png` | Warum es der Schweiz gut geht (Vermögenssteuer) |
| 05 | `slide-05.png` | Die Mittelklasse muss entlastet werden |
| 06 | `slide-06.png` | **Alle Steuern zusammen:** Superreiche zahlen nur halb so viel (~50 % vs 27 %) |
| 07 | `slide-07.png` | **Nur die Einkommenssteuer:** Milliardäre zahlen fast nichts (NL ~0 %, FR 1,7 %, US ~8 %) |
| 08 | `slide-08.png` | 2 % Mindeststeuer (Lösung) |
| 09 | `slide-09.png` | Niemand wandert aus |
| 10 | `slide-10.png` | Trifft fair Besteuerte nicht |
| 11 | `slide-11.png` | Call to action: vermögenssteuer.ch |

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

Die Slides 06 und 07 sind ein **Paar zur selben Studie**, einmal mit allen Steuern,
einmal nur mit der Einkommenssteuer. Wichtig: Die Zahlen widersprechen sich nicht, sie
messen Verschiedenes (deshalb die Eyebrows „Alle Steuern zusammen" vs „Nur die
Einkommenssteuer").

Quelle für beide: **Gabriel Zucman, „A blueprint for a coordinated minimum effective
taxation standard for ultra-high-net-worth individuals", G20-Report 2024**
([PDF](https://gabriel-zucman.eu/files/report-g20.pdf), Quelle `zucman_g20` in
`sources.json`). Der Report bündelt die nationalen Studien (Bach u. a. für Frankreich,
Bruil u. a. für die Niederlande, Saez/Zucman für die USA, Berlusconi-Fall für Italien)
mit einheitlicher Methode; alle Sätze als Anteil des Vor-Steuer-Einkommens.

- **Slide 06 (alle Steuern, Abb. 1):** In Frankreich zahlen die Milliardäre einen
  effektiven Gesamtsteuersatz von **27 %**, während fast alle anderen Gruppen (Arbeiter,
  Mittelschicht, oberes 1 %) bei rund **50 %** liegen, also gut die Hälfte. Dieselbe
  Regressivität an der Spitze zeigt sich in den USA, Italien und den Niederlanden (diese
  vier Länder beherbergen ~35 % der Milliardäre und ~40 % des Milliardärsvermögens).
- **Slide 07 (nur Einkommenssteuer, Abb. 2):** Die effektive Einkommenssteuer der
  Milliardäre bricht an der Spitze ein, auf **~0 % in den Niederlanden, 1,7 % in
  Frankreich, ~8 % in den USA**, während normale Erwerbstätige bis ~15–20 % zahlen.
  Grund: quasi-systematische Nutzung von Holdinggesellschaften. (Die Differenz zu den
  27 % in Slide 06 ist die anteilige **Unternehmenssteuer**, in FR ~25 %.)

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

**Einzelpost Slide 06 + 07 (Paar):**

> Superreiche zahlen insgesamt nur halb so viel Steuern wie alle anderen (27 % statt
> ~50 %). Und auf ihr Einkommen sogar fast nichts: ~0 % in den Niederlanden, 1,7 % in
> Frankreich, ~8 % in den USA, während normale Arbeit bis 20 % zahlt. Quelle: G. Zucman,
> G20-Report 2024. Mehr: vermögenssteuer.ch
