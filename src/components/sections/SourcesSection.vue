<script setup>
import sources from '@/data/sources.json';
</script>

<template>
  <section id="quellen" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">Transparenz</div>
      <h2>Quellen &amp; Methodik</h2>
      <p class="lead">
        Alle Kernzahlen stammen aus offiziellen, öffentlich zugänglichen Statistiken.
        Die Berechnungen sind nachvollziehbar und reproduzieren die zugrunde liegenden
        Workbooks exakt. Nichts ist erfunden – die Schlussfolgerung ist politisch, die Daten nicht.
      </p>

      <div class="src-list">
        <a v-for="s in sources" :key="s.id" :href="s.url" target="_blank" rel="noopener" class="src card">
          <div class="src-head">
            <span class="src-kurz">{{ s.kurz }}</span>
            <span class="pill">{{ s.stand }}</span>
          </div>
          <div class="src-titel">{{ s.titel }}</div>
          <div class="src-hg">{{ s.herausgeber }}</div>
          <div v-if="s.hinweis" class="src-hinweis">{{ s.hinweis }}</div>
          <div class="src-url">{{ s.url }} ↗</div>
        </a>
      </div>

      <div class="method card">
        <h3>Methodische Ehrlichkeit</h3>
        <ul>
          <li>
            <strong>Steuerbares Vermögen ≠ Marktvermögen.</strong> Die ESTV-Daten enthalten keine
            2./3. Säule und bewerten Liegenschaften zum Steuerwert – das reale Vermögen der
            Spitze ist eher noch höher.
          </li>
          <li>
            <strong>Statisches Aufkommen.</strong> Der Rechner ignoriert Abwanderung, Verhalten
            und Vermögensentstehung – die grössten realen Unsicherheiten. Er zeigt das Potenzial
            der Bemessungsgrundlage, keine Einnahmeprognose.
          </li>
          <li>
            <strong>Pareto-Tail.</strong> Vermögen über 10&nbsp;Mio. werden mit einem Pareto-Index
            aus den ESTV-Klassenmitteln extrapoliert; Pauschalbesteuerte sind modellhaft im selben
            Tail angenommen.
          </li>
          <li>
            <strong>Verschiedene Bezugsgrössen.</strong> WID/UBS messen das gesamte Netto-Privatvermögen,
            die ESTV nur das steuerbare. Vergleiche sind indikativ, nicht zellengenau.
          </li>
          <li>
            <strong>WIR-Referenzmodelle (2022 &amp; 2026).</strong> Die Presets «WIR 2022» (progressive
            Grenzsatz-Staffel, Tabelle 7.2) und «WIR 2026» (flache Mindeststeuer von 2–5 % auf das
            Gesamtvermögen ab 100&nbsp;Mio. $, nach Zucman 2024 / G20) bilden die Steuermodelle des
            World Inequality Report exakt ab – über dedizierte Funktionen, nicht über die Potenzkurve.
            Übertragen wird die Satz-Struktur; die USD-Schwellen werden ohne Wechselkurs (≈&nbsp;Parität)
            in CHF behandelt, daher sind die CHF-Beträge nicht mit den globalen USD-Erträgen des Reports
            vergleichbar.
          </li>
        </ul>
      </div>

      <footer class="foot">
        <p class="muted">
          Erstellt direkt aus den Primärquellen (ESTV-Vermögenssteuerstatistik 2012–2022,
          WID/UBS-Vermögensverteilung, World Inequality Report 2022 &amp; 2026, FDK, EFV, BAG, BFS)
          über eine reproduzierbare Fetch- und Extraktions-Pipeline. Diese Seite ist ein
          unabhängiges, politisches Argument für eine Vermögenssteuer auf das reichste 1 %.
        </p>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.src-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 28px 0; }
.src { padding: 20px; text-decoration: none; color: inherit; transition: border-color 0.15s ease, transform 0.15s ease; display: block; }
.src:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
.src-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px; }
.src-kurz { font-weight: 800; color: var(--text); min-width: 0; overflow-wrap: anywhere; }
.src-head .pill { max-width: 100%; overflow-wrap: anywhere; }
.src-titel { font-size: 0.9rem; color: var(--text-soft); margin-bottom: 4px; }
.src-hg { font-size: 0.8rem; color: var(--text-mute); }
.src-hinweis { font-size: 0.8rem; color: var(--text-mute); margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.src-url { font-size: 0.76rem; color: var(--accent-soft); margin-top: 10px; word-break: break-all; }

.method { padding: 26px; margin-top: 8px; }
.method ul { margin: 12px 0 0; padding-left: 20px; color: var(--text-soft); }
.method li { margin-bottom: 12px; font-size: 0.92rem; }
.foot { margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); }
.foot p { max-width: 80ch; font-size: 0.86rem; }
</style>
