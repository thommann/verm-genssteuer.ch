<script setup>
import { ref, computed } from 'vue';
import { useCalculator } from '@/composables/useCalculator.js';
import spendRef from '@/data/spend_reference.json';
import { chf, chfCompact, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const { staticRevenue, sustainableRevenue, state } = useCalculator();
const K = spendRef.kennzahlen;

const basis = ref('dauerhaft'); // 'dauerhaft' | 'jahr1'
const revenue = computed(() => (basis.value === 'jahr1' ? staticRevenue.value : sustainableRevenue.value));

const incomeCut = computed(() => revenue.value / K.einkommenssteuer_np_alle_ebenen.value);
const bundCut = computed(() => revenue.value / K.direkte_bundessteuer_np.value);
const premiumShare = computed(() => revenue.value / K.okp_praemien.value);
const premiumPerPersonMonth = computed(() => revenue.value / K.population.value / 12);
const dividendYear = computed(() => revenue.value / K.population.value);

const capPct = (v) => Math.min(v, 1);
const over = (v) => v > 1;
</script>

<template>
  <section id="verwendung" class="section-alt">
    <div class="wrap">
      <div class="eyebrow">Was tun mit dem Geld?</div>
      <h2>{{ chfCompact(revenue, 1) }} pro Jahr – wofür?</h2>
      <p class="lead">
        Dieselben Einnahmen, drei mögliche Verwendungen. Stell oben am Rechner ein
        Steuermodell ein und sieh hier in Echtzeit, was damit für alle möglich wäre.
      </p>

      <div class="basis-toggle">
        <button :class="{ active: basis === 'dauerhaft' }" @click="basis = 'dauerhaft'">
          Dauerhaft tragbar
        </button>
        <button :class="{ active: basis === 'jahr1' }" @click="basis = 'jahr1'">
          Erstes Jahr ({{ state.year }})
        </button>
        <span class="basis-hint muted">
          {{ basis === 'dauerhaft'
            ? 'Stabiles Niveau nach Jahren (siehe Dynamik) – die ehrliche Dauergrösse.'
            : 'Vollständiges Aufkommen im ersten Jahr (enthält Einmaleffekt an der Spitze).' }}
        </span>
      </div>

      <div class="spend-grid">
        <!-- Income tax -->
        <article class="card spend">
          <div class="spend-icon">🧾</div>
          <h3>Einkommenssteuer senken</h3>
          <div class="spend-big" :class="{ teal: true }">
            <span v-if="over(incomeCut)">über 100 %</span>
            <span v-else>−{{ pct(incomeCut, 0) }}</span>
          </div>
          <p class="spend-text">
            <template v-if="over(incomeCut)">
              Genug, um die <strong>gesamte Einkommenssteuer natürlicher Personen
              abzuschaffen</strong> – und es bliebe noch Geld übrig.
            </template>
            <template v-else>
              So viel tiefer könnte die Einkommenssteuer für <strong>alle</strong>
              ausfallen (Bund, Kantone, Gemeinden zusammen).
            </template>
          </p>
          <div class="spend-meter"><div class="fill teal" :style="{ width: `${capPct(incomeCut) * 100}%` }" /></div>
          <p class="spend-foot muted">
            Entspricht dem {{ over(bundCut) ? 'Mehrfachen der' : pct(bundCut, 0) + ' der' }}
            direkten Bundessteuer natürlicher Personen.
          </p>
          <SourceTag id="efv" />
        </article>

        <!-- Health premiums -->
        <article class="card spend">
          <div class="spend-icon">🏥</div>
          <h3>Krankenkassenprämien übernehmen</h3>
          <div class="spend-big gold">
            <span v-if="over(premiumShare)">100 %</span>
            <span v-else>{{ pct(premiumShare, 0) }}</span>
          </div>
          <p class="spend-text">
            <template v-if="over(premiumShare)">
              Genug, um <strong>sämtliche Grundversicherungs-Prämien</strong> der ganzen
              Schweiz zu bezahlen.
            </template>
            <template v-else>
              So viel aller Grundversicherungs-Prämien (OKP) könnten für alle
              <strong>übernommen</strong> werden.
            </template>
          </p>
          <div class="spend-meter"><div class="fill gold" :style="{ width: `${capPct(premiumShare) * 100}%` }" /></div>
          <p class="spend-foot muted">
            Im Schnitt ~{{ chf(premiumPerPersonMonth) }} weniger Prämie pro Person und Monat.
          </p>
          <SourceTag id="bag" />
        </article>

        <!-- Dividend -->
        <article class="card spend">
          <div class="spend-icon">💸</div>
          <h3>Pro-Kopf-Dividende</h3>
          <div class="spend-big accent">{{ chf(dividendYear) }}</div>
          <p class="spend-text">
            Pro Person und Jahr – an <strong>jede und jeden</strong> der
            {{ num(K.population.value) }} Einwohner:innen, bedingungslos.
          </p>
          <div class="spend-meter"><div class="fill accent" style="width: 100%" /></div>
          <p class="spend-foot muted">
            Das sind ~{{ chf(dividendYear / 12) }} pro Monat – für eine vierköpfige Familie
            {{ chf((dividendYear * 4)) }} im Jahr.
          </p>
          <SourceTag id="bfs" />
        </article>
      </div>

      <p class="disclaimer muted">
        Bezugsgrössen aus offiziellen Bundesquellen (EFV/ESTV, BAG, BFS), gerundet, nominal.
        Es ist <em>entweder/oder</em>: jeder Franken kann nur einmal ausgegeben werden.
        Die Beispiele zeigen die Grössenordnung, keine fertige Politik.
      </p>
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

.spend-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.spend { padding: 26px 24px; display: flex; flex-direction: column; gap: 8px; }
.spend-icon { font-size: 2rem; }
.spend h3 { margin: 0; }
.spend-big { font-size: clamp(2.4rem, 6vw, 3.2rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin: 4px 0; }
.spend-big.gold { color: var(--gold); }
.spend-big.accent { color: var(--accent); }
.spend-big.teal { color: var(--teal); }
.spend-text { font-size: 0.92rem; color: var(--text-soft); margin: 0; min-height: 3.4em; }
.spend-meter { height: 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.06); overflow: hidden; border: 1px solid var(--border); margin: 6px 0; }
.fill { height: 100%; border-radius: 999px; transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.fill.teal { background: var(--teal); }
.fill.gold { background: var(--gold); }
.fill.accent { background: var(--accent); }
.spend-foot { font-size: 0.8rem; margin: 2px 0 8px; }
.disclaimer { font-size: 0.82rem; margin-top: 24px; max-width: 75ch; }
</style>
