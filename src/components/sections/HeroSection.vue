<script setup>
// Gleicher Verlauf wie die Hauptbotschaft-Slide (Variante A) im Instagram-Deck.
import { ref } from 'vue';

const bg = { '--g1': '#ff2d6b', '--g2': '#ff7a33', '--g3': '#d6249f', '--g4': '#ff2d6b' };

// Aufklappbarer Erklärungstext zur Hauptaussage.
const open = ref(false);
</script>

<template>
  <!-- Hauptaussage zuoberst, volle Breite, verlinkbar (#start). Aufklappbar: zeigt einen kurzen
       Erklärungstext und den internen Link zur ausführlichen Erklärung. -->
  <header id="start" class="claim-band hero-band" :style="bg">
    <div class="wrap">
      <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
      <h1 class="band-text" v-html="$t('hero.title')" />
      <button
        type="button"
        class="band-cue"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="expl-start"
        @click="open = !open"
      >
        <span class="band-cue-label">{{ $t('hero.expand') }}</span>
        <span class="band-cue-icon" aria-hidden="true">+</span>
      </button>
      <div class="band-collapse" :class="{ open }">
        <div class="band-collapse-inner">
          <div id="expl-start" :aria-hidden="open ? 'false' : 'true'">
            <p class="band-expl" v-html="$t('hero.explainText')" />
            <div class="band-foot">
              <router-link :to="{ path: '/verteilung', hash: '#verteilung' }" class="band-link">
                {{ $t('hero.explain') }} <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-band { padding-top: clamp(104px, 17vh, 200px); }
</style>
