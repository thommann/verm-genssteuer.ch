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
// 1987-2024). Recovery = 0,02 / 0,071 ~ 103 Tage.
const ZUCMAN_RATE = 0.02;
const PASSIVE_RETURN = 0.071;
const recoveryDays = Math.round((ZUCMAN_RATE / PASSIVE_RETURN) * 365);

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
        <span class="days-result">~{{ recoveryDays }}&nbsp;<span class="days-unit">{{ $t('zucman.daysUnit') }}</span></span>
        <span class="days-sub" v-html="$t('zucman.daysSub')" />
      </div>
      <div class="srcrow">
        <SourceTag id="zucman_g20" :note="$t('zucman.daysSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.medHeading') }}</h3>
      <div class="card medbox">
        <span class="calc-line">{{ $t('zucman.medLine') }}</span>
        <div class="medtable-scroll">
        <table class="medtable">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t('zucman.medColIncome') }}</th>
              <th>{{ $t('zucman.medColPassive') }}</th>
              <th>{{ $t('zucman.medColTotal') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{{ $t('zucman.medRowArbeiter') }}</th>
              <td class="mt-income" :data-label="$t('zucman.medColIncome')">{{ num(HH_WORKER.brutto, 0) }}</td>
              <td class="mt-accent" :data-label="$t('zucman.medColPassive')">~{{ num(HH_WORKER.jahre, 1) }}&nbsp;{{ $t('zucman.medUnit') }}</td>
              <td :data-label="$t('zucman.medColTotal')">~{{ num(HH_WORKER.tage, 0) }}&nbsp;{{ $t('zucman.medDaysUnit') }}</td>
            </tr>
            <tr>
              <th>{{ $t('zucman.medRowMittel') }}</th>
              <td class="mt-income" :data-label="$t('zucman.medColIncome')">{{ num(HH_MIDDLE.brutto, 0) }}</td>
              <td :data-label="$t('zucman.medColPassive')">~{{ num(HH_MIDDLE.jahre, 1) }}&nbsp;{{ $t('zucman.medUnit') }}</td>
              <td :data-label="$t('zucman.medColTotal')">~{{ num(HH_MIDDLE.tage, 0) }}&nbsp;{{ $t('zucman.medDaysUnit') }}</td>
            </tr>
          </tbody>
        </table>
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
.body :deep(.hl) { color: var(--accent); font-weight: 700; }
.body :deep(.hl.gold) { color: var(--gold); }

.calclist { margin: 14px 0 0; padding-left: 20px; color: var(--text-soft); max-width: 74ch; }
.calclist li { margin-bottom: 8px; font-size: 0.94rem; line-height: 1.55; }
.calclist :deep(strong) { color: var(--text); }

.srcrow { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 14px; }

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
.days-unit { font-size: 1.05rem; font-weight: 700; }
.days-sub { color: var(--text-soft); font-size: 0.94rem; line-height: 1.55; }
.days-sub :deep(strong) { color: var(--text); }

.medbox {
  margin: 16px 0 4px; padding: 22px 24px;
  display: flex; flex-direction: column; gap: 8px;
  border-left: 3px solid var(--accent);
}
.medtable-scroll { margin: 14px 0 4px; max-width: 100%; overflow-x: auto; }
.medtable {
  width: 100%; border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.medtable th, .medtable td { padding: 8px 6px; text-align: right; }
.medtable thead th {
  color: var(--text-soft); font-weight: 600; font-size: 0.8rem;
  line-height: 1.25; vertical-align: bottom;
}
.medtable thead th:first-child { width: 1%; }
.medtable tbody th {
  text-align: left; color: var(--text-soft); font-weight: 600; font-size: 0.9rem;
}
.medtable tbody td { color: var(--text); font-weight: 800; font-size: 1.2rem; white-space: nowrap; }
.medtable tbody td.mt-income { color: var(--text-soft); font-weight: 600; font-size: 1rem; }
.medtable tbody td.mt-accent { color: var(--accent); }
.medtable tbody tr + tr th, .medtable tbody tr + tr td {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 560px) {
  .medbox { padding: 18px 16px; }
  .medtable-scroll { overflow-x: visible; }
  /* Tabelle als gestapelte Karten, damit die langen Spaltenkoepfe nicht ueberlaufen */
  .medtable thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .medtable, .medtable tbody, .medtable tr, .medtable tbody th, .medtable tbody td { display: block; }
  .medtable tbody tr {
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
    padding: 12px 14px;
  }
  .medtable tbody tr + tr { margin-top: 12px; }
  .medtable tbody tr + tr th, .medtable tbody tr + tr td { border-top: none; }
  .medtable tbody th {
    color: var(--text); font-size: 1rem; padding: 0 0 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 6px;
  }
  .medtable tbody td {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 1px; padding: 6px 0; text-align: left; white-space: normal;
    font-size: 1.1rem; overflow-wrap: anywhere;
  }
  .medtable tbody td.mt-income { font-size: 1.1rem; }
  .medtable tbody td::before {
    content: attr(data-label); order: -1;
    color: var(--text-soft); font-weight: 600; font-size: 0.78rem; line-height: 1.3;
  }
}
</style>
