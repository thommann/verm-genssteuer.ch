<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculator, PRESETS, PRESET_GROUPS } from '@/composables/useCalculator.js';
import { chfCompact } from '@/lib/format.js';
import SpendGrid from '@/components/ui/SpendGrid.vue';

const { t } = useI18n();
const calc = useCalculator();
const { state, nettoDauerhaft, debtFreeYears } = calc;

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
</script>

<template>
  <!-- Hero: nur das Wichtigste auf einen Blick. Steuermodell (Presets) und der
       langfristige Ertrag. Erklärungen und das Selbst-Einstellen folgen weiter unten. -->
  <section id="rechner">
    <div class="wrap">
      <div class="eyebrow">
        {{ $t('calculator.eyebrow') }}
      </div>
      <h2 v-html="$t('calculator.title')" />

      <div class="presets">
        <div
          v-for="g in presetRows"
          :key="g.id"
          class="preset-row"
        >
          <span
            v-if="g.label"
            class="presets-label"
          >{{ g.label }}</span>
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

      <!-- Langfristige Mehreinnahmen (dauerhaft tragbar), nur die grosse Zahl. -->
      <div class="card result">
        <div class="result-label">
          {{ $t('calculator.longTermLabel') }}
        </div>
        <div
          class="result-value gold"
          :class="{ negative: nettoDauerhaft < 0 }"
        >
          {{ chfCompact(nettoDauerhaft, 1) }}
        </div>
        <div class="result-unit">
          {{ $t('calculator.resultUnit') }}
        </div>
      </div>

      <!-- Mögliche Verwendung auf einen Blick: Emoji, Zahl und Balken, ohne Fliesstext. -->
      <SpendGrid
        class="hero-spend"
        compact
        :revenue="nettoDauerhaft"
        :debt-free-years="debtFreeYears"
        :rendite="state.rendite"
      />
    </div>
  </section>
</template>

<style scoped>
.presets { display: flex; flex-direction: column; gap: 8px; margin: 18px 0 14px; }
.preset-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.presets-label { color: var(--text-mute); font-size: 0.85rem; font-weight: 600; min-width: 76px; }
.presets-label::after { content: ':'; }
.preset {
  padding: 8px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
  transition: all 0.12s ease;
}
.preset:hover { color: var(--text); border-color: var(--accent); }
.preset.active { background: var(--accent); border-color: var(--accent); color: #1a0008; }

.result {
  margin: 0;
  padding: 22px 24px;
  background: linear-gradient(160deg, rgba(255, 84, 112, 0.18), rgba(13, 18, 40, 0.42));
  border-color: rgba(255, 84, 112, 0.42);
}
.result-value.gold { color: var(--gold); }
.result-value.gold.negative { color: #f07; }
.hero-spend { margin-top: 16px; }
</style>
