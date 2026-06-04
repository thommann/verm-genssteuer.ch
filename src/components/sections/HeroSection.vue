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

      <div class="hero-stats">
        <div class="hstat">
          <div class="hstat-val gold">{{ pct(k.share_ge5M, 0) }}</div>
          <div class="hstat-lab" v-html="$t('hero.stat1Label')" />
        </div>
        <div class="divider" />
        <div class="hstat">
          <div class="hstat-val">{{ chf(k.median) }}</div>
          <div class="hstat-lab" v-html="$t('hero.stat2Label')" />
        </div>
        <div class="divider" />
        <div class="hstat">
          <div class="hstat-val accent">{{ Math.round(k.mean / k.median) }}×</div>
          <div class="hstat-lab" v-html="$t('hero.stat3Label')" />
        </div>
      </div>

      <div class="hero-cta">
        <a href="#rechner" class="btn btn-primary">{{ $t('hero.ctaTry') }}</a>
        <a href="#verteilung" class="btn">{{ $t('hero.ctaDistribution') }}</a>
      </div>
      <div style="margin-top: 18px">
        <SourceTag id="estv_vermoegen" :note="$t('hero.sourceNote')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero { padding: clamp(70px, 13vw, 150px) 0 clamp(50px, 8vw, 90px); }
.hl { color: var(--accent); }
.hl.gold { color: var(--gold); }
h1 { max-width: 18ch; }
.hero-stats {
  display: flex; align-items: center; gap: clamp(16px, 4vw, 44px);
  margin: 40px 0 32px; flex-wrap: wrap;
}
.hstat-val { font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.02em; }
.hstat-val.gold { color: var(--gold); }
.hstat-val.accent { color: var(--accent); }
.hstat-lab { color: var(--text-soft); font-size: 0.9rem; margin-top: 2px; }
.divider { width: 1px; height: 52px; background: var(--border); }
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 560px) { .divider { display: none; } }
</style>
