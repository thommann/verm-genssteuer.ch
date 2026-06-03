<script setup>
import { computed } from 'vue';
import ubs from '@/data/ubs_gini.json';
import BarChart from '@/components/charts/BarChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

// Gini absteigend – ungleichste Länder zuerst.
const sorted = computed(() => [...ubs].sort((a, b) => b.gini - a.gini));

const ch = computed(() => ubs.find((c) => c.land === 'Schweiz'));
const chRank = computed(() => sorted.value.findIndex((c) => c.land === 'Schweiz') + 1);
const highest = computed(() => sorted.value[0]);
const lowest = computed(() => sorted.value[sorted.value.length - 1]);

const gini = (v) => v.toFixed(2);

const items = computed(() =>
  sorted.value.map((c) => ({
    label: c.land,
    value: c.gini,
    color: c.land === 'Schweiz' ? 'var(--accent)' : 'var(--gold)',
    sub: c.land === 'Schweiz' ? 'UBS-Heimmarkt' : undefined,
  }))
);
</script>

<template>
  <section id="ubs-studie">
    <div class="wrap">
      <div class="eyebrow">Die UBS/CS-Studie</div>
      <h2>Was der UBS&nbsp;Global&nbsp;Wealth&nbsp;Report über die Schweiz sagt</h2>
      <p class="lead">
        Der <strong>Global Wealth Report</strong> ist die wohl bekannteste weltweite
        Vermögensstudie. Jahrzehntelang erschien sie unter dem Namen
        <strong>Credit Suisse</strong> – seit der Übernahme 2023 trägt sie das Logo der
        <strong>UBS</strong>. Ausgerechnet die Bank, die den grössten Bankenkollaps der
        jüngeren Schweizer Geschichte aufgefangen hat, vermisst nun die Vermögen der Welt.
      </p>

      <div class="grid sgrid">
        <div class="scard card">
          <span class="sv accent">{{ gini(ch.gini) }}</span>
          <span class="sl">Vermögens-Gini der Schweiz<br />(0 = gleich, 1 = einer hat alles)</span>
        </div>
        <div class="scard card">
          <span class="sv gold">Platz&nbsp;{{ chRank }}</span>
          <span class="sl">von {{ sorted.length }} verglichenen Ländern – die Schweiz
            gehört zu den ungleichsten</span>
        </div>
        <div class="scard card">
          <span class="sv">{{ gini(highest.gini) }}–{{ gini(lowest.gini) }}</span>
          <span class="sl">Spannweite in der Stichprobe: von {{ highest.land }}
            bis {{ lowest.land }}</span>
        </div>
      </div>

      <div class="card chartbox">
        <h3>Vermögens-Gini im Ländervergleich</h3>
        <p class="muted intro">
          Der Gini-Koeffizient misst, wie ungleich das gesamte Nettovermögen verteilt ist.
          Je höher der Wert, desto stärker konzentriert sich der Reichtum bei wenigen.
          Die <span class="ch-text">Schweiz</span> liegt – trotz Wohlstand und Stabilität –
          weit oben.
        </p>
        <BarChart :items="items" :max="1" :format-value="gini" accent="var(--gold)" />
        <SourceTag id="ubs" note="Vermögens-Gini, Daten Ende 2024" />
      </div>

      <p class="muted small">
        Bei einem anderen Wert führt die Schweiz die Studie regelmässig an: beim
        <strong>durchschnittlichen Vermögen pro erwachsene Person</strong>, eines der
        höchsten der Welt. Hoher Durchschnitt und hohe Ungleichheit zugleich heisst:
        Der Mittelwert wird von einer schmalen Spitze nach oben gezogen, während der
        Median – die «mittlere» Schweiz – deutlich tiefer liegt. Genau diese Lücke macht
        diese Seite sichtbar.
      </p>
    </div>
  </section>
</template>

<style scoped>
.sgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 24px 0 28px; }
.scard { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.sv { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.sv.accent { color: var(--accent); }
.sv.gold { color: var(--gold); }
.sl { color: var(--text-soft); font-size: 0.88rem; }

.chartbox { padding: 24px 26px; }
.chartbox h3 { margin-bottom: 8px; }
.intro { font-size: 0.92rem; max-width: 70ch; margin-bottom: 20px; }
.ch-text { color: var(--accent-soft); font-weight: 700; }

.small { font-size: 0.85rem; max-width: 75ch; margin-top: 22px; }
</style>
