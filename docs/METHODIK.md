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

### 6a. Voreingestellte Modelle (Presets)

Die Presets in [`src/composables/useCalculator.js`](../src/composables/useCalculator.js)
gliedern sich in zwei Zeilen:

- **«Unsere»** (Flach / Moderat / Stark progressiv): Startpunkte des Potenzkurven-Modells
  aus Verfahren E, gesteuert durch die vier Regler.
- **«WIR 2022»**: bildet das Steuermodell des World Inequality Report
  **exakt** ab, über eine eigene Funktion in `taxModel.js` (`makeBracketModel`),
  **nicht** über die Potenzkurve. Solange ein WIR-Preset aktiv ist,
  steuern die Regler das angezeigte Modell nicht (im Rechner abgedunkelt).

Der WIR 2026 schlägt keine progressive Vermögenssteuer mehr vor, sondern eine flache
**Mindeststeuer** auf Centi-Millionäre und Milliardäre (nach Zucman 2024 / G20). Weil dieser
Rechner die Bemessungsgrundlage einer Vermögenssteuer zeigt, ist der WIR 2026 bewusst **kein
Preset**; das Mindeststeuer-Argument steht im eigenen Abschnitt «Zucman-Steuer».

**Warum nicht die Potenzkurve?** Die Kurve `τ(W)=min(Cap, Basis·(W/Schwelle)^k)` ist stetig
und besteuert nur den Anteil *über* der Schwelle. Das WIR-2022-Modell hat eine andere Form:
eine **Stufenfunktion** (sprunghafte Grenzsätze je Band). Diese lässt sich mit einer glatten
Potenzkurve nur annähern, nicht exakt treffen, daher der dedizierte Modelltyp.

**WIR 2022 — exakte Grenzsatz-Staffel** (`makeBracketModel`, Marginalsätze aus Tabelle 7.2):

| Vermögensband        | moderat | hoch  | sehr hoch |
|----------------------|---------|-------|-----------|
| 1–10 Mio.            | 1 %     | 1 %   | 1 %       |
| 10–100 Mio.          | 1,5 %   | 1,5 % | 1,5 %     |
| 100 Mio.–1 Mrd.      | 2 %     | 3 %   | 7 %       |
| 1–10 Mrd.            | 2,5 %   | 5 %   | 15 %      |
| 10–100 Mrd.          | 3 %     | 7 %   | 50 %      |
| > 100 Mrd.           | 3,5 %   | 10 %  | 90 %      |

Die Steuer beginnt **ab 1 Mio.** wie im Original. Dafür ist das Populationsmodell des
Rechners um die ESTV-Klassen 1–5 Mio. erweitert (drei zusätzliche Bins; `mid` = mittleres
Klassenvermögen 2022). Diese Klassen liegen vollständig im 1-%-Band, daher ist der
Klassenmittel-Punkt für die lineare Steuer exakt. WIR 2022 erfasst damit rund **324 000**
Pflichtige mehr als die «Unsere»-Modelle (die beim 5-Mio-Freibetrag bleiben).

**Verbleibende Näherungen (explizit):**

1. **Währung (CHF vs. USD):** Die WIR-Sätze (%) sind währungsunabhängig — übertragen wird
   die Satz-Struktur. Die Vermögens-Schwellen (USD im WIR) werden ohne Wechselkurs-Umrechnung
   in CHF behandelt (≈ Parität). Folge: Die angezeigten CHF-Beträge sind **nicht** mit den
   globalen USD-/BIP-Erträgen des WIR vergleichbar.
2. **Statisches Aufkommen** wird auf den ESTV-Bins gerechnet, für WIR 2022 ab **1 Mio.**
   (Bins 1 Mio.–50 Mrd.). Die **dynamische Projektion** bleibt
   bewusst auf ≥ 5 Mio.-Kohorten: sonst würden 1–5-Mio-Kohorten über die Jahre ins
   Steuernetz hineinwachsen und die Referenz-Projektion (Verfahren E) verfälschen.

Quellen: WIR 2022, Tabelle 7.2. Vgl. Quellen-ID `wir2022` in `src/data/sources.json`.
Derselbe Hinweis erscheint im Rechner als Box bei aktivem WIR-2022-Preset.

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
| Individuelle Prämienverbilligung (Bund + Kantone) | ~ 5,9 Mrd. | 2023 | BAG |
| Ständige Wohnbevölkerung | 9 051 029 | 2024 | BFS |

Rechnung: Einkommenssteuer-Senkung = Aufkommen / Einkommenssteuer-Total; Prämienanteil =
Aufkommen / (OKP-Prämien − Prämienverbilligung), also auf der noch selbst getragenen
Prämienlast (die bereits bestehende Prämienverbilligung wird nicht erneut übernommen);
Pro-Kopf-Dividende = Aufkommen / Bevölkerung.

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

## 11. Zucman-Mindeststeuer — eigene Herleitung (Schätzung, ausserhalb der ESTV-Pipeline)

> Anders als die Verfahren 1–8 ist dieser Abschnitt **keine** exakt reproduzierbare
> Rechnung aus den ESTV-Klassendaten, sondern eine **eigene Schätzung** auf Basis
> externer, belegter Eingangsgrössen. Sie ist statisch und ausdrücklich als Schätzung
> deklariert. Sie speist den Seitenabschnitt «Zucman-Steuer», nicht den Rechner.

**Bezugsgrösse:** Marktvermögen (Verkehrswerte), nicht das tiefere steuerbare Vermögen.
Zucmans 2 % zielen auf das Gesamtvermögen, daher ist die Marktbasis korrekt.

**Belegte Eingangsgrössen** (Quellen-IDs in `src/data/sources.json`):

| Grösse | Wert | Quelle |
|---|---|---|
| Basis `B` (Marktvermögen der 300 Reichsten) | 851,5 Mrd. | `bilanz300` |
| Vermögenssteuer-Aufkommen | ~11 Mrd./Jahr ≈ 0,25 % des Vermögens | `reichensteuer_studie` |
| Ø Vermögenssteuersatz (steuerbare Basis) | 0,28 % (2025), von 0,35 % (1990) | `nzz_vermoegenssteuer` |
| Persönliche Einkommenssteuer auf Ausschüttungen | ~25–30 % auf steuerbare Dividenden (privilegiert), **ohne** Unternehmenssteuern | `reichensteuer_studie_ch` |
| Steuer-Design | 2 % ab 100 Mio., Aufstockung bei < 2 %, Befreiung bei ≥ 2 % | `woz_zucman` |

> **Quervergleich, nicht Eingangsgrösse:** Die kursierende Schlagzeile ~32 % (Milliardäre)
> bzw. ~19 % (Multimillionäre) aus `reichensteuer_studie` **enthält die Gewinnsteuern der
> Unternehmen** und fliesst **nicht** in `t₀` ein. Die Zucman-Mindeststeuer trifft die
> natürliche Person; Unternehmenssteuern sind dafür irrelevant. `t₀` ergibt sich allein aus
> Vermögens- und persönlicher Einkommenssteuer (Schritte 1 und 2), gerechnet direkt am
> Marktvermögen.

**Schritt 1 — Vermögenssteuer am Marktvermögen `v`.** Der Ø-Satz 0,28 % gilt auf der
*steuerbaren* Basis. Weil Markt > steuerbar und die kantonale Steuerbremse die Spitze
deckelt, am Marktvermögen geschätzt:
```
v ≈ 0,3 %        (Bandbreite 0,25–0,45 %)
```

**Schritt 2 — Einkommenssteuer auf Vermögenserträge am Marktvermögen `e`.** Kapitalgewinne
sind steuerfrei, nur Ausschüttungen werden erfasst:
```
e ≈ (steuerbare Ausschüttungsrendite ~2 %) × (effektiver Satz ~25–30 %) ≈ 0,5 %   (0,4–0,8 %)
```

**Schritt 3 — heutige Effektivlast `t₀` am Marktvermögen:**
```
t₀ = v + e ≈ 0,3 % + 0,5 % = rund 0,8 %        (Bandbreite 0,7–1,3 %)
```
Quervergleich: ~32 % auf ein klein deklariertes Einkommen entspricht nur ~1 % des
Vermögens — konsistent mit `t₀`.

**Einordnung der 32 %/19 % (Personenanteil).** Die Schlagzeile 32 % (Milliardär) bzw.
19 % (Multimillionär) enthält die Gewinnsteuern der Unternehmen. Die Detail-Länderstudie
`reichensteuer_studie_ch` (Martínez 2024) schlüsselt das auf: Beim Beispiel-Milliardär
(Roche-Erbe, Standardszenario, bezogen auf das wirtschaftliche Einkommen von 95,2 Mio.)
entfallen rund 18 % auf die persönliche Einkommenssteuer und rund 10 % (0,69 % des
Vermögens) auf die Vermögenssteuer; die anteilige Gewinnsteuer der Beteiligung macht
rund 15 % aus. Die 32 % sind Einkommens- plus Gewinnsteuer, die Gesamtlast inkl.
Vermögenssteuer beträgt 42,25 %. Beim Mustermillionär (Zug/Baar) liegt die reine
Personensteuer aus Einkommens- plus Vermögenssteuer bei rund 16 % des Bruttoeinkommens.
Für `t₀` ist nur dieser Personenanteil relevant; die Schritte 1 und 2 rechnen ihn direkt
am Marktvermögen und benutzen die Schlagzeilenquote nicht.

**Schritt 4 — Aufkommen, zwei Szenarien:**
```
Szenario A (brutto, ohne Anrechnung):   A     = 2 % · B = 0,02 · 851,5         = 17,0 Mrd.
Szenario B (Mindeststeuer):             B_zus = (2 % − t₀) · B
                                              = (0,02 − 0,007…0,013) · 851,5
                                              ≈ 6–11 Mrd. zusätzlich
```
Die kursierende Schlagzeile «bis zu 20 Mrd.» (`workzeitung_reiche`) entspricht Szenario A,
nicht der Mindeststeuer.

**Schritt 5 — Mehrbelastung je Vermögen** (sofern heute < 2 %):
```
pro 100 Mio.:  2,0 Mio. − ~0,8 Mio. ≈ ~1,2 Mio./Jahr
pro 1 Mrd.:    ~7–13 Mio./Jahr
```

**Direkter Vergleich — Spitze gegenüber normalem Haushalt.** Beide Seiten gemessen an der
*ganzen* Jahressteuer, nicht nur an der Mehrbelastung.

*Superreiche, passiv:* Bei ~7,1 % realem Vermögenszuwachs ist die ganze Mindeststeuer von
2 % des Vermögens wieder verdient in `(0,02 ÷ 0,071) × 365 ≈ 103 Tagen` (`zucman_g20`).

*Normaler Haushalt* (einkommensbasiert, Quelle `bfs_habe`, HABE-Querschnittstabelle «nach
Einkommensklasse», neueste Periode 2015–2017). Die fünf Einkommensklassen sind gleich grosse
Quintile (je 20 % der Haushalte, geprüft über die Zeile «Prozentuale Verteilung der
Haushalte» = 0,20); das **mittlere Quintil enthält den Median**. Belegte Werte aus einer
Quelle, das Bruttoeinkommen kürzt sich heraus:
```
Einkommen aus Vermögen und Vermietung   = 232 CHF/Monat =  2,9 % des Bruttoeinkommens
Steuern (Einkommen und Vermögen)        = 785 CHF/Monat =  9,9 % des Bruttoeinkommens

Zeit, die ganze Jahressteuer allein aus dem Vermögenseinkommen zu verdienen:
   9,9 % ÷ 2,9 % ≈ 3,4 Jahre
Zeit, dieselbe Steuersumme aus dem gesamten Einkommen (v. a. Arbeit) zu verdienen:
   9,9 % × 365 ≈ 36 Tage
```
Zum Vergleich: oberstes Quintil 6,5 % des Bruttoeinkommens (1250 CHF/Monat, rund fünfmal so
viel in Franken wie das mittlere Quintil). Die HABE rechnet keinen Eigenmietwert als
Einkommen ein, es ist also echtes Vermögens- und Vermietungseinkommen. Die Querschnittstabellen
erscheinen nur als Mehrjahres-Pool; 2015–2017 ist die aktuellste, die Mittelwerte 2023
(Vermögenseinkommen 4,5 %, Steuern 12,0 %) bestätigen die Stabilität. Kontrast: ganze
2 %-Steuer der Spitze passiv in ~103 Tagen, Medianhaushalt ~3,4 Jahre, also rund zwölfmal so
lange.

Ergänzend (Quelle `estv_vermoegen`): das steuerbare Medianvermögen liegt bei nur rund
45 000 CHF (über die Hälfte der Steuerpflichtigen hat höchstens 50 000 CHF).

Kontrast: ganze 2 %-Steuer der Spitze passiv in ~103 Tagen, gegenüber dem normalen Haushalt,
der seine Steuer überhaupt nicht passiv aufbringen kann.

**Deklaration und Grenzen:**

- Eigene Schätzung, **keine amtliche Zahl** und **nicht** aus der ESTV-Pipeline reproduzierbar.
- **Statisch:** keine Abwanderung, kein Verhalten. Die Steuer trifft die mobilste Gruppe;
  reale Reaktionen würden das Aufkommen mindern.
- Was angerechnet wird, verschiebt Szenario B erheblich: nur `e` angerechnet → ~12–13 Mrd.,
  `e + v` angerechnet → ~6–11 Mrd.
- Basis `B` ist eine belegte **Untergrenze** (diskrete Vermögen fehlen; plausibel bis ~1000 Mrd.).

Diese Herleitung erscheint zusammengefasst und als Schätzung deklariert auch im Abschnitt
«Zucman-Steuer» der Seite.

---

## 12. Reproduktion

```bash
# 1. Rohdaten direkt von ESTV/WID/FDK/UBS laden (benötigt curl):
bash scripts/fetch_sources.sh

# 2. Aus den Rohdaten alle JSON erzeugen (benötigt openpyxl + pdftotext/poppler-utils):
python3 scripts/01_extract_fdk.py        # -> pauschal.json
python3 scripts/02_extract_estv.py       # -> Verteilung, Kennzahlen, Rechner-Parameter/Bins/Kohorten
python3 scripts/03_extract_wid_ubs.py    # -> WID-Zeitreihen, Ranking, UBS-Gini/Ø-Median/Pyramide
python3 scripts/04_extract_spend_reference.py  # -> spend_reference.json (BFS live + EFV/BAG kuratiert)

# 3. Alle Verfahren unabhängig nachrechnen und prüfen:
python3 scripts/00_reproduce_statistics.py   # erwartet: alle Prüfungen OK
```

Der vollständige Live-Bezug inkl. exakter Download-URLs, Blatt-/Spaltenpositionen und
SHA256-Prüfsummen ist in [`docs/QUELLEN.md`](./QUELLEN.md) dokumentiert.
