<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculator } from '@/composables/useCalculator.js';
import RangeControl from '@/components/ui/RangeControl.vue';
import LineChart from '@/components/charts/LineChart.vue';
import { chfCompact, pct } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const calc = useCalculator();
const { state, nettoProjection } = calc;

const series = computed(() => [
  {
    name: t('projection.seriesName'),
    color: 'var(--accent)',
    width: 3,
    marker: true,
    points: nettoProjection.value.map((p) => ({ x: p.year, y: p.revenue / 1e9 })),
  },
]);

const yMax = computed(() => Math.max(...nettoProjection.value.map((p) => p.revenue / 1e9)) * 1.08);
const yTicks = computed(() => {
  const top = yMax.value;
  const step = top > 80 ? 25 : top > 40 ? 20 : 10;
  const out = [];
  for (let v = 0; v <= top; v += step) out.push(v);
  return out;
});
const xTicks = computed(() => nettoProjection.value.map((p) => p.year).filter((_, i) => i % 2 === 0));

const first = computed(() => nettoProjection.value[0].revenue);
const last = computed(() => nettoProjection.value[nettoProjection.value.length - 1].revenue);

// Richtung der Hochrechnung: steile Modelle sinken auf ein tragbares Niveau,
// milde Modelle bremsen kaum, dann wächst das Aufkommen weiter.
const trend = computed(() => {
  const delta = last.value - first.value;
  if (Math.abs(delta) < first.value * 0.02) return 'flat';
  return delta < 0 ? 'down' : 'up';
});
const lastLabel = computed(() => ({
  down: t('projection.lastLabelDown'),
  up: t('projection.lastLabelUp'),
  flat: t('projection.lastLabelFlat'),
})[trend.value]);
</script>

<template>
  <section id="dynamik">
    <div class="wrap">
      <div class="eyebrow">{{ $t('projection.eyebrow') }}</div>
      <h2 v-html="$t('projection.title')" />
      <p class="lead" v-html="$t('projection.lead')" />

      <div class="proj-grid">
        <div class="card chartbox">
          <LineChart
            :aria-label="$t('projection.title')"
            :series="series"
            :x-domain="[2022, 2032]"
            :y-domain="[0, yMax]"
            :x-ticks="xTicks"
            :y-ticks="yTicks"
            :format-x="(v) => String(v)"
            :format-y="(v) => `${v}`"
            :y-label="$t('projection.yLabel')"
            :height="320"
          />
        </div>
        <div class="card side">
          <div class="sidestat">
            <span class="sv accent">{{ chfCompact(first, 1) }}</span>
            <span class="sl">{{ $t('projection.firstLabel') }}</span>
          </div>
          <!-- Pfeil zeigt die Leserichtung von oben (erstes Jahr) nach unten (2032),
               unabhängig vom Trend. -->
          <div class="arrow">↓</div>
          <div class="sidestat">
            <span class="sv gold">{{ chfCompact(last, 1) }}</span>
            <span class="sl">{{ lastLabel }}</span>
          </div>

          <RangeControl
            v-model="state.rendite"
            :min="0.02"
            :max="0.15"
            :step="0.005"
            :label="$t('projection.renditeLabel')"
            :display="pct(state.rendite, 1)"
            :hint="$t('projection.renditeHint')"
          />
          <p class="muted small" v-html="$t('projection.formula')" />
        </div>
      </div>
      <div class="srcs">
        <SourceTag id="estv_vermoegen" :note="$t('projection.sourceNoteEstv')" />
        <SourceTag id="fdk" :note="$t('projection.sourceNoteFdk')" />
        <SourceTag id="wir2022_wachstum" :note="$t('projection.sourceNoteRendite')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.srcs { margin-top: 14px; }
.proj-grid { display: grid; grid-template-columns: 1fr; gap: 18px; align-items: stretch; }
.side { padding: 24px; display: flex; flex-direction: column; gap: 6px; justify-content: center; }
.sidestat { display: flex; flex-direction: column; }
.sv { font-size: 1.7rem; font-weight: 800; }
.sv.accent { color: var(--accent); }
.sv.gold { color: var(--gold); }
.sl { color: var(--text-soft); font-size: 0.85rem; }
.arrow { font-size: 1.4rem; color: var(--text-mute); margin: 2px 0; }
.small { font-size: 0.78rem; margin-top: 10px; }
/* Die Formel kommt per v-html (projection.formula) und traegt kein scope-Attribut,
   daher den code-Chip ueber :deep ansprechen. */
.small :deep(code) { background: rgba(255, 255, 255, 0.06); padding: 1px 6px; border-radius: 6px; font-size: 0.78rem; }
</style>
