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

## Aufbau: Hauptbotschaft als jeder 2. Post

Die **Hauptbotschaft** („Der Grund für deinen sinkenden Lebensstandard ist die wachsende
Ungleichheit.") ist die Kernaussage der Kampagne und erscheint **als jeder zweite Post**,
jedes Mal textgleich, aber mit **anderem Verlaufs-Hintergrund** (Varianten A–L). Dazwischen
liegen die zwölf übrigen Aussagen. Reihenfolge: Cover → Hauptbotschaft → andere Aussage →
Hauptbotschaft → … → Call to action. So bleibt die Botschaft im Feed dauerpräsent, ohne
dass zwei gleiche Bilder nebeneinander stehen.

26 Slides: Cover (01), 12× Hauptbotschaft (gerade Nummern 02–24), 12 übrige Aussagen
(ungerade 03–25), CTA (26).

| # | Inhalt | # | Inhalt |
| --- | --- | --- | --- |
| 01 | Cover | 14 | ★ Hauptbotschaft · BG G |
| 02 | ★ Hauptbotschaft · BG A | 15 | Warum es der Schweiz gut geht |
| 03 | Schwächelnde Wirtschaft | 16 | ★ Hauptbotschaft · BG H |
| 04 | ★ Hauptbotschaft · BG B | 17 | Mittelklasse entlasten |
| 05 | Nie ein eigenes Haus | 18 | ★ Hauptbotschaft · BG I |
| 06 | ★ Hauptbotschaft · BG C | 19 | Milliardäre zahlen halb so viel (Quelle) |
| 07 | Krankenkassenprämien | 20 | ★ Hauptbotschaft · BG J |
| 08 | ★ Hauptbotschaft · BG D | 21 | 2 % Mindeststeuer (Lösung) |
| 09 | Überfüllte Züge und Busse | 22 | ★ Hauptbotschaft · BG K |
| 10 | ★ Hauptbotschaft · BG E | 23 | Niemand wandert aus |
| 11 | Verstopfte Strassen | 24 | ★ Hauptbotschaft · BG L |
| 12 | ★ Hauptbotschaft · BG F | 25 | Trifft fair Besteuerte nicht |
| 13 | Am Monatsende weniger übrig | 26 | Call to action |

Als **Einzelposts** in dieser Reihenfolge posten, dann ist jeder zweite Beitrag die
Hauptbotschaft. Als **Karussell** lieber eine Teilmenge wählen (Instagram erlaubt max. 20).

Die Slides tragen bewusst **keinen** „X / N"-Zähler, damit Reihenfolge und Anzahl
ohne Renummerierung änderbar bleiben; Instagram zeigt die Position ohnehin als Punkte.

## Gleiche Aussagen, gleicher Hintergrund wie die Startseite

Jede Aussage erscheint **auch auf der Startseite** (`/`) als Band über die volle Breite,
mit **demselben Verlauf** wie die zugehörige Slide (Hero = Hauptbotschaft BG A, danach die
Bänder in `src/components/sections/ClaimsSection.vue`). Wer hier eine Aussage oder eine
Farbe ändert, gleicht sie dort an, und umgekehrt.

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

`slides.html` erzeugt das Deck **datengetrieben** per JavaScript: oben die Hauptbotschaft
(`MAIN`) mit den zwölf Hintergrund-Varianten (`MAIN_BG`, A–L), darunter die übrigen
Aussagen (`OTHERS`, je mit `bg: [g1,g2,g3,g4]`, optional `dark`, `source`, `fs`). Eine
neue Aussage: ein Eintrag in `OTHERS` ergänzen (und bei Bedarf eine `MAIN_BG`-Variante,
damit die Alternierung aufgeht). Sehr lange Wörter bekommen `fs` (Schriftgrösse in px).

## Quellen-Hinweis (wichtig)

Die Aussage „Milliardäre zahlen nur halb so viel Steuern auf ihr Einkommen wie der
Mittelstand" steht **ohne Zahlen** auf der Slide.

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
