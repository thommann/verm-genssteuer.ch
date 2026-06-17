<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ownership from '@/data/ownership.json';
import wid from '@/data/wid_timeseries.json';
import { num, pct } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const reichste = ownership.reichste;
const pct0 = (v) => pct(v, 0);

// Schweizer/Liechtensteiner vs. Ausländer mit Wohnsitz in der Schweiz.
const reichsteItems = computed(() => [
  { label: t('ownership.reichsteSwiss'), value: reichste.schweizer_share, color: 'var(--gold)' },
  { label: t('ownership.reichsteForeign'), value: reichste.auslaender_share, color: 'var(--accent)' },
]);

// Vermögenskonzentration über die Zeit: Anteil des reichsten 1 % am Schweizer
// Nettovermögen (WID, 1995–2024), der breitere Trend hinter den 300 Reichsten.
const top1Trend = computed(() => {
  const s = wid.top1.Schweiz;
  const pts = Object.keys(s)
    .map(Number).filter((y) => s[String(y)] != null).sort((a, b) => a - b)
    .map((y) => ({ x: y, y: s[String(y)] }));
  return [{ name: t('ownership.konzTrendLine'), color: 'var(--accent)', points: pts }];
});

// Privatvermögen als Vielfaches des BIP über die Zeit (SNB / Weltbank).
const vermoegenBipTrend = computed(() => [{
  name: t('ownership.bipTrendLine'), color: 'var(--accent)',
  points: reichste.vermoegen_bip_serie.map((p) => ({ x: p.jahr, y: p.vielfaches })),
}]);
const bipYears = computed(() => reichste.vermoegen_bip_serie.map((p) => p.jahr));
const bipX = (v) => `${num(v, 1)}×`;

// Die 300 Reichsten als Anteil am BIP (Bilanz / Weltbank), je Listenjahr.
const top300BipTrend = computed(() => [{
  name: t('ownership.top300BipLine'), color: 'var(--gold)',
  points: reichste.top300_bip_serie.map((p) => ({ x: p.jahr, y: p.anteil })),
}]);
const top300Years = computed(() => reichste.top300_bip_serie.map((p) => p.jahr));
</script>

<template>
  <section id="reichste">
    <div class="wrap">
      <div class="eyebrow">{{ $t('ownership.reichsteEyebrow') }}</div>
      <h2>{{ $t('ownership.reichsteHeading') }}</h2>
      <p
        class="lead"
        v-html="$t('ownership.reichsteIntro', {
          auslaender: num(reichste.auslaender, 0),
          total: num(reichste.total, 0),
          auslaenderPct: pct(reichste.auslaender_share, 0),
          schweizer: num(reichste.schweizer, 0),
        })"
      />

      <div class="grid sgrid">
        <div class="scard card">
          <span class="sv gold">{{ num(reichste.schweizer, 0) }}</span>
          <span class="sl" v-html="$t('ownership.reichsteSwissLabel', { total: num(reichste.total, 0) })" />
        </div>
        <div class="scard card">
          <span class="sv accent">{{ num(reichste.auslaender, 0) }}</span>
          <span class="sl" v-html="$t('ownership.reichsteForeignLabel', { total: num(reichste.total, 0) })" />
        </div>
        <div class="scard card">
          <span class="sv">{{ pct(reichste.auslaender_share, 0) }}</span>
          <span class="sl">{{ $t('ownership.reichsteShareLabel') }}</span>
        </div>
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.reichsteChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.reichsteChartIntro')" />
        <BarChart :items="reichsteItems" :max="1" :format-value="pct0" accent="var(--gold)" />
        <SourceTag id="bilanz300" :note="$t('ownership.reichsteSource', { jahr: reichste.jahr })" />
      </div>

      <div class="card chartbox conc">
        <span class="sv accent big">{{ pct(reichste.anteil_privatvermoegen, 0) }}</span>
        <p
          class="conc-text"
          v-html="$t('ownership.konzIntro', {
            mrd: num(reichste.vermoegen_300_mrd, 1),
            jahr: reichste.vermoegen_300_jahr,
            total: num(reichste.privatvermoegen_mrd, 0),
            snbJahr: reichste.privatvermoegen_jahr,
          })"
        />
        <div class="srcrow">
          <SourceTag id="bilanz300" :note="$t('ownership.konzSourceBilanz', { jahr: reichste.vermoegen_300_jahr })" />
          <SourceTag id="snb_haushalte" :note="$t('ownership.konzSourceSnb', { jahr: reichste.privatvermoegen_jahr })" />
        </div>
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.konzTrendTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.konzTrendIntro')" />
        <LineChart
          :series="top1Trend"
          :x-domain="[1995, 2024]"
          :x-ticks="[1995, 2000, 2005, 2010, 2015, 2020, 2024]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :height="300"
        />
        <SourceTag id="wid" :note="$t('ownership.konzTrendSource')" />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.bipTrendTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.bipTrendIntro')" />
        <LineChart
          :series="vermoegenBipTrend"
          :x-domain="[bipYears[0], bipYears[bipYears.length - 1]]"
          :x-ticks="[2000, 2005, 2010, 2015, 2020, 2024]"
          :format-x="(v) => String(v)"
          :format-y="bipX"
          :height="300"
        />
        <div class="srcrow">
          <SourceTag id="snb_haushalte" :note="$t('ownership.bipTrendSourceSnb')" />
          <SourceTag id="worldbank_gdp" :note="$t('ownership.bipTrendSourceGdp')" />
        </div>
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.top300BipTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.top300BipIntro')" />
        <LineChart
          :series="top300BipTrend"
          :x-domain="[top300Years[0], top300Years[top300Years.length - 1]]"
          :x-ticks="top300Years"
          :y-domain="[0, 1.2]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :height="280"
        />
        <div class="srcrow">
          <SourceTag id="bilanz300" :note="$t('ownership.top300BipSourceBilanz')" />
          <SourceTag id="worldbank_gdp" :note="$t('ownership.bipTrendSourceGdp')" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 24px 0 14px; }
.scard { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.sv { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.sv.accent { color: var(--accent); }
.sv.gold { color: var(--gold); }
.sl { color: var(--text-soft); font-size: 0.88rem; }
.chartbox { padding: 24px 26px; }
.chartbox h3 { margin-bottom: 8px; }
.intro { font-size: 0.92rem; max-width: 70ch; margin-bottom: 20px; }
.conc { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.conc .big { font-size: 2.6rem; }
.conc-text { font-size: 0.95rem; max-width: 70ch; margin: 0; }
.srcrow { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
