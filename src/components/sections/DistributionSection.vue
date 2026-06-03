<script setup>
import { computed } from 'vue';
import dist from '@/data/estv_distribution.json';
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct, num, chfCompact } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const YEAR = 2022;
const k = kennzahlen.unbeschraenkt['2022'];

const NICE = {
  0: 'Kein Vermögen',
  10: 'über 10 Mio.',
};

const rows = computed(() => {
  const counts = dist.unb_counts;
  const wealth = dist.unb_wealth;
  const totalC = counts.reduce((s, c) => s + c.values[YEAR], 0);
  const totalW = wealth.reduce((s, c) => s + c.values[YEAR], 0);
  return counts.map((c, i) => {
    const cnt = c.values[YEAR];
    const w = wealth[i].values[YEAR];
    const label = NICE[i] || c.label.replace(/'/g, ' ').replace('> ', '');
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
  <section id="verteilung" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">Die Verteilung</div>
      <h2>Wenige besitzen fast alles</h2>
      <p class="lead">
        Jeder Balken ist eine Vermögensklasse. Links der Anteil an den Menschen,
        rechts der Anteil am gesamten steuerbaren Vermögen. Die Schere ist die Geschichte:
        die grosse Mehrheit besitzt kaum etwas, die Spitze fast alles.
      </p>

      <div class="grid stat-grid">
        <div class="ministat">
          <span class="mv gold">{{ pct(k.share_ge1M, 0) }}</span>
          <span class="ml">des Vermögens hält die reichste Schicht ab 1&nbsp;Mio. – das sind nur {{ pct(k.pct_ge1M, 0) }} der Pflichtigen.</span>
        </div>
        <div class="ministat">
          <span class="mv accent">{{ num(k.cnt_ge10M) }}</span>
          <span class="ml">Steuerpflichtige ({{ pct(k.pct_ge10M, 1) }}) ab 10&nbsp;Mio. besitzen {{ pct(k.share_ge10M, 0) }} des Vermögens.</span>
        </div>
        <div class="ministat">
          <span class="mv">{{ chf(k.median) }}</span>
          <span class="ml">Median – die Hälfte aller Pflichtigen hat weniger. Mittelwert: {{ chf(k.mean) }}.</span>
        </div>
      </div>

      <div class="card chart-card">
        <div class="legend">
          <span><i class="sw" style="background: var(--blue)" /> Anteil an den Menschen</span>
          <span><i class="sw" style="background: var(--gold)" /> Anteil am Vermögen</span>
        </div>
        <div class="dist">
          <div v-for="r in rows" :key="r.label" class="drow">
            <div class="dlabel">{{ r.label }}</div>
            <div class="dbars">
              <div class="dbar">
                <div class="dfill people" :style="{ width: `${(r.shareCount / maxShare) * 100}%` }" />
                <span class="dval">{{ pct(r.shareCount, 1) }}</span>
              </div>
              <div class="dbar">
                <div class="dfill money" :style="{ width: `${(r.shareWealth / maxShare) * 100}%` }" />
                <span class="dval">{{ pct(r.shareWealth, 1) }}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="note muted">
          Steuerbares Reinvermögen pro Steuerfall (Ehepaare = eine Einheit), unbeschränkt
          Steuerpflichtige {{ YEAR }}. Ohne 2./3. Säule und Hausrat – das reale Marktvermögen
          der Spitze ist eher noch konzentrierter.
        </p>
        <SourceTag id="estv_vermoegen" :note="`${YEAR}, unbeschränkt`" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin: 32px 0; }
.ministat { display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
.mv { font-size: 1.8rem; font-weight: 800; }
.mv.gold { color: var(--gold); }
.mv.accent { color: var(--accent); }
.ml { color: var(--text-soft); font-size: 0.88rem; }

.chart-card { padding: 24px; }
.legend { display: flex; gap: 20px; font-size: 0.84rem; color: var(--text-soft); margin-bottom: 16px; flex-wrap: wrap; }
.legend .sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }

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
