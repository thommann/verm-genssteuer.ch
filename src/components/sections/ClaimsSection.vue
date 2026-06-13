<script setup>
// Jede Aussage als volles Band über die ganze Breite, mit demselben Verlauf wie die
// zugehörige Instagram-Slide. Eigene Anker-id je Aussage, darunter ein interner Link
// zur Erklärung (Themenseite + Anker). Texte/Beschriftungen liegen in i18n
// (claims.items.*), Hintergrund, Route und Anker bleiben hier (Struktur).
import SourceTag from '@/components/ui/SourceTag.vue';

const CLAIMS = [
  { id: 'ende-monat', key: 'endeMonat', route: '/verteilung', hash: 'ubs-studie', bg: ['#ff2d6b', '#ff7a33', '#d6249f', '#ff2d6b'] },
  { id: 'wirtschaft', key: 'wirtschaft', route: '/verteilung', hash: 'international', bg: ['#ff7a33', '#ff2d6b', '#ff7a33', '#d6249f'] },
  { id: 'eigenheim', key: 'eigenheim', route: '/verteilung', hash: 'ubs-studie', bg: ['#ff2d6b', '#d6249f', '#c01651', '#ff2d6b'] },
  { id: 'krankenkasse', key: 'krankenkasse', route: '/rechner', hash: 'verwendung', bg: ['#d6249f', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'oev', key: 'oev', route: '/rechner', hash: 'verwendung', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'strassen', key: 'strassen', route: '/verteilung', hash: 'verteilung', bg: ['#4f8bff', '#a78bfa', '#3b6fe0', '#7c3aed'] },
  { id: 'mittelstand', key: 'mittelstand', route: '/rechner', hash: 'verwendung', dark: true, bg: ['#ffce5c', '#ff7a33', '#ffb13c', '#ff7a33'] },
  { id: 'faire-steuern', key: 'faireSteuern', route: '/modelle', hash: 'zucman', source: 'zucman_g20', bg: ['#a78bfa', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'standort', key: 'standort', route: '/rechner', hash: 'rechner', bg: ['#14c98a', '#25e3c8', '#14c98a', '#4f8bff'] },
  { id: 'mindeststeuer', key: 'mindeststeuer', route: '/modelle', hash: 'zucman', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'kein-wegzug', key: 'keinWegzug', route: '/rechner', hash: 'wegzug', bg: ['#3b6fe0', '#a78bfa', '#4f8bff', '#7c3aed'] },
  { id: 'schon-fair', key: 'schonFair', route: '/modelle', hash: 'zucman', bg: ['#a78bfa', '#25e3c8', '#7c3aed', '#14c98a'] },
];

const vars = (bg) => ({ '--g1': bg[0], '--g2': bg[1], '--g3': bg[2], '--g4': bg[3] });
</script>

<template>
  <div id="aussagen">
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
        <div class="band-foot">
          <router-link :to="{ path: c.route, hash: `#${c.hash}` }" class="band-link">
            {{ $t(`claims.items.${c.key}.link`) }} <span aria-hidden="true">→</span>
          </router-link>
          <SourceTag v-if="c.source" :id="c.source" />
        </div>
      </div>
    </section>
  </div>
</template>
