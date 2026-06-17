<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import dist from '@/data/estv_distribution.json';
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';
import ChartLegend from '@/components/charts/ChartLegend.vue';

const { t } = useI18n();
const YEAR = 2022;
const legendItems = computed(() => [
  { color: 'var(--blue)', label: t('distribution.legendPeople') },
  { color: 'var(--gold)', label: t('distribution.legendMoney') },
]);
const k = kennzahlen.unbeschraenkt['2022'];

const rows = computed(() => {
  const nice = { 0: t('distribution.labelZero'), 10: t('distribution.labelOver10') };
  const counts = dist.unb_counts;
  const wealth = dist.unb_wealth;
  const totalC = counts.reduce((s, c) => s + c.values[YEAR], 0);
  const totalW = wealth.reduce((s, c) => s + c.values[YEAR], 0);
  return counts.map((c, i) => {
    const cnt = c.values[YEAR];
    const w = wealth[i].values[YEAR];
    const label = nice[i] || c.label.replace(/'/g, ' ').replace('> ', '');
    return {
      label,
      shareCount: cnt / totalC,
      shareWealth: w / totalW,
      cnt,
    };
  });
});

const maxShare = computed(() => Math.max(...rows.value.flatMap((r) => [r.shareCount, r.shareWealth])));
</script>

<template>
  <section
    id="verteilung"
    class="section-alt"
  >
    <div class="wrap">
      <div class="eyebrow">
        {{ $t('distribution.eyebrow') }}
      </div>
      <h2 v-html="$t('distribution.title')" />
      <p
        class="lead dist-lead"
        v-html="$t('distribution.lead', { share: pct(k.share_ge5M, 0), median: chf(k.median) })"
      />
      <p class="dist-lead-src">
        <SourceTag
          id="estv_vermoegen"
          :note="$t('distribution.leadSourceNote')"
        />
      </p>
      <div class="card chart-card">
        <ChartLegend
          :items="legendItems"
          :style="{ marginBottom: '16px' }"
        />
        <div class="dist">
          <div
            v-for="r in rows"
            :key="r.label"
            class="drow"
          >
            <div class="dlabel">
              {{ r.label }}
            </div>
            <div class="dbars">
              <div class="dbar">
                <div
                  class="dfill people"
                  :style="{ width: `${(r.shareCount / maxShare) * 100}%` }"
                />
                <span class="dval">{{ pct(r.shareCount, 1) }}</span>
              </div>
              <div class="dbar">
                <div
                  class="dfill money"
                  :style="{ width: `${(r.shareWealth / maxShare) * 100}%` }"
                />
                <span class="dval">{{ pct(r.shareWealth, 1) }}</span>
              </div>
            </div>
          </div>
        </div>
        <p
          class="note muted"
          v-html="$t('distribution.note', { year: YEAR })"
        />
        <SourceTag
          id="estv_vermoegen"
          :note="$t('distribution.sourceNote', { year: YEAR })"
        />
      </div>

      <div class="grid stat-grid">
        <div class="ministat">
          <span class="mv gold">{{ pct(k.share_ge1M, 0) }}</span>
          <span
            class="ml"
            v-html="$t('distribution.ministat1', { pct: pct(k.pct_ge1M, 0) })"
          />
        </div>
        <div class="ministat">
          <span class="mv accent">{{ num(k.cnt_ge10M) }}</span>
          <span
            class="ml"
            v-html="$t('distribution.ministat2', { pct: pct(k.pct_ge10M, 1), share: pct(k.share_ge10M, 0) })"
          />
        </div>
        <div class="ministat">
          <span class="mv">{{ chf(k.median) }}</span>
          <span
            class="ml"
            v-html="$t('distribution.ministat3', { mean: chf(k.mean) })"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dist-lead { margin-bottom: 10px; max-width: 56ch; }
.dist-lead-src { margin: 0 0 22px; }
/* Im Lead ist .hl nur farbige Hervorhebung, kein Marker: Markerflaeche entfernen,
   sonst stuende goldene Schrift auf goldenem Marker (unleserlich). */
.dist-lead :deep(.hl.gold) { background: none; padding: 0; border-radius: 0; color: var(--gold); font-weight: 800; }
.dist-lead :deep(strong) { font-weight: 800; }
.stat-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin: 32px 0; }
.ministat { display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
.mv { font-size: 1.8rem; font-weight: 800; }
.mv.gold { color: var(--gold); }
.mv.accent { color: var(--accent); }
.ml { color: var(--text-soft); font-size: 0.88rem; }

.chart-card { padding: 24px; }

.dist { display: flex; flex-direction: column; gap: 9px; }
.drow { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 14px; }
.dlabel { font-size: 0.82rem; font-weight: 600; color: var(--text-soft); text-align: right; }
.dbars { display: flex; flex-direction: column; gap: 3px; }
.dbar { position: relative; display: flex; align-items: center; height: 14px; }
.dfill { height: 100%; border-radius: 4px; min-width: 1px; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.dfill.people { background: var(--blue); }
.dfill.money { background: var(--gold); }
.dval { font-size: 0.72rem; color: var(--text-mute); margin-left: 8px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.note { font-size: 0.8rem; margin: 18px 0 10px; }
@media (max-width: 560px) {
  .drow { grid-template-columns: 84px 1fr; gap: 8px; }
  .dlabel { font-size: 0.74rem; }
}
</style>
