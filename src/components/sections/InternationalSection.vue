<script setup>
import { ref, computed } from 'vue';
import wid from '@/data/wid_timeseries.json';
import latest from '@/data/wid_latest.json';
import { pct } from '@/lib/format.js';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const METRICS = {
  top1: { key: 'top1', label: 'Top 1 %', desc: 'Vermögensanteil des reichsten Prozents' },
  top10: { key: 'top10', label: 'Top 10 %', desc: 'Vermögensanteil der reichsten 10 %' },
  bot50: { key: 'bot50', label: 'Untere 50 %', desc: 'Vermögensanteil der ärmeren Hälfte' },
};
const metric = ref('top1');

const SHOWN = [
  { name: 'Schweiz', color: 'var(--accent)', width: 3.2, marker: true },
  { name: 'USA', color: 'var(--gold)', width: 2 },
  { name: 'Frankreich', color: 'var(--teal)', width: 2 },
  { name: 'Deutschland', color: 'var(--blue)', width: 2 },
  { name: 'Welt', color: 'var(--violet)', width: 2, dashed: true },
];

const years = computed(() => Object.keys(wid.top1.Schweiz).map(Number).sort((a, b) => a - b));

const series = computed(() => {
  const data = wid[metric.value];
  return SHOWN.map((c) => ({
    ...c,
    points: years.value.map((y) => ({ x: y, y: data[c.name][y] })),
  }));
});

const yDomain = computed(() => {
  const all = series.value.flatMap((s) => s.points.map((p) => p.y));
  const lo = Math.min(0, ...all);
  const hi = Math.max(...all);
  return [Math.floor(lo * 20) / 20, Math.ceil(hi * 20) / 20];
});
const yTicks = computed(() => {
  const [lo, hi] = yDomain.value;
  const out = [];
  for (let v = lo; v <= hi + 1e-9; v += 0.1) out.push(Number(v.toFixed(2)));
  return out;
});
const xTicks = [1995, 2000, 2005, 2010, 2015, 2020, 2024];

const ranking = computed(() =>
  [...latest]
    .filter((c) => c.top1 != null)
    .sort((a, b) => b.top1 - a.top1)
);
const maxTop1 = computed(() => Math.max(...ranking.value.map((c) => c.top1)));
</script>

<template>
  <section id="international" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">Im internationalen Vergleich</div>
      <h2>Die Konzentration steigt – auch in der Schweiz</h2>
      <p class="lead">
        Anteil am gesamten Netto-Privatvermögen, 1995–2024. In der Schweiz hält das
        reichste Prozent heute spürbar mehr als noch in den 1990ern – ein weltweiter Trend.
      </p>

      <div class="metric-toggle">
        <button
          v-for="m in METRICS"
          :key="m.key"
          :class="{ active: metric === m.key }"
          @click="metric = m.key"
        >{{ m.label }}</button>
        <span class="muted desc">{{ METRICS[metric].desc }}</span>
      </div>

      <div class="card chartbox">
        <LineChart
          :series="series"
          :x-domain="[1995, 2024]"
          :y-domain="yDomain"
          :x-ticks="xTicks"
          :y-ticks="yTicks"
          :format-x="(v) => String(v)"
          :format-y="(v) => pct(v, 0)"
          :height="340"
        />
        <div class="legend">
          <span v-for="s in SHOWN" :key="s.name">
            <i class="sw" :style="{ background: s.color }" /> {{ s.name }}
          </span>
        </div>
        <SourceTag id="wid" note="Variable shwealj992, net personal wealth" />
      </div>

      <div class="compare">
        <h3>Top-1%-Vermögensanteil heute ({{ ranking[0]?.jahr }})</h3>
        <div class="rank">
          <div
            v-for="c in ranking"
            :key="c.land"
            class="rrow"
            :class="{ ch: c.land === 'Schweiz' }"
          >
            <div class="rland">{{ c.land }}</div>
            <div class="rtrack">
              <div class="rfill" :style="{ width: `${(c.top1 / maxTop1) * 100}%` }" />
            </div>
            <div class="rval tnum">{{ pct(c.top1, 1) }}</div>
          </div>
        </div>
        <div class="legend2">
          <SourceTag id="wid" note="Anteile" />
        </div>
        <p class="muted small">
          Hinweis: WID-Anteile (Gesamtvermögen) und die ESTV-Steuerdaten messen
          Verschiedenes – die Steuerdaten erfassen nur steuerbares Vermögen und wirken
          dadurch konzentrierter. Beide Quellen zeigen denselben Trend.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.metric-toggle { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 20px 0 18px; }
.metric-toggle button {
  padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.metric-toggle button.active { background: var(--accent); border-color: var(--accent); color: #1a0008; }
.metric-toggle .desc { font-size: 0.82rem; }

.chartbox { padding: 22px 24px; }
.legend { display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-soft); margin: 12px 0 6px; flex-wrap: wrap; }
.legend .sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }

.compare { margin-top: 40px; }
.rank { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
.rrow { display: grid; grid-template-columns: 130px 1fr auto; align-items: center; gap: 12px; padding: 4px 8px; border-radius: 8px; }
.rrow.ch { background: rgba(255, 84, 112, 0.12); border: 1px solid rgba(255, 84, 112, 0.4); }
.rland { font-weight: 600; font-size: 0.9rem; }
.rrow.ch .rland { color: var(--accent-soft); }
.rtrack { height: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 999px; overflow: hidden; border: 1px solid var(--border); }
.rfill { height: 100%; background: var(--gold); border-radius: 999px; }
.rrow.ch .rfill { background: var(--accent); }
.rval { font-weight: 700; font-size: 0.9rem; min-width: 56px; text-align: right; }
.legend2 { display: flex; gap: 18px; margin-top: 14px; flex-wrap: wrap; }
.small { font-size: 0.8rem; margin-top: 14px; max-width: 75ch; }
@media (max-width: 620px) {
  .rrow { grid-template-columns: 96px 1fr auto; }
}
</style>
