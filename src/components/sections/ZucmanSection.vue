<script setup>
// Inhalts-/Analyse-Abschnitt zu Gabriel Zucmans Mindeststeuer (2 % auf das
// Gesamtvermoegen ab 100 Mio.). Reduziert auf drei Punkte: was Zucman will,
// was die Superreichen heute an privaten Steuern zahlen und wie viel die
// Mindeststeuer zusaetzlich einbringt. Am Schluss vier Einordnungen, was das
// Zusatzaufkommen (~10 Mrd.) im Verhaltnis zu bekannten Bezugsgroessen bedeutet.
import { computed } from 'vue';
import spendRef from '@/data/spend_reference.json';
import { chf, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

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

// Gegenstueck fuer den Medianhaushalt, einkommensbasiert und aus einer Quelle
// (BFS HABE, neueste Querschnittstabelle nach Einkommensklasse, Periode
// 2015-2017). Jede Klasse umfasst 20 % der Haushalte; das mittlere Quintil
// enthaelt den Median. Steuern 785 CHF/Monat (9,9 % des Bruttoeinkommens),
// Einkommen aus Vermoegen und Vermietung 232 CHF/Monat (2,9 %). Recovery =
// 785 / 232 ~ 3,4 Jahre, also rund zwoelfmal die ~103 Tage der Spitze.
const HH_TAX_CHF = 784.6;
const HH_PROPERTY_CHF = 231.7;
const HH_GROSS_CHF = 7923.2; // Bruttoeinkommen mittleres Quintil (HABE 2015-2017)
const hhRecoveryYears = HH_TAX_CHF / HH_PROPERTY_CHF;
// Aus dem gesamten Einkommen (v. a. Arbeit) ist die Steuersumme in
// 9,9 % eines Jahres ~ 36 Tagen verdient.
const hhTaxIncomeDays = Math.round((HH_TAX_CHF / HH_GROSS_CHF) * 365);

const perCapita = computed(() => chf(REVENUE / K.population.value));
const incomeShare = computed(() => pct(REVENUE / K.einkommenssteuer_np_alle_ebenen.value, 0));
const premiumShare = computed(() =>
  pct(REVENUE / (K.okp_praemien.value - K.praemienverbilligung.value), 0),
);
const debtShare = computed(() => pct(REVENUE / K.staatsschuld_maastricht.value, 0));
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
        <span class="calc-line" v-html="$t('zucman.medLine')" />
        <span class="med-result">~{{ num(hhRecoveryYears, 1) }}&nbsp;<span class="med-unit">{{ $t('zucman.medUnit') }}</span></span>
        <span class="days-sub" v-html="$t('zucman.medSub', { days: hhTaxIncomeDays })" />
      </div>
      <div class="srcrow">
        <SourceTag id="bfs_habe" :note="$t('zucman.medSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.meaningHeading') }}</h3>
      <div class="grid egrid">
        <div class="ecard card">
          <span class="ev">~{{ perCapita }}</span>
          <span class="el">{{ $t('zucman.meaningPerCapita') }}</span>
        </div>
        <div class="ecard card">
          <span class="ev gold">~{{ incomeShare }}</span>
          <span class="el">{{ $t('zucman.meaningIncome') }}</span>
        </div>
        <div class="ecard card">
          <span class="ev gold">~{{ premiumShare }}</span>
          <span class="el">{{ $t('zucman.meaningPremium') }}</span>
        </div>
        <div class="ecard card">
          <span class="ev gold">~{{ debtShare }}</span>
          <span class="el">{{ $t('zucman.meaningDebt') }}</span>
        </div>
      </div>
      <div class="srcrow">
        <SourceTag id="efv" />
        <SourceTag id="bag" />
        <SourceTag id="bfs" />
      </div>
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
.med-result {
  font-size: 2.1rem; font-weight: 800; color: var(--accent);
  letter-spacing: -0.02em; line-height: 1; font-variant-numeric: tabular-nums;
}
.med-unit { font-size: 1.05rem; font-weight: 700; }

.egrid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 18px; }
.ecard { padding: 22px; display: flex; flex-direction: column; gap: 8px; }
.ev { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.ev.gold { color: var(--gold); }
.el { color: var(--text-soft); font-size: 0.86rem; line-height: 1.45; }
</style>
