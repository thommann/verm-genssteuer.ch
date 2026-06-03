<script setup>
import { computed } from 'vue';
import ubs from '@/data/ubs_gini.json';
import wealthLevels from '@/data/ubs_wealth_levels.json';
import pyramid from '@/data/ubs_wealth_pyramid.json';
import { num, pct } from '@/lib/format.js';
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

// Ø- vs. Median-Vermögen pro Erwachsenem (USD, Ende 2024).
const chW = computed(() => wealthLevels.find((c) => c.land === 'Schweiz'));
const rankBy = (key, land) =>
  [...wealthLevels].sort((a, b) => b[key] - a[key]).findIndex((c) => c.land === land) + 1;
const chAvgRank = computed(() => rankBy('avg', 'Schweiz'));
const chMedRank = computed(() => rankBy('median', 'Schweiz'));
const chRatio = computed(() => chW.value.avg / chW.value.median);
const chMedianShare = computed(() => chW.value.median / chW.value.avg);

// Verhältnis Ø/Median je Land, absteigend (am stärksten top-lastig zuerst).
const ratioItems = computed(() =>
  [...wealthLevels]
    .map((c) => ({ land: c.land, ratio: c.avg / c.median }))
    .sort((a, b) => b.ratio - a.ratio)
    .map((c) => ({
      label: c.land,
      value: c.ratio,
      color: c.land === 'Schweiz' ? 'var(--accent)' : 'var(--gold)',
      sub: c.land === 'Schweiz' ? 'UBS-Heimmarkt' : undefined,
    }))
);
const usd = (v) => `${num(v)} USD`;
const ratioFmt = (v) => `×${num(v, 1)}`;

// Globale Vermögenspyramide.
const pyrTop = computed(() => pyramid[0]);
const pyrBottom = computed(() => pyramid[pyramid.length - 1]);
const pyramidItems = computed(() =>
  pyramid.map((b) => ({
    label: b.band,
    value: b.wealth_share,
    color: b.band.startsWith('> 1') ? 'var(--accent)' : 'var(--gold)',
    sub: `${pct(b.adults_share, 1)} der Erwachsenen`,
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
            liegt im oberen Mittelfeld</span>
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
          im oberen Mittelfeld der Stichprobe.
        </p>
        <BarChart :items="items" :max="1" :format-value="gini" accent="var(--gold)" />
        <SourceTag id="ubs" note="Vermögens-Gini, Daten Ende 2024" />
      </div>

      <h3 class="block-h">Durchschnitt vs. Median: dieselbe Lücke, anders gemessen</h3>
      <p class="muted small intro2">
        Bei einem Wert führt die Schweiz die Studie an: beim
        <strong>durchschnittlichen Vermögen pro erwachsene Person</strong> – weltweit Platz
        {{ chAvgRank }}. Beim <strong>Median</strong> – der «mittleren» Person – reicht es
        nur für Platz {{ chMedRank }}. Der Durchschnitt wird von einer schmalen Spitze nach
        oben gezogen; die mittlere Person besitzt nur {{ pct(chMedianShare, 0) }} davon.
      </p>

      <div class="grid sgrid">
        <div class="scard card">
          <span class="sv accent">{{ usd(chW.avg) }}</span>
          <span class="sl">Ø-Vermögen pro Erwachsenem – Weltrang {{ chAvgRank }}</span>
        </div>
        <div class="scard card">
          <span class="sv gold">{{ usd(chW.median) }}</span>
          <span class="sl">Median-Vermögen pro Erwachsenem – nur Rang {{ chMedRank }}</span>
        </div>
        <div class="scard card">
          <span class="sv">×{{ num(chRatio, 1) }}</span>
          <span class="sl">So viel höher ist der Durchschnitt als der Median in der Schweiz</span>
        </div>
      </div>

      <div class="card chartbox">
        <h3>Wie weit der Durchschnitt über dem Median liegt</h3>
        <p class="muted intro">
          Verhältnis von Durchschnitts- zu Median-Vermögen pro Erwachsenem (reichste Märkte
          der Studie). Je höher der Faktor, desto stärker zieht eine schmale Spitze den
          Schnitt über die Mitte. Die <span class="ch-text">Schweiz</span> liegt auch hier
          ganz vorne. Genau diese Lücke macht diese Seite sichtbar.
        </p>
        <BarChart :items="ratioItems" :format-value="ratioFmt" accent="var(--gold)" />
        <SourceTag id="ubs" note="Ø/Median-Vermögen pro Erwachsenem, Ende 2024" />
      </div>

      <h3 class="block-h">Die globale Vermögenspyramide</h3>
      <p class="muted small intro2">
        Dieselbe Studie für die ganze Welt: Das reichste
        <strong>{{ pct(pyrTop.adults_share, 1) }}</strong> der Erwachsenen besitzt
        <strong>{{ pct(pyrTop.wealth_share, 1) }}</strong> des gesamten Nettovermögens –
        die unteren <strong>{{ pct(pyrBottom.adults_share, 1) }}</strong> zusammen nur
        <strong>{{ pct(pyrBottom.wealth_share, 1) }}</strong>.
      </p>
      <div class="card chartbox">
        <h3>Vermögensanteil je Vermögensband (Welt 2024)</h3>
        <p class="muted intro">
          Anteil am weltweiten Nettovermögen je Band; in Klammern der Anteil an allen
          Erwachsenen. Eine schmale Spitze hält fast die Hälfte, die breite Basis kaum etwas.
        </p>
        <BarChart :items="pyramidItems" :max="1" :format-value="(v) => pct(v, 1)" accent="var(--gold)" />
        <SourceTag id="ubs" note="Globale Vermögenspyramide, Ende 2024" />
      </div>
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
.block-h { margin-top: 40px; }
.intro2 { margin-top: 8px; margin-bottom: 22px; }
</style>
