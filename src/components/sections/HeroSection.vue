<script setup>
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const k = kennzahlen.unbeschraenkt['2022'];
</script>

<template>
  <header id="start" class="hero">
    <div class="wrap">
      <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
      <h1 v-html="$t('hero.title', { share: pct(k.share_ge5M, 0) })" />
      <p class="lead" v-html="$t('hero.lead', { cnt: num(k.cnt_ge5M), median: chf(k.median) })" />

      <div style="margin-top: 18px">
        <SourceTag id="estv_vermoegen" :note="$t('hero.sourceNote')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero { padding: clamp(70px, 13vw, 150px) 0 clamp(50px, 8vw, 90px); }
:deep(.hl) { color: var(--accent); }
:deep(.hl.gold) { color: var(--gold); }
h1 { max-width: 18ch; }
</style>
