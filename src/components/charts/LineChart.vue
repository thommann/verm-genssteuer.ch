<script setup>
import { computed } from 'vue';

const props = defineProps({
  // series: [{ name, color, dashed?, width?, points: [{x, y}] }]
  series: { type: Array, required: true },
  xDomain: { type: Array, default: null }, // [min, max]
  yDomain: { type: Array, default: null },
  xTicks: { type: Array, default: () => [] },
  yTicks: { type: Array, default: () => [] },
  formatX: { type: Function, default: (v) => v },
  formatY: { type: Function, default: (v) => v },
  height: { type: Number, default: 340 },
  width: { type: Number, default: 820 },
  yLabel: { type: String, default: '' },
});

const pad = { t: 16, r: 18, b: 34, l: 52 };

const allPts = computed(() => props.series.flatMap((s) => s.points).filter((p) => p.y != null && Number.isFinite(p.y)));

const xd = computed(() => props.xDomain || [
  Math.min(...allPts.value.map((p) => p.x)),
  Math.max(...allPts.value.map((p) => p.x)),
]);
const yd = computed(() => props.yDomain || [
  Math.min(...allPts.value.map((p) => p.y)),
  Math.max(...allPts.value.map((p) => p.y)),
]);

const sx = (x) => pad.l + ((x - xd.value[0]) / (xd.value[1] - xd.value[0] || 1)) * (props.width - pad.l - pad.r);
const sy = (y) => props.height - pad.b - ((y - yd.value[0]) / (yd.value[1] - yd.value[0] || 1)) * (props.height - pad.t - pad.b);

// Nur reale Messpunkte zeichnen, fehlende Werte (z. B. Welt 2024) brechen die Linie,
// statt auf 0 zu stürzen.
const finitePts = (pts) => pts.filter((p) => p.y != null && Number.isFinite(p.y) && Number.isFinite(p.x));
const linePath = (pts) =>
  finitePts(pts).map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' ');
const lastPt = (s) => { const f = finitePts(s.points); return f[f.length - 1]; };
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" class="line-chart" role="img">
    <!-- y grid + ticks -->
    <g class="grid">
      <g v-for="t in yTicks" :key="`y${t}`">
        <line :x1="pad.l" :x2="width - pad.r" :y1="sy(t)" :y2="sy(t)" />
        <text :x="pad.l - 8" :y="sy(t)" text-anchor="end" dominant-baseline="middle">{{ formatY(t) }}</text>
      </g>
    </g>
    <!-- x ticks -->
    <g class="axis">
      <text
        v-for="t in xTicks"
        :key="`x${t}`"
        :x="sx(t)"
        :y="height - pad.b + 20"
        text-anchor="middle"
      >{{ formatX(t) }}</text>
    </g>
    <!-- zero line if domain crosses zero -->
    <line
      v-if="yd[0] < 0 && yd[1] > 0"
      class="zero"
      :x1="pad.l"
      :x2="width - pad.r"
      :y1="sy(0)"
      :y2="sy(0)"
    />
    <!-- series -->
    <g v-for="s in series" :key="s.name">
      <path
        :d="linePath(s.points)"
        fill="none"
        :stroke="s.color"
        :stroke-width="s.width || 2"
        :stroke-dasharray="s.dashed ? '5 5' : 'none'"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <circle
        v-if="s.marker && lastPt(s)"
        :cx="sx(lastPt(s).x)"
        :cy="sy(lastPt(s).y)"
        r="3.5"
        :fill="s.color"
      />
    </g>
    <text v-if="yLabel" class="ylabel" :x="14" :y="pad.t + 4" text-anchor="start">{{ yLabel }}</text>
  </svg>
</template>

<style scoped>
.line-chart { width: 100%; height: auto; overflow: visible; }
.grid line { stroke: var(--border); stroke-width: 1; opacity: 0.45; }
.grid text, .axis text { fill: var(--text-mute); font-size: 12px; font-variant-numeric: tabular-nums; }
.zero { stroke: var(--text-mute); stroke-width: 1.2; stroke-dasharray: 2 3; }
.ylabel { fill: var(--text-mute); font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; }
</style>
