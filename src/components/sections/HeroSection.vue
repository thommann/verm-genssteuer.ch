<script setup>
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const k = kennzahlen.unbeschraenkt['2022'];

// Gleicher Verlauf wie die Hauptbotschaft-Slide (Variante A) im Instagram-Deck.
const bg = { '--g1': '#ff2d6b', '--g2': '#ff7a33', '--g3': '#d6249f', '--g4': '#ff2d6b' };
</script>

<template>
  <!-- Hauptaussage zuoberst, volle Breite, verlinkbar (#start). Darunter die konkrete
       Zahl als Beleg und ein interner Link zur Erklärung. -->
  <header id="start" class="claim-band hero-band" :style="bg">
    <div class="wrap">
      <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
      <h1 class="band-text" v-html="$t('hero.title')" />
      <p class="hero-lead" v-html="$t('hero.lead', { share: pct(k.share_ge5M, 0), median: chf(k.median) })" />
      <div class="band-foot">
        <router-link :to="{ path: '/verteilung', hash: '#verteilung' }" class="band-link">
          {{ $t('hero.explain') }} <span aria-hidden="true">→</span>
        </router-link>
        <SourceTag id="estv_vermoegen" :note="$t('hero.sourceNote')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-band { padding-top: clamp(104px, 17vh, 200px); }
.hero-lead {
  margin: 20px 0 0;
  max-width: 48ch;
  font-size: clamp(1.05rem, 2.1vw, 1.35rem);
  font-weight: 600;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.96);
}
.hero-lead :deep(.hl.gold) {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.85);
  padding: 0 0.28em;
  border-radius: 6px;
  font-weight: 900;
}
.hero-lead :deep(strong) { color: #fff; font-weight: 900; }
</style>
