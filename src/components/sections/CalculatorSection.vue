<script setup>
import { computed } from 'vue';
import { useCalculator, PRESETS, PRESET_GROUPS } from '@/composables/useCalculator.js';
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chfCompact, chf, pct, num } from '@/lib/format.js';

const k = kennzahlen.unbeschraenkt['2022'];
import RangeControl from '@/components/ui/RangeControl.vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const calc = useCalculator();
const { state, model, staticRevenue, sustainableRevenue, bands, curve, equilibrium } = calc;

const onSlider = () => calc.markCustom();

// Tarifkurve auf Log-Vermögensachse
const TICKS_W = [5e6, 1e7, 1e8, 1e9, 1e10];
const curveSeries = computed(() => [
  {
    name: 'Grenzsatz',
    color: 'var(--accent)',
    width: 2.5,
    points: curve.value.map((p) => ({ x: Math.log10(p.W), y: p.marginal })),
  },
  {
    name: 'Ø-Satz',
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
  bands.value.map((b) => ({ label: b.label, value: b.value, color: 'var(--teal)' }))
);

const schwelleDisplay = computed(() => chfCompact(state.schwelle, 0));

// Cap-Hinweis nur zeigen, wenn das Modell überhaupt einen (endlichen) Cap hat.
const capBinds = computed(() => Number.isFinite(model.value.wcap));

// Presets in drei Anzeige-Zeilen gruppieren (Unsere / WIR 2022 / WIR 2026).
const presetRows = PRESET_GROUPS.map((g) => ({
  ...g,
  items: Object.entries(PRESETS)
    .filter(([, p]) => p.group === g.id)
    .map(([key, p]) => ({ key, label: p.label })),
}));

const isWir2022 = computed(() =>
  ['wir2022_1', 'wir2022_2', 'wir2022_3'].includes(state.activePreset)
);
const isWir2026 = computed(() =>
  ['wir2026_2', 'wir2026_3', 'wir2026_5'].includes(state.activePreset)
);
// Bei aktivem WIR-Modell steuern die Regler (Potenzkurve) nicht das angezeigte Modell.
const isWirActive = computed(() => isWir2022.value || isWir2026.value);
</script>

<template>
  <section id="rechner">
    <div class="wrap">
      <div class="eyebrow">Der Rechner</div>
      <h2>Bau deine Vermögenssteuer</h2>
      <p class="lead">
        Verschiebe die Regler und sieh sofort, wie viel eine progressive Vermögenssteuer
        auf das oberste Prozent einbringen würde. Das Modell rechnet auf den echten
        ESTV-Vermögensdaten – statisch, ohne Verhaltensannahmen.
      </p>

      <div class="presets">
        <div v-for="g in presetRows" :key="g.id" class="preset-row">
          <span class="presets-label">{{ g.label }}</span>
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
        Exaktes Modell des <strong>World&nbsp;Inequality&nbsp;Report&nbsp;2022</strong>: die Grenzsätze je
        Vermögensband nach Tabelle&nbsp;7.2 (Szenario moderat / hoch / sehr hoch), <strong>ab 1&nbsp;Mio.</strong>
        wie im Original – inklusive der rund 324'000 Pflichtigen mit 1–5&nbsp;Mio. (anders als der
        5-Mio-Freibetrag der «Unsere»-Modelle).
        <SourceTag id="wir2022" note="Progressive Vermögenssteuer, Tabelle 7.2" />
      </p>
      <p v-else-if="isWir2026" class="preset-note">
        Mindeststeuer-Modell des <strong>World&nbsp;Inequality&nbsp;Report&nbsp;2026</strong> (nach Zucman&nbsp;2024 / G20):
        ein <strong>fester Prozentsatz auf das gesamte Vermögen ab 100&nbsp;Mio.&nbsp;$</strong>
        (Centi-Millionäre), der die heute regressive Spitzenbelastung beendet.
        <SourceTag id="wir2026" note="Globale Mindeststeuer auf Multimillionäre, Kap. 7" />
      </p>

      <p v-if="!isWirActive" class="threshold-info">
        <strong>Warum der Freibetrag bei 5 Mio. beginnt:</strong>
        Bei rund 5 Mio. Franken verläuft die Grenze zum reichsten 1 %. Nur
        <strong>{{ num(k.cnt_ge5M) }}</strong> Steuerpflichtige liegen darüber –
        die übrigen <strong>{{ pct(1 - k.pct_ge5M, 0) }}</strong> bleiben komplett
        steuerfrei. Trotzdem erfasst dieses eine Prozent
        <strong>{{ pct(k.share_ge5M, 0) }}</strong> des gesamten steuerbaren Vermögens.
        Du kannst die Schwelle unten höher ziehen, aber nicht tiefer als 5 Mio. –
        damit die breite Mehrheit garantiert unbelastet bleibt.
      </p>

      <div class="calc-grid">
        <!-- Controls -->
        <div class="card controls">
          <p v-if="isWirActive" class="controls-lock">
            <strong>WIR-Referenzmodell aktiv.</strong> Diese Regler bauen ein eigenes Modell
            (Gruppe «Unsere») – bewege einen, um dorthin zu wechseln.
          </p>
          <div :class="{ dimmed: isWirActive }">
            <RangeControl
              v-model="state.schwelle"
              :min="5e6"
              :max="5e7"
              :step="5e5"
              label="Freibetrag (steuerfrei bis)"
              :display="schwelleDisplay"
              hint="Vermögen darunter bleibt komplett steuerfrei. 5 Mio. ≈ das reichste 1 %."
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.basis"
              :min="0.0005"
              :max="0.05"
              :step="0.0005"
              label="Grenzsatz an der Schwelle"
              :display="pct(state.basis, 2)"
              hint="Satz auf den ersten Franken über dem Freibetrag. Steigt mit der Progression bis zum Cap."
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.exponent"
              :min="0"
              :max="1.6"
              :step="0.05"
              label="Progression (Steilheit)"
              :display="num(state.exponent, 2)"
              hint="0 = flacher Satz für alle. Höher = die ganz Grossen zahlen überproportional."
              @update:modelValue="onSlider"
            />
            <RangeControl
              v-model="state.cap"
              :min="0.05"
              :max="1"
              :step="0.05"
              label="Höchst-Grenzsatz (Cap)"
              :display="pct(state.cap, 0)"
              hint="Deckel für den Grenzsatz der allergrössten Vermögen."
              @update:modelValue="onSlider"
            />
          </div>

          <div class="year-pick">
            <span>Datenjahr:</span>
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
            <div class="result-label">Jährliches Aufkommen ({{ state.year }}, statisch)</div>
            <div class="result-value">{{ chfCompact(staticRevenue, 1) }}</div>
            <div class="result-unit">CHF pro Jahr</div>
          </div>
          <div class="result-sub">
            <div>
              <span class="rs-val gold">{{ chfCompact(sustainableRevenue, 1) }}</span>
              <span class="rs-lab">dauerhaft tragbares Niveau<br />(dynamisch, siehe unten)</span>
            </div>
            <div>
              <span class="rs-val">{{ pct(model.avgRate(model.schwelle * 2), 1) }}</span>
              <span class="rs-lab">Ø-Satz bei {{ chfCompact(model.schwelle * 2, 0) }}</span>
            </div>
          </div>
          <p class="readout muted">
            <template v-if="capBinds">Grenzsatz erreicht den Cap bei ~{{ chfCompact(model.wcap, 0) }}.</template>
            <template v-if="equilibrium">
              Vermögen über ~{{ chfCompact(equilibrium, 0) }} zahlen mehr als ihre Rendite –
              sie schrumpfen, statt zu wachsen.
            </template>
          </p>
        </div>

        <!-- Tariff curve -->
        <div class="card chartbox">
          <h3>Steuersatz nach Vermögen</h3>
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
            <span><i class="sw" style="background: var(--accent)" /> Grenzsatz (auf den nächsten Franken)</span>
            <span><i class="sw" style="background: var(--gold)" /> Durchschnittssatz</span>
          </div>
        </div>

        <!-- Revenue by band -->
        <div class="card chartbox">
          <h3>Woher das Geld kommt</h3>
          <BarChart
            :items="bandItems"
            :format-value="(v) => chfCompact(v, 1)"
            accent="var(--teal)"
          />
          <p class="note muted">
            Der grösste Teil stammt von ganz oben – wenigen Milliarden­vermögen.
            Genau dort, wo heute am wenigsten Vermögenssteuer anfällt.
          </p>
        </div>
      </div>

      <p class="disclaimer">
        Statisches Modell: keine Abwanderung, kein Verhalten, kein Vermögenszuwachs –
        die grössten Realfaktoren bleiben aussen vor. Die Zahlen zeigen das
        <em>Potenzial</em> der Bemessungsgrundlage, nicht eine politische Prognose.
        <span class="srcs">
          <SourceTag id="estv_vermoegen" note="Vermögensverteilung + Pareto-Tail >10 Mio." />
          <SourceTag id="fdk" note="Pauschalbesteuerte im Tail (M)" />
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
.preset-note strong { color: var(--text); }

.threshold-info {
  font-size: 0.86rem; line-height: 1.55; color: var(--text-soft);
  max-width: 72ch; margin: 0 0 24px;
  padding: 14px 16px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border); border-left: 3px solid var(--gold);
}
.threshold-info strong { color: var(--text); }

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
.controls-lock strong { color: var(--text); }
.dimmed { opacity: 0.4; transition: opacity 0.15s ease; }
.result {
  padding: 28px 24px;
  background: linear-gradient(160deg, #1d2952, #161f3d);
  border-color: #34407a;
}
.result-label { color: var(--text-soft); font-size: 0.9rem; font-weight: 600; }
.result-value { font-size: clamp(2.6rem, 7vw, 4rem); font-weight: 800; color: var(--accent); letter-spacing: -0.03em; line-height: 1.05; }
.result-unit { color: var(--text-mute); font-weight: 600; }
.result-sub { display: flex; gap: 24px; margin: 20px 0 14px; flex-wrap: wrap; }
.result-sub > div { display: flex; flex-direction: column; }
.rs-val { font-size: 1.5rem; font-weight: 800; }
.rs-val.gold { color: var(--gold); }
.rs-lab { color: var(--text-mute); font-size: 0.78rem; }
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
