#!/usr/bin/env python3
"""
03 — WID (Vermoegensanteile) + UBS (Vermoegens-Gini) -> International-Sektion.

WID.world Bulk-CSV je Land (data/raw/wid/WID_data_<ISO>.csv), Variable
`shwealj992` (Anteil am net personal wealth, Erwachsene, equal-split):
  p99p100 = Top 1 %, p90p100 = Top 10 %, p50p90 = mittlere 40 %, p0p50 = untere 50 %.

UBS Global Wealth Report 2025 (data/raw/ubs/ubs_gwr_2025.pdf): Tabelle
"Wealth inequality, measured by the Gini coefficient" (Stand Ende 2024),
je Markt ein Gini-Wert.

Erzeugt:
  src/data/wid_timeseries.json     Zeitreihen 1995-2024, vier Anteile + WID-Gini, je Land
  src/data/ubs_gini.json           kuratierter Gini-Ländervergleich (UBS-Studie-Sektion)
  src/data/ubs_wealth_levels.json  Ø- vs. Median-Vermögen pro Erwachsenem je Markt (USD)

Benoetigt `pdftotext` (poppler-utils) fuer die UBS-Tabelle.
"""
import csv
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WID = os.path.join(ROOT, "data", "raw", "wid")
UBS_PDF = os.path.join(ROOT, "data", "raw", "ubs", "ubs_gwr_2025.pdf")
DATA = os.path.join(ROOT, "src", "data")

YEARS = list(range(1995, 2025))

# Reihenfolge wie auf der Seite. (Deutscher Name, WID-ISO, UBS-Marktname)
COUNTRIES = [
    ("USA", "US", "United States"),
    ("China", "CN", "Mainland China"),
    ("Schweiz", "CH", "Switzerland"),
    ("Frankreich", "FR", "France"),
    ("Deutschland", "DE", "Germany"),
    ("Vereinigtes Königreich", "GB", "United Kingdom"),
    ("Schweden", "SE", "Sweden"),
    ("Japan", "JP", "Japan"),
    ("Italien", "IT", "Italy"),
    ("Spanien", "ES", "Spain"),
    ("Indien", "IN", "India"),
    ("Russland", "RU", "Russia"),
    ("Brasilien", "BR", "Brazil"),
    ("Welt", "WO", None),  # UBS weist kein Welt-Gini aus
]

PCTL = {"top1": "p99p100", "top10": "p90p100", "mid40": "p50p90", "bot50": "p0p50"}

# Kuratierter Ländervergleich für die UBS-Studie-Sektion (deutscher Name, UBS-Marktname).
# Spannt bewusst von den ungleichsten bis zu den gleichsten Märkten der Stichprobe.
UBS_RANKING = [
    ("Brasilien", "Brazil"), ("Russland", "Russia"), ("Südafrika", "South Africa"),
    ("Schweden", "Sweden"), ("USA", "United States"), ("Indien", "India"),
    ("Deutschland", "Germany"), ("Schweiz", "Switzerland"), ("China", "Mainland China"),
    ("Portugal", "Portugal"), ("Frankreich", "France"), ("Vereinigtes Königreich", "United Kingdom"),
    ("Japan", "Japan"), ("Belgien", "Belgium"), ("Slowakei", "Slovakia"),
]

# Tabelle «Wealth per adult: the top 25»: Durchschnitt vs. Median je Markt (Ende 2024).
# Zeigt die Mittelwert-Median-Lücke – Kernaussage der Seite. EN→DE der Märkte, die in
# beiden Ranglisten (Ø und Median) vorkommen.
WEALTH_LEVEL_NAMES = {
    "Switzerland": "Schweiz", "United States": "USA", "Hong Kong SAR": "Hongkong",
    "Luxembourg": "Luxemburg", "Australia": "Australien", "Denmark": "Dänemark",
    "Singapore": "Singapur", "New Zealand": "Neuseeland", "Netherlands": "Niederlande",
    "Norway": "Norwegen", "Canada": "Kanada", "Belgium": "Belgien",
    "United Kingdom": "Vereinigtes Königreich", "Sweden": "Schweden", "Taiwan": "Taiwan",
    "France": "Frankreich", "Israel": "Israel", "Ireland": "Irland", "Spain": "Spanien",
    "Italy": "Italien", "Japan": "Japan", "Finland": "Finnland", "South Korea": "Südkorea",
}


def fail(msg):
    print(f"  [FAIL] {msg}", file=sys.stderr)
    sys.exit(1)


def read_wid_country(iso):
    """Liest aus dem Länder-CSV:
      - 'shares': {shwealj992-Perzentilcode: {year -> Anteil}} (Top 1/10 %, …)
      - 'gini':   {year -> WID-eigener Vermögens-Gini ghwealj992 (p0p100)}
    """
    path = os.path.join(WID, f"WID_data_{iso}.csv")
    if not os.path.exists(path):
        fail(f"WID-Datei fehlt: {path} — zuerst `bash scripts/fetch_sources.sh`.")
    shares = {code: {} for code in PCTL.values()}
    gini = {}
    with open(path, encoding="utf-8") as fh:
        for row in csv.reader(fh, delimiter=";"):
            if len(row) < 5:
                continue
            var, code = row[1], row[2]
            try:
                year, value = int(row[3]), float(row[4])
            except ValueError:
                continue
            if var == "shwealj992" and code in shares:
                shares[code][year] = value
            elif var == "ghwealj992" and code == "p0p100":
                gini[year] = value
    return {"shares": shares, "gini": gini}


def ubs_text():
    """Layout-Text des UBS-Reports (einmal pro Lauf via pdftotext)."""
    if not os.path.exists(UBS_PDF):
        fail(f"UBS-PDF fehlt: {UBS_PDF} — zuerst `bash scripts/fetch_sources.sh`.")
    try:
        return subprocess.run(["pdftotext", "-layout", UBS_PDF, "-"],
                              check=True, capture_output=True, text=True).stdout
    except FileNotFoundError:
        fail("`pdftotext` nicht gefunden — bitte poppler-utils installieren.")


def parse_ubs_gini():
    """UBS-Markt -> Gini (Ende 2024) aus der Ranking-Tabelle des Reports."""
    text = ubs_text()
    gini = {}
    # Tabellenzeilen enden mit "<rang>  <Markt>  <0.NN>". Im zweispaltigen
    # -layout-Text steht links evtl. Fliesstext davor -> am Zeilenende suchen.
    rx = re.compile(r"(\d{1,2})\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'’-]+?)\s+(0\.\d{2})\s*$")
    for ln in text.splitlines():
        m = rx.search(ln)
        if m:
            gini[m.group(2).strip()] = float(m.group(3))
    if "Switzerland" not in gini or gini.get("Brazil") != 0.82:
        fail(f"UBS-Gini-Tabelle nicht plausibel erkannt ({len(gini)} Eintraege).")
    return gini


def parse_ubs_wealth_levels():
    """Ø- und Median-Vermögen pro Erwachsenem je Markt (USD, Ende 2024) aus der
    Tabelle «Wealth per adult: the top 25». Rueckgabe: Liste {land, avg, median}."""
    text = ubs_text()
    # Zeilen enden mit "<Markt> <Ø> <rang> <Markt> <Median>"; links steht evtl. Fliesstext,
    # daher am Spaltenabstand (>=2 Leerzeichen) verankern und Namen ggf. nachsaeubern.
    rx = re.compile(r"(?:^|\s{2,})([A-Z][A-Za-z .'-]+?)\s+([\d,]{4,})\s+(\d{1,2})\s+"
                    r"([A-Z][A-Za-z .'-]+?)\s+([\d,]{4,})\s*$")
    avg, med = {}, {}
    for ln in text.splitlines():
        m = rx.search(ln)
        if not m:
            continue
        am = re.split(r"\s{2,}", m.group(1).strip())[-1].strip()
        mm = re.split(r"\s{2,}", m.group(4).strip())[-1].strip()
        avg[am] = int(m.group(2).replace(",", ""))
        med[mm] = int(m.group(5).replace(",", ""))
    rows = [
        {"land": de, "avg": avg[en], "median": med[en]}
        for en, de in WEALTH_LEVEL_NAMES.items() if en in avg and en in med
    ]
    rows.sort(key=lambda r: -r["avg"])
    if not rows or avg.get("Switzerland") != 687166 or med.get("Switzerland") != 182248:
        fail(f"UBS-Vermoegensniveau-Tabelle nicht plausibel erkannt ({len(rows)} Laender).")
    return rows


def main():
    wid = {iso: read_wid_country(iso) for _, iso, _ in COUNTRIES}
    gini = parse_ubs_gini()
    wealth_levels = parse_ubs_wealth_levels()

    # Zeitreihen 1995-2024: vier Anteile (shwealj992) + WID-Gini (ghwealj992)
    timeseries = {}
    for metric, code in PCTL.items():
        timeseries[metric] = {}
        for de, iso, _ in COUNTRIES:
            s = wid[iso]["shares"][code]
            timeseries[metric][de] = {str(y): s.get(y) for y in YEARS}
    timeseries["gini"] = {
        de: {str(y): wid[iso]["gini"].get(y) for y in YEARS}
        for de, iso, _ in COUNTRIES
    }

    # Kuratierter Gini-Vergleich für die UBS-Studie-Sektion (Werte exakt aus dem Report).
    ubs_rows = []
    for de, en in UBS_RANKING:
        if en not in gini:
            fail(f"UBS-Markt fehlt in der Gini-Tabelle: {en}")
        ubs_rows.append({
            "land": de, "gini": gini[en],
            "hinweis": "UBS Global Wealth Report 2025 (Vermögens-Gini, Ende 2024)",
        })

    with open(os.path.join(DATA, "wid_timeseries.json"), "w") as fh:
        json.dump(timeseries, fh, indent=1)
    with open(os.path.join(DATA, "ubs_gini.json"), "w") as fh:
        json.dump(ubs_rows, fh, indent=1)
    with open(os.path.join(DATA, "ubs_wealth_levels.json"), "w") as fh:
        json.dump(wealth_levels, fh, indent=1)

    ch_top1 = timeseries["top1"]["Schweiz"]
    cy = max(y for y in ch_top1 if ch_top1[y] is not None)
    chw = next(r for r in wealth_levels if r["land"] == "Schweiz")
    print("  [OK ] wid_timeseries.json, ubs_gini.json, ubs_wealth_levels.json")
    print(f"        Schweiz {cy}: Top1={ch_top1[cy]:.4f} "
          f"Top10={timeseries['top10']['Schweiz'][cy]:.4f} "
          f"untere50={timeseries['bot50']['Schweiz'][cy]:.4f}  "
          f"WID-Gini={timeseries['gini']['Schweiz'][cy]}")
    print(f"        UBS Vermoegen/Erwachsenem: Ø {chw['avg']:,} USD vs. Median "
          f"{chw['median']:,} USD (Faktor {chw['avg']/chw['median']:.2f}) — {len(wealth_levels)} Laender")
    print(f"        UBS-Gini erkannt fuer {len(gini)} Maerkte "
          f"(z. B. CH={gini.get('Switzerland')}, DE={gini.get('Germany')}, US={gini.get('United States')})")


if __name__ == "__main__":
    main()
