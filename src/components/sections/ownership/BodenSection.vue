<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ownership from '@/data/ownership.json';
import { num, pct, pct0 } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';
import StatGrid from '@/components/ui/StatGrid.vue';
import StatCard from '@/components/ui/StatCard.vue';

const { t } = useI18n();
const gebaeude = ownership.gebaeude;
const mietwohnungen = ownership.mietwohnungen;
const wohnBfs = ownership.wohnungen_bfs;
const wohneigentum = ownership.wohneigentum;
const boden = ownership.boden;
const groesste = boden.groesste;

// Privatanteil an den Mietwohnungen nach Bauperiode (BFS): Neubauten gehören seltener Privaten.
const baujahrItems = computed(() => [
  { label: t('ownership.baujahrVor'), value: wohnBfs.baujahr.vor_1946, color: 'var(--gold)' },
  { label: t('ownership.baujahrNach'), value: wohnBfs.baujahr.nach_2000, color: 'var(--accent)' },
]);

// Wohneigentumsquote (selbstbewohntes Eigentum) über die Zeit.
const wohneigentumTrend = computed(() => [{
  name: t('ownership.wohneigentumLine'), color: 'var(--accent)',
  points: wohneigentum.serie.map((p) => ({ x: p.jahr, y: p.quote })),
}]);
const woYears = computed(() => wohneigentum.serie.map((p) => p.jahr));

// Pachtanteil an der landwirtschaftlichen Nutzfläche über die Zeit.
const pachtTrend = computed(() => [{
  name: t('ownership.pachtLine'), color: 'var(--accent)',
  points: boden.pacht.serie.map((p) => ({ x: p.jahr, y: p.anteil })),
}]);
const pachtYears = computed(() => boden.pacht.serie.map((p) => p.jahr));

const gebaeudeItems = computed(() => [
  { label: t('ownership.gebNatuerliche'), value: gebaeude.natuerliche_share, color: 'var(--gold)' },
  { label: t('ownership.gebJuristische'), value: gebaeude.juristische_share, color: 'var(--accent)' },
  { label: t('ownership.gebGemeinschaft'), value: gebaeude.gemeinschaft_share, color: 'var(--accent)' },
  { label: t('ownership.gebUebrige'), value: gebaeude.uebrige_share, color: 'var(--accent)' },
]);

const mietItems = computed(() => [
  { label: t('ownership.mietPrivat'), value: mietwohnungen.privat, color: 'var(--gold)' },
  { label: t('ownership.mietInstitutionell'), value: mietwohnungen.institutionell, color: 'var(--accent)' },
  { label: t('ownership.mietGenossenschaften'), value: mietwohnungen.genossenschaften, color: 'var(--gold)' },
  { label: t('ownership.mietImmofirmen'), value: mietwohnungen.immobilienfirmen, color: 'var(--accent)' },
  { label: t('ownership.mietOeffentlich'), value: mietwohnungen.oeffentlich, color: 'var(--gold)' },
]);

</script>

<template>
  <section id="boden">
    <div class="wrap">
      <div class="eyebrow">
        {{ $t('ownership.bodenEyebrow') }}
      </div>
      <h2>{{ $t('ownership.bodenHeading') }}</h2>
      <p
        class="lead"
        v-html="$t('ownership.bodenIntro', {
          natuerliche: pct(gebaeude.natuerliche_share, 0),
        })"
      />
      <p
        class="muted small note"
        v-html="$t('ownership.registerNote')"
      />
      <span class="srcrow"><SourceTag
        id="wav_zuerich"
        :note="$t('ownership.registerSource')"
      /></span>

      <div class="card chartbox">
        <h3>{{ $t('ownership.gebChartTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.gebChartIntro')"
        />
        <BarChart
          :items="gebaeudeItems"
          :max="1"
          :format-value="(v) => pct(v, 1)"
          accent="var(--gold)"
        />
        <SourceTag
          id="bfs_gebaeude"
          :note="$t('ownership.gebChartSource', { jahr: gebaeude.jahr })"
        />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.mietChartTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.mietChartIntro', { institutionell: pct(mietwohnungen.institutionell, 0) })"
        />
        <BarChart
          :items="mietItems"
          :max="1"
          :format-value="pct0"
          accent="var(--gold)"
        />
        <SourceTag
          id="raiffeisen_immo"
          :note="$t('ownership.mietChartSource', { jahr: mietwohnungen.jahr })"
        />
      </div>
      <div class="card chartbox">
        <h3>{{ $t('ownership.baujahrTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.baujahrIntro', { privat: pct(wohnBfs.privat, 0) })"
        />
        <BarChart
          :items="baujahrItems"
          :max="1"
          :format-value="pct0"
          accent="var(--gold)"
        />
        <SourceTag
          id="bfs_wohnungen"
          :note="$t('ownership.baujahrSource', { jahr: wohnBfs.jahr })"
        />
      </div>
      <div class="card chartbox">
        <h3>{{ $t('ownership.wohneigentumTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.wohneigentumIntro', {
            peak: pct(wohneigentum.peak_quote, 1),
            peakJahr: wohneigentum.peak_jahr,
            quote: pct(wohneigentum.quote, 1),
            jahr: wohneigentum.jahr,
          })"
        />
        <LineChart
          :aria-label="$t('ownership.wohneigentumTitle')"
          :series="wohneigentumTrend"
          :x-domain="[woYears[0], woYears[woYears.length - 1]]"
          :x-ticks="woYears.filter((y) => y % 2 === 1)"
          :y-domain="[0.34, 0.39]"
          :y-ticks="[0.34, 0.36, 0.38]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :x-label="$t('ownership.axisYear')"
          :y-label="$t('ownership.wohneigentumLine')"
          :height="280"
        />
        <SourceTag
          id="bfs_wohneigentum"
          :note="$t('ownership.wohneigentumSource')"
        />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.pachtTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.pachtIntro')"
        />
        <LineChart
          :aria-label="$t('ownership.pachtTitle')"
          :series="pachtTrend"
          :x-domain="[pachtYears[0], pachtYears[pachtYears.length - 1]]"
          :x-ticks="pachtYears"
          :y-domain="[0.35, 0.5]"
          :y-ticks="[0.35, 0.4, 0.45, 0.5]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :x-label="$t('ownership.axisYear')"
          :y-label="$t('ownership.pachtLine')"
          :height="280"
        />
        <SourceTag
          id="bfs_pacht"
          :note="$t('ownership.pachtSource')"
        />
      </div>

      <h3 class="block-h">
        {{ $t('ownership.groessteHeading') }}
      </h3>
      <p class="muted small intro2">
        {{ $t('ownership.groessteIntro') }}
      </p>
      <StatGrid :style="{ margin: '8px 0 14px' }">
        <StatCard
          v-for="g in groesste"
          :key="g.id"
          tone="accent"
        >
          <template #value>
            {{ num(g.menge, 1) }}<span class="unit"> {{ g.einheit }}</span>
          </template>
          <template #label>
            {{ $t('ownership.groesste_' + g.id) }}
          </template>
          <SourceTag :id="g.quelle" />
        </StatCard>
      </StatGrid>

      <h3 class="block-h">
        {{ $t('ownership.auslandHeading') }}
      </h3>
      <div class="card artbox">
        <p
          class="body"
          v-html="$t('ownership.lexLead')"
        />
        <p
          class="body"
          v-html="$t('ownership.lexChain')"
        />

        <h4 class="prose-h">
          {{ $t('ownership.lexHlocker') }}
        </h4>
        <p
          class="body"
          v-html="$t('ownership.lexLocker1')"
        />
        <p
          class="body"
          v-html="$t('ownership.lexLocker2')"
        />

        <h4 class="prose-h">
          {{ $t('ownership.lexHabschaffung') }}
        </h4>
        <p
          class="body"
          v-html="$t('ownership.lexAbschaffung')"
        />

        <h4 class="prose-h">
          {{ $t('ownership.lexHoffen') }}
        </h4>
        <p
          class="body"
          v-html="$t('ownership.lexOffen')"
        />
        <p
          class="body"
          v-html="$t('ownership.lexBlackrock', {
            anteil: pct(boden.blackrock.anteil, 0),
            wert: num(boden.blackrock.wert_mrd, 0),
            firmen: num(boden.blackrock.firmen, 0),
            faktor: num(boden.blackrock.faktor_10j, 0),
            sps: pct(boden.blackrock.sps_anteil, 0),
          })"
        />

        <h4 class="prose-h">
          {{ $t('ownership.lexHplan') }}
        </h4>
        <p
          class="body"
          v-html="$t('ownership.lexPlan')"
        />

        <div class="srcrow">
          <SourceTag id="lex_koller_bewg" />
          <SourceTag id="lex_koller_hls" />
          <SourceTag id="lex_koller_chronik" />
          <SourceTag id="lex_koller_geschichte" />
          <SourceTag id="lex_koller_srf" />
          <SourceTag id="lex_koller_behalten" />
          <SourceTag id="lex_koller_ausnahmen" />
          <SourceTag id="lex_koller_euefta" />
          <SourceTag id="blackrock_immo" />
          <SourceTag id="lex_koller_reform" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.small { font-size: 0.85rem; max-width: 75ch; }
.note { margin-top: 16px; color: var(--text-mute); }
.block-h { margin-top: 40px; }
.intro2 { margin-top: 8px; margin-bottom: 18px; }
.srcrow { margin-top: 8px; }
.artbox { margin-top: 16px; padding: 28px 30px; }
.body {
  margin: 0 0 14px;
  font-size: 1.0rem;
  line-height: 1.7;
  color: var(--text-soft);
  max-width: 68ch;
}
.body:last-of-type { margin-bottom: 0; }
.body :deep(strong) { color: var(--text); font-weight: 800; }
.prose-h { margin: 26px 0 10px; color: var(--text); font-size: 1.1rem; }
.artbox .srcrow { margin-top: 24px; }
</style>
