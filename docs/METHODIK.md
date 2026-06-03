# Methodik — statistische Verfahren

> **Anspruch:** Jede Zahl auf der Seite ist exakt und reproduzierbar aus den
> ESTV-Klassendaten abgeleitet. Nichts ist fest verdrahtet oder geschätzt, ausser
> wo dies ausdrücklich als Näherung gekennzeichnet ist.
>
> **Beweis:** [`scripts/00_reproduce_statistics.py`](../scripts/00_reproduce_statistics.py)
> rechnet alle hier beschriebenen Verfahren allein aus den Eingabedaten nach und
> prüft sie gegen die publizierten Werte. Ausführen mit `python3 scripts/00_reproduce_statistics.py`
> — erwartet: *alle Prüfungen OK*.

Diese Datei dokumentiert das **Wie** (die Rechenverfahren). Das **Woher** (Beschaffung
und exakte Herkunft jeder Rohzahl) steht in [`docs/QUELLEN.md`](./QUELLEN.md).

---

## 1. Datengrundlage

Primärquelle ist die **ESTV-Vermögenssteuerstatistik**: für jedes Steuerjahr (2012–2022)
ein eigenes Workbook, daraus das Blatt `CH` mit der **Anzahl Steuerpflichtige** und dem
**steuerbaren Reinvermögen** je Vermögensklasse. `scripts/02_extract_estv.py` liest diese
11 Dateien direkt aus (Bezug und exakte Zellen: [`docs/QUELLEN.md`](./QUELLEN.md)).
Die Klassen sind fix:

| # | Klasse (CHF) | Untergrenze | Obergrenze | Breite |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 1 | > 0 – 50 000 | 0 | 50 000 | 50 000 |
| 2 | 50 000 – 100 000 | 50 000 | 100 000 | 50 000 |
| 3 | 100 000 – 200 000 | 100 000 | 200 000 | 100 000 |
| 4 | 200 000 – 500 000 | 200 000 | 500 000 | 300 000 |
| 5 | 500 000 – 1 Mio. | 500 000 | 1 000 000 | 500 000 |
| 6 | 1 – 2 Mio. | 1 000 000 | 2 000 000 | 1 000 000 |
| 7 | 2 – 3 Mio. | 2 000 000 | 3 000 000 | 1 000 000 |
| 8 | 3 – 5 Mio. | 3 000 000 | 5 000 000 | 2 000 000 |
| 9 | 5 – 10 Mio. | 5 000 000 | 10 000 000 | 5 000 000 |
| 10 | **> 10 Mio. (offen)** | 10 000 000 | — | ∞ |

Wichtig: Eine «Pflichtige» ist eine **Steuereinheit** (gemeinsam veranlagte Ehepaare =
eine Einheit). Reinvermögen = Bruttovermögen − Schulden zu **Steuerwerten**; 2./3. Säule
und Hausrat sind **nicht** enthalten. Das reale Marktvermögen der Spitze ist daher eher
noch konzentrierter. Die Kategorie **«unbeschränkt steuerpflichtig»** (CH-Wohnsitz, ab
2020 verfügbar) ist die sauberere Grösse für die Wohnbevölkerung und Standard auf der Seite.

Datendateien: `src/data/estv_distribution.json` (Anzahl + Reinvermögen je Klasse/Jahr).

---

## 2. Verfahren A — Verteilungs-Kennzahlen aus klassierten Daten

Sei eine Klasse *k* mit Anzahl `nₖ`, Reinvermögen `wₖ`, Untergrenze `aₖ`, Obergrenze `bₖ`,
Breite `Δₖ = bₖ − aₖ`. Gesamtzahl `N = Σ nₖ`, Gesamtvermögen `W = Σ wₖ`.

**Mittelwert** (exakt): `Mittel = W / N`.

**Median / Perzentile** — lineare Interpolation innerhalb der Klasse, in der das
Perzentil liegt:

```
Wert(p) = aₖ + (p·N − Σ_{j<k} nⱼ) / nₖ · Δₖ
```

wobei *k* die erste Klasse ist, in der die kumulierte Anzahl `p·N` erreicht. Robust für
Median (P50) und P90; P99 liegt in der offenen Top-Klasse und ist dort eine **Näherung**.

**Vermögensanteile:**
- Anteil **≥ 1 Mio.** und Anteil **≥ 10 Mio.** sind **exakt**, weil sie genau auf
  Klassengrenzen fallen: `Σ_{k≥6} wₖ / W` bzw. `w₁₀ / W`.
- Top 1 % / 5 % / 10 % (perzentilbasiert): das Vermögen der Schwellenklasse wird
  proportional zum Anzahl-Anteil aufgeteilt — **Näherung**, klar gekennzeichnet.

Reproduziert (unbeschränkt 2022): Median **CHF 45 078**, Anteil ≥ 10 Mio. **36,59 %**,
Anteil ≥ 1 Mio. **72,32 %**.

---

## 3. Verfahren B — Pareto-Tail der offenen Top-Klasse (> 10 Mio.)

Die oberste Klasse ist nach oben offen. Sie wird als **Pareto-Verteilung** modelliert:

```
P(X > x) = (x_min / x)^α   mit   x_min = 10 000 000
```

Kleineres α = dickerer Tail = höhere Konzentration. Zwei voneinander unabhängige
Schätzer für α:

1. **Aus dem Klassenmittel** der offenen Klasse (Standard auf der Seite):
   ```
   α = m / (m − x_min)      mit   m = w₁₀ / n₁₀  (Mittelwert der > 10-Mio-Klasse)
   ```
   Für eine Pareto-Verteilung gilt `E[X | X>x_min] = α·x_min/(α−1)`, nach α aufgelöst.

2. **Log-Log-Regression** über die kumulierten Überschreitungswahrscheinlichkeiten an
   den Klassengrenzen 1 / 2 / 3 / 5 / 10 Mio. (Steigung von `log P(X>x)` über `log x`).
   Dient als Quervalidierung.

Reproduziert (Klassenmittel): α = **1,3443 / 1,3313 / 1,3235** für 2020 / 2021 / 2022.

**Maximalvermögen `x_max`** wird aus dem Tail geschätzt (erwartetes Maximum von N
Pareto-Ziehungen). Es begrenzt die Extrapolation nach oben (siehe Verfahren D).

---

## 4. Verfahren C — Gini-Koeffizient (exakt zerlegt)

Weil sich die Klassen nicht überlappen, lässt sich der Gini exakt zerlegen in einen
**Zwischen-Klassen-** und einen **Innerklassen-Anteil**:

```
G = G_zwischen + Σₖ pₖ · sₖ · Gₖ
```

mit Anzahl-Anteil `pₖ = nₖ/N` und Vermögens-Anteil `sₖ = wₖ/W`.

**Zwischen den Klassen** (Brown-Formel über kumulierte Anteile `Xₖ`, `Yₖ` von arm nach
reich):
```
G_zwischen = 1 − Σₖ (Xₖ − Xₖ₋₁) · (Yₖ + Yₖ₋₁)
```

**Innerhalb einer Klasse** `Gₖ`:
- begrenzte Klasse → Annahme Gleichverteilung: `Gₖ = (bₖ − aₖ) / (3·(aₖ + bₖ))`
- offene Top-Klasse → Pareto: `Gₖ = 1 / (2α − 1)` (mit α aus dem Klassenmittel)

**Validierung:** Offizieller ESTV-Vermögens-Gini 2015 = **0,860**. Unsere Reproduktion:
Brown allein **0,8541**, verfeinert **0,8606** — exakt im erwarteten Band. Das ist der
strengste Test der gesamten Verteilungsrechnung.

---

## 5. Verfahren D — Populationsmodell des Rechners (170 Bins)

Für den interaktiven Rechner wird die Vermögensverteilung **ab 5 Mio.** in **170
geometrisch gestufte Bins** zerlegt — fein genug, um die stark nichtlineare Tarifkurve
exakt zu integrieren.

```
Anzahl Bins   NB = 170
Untergrenze   LO = 5 000 000          Obergrenze   HI = 50 000 000 000
Stufenfaktor  r  = (HI/LO)^(1/NB) = 1.055673…
Bandgrenzen   eᵢ = LO · rⁱ            Bandmitte    midᵢ = √(eᵢ · eᵢ₊₁)  (geometrisches Mittel)
```

**Besetzung je Bin** (Personen), aus den ESTV-Jahresparametern:

- **5 – 10 Mio.** — `f` Personen (ESTV-Anzahl der 5–10-Mio-Klasse), **gleichverteilt in
  der linearen Vermögensachse**:
  ```
  cnt[a,b] = f · (min(b, 10 Mio.) − a) / 5 000 000          für a < 10 Mio.
  ```

- **> 10 Mio.** — Pareto-Tail (Verfahren B), **hart bei `x_max` gekappt**:
  ```
  cnt[a,b] = N · ( (10 Mio./max(a, 10 Mio.))^α − (10 Mio./min(b, x_max))^α )
  ```
  mit `N` = ESTV-Anzahl > 10 Mio. **plus** `M` Pauschalbesteuerte (Annahme: sie folgen
  demselben Tail; siehe Abschnitt 7). Beispiel 2022: `N = 20 479 + 4 557 = 25 036`.

Genau diese Konstruktion erzeugt `scripts/02_extract_estv.py` als `calculator_bins.json`;
`scripts/00_reproduce_statistics.py` baut sie unabhängig nach und stimmt **bis auf
0,000000 Personen** überein — und damit das Aufkommen exakt (siehe Validierungstabelle).

Jahresparameter (`src/data/calculator_params.json`):

| Jahr | f (5–10 Mio.) | ESTV > 10 Mio. | M Pauschal | N (Tail) | α | x_max (CHF) |
|---|---|---|---|---|---|---|
| 2020 | 27 593 | 19 436 | 4 557 | 23 993 | 1,3443 | 18,13 Mrd. |
| 2021 | 29 797 | 21 457 | 4 557 | 26 014 | 1,3313 | 20,72 Mrd. |
| 2022 | 28 522 | 20 479 | 4 557 | 25 036 | 1,3235 | 21,06 Mrd. |

---

## 6. Verfahren E — Steuermodell (Tarif, Aufkommen, Dynamik)

Implementiert in [`src/lib/taxModel.js`](../src/lib/taxModel.js).

**Marginaler Tarif** (Grenzsatz auf den nächsten Franken), gedeckelt bei `Cap`:
```
τ(W) = min( Cap, Basis · (W / Schwelle)^k )
```

**Steuerbetrag** = Integral des Grenzsatzes über das Vermögen oberhalb der Schwelle:
```
Steuer(W) = ∫_Schwelle^W min(Cap, Basis·(x/Schwelle)^k) dx
```
Geschlossen lösbar, mit der Cap-Grenze `W_cap = Schwelle · (Cap/Basis)^(1/k)`:
```
Steuer(W) = Basis·Schwelle/(k+1) · ((W/Schwelle)^(k+1) − 1)                  für Schwelle < W ≤ W_cap
          = Steuer(W_cap) + Cap·(W − W_cap)                                  für W > W_cap
```

**`Basis` (Grenzsatz an der Schwelle)** ist eine direkte Modell-Komponente und wird
so in `calculator_params.json` hinterlegt. Der Default-Wert ist so gewählt, dass der
Ø-Satz beim Anker-Vermögen `A` den Zielwert `τ̄` trifft (gilt, solange der Cap
unterhalb von A nicht greift):
```
Basis = τ̄ · A · (k+1) / ( Schwelle · ((A/Schwelle)^(k+1) − 1) )
```
Default (Schwelle 5 Mio., k = 0,9, A = 100 Mio., τ̄ = 2 %): **Basis = 0,00257231…**,
Cap = 1,0, Cap-Grenze = **3 770 402 679 CHF**. `taxModel.js` (Frontend), die
JSON-Defaults und das Prüfskript verwenden denselben `Basis`-Wert direkt.

**Statisches Jahresaufkommen** = Summe über die Bins:
```
Aufkommen = Σ_bins  cntᵢ · Steuer(midᵢ)
```
Statisch heisst: **keine** Abwanderung, **kein** Verhalten, **kein** Vermögenszuwachs.

**Dynamische Projektion** (rein mechanisch, je Kohorte):
```
W(t+1) = W(t) · (1 + r) − Steuer(W(t))
```
Zeigt den Einmaleffekt im Startjahr und das danach stabile, dauerhaft tragbare Niveau.
Das Gleichgewichts-Vermögen `W*` (Ø-Satz = r) ist der Punkt, an dem ein Vermögen genau
seine Rendite abgibt — darüber schrumpft es, darunter wächst es.

### 6a. Voreingestellte Modelle (Presets) und die WIR-Näherung

Die Presets in [`src/composables/useCalculator.js`](../src/composables/useCalculator.js)
sind nur Startpunkte desselben Tarifmodells (Verfahren E) mit unterschiedlichen
Parametern. Die Gruppe **«Meine»** (Flach / Moderat / Stark progressiv) zeigt
illustrative Kurvenformen. Die Gruppen **«WIR 2022»** und **«WIR 2026»** bilden die
Steuermodelle des World Inequality Report nach. Weil der Rechner schweizspezifisch ist
und eine feste Struktur hat, werden die WIR-Modelle **übertragen, nicht 1:1 reproduziert**.
Die Näherungen sind explizit:

1. **Währung (CHF vs. USD):** Die WIR-Tarife sind in USD definiert, ihre **Sätze (%) sind
   aber währungsunabhängig** — übertragen wird die Satz-*Struktur*. Die Vermögens-Schwellen
   (WIR-Bänder in USD vs. unsere 5 Mio. CHF) werden ohne Wechselkurs-Umrechnung in
   denselben Einheiten behandelt (≈ Parität CHF/USD). Folge: Die im Rechner angezeigten
   CHF-Beträge sind **nicht** mit den globalen USD-/BIP-Erträgen des WIR vergleichbar.

2. **Freibetrag / Schwelle:** Der Rechner beginnt fix bei **5 Mio. CHF** (≈ reichstes 1 %,
   breite Mehrheit steuerfrei). Das Original setzt anders an — WIR 2022 ab **1 Mio. $**, die
   WIR-2026-Mindeststeuer ab **100 Mio. $** (Centi-Millionäre). Übertragen wird die
   Tarif-*Form* auf die 5-Mio-Schwelle; die Bemessungsbasis ist damit bei 2022 enger und bei
   2026 breiter als im Original.

3. **Tarif-Form WIR 2022:** Das Rechnermodell ist eine **glatte** Potenzkurve, WIR 2022 eine
   **stufige** 6-Band-Staffel (Tabelle 7.2). `Basis`, `k` und `Cap` sind so kalibriert, dass
   die glatte Kurve die publizierten **Effektivsätze** (Tabelle 7.1) im für die Schweiz
   relevanten Bereich (5 Mio.–10 Mrd.) möglichst genau trifft. An der äussersten Spitze
   (> 100 Mrd.) bleiben kleine Abweichungen, die für die CH-Population (dort ~niemand)
   folgenlos sind.

4. **Tarif-Form WIR 2026:** Die Mindeststeuer ist ein **flacher** Satz → `k = 0`, `Basis` =
   Mindeststeuersatz (2 / 3 / 5 %). Zucmans Mindeststeuer meint X % des **Gesamtvermögens**;
   der Rechner besteuert den Teil **über 5 Mio.** — für grosse Vermögen praktisch
   deckungsgleich.

**Preset-Parameter** (alle Schwelle 5 Mio., direkt in `useCalculator.js` hinterlegt):

| Preset               | Vorlage                  | `Basis` (Grenzsatz @5 Mio.) | `k`  | `Cap` |
|----------------------|--------------------------|-----------------------------|------|-------|
| WIR 2022 · moderat   | WIR 2022, Szenario 1     | 0,99 %                      | 0,15 | 5 %   |
| WIR 2022 · hoch      | WIR 2022, Szenario 2     | 1,36 %                      | 0,20 | 10 %  |
| WIR 2022 · sehr hoch | WIR 2022, Szenario 3     | 1,18 %                      | 0,45 | 90 %  |
| WIR 2026 · 2 %       | WIR 2026, Mindeststeuer  | 2,00 %                      | 0    | 100 % |
| WIR 2026 · 3 %       | WIR 2026, Mindeststeuer  | 3,00 %                      | 0    | 100 % |
| WIR 2026 · 5 %       | WIR 2026, Mindeststeuer  | 5,00 %                      | 0    | 100 % |

Quellen: WIR 2022, Tabelle 7.1/7.2; WIR 2026, Kapitel 7 (nach Zucman 2024 / G20). Vgl.
Quellen-IDs `wir2022` / `wir2026` in `src/data/sources.json`. Dieselben Näherungen werden
im Rechner als kurze Hinweis-Box je aktivem WIR-Preset angezeigt.

---

## 7. Pauschalbesteuerte (Aufwandbesteuerung)

Aufwandbesteuerte werden nach Lebenshaltungskosten veranlagt; ihr Vermögen wird **nie
erhoben** und fehlt daher in der ESTV-Vermögensstatistik. Quelle für ihre Anzahl ist die
**FDK-Erhebung** (Stand 31.12.2018: `M = 4 557` Personen schweizweit). Modellannahme:
sie liegen im selben > 10-Mio-Pareto-Tail und werden zu `N` addiert. Diese Annahme ist
explizit gekennzeichnet und betrifft nur den Tail.

---

## 8. Bezugsgrössen «Was tun mit dem Geld?»

Diese Makrozahlen stammen **nicht** aus den Steuer-Workbooks, sondern aus offiziellen
Bundesquellen, und dienen nur als Einordnung (`src/data/spend_reference.json`):

| Grösse | Wert | Jahr | Quelle |
|---|---|---|---|
| Einkommenssteuern nat. Personen (Bund + Kantone + Gemeinden) | ~ 62,7 Mrd. | 2023 | EFV/ESTV |
| Direkte Bundessteuer nat. Personen | ~ 13,5 Mrd. | 2023 | EFV |
| Krankenkassenprämien OKP (von Versicherten finanziert) | ~ 36 Mrd. | 2023 | BAG |
| Ständige Wohnbevölkerung | 9 048 900 | 2024 | BFS |

Rechnung: Einkommenssteuer-Senkung = Aufkommen / Einkommenssteuer-Total; Prämienanteil =
Aufkommen / OKP-Prämien; Pro-Kopf-Dividende = Aufkommen / Bevölkerung.

---

## 9. Validierungstabelle (reproduziert vs. publiziert)

Geprüft wird gegen **zwei** Arten von Referenz: (a) der einzige *externe* Test ist der
offizielle ESTV-Vermögens-Gini 2015 (0,860); (b) die übrigen Zeilen prüfen die *interne*
Konsistenz — `00_reproduce_statistics.py` rechnet die Verfahren unabhängig von
`02_extract_estv.py` nach und muss dieselben Werte liefern (kein Zirkelschluss zu einer
externen Zahl, sondern Schutz gegen Implementierungsfehler).

| Grösse | Reproduziert | Referenz | Art der Referenz |
|---|---|---|---|
| Basis-Satz (Default) | 0,00257231435969 | 0,00257231435969 | Modell-Definition |
| Cap-Grenze | 3 770 402 678,61 | 3 770 402 678,61 | Modell-Definition |
| Aufkommen statisch 2020 | 76,0512 Mrd. | 76,0512 Mrd. | Modell-Referenz (Skript) |
| Aufkommen statisch 2021 | 91,1598 Mrd. | 91,1598 Mrd. | Modell-Referenz (Skript) |
| Aufkommen statisch 2022 | 91,5437 Mrd. | 91,5437 Mrd. | Modell-Referenz (Skript) |
| Projektion 2022 → 2032 | 92,30 → 23,87 Mrd. | 92,30 → 23,87 Mrd. | Modell-Referenz (Skript) |
| Bin-Besetzung (alle Jahre) | Abw. < 1e-6 Personen | `calculator_bins.json` | interne Konsistenz |
| α Klassenmittel 2022 | 1,32352 | 1,32352 | `calculator_params.json` |
| Median unbeschränkt 2022 | CHF 45 078 | — | eigene Rechnung |
| **Gini «alle» 2015** | **0,8606** | **0,860** | **ESTV (offiziell, extern)** |

---

## 10. Grenzen & Ehrlichkeit

- **Steuerbares Vermögen ≠ Marktvermögen.** ESTV ohne 2./3. Säule, Liegenschaften zum
  Steuerwert → reale Konzentration eher höher.
- **Statisches Aufkommen** ignoriert Abwanderung/Verhalten — den grössten Realfaktor.
  Es zeigt das *Potenzial der Bemessungsgrundlage*, keine Einnahmeprognose.
- **Pareto-Extrapolation** im > 1-Mrd-Bereich beruht auf sehr wenigen, hochsensiblen
  Vermögen; `x_max` ist eine Schätzung.
- **WID/UBS vs. ESTV** messen Verschiedenes (Gesamt- vs. steuerbares Vermögen);
  Vergleiche sind indikativ, nicht zellengenau.

---

## 11. Reproduktion

```bash
# 1. Rohdaten direkt von ESTV/WID/FDK/UBS laden (benötigt curl):
bash scripts/fetch_sources.sh

# 2. Aus den Rohdaten alle JSON erzeugen (benötigt openpyxl + pdftotext/poppler-utils):
python3 scripts/01_extract_fdk.py        # -> pauschal.json
python3 scripts/02_extract_estv.py       # -> Verteilung, Kennzahlen, Rechner-Parameter/Bins/Kohorten
python3 scripts/03_extract_wid_ubs.py    # -> WID-Zeitreihen, Ranking, UBS-Gini/Ø-Median/Pyramide/Millionäre
python3 scripts/04_extract_spend_reference.py  # -> spend_reference.json (BFS live + EFV/BAG kuratiert)

# 3. Alle Verfahren unabhängig nachrechnen und prüfen:
python3 scripts/00_reproduce_statistics.py   # erwartet: alle Prüfungen OK
```

Der vollständige Live-Bezug inkl. exakter Download-URLs, Blatt-/Spaltenpositionen und
SHA256-Prüfsummen ist in [`docs/QUELLEN.md`](./QUELLEN.md) dokumentiert.
