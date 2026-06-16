<script setup>
import { reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import spendRef from '@/data/spend_reference.json';
import { chf, chfCompact, pct } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const props = defineProps({
  revenue: { type: Number, required: true },
});

const { t } = useI18n();

const K = spendRef.kennzahlen;
const POP = K.population.value;
const netPraemien = K.okp_praemien.value - K.praemienverbilligung.value;
const F35_PRICE = K.f35_preis_pro_jet.value;
const F35_FLEET = K.f35_flotte.value;
const f35FleetCost = F35_PRICE * F35_FLEET;

// Einsatzgebiete mit ihren «Vollkosten» (cap). cap = null bedeutet unbegrenzt
// (Pro-Kopf-Dividende absorbiert beliebig viel und fungiert als «Rest»-Topf).
const AREAS = [
  { id: 'income', icon: '🧾', color: 'teal', cap: K.einkommenssteuer_np_alle_ebenen.value, src: 'efv' },
  { id: 'premium', icon: '🏥', color: 'gold', cap: netPraemien, src: 'bag' },
  { id: 'oev', icon: '🚆', color: 'blue', cap: K.oev_personenverkehrsertrag.value, src: 'litra' },
  { id: 'f35', icon: '✈️', color: 'gold', cap: f35FleetCost, src: 'f35_beschaffung' },
  { id: 'debt', icon: '🗓️', color: 'violet', cap: K.staatsschuld_maastricht.value, src: 'efv' },
  { id: 'kopf', icon: '💸', color: 'accent', cap: null, src: 'bfs' },
];
const areaById = Object.fromEntries(AREAS.map((a) => [a.id, a]));

// Zugeteilte Beträge (CHF) je Einsatzgebiet.
const alloc = reactive(Object.fromEntries(AREAS.map((a) => [a.id, 0])));

const total = computed(() => AREAS.reduce((s, a) => s + alloc[a.id], 0));
const remaining = computed(() => Math.max(0, props.revenue - total.value));

// Reglerschritt: rund 1/200 des Aufkommens, mindestens 10 Mio., auf 10 Mio. gerundet.
const step = computed(() => Math.max(1e7, Math.round(props.revenue / 200 / 1e7) * 1e7));

const capOf = (a) => (a.cap == null ? Infinity : a.cap);
// Obergrenze je Regler: was diesem Topf zusteht, ohne das Aufkommen zu sprengen.
const maxFor = (a) => Math.min(capOf(a), alloc[a.id] + remaining.value);

function setAlloc(id, value) {
  const a = areaById[id];
  alloc[id] = Math.max(0, Math.min(value, maxFor(a)));
}

function putRest(id) {
  const a = areaById[id];
  alloc[id] = Math.min(capOf(a), alloc[id] + remaining.value);
}

function reset() {
  for (const a of AREAS) alloc[a.id] = 0;
}

// Beim Wechsel des Steuermodells kann das Aufkommen sinken: dann die Verteilung
// proportional herunterskalieren, damit nie mehr verteilt ist als vorhanden.
watch(
  () => props.revenue,
  (rev) => {
    const tot = total.value;
    if (tot > rev && tot > 0) {
      const f = rev / tot;
      for (const a of AREAS) alloc[a.id] *= f;
    }
  }
);

// Beispiel-Szenarien: Schritte werden der Reihe nach gefüllt, jeweils auf den
// verbleibenden Rest und die Vollkosten begrenzt. take: 'full' | 'rest' | Zahl.
const PRESETS = {
  premiumOev: [
    { id: 'premium', take: 'full' },
    { id: 'oev', take: 'rest' },
  ],
  income30: [
    { id: 'income', take: 0.3 * areaById.income.cap },
    { id: 'kopf', take: 'rest' },
  ],
  kopf: [{ id: 'kopf', take: 'rest' }],
};

function applyPreset(key) {
  for (const a of AREAS) alloc[a.id] = 0;
  let rem = props.revenue;
  for (const s of PRESETS[key]) {
    const a = areaById[s.id];
    let want;
    if (s.take === 'full') want = capOf(a);
    else if (s.take === 'rest') want = rem;
    else want = s.take;
    const give = Math.max(0, Math.min(want, rem, capOf(a)));
    alloc[s.id] = give;
    rem -= give;
  }
}

const rows = computed(() =>
  AREAS.map((a) => {
    const amount = alloc[a.id];
    const share = a.cap ? amount / a.cap : 0;
    const empty = amount <= 0;
    let main = t('spend.alloc.empty');
    let detail = '';
    if (a.id === 'income') {
      if (!empty) main = share >= 1 ? t('spend.alloc.incomeFull') : `−${pct(share, 0)}`;
      detail = t('spend.alloc.fromCap', { amount: chfCompact(a.cap, 1) });
    } else if (a.id === 'premium') {
      if (!empty) main = share >= 1 ? t('spend.alloc.premiumFull') : t('spend.alloc.premiumShare', { pct: pct(share, 0) });
      detail = t('spend.alloc.premiumDetail', { amount: chf(amount / POP / 12) });
    } else if (a.id === 'oev') {
      if (!empty) main = share >= 1 ? t('spend.alloc.oevFull') : t('spend.alloc.oevShare', { pct: pct(share, 0) });
      detail = t('spend.alloc.fromCap', { amount: chfCompact(a.cap, 1) });
    } else if (a.id === 'f35') {
      if (!empty) main = t('spend.alloc.f35Value', { count: Math.floor(amount / F35_PRICE) });
      detail = t('spend.alloc.f35Detail', { fleet: F35_FLEET });
    } else if (a.id === 'debt') {
      if (!empty) main = t('spend.alloc.debtShare', { pct: pct(share, 1) });
      detail = t('spend.alloc.fromCap', { amount: chfCompact(a.cap, 0) });
    } else if (a.id === 'kopf') {
      if (!empty) main = t('spend.alloc.kopfValue', { amount: chf(amount / POP) });
      detail = t('spend.alloc.kopfDetail', { amount: chf(amount / POP / 12) });
    }
    const fill = a.cap ? Math.min(share, 1) : (props.revenue ? amount / props.revenue : 0);
    return { ...a, amount, max: maxFor(a), main, detail, empty, fill };
  })
);

// Segmente für den gestapelten Verteilungsbalken (nur zugeteilte Töpfe).
const segments = computed(() =>
  AREAS
    .filter((a) => alloc[a.id] > 0)
    .map((a) => ({ id: a.id, color: a.color, w: (alloc[a.id] / props.revenue) * 100 }))
);
const remainingPct = computed(() => (props.revenue ? (remaining.value / props.revenue) * 100 : 0));
</script>

<template>
  <div class="alloc">
    <p class="alloc-intro muted">{{ $t('spend.alloc.intro') }}</p>

    <div class="alloc-presets">
      <span class="alloc-presets-lab">{{ $t('spend.alloc.presetsLabel') }}</span>
      <button @click="applyPreset('premiumOev')">{{ $t('spend.alloc.presetPremiumOev') }}</button>
      <button @click="applyPreset('income30')">{{ $t('spend.alloc.presetIncome30') }}</button>
      <button @click="applyPreset('kopf')">{{ $t('spend.alloc.presetKopf') }}</button>
      <button class="ghost" @click="reset">{{ $t('spend.alloc.reset') }}</button>
    </div>

    <div class="alloc-summary card">
      <div class="alloc-numbers">
        <div class="an">
          <span class="an-lab">{{ $t('spend.alloc.budget') }}</span>
          <span class="an-val">{{ chfCompact(revenue, 1) }}</span>
        </div>
        <div class="an">
          <span class="an-lab">{{ $t('spend.alloc.distributed') }}</span>
          <span class="an-val">{{ chfCompact(total, 1) }}</span>
        </div>
        <div class="an">
          <span class="an-lab">{{ remaining > 0 ? $t('spend.alloc.remaining') : $t('spend.alloc.fullyDistributed') }}</span>
          <span class="an-val" :class="{ teal: remaining <= 0 }">{{ remaining > 0 ? chfCompact(remaining, 1) : '✓' }}</span>
        </div>
      </div>
      <div class="alloc-bar">
        <div
          v-for="s in segments"
          :key="s.id"
          class="seg"
          :class="s.color"
          :style="{ width: `${s.w}%` }"
        />
        <div class="seg rest" :style="{ width: `${remainingPct}%` }" />
      </div>
    </div>

    <div class="alloc-rows">
      <div v-for="r in rows" :key="r.id" class="alloc-row card">
        <div class="alloc-head">
          <span class="alloc-icon">{{ r.icon }}</span>
          <div class="alloc-titles">
            <h4>{{ $t(`spend.alloc.${r.id}Title`) }}</h4>
            <p class="alloc-result">
              <span class="alloc-main" :class="[r.color, { muted: r.empty }]">{{ r.main }}</span>
              <span v-if="r.detail && !r.empty" class="alloc-detail muted">· {{ r.detail }}</span>
            </p>
          </div>
          <div class="alloc-amount">
            <span class="alloc-chf">{{ chfCompact(r.amount, 1) }}</span>
            <button class="rest-btn" :disabled="remaining <= 0" @click="putRest(r.id)">
              {{ $t('spend.alloc.restBtn') }}
            </button>
          </div>
        </div>
        <input
          class="alloc-slider"
          type="range"
          min="0"
          :max="r.max"
          :step="step"
          :value="r.amount"
          @input="setAlloc(r.id, +$event.target.value)"
        />
        <div class="alloc-meter"><div class="fill" :class="r.color" :style="{ width: `${r.fill * 100}%` }" /></div>
      </div>
    </div>

    <div class="srcs">
      <span class="srcs-lab">{{ $t('spend.srcsLabel') }}</span>
      <SourceTag id="efv" />
      <SourceTag id="bag" />
      <SourceTag id="bfs" />
      <SourceTag id="litra" :note="$t('spend.oevSourceNote')" />
      <SourceTag id="f35_beschaffung" />
    </div>
  </div>
</template>

<style scoped>
.alloc { display: flex; flex-direction: column; gap: 18px; }
.alloc-intro { font-size: 0.92rem; max-width: 70ch; margin: 0; }

.alloc-presets { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.alloc-presets-lab { font-size: 0.74rem; font-weight: 600; color: var(--text-mute); }
.alloc-presets button {
  padding: 7px 14px; border-radius: 999px; font-size: 0.82rem; font-weight: 600;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.alloc-presets button:hover { border-color: var(--teal); color: #fff; }
.alloc-presets button.ghost { color: var(--text-mute); }

.alloc-summary { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
.alloc-numbers { display: flex; flex-wrap: wrap; gap: 28px; }
.an { display: flex; flex-direction: column; gap: 2px; }
.an-lab { font-size: 0.74rem; color: var(--text-mute); font-weight: 600; }
.an-val { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; }
.an-val.teal { color: var(--teal); }

.alloc-bar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; border: 1px solid var(--border); background: rgba(255, 255, 255, 0.04); }
.alloc-bar .seg { height: 100%; transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.alloc-bar .seg.rest { background: rgba(255, 255, 255, 0.06); }

.alloc-rows { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }
.alloc-row { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.alloc-head { display: grid; grid-template-columns: auto 1fr auto; align-items: start; gap: 12px; }
.alloc-icon { font-size: 1.5rem; line-height: 1; }
.alloc-titles { min-width: 0; }
.alloc-titles h4 { margin: 0 0 2px; font-size: 0.98rem; }
.alloc-result { margin: 0; font-size: 0.86rem; display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.alloc-main { font-weight: 800; font-size: 1.05rem; letter-spacing: -0.01em; }
.alloc-main.gold { color: var(--gold); }
.alloc-main.accent { color: var(--accent); }
.alloc-main.teal { color: var(--teal); }
.alloc-main.violet { color: var(--violet); }
.alloc-main.blue { color: var(--blue); }
.alloc-main.muted { color: var(--text-mute); font-weight: 600; }
.alloc-detail { font-size: 0.78rem; }
.alloc-amount { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.alloc-chf { font-size: 0.88rem; font-weight: 700; color: var(--text-soft); white-space: nowrap; }
.rest-btn {
  font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); color: var(--text-soft);
}
.rest-btn:hover:not(:disabled) { border-color: var(--teal); color: #fff; }
.rest-btn:disabled { opacity: 0.4; }

.alloc-slider { width: 100%; accent-color: var(--teal); cursor: pointer; }
.alloc-meter { height: 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.06); overflow: hidden; border: 1px solid var(--border); }
.alloc-meter .fill { height: 100%; border-radius: 999px; transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.fill.gold, .seg.gold { background: var(--gold); }
.fill.accent, .seg.accent { background: var(--accent); }
.fill.teal, .seg.teal { background: var(--teal); }
.fill.violet, .seg.violet { background: var(--violet); }
.fill.blue, .seg.blue { background: var(--blue); }

.srcs { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.srcs-lab { font-size: 0.74rem; font-weight: 600; color: var(--text-mute); }
</style>
