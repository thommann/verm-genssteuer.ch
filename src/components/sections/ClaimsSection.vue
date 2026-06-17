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
import { useScrollSpy } from '@/composables/useScrollSpy.js';
import { bandVars } from '@/lib/gradient.js';

// Hauptaussage: gleicher Verlauf wie die Hauptbotschaft-Slide (Variante A) im Deck.
const HERO_BG = ['#ff2d6b', '#ff7a33', '#d6249f', '#ff2d6b'];

const CLAIMS = [
  { id: 'lebensstandard', key: 'lebensstandard', route: '/hintergrund', hash: 'aufkauf', bg: ['#ff7a33', '#d6249f', '#ffb13c', '#ff2d6b'] },
  { id: 'wirtschaft', key: 'wirtschaft', route: '/hintergrund', hash: 'wirtschaft', bg: ['#ff7a33', '#ff2d6b', '#ff7a33', '#d6249f'] },
  { id: 'eigenheim', key: 'eigenheim', route: '/hintergrund', hash: 'aufkauf', bg: ['#ff2d6b', '#d6249f', '#c01651', '#ff2d6b'] },
  { id: 'krankenkasse', key: 'krankenkasse', route: '/rechner', hash: 'verwendung', bg: ['#d6249f', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'oev', key: 'oev', route: '/rechner', hash: 'verwendung', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'strassen', key: 'strassen', route: '/rechner', hash: 'verwendung', bg: ['#4f8bff', '#a78bfa', '#3b6fe0', '#7c3aed'] },
  { id: 'bildung', key: 'bildung', route: '/rechner', hash: 'verwendung', bg: ['#25e3c8', '#7c3aed', '#14c98a', '#a78bfa'] },
  { id: 'erfolgsmodell', key: 'erfolgsmodell', route: '/hintergrund', hash: 'wirtschaft', bg: ['#ff2d6b', '#ff7a33', '#d6249f', '#ff7a33'] },
  { id: 'mittelstand', key: 'mittelstand', route: '/hintergrund', hash: 'steuerluecke', source: 'zucman_g20', dark: true, bg: ['#ffce5c', '#ff7a33', '#ffb13c', '#ff7a33'] },
  { id: 'faire-steuern', key: 'faireSteuern', route: '/hintergrund', hash: 'steuerluecke', source: 'zucman_g20', bg: ['#a78bfa', '#ff2d6b', '#7c3aed', '#d6249f'] },
  { id: 'standort', key: 'standort', route: '/hintergrund', hash: 'loesung', bg: ['#14c98a', '#25e3c8', '#14c98a', '#4f8bff'] },
  { id: 'mindeststeuer', key: 'mindeststeuer', route: '/hintergrund', hash: 'loesung', bg: ['#25e3c8', '#4f8bff', '#14c98a', '#4f8bff'] },
  { id: 'kein-wegzug', key: 'keinWegzug', route: '/hintergrund', hash: 'loesung', source: 'zucman_g20', bg: ['#3b6fe0', '#a78bfa', '#4f8bff', '#7c3aed'] },
  { id: 'schon-fair', key: 'schonFair', route: '/hintergrund', hash: 'loesung', bg: ['#a78bfa', '#25e3c8', '#7c3aed', '#14c98a'] },
];

// Slogan-Band zum Abschluss der Startseite: Haupt-Slogan gross, die übrigen Kampagnen-
// Hashtags als Tag-Reihe darunter. Hashtags sind Marken-Tags und bleiben unübersetzt;
// nur die Begleittexte (Eyebrow, Unterzeile) liegen in i18n (slogans.*).
const HERO_SLOGAN = '#TaxWealthNotWork';
const SLOGAN_TAGS = [
  '#ArbeitEntlastenVermögenBesteuern',
  '#TaxTheSuperRich',
  '#SuperreicheBesteuern',
  '#ArbeitMussSichLohnen',
  '#WachsendeUngleichheit',
  '#MittelstandEntlasten',
];
const SLOGAN_BG = ['#ff2d6b', '#7c3aed', '#d6249f', '#4f8bff'];

// Beim Scrollen den Anker der gerade obenstehenden Aussage in die URL schreiben, damit
// jede Aussage (Hauptaussage #start plus alle Bänder) und das Slogan-Band verlink- und
// teilbar ist.
useScrollSpy(['start', ...CLAIMS.map((c) => c.id), 'slogan'], { syncHash: true });

// Aufklapp-Zustand je Aussage (mehrere gleichzeitig möglich).
const open = reactive({});
const toggle = (id) => { open[id] = !open[id]; };
</script>

<template>
  <div id="aussagen">
    <!-- Hauptaussage zuoberst, volle Breite, verlinkbar (#start). -->
    <header
      id="start"
      class="claim-band hero-band"
      :style="bandVars(HERO_BG)"
    >
      <div class="wrap">
        <div class="eyebrow">
          {{ $t('hero.eyebrow') }}
        </div>
        <h1
          class="band-text"
          v-html="$t('hero.title')"
        />
        <button
          type="button"
          class="band-cue"
          :aria-expanded="open.start ? 'true' : 'false'"
          aria-controls="expl-start"
          @click="toggle('start')"
        >
          <span class="band-cue-label">{{ $t('hero.expand') }}</span>
          <span
            class="band-cue-icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </button>
        <div
          class="band-collapse"
          :class="{ open: open.start }"
        >
          <div class="band-collapse-inner">
            <div
              id="expl-start"
              :aria-hidden="open.start ? 'false' : 'true'"
            >
              <p
                class="band-expl"
                v-html="$t('hero.explainText')"
              />
              <div class="band-foot">
                <router-link
                  :to="{ path: '/hintergrund', hash: '#geldfluss' }"
                  class="band-link"
                >
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
      :style="bandVars(c.bg)"
    >
      <div class="wrap">
        <div class="eyebrow">
          {{ $t(`claims.items.${c.key}.eyebrow`) }}
        </div>
        <p
          class="band-text"
          v-html="$t(`claims.items.${c.key}.text`)"
        />
        <button
          type="button"
          class="band-cue"
          :aria-expanded="open[c.id] ? 'true' : 'false'"
          :aria-controls="`expl-${c.id}`"
          @click="toggle(c.id)"
        >
          <span class="band-cue-label">{{ $t('claims.expand') }}</span>
          <span
            class="band-cue-icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </button>
        <div
          class="band-collapse"
          :class="{ open: open[c.id] }"
        >
          <div class="band-collapse-inner">
            <div
              :id="`expl-${c.id}`"
              :aria-hidden="open[c.id] ? 'false' : 'true'"
            >
              <p
                class="band-expl"
                v-html="$t(`claims.items.${c.key}.explainText`)"
              />
              <div class="band-foot">
                <router-link
                  :to="{ path: c.route, hash: `#${c.hash}` }"
                  class="band-link"
                >
                  {{ $t(`claims.items.${c.key}.link`) }} <span aria-hidden="true">→</span>
                </router-link>
                <SourceTag
                  v-if="c.source"
                  :id="c.source"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Slogan-Band: Abschluss der Kampagne, Haupt-Slogan plus Hashtag-Reihe. Keine
         Aussage im Sinne der Claims (kein Erklär-Link, keine Zahl/Quelle). -->
    <section
      id="slogan"
      class="claim-band slogan-band"
      :style="bandVars(SLOGAN_BG)"
    >
      <div class="wrap">
        <div class="eyebrow">
          {{ $t('slogans.eyebrow') }}
        </div>
        <p class="slogan-main">
          {{ HERO_SLOGAN }}
        </p>
        <p class="slogan-sub">
          {{ $t('slogans.sub') }}
        </p>
        <ul class="slogan-tags">
          <li
            v-for="h in SLOGAN_TAGS"
            :key="h"
          >
            {{ h }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-band { padding-top: clamp(104px, 17vh, 200px); }

.slogan-main {
  margin: 14px 0 0;
  /* #TaxWealthNotWork ist ein einziges langes Wort: Schriftgrösse so wählen, dass es auf
     schmalen Schirmen auf eine Zeile passt, statt mitten im Wort umzubrechen. */
  font-size: clamp(1.7rem, 7.5vw, 5.6rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: #fff;
  overflow-wrap: normal;
  word-break: keep-all;
  hyphens: none;
}
.slogan-sub {
  margin: clamp(14px, 2.5vh, 22px) 0 0;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}
.slogan-tags {
  list-style: none;
  margin: clamp(26px, 4vh, 40px) 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.slogan-tags li {
  padding: 10px 18px;
  border-radius: 999px;
  /* Auf schmalen Schirmen kleiner werden, damit der längste Hashtag in eine Pille passt
     und die Zeile nicht über den Rand läuft; Umbruch als letzte Sicherung. */
  font-size: clamp(0.82rem, 2vw, 1.15rem);
  font-weight: 800;
  color: #fff;
  background: rgba(11, 16, 32, 0.28);
  border: 2px solid rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow-wrap: anywhere;
}
</style>
