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
- **vue-i18n** für die zentrale Textverwaltung (alle Oberflächentexte über Schlüssel)
- Eigene, abhängigkeitsfreie **SVG-Charts** (`LineChart`, `BarChart`)
- Reine, getestete Rechen-Logik in `src/lib/taxModel.js`
- Schlanke Laufzeit-Abhängigkeiten: nur Vue und vue-i18n

## Texte & i18n

Sämtliche sichtbaren Texte der Oberfläche liegen zentral in einer Locale-Datei und
werden in den Komponenten nur noch über Schlüssel referenziert; kein deutscher Text
steht mehr direkt im Template oder Skript.

- Zentrale Texte: [`src/i18n/locales/de.js`](src/i18n/locales/de.js) (nach Abschnitten
  gruppiert: `nav`, `hero`, `calculator`, `spend`, …).
- Einrichtung: [`src/i18n/index.js`](src/i18n/index.js) richtet `vue-i18n` ein
  (Composition API, `globalInjection`), eingebunden in `src/main.js`.
- Nutzung in Templates: `{{ $t('hero.eyebrow') }}` bzw. mit Werten
  `{{ $t('spend.title', { revenue }) }}`. In `<script setup>` über `const { t } = useI18n()`.
- Texte mit Inline-Markup (`<strong>`, Links, `&nbsp;`) werden per `v-html="$t(...)"`
  gerendert; Platzhalter (`{name}`) füllen die bereits formatierten Zahlenwerte.

Eine weitere Sprache lässt sich ergänzen, indem man eine zusätzliche Locale-Datei
(z. B. `src/i18n/locales/fr.js`) mit denselben Schlüsseln anlegt und in
`src/i18n/index.js` registriert. Datenbezogene Texte (Quellenangaben in
`src/data/sources.json`, Ländernamen als Datenschlüssel) bleiben bewusst bei den Daten.
Reine Zahlenformatierung (CHF/%/Mio.) liegt weiterhin in `src/lib/format.js` (`de-CH`).

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
