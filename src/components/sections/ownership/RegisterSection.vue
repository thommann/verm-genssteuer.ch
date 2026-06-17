<script setup>
// Erklär-Abschnitt zur Transparenzlücke des Grundbuchs. Gestaltet im dunklen
// Sektions-Look der Seite «Wem gehört die Schweiz?» (Eyebrow, Titel, Lead,
// Fliesstext in einer Karte), nicht als farbiges Vollband. Text und Belege
// liegen in i18n unter boden.eigentum (Block-Liste: 'p' Absatz, 'h' Zwischentitel,
// 'q' Zitat), die Quellen als Tags am Fuss.
import { useProseBlocks } from '@/composables/useProseBlocks.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const { blocks, sources } = useProseBlocks('boden.eigentum');
</script>

<template>
  <section id="bodeneigentum" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">{{ $t('boden.eigentum.eyebrow') }}</div>
      <h2 v-html="$t('boden.eigentum.title')" />
      <p class="lead" v-html="$t('boden.eigentum.lead')" />

      <div class="card artbox">
        <template v-for="(b, i) in blocks" :key="i">
          <h3 v-if="b.t === 'h'" class="block-h">{{ b.x }}</h3>
          <blockquote v-else-if="b.t === 'q'" class="pullquote">
            <p v-html="b.x" />
            <cite v-if="b.by">{{ b.by }}</cite>
          </blockquote>
          <p v-else class="body" v-html="b.x" />
        </template>

        <div class="srcrow">
          <SourceTag v-for="(s, i) in sources" :key="i" :id="s" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
h2 { max-width: 22ch; }
.lead { margin-top: 8px; }
.artbox { margin-top: 28px; padding: 30px 32px; }
.block-h { margin-top: 30px; color: var(--text); font-size: 1.15rem; }
.block-h:first-child { margin-top: 0; }
.body {
  margin: 0 0 14px;
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--text-soft);
  max-width: 68ch;
}
.body:last-of-type { margin-bottom: 0; }
.body :deep(strong) { color: var(--text); font-weight: 800; }
.body :deep(.hl) { color: var(--accent); font-weight: 800; }
h2 :deep(.hl) { color: var(--accent); }
.pullquote {
  margin: 24px 0 8px;
  padding: 4px 0 4px 20px;
  border-left: 4px solid var(--accent);
  max-width: 60ch;
}
.pullquote p {
  margin: 0;
  font-size: clamp(1.2rem, 2.4vw, 1.55rem);
  font-weight: 800;
  line-height: 1.35;
  color: var(--text);
  letter-spacing: -0.01em;
}
.pullquote cite {
  display: block; margin-top: 10px; font-style: normal;
  font-size: 0.86rem; font-weight: 700; color: var(--text-mute);
}
.srcrow { margin-top: 26px; }
</style>
