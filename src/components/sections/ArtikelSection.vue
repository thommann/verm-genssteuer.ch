<script setup>
// Wiederverwendbare Artikel-Sektion der Hintergrund-Seite, gestaltet als vollflaechiges
// Farbband wie die Aussage-Baender der Startseite (gleiche Verlauf-Technik ueber --g1..--g4).
// Struktur (Anker, Verlauf) kommt aus der Seite; Text und Belege liegen in i18n unter
// hintergrund.<id>. Der Fliesstext ist eine Block-Liste (t: 'p' Absatz, 'h' Zwischentitel,
// 'q' Zitat). Die Quellen der Sektion stehen als Quellen-Tags am Fuss.
import { computed } from 'vue';
import SourceTag from '@/components/ui/SourceTag.vue';
import { useProseBlocks } from '@/composables/useProseBlocks.js';
import { bandVars } from '@/lib/gradient.js';

const props = defineProps({
  id: { type: String, required: true },
  anchor: { type: String, required: true },
  bg: { type: Array, required: true },
  // i18n-Namensraum des Artikels (Standard: hintergrund). So laesst sich dasselbe
  // Artikel-Band bei Bedarf auch mit Texten aus einem anderen Namensraum einsetzen.
  ns: { type: String, default: 'hintergrund' },
});

const base = computed(() => `${props.ns}.${props.id}`);
const { tm, r, blocks, sources } = useProseBlocks(() => base.value);

// Passendes Video von Gary's Economics (Uploader und Titel ueber YouTube-oEmbed geprueft,
// dokumentiert in docs/QUELLEN.md).
const video = computed(() => {
  const v = tm(`${base.value}.video`);
  return v && v.url ? { url: r(v.url), title: r(v.title) } : null;
});
</script>

<template>
  <section
    :id="anchor"
    class="claim-band art-band"
    :style="bandVars(bg)"
  >
    <div class="wrap">
      <div class="eyebrow">
        {{ $t(`${ns}.${id}.eyebrow`) }}
      </div>
      <h2 v-html="$t(`${ns}.${id}.title`)" />
      <p
        class="lead"
        v-html="$t(`${ns}.${id}.lead`)"
      />

      <template
        v-for="(b, i) in blocks"
        :key="i"
      >
        <h3
          v-if="b.t === 'h'"
          class="block-h"
        >
          {{ b.x }}
        </h3>

        <blockquote
          v-else-if="b.t === 'q'"
          class="pullquote"
        >
          <p v-html="b.x" />
          <cite v-if="b.by">{{ b.by }}</cite>
        </blockquote>

        <p
          v-else
          class="body"
          v-html="b.x"
        />
      </template>

      <a
        v-if="video"
        class="video-link"
        :href="video.url"
        target="_blank"
        rel="noopener"
      >
        <span
          class="vl-icon"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span class="vl-text">
          {{ $t('hintergrund.videoCta') }}
          <span class="vl-title">«{{ video.title }}»</span>
        </span>
      </a>

      <div class="srcrow">
        <SourceTag
          v-for="(s, i) in sources"
          :id="s"
          :key="i"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Etwas staerkerer Dunkel-Schleier als bei den kurzen Aussage-Baendern, damit der lange
   Fliesstext auf dem Verlauf gut lesbar bleibt. */
.claim-band.art-band::after { background: rgba(5, 7, 15, 0.22); }

.art-band h2 {
  margin: 6px 0 0;
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  color: #fff;
  max-width: 22ch;
}
.art-band .lead {
  margin: 18px 0 0;
  max-width: 60ch;
  color: rgba(255, 255, 255, 0.96);
  font-weight: 600;
}
.art-band .lead :deep(.hl) { color: #fff; font-weight: 800; }

.block-h {
  margin-top: 34px;
  color: #fff;
  font-size: 1.2rem;
}

.body {
  margin: 16px 0 0;
  font-size: 1.04rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.94);
  max-width: 64ch;
}
.body :deep(strong) { color: #fff; font-weight: 800; }
.body :deep(a) { color: #fff; text-decoration: underline; text-underline-offset: 3px; font-weight: 700; }
.body :deep(a:hover) { text-decoration: none; }
/* .hl im Fliesstext nur als farbliche Hervorhebung (kein Marker) und auf dem Band weiss. */
.body :deep(.hl) { background: none; padding: 0; border-radius: 0; color: #fff; font-weight: 800; }

.pullquote {
  margin: 30px 0 6px;
  padding: 6px 0 6px 22px;
  border-left: 4px solid rgba(255, 255, 255, 0.7);
  max-width: 60ch;
}
.pullquote p {
  margin: 0;
  font-size: clamp(1.3rem, 2.8vw, 1.8rem);
  font-weight: 800;
  line-height: 1.3;
  color: #fff;
  letter-spacing: -0.01em;
}
.pullquote cite {
  display: block;
  margin-top: 12px;
  font-style: normal;
  font-size: 0.88rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.video-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 11px 20px 11px 14px;
  border-radius: 999px;
  background: rgba(11, 16, 32, 0.32);
  border: 2px solid rgba(255, 255, 255, 0.55);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.96rem;
  transition: transform 0.12s ease, background 0.12s ease;
}
.video-link:hover { transform: translateY(-1px); background: rgba(11, 16, 32, 0.46); text-decoration: none; }
.vl-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; flex: none; border-radius: 999px;
  background: #ff0000; color: #fff;
}
.vl-icon svg { width: 16px; height: 16px; display: block; }
.vl-text { display: flex; flex-direction: column; line-height: 1.25; }
.vl-title { font-weight: 600; font-size: 0.84rem; color: rgba(255, 255, 255, 0.85); }

.srcrow { margin-top: 26px; }
</style>
