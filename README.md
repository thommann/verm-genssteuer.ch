# Vermögen & Steuern — Schweiz

Eine interaktive, quellenbasierte Vue-Anwendung, die die Schweizer Vermögensverteilung
sichtbar macht und eine **progressive Vermögenssteuer auf das reichste 1 %**
erlebbar/experimentierbar macht.

> Die Daten sind belegt und exakt aus den Originalquellen reproduziert.
> Die Schlussfolgerung ist politisch, die Zahlen sind es nicht.

## Was die Seite zeigt

1. **Verteilung** — wer in der Schweiz wie viel Vermögen besitzt (ESTV 2012–2022).
2. **Rechner** — baue per Regler deine eigene progressive Vermögenssteuer und sieh das
   Jahresaufkommen in Echtzeit (statisch, auf echten ESTV-Daten + Pareto-Tail).
3. **Was tun mit dem Geld?** — dieselben Einnahmen als
   *Einkommenssteuer-Senkung*, *Übernahme von Krankenkassenprämien* oder
   *Pro-Kopf-Dividende* — live aus dem Rechner.
4. **Dynamik** — ehrliche Hochrechnung: Einmaleffekt vs. dauerhaft tragbares Niveau.
5. **International** — Vermögenskonzentration im Zeitverlauf (WID) und im Ländervergleich (WID/UBS-Gini).
6. **WIR 2022 & 2026** — die Steuermodelle des World Inequality Report (progressive Staffel
   vs. Mindeststeuer), kurz verglichen und verlinkt; dazu der interaktive *Global Wealth Tax
   Simulator* und ein Video mit Gabriel Zucman. Beide Modelle sind im Rechner als Presets.
7. **UBS-Studie** — der UBS Global Wealth Report (vormals Credit Suisse): Vermögens-Gini
   im Ländervergleich, die Lücke zwischen Durchschnitts- und Median-Vermögen und die globale
   Vermögenspyramide.
8. **Pauschalbesteuerung** — der statistische blinde Fleck an der Spitze (FDK).
9. **Quellen & Methodik** — alle Quellen, transparent verlinkt.

## Stack

- **Vue 3** (`<script setup>`, Composition API) + **Vite**
- Eigene, abhängigkeitsfreie **SVG-Charts** (`LineChart`, `BarChart`)
- Reine, getestete Rechen-Logik in `src/lib/taxModel.js`
- Keine Laufzeit-Abhängigkeiten ausser Vue

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

## Datenherkunft & Reproduzierbarkeit

Alle Daten unter `src/data/*.json` werden **direkt aus den Primärquellen** erzeugt — kein
Zwischen-Workbook, keine Handarbeit. Die Skripte liegen in `scripts/` (Bash + Python mit
`openpyxl`; PDF-Quellen über `pdftotext`/`poppler-utils`):

| Skript | Inhalt |
| --- | --- |
| `fetch_sources.sh` | Lädt **alle Rohquellen** (ESTV-XLSX ×11, WID-CSV ×14, FDK-PDF, UBS-PDF, BFS-PXWeb) nach `data/raw/` und schreibt SHA256-Prüfsummen |
| `01_extract_fdk.py` | FDK-Medienmitteilung → `pauschal.json` (Anzahl/Ertrag Pauschalbesteuerte) |
| `02_extract_estv.py` | ESTV-Verteilung, Kennzahlen, Rechner-Parameter, 170 Bins, 30 Kohorten |
| `03_extract_wid_ubs.py` | WID-Zeitreihen + Ranking, UBS-Gini, Ø/Median, Vermögenspyramide |
| `04_extract_spend_reference.py` | BFS-Bevölkerung (live, PXWeb) + kuratierte EFV/BAG-Bezugsgrössen → `spend_reference.json` |
| `00_reproduce_statistics.py` | **Rechnet alle statistischen Verfahren unabhängig nach** und prüft sie (extern gegen den offiziellen ESTV-Gini, intern gegen die Skript-Ausgabe) |

Ausführliche Dokumentation:

- **[`docs/METHODIK.md`](docs/METHODIK.md)** — alle statistischen Verfahren exakt und
  reproduzierbar (Perzentil-Interpolation, Pareto-Tail, Gini-Zerlegung, Populationsmodell,
  Steuermodell) inkl. Validierungstabelle.
- **[`docs/QUELLEN.md`](docs/QUELLEN.md)** — Provenance-Runbook: woher jede Rohzahl stammt
  und wie man sie Schritt für Schritt von den Originalquellen beschafft (exakte URLs,
  Blatt-/Spaltenpositionen, Prüfsummen).

```bash
bash    scripts/fetch_sources.sh          # Rohdaten laden -> data/raw/
python3 scripts/01_extract_fdk.py
python3 scripts/02_extract_estv.py
python3 scripts/03_extract_wid_ubs.py
python3 scripts/04_extract_spend_reference.py
python3 scripts/00_reproduce_statistics.py   # erwartet: alle Prüfungen OK
```

Die Rohdateien (`data/raw/`) sind bewusst **nicht eingecheckt** (Umfang); ihre Integrität
ist über [`data/CHECKSUMS.txt`](data/CHECKSUMS.txt) belegt.

### Validierung des Steuermodells

`src/lib/taxModel.js` und das Prüfskript teilen sich dieselben Formeln. Mit den
Default-Parametern ergibt das Modell das Referenz-Aufkommen reproduzierbar:

- Statisches Aufkommen: **76,0512 / 91,1598 / 91,5437 Mrd. CHF** (2020/21/22)
- Dynamische Projektion: **92,30 → 23,87 Mrd. CHF** (2022 → 2032)
- Kalibrierter Basis-Satz `0,00257231`, Cap-Grenze bei `3 770 402 679 CHF`

## Quellen

- **ESTV** — Gesamtschweizerische Vermögenssteuerstatistik 2012–2022
- **WID.world** — net personal wealth (`shwealj992`), 1995–2024
- **UBS** Global Wealth Report 2025 — Vermögens-Gini
- **World Inequality Report 2022 & 2026** — Steuermodelle (Rechner-Presets, WIR-Abschnitt)
- **FDK** — Erhebung zur Aufwandbesteuerung (Stand 31.12.2018)
- **EFV/ESTV, BAG, BFS** — Bezugsgrössen für das «Was tun»-Modul

Vollständige Angaben und Hinweise in `src/data/sources.json` bzw. im Abschnitt
*Quellen & Methodik* der Seite.

## Methodische Ehrlichkeit

Das Modell ist **statisch**: keine Abwanderung, kein Verhalten, kein Vermögenszuwachs.
Es zeigt das *Potenzial der Bemessungsgrundlage*, keine Einnahmeprognose. Steuerbares
Vermögen (ESTV) ist nicht dasselbe wie Marktvermögen (WID/UBS) — Vergleiche sind
indikativ. Diese Hinweise stehen bewusst direkt an den jeweiligen Zahlen.
