<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculator, PRESETS, PRESET_GROUPS } from '@/composables/useCalculator.js';
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chfCompact, chf, pct, num } from '@/lib/format.js';

const k = kennzahlen.unbeschraenkt['2022'];
import RangeControl from '@/components/ui/RangeControl.vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const calc = useCalculator();
const {
  state, model,
  nettoStatisch, nettoDauerhaft,
  bands, curve, equilibrium,
} = calc;

const onSlider = () => calc.markCustom();

// Tarifkurve auf Log-Vermögensachse
const TICKS_W = [5e6, 1e7, 1e8, 1e9, 1e10];
const curveSeries = computed(() => [
  {
    name: t('calculator.curveSeriesMarginal'),
    color: 'var(--accent)',
    width: 2.5,
    points: curve.value.map((p) => ({ x: Math.log10(p.W), y: p.marginal })),
  },
  {
    name: t('calculator.curveSeriesAvg'),
    color: 'var(--gold)',
    width: 2.5,
    points: curve.value.map((p) => ({ x: Math.log10(p.W), y: p.avg })),
  },
]);
const yMax = computed(() => Math.min(1, Math.max(0.05, ...curve.value.map((p) => p.marginal))));
const yTicks = computed(() => {
  const step = yMax.value > 0.5 ? 0.25 : yMax.value > 0.2 ? 0.1 : 0.05;
  const out = [];
  for (let v = 0; v <= yMax.value + 1e-9; v += step) out.push(Number(v.toFixed(2)));
  return out;
});

const bandItems = computed(() =>
  bands.value.map((b, i) => ({ label: t(`calculator.bands.${i}`), value: b.value, color: 'var(--teal)' }))
);

const schwelleDisplay = computed(() => chfCompact(state.schwelle, 0));

// Cap-Hinweis nur zeigen, wenn das Modell überhaupt einen (endlichen) Cap hat.
const capBinds = computed(() => Number.isFinite(model.value.wcap));

// Presets in Anzeige-Zeilen gruppieren (Unsere / WIR 2022).
// Beschriftungen kommen aus der i18n-Locale, daher als Computed (reaktiv zur Sprache).
const presetRows = computed(() =>
  PRESET_GROUPS.map((g) => ({
    id: g.id,
    label: g.labelKey ? t(g.labelKey) : '',
    items: Object.keys(PRESETS)
      .filter((key) => PRESETS[key].group === g.id)
      .map((key) => ({ key, label: t(`presets.${key}`) })),
  }))
);

const isWir2022 = computed(() =>
  ['wir2022_1', 'wir2022_2', 'wir2022_3'].includes(state.activePreset)
);
// Bei aktivem WIR-Modell steuern die Regler (Potenzkurve) nicht das angezeigte Modell.
const isWirActive = computed(() => isWir2022.value);

// Erstes Preset der Gruppe «Unsere»: Ziel beim Zurückwechseln zum eigenen Modell.
const firstOwnPreset = Object.keys(PRESETS).find((key) => PRESETS[key].group === 'meine');
</script>

<template>
  <section id="rechner">
    <div class="wrap">
      <div class="eyebrow">{{ $t('calculator.eyebrow') }}</div>
      <h2 v-html="$t('calculator.title')" />
      <p class="lead">{{ $t('calculator.lead') }}</p>

      <div class="presets">
        <div v-for="g in presetRows" :key="g.id" class="preset-row">
          <span v-if="g.label" class="presets-label">{{ g.label }}</span>
          <button
            v-for="p in g.items"
            :key="p.key"
            class="preset"
            :class="{ active: state.activePreset === p.key }"
            @click="calc.applyPreset(p.key)"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <p v-if="isWir2022" class="preset-note">
        <span v-html="$t('calculator.presetNoteWir2022')" />
        <SourceTag id="wir2022" :note="$t('calculator.presetNoteWir2022Source')" />
      </p>

      <p
        v-if="!isWirActive"
        class="threshold-info"
        v-html="$t('calculator.thresholdInfo', {
          cnt: num(k.cnt_ge5M),
          rest: pct(1 - k.pct_ge5M, 0),
          share: pct(k.share_ge5M, 0),
        })"
      />

      <div class="calc-grid">
        <!-- Controls -->
        <div class="card controls">
          <p v-if="isWirActive" class="controls-lock">
            <span v-html="$t('calculator.controlsLock')" />
            <button type="button" class="controls-lock-link" @click="calc.applyPreset(firstOwnPreset)">{{ $t('calculator.controlsLockLink') }}</button>{{ $t('calculator.controlsLockAfter') }}
          </p>
          <div v-if="!isWirActive">
            <RangeControl
              v-model="state.schwelle"
              :min="5e6"
              :max="5e7"
              :step="5e5"
              :label="$t('calculator.schwelleLabel')"
              :display="schwelleDisplay"
              :hint="$t('calculator.schwelleHint')"
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.basis"
              :min="0.0005"
              :max="0.05"
              :step="0.0005"
              :label="$t('calculator.basisLabel')"
              :display="pct(state.basis, 2)"
              :hint="$t('calculator.basisHint')"
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.exponent"
              :min="0"
              :max="1.6"
              :step="0.05"
              :label="$t('calculator.exponentLabel')"
              :display="num(state.exponent, 2)"
              :hint="$t('calculator.exponentHint')"
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.cap"
              :min="0.05"
              :max="1"
              :step="0.05"
              :label="$t('calculator.capLabel')"
              :display="pct(state.cap, 0)"
              :hint="$t('calculator.capHint')"
              @update:modelValue="onSlider"
            />
          </div>

          <div class="year-pick">
            <span>{{ $t('calculator.yearLabel') }}</span>
            <button
              v-for="y in calc.years"
              :key="y"
              class="ychip"
              :class="{ active: state.year === y }"
              @click="state.year = y"
            >{{ y }}</button>
          </div>
        </div>

        <!-- Headline result -->
        <div class="card result">
          <div class="result-main">
            <div class="result-label">{{ $t('calculator.resultLabel', { year: state.year }) }}</div>
            <div class="result-value" :class="{ negative: nettoStatisch < 0 }">
              {{ chfCompact(nettoStatisch, 1) }}
            </div>
            <div class="result-unit">{{ $t('calculator.resultUnit') }}</div>
          </div>
          <div class="result-sub">
            <div>
              <span class="rs-val gold">{{ chfCompact(nettoDauerhaft, 1) }}</span>
              <span class="rs-lab" v-html="$t('calculator.sustainableLabel')" />
            </div>
            <div>
              <span class="rs-val">{{ pct(model.avgRate(model.schwelle * 2), 1) }}</span>
              <span class="rs-lab">{{ $t('calculator.avgRateLabel', { wealth: chfCompact(model.schwelle * 2, 0) }) }}</span>
            </div>
          </div>
          <p class="readout muted">
            <template v-if="capBinds">{{ $t('calculator.readoutCap', { wcap: chfCompact(model.wcap, 0) }) }}</template>
            <template v-if="equilibrium">
              {{ $t('calculator.readoutEquilibrium', { eq: chfCompact(equilibrium, 0) }) }}
            </template>
          </p>
        </div>

        <!-- Tariff curve -->
        <div class="card chartbox">
          <h3>{{ $t('calculator.curveTitle') }}</h3>
          <LineChart
            :series="curveSeries"
            :x-domain="[Math.log10(model.schwelle), Math.log10(2e10)]"
            :y-domain="[0, yMax]"
            :x-ticks="TICKS_W.map((w) => Math.log10(w))"
            :y-ticks="yTicks"
            :format-x="(lx) => chfCompact(Math.pow(10, lx), 0)"
            :format-y="(v) => pct(v, 0)"
            :height="300"
          />
          <div class="legend">
            <span><i class="sw" style="background: var(--accent)" /> {{ $t('calculator.curveLegendMarginal') }}</span>
            <span><i class="sw" style="background: var(--gold)" /> {{ $t('calculator.curveLegendAvg') }}</span>
          </div>
        </div>

        <!-- Revenue by band -->
        <div class="card chartbox">
          <h3>{{ $t('calculator.bandTitle') }}</h3>
          <BarChart
            :items="bandItems"
            :format-value="(v) => chfCompact(v, 1)"
            accent="var(--teal)"
          />
          <p class="note muted" v-html="$t('calculator.bandNote')" />
        </div>
      </div>

      <p class="disclaimer">
        <span v-html="$t('calculator.disclaimerOhneWegzug')" />
        <span class="srcs">
          <SourceTag id="estv_vermoegen" :note="$t('calculator.sourceNoteEstv')" />
          <SourceTag id="fdk" :note="$t('calculator.sourceNoteFdk')" />
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.presets { display: flex; flex-direction: column; gap: 10px; margin: 26px 0 22px; }
.preset-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.presets-label { color: var(--text-mute); font-size: 0.85rem; font-weight: 600; min-width: 76px; }
.preset {
  padding: 8px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
  transition: all 0.12s ease;
}
.preset:hover { color: var(--text); border-color: var(--accent); }
.preset.active { background: var(--accent); border-color: var(--accent); color: #1a0008; }

.preset-note {
  font-size: 0.84rem; line-height: 1.55; color: var(--text-soft);
  max-width: 72ch; margin: 0 0 18px;
  padding: 12px 16px; border-radius: 10px;
  background: rgba(124, 92, 255, 0.08);
  border: 1px solid var(--border); border-left: 3px solid var(--violet);
  display: flex; flex-direction: column; gap: 8px;
}
.preset-note :deep(strong) { color: var(--text); }

.threshold-info {
  font-size: 0.86rem; line-height: 1.55; color: var(--text-soft);
  max-width: 72ch; margin: 0 0 24px;
  padding: 14px 16px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border); border-left: 3px solid var(--gold);
}
.threshold-info :deep(strong) { color: var(--text); }

.calc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}
.controls { padding: 24px; }
.controls-lock {
  font-size: 0.82rem; line-height: 1.5; color: var(--text-soft);
  margin: 0 0 18px; padding: 10px 12px; border-radius: 8px;
  background: rgba(56, 214, 196, 0.08);
  border: 1px solid var(--border); border-left: 3px solid var(--teal);
}
.controls-lock :deep(strong) { color: var(--text); }
.controls-lock-link {
  background: none; border: none; padding: 0; font: inherit;
  color: var(--teal); text-decoration: underline; cursor: pointer;
}
.result {
  padding: 28px 24px;
  background: linear-gradient(160deg, #1d2952, #161f3d);
  border-color: #34407a;
}
.readout { font-size: 0.82rem; margin: 0; }

.chartbox { padding: 22px 24px; }
.chartbox h3 { margin-bottom: 14px; }
.legend { display: flex; gap: 18px; font-size: 0.8rem; color: var(--text-soft); margin-top: 12px; flex-wrap: wrap; }
.legend .sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
.note { font-size: 0.8rem; margin: 14px 0 0; }

.year-pick { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.year-pick span { color: var(--text-mute); font-size: 0.85rem; font-weight: 600; }
.ychip {
  padding: 5px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.ychip.active { background: var(--gold); border-color: var(--gold); color: #1a1400; }

.disclaimer { font-size: 0.82rem; color: var(--text-mute); margin-top: 22px; max-width: 75ch; display: flex; flex-direction: column; gap: 8px; }
.disclaimer .srcs { display: flex; gap: 18px; flex-wrap: wrap; }

@media (max-width: 820px) {
  .calc-grid { grid-template-columns: 1fr; }
}
</style>
