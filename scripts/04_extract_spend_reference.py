#!/usr/bin/env python3
"""
04 — Bezugsgrössen für das «Was tun mit dem Geld?»-Modul -> src/data/spend_reference.json

Diese Makrozahlen sind reine Einordnungsgrössen (Nenner für anschauliche Vergleiche),
nicht Teil des Steuermodells. Zwei Herkunftsarten, im Feld ``bezug`` ausgewiesen:

  - "skript"    Ständige Wohnbevölkerung: live aus dem BFS-PXWeb-Cube
                px-x-0102020000_101 «Demografische Bilanz nach Kanton»
                (data/raw/bfs/population.json, Bestand 31.12., Schweiz-Total).
  - "kuratiert" EFV- und BAG-Aggregate: als belegte Konstanten unten gepflegt.
                Begründung: für diese Einzelwerte gibt es keine stabile, eindeutige
                maschinenlesbare Einzelquelle (FS-Klassifikationscodes bzw. BAG-
                T-Tabellen); der Bezug ist als Runbook in docs/QUELLEN.md §5 notiert.

Verwendung: bash scripts/fetch_sources.sh (lädt u. a. die BFS-Antwort), dann
python3 scripts/04_extract_spend_reference.py.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BFS = os.path.join(ROOT, "data", "raw", "bfs", "population.json")
OUT = os.path.join(ROOT, "src", "data", "spend_reference.json")


def fail(msg):
    print(f"  [FAIL] {msg}", file=sys.stderr)
    sys.exit(1)


def bfs_population():
    """(Wert, Jahr) der ständigen Wohnbevölkerung aus der BFS-PXWeb-Antwort."""
    if not os.path.exists(BFS):
        fail(f"BFS-Datei fehlt: {BFS} — zuerst `bash scripts/fetch_sources.sh`.")
    d = json.load(open(BFS, encoding="utf-8"))
    value = round(d["value"][0])
    jahr = int(next(iter(d["dimension"]["Jahr"]["category"]["label"].values())))
    if not 8_000_000 <= value <= 10_000_000:
        fail(f"BFS-Bevölkerung unplausibel: {value}")
    return value, jahr


# Kuratierte Bezugsgrössen (belegt; siehe docs/QUELLEN.md §5). Bei neuem Jahrgang hier
# aktualisieren – Jahr/Quelle mitführen.
CURATED = {
    "einkommenssteuer_np_alle_ebenen": {
        # Beleg: EFV-Finanzstatistik, "Einnahmen nach Arten – Bund/Kantone/Gemeinden"
        # (bund_ktn_gdn-d.xlsx, Blatt "einnahmen"), Artencode 4000 = 62 717 546 Tsd. (2023).
        "value": 62700000000,
        "label": "Einkommenssteuern natürlicher Personen (Bund + Kantone + Gemeinden)",
        "jahr": 2023, "einheit": "CHF/Jahr", "source": "efv",
    },
    "direkte_bundessteuer_np": {
        # Beleg: ESTV "Fiskaleinnahmen des Bundes 2023", Blatt "DBST neu ab 2023 (Soll)",
        # Summe Zeile "Fiskalertrag NP" = 13 407 Mio. (2023).
        "value": 13500000000,
        "label": "Direkte Bundessteuer natürlicher Personen",
        "jahr": 2023, "einheit": "CHF/Jahr", "source": "efv",
    },
    "okp_praemien": {
        # Beleg: BAG, Kostenoptik 2023 — "rund 36 Mrd. … durch Prämien finanziert".
        "value": 36000000000,
        "label": "Krankenkassenprämien (OKP, von Versicherten finanziert)",
        "jahr": 2023, "einheit": "CHF/Jahr", "source": "bag",
    },
    "okp_leistungen": {
        # Beleg: BAG, Kostenoptik 2023 — von 95 Mrd. Gesundheitskosten "rund 52 Mrd." OKP.
        # (Andere Abgrenzung als STATKV-Bruttoleistungen ~39,9 Mrd.; siehe QUELLEN.md §5.)
        "value": 52100000000,
        "label": "OKP-Leistungen total",
        "jahr": 2023, "einheit": "CHF/Jahr", "source": "bag",
    },
    "staatsschuld_maastricht": {
        # Beleg: EFV «Öffentliche Finanzen der Schweiz 2023-2024», Schuldenkennzahlen
        # des Staatssektors: Maastricht-Schuld 2023 = 214,2 Mrd. CHF (Maastricht-
        # Schuldenquote 26,9 %). Konsolidierte Bruttoschuld des Gesamtstaats (Bund,
        # Kantone, Gemeinden, Sozialversicherungen) nach EU-Maastricht-Definition.
        # Bestandsgrösse (Schuldenstand per Jahresende), nicht Jahresfluss.
        "value": 214200000000,
        "label": "Staatsschuld (Maastricht-Definition; Bund, Kantone, Gemeinden, Sozialversicherungen)",
        "jahr": 2023, "einheit": "CHF", "source": "efv",
    },
}


def main():
    pop_value, pop_jahr = bfs_population()
    kennzahlen = {
        "population": {
            "value": pop_value, "label": "Ständige Wohnbevölkerung",
            "jahr": pop_jahr, "einheit": "Personen", "source": "bfs", "bezug": "skript",
        },
    }
    for key, v in CURATED.items():
        kennzahlen[key] = {**v, "bezug": "kuratiert"}

    out = {
        "hinweis": ("Einordnungsgrössen für das «Was tun mit dem Geld?»-Modul, reine "
                    "Bezugsgrössen, nominal, gerundet. Bevölkerung live aus BFS-PXWeb "
                    "(bezug=skript); EFV-/BAG-Aggregate belegte Konstanten "
                    "(bezug=kuratiert, Runbook in docs/QUELLEN.md §5)."),
        "kennzahlen": kennzahlen,
    }
    with open(OUT, "w") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2)
    print(f"  [OK ] spend_reference.json — BFS-Bevölkerung {pop_value:,} ({pop_jahr}, live); "
          f"{len(CURATED)} kuratierte EFV/BAG-Grössen")


if __name__ == "__main__":
    main()
