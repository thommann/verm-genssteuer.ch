<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ownership from '@/data/ownership.json';
import { pct, pct0 } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import ChartLegend from '@/components/charts/ChartLegend.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const firmen = ownership.firmen;

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
const firmenLegend = computed(() => firmenTrend.value.map((s) => ({ color: s.color, label: s.name })));
</script>

<template>
  <section id="firmen">
    <div class="wrap">
      <div class="eyebrow">
        {{ $t('ownership.firmenEyebrow') }}
      </div>
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
        <p
          class="muted intro"
          v-html="$t('ownership.firmenChartIntro')"
        />
        <BarChart
          :items="firmenItems"
          :max="1"
          :format-value="pct0"
          accent="var(--gold)"
        />
        <SourceTag
          id="bfs_stagre"
          :note="$t('ownership.firmenChartSource')"
        />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.firmenTrendTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.firmenTrendIntro')"
        />
        <LineChart
          :aria-label="$t('ownership.firmenTrendTitle')"
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
        <ChartLegend
          :items="firmenLegend"
          :style="{ marginTop: '12px' }"
        />
        <SourceTag
          id="bfs_stagre"
          :note="$t('ownership.firmenTrendSource')"
        />
      </div>
    </div>
  </section>
</template>
