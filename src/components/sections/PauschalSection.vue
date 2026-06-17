<script setup>
import { computed } from 'vue';
import pauschal from '@/data/pauschal.json';
import { num, chfCompact, chf } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';
import StatGrid from '@/components/ui/StatGrid.vue';
import StatCard from '@/components/ui/StatCard.vue';

const YEAR = 2018;
const count = pauschal.counts_ch[YEAR];
const rev = pauschal.revenue[YEAR];
const totalRev = computed(() => (rev.bund + rev.kanton + rev.gemeinde) * 1e6);
const avg = computed(() => totalRev.value / count);
</script>

<template>
  <section id="pauschal">
    <div class="wrap">
      <div class="eyebrow">{{ $t('pauschal.eyebrow') }}</div>
      <h2 v-html="$t('pauschal.title', { count: num(count) })" />
      <p class="lead" v-html="$t('pauschal.lead')" />

      <StatGrid>
        <StatCard tone="accent">
          <template #value>{{ num(count) }}</template>
          <template #label>{{ $t('pauschal.cardCountLabel') }}</template>
        </StatCard>
        <StatCard tone="gold">
          <template #value>{{ chfCompact(totalRev, 0) }}</template>
          <template #label>{{ $t('pauschal.cardRevenueLabel') }}</template>
        </StatCard>
        <StatCard>
          <template #value>{{ chfCompact(avg, 0) }}</template>
          <template #label>{{ $t('pauschal.cardAvgLabel') }}</template>
        </StatCard>
      </StatGrid>

      <p class="muted small">
        {{ $t('pauschal.note', { lowest: chf(pauschal.lowest), highest: chf(pauschal.highest) }) }}
      </p>
      <SourceTag id="fdk" :note="$t('pauschal.sourceNote')" />
    </div>
  </section>
</template>

<style scoped>
.small { font-size: 0.82rem; max-width: 75ch; }
</style>
