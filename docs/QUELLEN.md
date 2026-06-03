# Quellen & Beschaffung — Provenance-Runbook

> **Zweck:** lückenlos dokumentieren, **woher** jede Rohzahl stammt und **wie** man sie
> Schritt für Schritt selbst beschafft. Das **Wie der Berechnung** steht in
> [`docs/METHODIK.md`](./METHODIK.md).

## Status des Live-Bezugs

Die aktuell unter `src/data/*.json` liegenden Daten wurden aus drei Original-Workbooks
extrahiert (Skripte `scripts/01–03`), die ihrerseits die unten genannten Primärquellen
zusammenführen. Der **direkte Live-Download von den Behördenservern** ist in der
Cloud-Sandbox dieses Projekts gesperrt (Netzwerk-Policy erlaubt nur GitHub und
Paket-Registries; `estv.admin.ch`, `wid.world`, `ubs.com`, `bfs.admin.ch` liefern 403).
Der Live-Bezug inkl. Prüfsummen ist deshalb in einer Session **mit offenem Netzzugang**
(oder lokal) gemäss den folgenden Runbooks auszuführen. Jeder Schritt ist so notiert,
dass das Ergebnis byte-genau nachvollziehbar bleibt.

---

## 1. ESTV — Vermögenssteuerstatistik (Kernquelle)

**Was:** Anzahl Steuerpflichtige und steuerbares Reinvermögen je Vermögensklasse, je
Steuerjahr, Schweiz und Kantone. Kategorien *alle* (2012–2022) und *unbeschränkt
steuerpflichtig* (ab 2020).

**Herausgeber:** Eidgenössische Steuerverwaltung (ESTV), Abteilung Steuerpolitik —
Volkswirtschaft und Steuerstatistik.

**Einstiegsseite:**
<https://www.estv.admin.ch/de/gesamtschweizerische-vermoegenssteuerstatistik>

**Runbook:**
1. Einstiegsseite öffnen → Abschnitt «Gesamtschweizerische Vermögenssteuerstatistik».
2. Pro Steuerjahr (2012 … 2022) die Einzeldatei (XLSX/XLSM) herunterladen.
3. Aus jeder Jahresdatei die landesweiten Klassentabellen ziehen:
   - Anzahl Pflichtige je Klasse,
   - Reinvermögen je Klasse,
   - getrennt nach Steuerpflicht-Kategorie (ab 2020 *unbeschränkt* separat).
4. Jahre harmonisieren und zusammenführen → entspricht
   `src/data/estv_distribution.json` (Blätter `Pivot_CH*`).
5. Prüfsumme jeder Rohdatei notieren (`sha256sum *.xlsx`) und hier eintragen.

**Verwendet für:** Verteilungs-Sektion, gesamter Rechner (Populationsmodell),
Pareto-Tail, Gini.

**Hinweise zur Bedeutung:** «Pflichtige» = Steuereinheit (Ehepaare gemeinsam = eine);
Reinvermögen zu Steuerwerten, ohne 2./3. Säule und Hausrat. Pauschalbesteuerte sind hier
**nicht** enthalten (siehe Quelle 4).

---

## 2. WID — World Inequality Database (internationaler Vergleich)

**Was:** Vermögensanteile Top 1 % / Top 10 % / mittlere 40 % / untere 50 %, Zeitreihen
1995–2024, je Land.

**Herausgeber:** World Inequality Lab (WID.world).

**Einstieg:** <https://wid.world> → *Data* / *Bulk download*.

**Exakte Spezifikation:**
- **Variable:** `shwealj992` — Anteil am *net personal wealth*, Bezugseinheit Erwachsene
  (`992`), *equal-split* innerhalb von Paaren.
- **Perzentil-Codes:** `p99p100` = Top 1 %, `p90p100` = Top 10 %, `p50p90` = mittlere
  40 %, `p0p50` = untere 50 %.
- **Bezug:** Bulk-Download (pro Land eine CSV: `WID_data_<ISO2>.csv` plus
  `WID_metadata_<ISO2>.csv`). Die öffentliche REST-API war zum Erhebungszeitpunkt
  gesperrt; der Bulk-Datensatz ist die offizielle, vollständige Quelle.

**Runbook:**
1. Bulk-Datensatz von `wid.world` laden (komplett oder gezielt pro Land:
   CH, US, CN, FR, DE, GB, SE, JP, IT, ES, IN, RU, BR sowie *World*).
2. Je Land/Jahr die vier Perzentil-Codes für `shwealj992` extrahieren.
3. Zu Zeitreihen zusammenstellen → `src/data/wid_timeseries.json`,
   neueste Werte → `src/data/wid_latest.json`.

**Verwendet für:** International-Sektion (Zeitreihen + Länderranking).
**Vergleichbarkeit:** WID misst Gesamt-Marktvermögen, ESTV nur steuerbares Vermögen —
systematisch verschiedene Niveaus, gleicher Trend. Auf der Seite klar getrennt.

---

## 3. UBS — Global Wealth Report 2025 (Gini)

**Was:** Vermögens-Gini je Land, Ende 2024 (modelliertes Gesamt-Nettovermögen pro
Erwachsenem).

**Herausgeber:** UBS (vormals Credit Suisse Global Wealth Report).

**Einstieg:**
<https://www.ubs.com/global/en/family-office-uhnw/reports/global-wealth-report.html>

**Runbook:**
1. Report 2025 (PDF/Databook) beziehen.
2. Gini-Tabelle (Wealth Gini je Land, Stand Ende 2024) entnehmen.
3. Werte → `src/data/ubs_gini.json` und `gini`-Spalte in `wid_latest.json`.
   Nicht zellengenau belegbare Werte sind als «ca.» zu kennzeichnen.

**Verwendet für:** Gini-Spalte im Länderranking.

---

## 4. FDK — Aufwandbesteuerung (Pauschalbesteuerung)

**Was:** Anzahl Aufwandbesteuerte und Steuerertrag (Bund/Kanton/Gemeinde), Schweiz und
Kantone, Stand 31.12.2018. Letzte zentral publizierte Gesamterhebung.

**Herausgeber:** Konferenz der kantonalen Finanzdirektorinnen und Finanzdirektoren (FDK).
**Beleg:** Medienmitteilung vom 7. Juni 2019. <https://www.fdk-cdf.ch>

**Runbook:**
1. Medienmitteilung/Erhebung 2019 (Stand 31.12.2018) beziehen.
2. Tabelle 1 (Anzahl je Kanton) und Tabelle 2 (Steuerertrag) entnehmen.
3. Schweiz-Total → `src/data/pauschal.json` (2018: 4 557 Personen; Ertrag Bund 234 +
   Kanton 385 + Gemeinde 202 Mio.). Spannweite Einzelsteuer 2018: 10 000 – 11 967 953 CHF.

**Verwendet für:** Pauschal-Sektion und Parameter `M` im Rechner-Tail.
**Achtung:** «Personen» (FDK) ≠ «Pflichtige/Steuerfälle» (ESTV). Vermögen wird hier
**nicht** erhoben.

---

## 5. Bezugsgrössen «Was tun mit dem Geld?» (nur Einordnung)

Diese Makrozahlen stammen aus offiziellen Bundesquellen und sind **kein** Teil der
Steuer-Workbooks (`src/data/spend_reference.json`):

| Grösse | Wert | Jahr | Quelle | Beleg |
|---|---|---|---|---|
| Einkommenssteuern nat. Personen (alle Ebenen) | ~ 62,7 Mrd. | 2023 | EFV/ESTV | <https://www.efv.admin.ch/de/einnahmen> |
| Direkte Bundessteuer nat. Personen | ~ 13,5 Mrd. | 2023 | EFV | <https://www.efv.admin.ch/de/einnahmen> |
| OKP-Prämien (von Versicherten finanziert) | ~ 36 Mrd. | 2023 | BAG | <https://www.bag.admin.ch/bag/de/home/zahlen-und-statistiken/statistiken-zur-krankenversicherung.html> |
| Ständige Wohnbevölkerung | 9 048 900 | 2024 | BFS | <https://www.bfs.admin.ch/bfs/de/home/statistiken/bevoelkerung/stand-entwicklung.html> |

**Runbook:** jeweils den neuesten publizierten Jahreswert übernehmen, Jahr und Abrufdatum
hier festhalten. Gerundet, nominal.

---

## Prüfsummen (beim Live-Bezug auszufüllen)

| Datei | Quelle | sha256 | Abrufdatum |
|---|---|---|---|
| `estv_vermoegen_2012.xlsx` … `2022.xlsx` | ESTV | _(tbd)_ | _(tbd)_ |
| `WID_data_CH.csv` … (je Land) | WID | _(tbd)_ | _(tbd)_ |
| `ubs_gwr_2025.pdf` | UBS | _(tbd)_ | _(tbd)_ |
| `fdk_aufwandbesteuerung_2019.pdf` | FDK | _(tbd)_ | _(tbd)_ |

Beim nächsten Live-Bezug: Dateien herunterladen, `sha256sum` eintragen, Extraktion über
`scripts/01–03` laufen lassen, und die erzeugten JSON mit den aktuellen
(Git-versionierten) abgleichen (`git diff src/data/`). Bleibt der Diff leer, ist die
Pipeline byte-genau reproduziert.
