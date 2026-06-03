#!/usr/bin/env bash
#
# fetch_sources.sh — laedt ALLE Roh-Primaerquellen direkt von den Behoerden-/
# Herausgeber-Servern in data/raw/ und schreibt die SHA256-Pruefsummen.
#
# Damit ist der Live-Bezug ein einziger, nachvollziehbarer Befehl. Anschliessend
# erzeugen die Skripte 01-03 die JSON unter src/data/, 00 prueft alles nach.
#
#   bash scripts/fetch_sources.sh
#   python3 scripts/01_extract_fdk.py
#   python3 scripts/02_extract_estv.py
#   python3 scripts/03_extract_wid_ubs.py
#   python3 scripts/00_reproduce_statistics.py
#
# Quellen und exakte Bedeutung: docs/QUELLEN.md. Rechenverfahren: docs/METHODIK.md.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW="$ROOT/data/raw"
mkdir -p "$RAW/estv" "$RAW/wid" "$RAW/fdk" "$RAW/ubs"

ua='Mozilla/5.0 (compatible; verm-genssteuer-fetch/1.0)'
get() { # get <url> <zielpfad>
  echo "  -> $2"
  curl -fsSL --retry 4 --retry-delay 2 --max-time 180 -A "$ua" "$1" -o "$2"
}

echo "== 1/4  ESTV Vermoegenssteuerstatistik (Steuerjahre 2012-2022) =="
# Eidg. Steuerverwaltung, Seite: https://www.estv.admin.ch/de/gesamtschweizerische-vermoegenssteuerstatistik
get "https://www.estv.admin.ch/dam/de/sd-web/lhrrBohyrHqB/statistik-vermoegen-np-2012-de.xlsx" "$RAW/estv/estv-vermoegen-2012.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/MRc38oet0AL4/statistik-vermoegen-np-2013-de.xlsx" "$RAW/estv/estv-vermoegen-2013.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/XFai68q4kEdf/statistik-vermoegen-np-2014-de.xlsm" "$RAW/estv/estv-vermoegen-2014.xlsm"
get "https://www.estv.admin.ch/dam/de/sd-web/ntqjqoArif2u/statistik-vermoegen-np-2015-de.xlsm" "$RAW/estv/estv-vermoegen-2015.xlsm"
get "https://www.estv.admin.ch/dam/de/sd-web/AIwtHZqUR1tl/statistik-vermoegen-np-2016-de.xlsx" "$RAW/estv/estv-vermoegen-2016.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/RayMz2waAzTe/statistik-vermoegen-np-2017-de.xlsx" "$RAW/estv/estv-vermoegen-2017.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/UymBDbp5Npx0/statistik-vermoegen-np-2018-de.xlsx" "$RAW/estv/estv-vermoegen-2018.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/0gIHJdco8bIG/statistik-vermoegen-np-2019-de.xlsx" "$RAW/estv/estv-vermoegen-2019.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/DXH-Wy7LNBSy/statistik-vermoegen-np-2020-de.xlsx" "$RAW/estv/estv-vermoegen-2020.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/7iNdaQJEh7WA/statistik-vermoegen-np-2021-de.xlsx" "$RAW/estv/estv-vermoegen-2021.xlsx"
get "https://www.estv.admin.ch/dam/de/sd-web/nVRTVvGkR77Z/statistik-vermoegen-np-2022.xlsx"    "$RAW/estv/estv-vermoegen-2022.xlsx"

echo "== 2/4  WID.world — net personal wealth (shwealj992), Bulk pro Land =="
# World Inequality Lab: https://wid.world  (REST-API ist gesperrt -> Bulk-CSV ist die offizielle Quelle)
for iso in US CN CH FR DE GB SE JP IT ES IN RU BR WO; do
  get "https://wid.world/bulk_download/WID_data_${iso}.csv" "$RAW/wid/WID_data_${iso}.csv"
done

echo "== 3/4  FDK — Aufwandbesteuerung (Stand 31.12.2018) =="
# Konferenz der kant. Finanzdirektoren, Medienmitteilung 7.6.2019
get "https://www.fdk-cdf.ch/-/media/FDK_CDF/Dokumente/Themen/Steuerpolitik/Aufwandbesteuerung/190607_AufwBest_MM_FDK_DEF_D.pdf" "$RAW/fdk/fdk_aufwandbesteuerung_2019_D.pdf"

echo "== 4/4  UBS Global Wealth Report 2025 (Vermoegens-Gini) =="
# Kanonische Quelle (Form/Login): https://www.ubs.com/global/en/wealthmanagement/insights/global-wealth-report.html
# Der UBS-CDN antwortet auf automatisierte Requests mit 403; Direkt-PDF-Spiegel mit identischem
# Inhalt (Integritaet via data/CHECKSUMS.txt verifizierbar):
get "https://elements.visualcapitalist.com/wp-content/uploads/2025/08/global-wealth-report-09072025.pdf" "$RAW/ubs/ubs_gwr_2025.pdf"

echo
echo "== Pruefsummen =="
( cd "$RAW" && sha256sum estv/* wid/*.csv fdk/*.pdf ubs/*.pdf )
echo
echo "Fertig. Vergleiche bei Bedarf mit data/CHECKSUMS.txt."
