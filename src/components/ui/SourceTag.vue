<script setup>
import sources from '@/data/sources.json';

const props = defineProps({
  id: { type: String, required: true },
  note: { type: String, default: '' },
});

const src = sources.find((s) => s.id === props.id);
</script>

<template>
  <a
    v-if="src"
    class="source-tag"
    :href="src.url"
    target="_blank"
    rel="noopener"
    :title="src.titel"
  >
    <span class="dot" />
    Quelle: {{ src.kurz }}<template v-if="note"> · {{ note }}</template>
  </a>
</template>

<style scoped>
.source-tag {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.74rem; color: var(--text-mute); font-weight: 600;
  text-decoration: none; letter-spacing: 0.01em;
}
.source-tag:hover { color: var(--text-soft); text-decoration: none; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex: none; }
</style>
