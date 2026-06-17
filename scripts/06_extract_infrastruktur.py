#!/usr/bin/env python3
"""
06: Verkehrs-/Infrastrukturausgaben der oeffentlichen Hand -> src/data/infrastruktur.json

Zwei Herkunftsarten, im Feld ``bezug`` ausgewiesen:

  - "skript"    EFV-Finanzstatistik (FS-Modell), konsolidierter Sektor Staat
                (Bund + Kantone + Gemeinden + Sozialversicherungen). Aus der amtlichen
                Bulk-Datei ``fir_art_funk.csv`` (Finanzierungsrechnung nach Sachgruppen
                und Funktionen). Ausgaben = Sachgruppen-Klasse 3 (laufende Ausgaben) +
                Klasse 5 (Investitionsausgaben), brutto, je HRM2-Funktion.
                Funktionscodes: 61 = Strassenverkehr, 62 = Oeffentlicher Verkehr,
                63 = uebriger Verkehr, 64 = Nachrichtenuebermittlung, 68 = F&E Verkehr;
                "V1" = Gesamttotal aller Funktionen (Kontrollwert).
                fetch_sources.sh laedt den (nach Sektor "staat" gefilterten) Anfang der
                Datei nach data/raw/efv/efv_funk_verkehr_staat.csv.

  - "kuratiert" NAF und BIF (Sonderrechnungen des Bundes) aus der EFV-Staatsrechnung 2024.
                Als belegte Konstanten gepflegt (keine stabile maschinenlesbare Einzel-
                quelle; Tabellenpositionen in docs/QUELLEN.md dokumentiert).

Verwendung: bash scripts/fetch_sources.sh, dann python3 scripts/06_extract_infrastruktur.py
"""
import csv
import os
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "raw", "efv", "efv_funk_verkehr_staat.csv")
OUT = os.path.join(ROOT, "src", "data", "infrastruktur.json")

# Ausgewiesene Jahre (das aktuellste plus eine kurze Zeitreihe).
JAHRE = [str(j) for j in range(2015, 2024)]


def fail(msg):
    print(f"  [FAIL] {msg}", file=sys.stderr)
    sys.exit(1)


def aggregate():
    """Summe der Ausgaben (Klasse 3 + 5) je (Funktion, Jahr), Sektor staat, Modell fs."""
    if not os.path.exists(SRC):
        fail(f"EFV-Datei fehlt: {SRC}; zuerst `bash scripts/fetch_sources.sh`.")
    # funk -> jahr -> Summe
    agg = defaultdict(lambda: defaultdict(float))
    with open(SRC, encoding="utf-8") as fh:
        for row in csv.reader(fh):
            if len(row) < 7:
                continue
            arten, funk, jahr, value, hh, _unit, model = row[:7]
            if hh != "staat" or model != "fs" or not value:
                continue
            if not arten or arten[0] not in ("3", "5"):
                continue
            try:
                agg[funk][jahr] += float(value)
            except ValueError:
                continue
    if not agg:
        fail("Keine Datenzeilen aggregiert (Format/Filter pruefen).")
    return agg


def build_verkehr(agg):
    out = {}
    for jahr in JAHRE:
        strasse = agg["61"].get(jahr)
        oev = agg["62"].get(jahr)
        if strasse is None or oev is None:
            continue
        uebrige = agg["63"].get(jahr, 0.0)
        nachrichten = agg["64"].get(jahr, 0.0)
        fe = agg["68"].get(jahr, 0.0)
        verkehr_total = strasse + oev + uebrige + nachrichten + fe  # HRM2-Gruppe 6
        total = agg.get("V1", {}).get(jahr)
        if total is None:
            # Fallback: Summe der zweistelligen Funktions-Leaves (ohne Kontrollzeile V1).
            total = sum(v.get(jahr, 0.0) for f, v in agg.items()
                        if len(f) == 2 and f.isdigit())
        # Validierung: Total = Summe der Leaves (V1 ist der amtliche Kontrollwert).
        leaves = sum(v.get(jahr, 0.0) for f, v in agg.items()
                     if len(f) == 2 and f.isdigit())
        if abs(leaves - total) / total > 0.001:
            fail(f"{jahr}: Total {total:.0f} != Summe Leaves {leaves:.0f} (Aggregation gebrochen)")
        out[jahr] = {
            "strasse": round(strasse),
            "oev": round(oev),
            "uebrige": round(uebrige),
            "nachrichten": round(nachrichten),
            "fe": round(fe),
            "verkehr_total": round(verkehr_total),
            "staat_total": round(total),
            "verkehr_anteil": round(verkehr_total / total, 4),
        }
    if "2023" not in out:
        fail("Jahr 2023 fehlt im Ergebnis.")
    return out


def build_bildung(agg):
    """Bildungsausgaben Gesamtstaat = Summe der HRM2-Funktion 2 (alle Leaves 2x)."""
    out = {}
    for jahr in JAHRE:
        total = sum(v.get(jahr, 0.0) for f, v in agg.items()
                    if len(f) == 2 and f.isdigit() and f[0] == "2")
        staat = agg.get("V1", {}).get(jahr)
        if not total or not staat:
            continue
        out[jahr] = {"total": round(total), "anteil": round(total / staat, 4)}
    if "2023" not in out:
        fail("Bildung 2023 fehlt im Ergebnis.")
    return out


# Kuratierte Fondswerte (belegt; siehe docs/QUELLEN.md). EFV Staatsrechnung 2024.
NAF_2024 = {
    # SPEZ-F-DE.pdf, Ziff. 322 NAF, Erfolgsrechnung 2024 (Rechnung). Spalten 2023 R / 2024 VA / 2024 R.
    "total": 2646000000,
    "nationalstrassen": 2454000000,
    "betrieb": 454000000,
    "reservierte_mittel_bau": 1839000000,
    "agglomerationsverkehr": 191000000,
    "jahr": 2024, "einheit": "CHF/Jahr", "source": "efv_staatsrechnung", "bezug": "kuratiert",
}
BIF_2024 = {
    # SPEZ-F-DE.pdf, BIF, Erfolgsrechnung 2024 (Rechnung).
    "aufwand_total": 4808000000,
    "investitionen": 4138000000,
    "substanzerhalt": 3247000000,
    "ausbau": 874000000,
    "jahr": 2024, "einheit": "CHF/Jahr", "source": "efv_staatsrechnung", "bezug": "kuratiert",
}


def main():
    agg = aggregate()
    verkehr = build_verkehr(agg)
    bildung = build_bildung(agg)
    j = "2023"
    v = verkehr[j]
    # Plausibilitaet der amtlichen Kontrollwerte.
    if not 240e9 <= v["staat_total"] <= 265e9:
        fail(f"Total Staat {j} unplausibel: {v['staat_total']}")
    if not 18e9 <= v["verkehr_total"] <= 21e9:
        fail(f"Verkehr total {j} unplausibel: {v['verkehr_total']}")
    if not 35e9 <= bildung[j]["total"] <= 55e9:
        fail(f"Bildung total {j} unplausibel: {bildung[j]['total']}")

    out = {
        "hinweis": ("Ausgaben der oeffentlichen Hand nach Funktion. verkehr und bildung: "
                    "EFV-Finanzstatistik (FS-Modell), konsolidierter Sektor Staat (Bund + "
                    "Kantone + Gemeinden + Sozialversicherungen), Ausgaben = Sachgruppe 3 + 5, "
                    "brutto, je HRM2-Funktion (skriptbasiert aus fir_art_funk.csv; Verkehr = "
                    "Gruppe 6, Bildung = Gruppe 2). naf/bif: EFV-Staatsrechnung 2024, belegte "
                    "Konstanten (kuratiert). Beträge nominal in CHF/Jahr. Details: docs/QUELLEN.md."),
        "verkehr": {
            "einheit": "CHF/Jahr", "bezug": "skript", "source": "efv", "jahre": verkehr,
        },
        "bildung": {
            "einheit": "CHF/Jahr", "bezug": "skript", "source": "efv", "jahre": bildung,
        },
        "naf_2024": NAF_2024,
        "bif_2024": BIF_2024,
    }
    with open(OUT, "w") as fh:
        import json
        json.dump(out, fh, ensure_ascii=False, indent=2)
    print(f"  [OK ] infrastruktur.json: {j} Strasse {v['strasse']/1e9:.2f} Mrd, "
          f"oeV {v['oev']/1e9:.2f} Mrd, Verkehr total {v['verkehr_total']/1e9:.2f} Mrd "
          f"({v['verkehr_anteil']*100:.1f}%), Bildung {bildung[j]['total']/1e9:.2f} Mrd "
          f"({bildung[j]['anteil']*100:.1f}%); {len(verkehr)} Jahre; NAF/BIF 2024 kuratiert")


if __name__ == "__main__":
    main()
