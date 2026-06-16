<script setup>
import { ref } from 'vue';

// Einklappbarer Detail-Bereich, auf allen Bildschirmgroessen gleich: das Wichtigste
// steht offen, fortgeschrittene Teile (Regler, Diagramme, Rendite, Wegzug) klappen
// darunter ein und sind per Klick abrufbar. Standardmaessig geschlossen.

const props = defineProps({
  // Beschriftung des Toggles (Fallback, wenn kein title gesetzt ist).
  label: { type: String, default: '' },
  // Eyebrow und Titel; im Toggle als Abschnitts-Kopf dargestellt.
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
});

const open = ref(false);
const bodyId = `dp-body-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div class="dp" :class="{ open }">
    <button
      type="button"
      class="dp-cue"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="bodyId"
      @click="open = !open"
    >
      <span class="dp-cue-text">
        <span v-if="eyebrow" class="dp-cue-eyebrow">{{ eyebrow }}</span>
        <span class="dp-cue-title" v-html="title || label" />
      </span>
      <svg class="dp-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div class="dp-collapse" :class="{ open }">
      <div class="dp-collapse-inner">
        <div :id="bodyId" :aria-hidden="open ? 'false' : 'true'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp { margin: 18px 0; }

.dp-cue {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 16px 18px; border-radius: 14px; text-align: left;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text);
  transition: border-color 0.12s ease, background 0.12s ease;
}
.dp-cue:hover { border-color: var(--accent); background: rgba(255, 255, 255, 0.07); }
.dp.open .dp-cue { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

.dp-cue-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.dp-cue-eyebrow {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--text-mute);
}
.dp-cue-title { font-weight: 700; font-size: 1.12rem; line-height: 1.25; }
.dp-cue-title :deep(span) { color: inherit; }

.dp-chevron {
  flex: none; width: 24px; height: 24px; color: var(--text-soft);
  transition: transform 0.3s ease;
}
.dp.open .dp-chevron { transform: rotate(180deg); }

/* Hoehenanimation per grid-template-rows (0fr -> 1fr). */
.dp-collapse {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
  border: 1px solid transparent; border-top: none;
  border-bottom-left-radius: 14px; border-bottom-right-radius: 14px;
}
.dp-collapse.open { grid-template-rows: 1fr; border-color: var(--border); }
.dp-collapse-inner { overflow: hidden; min-height: 0; }
.dp-collapse.open .dp-collapse-inner { padding: 18px 2px 2px; }

@media (prefers-reduced-motion: reduce) {
  .dp-collapse { transition: none; }
  .dp-chevron { transition: none; }
}
</style>
