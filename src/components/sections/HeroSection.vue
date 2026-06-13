<script setup>
// Gleicher Verlauf wie die Hauptbotschaft-Slide (Variante A) im Instagram-Deck.
const bg = { '--g1': '#ff2d6b', '--g2': '#ff7a33', '--g3': '#d6249f', '--g4': '#ff2d6b' };
</script>

<template>
  <!-- Hauptaussage zuoberst, volle Breite, verlinkbar (#start) mit internem Link zur Erklärung. -->
  <header id="start" class="claim-band hero-band" :style="bg">
    <div class="wrap">
      <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
      <h1 class="band-text" v-html="$t('hero.title')" />
      <div class="band-foot">
        <router-link :to="{ path: '/verteilung', hash: '#verteilung' }" class="band-link">
          {{ $t('hero.explain') }} <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-band { padding-top: clamp(104px, 17vh, 200px); }
</style>
