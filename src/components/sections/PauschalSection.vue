<script setup>
import { computed } from 'vue';
import pauschal from '@/data/pauschal.json';
import { num, chfCompact, chf } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

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
      <h2>{{ $t('pauschal.title', { count: num(count) }) }}</h2>
      <p class="lead" v-html="$t('pauschal.lead')" />

      <div class="grid pgrid">
        <div class="pcard card">
          <span class="pv accent">{{ num(count) }}</span>
          <span class="pl">{{ $t('pauschal.cardCountLabel') }}</span>
        </div>
        <div class="pcard card">
          <span class="pv gold">{{ chfCompact(totalRev, 0) }}</span>
          <span class="pl">{{ $t('pauschal.cardRevenueLabel') }}</span>
        </div>
        <div class="pcard card">
          <span class="pv">{{ chfCompact(avg, 0) }}</span>
          <span class="pl">{{ $t('pauschal.cardAvgLabel') }}</span>
        </div>
      </div>

      <p class="muted small">
        {{ $t('pauschal.note', { lowest: chf(pauschal.lowest), highest: chf(pauschal.highest) }) }}
      </p>
      <SourceTag id="fdk" :note="$t('pauschal.sourceNote')" />
    </div>
  </section>
</template>

<style scoped>
.pgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 24px 0 16px; }
.pcard { padding: 22px; display: flex; flex-direction: column; gap: 4px; }
.pv { font-size: 2rem; font-weight: 800; }
.pv.accent { color: var(--accent); }
.pv.gold { color: var(--gold); }
.pl { color: var(--text-soft); font-size: 0.88rem; }
.small { font-size: 0.82rem; max-width: 75ch; }
</style>
