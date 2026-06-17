<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ownership from '@/data/ownership.json';
import { pct } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const firmen = ownership.firmen;
const pct0 = (v) => pct(v, 0);

// Anteil der ausländisch kontrollierten Gruppen je Kennzahl (wenige Firmen/Jobs,
// viel Umsatz).
const firmenItems = computed(() => [
  { label: t('ownership.firmenUnternehmen'), value: firmen.unternehmen.ausland_share, sub: t('ownership.firmenYear', { jahr: firmen.unternehmen.jahr }) },
  { label: t('ownership.firmenJobs'), value: firmen.beschaeftigte.ausland_share, sub: t('ownership.firmenYear', { jahr: firmen.beschaeftigte.jahr }) },
  { label: t('ownership.firmenUmsatz'), value: firmen.umsatz.ausland_share, color: 'var(--accent)', sub: t('ownership.firmenYear', { jahr: firmen.umsatz.jahr }) },
]);

// Auslandskontroll-Anteil über die Zeit (Umsatz + Beschäftigte).
const firmenTrend = computed(() => [
  { name: t('ownership.firmenUmsatz'), color: 'var(--accent)',
    points: firmen.umsatz.serie.map((p) => ({ x: p.jahr, y: p.ausland_share })) },
  { name: t('ownership.firmenJobs'), color: 'var(--gold)',
    points: firmen.beschaeftigte.serie.map((p) => ({ x: p.jahr, y: p.ausland_share })) },
]);
</script>

<template>
  <section id="firmen">
    <div class="wrap">
      <div class="eyebrow">{{ $t('ownership.firmenEyebrow') }}</div>
      <h2>{{ $t('ownership.firmenHeading') }}</h2>
      <p
        class="lead"
        v-html="$t('ownership.firmenIntro', {
          firmen: pct(firmen.unternehmen.ausland_share, 0),
          jobs: pct(firmen.beschaeftigte.ausland_share, 0),
          umsatz: pct(firmen.umsatz.ausland_share, 0),
        })"
      />

      <div class="card chartbox">
        <h3>{{ $t('ownership.firmenChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.firmenChartIntro')" />
        <BarChart :items="firmenItems" :max="1" :format-value="pct0" accent="var(--gold)" />
        <SourceTag id="bfs_stagre" :note="$t('ownership.firmenChartSource')" />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.firmenTrendTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.firmenTrendIntro')" />
        <LineChart
          :series="firmenTrend"
          :x-domain="[2014, 2024]"
          :x-ticks="[2014, 2016, 2018, 2020, 2022, 2024]"
          :y-domain="[0.24, 0.7]"
          :y-ticks="[0.3, 0.4, 0.5, 0.6, 0.7]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :x-label="$t('ownership.axisYear')"
          :y-label="$t('ownership.firmenTrendYAxis')"
          :height="300"
        />
        <div class="legend">
          <span v-for="s in firmenTrend" :key="s.name"><i class="sw" :style="{ background: s.color }" /> {{ s.name }}</span>
        </div>
        <SourceTag id="bfs_stagre" :note="$t('ownership.firmenTrendSource')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.chartbox { padding: 24px 26px; }
.chartbox h3 { margin-bottom: 8px; }
.intro { font-size: 0.92rem; max-width: 70ch; margin-bottom: 20px; }
.legend { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 12px; font-size: 0.85rem; color: var(--text-soft); }
.legend .sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 7px; vertical-align: middle; }
</style>
