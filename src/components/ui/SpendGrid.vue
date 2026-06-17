<script setup>
import { computed } from 'vue';
import spendRef from '@/data/spend_reference.json';
import infra from '@/data/infrastruktur.json';
import { chf, chfCompact, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const props = defineProps({
  revenue: { type: Number, required: true },
  // null = kann nicht berechnet werden (Horizont überschritten), zeigt "> 250"
  debtFreeYears: { type: Number, default: null },
  // null = flache Hochrechnung (kein dynamisches Modell verfügbar)
  rendite: { type: Number, default: null },
  // Kompakte Darstellung: nur Zahl und Label, ohne Icon/Meter/Fussnote/Quelle
  mini: { type: Boolean, default: false },
  // Mittlere Darstellung: Icon, Zahl, Label und Balken, aber ohne Fliesstext/Fussnote/Quelle
  compact: { type: Boolean, default: false },
});

const K = spendRef.kennzahlen;
const netPraemien = K.okp_praemien.value - K.praemienverbilligung.value;

// Volle Detailtiefe (Fliesstext, Fussnote, Quelle) nur ausserhalb von mini/compact.
const detail = computed(() => !props.mini && !props.compact);

const incomeCut = computed(() => props.revenue / K.einkommenssteuer_np_alle_ebenen.value);
const bundCut = computed(() => props.revenue / K.direkte_bundessteuer_np.value);
const premiumShare = computed(() => props.revenue / netPraemien);
const premiumPerPersonMonth = computed(() => props.revenue / K.population.value / 12);
const dividendYear = computed(() => props.revenue / K.population.value);
const oevCut = computed(() => props.revenue / K.oev_personenverkehrsertrag.value);
const incomeLeft = computed(() => props.revenue - K.einkommenssteuer_np_alle_ebenen.value);
const premiumLeft = computed(() => props.revenue - netPraemien);
const oevLeft = computed(() => props.revenue - K.oev_personenverkehrsertrag.value);

// Gesamte jaehrliche Ausgaben der oeffentlichen Hand vervielfachen:
// Faktor = (heutige Gesamtausgaben + Mehreinnahmen) / heutige Gesamtausgaben.
// Basis aus infrastruktur.json (EFV-Finanzstatistik, Sektor Staat = alle Staatsebenen,
// brutto inkl. Betrieb): funk 61 = Strassenverkehr, funk 62 = oeffentlicher Verkehr,
// Gruppe 2 = Bildung. Quelle: efv. Aktuellstes Jahr.
const VJ = infra.verkehr.jahre;
const VJAHR = Object.keys(VJ).sort().at(-1);
const OEV_TOTAL = VJ[VJAHR].oev;
const STRASSE_TOTAL = VJ[VJAHR].strasse;
const oevFactor = computed(() => (OEV_TOTAL + props.revenue) / OEV_TOTAL);
const strasseFactor = computed(() => (STRASSE_TOTAL + props.revenue) / STRASSE_TOTAL);
const oevSpendShare = computed(() => props.revenue / OEV_TOTAL);
const strasseShare = computed(() => props.revenue / STRASSE_TOTAL);

const BJ = infra.bildung.jahre;
const BJAHR = Object.keys(BJ).sort().at(-1);
const BILDUNG_TOTAL = BJ[BJAHR].total;
const bildungFactor = computed(() => (BILDUNG_TOTAL + props.revenue) / BILDUNG_TOTAL);
const bildungShare = computed(() => props.revenue / BILDUNG_TOTAL);

const debtShare = computed(() => (props.debtFreeYears != null ? 1 / props.debtFreeYears : 0));
const debtFreeYearsLabel = computed(() => {
  const y = props.debtFreeYears;
  if (y == null) return '> 250';
  return y < 10 ? num(y, 1, 1) : num(y, 0);
});

const F35_FLEET = K.f35_flotte.value;
const f35Price = Math.round(K.f35_preis_pro_jet.value / 1e6);
const f35Count = computed(() => Math.floor(props.revenue / K.f35_preis_pro_jet.value));
const f35Ratio = computed(() => f35Count.value / F35_FLEET);

const capPct = (v) => Math.min(v, 1);
const over = (v) => v > 1;
</script>

<template>
  <div :class="['spend-grid', { mini, compact }]">
    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🧾</span>
        <h3>{{ $t('spend.incomeTitle') }}</h3>
      </div>
      <div class="spend-big teal">
        <span v-if="over(incomeCut)">{{ $t('spend.incomeOver') }}</span>
        <span v-else>−{{ pct(incomeCut, 0) }}</span>
      </div>
      <p v-if="detail" class="spend-text" v-html="over(incomeCut) ? $t('spend.incomeTextOver') : $t('spend.incomeTextUnder')" />
      <div v-if="!mini" class="spend-meter"><div class="fill teal" :style="{ width: `${capPct(incomeCut) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">
          <span v-if="over(incomeCut)">{{ $t('spend.leftover', { rest: chfCompact(incomeLeft, 1) }) }}</span>
          <span v-else-if="over(bundCut)">{{ $t('spend.incomeFootOver') }}</span>
          <span v-else>{{ $t('spend.incomeFootUnder', { pct: pct(bundCut, 0) }) }}</span>
        </p>
        <SourceTag id="efv" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🏥</span>
        <h3>{{ $t('spend.premiumTitle') }}</h3>
      </div>
      <div class="spend-big gold">
        <span v-if="over(premiumShare)">{{ $t('spend.premiumOver') }}</span>
        <span v-else>{{ pct(premiumShare, 0) }}</span>
      </div>
      <p v-if="detail" class="spend-text" v-html="over(premiumShare) ? $t('spend.premiumTextOver') : $t('spend.premiumTextUnder')" />
      <div v-if="!mini" class="spend-meter"><div class="fill gold" :style="{ width: `${capPct(premiumShare) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">
          <span v-if="over(premiumShare)">{{ $t('spend.leftover', { rest: chfCompact(premiumLeft, 1) }) }}</span>
          <span v-else>{{ $t('spend.premiumFoot', { amount: chf(premiumPerPersonMonth) }) }}</span>
        </p>
        <SourceTag id="bag" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">💸</span>
        <h3>{{ $t('spend.dividendTitle') }}</h3>
      </div>
      <div class="spend-big accent">{{ chf(dividendYear) }}</div>
      <p v-if="detail" class="spend-text" v-html="$t('spend.dividendText', { population: num(K.population.value) })" />
      <div v-if="!mini" class="spend-meter"><div class="fill accent" style="width: 100%" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">
          {{ $t('spend.dividendFoot', { month: chf(dividendYear / 12), family: chf(dividendYear * 4) }) }}
        </p>
        <SourceTag id="bfs" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🚆</span>
        <h3>{{ $t('spend.oevTitle') }}</h3>
      </div>
      <div class="spend-big blue">
        <span v-if="over(oevCut)">{{ $t('spend.oevOver') }}</span>
        <span v-else>−{{ pct(oevCut, 0) }}</span>
      </div>
      <p v-if="detail" class="spend-text" v-html="over(oevCut) ? $t('spend.oevTextOver') : $t('spend.oevTextUnder')" />
      <div v-if="!mini" class="spend-meter"><div class="fill blue" :style="{ width: `${capPct(oevCut) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">
          <span v-if="over(oevCut)">{{ $t('spend.leftover', { rest: chfCompact(oevLeft, 1) }) }}</span>
          <span v-else>{{ $t('spend.oevFoot', { amount: chfCompact(K.oev_personenverkehrsertrag.value, 1) }) }}</span>
        </p>
        <SourceTag id="litra" :note="$t('spend.oevSourceNote')" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🚊</span>
        <h3>{{ $t('spend.oevSpendTitle') }}</h3>
      </div>
      <div class="spend-big blue">×{{ num(oevFactor, 1, 1) }}</div>
      <p v-if="detail" class="spend-text" v-html="$t('spend.oevSpendText')" />
      <div v-if="!mini" class="spend-meter"><div class="fill blue" :style="{ width: `${capPct(oevSpendShare) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">{{ $t('spend.oevSpendFoot', { amount: chfCompact(OEV_TOTAL, 1), jahr: VJAHR }) }}</p>
        <SourceTag id="efv" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🛣️</span>
        <h3>{{ $t('spend.strasseSpendTitle') }}</h3>
      </div>
      <div class="spend-big accent">×{{ num(strasseFactor, 1, 1) }}</div>
      <p v-if="detail" class="spend-text" v-html="$t('spend.strasseSpendText')" />
      <div v-if="!mini" class="spend-meter"><div class="fill accent" :style="{ width: `${capPct(strasseShare) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">{{ $t('spend.strasseSpendFoot', { amount: chfCompact(STRASSE_TOTAL, 1), jahr: VJAHR }) }}</p>
        <SourceTag id="efv" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🎓</span>
        <h3>{{ $t('spend.bildungSpendTitle') }}</h3>
      </div>
      <div class="spend-big teal">×{{ num(bildungFactor, 1, 1) }}</div>
      <p v-if="detail" class="spend-text" v-html="$t('spend.bildungSpendText')" />
      <div v-if="!mini" class="spend-meter"><div class="fill teal" :style="{ width: `${capPct(bildungShare) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">{{ $t('spend.bildungSpendFoot', { amount: chfCompact(BILDUNG_TOTAL, 1), jahr: BJAHR }) }}</p>
        <SourceTag id="efv" />
      </template>
    </article>

    <article class="card spend">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">✈️</span>
        <h3>{{ $t('spend.f35Title') }}</h3>
      </div>
      <div class="spend-big gold">
        {{ f35Count }}<span class="spend-unit">{{ $t('spend.f35Unit') }}</span>
      </div>
      <p
        v-if="detail"
        class="spend-text"
        v-html="over(f35Ratio)
          ? $t('spend.f35TextOver', { fleet: F35_FLEET, extra: f35Count - F35_FLEET })
          : $t('spend.f35TextUnder', { fleet: F35_FLEET, price: f35Price })"
      />
      <div v-if="!mini" class="spend-meter"><div class="fill gold" :style="{ width: `${capPct(f35Ratio) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">{{ $t('spend.f35Foot', { fleet: F35_FLEET }) }}</p>
        <SourceTag id="f35_beschaffung" />
      </template>
    </article>

    <article class="card spend spend-accent">
      <div class="spend-head">
        <span v-if="!mini" class="spend-icon">🗓️</span>
        <h3>{{ $t('spend.debtfreeTitle') }}</h3>
      </div>
      <div class="spend-big violet">
        {{ debtFreeYearsLabel }}<span class="spend-unit">{{ $t('spend.debtfreeUnit') }}</span>
      </div>
      <p
        v-if="detail"
        class="spend-text"
        v-html="rendite != null ? $t('spend.debtfreeText') : $t('spend.debtfreeTextFlat')"
      />
      <div v-if="!mini" class="spend-meter"><div class="fill violet" :style="{ width: `${capPct(debtShare) * 100}%` }" /></div>
      <template v-if="detail">
        <p class="spend-foot muted">
          {{
            rendite != null
              ? $t('spend.debtfreeFoot', { rendite: pct(rendite, 0) })
              : $t('spend.debtfreeFootFlat')
          }}
        </p>
        <SourceTag id="efv" />
      </template>
    </article>
  </div>
</template>

<style scoped>
/* Standard: 1 Spalte (Mobile), 2 ab 560px, 3 ab 900px (Desktop). */
.spend-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 560px) { .spend-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 900px) { .spend-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
/* Jede Kachel ist selbst ein Grid und teilt ihre Zeilen ueber subgrid mit den Nachbarn
   derselben Reihe: Kopf (Icon+Titel), Zahl, Infotext, Balken, Zusatzinfo, Quelle liegen so
   auf gleicher Hoehe. Feste Zeilenzahl je Detailgrad: voll = 6, compact = 3 (Kopf/Zahl/
   Balken), mini = 2 (Kopf/Zahl). */
.spend {
  grid-row: span 6;
  display: grid;
  grid-template-rows: subgrid;
  gap: 8px;
  padding: 26px 24px;
  min-width: 0;
}
.spend-grid.compact { gap: 16px; }
.spend-grid.compact .spend { grid-row: span 3; gap: 6px; padding: 22px 22px; }
.compact .spend-big { font-size: clamp(2rem, 4.5vw, 2.6rem); }
.spend-grid.mini { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.spend-grid.mini .spend { grid-row: span 2; gap: 6px; padding: 18px 20px; }
.mini .spend-big { font-size: clamp(1.6rem, 3.5vw, 2rem); }
.mini .spend h3 { font-size: 0.9rem; }
.spend-head { display: flex; align-items: center; gap: 12px; min-width: 0; }
.spend-icon { font-size: 2rem; line-height: 1; flex: none; }
.spend h3 { margin: 0; min-width: 0; overflow-wrap: break-word; hyphens: auto; }
.spend-big { font-size: clamp(2.4rem, 6vw, 3.2rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1; align-self: end; }
.spend-big.gold { color: var(--gold); }
.spend-big.accent { color: var(--accent); }
.spend-big.teal { color: var(--teal); }
.spend-big.violet { color: var(--violet); }
.spend-big.blue { color: var(--blue); }
.spend-unit { font-size: 0.4em; font-weight: 700; letter-spacing: 0; margin-left: 0.5em; }
.spend-accent {
  border-color: color-mix(in srgb, var(--violet) 40%, var(--border));
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--violet) 7%, transparent), transparent 60%),
    linear-gradient(160deg, var(--bg-card), var(--bg-card-2));
}
.spend-text { font-size: 0.92rem; color: var(--text-soft); margin: 0; overflow-wrap: break-word; }
.spend-meter { height: 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.06); overflow: hidden; border: 1px solid var(--border); align-self: start; }
.fill { height: 100%; border-radius: 999px; transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.fill.teal { background: var(--teal); }
.fill.gold { background: var(--gold); }
.fill.accent { background: var(--accent); }
.fill.violet { background: var(--violet); }
.fill.blue { background: var(--blue); }
.spend-foot { font-size: 0.8rem; margin: 0; }

@media (max-width: 600px) {
  .spend-icon { font-size: 1.7rem; }
  .spend-head { gap: 10px; }
}
</style>
