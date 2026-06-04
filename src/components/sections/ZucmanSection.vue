<script setup>
// Inhalts-/Analyse-Abschnitt zu Gabriel Zucmans Mindeststeuer (2 % auf das
// Gesamtvermoegen ab 100 Mio.). Reduziert auf drei Punkte: was Zucman will,
// was die Superreichen heute an privaten Steuern zahlen und wie viel die
// Mindeststeuer zusaetzlich einbringt.
import SourceTag from '@/components/ui/SourceTag.vue';
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
</style>
