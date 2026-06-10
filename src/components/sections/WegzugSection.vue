<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculator, WEGZUG_MAX } from '@/composables/useCalculator.js';
import { chfCompact } from '@/lib/format.js';
import RangeControl from '@/components/ui/RangeControl.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const calc = useCalculator();
const {
  state,
  wegzugAktuelleSteuern,
  staticRevenue,
} = calc;

// Logarithmische Skala: 0–200 UI-Schritte → 100 Mio.–50 Mrd. CHF
const WEGZUG_LOG_MIN = 1e8;
const WEGZUG_LOG_STEPS = 200;
const _logMin = Math.log10(WEGZUG_LOG_MIN);
const _logMax = Math.log10(WEGZUG_MAX);

const wegzugLogPos = computed({
  get: () => {
    if (state.wegzugSchwelle >= WEGZUG_MAX) return WEGZUG_LOG_STEPS;
    return Math.round(((Math.log10(state.wegzugSchwelle) - _logMin) / (_logMax - _logMin)) * WEGZUG_LOG_STEPS);
  },
  set: (pos) => {
    if (pos >= WEGZUG_LOG_STEPS) { state.wegzugSchwelle = WEGZUG_MAX; return; }
    state.wegzugSchwelle = Math.pow(10, _logMin + (pos / WEGZUG_LOG_STEPS) * (_logMax - _logMin));
  },
});

const wegzugDisplay = computed(() =>
  state.wegzugSchwelle >= WEGZUG_MAX
    ? t('calculator.wegzugNone')
    : `ab ${chfCompact(state.wegzugSchwelle, 0)}`
);
</script>

<template>
  <section id="wegzug">
    <div class="wrap">
      <div class="eyebrow">{{ $t('wegzug.eyebrow') }}</div>
      <h2>{{ $t('wegzug.title') }}</h2>
      <p class="lead" v-html="$t('wegzug.lead')" />

      <div class="wegzug-grid">
        <div class="card wegzug-ctrl">
          <RangeControl
            v-model="wegzugLogPos"
            :min="0"
            :max="200"
            :step="1"
            :label="$t('calculator.wegzugLabel')"
            :display="wegzugDisplay"
            :hint="$t('calculator.wegzugHint')"
          />
        </div>

        <div class="card wegzug-result">
          <div class="rb-row">
            <span class="rb-lab">{{ $t('calculator.nettoNeuLabel') }}</span>
            <span class="rb-val">+{{ chfCompact(staticRevenue, 1) }}</span>
          </div>
          <div class="rb-row neg">
            <span class="rb-lab">{{ $t('calculator.nettoHeuteLabel') }}</span>
            <span class="rb-val">−{{ chfCompact(wegzugAktuelleSteuern, 1) }}</span>
          </div>
        </div>
      </div>

      <p class="disclaimer muted" v-html="$t('calculator.disclaimer')" />
      <div class="srcs">
        <SourceTag id="nzz_vermoegenssteuer" :note="$t('calculator.wegzugSourceVst')" />
        <SourceTag id="reichensteuer_studie_ch" :note="$t('calculator.wegzugSourceEst')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.wegzug-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: start;
}
.wegzug-ctrl { padding: 24px; }
.wegzug-result { min-height: 160px; padding: 20px 24px; }

.disclaimer { font-size: 0.82rem; margin-top: 18px; max-width: 75ch; }
.srcs { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 12px; }

@media (max-width: 820px) { .wegzug-grid { grid-template-columns: 1fr; } }
</style>
