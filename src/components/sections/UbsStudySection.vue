<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ubs from '@/data/ubs_gini.json';
import wealthLevels from '@/data/ubs_wealth_levels.json';
import pyramid from '@/data/ubs_wealth_pyramid.json';
import { num, pct } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';
import StatGrid from '@/components/ui/StatGrid.vue';
import StatCard from '@/components/ui/StatCard.vue';

const { t } = useI18n();

// Gini absteigend, ungleichste Länder zuerst.
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
    sub: c.land === 'Schweiz' ? t('ubs.homeMarket') : undefined,
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
      sub: c.land === 'Schweiz' ? t('ubs.homeMarket') : undefined,
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
    sub: t('ubs.pyramidBandSub', { share: pct(b.adults_share, 1) }),
  }))
);
</script>

<template>
  <section id="ubs-studie">
    <div class="wrap">
      <div class="eyebrow">{{ $t('ubs.eyebrow') }}</div>
      <h2 v-html="$t('ubs.title')" />
      <p class="lead" v-html="$t('ubs.lead')" />

      <StatGrid :style="{ margin: '24px 0 28px' }">
        <StatCard tone="accent">
          <template #value>{{ gini(ch.gini) }}</template>
          <template #label><span v-html="$t('ubs.giniCardLabel')" /></template>
        </StatCard>
        <StatCard tone="gold">
          <template #value><span v-html="$t('ubs.rankCardValue', { rank: chRank })" /></template>
          <template #label>{{ $t('ubs.rankCardLabel', { total: sorted.length }) }}</template>
        </StatCard>
        <StatCard>
          <template #value>{{ gini(highest.gini) }}–{{ gini(lowest.gini) }}</template>
          <template #label>{{ $t('ubs.spreadCardLabel', { highest: highest.land, lowest: lowest.land }) }}</template>
        </StatCard>
      </StatGrid>

      <div class="card chartbox">
        <h3>{{ $t('ubs.giniChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ubs.giniChartIntro')" />
        <BarChart :items="items" :max="1" :format-value="gini" accent="var(--gold)" />
        <SourceTag id="ubs" :note="$t('ubs.giniChartSource')" />
      </div>

      <h3 class="block-h">{{ $t('ubs.avgMedianHeading') }}</h3>
      <p
        class="muted small intro2"
        v-html="$t('ubs.avgMedianIntro', {
          avgRank: chAvgRank,
          medRank: chMedRank,
          medianShare: pct(chMedianShare, 0),
        })"
      />

      <StatGrid :style="{ margin: '24px 0 28px' }">
        <StatCard tone="accent">
          <template #value>{{ usd(chW.avg) }}</template>
          <template #label>{{ $t('ubs.avgCardLabel', { rank: chAvgRank }) }}</template>
        </StatCard>
        <StatCard tone="gold">
          <template #value>{{ usd(chW.median) }}</template>
          <template #label>{{ $t('ubs.medianCardLabel', { rank: chMedRank }) }}</template>
        </StatCard>
        <StatCard>
          <template #value>×{{ num(chRatio, 1) }}</template>
          <template #label>{{ $t('ubs.ratioCardLabel') }}</template>
        </StatCard>
      </StatGrid>

      <div class="card chartbox">
        <h3>{{ $t('ubs.ratioChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ubs.ratioChartIntro')" />
        <BarChart :items="ratioItems" :format-value="ratioFmt" accent="var(--gold)" />
        <SourceTag id="ubs" :note="$t('ubs.ratioChartSource')" />
      </div>

      <h3 class="block-h">{{ $t('ubs.pyramidHeading') }}</h3>
      <p
        class="muted small intro2"
        v-html="$t('ubs.pyramidIntro', {
          topAdults: pct(pyrTop.adults_share, 1),
          topWealth: pct(pyrTop.wealth_share, 1),
          bottomAdults: pct(pyrBottom.adults_share, 1),
          bottomWealth: pct(pyrBottom.wealth_share, 1),
        })"
      />
      <div class="card chartbox">
        <h3>{{ $t('ubs.pyramidChartTitle') }}</h3>
        <p class="muted intro">{{ $t('ubs.pyramidChartIntro') }}</p>
        <BarChart :items="pyramidItems" :max="1" :format-value="(v) => pct(v, 1)" accent="var(--gold)" />
        <SourceTag id="ubs" :note="$t('ubs.pyramidChartSource')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.ch-text) { color: var(--accent-soft); font-weight: 700; }
.small { font-size: 0.85rem; max-width: 75ch; margin-top: 22px; }
.block-h { margin-top: 40px; }
.intro2 { margin-top: 8px; margin-bottom: 22px; }
</style>
