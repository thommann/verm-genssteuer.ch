<script setup>
// Einziger Bereich der Startseite: alle Kampagnen-Aussagen als volle Bänder über die
// ganze Breite, jedes mit demselben Verlauf wie die zugehörige Instagram-Slide. Zuoberst
// die Hauptaussage (#start, Variante A im Deck), darunter die übrigen Aussagen. Jede
// Aussage hat eine eigene Anker-id und ist aufklappbar: im aufgeklappten Zustand erscheint
// ein kurzer Erklärungstext und darunter der interne Link zur ausführlichen Erklärung
// (Datenseite + Anker). Texte/Beschriftungen liegen in i18n (hero.* für die Hauptaussage,
// claims.items.* für die übrigen); Hintergrund, Route und Anker bleiben hier (Struktur).
import { reactive } from 'vue';
import SourceTag from '@/components/ui/SourceTag.vue';

// Hauptaussage: gleicher Verlauf wie die Hauptbotschaft-Slide (Variante A) im Deck.
const HERO_BG = ['#ff2d6b', '#ff7a33', '#d6249f', '#ff2d6b'];

const CLAIMS = [
  { id: 'lebensstandard', key: 'lebensstandard', route: '/verteilung', hash: 'verteilung', bg: ['#ff7a33', '#d6249f', '#ffb13c', '#ff2d6b'] },
  { id: 'wirtschaft', key: 'wirtschaft', route: '/verteilung', hash: 'international', bg: ['#ff7a33', '#ff2d6b', '#ff7a33', '#d6249f'] },
  { id: 'eigenheim', key: 'eigenheim', route: '/verteilung', hash: 'ubs-studie', bg: ['#ff2d6b', '#d6249f', '#c01651', '#ff2d6b'] },
  { id: 'krankenkasse', key: 'krankenkasse', route: '/rechner', hash: 'verwendung', bg: ['#d6249f', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'oev', key: 'oev', route: '/rechner', hash: 'verwendung', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'strassen', key: 'strassen', route: '/verteilung', hash: 'verteilung', bg: ['#4f8bff', '#a78bfa', '#3b6fe0', '#7c3aed'] },
  { id: 'bildung', key: 'bildung', route: '/verteilung', hash: 'verteilung', bg: ['#25e3c8', '#7c3aed', '#14c98a', '#a78bfa'] },
  { id: 'erfolgsmodell', key: 'erfolgsmodell', route: '/modelle', hash: 'zucman', bg: ['#ff2d6b', '#ff7a33', '#d6249f', '#ff7a33'] },
  { id: 'mittelstand', key: 'mittelstand', route: '/modelle', hash: 'zucman', source: 'zucman_g20', dark: true, bg: ['#ffce5c', '#ff7a33', '#ffb13c', '#ff7a33'] },
  { id: 'faire-steuern', key: 'faireSteuern', route: '/modelle', hash: 'zucman', source: 'zucman_g20', bg: ['#a78bfa', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'standort', key: 'standort', route: '/rechner', hash: 'rechner', bg: ['#14c98a', '#25e3c8', '#14c98a', '#4f8bff'] },
  { id: 'mindeststeuer', key: 'mindeststeuer', route: '/modelle', hash: 'zucman', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'kein-wegzug', key: 'keinWegzug', route: '/rechner', hash: 'wegzug', source: 'zucman_g20', bg: ['#3b6fe0', '#a78bfa', '#4f8bff', '#7c3aed'] },
  { id: 'schon-fair', key: 'schonFair', route: '/modelle', hash: 'zucman', bg: ['#a78bfa', '#25e3c8', '#7c3aed', '#14c98a'] },
];

const vars = (bg) => ({ '--g1': bg[0], '--g2': bg[1], '--g3': bg[2], '--g4': bg[3] });

// Aufklapp-Zustand je Aussage (mehrere gleichzeitig möglich).
const open = reactive({});
const toggle = (id) => { open[id] = !open[id]; };
</script>

<template>
  <div id="aussagen">
    <!-- Hauptaussage zuoberst, volle Breite, verlinkbar (#start). -->
    <header id="start" class="claim-band hero-band" :style="vars(HERO_BG)">
      <div class="wrap">
        <div class="eyebrow">{{ $t('hero.eyebrow') }}</div>
        <h1 class="band-text" v-html="$t('hero.title')" />
        <button
          type="button"
          class="band-cue"
          :aria-expanded="open.start ? 'true' : 'false'"
          aria-controls="expl-start"
          @click="toggle('start')"
        >
          <span class="band-cue-label">{{ $t('hero.expand') }}</span>
          <span class="band-cue-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </button>
        <div class="band-collapse" :class="{ open: open.start }">
          <div class="band-collapse-inner">
            <div id="expl-start" :aria-hidden="open.start ? 'false' : 'true'">
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

    <section
      v-for="c in CLAIMS"
      :id="c.id"
      :key="c.id"
      class="claim-band"
      :class="{ dark: c.dark }"
      :style="vars(c.bg)"
    >
      <div class="wrap">
        <div class="eyebrow">{{ $t(`claims.items.${c.key}.eyebrow`) }}</div>
        <p class="band-text" v-html="$t(`claims.items.${c.key}.text`)" />
        <button
          type="button"
          class="band-cue"
          :aria-expanded="open[c.id] ? 'true' : 'false'"
          :aria-controls="`expl-${c.id}`"
          @click="toggle(c.id)"
        >
          <span class="band-cue-label">{{ $t('claims.expand') }}</span>
          <span class="band-cue-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </button>
        <div class="band-collapse" :class="{ open: open[c.id] }">
          <div class="band-collapse-inner">
            <div :id="`expl-${c.id}`" :aria-hidden="open[c.id] ? 'false' : 'true'">
              <p class="band-expl" v-html="$t(`claims.items.${c.key}.explainText`)" />
              <div class="band-foot">
                <router-link :to="{ path: c.route, hash: `#${c.hash}` }" class="band-link">
                  {{ $t(`claims.items.${c.key}.link`) }} <span aria-hidden="true">→</span>
                </router-link>
                <SourceTag v-if="c.source" :id="c.source" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-band { padding-top: clamp(104px, 17vh, 200px); }
</style>
