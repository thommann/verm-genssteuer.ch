<script setup>
import { ref, computed } from 'vue';
import { useCalculator } from '@/composables/useCalculator.js';
import { dynamicProjection } from '@/lib/taxModel.js';
import cohorts from '@/data/projektion_cohorts.json';
import spendRef from '@/data/spend_reference.json';
import { chfCompact } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';
import SpendGrid from '@/components/ui/SpendGrid.vue';

const {
  nettoStatisch, nettoDauerhaft,
  effectiveWegzug, wegzugAktuelleSteuern,
  state, model,
} = useCalculator();
const K = spendRef.kennzahlen;

const basis = ref('dauerhaft'); // 'dauerhaft' | 'jahr1'
const revenue = computed(() => basis.value === 'jahr1' ? nettoStatisch.value : nettoDauerhaft.value);

// Anzahl Jahre, bis die dynamische Projektion die Staatsschuld kumulativ deckt.
// null = Aufkommen versiegt vor dem Horizont (250 Jahre).
const DEBTFREE_HORIZON = 250;
const debtFreeYears = computed(() => {
  const target = K.staatsschuld_maastricht.value;
  const series = dynamicProjection(cohorts, model.value, state.rendite, state.year, DEBTFREE_HORIZON, effectiveWegzug.value);
  let cum = 0;
  for (let i = 0; i < series.length; i += 1) {
    const rev = series[i].revenue - wegzugAktuelleSteuern.value;
    if (rev <= 0) break;
    if (cum + rev >= target) return i + (target - cum) / rev;
    cum += rev;
  }
  return null;
});
</script>

<template>
  <section id="verwendung" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">{{ $t('spend.eyebrow') }}</div>
      <h2>{{ $t('spend.title', { revenue: chfCompact(revenue, 1) }) }}</h2>
      <p class="lead">{{ $t('spend.lead') }}</p>

      <div class="basis-toggle">
        <button :class="{ active: basis === 'dauerhaft' }" @click="basis = 'dauerhaft'">
          {{ $t('spend.toggleDauerhaft') }}
        </button>
        <button :class="{ active: basis === 'jahr1' }" @click="basis = 'jahr1'">
          {{ $t('spend.toggleJahr1', { year: state.year }) }}
        </button>
        <span class="basis-hint muted">
          {{ basis === 'dauerhaft' ? $t('spend.hintDauerhaft') : $t('spend.hintJahr1') }}
        </span>
      </div>

      <SpendGrid :revenue="revenue" :debt-free-years="debtFreeYears" :rendite="state.rendite" />

      <p class="disclaimer muted" v-html="$t('spend.disclaimer')" />
      <div class="srcs">
        <span class="srcs-lab">{{ $t('spend.srcsLabel') }}</span>
        <SourceTag id="estv_vermoegen" :note="$t('spend.sourceNoteEstv')" />
        <SourceTag id="fdk" :note="$t('spend.sourceNoteFdk')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.basis-toggle { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 22px 0 28px; }
.basis-toggle button {
  padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.basis-toggle button.active { background: var(--teal); border-color: var(--teal); color: #04201c; }
.basis-hint { font-size: 0.8rem; flex-basis: 100%; }
.disclaimer { font-size: 0.82rem; margin-top: 24px; max-width: 75ch; }
.srcs { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
.srcs-lab { font-size: 0.74rem; font-weight: 600; color: var(--text-mute); }
</style>
