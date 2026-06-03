# Quellen & Beschaffung — Provenance-Runbook

> **Zweck:** lückenlos dokumentieren, **woher** jede Rohzahl stammt und **wie** man sie
> Schritt für Schritt selbst beschafft — exakt, reproduzierbar, prüfbar. Das **Wie der
> Berechnung** steht in [`docs/METHODIK.md`](./METHODIK.md).

## Datenherkunft pro Sektion (Audit-Überblick)

Jeder Datenpunkt auf der Seite trägt im UI einen **Quellen-Tag** (`Quelle: …`, verlinkt) und
ist über die folgende Pipeline reproduzierbar. `id` = Wert des `SourceTag` im UI, der auf
den Eintrag in `src/data/sources.json` zeigt.

| Sektion (UI) | Datenpunkte | Quelle (`id`) | Datei in `src/data/` | erzeugt durch |
|---|---|---|---|---|
| Hero | Anteil ≥ 5 Mio., Anzahl, Median, Ø/Median | ESTV (`estv_vermoegen`) | `estv_kennzahlen.json` | `02_extract_estv.py` |
| Verteilung | Anteile/Anzahl je Klasse, Median, Mittel | ESTV (`estv_vermoegen`) | `estv_distribution.json`, `estv_kennzahlen.json` | `02_extract_estv.py` |
| Rechner | Aufkommen, Tarifkurve, Bänder, Gleichgewicht | ESTV (`estv_vermoegen`) + FDK (`fdk`, M im Tail) | `calculator_bins.json`, `calculator_params.json` | `02_extract_estv.py` (M aus `01`) |
| Was tun? | Aufkommen (Zähler); Vergleichsgrössen (Nenner) | ESTV+FDK; EFV (`efv`), BAG (`bag`), BFS (`bfs`) | (Rechner) + `spend_reference.json` | `02`/`01`; `spend_reference` kuratiert (§5) |
| Dynamik | dynamisches Aufkommen je Jahr | ESTV (`estv_vermoegen`) + FDK (`fdk`) | `projektion_cohorts.json` | `02_extract_estv.py` |
| International | Anteils-Zeitreihen + WID-Gini | WID (`wid`) | `wid_timeseries.json` | `03_extract_wid_ubs.py` |
| UBS-Studie | Gini, Ø/Median, Pyramide, Millionäre | UBS (`ubs`) | `ubs_gini.json`, `ubs_wealth_levels.json`, `ubs_wealth_pyramid.json`, `ubs_millionaires.json` | `03_extract_wid_ubs.py` |
| Pauschalbesteuerung | Anzahl, Ertrag, Spannweite | FDK (`fdk`) | `pauschal.json` | `01_extract_fdk.py` |
| Quellen & Methodik | Quellenliste | — | `sources.json` | kuratiert (Metadaten) |

**Lesart der Reproduzierbarkeit:** alle Dateien ausser `spend_reference.json` und
`sources.json` werden **skriptbasiert** aus den Primärquellen erzeugt (byte-/zahlengenau
prüfbar, siehe unten und `00_reproduce_statistics.py`). `spend_reference.json` (Makro-
Bezugsgrössen) und `sources.json` (Quellen-Metadaten) sind **kuratiert**; ihr Bezug ist als
manuelles Runbook in Abschnitt 5 dokumentiert.

## Überblick: ein Befehl pro Schritt

Der gesamte Datenbestand unter `src/data/*.json` wird **direkt aus den Primärquellen**
erzeugt. Kein Zwischen-Workbook, keine Handarbeit:

```bash
bash   scripts/fetch_sources.sh          # 1. Rohdaten von ESTV/WID/FDK/UBS laden -> data/raw/
python3 scripts/01_extract_fdk.py        # 2. FDK-PDF       -> pauschal.json
python3 scripts/02_extract_estv.py       # 3. ESTV-XLSX     -> Verteilung, Kennzahlen, Rechner
python3 scripts/03_extract_wid_ubs.py    # 4. WID-CSV+UBS   -> Zeitreihen, Länderranking
python3 scripts/00_reproduce_statistics.py  # 5. alles unabhängig nachrechnen/prüfen
```

**Voraussetzungen:** Python 3 mit `openpyxl` (`pip install openpyxl`) und das
System-Tool `pdftotext` (Paket `poppler-utils`) für die beiden PDF-Quellen.

**Rohdaten** liegen unter `data/raw/` und sind **bewusst nicht im Git** (mehrere hundert MB
WID-CSV). Reproduzierbarkeit ist über die exakten Download-URLs (unten + im Fetch-Skript)
und die **SHA256-Prüfsummen** in [`data/CHECKSUMS.txt`](../data/CHECKSUMS.txt) gesichert.
Nach `fetch_sources.sh` vergleicht man:

```bash
cd data/raw && sha256sum -c <(grep -v '^#' ../CHECKSUMS.txt)   # erwartet: OK
```

> **Hinweis Live-Bezug:** ESTV, WID und FDK liefern die Dateien per `curl` direkt aus.
> Der UBS-CDN blockt automatisierte Requests (HTTP 403); das Fetch-Skript nutzt deshalb
> einen inhaltsgleichen Direkt-PDF-Spiegel — die Integrität ist über die Prüfsumme belegt,
> kanonische Quelle bleibt die UBS-Seite. WID revidiert seine Reihen laufend; ein späterer
> Bezug kann minimal abweichende Werte (und damit Prüfsummen) liefern — dann Abrufdatum in
> `CHECKSUMS.txt` aktualisieren.

---

## 1. ESTV — Vermögenssteuerstatistik (Kernquelle)

**Was:** Anzahl Steuerpflichtige und steuerbares Reinvermögen je Vermögensklasse, je
Steuerjahr, Schweiz. Kategorien *alle* (2012–2022) und *unbeschränkt steuerpflichtig*
(ab 2020).

**Herausgeber:** Eidgenössische Steuerverwaltung (ESTV), Steuerpolitik —
Volkswirtschaft und Steuerstatistik.

**Einstiegsseite:**
<https://www.estv.admin.ch/de/gesamtschweizerische-vermoegenssteuerstatistik>

**Direkte Download-URLs** (eine Datei je Steuerjahr; identisch im Fetch-Skript):

| Jahr | Datei | URL (`https://www.estv.admin.ch/dam/de/sd-web/…`) |
|---|---|---|
| 2012 | `…/lhrrBohyrHqB/statistik-vermoegen-np-2012-de.xlsx` | xlsx |
| 2013 | `…/MRc38oet0AL4/statistik-vermoegen-np-2013-de.xlsx` | xlsx |
| 2014 | `…/XFai68q4kEdf/statistik-vermoegen-np-2014-de.xlsm` | xlsm |
| 2015 | `…/ntqjqoArif2u/statistik-vermoegen-np-2015-de.xlsm` | xlsm |
| 2016 | `…/AIwtHZqUR1tl/statistik-vermoegen-np-2016-de.xlsx` | xlsx |
| 2017 | `…/RayMz2waAzTe/statistik-vermoegen-np-2017-de.xlsx` | xlsx |
| 2018 | `…/UymBDbp5Npx0/statistik-vermoegen-np-2018-de.xlsx` | xlsx |
| 2019 | `…/0gIHJdco8bIG/statistik-vermoegen-np-2019-de.xlsx` | xlsx |
| 2020 | `…/DXH-Wy7LNBSy/statistik-vermoegen-np-2020-de.xlsx` | xlsx |
| 2021 | `…/7iNdaQJEh7WA/statistik-vermoegen-np-2021-de.xlsx` | xlsx |
| 2022 | `…/nVRTVvGkR77Z/statistik-vermoegen-np-2022.xlsx`    | xlsx |

**Wo genau im Workbook** (`scripts/02_extract_estv.py` liest exakt dies):
Blatt **`CH`** (gesamtschweizerische Klassentabelle). Es gibt zwei Layout-Generationen:

- **2012–2019:** Klassen-Block beginnt bei der Zeile mit «0» in Spalte **C**.
  Anzahl = Spalte **D**, Reinvermögen = Spalte **F** *in Mio. CHF* → ×1 000 000.
  Nur Kategorie *alle*.
- **2020–2022:** Klassen-Block beginnt bei «0» in Spalte **B**. Anzahl *alle* = Spalte **C**,
  *unbeschränkt* = Spalte **E**; Reinvermögen *alle* = Spalte **I**, *unbeschränkt* =
  Spalte **K** — bereits in CHF.

Je Jahr werden die **11 fixen Klassen** gelesen (0 / >0–50k / 50–100k / 100–200k /
200–500k / 500k–1M / 1–2M / 2–3M / 3–5M / 5–10M / >10M). Ergebnis: `estv_distribution.json`.
Das Skript prüft pro Jahr die interne Konsistenz (unbeschränkt ≤ alle je Klasse).

**Verwendet für:** Verteilungs-Sektion, alle Kennzahlen, gesamter Rechner
(Populationsmodell, Pareto-Tail, Gini).

**Bedeutung:** «Pflichtige» = Steuereinheit (Ehepaare gemeinsam = eine); Reinvermögen zu
Steuerwerten, ohne 2./3. Säule und Hausrat. Pauschalbesteuerte sind hier **nicht**
enthalten (siehe Quelle 4). Die Anzahlen sind teils gebrochen (gewichtete Hochrechnung der
ESTV) — das ist so in der Quelle und wird unverändert übernommen.

---

## 2. WID — World Inequality Database (internationaler Vergleich)

**Was:** Vermögensanteile Top 1 % / Top 10 % / mittlere 40 % / untere 50 %, Zeitreihen
1995–2024, je Land.

**Herausgeber:** World Inequality Lab (WID.world).

**Exakte Spezifikation:**
- **Anteile:** Variable `shwealj992` — Anteil am *net personal wealth*, Bezugseinheit
  Erwachsene (`992`), *equal-split* innerhalb von Paaren.
- **Perzentil-Codes:** `p99p100` = Top 1 %, `p90p100` = Top 10 %, `p50p90` = mittlere
  40 %, `p0p50` = untere 50 %.
- **Gini:** Variable `ghwealj992` (Perzentil `p0p100`) — WID-**eigener** Vermögens-Gini.
  Als Jahresreihe in `wid_timeseries.json` (im UI über den Metrik-Umschalter, CH 2024
  ≈ 0,76). Der UBS-Gini ist eine methodisch andere Grösse und lebt getrennt in
  `ubs_gini.json` / der UBS-Studie-Sektion (Quelle 3).

**Direkter Bezug:** Bulk-Download **pro Land** als CSV (die öffentliche REST-API
`api.wid.world` antwortet mit `403 Forbidden`; der Bulk-Datensatz ist die offizielle,
vollständige Quelle):

```
https://wid.world/bulk_download/WID_data_<ISO>.csv
```

mit `<ISO>` ∈ { **US, CN, CH, FR, DE, GB, SE, JP, IT, ES, IN, RU, BR, WO** }
(WO = Welt). CSV-Format (Semikolon-getrennt):
`country;variable;percentile;year;value;age;pop`.

**Runbook** (`scripts/03_extract_wid_ubs.py`): je Land die vier `shwealj992`-Perzentile
sowie den WID-Gini `ghwealj992` über 1995–2024 lesen → `wid_timeseries.json`. Das
Länderranking «heute» leitet das UI direkt aus der Zeitreihe ab (jüngstes Jahr je Land;
Welt endet 2023, übrige 2024) – keine separate Letztwert-Datei nötig.

**Verwendet für:** International-Sektion (Zeitreihen + Länderranking).
**Vergleichbarkeit:** WID misst Gesamt-Marktvermögen, ESTV nur steuerbares Vermögen —
systematisch verschiedene Niveaus, gleicher Trend. Auf der Seite klar getrennt.

---

## 3. UBS — Global Wealth Report 2025 (Gini)

**Was:** Vermögens-Gini je Markt, Stand Ende 2024 (modelliertes Gesamt-Nettovermögen pro
Erwachsenem).

**Herausgeber:** UBS (vormals Credit Suisse Global Wealth Report).

**Einstieg (kanonisch):**
<https://www.ubs.com/global/en/wealthmanagement/insights/global-wealth-report.html>

**Wo genau:** Tabelle **«Wealth inequality, measured by the Gini coefficient»**
(Ranking 1–32, Spalte *Gini coefficient 2024*). `scripts/03_extract_wid_ubs.py` liest sie
über `pdftotext -layout` aus dem PDF und ordnet die englischen Marktnamen einem kuratierten
Ländervergleich zu → `ubs_gini.json` (genutzt von der UBS-Studie-Sektion).

**Reproduzierte Schlüsselwerte (Ende 2024):** Brazil 0,82 · Russia 0,82 · Sweden 0,75 ·
United States 0,74 · India 0,74 · Germany 0,68 · **Switzerland 0,67** · Mainland China 0,62 ·
France 0,59 · United Kingdom 0,58 · Italy 0,57 · Spain 0,56 · Japan 0,54.

> Diese Werte stammen direkt aus dem Report 2025 und ersetzen eine frühere, fehlerhafte
> Gini-Tabelle (u. a. Schweiz irrtümlich 0,78 statt 0,67).

**Zweite Tabelle:** **«Wealth per adult: the top 25»** — Durchschnitts- *und* Median-Vermögen
pro Erwachsenem je Markt (USD, Ende 2024). Dasselbe Skript parst beide Ranglisten und
schreibt die Märkte, die in beiden vorkommen, nach `ubs_wealth_levels.json`
(`{land, avg, median}`). Beleg Schweiz: Ø **687 166 USD** (Weltrang 1) vs. Median
**182 248 USD** (Rang 7) — Faktor ≈ 3,8. Genutzt von der UBS-Studie-Sektion (Mittelwert-
vs-Median-Lücke).

**Weitere Tabellen** (gleiches Skript, je mit Selbstprüfung):
- **«The global wealth pyramid 2024»** → `ubs_wealth_pyramid.json`: vier Vermögensbänder
  mit Anteil der Erwachsenen und Anteil am Gesamtvermögen. Beleg: oberstes Band
  (> 1 Mio. USD) = 1,6 % der Erwachsenen / 48,1 % des Vermögens; unterstes (< 10k) = 40,7 % /
  0,6 %. (Geprüft: Anteile summieren auf 100 %.)
- **«UBS Millionaire Index»** → `ubs_millionaires.json`: Anzahl USD-Millionäre je Markt
  (in Tausend → Personen). Beleg: USA 23 831 000, Schweiz 1 119 000.

**Keine Zeitreihe:** Der Report ist eine Momentaufnahme (Ende 2024) und enthält keine
jährliche Länder-Zeitreihe; die historische UBS-Reihe steckt im separaten, **nicht frei
abrufbaren** Databook. Für Ungleichheit *im Zeitverlauf* dient WID (Quelle 2, volle
Jahresreihen 1995–2024).

**Verwendet für:** Gini-Ländervergleich und Ø/Median-Vergleich in der UBS-Studie-Sektion.

---

## 4. FDK — Aufwandbesteuerung (Pauschalbesteuerung)

**Was:** Anzahl Aufwandbesteuerte und Steuerertrag (Bund/Kanton/Gemeinde), Schweiz-Total,
Erhebungsjahre 2008–2018. Letzte zentral publizierte Gesamterhebung.

**Herausgeber:** Konferenz der kantonalen Finanzdirektorinnen und Finanzdirektoren (FDK),
**Medienmitteilung vom 7. Juni 2019** (Stand 31.12.2018).

**Direkte URL:**
`https://www.fdk-cdf.ch/-/media/FDK_CDF/Dokumente/Themen/Steuerpolitik/Aufwandbesteuerung/190607_AufwBest_MM_FDK_DEF_D.pdf`

**Wo genau:** Anhang, zwei Schweiz-Tabellen — *Anzahl Aufwandbesteuerte* (Zeile «CH») und
*Ertrag … CH Total* (Zeilen Bund / Kanton / Gemeinde, in Mio. CHF) sowie tiefste/höchste
2018 eingezogene Pauschalsteuer. `scripts/01_extract_fdk.py` parst diese Zeilen und
**prüft sie gegen den Mitteilungstext** (2018: 4 557 Personen; Ertrag 234 + 385 + 202 =
821 Mio.; Spanne 10 000 – 11 967 953 CHF) → `pauschal.json`.

**Verwendet für:** Pauschal-Sektion und Parameter `M` im Rechner-Tail (Anzahl 2018 = 4 557).
**Achtung:** «Personen» (FDK) ≠ «Pflichtige/Steuerfälle» (ESTV). Vermögen wird hier
**nicht** erhoben.

---

## 5. Bezugsgrössen «Was tun mit dem Geld?» (nur Einordnung)

Diese Makrozahlen (`src/data/spend_reference.json`) sind **kein** Teil des Steuer-Modells und
dienen nur als anschauliche Bezugsgrösse — nominal, gerundet, **kuratiert** (nicht
skriptextrahiert). Jeweils den neuesten publizierten Jahreswert übernehmen und Jahr/Quelle
hier festhalten:

| Grösse | Wert | Jahr | Quelle | Beleg |
|---|---|---|---|---|
| Einkommenssteuern nat. Personen (alle Ebenen) | ~ 62,7 Mrd. | 2023 | EFV/ESTV | <https://www.efv.admin.ch/de/finanzberichterstattung/finanzstatistik> |
| Direkte Bundessteuer nat. Personen | ~ 13,5 Mrd. | 2023 | EFV | s. o. |
| OKP-Leistungen total | ~ 52,1 Mrd. | 2023 | BAG | <https://www.bag.admin.ch/bag/de/home/zahlen-und-statistiken/statistiken-zur-krankenversicherung.html> |
| OKP-Prämien (von Versicherten finanziert) | ~ 36 Mrd. | 2023 | BAG | s. o. |
| Ständige Wohnbevölkerung | 9 048 900 | 2024 | BFS | <https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/stand-entwicklung.html> |

---

## Prüfsummen

Beim Live-Bezug erzeugt `fetch_sources.sh` die SHA256 aller Rohdateien; der eingecheckte
Stand liegt in [`data/CHECKSUMS.txt`](../data/CHECKSUMS.txt). Abgleich:

```bash
cd data/raw && sha256sum -c <(grep -v '^#' ../CHECKSUMS.txt)
```

Anschliessend die Extraktion (`01`–`03`) laufen lassen und die erzeugten JSON mit den
Git-versionierten abgleichen (`git diff src/data/`). Bei unverändertem WID-Stand bleibt der
Diff bis auf Gleitkomma-Darstellung leer — die Pipeline ist dann exakt reproduziert.
