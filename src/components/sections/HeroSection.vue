<script setup>
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const k = kennzahlen.unbeschraenkt['2022'];
</script>

<template>
  <!-- Hauptaussage der Kampagne, zuoberst und verlinkbar (#start). Darunter die
       konkrete Zahl als Beleg und ein interner Link zur Erklärung. -->
  <header id="start" class="hero">
    <div class="wrap">
      <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
      <h1 v-html="$t('hero.title')" />
      <p class="lead" v-html="$t('hero.lead', { share: pct(k.share_ge5M, 0), median: chf(k.median) })" />

      <div class="hero-actions">
        <router-link :to="{ path: '/verteilung', hash: '#verteilung' }" class="explain-link">
          {{ $t('hero.explain') }} <span aria-hidden="true">→</span>
        </router-link>
      </div>

      <div class="hero-source">
        <SourceTag id="estv_vermoegen" :note="$t('hero.sourceNote')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero { padding: clamp(70px, 13vw, 150px) 0 clamp(44px, 7vw, 80px); }
:deep(.hl) { color: var(--accent); }
:deep(.hl.gold) { color: var(--gold); }
h1 { max-width: 20ch; }
.lead { margin-top: 6px; }

.hero-actions { margin-top: 26px; }
.explain-link {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 18px; border-radius: 999px;
  font-weight: 700; font-size: 0.95rem;
  color: var(--text); background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border); text-decoration: none;
  transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}
.explain-link span { color: var(--accent); transition: transform 0.15s ease; display: inline-block; }
.explain-link:hover { transform: translateY(-1px); border-color: var(--accent); background: rgba(255, 255, 255, 0.09); text-decoration: none; }
.explain-link:hover span { transform: translateX(4px); }

.hero-source { margin-top: 18px; }
</style>
