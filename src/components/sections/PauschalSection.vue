<script setup>
import { computed } from 'vue';
import pauschal from '@/data/pauschal.json';
import { num, chfCompact, chf } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const YEAR = 2018;
const count = pauschal.counts_ch[YEAR];
const rev = pauschal.revenue[YEAR];
const totalRev = computed(() => (rev.bund + rev.kanton + rev.gemeinde) * 1e6);
const avg = computed(() => totalRev.value / count);
</script>

<template>
  <section id="pauschal">
    <div class="wrap">
      <div class="eyebrow">Der blinde Fleck</div>
      <h2>Die {{ num(count) }} ohne Vermögensstatistik</h2>
      <p class="lead">
        Aufwandbesteuerte («Pauschalbesteuerte») werden nach ihren Lebenshaltungskosten
        veranlagt – ihr tatsächliches Vermögen wird gar nie erhoben. Sie fehlen deshalb
        in der ESTV-Vermögensstatistik, obwohl viele zu den Vermögendsten des Landes zählen.
        Im Rechner sind sie modellhaft im Tail über 10&nbsp;Mio. mitgedacht.
      </p>

      <div class="grid pgrid">
        <div class="pcard card">
          <span class="pv accent">{{ num(count) }}</span>
          <span class="pl">Personen mit Aufwandbesteuerung (2018)</span>
        </div>
        <div class="pcard card">
          <span class="pv gold">{{ chfCompact(totalRev, 0) }}</span>
          <span class="pl">Gesamter Steuerertrag (Bund + Kanton + Gemeinde)</span>
        </div>
        <div class="pcard card">
          <span class="pv">{{ chfCompact(avg, 0) }}</span>
          <span class="pl">Ø Steuer pro Person und Jahr</span>
        </div>
      </div>

      <p class="muted small">
        Spannweite der einzelnen Pauschalsteuer 2018: von {{ chf(pauschal.lowest) }} bis
        {{ chf(pauschal.highest) }}. «Personen» (FDK) sind nicht dasselbe wie «Steuerfälle» (ESTV).
      </p>
      <SourceTag id="fdk" note="Stand 31.12.2018" />
    </div>
  </section>
</template>

<style scoped>
.pgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 24px 0 16px; }
.pcard { padding: 22px; display: flex; flex-direction: column; gap: 4px; }
.pv { font-size: 2rem; font-weight: 800; }
.pv.accent { color: var(--accent); }
.pv.gold { color: var(--gold); }
.pl { color: var(--text-soft); font-size: 0.88rem; }
.small { font-size: 0.82rem; max-width: 75ch; }
</style>
