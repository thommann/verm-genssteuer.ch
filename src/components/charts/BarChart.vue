<script setup>
import { computed } from 'vue';

const props = defineProps({
  // items: [{ label, value, color?, sub?, range? }]
  items: { type: Array, required: true },
  formatValue: { type: Function, default: (v) => v },
  max: { type: Number, default: null },
  accent: { type: String, default: 'var(--accent)' },
  // Überschrift der optionalen Range-Spalte (z. B. Steuersatz)
  rangeLabel: { type: String, default: '' },
});

const maxVal = computed(() => props.max ?? Math.max(...props.items.map((i) => i.value), 1));
const widthPct = (v) => `${Math.max(0, (v / maxVal.value) * 100)}%`;
const hasRange = computed(() => props.items.some((i) => i.range != null));
</script>

<template>
  <div :class="['bars', { 'with-range': hasRange }]">
    <div v-if="hasRange && rangeLabel" class="bar-row bar-head">
      <div class="bar-label" />
      <div class="bar-range head">{{ rangeLabel }}</div>
      <div />
      <div />
    </div>
    <div v-for="it in items" :key="it.label" class="bar-row">
      <div class="bar-label">
        <span>{{ it.label }}</span>
        <span v-if="it.sub" class="bar-sub">{{ it.sub }}</span>
      </div>
      <div v-if="hasRange" class="bar-range tnum">{{ it.range }}</div>
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{ width: widthPct(it.value), background: it.color || accent }"
        />
      </div>
      <div class="bar-value tnum">{{ formatValue(it.value) }}</div>
    </div>
  </div>
</template>

<style scoped>
.bars { display: flex; flex-direction: column; gap: 12px; }
.bar-row {
  display: grid;
  grid-template-columns: minmax(120px, 200px) 1fr auto;
  align-items: center;
  gap: 14px;
}
.with-range .bar-row { grid-template-columns: minmax(96px, 160px) auto 1fr auto; }
.bar-label { display: flex; flex-direction: column; font-weight: 600; font-size: 0.92rem; }
.bar-sub { font-weight: 500; font-size: 0.76rem; color: var(--text-mute); }
.bar-range { font-weight: 600; font-size: 0.84rem; color: var(--text-soft); white-space: nowrap; }
.bar-range.head { color: var(--text-mute); font-weight: 600; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.03em; }
.bar-head { align-items: end; }
.bar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  height: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  min-width: 2px;
}
.bar-value { font-weight: 700; font-size: 0.92rem; min-width: 72px; text-align: right; }
@media (max-width: 620px) {
  .bar-row { grid-template-columns: 1fr auto; grid-template-areas: 'label value' 'track track'; }
  .with-range .bar-row { grid-template-columns: 1fr auto; grid-template-areas: 'label value' 'range range' 'track track'; }
  .bar-label { grid-area: label; }
  .bar-value { grid-area: value; }
  .bar-range { grid-area: range; }
  .bar-track { grid-area: track; }
  .bar-head { display: none; }
}
</style>
