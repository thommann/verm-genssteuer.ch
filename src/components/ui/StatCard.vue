<script setup>
// Kompakte Kennzahl-Karte: grosse Zahl plus Label, als Glas-Karte. Genutzt in den
// Verteilungs-/Eigentums-Sektionen. Der Zahlenwert liegt im «value»-Slot (erlaubt
// Inline-Markup, Einheiten via <span class="unit"> und Spannen), das Label im
// «label»-Slot; weiterer Inhalt (z. B. ein <SourceTag>) kommt in den Default-Slot.
defineProps({
  // Farbe der grossen Zahl: '' (Standard), 'accent' oder 'gold'.
  tone: { type: String, default: '' },
});
</script>

<template>
  <div class="card stat-card">
    <span
      class="stat-v"
      :class="tone"
    ><slot name="value" /></span>
    <span class="stat-l"><slot name="label" /></span>
    <slot />
  </div>
</template>

<style scoped>
.stat-card { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.stat-v { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.stat-v.accent { color: var(--accent); }
.stat-v.gold { color: var(--gold); }
.stat-l { color: var(--text-soft); font-size: 0.88rem; }
/* Einheit hinter der Zahl (per Slot, daher :deep). */
.stat-v :deep(.unit) { font-size: 1rem; font-weight: 700; color: var(--text-soft); }
</style>
