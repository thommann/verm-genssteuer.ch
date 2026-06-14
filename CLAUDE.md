# CLAUDE.md

## Commit- und PR-Konventionen

- **Keine** `Co-Authored-By`-Zeilen (z. B. `Co-Authored-By: Claude`) in Commit-Messages.
- **Keine** Session-URLs oder Links (z. B. `https://claude.ai/code/...`) in Commit-Messages, PR-Beschreibungen, PR-Titeln, Issue-Kommentaren oder Code-Kommentaren.
- **Keine** "Generated with"-, "🤖"- oder ähnlichen Tool-/Attributions-Hinweise irgendwo in committeten Artefakten.
- Commit-Messages und PR-Beschreibungen sollen nur den fachlichen Inhalt der Änderung beschreiben.
- **Alle** Commits müssen als `thommann <thomas@mannhart.ai>` ausgeführt werden. Vor jedem Commit sicherstellen, dass `git config user.name "thommann"` und `git config user.email "thomas@mannhart.ai"` gesetzt sind (notfalls per `-c user.name=... -c user.email=...` am Commit übergeben). Es darf kein anderer Autor oder Committer auftauchen.

## Text- und Schreibkonventionen

- **Keine** Gedankenstriche (`–`/`—`) als stilistische Pause oder Einschub in Texten (Website-Copy, Kommentare, Datentexte). Stattdessen Komma, Doppelpunkt, Semikolon oder zwei Sätze verwenden.
- **Erlaubt** bleibt der Bis-Strich (`–`) in echten Zahlen- und Jahresbereichen (z. B. `2012–2022`, `1–5 Mio.`, `2–5 %`, `0–1`) sowie in offiziellen Eigennamen/Bezeichnungen, wo der Strich Teil des Namens ist.
- **Nie** das deutsche Eszett (`ß`) verwenden. Immer das Schweizer Doppel-s (`ss`) schreiben, z. B. „grösste", „Schluss", „Strasse".

## Quellen-Konventionen

Jede Zahl, Aussage oder Schätzung auf der Seite muss belegt, deklariert und dokumentiert sein. Bei jeder neuen oder geänderten Quelle gilt:

- **Deklarieren in `src/data/sources.json`:** Jede Quelle bekommt einen Eintrag mit allen Feldern (`id`, `kurz`, `titel`, `herausgeber`, `url`, `stand`, `hinweis`). Keine fehlenden Felder, gleiches Schema wie die bestehenden Einträge.
- **Im UI referenzieren:** Jeder Datenpunkt trägt einen `<SourceTag id="…" />`, dessen `id` exakt auf einen Eintrag in `sources.json` zeigt. Keine toten oder erfundenen `id`s.
- **Im `hinweis` belegen:** Der `hinweis` nennt die konkreten Zahlen, den Bezugszeitraum und, wo eine Kennzahl berechnet wird, die Rechenformel, damit die Aussage nachprüfbar ist.
- **Links vor Aufnahme prüfen:** Jede `url` muss erreichbar sein (HTTP 200) und auf die zitierte Stelle führen. **Nie** Quellen erfinden oder Platzhalter einsetzen.
- **Im Runbook dokumentieren:** Jede UI-Sektion ist in der Audit-Tabelle in [`docs/QUELLEN.md`](docs/QUELLEN.md) mit ihren Quellen-`id`s geführt. Liefert eine Quelle eine reproduzierbare Datendatei, wird sie zusätzlich im passenden Abschnitt von `QUELLEN.md` mit Beschaffungsweg dokumentiert (siehe Pipeline-Skripte in `scripts/`).
- **Jeder Datenzugriff ist exakt und fetchbar dokumentiert:** Jede Zahl, die aus einer Quelle stammt, muss live von der Originalquelle beziehbar (fetchbar) und der Bezug exakt dokumentiert sein. Keine handgetippten Quellenzahlen als Konstanten im Code oder in Komponenten. Der Weg ist immer: `scripts/fetch_sources.sh` (Download nach `data/raw/`, SHA256 in `data/CHECKSUMS.txt`) → `scripts/NN_extract_*.py` (Extraktion) → `src/data/*.json` (von den Komponenten konsumiert). In `docs/QUELLEN.md` werden Download-URL, Zieldatei, Blatt/Tabelle und die exakte Zeilen-/Spaltenposition genannt, in `docs/METHODIK.md` die Rechenformel. Findet sich eine Quellenzahl, die diesen Weg nicht erfüllt, ist das ein Fehler: Pipeline und Dokumentation nachziehen, nicht die Zahl hartcodieren.

## Kampagnen-Aussagen (Startseite und Instagram)

Die Kampagne arbeitet mit kurzen Aussagen (z. B. „Der Grund für deinen sinkenden Lebensstandard ist die wachsende Ungleichheit."). Sie leben an zwei Orten, die **synchron** zu halten sind:

- **Startseite** (`/`): ein einziger Bereich (`src/components/sections/ClaimsSection.vue`) mit allen Aussagen als volle Bänder. Zuoberst die Hauptaussage (`#start`), darunter die übrigen Aussagen. Texte liegen in `src/i18n/locales/de.js` (`hero.*` für die Hauptaussage, `claims.items.*` für die übrigen), nicht im Template.
- **Instagram-Deck**: `marketing/instagram/slides.html` (datengetrieben: `MAIN`, `MAIN_BG`, `OTHERS`). Format 4:5, 1080 × 1350 px; Export per `node marketing/instagram/export.mjs` nach `marketing/instagram/out/` (nicht eingecheckt). Details im dortigen `README.md`.

Regeln:

- **Jede Aussage steht in beiden:** auf der Startseite (verlinkbarer Abschnitt mit eigener Anker-`id`) und im Instagram-Deck. Wird eine Aussage ergänzt, geändert oder entfernt, gilt das für beide Orte.
- **Gleicher Hintergrund:** Eine Aussage trägt auf der Startseite denselben Verlauf (`--g1..--g4`) wie ihre Slide. Farben an beiden Orten abgleichen.
- **Interner Erklär-Link:** Unter jeder Aussage auf der Startseite ein Link zur Erklärung (Themenseite + Anker), der auf einen real existierenden Abschnitt zeigt.
- **Hauptaussage:** erscheint im Deck als jeder zweite Post mit wechselndem Hintergrund (Varianten A–L) und steht auf der Startseite zuoberst (`#start`).
- **Belege gelten weiter:** Sobald eine Aussage eine konkrete Zahl zeigt, braucht sie einen `<SourceTag>` bzw. eine Quellenzeile gemäss den Quellen-Konventionen oben.
