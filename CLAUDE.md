# CLAUDE.md

## Commit- und PR-Konventionen

- **Keine** `Co-Authored-By`-Zeilen (z. B. `Co-Authored-By: Claude`) in Commit-Messages.
- **Keine** Session-URLs oder Links (z. B. `https://claude.ai/code/...`) in Commit-Messages, PR-Beschreibungen, PR-Titeln, Issue-Kommentaren oder Code-Kommentaren.
- **Keine** "Generated with"-, "🤖"- oder ähnlichen Tool-/Attributions-Hinweise irgendwo in committeten Artefakten.
- Commit-Messages und PR-Beschreibungen sollen nur den fachlichen Inhalt der Änderung beschreiben.
- **Alle** Commits müssen als `Thomas <34217413+thommann@users.noreply.github.com>` ausgeführt werden. Vor jedem Commit sicherstellen, dass `git config user.name "Thomas"` und `git config user.email "34217413+thommann@users.noreply.github.com"` gesetzt sind (notfalls per `-c user.name=... -c user.email=...` am Commit übergeben). Es darf kein anderer Autor oder Committer auftauchen.

## Text- und Schreibkonventionen

- **Keine** Gedankenstriche (`–`/`—`) als stilistische Pause oder Einschub in Texten (Website-Copy, Kommentare, Datentexte). Stattdessen Komma, Doppelpunkt, Semikolon oder zwei Sätze verwenden.
- **Erlaubt** bleibt der Bis-Strich (`–`) in echten Zahlen- und Jahresbereichen (z. B. `2012–2022`, `1–5 Mio.`, `2–5 %`, `0–1`) sowie in offiziellen Eigennamen/Bezeichnungen, wo der Strich Teil des Namens ist.
- **Nie** das deutsche Eszett (`ß`) verwenden. Immer das Schweizer Doppel-s (`ss`) schreiben, z. B. „grösste", „Schluss", „Strasse".
