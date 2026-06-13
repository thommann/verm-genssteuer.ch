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
| 06 | `slide-06.png` | Superreiche zahlen weniger als der Durchschnitt (Stat) |
| 07 | `slide-07.png` | 2 % Mindeststeuer (Lösung) |
| 08 | `slide-08.png` | Niemand wandert aus |
| 09 | `slide-09.png` | Trifft fair Besteuerte nicht |
| 10 | `slide-10.png` | Call to action: vermögenssteuer.ch |

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

Slide 06 nennt den effektiven Steuersatz der weltweit reichsten ~0,01 % von
**rund 0,3 % ihres Vermögens** (G. Zucman, G20-Report 2024; World Inequality Report
2026). Das ist eine **globale** Kennzahl zur Regressivität an der Vermögensspitze.

Eine sauber belegte, **schweizspezifische** Zahl „Vermögen über 100 Mio. zahlt weniger
als der Durchschnitt" existiert so nicht: Die Länderstudie von I. Martínez (Oxfam /
Netzwerk Steuergerechtigkeit, 2024; Quelle `reichensteuer_studie` / `reichensteuer_studie_ch`)
zeigt im Gegenteil, dass die Schweizer Vermögenssteuer die Spitze näher an die
Maximalsätze bringt als Länder ohne Vermögenssteuer. Die Aussage auf Slide 06 ist daher
bewusst mit der globalen Zucman-Kennzahl belegt und so beschriftet. Wenn ihr lieber
eine rein schweizbezogene Aussage wollt, eignet sich die „Recovery"-Kennzahl der
Website (Superreiche verdienen die 2 % in ~103 Tagen wieder, Medianhaushalt braucht
dafür ~3,4 Jahre aus dem Vermögenseinkommen; Quelle `zucman_g20` + `bfs_habe`).

## Caption-Vorschläge

**Karussell (gesamt):**

> Wem gehört die Schweiz? 🇨🇭 Acht Sätze über Ungleichheit, eine starke Mittelklasse
> und eine faire Mindeststeuer auf die grössten Vermögen. Alle Zahlen und Quellen:
> vermögenssteuer.ch
>
> #Vermögenssteuer #Steuergerechtigkeit #Schweiz #TaxTheRich #Ungleichheit #Mittelstand

**Einzelpost Slide 06:**

> Die reichsten 0,01 % zahlen effektiv nur rund 0,3 % ihres Vermögens an Steuern,
> weniger als ein normaler Haushalt. Eine Mindeststeuer von 2 % ändert das.
> Quelle: Zucman, G20-Report 2024. Mehr: vermögenssteuer.ch
