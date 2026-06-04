#!/usr/bin/env python3
"""
Reproduktion & Validierung aller statistischen Verfahren der Seite.

Dieses Skript ist der ausführbare Beweis, dass die auf der Seite gezeigten Zahlen
exakt und reproduzierbar aus den ESTV-Klassendaten abgeleitet werden. Es liest
ausschliesslich die quellenbasierten Eingabedaten unter ``src/data/`` und rechnet
alles selbst nach, ohne Magie, ohne fest verdrahtete Ergebnisse.

Ausführen:
    python3 scripts/00_reproduce_statistics.py

Erwartete Ausgabe: alle Prüfungen «OK». Details siehe docs/METHODIK.md.

Eingaben (alle direkt aus den Primärquellen erzeugt, siehe scripts/01–03 + fetch_sources.sh):
    src/data/estv_distribution.json   ESTV-Klassendaten (Anzahl + Reinvermögen je Klasse/Jahr)
    src/data/calculator_params.json   Jahresparameter (f, N, alpha, x_max) + Tarif-Defaults
    src/data/calculator_bins.json     von 02_extract_estv.py erzeugte 170 Bins (Gegenprobe)
"""
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data")


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as fh:
        return json.load(fh)


DIST = load("estv_distribution.json")
PARAMS = load("calculator_params.json")
BINS_REF = load("calculator_bins.json")
COHORTS = load("projektion_cohorts.json")

failures = []


def check(name, ok, detail=""):
    status = "OK " if ok else "FAIL"
    print(f"  [{status}] {name}{(': ' + detail) if detail else ''}")
    if not ok:
        failures.append(name)


# ---------------------------------------------------------------------------
# (1) Populationsmodell: die 170 Bins exakt aus den ESTV-Parametern erzeugen
# ---------------------------------------------------------------------------
# 170 geometrisch gestufte Bins von 5 Mio. bis 50 Mrd.; Bandmitte = geometrisches Mittel.
NB, LO, HI, XMIN_TAIL = 170, 5e6, 5e10, 1e7
RATIO = (HI / LO) ** (1 / NB)
EDGES = [LO * RATIO ** i for i in range(NB + 1)]


def _cls(rows, lo, hi):
    for r in rows:
        if r["lo"] == lo and r["hi"] == hi:
            return r["values"]
    raise KeyError((lo, hi))


def population_bins(year):
    """Anzahl Personen je Bin: ESTV-Klassen 1–5 Mio. + (5–10 Mio. + Pareto-Tail)."""
    p = PARAMS["years"][str(year)]
    f, N, alpha, xmax = p["f5_10"], p["Ntail"], p["alpha"], p["xmax"]
    # ESTV-Klassen 1–5 Mio. (mid = mittleres Vermögen 2022), wie im Rechner-Bin-Modell.
    low = []
    for lo, hi in ((1e6, 2e6), (2e6, 3e6), (3e6, 5e6)):
        cnt_c = _cls(DIST["unb_counts"], lo, hi)
        wl_c = _cls(DIST["unb_wealth"], lo, hi)
        low.append({"lo": lo, "hi": hi, "mid": wl_c["2022"] / cnt_c["2022"], "cnt": cnt_c[str(year)]})
    out = []
    for i in range(NB):
        a, b = EDGES[i], EDGES[i + 1]
        cnt = 0.0
        # 5–10 Mio.: f Personen, gleichverteilt in der linearen Vermögensachse.
        lo5, hi5 = max(a, 5e6), min(b, 1e7)
        if hi5 > lo5:
            cnt += f * (hi5 - lo5) / 5e6
        # > 10 Mio.: Pareto P(X>x)=(10Mio/x)^alpha, N Personen, hart bei x_max gekappt.
        loT, hiT = max(a, XMIN_TAIL), min(b, xmax)
        if hiT > loT:
            cnt += N * ((XMIN_TAIL / loT) ** alpha - (XMIN_TAIL / hiT) ** alpha)
        out.append({"lo": a, "hi": b, "mid": math.sqrt(a * b), "cnt": cnt})
    return low + out


# ---------------------------------------------------------------------------
# (2) Steuermodell: Tarif, Kalibrierung, statisches Aufkommen
# ---------------------------------------------------------------------------
def make_tax(d):
    k = d["exponent"]
    kp = k + 1
    basis = d["basis"]
    wcap = d["schwelle"] * (d["cap"] / basis) ** (1 / k)

    def tax(W):
        if W <= d["schwelle"]:
            return 0.0
        if W <= wcap:
            return basis * d["schwelle"] / kp * ((W / d["schwelle"]) ** kp - 1)
        below = basis * d["schwelle"] / kp * ((wcap / d["schwelle"]) ** kp - 1)
        return below + d["cap"] * (W - wcap)

    return tax, basis, wcap


# ---------------------------------------------------------------------------
# (3) Verteilungs-Kennzahlen aus klassierten Daten
# ---------------------------------------------------------------------------
def column(rows, year):
    return [c["values"][str(year)] for c in rows]


def kennzahlen(counts_rows, wealth_rows, year):
    cnt = column(counts_rows, year)
    wl = column(wealth_rows, year)
    lo = [c["lo"] for c in counts_rows]
    hi = [c["hi"] for c in counts_rows]
    width = [c["width"] for c in counts_rows]
    N, W = sum(cnt), sum(wl)

    def percentile(p):
        """Lineare Interpolation in der Klasse: Wert(p)=Untergrenze+(p·N−kum)/Anzahl·Breite."""
        target, cum = p * N, 0
        for i in range(len(cnt)):
            if cum + cnt[i] >= target:
                if not width[i]:
                    return lo[i]
                return lo[i] + (target - cum) / cnt[i] * width[i]
            cum += cnt[i]
        return lo[-1]

    # Pareto-Index der offenen Top-Klasse aus dem Klassenmittel: alpha = m/(m−x_min).
    m = wl[-1] / cnt[-1]
    alpha = m / (m - lo[-1])

    # Gini, exakt zerlegt: zwischen Klassen (Brown) + innerhalb der Klassen.
    p = [c / N for c in cnt]
    s = [w / W for w in wl]
    X, Y = [0.0], [0.0]
    for i in range(len(cnt)):
        X.append(X[-1] + p[i])
        Y.append(Y[-1] + s[i])
    g_between = 1 - sum((X[i + 1] - X[i]) * (Y[i + 1] + Y[i]) for i in range(len(cnt)))
    within = 0.0
    for i in range(len(cnt)):
        if i == len(cnt) - 1:               # offene Top-Klasse: Pareto-Gini
            gk = 1 / (2 * alpha - 1)
        elif width[i] and (lo[i] + hi[i]):  # begrenzte Klasse: Gleichverteilung
            gk = (hi[i] - lo[i]) / (3 * (lo[i] + hi[i]))
        else:
            gk = 0.0
        within += p[i] * s[i] * gk

    return {
        "N": N, "W": W, "mean": W / N,
        "median": percentile(0.5), "p90": percentile(0.9), "p99": percentile(0.99),
        "alpha": alpha,
        "share_ge10M": wl[-1] / W,              # exakt (eigene Klasse)
        "share_ge1M": sum(wl[6:]) / W,          # exakt (Klassen ab 1 Mio.)
        "gini_between": g_between,
        "gini_refined": g_between + within,
    }


# ===========================================================================
print("== A. Populationsmodell & statisches Aufkommen (Rechner) ==")
tax, basis, wcap = make_tax(PARAMS["defaults"])
check("Basis-Satz kalibriert", abs(basis - 0.00257231435969066) < 1e-15,
      f"{basis:.14f}")
check("Cap-Grenze", abs(wcap - 3770402678.60894) < 1e-3, f"{wcap:.2f} CHF")
for year in (2020, 2021, 2022):
    gen = population_bins(year)
    key = f"cnt{year}"
    bin_err = max(abs(gen[i]["cnt"] - BINS_REF[i][key]) for i in range(len(BINS_REF)))
    rev = sum(b["cnt"] * tax(b["mid"]) for b in gen) / 1e9
    pub = PARAMS["published_revenue"][str(year)]
    check(f"Bins {year} == vorgerechnet", bin_err < 1e-3, f"max Abw. {bin_err:.6f} Personen")
    check(f"Aufkommen {year}", abs(rev - pub) < 1e-3, f"{rev:.4f} Mrd. (publiziert {pub:.4f})")

print("\n== A2. Dynamische Projektion (mechanisch, je Kohorte) ==")
# W(t+1) = W(t)·(1+r) − Steuer(W(t)); Aufkommen = Σ Anzahl · Steuer(W(t)).
r = PARAMS["defaults"]["rendite"]
W = [c["W0"] for c in COHORTS]
n = [c["anzahl"] for c in COHORTS]
proj = {}
for yr in range(2022, 2033):
    proj[yr] = sum(n[i] * tax(W[i]) for i in range(len(W))) / 1e9
    W = [max(0.0, W[i] * (1 + r) - tax(W[i])) for i in range(len(W))]
check("Projektion 2022 (Einmaleffekt)", abs(proj[2022] - 92.30) < 5e-2, f"{proj[2022]:.3f} Mrd.")
check("Projektion 2032 (tragbares Niveau)", abs(proj[2032] - 23.87) < 5e-2, f"{proj[2032]:.3f} Mrd.")

print("\n== B. Pareto-Tail (> 10 Mio.) ==")
for year in (2020, 2021, 2022):
    p = PARAMS["years"][str(year)]
    m = p["mean10"]
    alpha = m / (m - 1e7)
    check(f"alpha {year} aus Klassenmittel", abs(alpha - p["alpha"]) < 1e-6,
          f"alpha={alpha:.5f} (mean={m:,.0f})")

print("\n== C. Kennzahlen aus klassierten Daten (unbeschränkt 2022) ==")
k = kennzahlen(DIST["unb_counts"], DIST["unb_wealth"], 2022)
check("Median (lineare Interpolation)", abs(k["median"] - 45078) < 1, f"CHF {k['median']:,.0f}")
check("Anteil ≥ 10 Mio. (exakt)", abs(k["share_ge10M"] - 0.3659) < 5e-4, f"{k['share_ge10M']:.4f}")
check("Anteil ≥ 1 Mio. (exakt)", abs(k["share_ge1M"] - 0.7232) < 5e-4, f"{k['share_ge1M']:.4f}")

print("\n== D. Gini-Zerlegung (Validierung gegen offiziellen ESTV-Wert) ==")
g15 = kennzahlen(DIST["alle_counts"], DIST["alle_wealth"], 2015)
# Offizieller ESTV-Vermögens-Gini 2015 = 0,860; Workbook-Spanne 0,854 (Brown) .. 0,861.
check("Gini 2015 Brown (between)", abs(g15["gini_between"] - 0.854) < 2e-3,
      f"{g15['gini_between']:.4f}")
check("Gini 2015 verfeinert ≈ 0,860", abs(g15["gini_refined"] - 0.860) < 2e-3,
      f"{g15['gini_refined']:.4f}  (offiziell 0,860)")

print()
if failures:
    print(f"✗ {len(failures)} Prüfung(en) fehlgeschlagen: {failures}")
    sys.exit(1)
print("✓ Alle Prüfungen bestanden, Verfahren exakt und reproduzierbar.")
