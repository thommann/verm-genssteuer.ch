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
6. **Pauschalbesteuerung** — der statistische blinde Fleck an der Spitze (FDK).
7. **Quellen & Methodik** — alle Quellen, transparent verlinkt.

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

Alle Daten unter `src/data/*.json` wurden aus drei Original-Workbooks extrahiert.
Die Extraktions-Skripte liegen in `scripts/` (Python + `openpyxl`):

| Skript | Inhalt |
| --- | --- |
| `01_extract_calculator.py` | Tarif-Engine, Jahresparameter, **Validierung** des Aufkommens |
| `02_extract_distribution_wid.py` | ESTV-Verteilung, berechnete Kennzahlen, WID-Zeitreihen |
| `03_extract_projektion.py` | Kohorten der dynamischen Hochrechnung, **Validierung** |

### Validierung des Steuermodells

`src/lib/taxModel.js` bildet den Excel-Rechner exakt nach. Mit den Default-Parametern
reproduziert es die im Workbook publizierten Werte auf die letzte Stelle:

- Statisches Aufkommen: **76,0512 / 91,1598 / 91,5437 Mrd. CHF** (2020/21/22)
- Dynamische Projektion: **92,30 → 23,87 Mrd. CHF** (2022 → 2032)
- Kalibrierter Basis-Satz `0,00257231`, Cap-Grenze bei `3 770 402 679 CHF`

## Quellen

- **ESTV** — Gesamtschweizerische Vermögenssteuerstatistik 2012–2022
- **WID.world** — net personal wealth (`shwealj992`), 1995–2024
- **UBS** Global Wealth Report 2025 — Vermögens-Gini
- **FDK** — Erhebung zur Aufwandbesteuerung (Stand 31.12.2018)
- **EFV/ESTV, BAG, BFS** — Bezugsgrössen für das «Was tun»-Modul

Vollständige Angaben und Hinweise in `src/data/sources.json` bzw. im Abschnitt
*Quellen & Methodik* der Seite.

## Methodische Ehrlichkeit

Das Modell ist **statisch**: keine Abwanderung, kein Verhalten, kein Vermögenszuwachs.
Es zeigt das *Potenzial der Bemessungsgrundlage*, keine Einnahmeprognose. Steuerbares
Vermögen (ESTV) ist nicht dasselbe wie Marktvermögen (WID/UBS) — Vergleiche sind
indikativ. Diese Hinweise stehen bewusst direkt an den jeweiligen Zahlen.
