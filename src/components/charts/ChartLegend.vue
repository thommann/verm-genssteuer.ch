<script setup>
// Legende für Diagramme: eine Reihe farbiger Swatches mit Beschriftung. Der vertikale
// Abstand zum Diagramm wird per Inline-Style gesetzt, weil die Legende mal über, mal
// unter dem Chart steht.
defineProps({
  // [{ color, label }]
  items: { type: Array, required: true },
});
</script>

<template>
  <div class="legend">
    <span v-for="it in items" :key="it.label">
      <i class="sw" :style="{ background: it.color }" /> {{ it.label }}
    </span>
  </div>
</template>

<style scoped>
.legend { display: flex; flex-wrap: wrap; gap: 18px; font-size: 0.82rem; color: var(--text-soft); }
.sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
</style>
