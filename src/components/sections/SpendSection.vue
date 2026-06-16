<script setup>
import { ref, computed } from 'vue';
import { useCalculator } from '@/composables/useCalculator.js';
import { chfCompact } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';
import SpendGrid from '@/components/ui/SpendGrid.vue';
import SpendAllocator from '@/components/ui/SpendAllocator.vue';

const { nettoStatisch, nettoDauerhaft, state, debtFreeYears } = useCalculator();

const basis = ref('dauerhaft'); // 'dauerhaft' | 'jahr1'
const revenue = computed(() => (basis.value === 'jahr1' ? nettoStatisch.value : nettoDauerhaft.value));
const mode = ref('vergleich'); // 'vergleich' | 'aufteilen'
</script>

<template>
  <section id="verwendung" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">{{ $t('spend.eyebrow') }}</div>
      <h2 v-html="$t('spend.title', { revenue: chfCompact(revenue, 1) })" />
      <p class="lead">{{ $t('spend.lead') }}</p>

      <div class="spend-controls">
        <div class="mode-toggle">
          <button :class="{ active: mode === 'vergleich' }" @click="mode = 'vergleich'">
            {{ $t('spend.modeCompare') }}
          </button>
          <button :class="{ active: mode === 'aufteilen' }" @click="mode = 'aufteilen'">
            {{ $t('spend.modeAllocate') }}
          </button>
        </div>
        <div class="basis-toggle">
          <button :class="{ active: basis === 'dauerhaft' }" @click="basis = 'dauerhaft'">
            {{ $t('spend.toggleDauerhaft') }}
          </button>
          <button :class="{ active: basis === 'jahr1' }" @click="basis = 'jahr1'">
            {{ $t('spend.toggleJahr1', { year: state.year }) }}
          </button>
        </div>
      </div>
      <p class="basis-hint muted">
        {{ basis === 'dauerhaft' ? $t('spend.hintDauerhaft') : $t('spend.hintJahr1') }}
      </p>

      <SpendGrid
        v-if="mode === 'vergleich'"
        :revenue="revenue"
        :debt-free-years="debtFreeYears"
        :rendite="state.rendite"
      />
      <SpendAllocator v-else :revenue="revenue" />

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
.spend-controls { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 22px 0 6px; }
.mode-toggle { display: inline-flex; gap: 4px; padding: 4px; border-radius: 999px; background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); }
.mode-toggle button {
  padding: 8px 18px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: transparent; border: none; color: var(--text-soft);
}
.mode-toggle button.active { background: var(--teal); color: #04201c; }
.basis-toggle { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.basis-toggle button {
  padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.basis-toggle button.active { background: var(--teal); border-color: var(--teal); color: #04201c; }
.basis-hint { font-size: 0.82rem; margin: 0 0 18px; }

.disclaimer { font-size: 0.82rem; margin-top: 16px; max-width: 75ch; }
.srcs { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
.srcs-lab { font-size: 0.74rem; font-weight: 600; color: var(--text-mute); }
</style>
