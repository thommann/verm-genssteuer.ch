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
| Aussagen (Startseite) | Kampagnen-Aussagen mit konkreten Zahlen: Milliardäre zahlen halb so viel / Mittelstand doppelt so viel (Einkommensteuerlast); reales Vermögenswachstum «fast 10 %» p. a. (Wegzug-Argument; obere Lesart der belegten 6 bis 9 % WIR 2022 / 7,1 % Zucman) | Zucman (`zucman_g20`) | — (Texte + `sources.json`) | — |
| Hintergrund (7 Artikel) | Erklärende Texte zu Aufkauf, Geldfluss, Demokratie, Steuerlücke, Wirtschaft, Lösung, Überblick. Belegte Zahlen: reales Vermögenswachstum 7,1 %/1,8 % bzw. 6–9 %/3,2 %; effektiver Steuersatz Milliardäre ~0,5 % bzw. ~0,3 %; ~103 Tage bzw. ~4 Jahre; 2 % Mindeststeuer; 200–250 Mrd. USD weltweit; Schweizer Vermögenseinkommen 6,9 %/2,6 %; 32 %/19 %. Argumente von Gary Stevenson und Zucman qualitativ zugeordnet. | Zucman (`zucman_g20`, `woz_zucman`, `wir2026`); WIR 2022 (`wir2022_wachstum`); Oxfam/TJN/Momentum (`reichensteuer_studie`, `reichensteuer_studie_ch`); BFS HABE (`bfs_habe`); EFV (`efv`); Gary Stevenson (`gary_wiki`, `gary_equals`); Demokratie (`social_europe_demokratie`); Schweiz-Zahl (`workzeitung_reiche`) | — (Texte in `de.js` unter `hintergrund.*` + `sources.json`); Zahlen aus `habe.json` bzw. belegt in `sources.json` | — (keine neuen Rohzahlen; wiederverwendete, bereits dokumentierte Werte) |
| Verteilung | Anteile/Anzahl je Klasse, Median, Mittel | ESTV (`estv_vermoegen`) | `estv_distribution.json`, `estv_kennzahlen.json` | `02_extract_estv.py` |
| Wem gehört die Schweiz: «Wem gehört der Boden» | Erklärtext zur Transparenzlücke des Grundbuchs (Abschnitt am Fuss der Seite «Wem gehört die Schweiz?»): Einzelauskunft nur pro Grundstück (Art. 970 ZGB, GBV Art. 26 Abs. 2), Verbot von Serienabfragen (GBV Art. 27 Abs. 2), behördenexklusive landesweite Grundstücksuche (Art. 949c ZGB, GBV Art. 34a–34i), Datenschutz als Begründung. Keine Bodenzahlen (qualitativ). | ZGB (`zgb_grundbuch`); GBV (`gbv_oeffentlichkeit`); DSG (`dsg`); Steiger Legal (`grundbuch_sperre`) | — (Gesetzestexte/Texte in `de.js` unter `boden.eigentum` + `sources.json`) | — (Rechtsnormen direkt zitiert, keine Rohzahlen) |
| Rechner | Aufkommen, Tarifkurve, Bänder, Gleichgewicht | ESTV (`estv_vermoegen`) + FDK (`fdk`, M im Tail) | `calculator_bins.json`, `calculator_params.json` | `02_extract_estv.py` (M aus `01`) |
| Rechner (Wegzug-Szenario) | Netto-Fiskalgewinn: neue Steuer der Verbliebenen minus heutige Steuern der Abgewanderten. Heutige Last aufgeteilt in Vermögenssteuer (VST_RATE = 0,28 %, NZZ, auf steuerbares Vermögen) und Einkommenssteuer auf Kapital (EST_RATE = 0,9 %, Mittelwert aus Duschmalé-Beispiel, Martínez/KOF, Bandbreite 0,7–1,2 %). Pauschalbesteuerte im Pareto-Tail der Bins eingerechnet (kein separater Term). Herleitung, Bandbreiten und Deklaration: METHODIK §12. | NZZ (`nzz_vermoegenssteuer`); Martínez/KOF (`reichensteuer_studie_ch`) | Konstanten `VST_RATE = 0,0028`, `EST_RATE = 0,009` in `src/composables/useCalculator.js` | Schätzung, als solche deklariert; Mittelwert der Bandbreite |
| Was tun? | Aufkommen (Zähler); Vergleichsgrössen (Nenner), inkl. öV-, Strassen- und Bildungs-Gesamtausgaben vervielfachen (alle Staatsebenen, inkl. Betrieb) | ESTV+FDK; BFS (`bfs`), EFV (`efv`), BAG (`bag`), LITRA (`litra`) | (Rechner) + `spend_reference.json` + `infrastruktur.json` | `02`/`01`; `04` (BFS live, EFV/BAG/LITRA kuratiert, §5); `06` (Total funk 61/62/2, §8) |
| Dynamik | dynamisches Aufkommen je Jahr, voreingestellte Rendite 7 % | ESTV (`estv_vermoegen`) + FDK (`fdk`) + WIR 2022 (`wir2022_wachstum`, Default-Rendite) | `projektion_cohorts.json`, `calculator_params.json` | `02_extract_estv.py` |
| International | Anteils-Zeitreihen + WID-Gini | WID (`wid`) | `wid_timeseries.json` | `03_extract_wid_ubs.py` |
| WIR 2022 | Vergleich der Steuermodelle (Rechner-Preset «WIR 2022») | World Inequality Lab (`wir2022`) | — (Texte + `sources.json`) | — |
| WIR 2026 | Mindeststeuer-Modell (Texte, Abschnitt «Zucman-Steuer»; kein Rechner-Preset) | World Inequality Lab (`wir2026`) | — (Texte + `sources.json`) | — |
| Zucman-Steuer | Vorschlag (2 % ab 100 Mio.), heutige Last, Mehraufkommen, Tage bis ganze 2 %-Steuer passiv verdient, Arbeiterhaushalt (mittleres Fünftel) und mittelständischer Haushalt (Durchschnitt): Jahre bis Steuer aus Vermögenseinkommen, Tage aus Gesamteinkommen verdient, Einordnungen | Zucman (`woz_zucman`, `zucman_g20`); Bilanz (`bilanz300`); NZZ (`nzz_vermoegenssteuer`); Oxfam/TJN/Momentum (`reichensteuer_studie`); Haushalte: BFS HABE (`bfs_habe`); Einordnungen: BFS (`bfs`), EFV (`efv`), BAG (`bag`) | `habe.json`; Texte + `sources.json`; Einordnungen `spend_reference.json` | `05` (HABE, §6); `04` (Bezugsgrössen, §5) |
| UBS-Studie | Gini, Ø/Median, Pyramide | UBS (`ubs`) | `ubs_gini.json`, `ubs_wealth_levels.json`, `ubs_wealth_pyramid.json` | `03_extract_wid_ubs.py` |
| Wem gehört die Schweiz? | Nationalität und Vermögensanteil der 300 Reichsten; Firmen-/Job-/Umsatzanteil nach Kontrolle; Gebäude- und Mietwohnungseigentum. Zusätzlich Verläufe: Top-1-%-Vermögensanteil 1995–2024, Privatvermögen/BIP 2000–2024, 300/BIP 2022–2024, Auslandskontrolle 2014–2024 | Bilanz (`bilanz300`, kuratiert), SNB (`snb_haushalte`), Weltbank (`worldbank_gdp`), BFS STAGRE (`bfs_stagre`), BFS Gebäude (`bfs_gebaeude`), Raiffeisen (`raiffeisen_immo`, kuratiert), BFS Wohnungsstatistik (`bfs_wohnungen`, kuratiert), BFS Wohneigentumsquote (`bfs_wohneigentum`), BFS Landwirtschaft (`bfs_pacht`, kuratiert), Lex-Koller-Geschichte (`lex_koller_bewg`, `lex_koller_hls`, `lex_koller_chronik`, `lex_koller_geschichte`, `lex_koller_srf`, `lex_koller_behalten`), Lex-Koller-Ausnahmen (`lex_koller_ausnahmen`, `lex_koller_euefta`), Lex-Koller-Reform (`lex_koller_reform`), BlackRock/REFLEKT (`blackrock_immo`, kuratiert), grösste Eigentümer (`ubs_wohnungen`, `bilanz_immo`, `hiag`, Medien), WAV Zürich (`wav_zuerich`), WID (`wid`, Trend) | `ownership.json`, `wid_timeseries.json` | `07_extract_ownership.py`, `03_extract_wid_ubs.py` |
| Pauschalbesteuerung | Anzahl, Ertrag, Spannweite | FDK (`fdk`) | `pauschal.json` | `01_extract_fdk.py` |
| Infrastruktur (Datensatz) | Verkehrsausgaben Staat (Strasse 9,36 / öV 9,60 / Verkehr total 19,58 Mrd, 7,8 %); Bildung 45,49 Mrd (18,0 %); Zeitreihe 2015–2023; NAF 2024 (2,65 Mrd) und BIF 2024 (4,81 Mrd) | EFV Finanzstatistik (`efv`); EFV Staatsrechnung (`efv_staatsrechnung`) | `infrastruktur.json` | `06_extract_infrastruktur.py` (Verkehr/Bildung skript; NAF/BIF kuratiert) |
| Quellen & Methodik | Quellenliste | — | `sources.json` | kuratiert (Metadaten) |

**Lesart der Reproduzierbarkeit:** alle Datendateien werden **skriptbasiert** erzeugt
(byte-/zahlengenau prüfbar, siehe `00_reproduce_statistics.py`). Einzige Ausnahme sind die
kuratierten Makro-Bezugsgrössen in `spend_reference.json` (EFV/BAG/LITRA), die als
belegte Konstanten im Skript `04` gepflegt werden (Feld `bezug: "kuratiert"`); die
Bevölkerung darin kommt live aus BFS-PXWeb (`bezug: "skript"`). `sources.json` enthält
Quellen-Metadaten (kuratiert).
Details in Abschnitt 5.

## Überblick: ein Befehl pro Schritt

Der gesamte Datenbestand unter `src/data/*.json` wird **direkt aus den Primärquellen**
erzeugt. Kein Zwischen-Workbook, keine Handarbeit:

```bash
bash   scripts/fetch_sources.sh             # 1. Rohdaten von ESTV/WID/FDK/UBS/BFS laden -> data/raw/
python3 scripts/01_extract_fdk.py           # 2. FDK-PDF       -> pauschal.json
python3 scripts/02_extract_estv.py          # 3. ESTV-XLSX     -> Verteilung, Kennzahlen, Rechner
python3 scripts/03_extract_wid_ubs.py       # 4. WID-CSV+UBS   -> Zeitreihen, Ranking, Gini, Pyramide
python3 scripts/04_extract_spend_reference.py  # 5. BFS-PXWeb + kuratierte EFV/BAG -> spend_reference.json
python3 scripts/05_extract_habe.py          # 6. BFS-HABE-XLSX -> habe.json (Arbeiter-/Mittelstandshaushalt)
python3 scripts/06_extract_infrastruktur.py # 7. EFV-CSV (Verkehr) + NAF/BIF -> infrastruktur.json
python3 scripts/07_extract_ownership.py     # 8. BFS STAGRE/Gebaeude + SNB + Bilanz/Raiffeisen -> ownership.json
python3 scripts/00_reproduce_statistics.py  # 9. statistische Verfahren unabhängig nachrechnen/prüfen
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

Diese Makrozahlen (`src/data/spend_reference.json`, erzeugt von
`scripts/04_extract_spend_reference.py`) sind **kein** Teil des Steuermodells, sondern reine
Nenner für anschauliche Vergleiche — nominal, gerundet. Jede Grösse trägt ein Feld `bezug`:

**`bezug: "skript"` — Ständige Wohnbevölkerung (BFS, live).**
Bundesamt für Statistik, PXWeb-Cube **`px-x-0102020000_101`** «Demografische Bilanz nach
Kanton». `fetch_sources.sh` stellt die deterministische Abfrage (Schweiz-Total, Bestand am
31. Dezember, neuestes Jahr) und speichert die JSON-stat2-Antwort nach
`data/raw/bfs/population.json`; `04` liest daraus Wert und Jahr.
- Endpunkt: `POST https://www.pxweb.bfs.admin.ch/api/v1/de/px-x-0102020000_101/px-x-0102020000_101.px`
- Auswahl: `Jahr=2024`, `Kanton=0` (Schweiz), `Staatsangehörigkeit=0`, `Geschlecht=0`,
  `Demografische Komponente=14` (Bestand am 31. Dezember).
- Wert Ende 2024: **9 051 029** (Quelle: BFS – ESPOP/STATPOP).

**`bezug: "kuratiert"` — EFV-/ESTV-/BAG-/LITRA-Aggregate (belegte Konstanten in `04`).**
Diese gerundeten Einordnungsgrössen stammen aus mehreren Publikationen (kein einzelner Cube)
und werden als belegte Konstanten im Skript gepflegt; beim Jahreswechsel dort aktualisieren.
Jeder Wert ist auf eine konkrete Tabelle/Zelle zurückgeführt und gegen die Quelle geprüft:

| Grösse | Wert (kuratiert) | Jahr | Geprüft an der Quelle (genaue Fundstelle) | Beleg (direkt) |
|---|---|---|---|---|
| Einkommenssteuern nat. Personen (Bund + Kt. + Gde.) | ~ 62,7 Mrd. | 2023 | EFV-Finanzstatistik, Standardauswertung «Einnahmen nach Arten – Bund/Kantone/Gemeinden» (FS-Modell), Datei `bund_ktn_gdn-d.xlsx`, Blatt `einnahmen`, Artencode **4000** «Einkommenssteuern natürliche Personen» = **62 717 546** Tsd. CHF | <https://www.efv.admin.ch/de/fs-daten> |
| Direkte Bundessteuer nat. Personen | ~ 13,5 Mrd. | 2023 | ESTV «Fiskaleinnahmen des Bundes 2023» (`fiskaleinnahmen-bund-2023.xlsx`), Blatt «DBST neu ab 2023 (Soll)», Summe Zeile **«Fiskalertrag NP»** über alle Monate = **13 407** Mio. CHF | <https://www.estv.admin.ch/de/fiskaleinnahmen-des-bundes> |
| Staatsschuld nach Maastricht (Bund + Kt. + Gde. + Sozialvers.) | ~ 214,2 Mrd. | 2023 | EFV «Öffentliche Finanzen der Schweiz 2023–2024», Schuldenkennzahlen des Staatssektors: **Maastricht-Schuld 2023 = 214,2 Mrd. CHF** (Maastricht-Schuldenquote **26,9 %**). Konsolidierte Bruttoschuld des Gesamtstaats nach EU-Definition; Bestandsgrösse per Jahresende. | <https://www.efv.admin.ch/de/fs-daten> |
| OKP-Leistungen total | ~ 52,1 Mrd. | 2023 | BAG: von den Gesundheitskosten total 95 Mrd. entfallen **«rund 52 Milliarden»** auf Leistungen, die unter die OKP fallen (Kostenoptik) | <https://www.bag.admin.ch/de/newnsb/pwGPlqnWtp7n-FU2nvwJ0> |
| OKP-Prämien (von Versicherten finanziert) | ~ 36 Mrd. | 2023 | BAG: davon **«rund 36 Milliarden … durch Prämien der Versicherten finanziert»** (gleiche Quelle) | s. o. |
| Individuelle Prämienverbilligung (Bund + Kantone) | ~ 5,9 Mrd. | 2023 | BAG-Faktenblatt «Prämienverbilligung» (26.9.2024): **«Im Jahr 2023 wurden insgesamt rund 5,9 Milliarden Franken Prämienverbilligung ausbezahlt. Der Bundesanteil belief sich dabei auf mehr als die Hälfte (3,0 Milliarden Franken respektive 51,2 Prozent).»** | <https://www.bag.admin.ch/dam/en/sd-web/oICf0gNSbo8b/faktenblatt-2025-praemienverbilligung1.pdf> |
| Kundenertrag Personenverkehr gesamter öV | ~ 7,48 Mrd. | 2020 | LITRA «Verkehrszahlen 2024», Grafik «Finanzierung öffentlicher Verkehr» (Betrieb, Mittelherkunft), Posten **«Kundenertrag Personenverkehr» = 7'482 Mio.** (LITRA-Schätzung; zugrunde liegende Daten 2020) | <https://litra.ch/media/article_images/2024/08/Verkehrszahlen_2024_DE.pdf> |

> **Abgrenzung OKP (warum nicht die STATKV-Tabellen?):** Die BAG-Aussage «rund 52 Mrd.
> OKP-Leistungen» nutzt die **Kostenoptik** (Anteil der Gesundheitskosten 2023, der unter die
> OKP fällt). Die insurer-Buchhaltung der **Statistik der obligatorischen Krankenversicherung**
> (STATKV, Rechnungsjahr) weist abweichende, tiefere Werte aus — Bruttoleistungen Tab. T 2.17 =
> **39,9 Mrd.**, Prämien Tab. T 3.06 = **35,3 Mrd.**
> (<https://www.bag.admin.ch/de/statistik-der-obligatorischen-krankenversicherung>). Beide
> Abgrenzungen sind korrekt; als Einordnungsgrösse verwendet die Seite die Kostenoptik (52/36),
> exakt wie sie das BAG kommuniziert.

> **Prämienanteil rechnet auf der ungedeckten Last:** Der Anteil «Krankenkassenprämien
> übernehmen» bezieht sich nicht auf das volle Prämientotal, sondern auf die noch selbst
> getragene Prämienlast. Vom Prämientotal (~36 Mrd.) wird die bereits bestehende individuelle
> Prämienverbilligung (~5,9 Mrd.) abgezogen, also `Prämienanteil = Aufkommen / (Prämien −
> Prämienverbilligung)`. So wird der vom Staat schon getragene Teil nicht ein zweites Mal als
> «übernommen» gezählt.

> **öV-Billette verbilligen:** Der Anteil rechnet `Aufkommen / Kundenertrag Personenverkehr öV`
> (~7,48 Mrd., LITRA-Schätzung für den gesamten öV: Bahn, Bus, Tram); über 100 % hiesse, der
> gesamte öffentliche Verkehr liesse sich aus dem Aufkommen gratis anbieten.

---

## 6. BFS — Haushaltsbudgeterhebung nach Einkommensklasse (HABE)

**Was:** Bruttoeinkommen, Steuern und Vermögenseinkommen der Haushalte je Einkommensquintil.
Liefert die zwei Bezugshaushalte der Karte «Und ein normaler Haushalt?» im Abschnitt
«Zucman-Steuer»: **Arbeiterhaushalt** = mittleres Einkommensfünftel (enthält den Median),
**mittelständischer Haushalt** = Durchschnitt aller Haushalte (Spalte «Sämtliche»).

**Herausgeber:** Bundesamt für Statistik (BFS), Haushaltsbudgeterhebung (HABE).

**Einstiegsseite (Tabelle):**
<https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/einkommen-verbrauch-vermoegen/haushaltsbudget.assetdetail.10867300.html>

**Direkte Download-URL** (identisch im Fetch-Skript, `data/raw/bfs/habe-einkommensklasse.xlsx`):
`https://dam-api.bfs.admin.ch/hub/api/dam/assets/10867300/master`
= Tabelle **T20.02.01.00.12** «Haushaltseinkommen und -ausgaben nach Einkommensklasse».

**Wo genau im Workbook** (`scripts/05_extract_habe.py` liest exakt dies): Blatt
**`2015–2017`** (neueste Querschnittsperiode). Die fünf Spalten-Einkommensklassen sind die
Quintile der Bruttoeinkommensverteilung (Note 8 der Tabelle), je 20 % der Haushalte; die
beschriftete Header-Zelle steht je eine Spalte rechts ihrer Wertspalte. Pro Spalte werden
drei Zeilen gelesen (Beträge in **CHF/Monat pro Haushalt, Mittelwert**):

- `Bruttoeinkommen`
- `Einkommen aus Vermögen und Vermietung`
- `Steuern` (Einkommens- und Vermögenssteuern; in der Tabelle negativ → Betrag)

**Verwendete Spalten:** mittleres Quintil (3. Einkommensklasse, Bruttoband 7 265–9 990) →
Arbeiterhaushalt; Spalte «Sämtliche» → mittelständischer Haushalt; oberstes Quintil nur für
die Einordnung (Vermögenseinkommen 6,9 %).

**Ableitung** (`habe.json`, das Bruttoeinkommen kürzt sich): `jahre = Steuern ÷
Vermögenseinkommen` (ganze Jahressteuer allein aus dem passiven Vermögenseinkommen) und
`tage = Steuern ÷ Bruttoeinkommen × 365` (aus dem gesamten Einkommen, v. a. Arbeit). Ergebnis:
Arbeiterhaushalt 8 573 / 2,6 % / 10,1 % → **~4,0 Jahre / ~37 Tage**; Durchschnitt 9 951 /
4,5 % / 11,7 % → **~2,6 Jahre / ~43 Tage**. Die Rechenformel steht in
[`METHODIK.md`](METHODIK.md) («Direkter Vergleich — Spitze gegenüber normalem Haushalt»).

---

## 7. Hintergrund-Artikel — Gary Stevenson & Gabriel Zucman

**Was:** Die sieben erklärenden Artikel der Seite `/hintergrund` (Komponente
`ArtikelSection.vue`, Texte in `src/i18n/locales/de.js` unter `hintergrund.*`). Sie führen
**keine neuen Rohzahlen** ein. Alle gezeigten Kennzahlen sind bereits an anderer Stelle
dokumentiert und werden hier nur wiederverwendet:

| Kennzahl im Artikel | Quelle (`id`) | dokumentiert in |
|---|---|---|
| reales Vermögenswachstum 7,1 % (Milliardäre) / 1,8 % (Ø) | `zucman_g20` | Abschnitt unten + `sources.json` |
| reales Vermögenswachstum 6–9 % / 3,2 % seit 1995 | `wir2022_wachstum` | `sources.json` |
| effektiver Steuersatz Milliardäre ~0,5 % (Welt), 0,005 % (FR 2016) | `woz_zucman` | `sources.json` |
| effektiver Steuersatz Milliardäre ~0,3 %, 2 %-Satz, 200–250 Mrd. USD, ~3000 Milliardäre | `zucman_g20` | `sources.json` (Hinweis ergänzt) |
| ~103 Tage (ganze 2 %-Steuer passiv verdient) | `zucman_g20` | METHODIK §12 |
| ~4 Jahre / ~37 Tage (Arbeiterhaushalt), 6,9 %/2,6 % Vermögenseinkommen | `bfs_habe` | §6 oben + `habe.json` |
| 32 % (Milliardäre, inkl. Gewinnsteuer) / 19 % (Multimillionäre) | `reichensteuer_studie`, `reichensteuer_studie_ch` | `sources.json` |
| Schweizer Zusatzaufkommen (bis 20 Mrd., Brutto-Szenario) | `workzeitung_reiche` | `sources.json` |

**Argument-Quellen (qualitativ, keine Zahlen):** Die Artikel ordnen die ökonomischen
Argumente ihren Urhebern zu und belegen sie mit verlinkten Quellen.

- **`gary_wiki`** — <https://en.wikipedia.org/wiki/Gary_Stevenson_(economist)>. Werdegang
  (LSE, Citibank), Masterarbeit «The Impact of Inequality on Asset Prices When Households
  Care About Wealth» und die Kernthese (Reiche sparen statt konsumieren, kaufen
  Vermögenswerte, drücken Nachfrage und treiben Vermögenspreise über die Löhne). Abruf
  Juni 2026, HTTP 200.
- **`gary_equals`** — <https://www.equals.ink/p/gary-stevenson-on-wealth-inequality>.
  Stevensons Mechanismus des systemischen Vermögenstransfers (Nachfrageausfall, Mieten,
  tiefe Zinsen nach 2008). Abruf Juni 2026, HTTP 200.
- **`social_europe_demokratie`** —
  <https://www.socialeurope.eu/how-the-billionaire-boom-is-fueling-inequality-and-threatening-democracy>.
  Zusammenhang von Vermögenskonzentration und Demokratiegefährdung (Lobbying, Medien,
  Plattformen, Vertrauensverlust). Im Artikel zitierte Sekundärzahlen werden auf der Seite
  **nicht** als Datenpunkte ausgewiesen. Abruf Juni 2026, HTTP 200.

Diese Quellen liefern keine reproduzierbare Datendatei; sie belegen die Zuordnung der
Argumente. Sie sind in `src/data/sources.json` mit allen Pflichtfeldern deklariert.

**Videos von Gary’s Economics (`gary_youtube`):** Jeder Artikel verlinkt ein passendes Video
von Gary Stevensons YouTube-Kanal. Uploader und Titel sind je Video über die
**YouTube-oEmbed-API** geprüft (`https://www.youtube.com/oembed?format=json&url=…`); zurück
kommt `author_name` = «Garys Economics» samt exaktem Titel, womit Erreichbarkeit und Urheber
belegt sind. Keine erfundenen Links.

| Artikel | Videotitel | Watch-URL |
|---|---|---|
| Der Aufkauf | The rich will fuel a huge asset price rally | <https://www.youtube.com/watch?v=clwnPPhqK2A> |
| Der Geldfluss | How COVID-19 MAKES the Rich Richer - Gary EXPLAINS the theory | <https://www.youtube.com/watch?v=EiblHqbpXHs> |
| Demokratie | UK Budget – The End of Democracy? | <https://www.youtube.com/watch?v=g0lEbH2kEw8> |
| Steuerlücke | How the rich make taxes unpopular | <https://www.youtube.com/watch?v=rQg24dralYY> |
| Wirtschaft | COVID-19 & INEQUALITY: Why the rich are getting richer but the economy will NOT recover | <https://www.youtube.com/watch?v=1YrDt8z0dKE> |
| Die Lösung | Is a wealth tax actually possible? | <https://www.youtube.com/watch?v=gHrxoKEnvEs> |
| Gary & Zucman | Kanal (alle Videos) | <https://www.youtube.com/@garyseconomics> |

---

## 8. EFV — Verkehrs- und Infrastrukturausgaben (Finanzstatistik + Staatsrechnung)

**Was:** Jährliche Ausgaben der öffentlichen Hand für Verkehr (Strasse, öffentlicher
Verkehr/Schiene, übriger Verkehr) sowie die Sonderrechnungen NAF und BIF des Bundes.

### 8a. Verkehrsausgaben Gesamtstaat (skriptbasiert)

**Herausgeber:** Eidg. Finanzverwaltung (EFV), Finanzstatistik (FS-Modell).

**Quelle:** Bulk-Datei `fir_art_funk.csv` (Finanzierungsrechnung nach Sachgruppen und
Funktionen), konsolidierter Sektor Staat (Bund + Kantone + Gemeinden +
Sozialversicherungen).

**Download-URL:**
<https://www.data.finance.admin.ch/static/assets/datasets/fs_dashboard/fir_art_funk.csv>
(rund 1,2 GB; Einstieg/Dashboard: <https://www.efv.admin.ch/de/fs-daten>).

**Beschaffung:** Der Sektor `staat` liegt am Dateianfang. `fetch_sources.sh` lädt nur die
ersten ~95 MB per HTTP-Byte-Range und filtert die `staat`-Zeilen heraus
(`grep ',"staat",'`) → `data/raw/efv/efv_funk_verkehr_staat.csv` (klein, prüfbar).

**Spalten:** `arten, funk, jahr, value, hh, unit, model`. Relevant: `hh = staat`,
`model = fs`, `value` in CHF.

**Extraktion (`06_extract_infrastruktur.py`):** Ausgaben = Summe der Sachgruppen-Klasse 3
(laufende Ausgaben) + Klasse 5 (Investitionsausgaben), also `arten` mit erster Ziffer 3
oder 5, je HRM2-Funktion (`funk`) und Jahr.

| `funk` | Bedeutung |
|---|---|
| 61 | Strassenverkehr |
| 62 | Öffentlicher Verkehr (Schiene/öV) |
| 63 | Übriger Verkehr |
| 64 | Nachrichtenübermittlung |
| 68 | Forschung & Entwicklung Verkehr |
| 2x | Bildung (Gruppe 2: 21 obligatorische Schule, 22 Sonderschulen, 23 berufliche Grundbildung, 25 allgemeinbildende Schulen, 26 höhere Berufsbildung, 27 Hochschulen, 28 Forschung, 29 übriges) |
| **V1** | **Gesamttotal aller Funktionen (amtlicher Kontrollwert)** |

Verkehr gesamt = HRM2-Gruppe 6 (61+62+63+64+68). Wichtig: Die Datei enthält neben den
zweistelligen Funktions-Leaves auch die Total-Zeile `V1`; diese ist **nicht** mitzusummieren
(sonst doppelt). Das Skript prüft: Summe der Leaves = `V1` (Toleranz 0,1 %) und plausibilisiert
das Total (240–265 Mrd.) sowie den Verkehr (18–21 Mrd.).

**Validierung (2023):** Total Staat = 252,07 Mrd. (= `V1`); Kontrollgruppen Bildung
(funk 2x) 45,49 Mrd. = 18,0 %, Soziale Sicherheit (funk 5x) 99,75 Mrd. = 39,6 % — exakt wie
die EFV-Hauptpublikation «Öffentliche Finanzen der Schweiz 2023–2024»
(<https://www.efv.admin.ch/dam/de/sd-web/eN3o9LnwCuBV/2025-hauptpublikation-d.pdf>).
Ergebnis 2023: Strassenverkehr 9,363 Mrd., öffentlicher Verkehr 9,600 Mrd., Verkehr gesamt
19,58 Mrd. = 7,8 % der Staatsausgaben; Bildung (Gruppe 2) 45,49 Mrd. = 18,0 %. Das Skript
extrahiert sowohl Verkehr (Gruppe 6) als auch Bildung (Gruppe 2).

### 8b. NAF und BIF (kuratiert)

**Quelle:** EFV Staatsrechnung 2024 (`efv_staatsrechnung`), Band «Spezialfinanzierungen»
(SPEZ-F) bzw. Band 1A, Einstieg <https://www.efv.admin.ch/de/staatsrechnung>.

Als belegte Konstanten in `06_extract_infrastruktur.py` gepflegt (Erfolgsrechnung 2024,
Spalte «Rechnung»):

- **NAF**, Ziff. 322: Gesamtaufwand **2'646** Mio.; Nationalstrassen **2'454** Mio. (Betrieb
  **454**, reservierte Mittel Nationalstrassenbau **1'839**); Agglomerationsverkehr **191** Mio.
- **BIF**: Gesamtaufwand **4'808** Mio.; Investitionsausgaben **4'138** Mio. (Substanzerhalt
  **3'247**, Ausbau **874**).

Hinweis Doppelzählung: BIF-Bahninfrastruktur und die Leistungsvereinbarung Bund–SBB sind
weitgehend dasselbe Geld; NAF (nur Bund) ist nicht mit der EFV-Funktion 61 (alle
Staatsebenen) oder der BFS-Strasseninfrastrukturrechnung (engeres Konzept) zu addieren.
---

## 9. «Wem gehört die Schweiz?» — Reichste, Firmen, Gebäude, Mietwohnungen

Fetchbare Primärquellen von SNB und BFS plus kuratierte Publikationswerte (Bilanz,
Raiffeisen), eine Datendatei (`src/data/ownership.json`, erzeugt von
`scripts/07_extract_ownership.py`). Rechenformeln in [`METHODIK.md`](METHODIK.md) §14.

**Verläufe (Trends):** Neben den aktuellen Werten zeigt die Sektion mehrere Zeitreihen. Der
STAGRE-Auslandskontroll-Anteil (Feld `firmen.<kennzahl>.serie`, 2014–2024) stammt direkt
aus derselben fetchbaren Quelle. Die Vermögenskonzentration im Zeitverlauf nutzt den bereits
dokumentierten WID-Top-1-%-Anteil der Schweiz (`wid`, `wid_timeseries.json`, Quelle 2). Zwei
weitere Reihen setzen Vermögen ins Verhältnis zum BIP (Nenner: Weltbank `worldbank_gdp`,
NY.GDP.MKTP.CN): gesamtes Privatvermögen ÷ BIP (`reichste.vermoegen_bip_serie`, SNB-RVM ÷ BIP,
2000–2024, als Verlauf) und die 300 Reichsten ÷ BIP (`reichste.top300_bip_serie`, kuratierte
Bilanz-Gesamtwerte 2022 = 821, 2023 = 795, 2024 = 833,5 ÷ BIP). Vom 300/BIP-Verhältnis wird im
UI der jüngste Wert als prominente Kennzahl gezeigt (Listenjahr 2024 ≈ 101 % des BIP); die
ältere Bilanz-Reihe ist nicht frei verfügbar, daher liegen Werte erst ab 2022 vor.

**7a. Nationalität der 300 Reichsten (`bilanz300`, kuratiert).**
«Bilanz – Die 300 Reichsten der Schweiz» weist je Liste aus, wie viele der 300 Ausländer mit
Wohnsitz in der Schweiz sind. Das ist **kein** fetchbarer Datensatz (die Liste ist
redaktionell/teils hinter einer Schranke), sondern ein belegter, kuratierter
Publikationswert — analog zu den EFV/BAG/LITRA-Konstanten in §5 (`bezug: "kuratiert"`).

- **Wert (Liste 2022):** 145 der 300 Reichsten sind Ausländer mit Wohnsitz in der Schweiz
  (rund **48 %**), also rund **155** Schweizer bzw. Liechtensteiner. In die Liste kommt, wer
  hier wohnt, unabhängig von der Nationalität. Der Ausländeranteil liegt über die Jahrgänge stabil bei
  «rund der Hälfte».
- **Beleg:** Bilanz-Ranking, wiedergegeben u. a. von watson
  (<https://www.watson.ch/wirtschaft/schweiz/134475413-bilanz-ranking-so-reich-sind-die-300-reichsten-in-der-schweizer>):
  «Beinahe die Hälfte – genauer 145 der Top 300 – sind Ausländer, die ihren Wohnsitz in der
  Schweiz haben.» Kuratierte Konstante `BILANZ_REICHSTE` in `07_extract_ownership.py`
  (Selbstprüfung 0 < Ausländer < Total) → `ownership.json` (Feld `reichste`).
- **Abgrenzung:** Das betrifft die **300 Reichsten** (die äusserste Spitze), nicht das ganze
  reichste 1 %. Eine amtliche Aufschlüsselung des Top 1 % nach Nationalität gibt es nicht
  (die ESTV-Vermögensstatistik kennt keine Nationalitäts-Dimension). Das ist auf der Seite so
  deklariert.

**7a-bis. Vermögensanteil der 300 Reichsten (`bilanz300` + `snb_haushalte`).**
Wie viel des gesamten Privatvermögens auf die 300 Reichsten entfällt.

- Zähler (kuratiert, Bilanz): Gesamtvermögen der 300 = **851,5 Mrd. CHF** (Liste 2025).
- Nenner (fetchbar, SNB): Reinvermögen aller privaten Haushalte aus dem Cube
  **`frsekgevehup`**, Code **`RVM`** (Finanz- und Sachvermögen minus Verpflichtungen), in
  Mio. CHF, neuestes Jahr. Bezug per CSV über die offene SNB-Daten-API:
  `https://data.snb.ch/api/cube/frsekgevehup/data/csv/de` → `data/raw/snb/haushalte-vermoegen.csv`.
  Neuester Wert (2025): **5132 Mrd. CHF**.
- Anteil: 851,5 ÷ 5132 = **0,166 ≈ 17 %**. Abgrenzung: SNB misst die Haushaltsbilanz, die
  Bilanz-Vermögen sind marktnahe Schätzwerte inkl. Firmenbeteiligungen; Grössenordnung
  vergleichbar, Methodik nicht identisch.

**7b. Firmen nach Kontrolle (`bfs_stagre`).**
BFS **Statistik der Unternehmensgruppen (STAGRE)**, Tabelle **T 6.6.3** «Anzahl
Unternehmensgruppen, Unternehmen, Beschäftigte und Umsatz nach Sitzland».

- Direkte URL: `https://dam-api.bfs.admin.ch/hub/api/dam/assets/36244614/master`
  → `data/raw/bfs/stagre-sitzland.xlsx`
- **Wo genau:** vier Blätter (`Gruppen`, `Unternehmen`, `Besch.`, `Umsatz`); Header-Zeile
  «Sitzland» trägt die Jahre 2014–2024. Je Blatt Zeile **«Total»** und Zeile **«Schweiz»**
  (= inländisch kontrolliert); Auslandskontrolle = Total − Schweiz. Gelesen wird je Blatt das
  neueste Jahr mit beiden Werten (Unternehmen/Beschäftigte/Gruppen 2024, Umsatz 2023).
- **Belegwerte:** Unternehmen 2024 = 66 293 (Schweiz 46 822 = 70,6 %, Ausland 19 471 =
  29,4 %); Beschäftigte 2024 = 2 136 580 (Ausland 27,0 %); Umsatz 2023 = 2 572,5 Mrd. CHF
  (Ausland 62,7 %).

**7b-bis. Gebäude nach Eigentümertyp (`bfs_gebaeude`).**
BFS «Statistik der Eigentümertypen der Gebäude», registerbasiert (Gebäude- und
Wohnungsregister verknüpft mit Grundbuch), Stand 2022.

- Direkte URL: `https://www.bfs.admin.ch/bfsstatic/dam/assets/27885505/master`
  → `data/raw/bfs/gebaeude-eigentuemertyp.xlsx`
- **Wo genau:** Blatt **«2022»**, Zeile **«Total (Schweiz ohne ZH und VS)»**. Spalten:
  Total (Sp. 2), Natürliche Person(en) (Sp. 3), Juristische Person Total (Sp. 4),
  Gemeinschaft Total (Sp. 15), Gemischt (Sp. 20), Unbekannt (Sp. 21).
- **Belegwerte:** von 1 438 755 Gebäuden 964 272 = **67,0 %** natürliche Personen, 171 612 =
  11,9 % juristische Personen, 206 568 = 14,4 % Gemeinschaften, 96 303 = 6,7 % gemischt/
  unbekannt. Caveat: Gebäudezählung (nicht Wohnungen) und ohne ZH und VS; die institutionelle
  Konzentration bei den Mietwohnungen ist grösser. Selbstprüfung: Summe der Typen ≈ Total.

**7b-ter. Mietwohnungen nach Eigentümer (`raiffeisen_immo`, kuratiert).**
Raiffeisen Economic Research «Immobilien Schweiz Q4/20» (Datenbasis Wüest Partner),
Medienmitteilung 12.11.2020. Modellbasierte Schätzung, keine amtliche Vollerhebung; als
kuratierte Drittquelle geführt (analog zu LITRA in §5), Konstante `MIETWOHNUNGEN` im Skript.

- URL (HTTP 200): `https://www.raiffeisen.ch/rch/de/ueber-uns/news/rch/immobilien-schweiz-q4-20.html`
- **Belegwerte (Mietwohnungsbestand):** Privatpersonen 49 %, institutionelle Anleger
  (Pensionskassen, Versicherungen, Immobilienfonds) 33 %, Genossenschaften 8 %, klassische
  Immobilienfirmen 7 %, öffentliche Hand 4 %. Der institutionelle Anteil steigt seit 2000
  (damals rund ein Viertel). Selbstprüfung: Anteile summieren auf ~100 %.

**7b-quater. Boden-Kontext: BlackRock (kuratiert).**
- `blackrock_immo` (REFLEKT/WAV): BlackRock hält ~6 % der börsenkotierten Schweizer
  Immobilienfirmen (~2 Mrd., 17 Firmen, in 10 Jahren ~20×), Swiss Prime Site >12 %, indirekter
  Auslandsbesitz trotz Lex Koller. Feld `boden.blackrock`.
Kuratiert (`bezug: "kuratiert"`), Beleg in `sources.json`.

**7b-quinquies. Wohnungen, Pacht und grösste Eigentümer (kuratiert).**
- `bfs_wohnungen` (BFS-Wohnungsstatistik, 2023): Mietwohnungen zu 45 % im Besitz von
  Privatpersonen, rund ein Drittel institutionell; nach Bauperiode vor 1946 = 65 % privat,
  nach 2000 = 32 %. Felder `wohnungen_bfs` (inkl. `baujahr`).
- `bfs_pacht` (BFS-Strukturerhebung): Pachtanteil an der LN 1980 = 37 %, 2005 = 43 %,
  2016 = 45 %, um 2020 = 47 %; Bauern flächenmässig grösste Grundbesitzer. Feld `boden.pacht`.
- Grösste einzelne Eigentümer (Medienrecherchen, Drittquellen): UBS + CS ~70 000 Wohnungen
  (`ubs_wohnungen`), Swiss Life ~3 Mio. m² (`bilanz_immo`), Hiag ~2,6 km² (`hiag`).
  Feld `boden.groesste`.
- `lex_koller_reform` (Bundesrat, 15.4.2026): Vernehmlassung zur Verschärfung der Lex Koller.
- `bfs_wohneigentum` (BFS T 09.03.02.01.03, DAM-Asset 36398362, fetchbar): Wohneigentumsquote
  je Jahr, Zeile Schweiz, Spalte «Anteil in %»; Höchststand 2015 (38,4 %), 2024 = 35,7 %.
  Feld `wohneigentum` (serie/peak). Selbstprüfung: nur plausible Quoten (20–50 %) je Blatt.
- `lex_koller_ausnahmen` (Grundeigentümer-Verband): bewilligungsfreie Fälle (EU/EFTA mit
  Wohnsitz, Drittstaats-B für Hauptwohnung, Geschäftsliegenschaften). `bilanz_immo`: Bilanz-
  Flächenranking (SBB 94,4 Mio. m², Swiss Life >3 Mio. m²). Kontext bzw. Feld `boden.groesste`.
- `lex_koller_euefta` (Engel & Völkers, fetchbar): EU/EFTA-Bürger mit Wohnsitz erwerben
  «unbeschränkt sämtliche Immobilienarten bewilligungsfrei», inkl. Mehrfamilienhäuser und
  Zweitwohnungen (also als Renditeobjekt); Geschäftsliegenschaften herkunftsunabhängig
  bewilligungsfrei. Kontext zur Sektion (kein Datenfeld).
- `lex_koller_bewg` (Fedlex, SR 211.412.41 / AS 1984 1148, fetchbar): amtlicher Gesetzestext und
  Primärquelle für Titel, Erlassdatum (16.12.1983) und Inkrafttreten (1.1.1985, Lex Friedrich)
  sowie die Revisionschronik (u. a. Lex Koller 1997). Kein Datenfeld.
- `lex_koller_hls` (Historisches Lexikon der Schweiz, «Ausverkauf der Heimat», fetchbar):
  Namenskette Lex von Moos (BB 23.3.1961) → Lex Furgler (in Kraft 1.2.1974) → Lex Friedrich
  (BewG 16.12.1983) und der politische Kontext. Kein Datenfeld.
- `lex_koller_chronik` (LAWINFO/law.ch, fetchbar): datierte Chronologie inkl. Lex Celio
  (notrechtlicher BRB vom 26.6.1972) und der jeweiligen Änderungen. Kein Datenfeld.
- `lex_koller_srf` (SRF, 10 vor 10, fetchbar): Eine Studie des Bundes zeigte, dass eine
  Aufhebung der Lex Koller die Mietpreise steigen liesse; das war ein Hauptgrund, weshalb die
  Aufhebung (Bundesrat 2007) fallengelassen und das Gesetz beibehalten wurde. Kein Datenfeld.
- `lex_koller_behalten` (Bundesrat/admin.ch, «Die Lex Koller beibehalten»): amtliche Begründung
  für den Aufhebungsverzicht, namentlich der Druck auf die hohen Immobilien-/Mietpreise und auf
  den Schweizer Franken; Verzicht 2013, Beibehaltung durch das Parlament. Die admin.ch-Seite
  blockiert wie `lex_koller_reform` automatisierte Abrufe (403), im Browser erreichbar. Kein Datenfeld.
- `lex_koller_geschichte` (Wikipedia, fetchbar): Geschichte der Lex Koller für den
  Prosa-Abschnitt. Ursprung gegen «Überfremdung des einheimischen Bodens» (Lex von Moos 1961
  u. a.), heutiges Gesetz seit 1985, Name Koller seit der Revision 1997; Lockerungen 1997
  (Geschäftsliegenschaften) und 2005 (börsenkotierte Anteile); Aufhebungsvorlage 2007, 2012/2013
  vom Parlament beerdigt; Revisionsversuch 2017 gescheitert. Kontext zur Sektion (kein Datenfeld).

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
