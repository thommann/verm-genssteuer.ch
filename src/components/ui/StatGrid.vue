<script setup>
// Responsives Raster für StatCard-Kacheln (auto-fit, min. 220px). Der vertikale
// Aussenabstand kann per Inline-Style überschrieben werden, weil er je nach Position
// (nach Lead oder nach Zwischentitel) variiert.
</script>

<template>
  <div class="stat-grid">
    <slot />
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--card-gap);
  margin: 24px 0 16px;
}
</style>
