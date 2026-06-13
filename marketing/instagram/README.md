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
| 06 | `slide-06.png` | Superreiche zahlen nur halb so viel Einkommenssteuer (Stat) |
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

Slide 06 zeigt, dass der effektive Steuersatz an der Spitze **regressiv** wird: von
**46 % für die reichsten 0,1 %** auf nur **26 % für die reichsten 0,0002 %** (die
„Milliardäre", in Frankreich rund 75 Haushalte), gemessen am **gesamten wirtschaftlichen
Einkommen** (inkl. einbehaltener Unternehmensgewinne, also dem Einkommen, das normale
Steuern gar nicht erfassen). 26 % ist gut die Hälfte von 46 %, daher „nur halb so viel".

Quelle: **Laurent Bach, Antoine Bozio, Arthur Guillouzouic, Clément Malgouyres,
„Quels impôts les milliardaires paient-ils ?", Note IPP n°92, Institut des politiques
publiques, Juni 2023** ([PDF](https://www.ipp.eu/wp-content/uploads/2023/06/Note_IPP_Billionaires-version-actualisee.pdf)),
auf Basis französischer Steuer-Verwaltungsdaten 2016.

Einordnung für die Transparenz:

- Es ist eine **französische** Studie und betrifft das **Einkommen**, nicht das Vermögen.
  Es ist die zentrale empirische Grundlage der „Tax the Rich"-Debatte, die auch Gabriel
  Zucman (EU Tax Observatory) anführt; Autor der Studie ist aber das IPP, nicht Zucman.
  Sein paralleles US-Resultat (Saez/Zucman): die 400 reichsten US-Haushalte zahlten 2018
  effektiv rund 23 %, weniger als die arbeitende Bevölkerung.
- Eine sauber belegte, **schweizspezifische** Entsprechung existiert so nicht. Die
  Länderstudie von I. Martínez (Oxfam / Netzwerk Steuergerechtigkeit, 2024; Quellen
  `reichensteuer_studie` / `reichensteuer_studie_ch`) zeigt sogar, dass die Schweizer
  Vermögenssteuer die Spitze näher an die Maximalsätze bringt als Länder ohne
  Vermögenssteuer. Wer eine rein schweizbezogene Zahl will, nimmt die „Recovery"-Kennzahl
  der Website (Superreiche verdienen die 2 % in ~103 Tagen wieder, Medianhaushalt braucht
  dafür ~3,4 Jahre aus dem Vermögenseinkommen; Quellen `zucman_g20` + `bfs_habe`).

## Caption-Vorschläge

**Karussell (gesamt):**

> Wem gehört die Schweiz? 🇨🇭 Acht Sätze über Ungleichheit, eine starke Mittelklasse
> und eine faire Mindeststeuer auf die grössten Vermögen. Alle Zahlen und Quellen:
> vermögenssteuer.ch
>
> #Vermögenssteuer #Steuergerechtigkeit #Schweiz #TaxTheRich #Ungleichheit #Mittelstand

**Einzelpost Slide 06:**

> Je reicher, desto tiefer der Steuersatz: Die reichsten 0,1 % zahlen effektiv 46 % ihres
> Einkommens, die Milliardäre an der Spitze nur noch 26 %, also halb so viel. Eine
> Mindeststeuer beendet diese Regressivität. Quelle: Institut des politiques publiques
> (IPP), Note n°92, 2023. Mehr: vermögenssteuer.ch
