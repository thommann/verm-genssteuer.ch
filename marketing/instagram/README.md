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
| 07 | `slide-07.png` | **Alle Steuern zusammen:** Superreiche zahlen nur halb so viel (~50 % vs ~27 %) |
| 08 | `slide-08.png` | **Nur die Einkommenssteuer:** sie zahlen fast nichts (~3 % vs bis 20 %) |
| 09 | `slide-09.png` | 2 % Mindeststeuer (Lösung) |
| 10 | `slide-10.png` | Niemand wandert aus |
| 11 | `slide-11.png` | Trifft fair Besteuerte nicht |
| 12 | `slide-12.png` | Call to action: vermögenssteuer.ch |

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

- **Slide 07 (alle Steuern, Abb. 1):** **~27 %** für die Superreichen gegenüber **~50 %**
  für die Mittelschicht, also gut die Hälfte. Die Werte stammen aus der Frankreich-Studie
  (Bach u. a.), dem Vorzeigebeispiel des Reports; dieselbe Regressivität an der Spitze
  zeigt sich auch in den USA, Italien und den Niederlanden. Frankreich ist gewählt, weil
  sich die „Hälfte" in einem Hochsteuerland sauber zeigt (in den USA liegt schon der
  Schnitt nur bei ~28 %, dort wäre der Vergleich weniger anschaulich). Tilde = gerundet.
- **Slide 08 (nur Einkommenssteuer, Abb. 2):** **~3 %** ist der **Durchschnitt** der drei
  im Report ausgewiesenen Länder-Werte für Milliardäre (Niederlande ~0 %, Frankreich
  1,7 %, USA ~8 %; Mittel ≈ 3,2 %). Normale Erwerbstätige zahlen bis ~15–20 %. Grund für
  den Einbruch: quasi-systematische Nutzung von Holdinggesellschaften. (Die Differenz zu
  den ~27 % in Slide 07 ist die anteilige **Unternehmenssteuer**, in FR ~25 %.)

Die beiden Datenslides nennen bewusst **kein einzelnes Land** mehr, sondern eine
zusammengefasste Kennzahl, damit sie kurz und sofort verständlich bleiben. Die
Einzelwerte je Land stehen hier im README zur Belegbarkeit.

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

**Einzelpost Slide 07 + 08 (Paar):**

> Superreiche zahlen insgesamt nur halb so viel Steuern wie die Mittelschicht (~27 % statt
> ~50 %). Und auf ihr Einkommen sogar fast nichts: im Schnitt nur rund 3 %, während normale
> Arbeit bis 20 % zahlt. Quelle: G. Zucman, G20-Report 2024. Mehr: vermögenssteuer.ch
