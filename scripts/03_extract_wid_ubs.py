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
  src/data/wid_timeseries.json   Zeitreihen 1995-2024, vier Anteile, je Land
  src/data/wid_latest.json       neuester Wert je Land + UBS-Gini
  src/data/ubs_gini.json         kuratierter Gini-Ländervergleich (UBS-Studie-Sektion)

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


def parse_ubs_gini():
    """UBS-Markt -> Gini (Ende 2024) aus der Ranking-Tabelle des Reports."""
    if not os.path.exists(UBS_PDF):
        fail(f"UBS-PDF fehlt: {UBS_PDF} — zuerst `bash scripts/fetch_sources.sh`.")
    try:
        text = subprocess.run(["pdftotext", "-layout", UBS_PDF, "-"],
                              check=True, capture_output=True, text=True).stdout
    except FileNotFoundError:
        fail("`pdftotext` nicht gefunden — bitte poppler-utils installieren.")
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


def main():
    wid = {iso: read_wid_country(iso) for _, iso, _ in COUNTRIES}
    gini = parse_ubs_gini()

    # Zeitreihen 1995-2024
    timeseries = {}
    for metric, code in PCTL.items():
        timeseries[metric] = {}
        for de, iso, _ in COUNTRIES:
            s = wid[iso]["shares"][code]
            timeseries[metric][de] = {str(y): s.get(y) for y in YEARS}

    # Neuester Wert je Land (max. Jahr, fuer das alle vier Anteile vorliegen).
    # Der Gini ist hier der WID-EIGENE Vermögens-Gini (ghwealj992), passend zu den
    # ebenfalls aus WID stammenden Anteilen. Der UBS-Gini lebt separat in ubs_gini.json.
    latest = []
    for de, iso, _ in COUNTRIES:
        s = wid[iso]["shares"]
        common = set.intersection(*[set(s[code]) for code in PCTL.values()])
        if not common:
            fail(f"{de}: keine gemeinsamen Jahre fuer alle vier Anteile.")
        y = max(common)
        latest.append({
            "land": de, "jahr": y,
            "top1": s["p99p100"][y], "top10": s["p90p100"][y],
            "mid40": s["p50p90"][y], "bot50": s["p0p50"][y],
            "gini": wid[iso]["gini"].get(y),
        })

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
    with open(os.path.join(DATA, "wid_latest.json"), "w") as fh:
        json.dump(latest, fh, indent=1)
    with open(os.path.join(DATA, "ubs_gini.json"), "w") as fh:
        json.dump(ubs_rows, fh, indent=1)

    ch = next(x for x in latest if x["land"] == "Schweiz")
    print("  [OK ] wid_timeseries.json, wid_latest.json, ubs_gini.json")
    print(f"        Schweiz {ch['jahr']}: Top1={ch['top1']:.4f} Top10={ch['top10']:.4f} "
          f"untere50={ch['bot50']:.4f}  WID-Gini={ch['gini']}")
    print(f"        UBS-Gini erkannt fuer {len(gini)} Maerkte "
          f"(z. B. CH={gini.get('Switzerland')}, DE={gini.get('Germany')}, US={gini.get('United States')})")


if __name__ == "__main__":
    main()
