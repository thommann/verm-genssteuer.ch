<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Einklappbarer Bereich, der nur auf schmalen Screens (Mobile) zusammenfaltet.
// Auf dem Desktop ist er ein reiner Passthrough: Überschrift (optional) plus Inhalt,
// ohne Toggle. So bleibt das Desktop-Layout unverändert, während auf dem Handy
// fortgeschrittene Teile (Regler, Diagramme, Rendite, Wegzug) in die Details
// «verschwinden» und der Blick frei ist für Steuermodell, Ertrag und Verwendung.

const props = defineProps({
  // Beschriftung des Toggles auf Mobile (Fallback, wenn kein title gesetzt ist).
  label: { type: String, default: '' },
  // Eyebrow und Titel eines Abschnitts; auf dem Desktop als Überschrift gerendert.
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  headingTag: { type: String, default: 'h2' },
  // Auf dem Desktop die Überschrift (eyebrow/title) zeigen. Für reine Werkzeug-
  // Bereiche (Regler) ohne eigene Überschrift auf false setzen.
  headingOnDesktop: { type: Boolean, default: true },
});

const MOBILE_QUERY = '(max-width: 820px)';
const isMobile = ref(typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches);
const open = ref(false);

let mql = null;
const sync = () => { isMobile.value = mql.matches; };
onMounted(() => {
  mql = window.matchMedia(MOBILE_QUERY);
  sync();
  mql.addEventListener('change', sync);
});
onUnmounted(() => mql && mql.removeEventListener('change', sync));

// Beim Wechsel auf Mobile wieder eingeklappt starten.
watch(isMobile, (m) => { if (m) open.value = false; });

let _id = 0;
const bodyId = `md-body-${(_id = Math.random().toString(36).slice(2, 8))}`;
</script>

<template>
  <!-- Desktop: unveränderte Darstellung -->
  <div v-if="!isMobile" class="md-desktop">
    <template v-if="headingOnDesktop && (eyebrow || title)">
      <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
      <component :is="headingTag" v-if="title" v-html="title" />
    </template>
    <slot />
  </div>

  <!-- Mobile: einklappbar -->
  <div v-else class="md" :class="{ open }">
    <button
      type="button"
      class="md-cue"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="bodyId"
      @click="open = !open"
    >
      <span class="md-cue-text">
        <span v-if="eyebrow" class="md-cue-eyebrow">{{ eyebrow }}</span>
        <span class="md-cue-title" v-html="title || label" />
      </span>
      <svg class="md-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div class="md-collapse" :class="{ open }">
      <div class="md-collapse-inner">
        <div :id="bodyId" :aria-hidden="open ? 'false' : 'true'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md { margin: 16px 0; }

.md-cue {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 16px; border-radius: 12px; text-align: left;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text);
  transition: border-color 0.12s ease, background 0.12s ease;
}
.md-cue:hover { border-color: var(--accent); }
.md.open .md-cue { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

.md-cue-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.md-cue-eyebrow {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--text-mute);
}
.md-cue-title { font-weight: 700; font-size: 1.02rem; line-height: 1.25; }
.md-cue-title :deep(span) { color: inherit; }

.md-chevron {
  flex: none; width: 22px; height: 22px; color: var(--text-soft);
  transition: transform 0.3s ease;
}
.md.open .md-chevron { transform: rotate(180deg); }

/* Höhenanimation per grid-template-rows (0fr -> 1fr). */
.md-collapse {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
  border: 1px solid var(--border); border-top: none;
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
}
.md-collapse:not(.open) { border-color: transparent; }
.md-collapse.open { grid-template-rows: 1fr; }
.md-collapse-inner { overflow: hidden; min-height: 0; }
.md-collapse.open .md-collapse-inner { padding: 16px 2px 2px; }

@media (prefers-reduced-motion: reduce) {
  .md-collapse { transition: none; }
  .md-chevron { transition: none; }
}
</style>
