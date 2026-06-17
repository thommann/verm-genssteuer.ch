<script setup>
import spendRef from '@/data/spend_reference.json';
import habe from '@/data/habe.json';
import { num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';
import SpendGrid from '@/components/ui/SpendGrid.vue';

const REVENUE = 10e9; // Zusatzaufkommen der Mindeststeuer, gerundet
const K = spendRef.kennzahlen;

// Wie schnell holen die Superreichen die Steuer ueber den passiven
// Vermoegenszuwachs wieder herein. ZUCMAN_RATE = ganze Mindeststeuer (2 %),
// nicht nur die Mehrbelastung. PASSIVE_RETURN = realer Zuwachs grosser
// Vermoegen p. a. (Zucman, G20-Report 2024: Top 0,0001 % rund 7,1 % real
// 1987-2024). Recovery = 0,02 / 0,071 ~ 0,28 Jahre ~ 3 Monate (~103 Tage).
const ZUCMAN_RATE = 0.02;
const PASSIVE_RETURN = 0.071;
const recoveryMonths = Math.round((ZUCMAN_RATE / PASSIVE_RETURN) * 12);

// Gegenstueck einkommensbasiert aus einer Quelle (BFS HABE, Tabelle nach
// Einkommensklasse, Periode 2015-2017; reproduzierbar via
// scripts/05_extract_habe.py -> src/data/habe.json). Jede Klasse umfasst 20 %
// der Haushalte.
//   - Arbeiterhaushalt = mittleres Einkommensfuenftel (enthaelt den Median).
//   - Mittelstaendischer Haushalt = Durchschnitt aller Haushalte («Saemtliche»),
//     den die Vermoegensspitze nach oben zieht.
// Die Karte zeigt je: Jahre = Steuern / Vermoegenseinkommen (passiv) und
// Tage = Steuern / Bruttoeinkommen * 365 (aus dem gesamten Einkommen).
const HH_WORKER = habe.arbeiter;
const HH_MIDDLE = habe.mittelstand;

const debtFreeYearsFlat = K.staatsschuld_maastricht.value / REVENUE;
</script>

<template>
  <section id="zucman">
    <div class="wrap">
      <div class="eyebrow">{{ $t('zucman.eyebrow') }}</div>
      <h2 v-html="$t('zucman.title')" />
      <p class="lead" v-html="$t('zucman.lead')" />

      <h3 class="block-h">{{ $t('zucman.wantHeading') }}</h3>
      <p class="body" v-html="$t('zucman.wantText')" />
      <div class="srcrow">
        <SourceTag id="woz_zucman" :note="$t('zucman.wantSource')" />
        <SourceTag id="bilanz300" :note="$t('zucman.baseSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.todayHeading') }}</h3>
      <p class="body" v-html="$t('zucman.todayText')" />
      <ul class="calclist">
        <li v-html="$t('zucman.todayItem1')" />
        <li v-html="$t('zucman.todayItem2')" />
        <li v-html="$t('zucman.todaySum')" />
      </ul>
      <div class="srcrow">
        <SourceTag id="nzz_vermoegenssteuer" :note="$t('zucman.todaySource')" />
        <SourceTag id="reichensteuer_studie" :note="$t('zucman.todaySource2')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.extraHeading') }}</h3>
      <p class="body" v-html="$t('zucman.extraText')" />
      <div class="card calcbox">
        <span class="calc-line" v-html="$t('zucman.calcLine')" />
        <span class="calc-result" v-html="$t('zucman.calcResult')" />
      </div>

      <div class="card daysbox">
        <span class="calc-line" v-html="$t('zucman.daysLine')" />
        <span class="days-result">~{{ recoveryMonths }}&nbsp;<span class="recovery-unit">{{ $t('zucman.recoveryUnit') }}</span></span>
        <span class="days-sub" v-html="$t('zucman.daysSub')" />
      </div>
      <div class="srcrow">
        <SourceTag id="zucman_g20" :note="$t('zucman.daysSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.medHeading') }}</h3>
      <div class="card medbox">
        <span class="calc-line">{{ $t('zucman.medLine') }}</span>
        <div class="med-figures">
          <div class="med-fig">
            <span class="med-val mt-accent">~{{ num(HH_WORKER.jahre, 1) }}&nbsp;{{ $t('zucman.medUnit') }}</span>
            <span class="med-lab">{{ $t('zucman.medRowArbeiter') }}</span>
          </div>
          <div class="med-fig">
            <span class="med-val">~{{ num(HH_MIDDLE.jahre, 1) }}&nbsp;{{ $t('zucman.medUnit') }}</span>
            <span class="med-lab">{{ $t('zucman.medRowMittel') }}</span>
          </div>
        </div>
        <span class="days-sub" v-html="$t('zucman.medCaption')" />
      </div>
      <div class="srcrow">
        <SourceTag id="bfs_habe" :note="$t('zucman.medSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.meaningHeading') }}</h3>
      <SpendGrid :revenue="REVENUE" :debt-free-years="debtFreeYearsFlat" mini />
    </div>
  </section>
</template>

<style scoped>
.block-h { margin-top: 40px; }
.body { font-size: 0.96rem; line-height: 1.65; color: var(--text-soft); max-width: 74ch; }
.body :deep(strong) { color: var(--text); }
/* Im Fliesstext ist .hl nur farbige Hervorhebung, kein Marker: Markerflaeche entfernen,
   damit nicht farbige Schrift auf gleichfarbigem Marker steht (unleserlich). */
.body :deep(.hl) { background: none; padding: 0; border-radius: 0; color: var(--accent); font-weight: 700; }
.body :deep(.hl.gold) { color: var(--gold); }

.calclist { margin: 14px 0 0; padding-left: 20px; color: var(--text-soft); max-width: 74ch; }
.calclist li { margin-bottom: 8px; font-size: 0.94rem; line-height: 1.55; }
.calclist :deep(strong) { color: var(--text); }

.srcrow { margin-top: 14px; }

.calcbox {
  margin: 18px 0 4px; padding: 22px 24px;
  display: flex; flex-direction: column; gap: 8px;
  border-left: 3px solid var(--accent);
}
.calc-line { color: var(--text-soft); font-size: 0.98rem; font-variant-numeric: tabular-nums; }
.calc-line :deep(strong) { color: var(--text); }
.calc-result { font-size: 1.5rem; font-weight: 800; color: var(--accent); letter-spacing: -0.01em; }
.calc-result :deep(strong) { color: var(--accent); }

.daysbox {
  margin: 16px 0 4px; padding: 22px 24px;
  display: flex; flex-direction: column; gap: 8px;
  border-left: 3px solid var(--gold);
}
.days-result {
  font-size: 2.1rem; font-weight: 800; color: var(--gold);
  letter-spacing: -0.02em; line-height: 1; font-variant-numeric: tabular-nums;
}
.recovery-unit { font-size: 1.05rem; font-weight: 700; }
.days-sub { color: var(--text-soft); font-size: 0.94rem; line-height: 1.55; }
.days-sub :deep(strong) { color: var(--text); }

.medbox {
  margin: 16px 0 4px; padding: 22px 24px;
  display: flex; flex-direction: column; gap: 8px;
  border-left: 3px solid var(--accent);
}
.med-figures {
  margin: 14px 0 4px;
  display: flex; flex-wrap: wrap; gap: 14px 40px;
}
.med-fig { display: flex; flex-direction: column; gap: 2px; }
.med-val {
  font-size: 2.1rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1;
  color: var(--text); font-variant-numeric: tabular-nums;
}
.med-val.mt-accent { color: var(--accent); }
.med-lab { color: var(--text-soft); font-weight: 600; font-size: 0.9rem; }
</style>
