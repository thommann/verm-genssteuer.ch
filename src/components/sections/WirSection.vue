<script setup>
// Statischer Vorstellungs-/Vergleichsabschnitt zu den beiden World Inequality Reports,
// die die Steuermodell-Presets des Rechners speisen. Reine Inhalts-/Link-Sektion.
const VIDEO_URL = 'https://www.youtube.com/watch?v=4jRnYfigc3I';
</script>

<template>
  <section id="wir-reports">
    <div class="wrap">
      <div class="eyebrow">World Inequality Report</div>
      <h2>Woher die Steuermodelle stammen: WIR&nbsp;2022 &amp; 2026</h2>
      <p class="lead">
        Das <strong>World Inequality Lab</strong> (u.&nbsp;a. Thomas Piketty, Lucas Chancel,
        Gabriel Zucman) führt die umfassendste Datenbank zur globalen Vermögens- und
        Einkommensverteilung. Zwei Ausgaben seines Flaggschiff-Reports liefern die Vorlagen
        für die WIR-Presets im Rechner und schlagen dabei <strong>zwei unterschiedliche
        Steuer-Designs</strong> vor.
      </p>

      <div class="grid cmp">
        <div class="card wir">
          <div class="wir-head">
            <span class="badge gold">2022</span>
            <h3>Progressive Staffel</h3>
          </div>
          <p class="wir-sub">Drei Szenarien (moderat&nbsp;/ hoch&nbsp;/ sehr&nbsp;hoch)</p>
          <ul>
            <li>Grenzsätze von <strong>1&nbsp;%</strong> ab 1&nbsp;Mio. steigend bis
              <strong>3,5&nbsp;/ 10&nbsp;/ 90&nbsp;%</strong> über 100&nbsp;Mrd.&nbsp;$.</li>
            <li>Ertrag je nach Szenario <strong>1,6&nbsp;bis 5,3&nbsp;%</strong> des globalen
              Einkommens.</li>
            <li>Sechs Vermögensbänder mit je eigenem Grenzsatz (Tabelle&nbsp;7.2).</li>
          </ul>
          <a class="btn btn-ghost" :href="'https://wir2022.wid.world'" target="_blank" rel="noopener">
            wir2022.wid.world ↗
          </a>
        </div>

        <div class="card wir">
          <div class="wir-head">
            <span class="badge teal">2026</span>
            <h3>Flache Mindeststeuer</h3>
          </div>
          <p class="wir-sub">3.&nbsp;Ausgabe (nach 2018 &amp; 2022), nach Zucman&nbsp;/ G20</p>
          <ul>
            <li>Neuer Befund: Milliardäre zahlen effektiv nur <strong>~20&nbsp;% ihres
              Einkommens</strong> an Steuern, <strong>weniger</strong> als Haushalte mit
              tieferem Einkommen (regressiv).</li>
            <li>Antwort: Mindeststeuer <strong>2&nbsp;/ 3&nbsp;/ 5&nbsp;%</strong> auf
              Centi-Millionäre&nbsp;und&nbsp;Milliardäre.</li>
            <li>2&nbsp;% auf Milliardäre ≈ <strong>200&nbsp;bis&nbsp;250&nbsp;Mrd.&nbsp;$</strong> pro Jahr.</li>
          </ul>
          <a class="btn btn-ghost" :href="'https://wir2026.wid.world'" target="_blank" rel="noopener">
            wir2026.wid.world ↗
          </a>
        </div>
      </div>

      <p class="shift">
        <strong>Was sich geändert hat:</strong> 2022 schlägt einen progressiven Mehrband-Tarif
        vor, 2026 eine <strong>flache Mindeststeuer</strong> auf Centi-Millionäre und Milliardäre,
        aufbauend auf Zucman&nbsp;(2024), den die brasilianische G20-Präsidentschaft 2024 auf die
        Agenda setzte. Laut WIR&nbsp;2026 «neutralisiert» bereits ein Satz von 2&nbsp;% die
        Regressivität an der Spitze. Beide Modelle kannst du
        <a href="#rechner">im Rechner</a> als Presets durchprobieren.
      </p>

      <a class="videocard card" :href="VIDEO_URL" target="_blank" rel="noopener">
        <span class="play" aria-hidden="true">▶</span>
        <span class="vtext">
          <span class="vlabel">Video · Gary's Economics mit Gabriel Zucman</span>
          <span class="vtitle">«The economist billionaires fear: this is how we get a wealth tax»</span>
          <span class="vhint">youtube.com ↗</span>
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.cmp { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin: 28px 0 24px; }
.wir { padding: 24px 26px; display: flex; flex-direction: column; gap: 10px; }
.wir-head { display: flex; align-items: center; gap: 12px; }
.wir-head h3 { margin: 0; }
.badge {
  font-size: 0.82rem; font-weight: 800; padding: 3px 10px; border-radius: 999px;
  color: #1a1400; letter-spacing: 0.02em;
}
.badge.gold { background: var(--gold); }
.badge.teal { background: var(--teal); }
.wir-sub { color: var(--text-soft); font-size: 0.9rem; margin: 0; font-weight: 600; }
.wir ul { margin: 6px 0 4px; padding-left: 18px; color: var(--text-soft); font-size: 0.92rem; }
.wir li { margin-bottom: 8px; }
.wir strong { color: var(--text); }
.btn-ghost {
  align-self: flex-start; margin-top: auto; padding: 8px 14px; font-size: 0.85rem;
  border: 1px solid var(--border); background: rgba(255, 255, 255, 0.05); color: var(--text);
  border-radius: 10px; transition: border-color 0.15s ease;
}
.btn-ghost:hover { border-color: var(--accent); text-decoration: none; }

.shift {
  font-size: 0.95rem; line-height: 1.6; color: var(--text-soft); max-width: 74ch;
  padding: 16px 18px; border-radius: 12px;
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid var(--border); border-left: 3px solid var(--violet);
}
.shift strong { color: var(--text); }

.videocard {
  display: flex; align-items: center; gap: 18px; padding: 18px 22px; margin-top: 22px;
  text-decoration: none; color: inherit; transition: border-color 0.15s ease, transform 0.15s ease;
}
.videocard:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
.play {
  flex: none; width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center; font-size: 1.1rem; color: #1a0008;
  background: var(--accent); padding-left: 3px;
}
.vtext { display: flex; flex-direction: column; gap: 3px; }
.vlabel { color: var(--accent-soft); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.02em; }
.vtitle { color: var(--text); font-weight: 700; font-size: 1rem; }
.vhint { color: var(--text-mute); font-size: 0.78rem; }
</style>
