#!/usr/bin/env python3
"""
01 — FDK Aufwandbesteuerung ("Pauschalbesteuerung") -> src/data/pauschal.json

Quelle: Konferenz der kantonalen Finanzdirektorinnen und Finanzdirektoren (FDK),
Medienmitteilung vom 7. Juni 2019, "Stand der Besteuerung nach dem Aufwand am
31.12.2018" (data/raw/fdk/fdk_aufwandbesteuerung_2019_D.pdf).

Aus dem Anhang werden zwei Schweiz-Tabellen gelesen (Erhebungsjahre 2008-2018):
  - Anzahl Aufwandbesteuerte (Zeile "CH")
  - Ertrag je Staatsebene (Bund / Kanton / Gemeinde, in Mio. CHF)
  - tiefste / hoechste fuer 2018 eingezogene Pauschalsteuer (in CHF)

Benoetigt das System-Tool `pdftotext` (poppler-utils). Das Skript ist
selbstpruefend: es bricht ab, falls die erwarteten Zeilen nicht gefunden werden.

Verwendung der Zahl im Modell: M = Anzahl 2018 (4'557) wird im Pareto-Tail des
Rechners zu den ESTV-Faellen >10 Mio. addiert (siehe docs/METHODIK.md, Abschn. 7).
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, "data", "raw", "fdk", "fdk_aufwandbesteuerung_2019_D.pdf")
OUT = os.path.join(ROOT, "src", "data", "pauschal.json")

YEARS = [2008, 2010, 2012, 2014, 2016, 2018]


def fail(msg):
    print(f"  [FAIL] {msg}", file=sys.stderr)
    sys.exit(1)


def pdftext(path):
    if not os.path.exists(path):
        fail(f"PDF fehlt: {path} — zuerst `bash scripts/fetch_sources.sh` ausfuehren.")
    try:
        return subprocess.run(
            ["pdftotext", "-layout", path, "-"],
            check=True, capture_output=True, text=True,
        ).stdout
    except FileNotFoundError:
        fail("`pdftotext` nicht gefunden — bitte poppler-utils installieren.")


def ints(line):
    """Alle ganzzahligen Tokens einer Zeile (Tausender-Apostrophe entfernt)."""
    return [int(t.replace("'", "")) for t in re.findall(r"[\d']+", line)
            if t.replace("'", "").isdigit()]


def row_after(lines, label_rx, need=6):
    """Erste Zahlenzeile mit >= `need` Ints ab der Zeile, die label_rx matcht."""
    rx = re.compile(label_rx, re.IGNORECASE)
    for i, ln in enumerate(lines):
        if rx.search(ln):
            for ln2 in lines[i:i + 4]:
                vals = ints(ln2)
                if len(vals) >= need:
                    return vals[:need] if need else vals
    fail(f"Zeile zu /{label_rx}/ nicht gefunden.")


def main():
    lines = pdftext(PDF).splitlines()

    # Anzahl Aufwandbesteuerte CH (Zeile beginnt mit "CH" + 6 Jahreswerte)
    counts = None
    for ln in lines:
        s = ln.strip()
        if s.startswith("CH ") or s == "CH":
            vals = ints(ln)
            if len(vals) == 6:
                counts = vals
                break
    if counts is None:
        fail("CH-Anzahlzeile (6 Werte) nicht gefunden.")

    bund = row_after(lines, r"Ertrag\s+Bundessteuer")
    kanton = row_after(lines, r"Ertrag\s+Kantonssteuern")
    gemeinde = row_after(lines, r"Ertrag\s+Gemeindesteuern")
    tiefste = row_after(lines, r"[Tt]iefste")
    hoechste = row_after(lines, r"[Hh].?chste")

    pausch = {
        "counts_ch": {str(y): counts[i] for i, y in enumerate(YEARS)},
        "revenue": {
            str(y): {"bund": bund[i], "kanton": kanton[i], "gemeinde": gemeinde[i]}
            for i, y in enumerate(YEARS)
        },
        "lowest": tiefste[-1],    # 2018
        "highest": hoechste[-1],  # 2018
    }

    # Selbstpruefung gegen die publizierte Medienmitteilung (7.6.2019).
    assert counts[-1] == 4557, counts
    assert bund[-1] == 234 and kanton[-1] == 385 and gemeinde[-1] == 202
    assert pausch["lowest"] == 10000 and pausch["highest"] == 11967953
    total_2018 = bund[-1] + kanton[-1] + gemeinde[-1]
    assert total_2018 == 821, total_2018  # CHF 821 Mio. (MM-Text)

    with open(OUT, "w") as fh:
        json.dump(pausch, fh, indent=1)
    print(f"  [OK ] pauschal.json — 2018: {counts[-1]} Personen, "
          f"Ertrag {total_2018} Mio. CHF (Bund {bund[-1]}+Kanton {kanton[-1]}+Gemeinde {gemeinde[-1]})")


if __name__ == "__main__":
    main()
