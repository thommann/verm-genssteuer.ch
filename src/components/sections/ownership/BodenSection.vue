<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ownership from '@/data/ownership.json';
import { num, pct, pct0 } from '@/lib/format.js';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';
import SourceTag from '@/components/ui/SourceTag.vue';

const { t } = useI18n();
const gebaeude = ownership.gebaeude;
const mietwohnungen = ownership.mietwohnungen;
const wohnBfs = ownership.wohnungen_bfs;
const wohneigentum = ownership.wohneigentum;
const wald = ownership.wald;
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

const waldItems = computed(() => [
  { label: t('ownership.waldOeffentlich'), value: wald.oeffentlich_share, color: 'var(--accent)' },
  { label: t('ownership.waldPrivat'), value: wald.privat_share, color: 'var(--gold)' },
]);

// Öffentlicher Anteil an der Waldfläche über die Jahrzehnte (1975–2024).
const waldTrend = computed(() => [
  { name: t('ownership.waldOeffentlich'), color: 'var(--accent)',
    points: wald.serie.map((p) => ({ x: p.jahr, y: p.oeffentlich_share })) },
]);
const waldYears = computed(() => wald.serie.map((p) => p.jahr));
</script>

<template>
  <section id="boden">
    <div class="wrap">
      <div class="eyebrow">{{ $t('ownership.bodenEyebrow') }}</div>
      <h2>{{ $t('ownership.bodenHeading') }}</h2>
      <p
        class="lead"
        v-html="$t('ownership.bodenIntro', {
          natuerliche: pct(gebaeude.natuerliche_share, 0),
          oeffentlich: pct(wald.oeffentlich_share, 0),
        })"
      />
      <p class="muted small note" v-html="$t('ownership.registerNote')" />
      <span class="srcrow"><SourceTag id="wav_zuerich" :note="$t('ownership.registerSource')" /></span>

      <div class="card chartbox">
        <h3>{{ $t('ownership.gebChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.gebChartIntro')" />
        <BarChart :items="gebaeudeItems" :max="1" :format-value="(v) => pct(v, 1)" accent="var(--gold)" />
        <SourceTag id="bfs_gebaeude" :note="$t('ownership.gebChartSource', { jahr: gebaeude.jahr })" />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.mietChartTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.mietChartIntro', { institutionell: pct(mietwohnungen.institutionell, 0) })" />
        <BarChart :items="mietItems" :max="1" :format-value="pct0" accent="var(--gold)" />
        <SourceTag id="raiffeisen_immo" :note="$t('ownership.mietChartSource', { jahr: mietwohnungen.jahr })" />
      </div>
      <div class="card chartbox">
        <h3>{{ $t('ownership.baujahrTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.baujahrIntro', { privat: pct(wohnBfs.privat, 0) })" />
        <BarChart :items="baujahrItems" :max="1" :format-value="pct0" accent="var(--gold)" />
        <SourceTag id="bfs_wohnungen" :note="$t('ownership.baujahrSource', { jahr: wohnBfs.jahr })" />
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
        <SourceTag id="bfs_wohneigentum" :note="$t('ownership.wohneigentumSource')" />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.waldChartTitle') }}</h3>
        <p
          class="muted intro"
          v-html="$t('ownership.waldChartIntro', {
            flaeche: num(wald.total_ha, 0),
            landanteil: pct(boden.nutzung.wald, 0),
            eigentuemer: num(wald.eigentuemer_total, 0),
            schnitt: num(wald.privat_ha_avg, 1),
          })"
        />
        <BarChart :items="waldItems" :max="1" :format-value="(v) => pct(v, 1)" accent="var(--gold)" />
        <span class="srcrow">
          <SourceTag id="bfs_wald" :note="$t('ownership.waldChartSource', { jahr: wald.jahr })" />
          <SourceTag id="bfs_areal" :note="$t('ownership.arealSource')" />
        </span>
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.waldTrendTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.waldTrendIntro')" />
        <LineChart
          :aria-label="$t('ownership.waldTrendTitle')"
          :series="waldTrend"
          :x-domain="[waldYears[0], waldYears[waldYears.length - 1]]"
          :x-ticks="[1975, 1985, 1995, 2005, 2015, 2024]"
          :y-domain="[0.7, 0.74]"
          :y-ticks="[0.7, 0.72, 0.74]"
          :format-x="(v) => String(v)"
          :format-y="pct0"
          :x-label="$t('ownership.axisYear')"
          :y-label="$t('ownership.waldTrendYAxis')"
          :height="300"
        />
        <SourceTag id="bfs_wald" :note="$t('ownership.waldTrendSource')" />
      </div>

      <div class="card chartbox">
        <h3>{{ $t('ownership.pachtTitle') }}</h3>
        <p class="muted intro" v-html="$t('ownership.pachtIntro')" />
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
        <SourceTag id="bfs_pacht" :note="$t('ownership.pachtSource')" />
      </div>

      <h3 class="block-h">{{ $t('ownership.groessteHeading') }}</h3>
      <p class="muted small intro2">{{ $t('ownership.groessteIntro') }}</p>
      <div class="grid sgrid">
        <div v-for="g in groesste" :key="g.id" class="scard card">
          <span class="sv accent">{{ num(g.menge, 1) }}<span class="unit"> {{ g.einheit }}</span></span>
          <span class="sl">{{ $t('ownership.groesste_' + g.id) }}</span>
          <SourceTag :id="g.quelle" />
        </div>
      </div>

      <h3 class="block-h">{{ $t('ownership.auslandHeading') }}</h3>
      <p class="muted small intro2" v-html="$t('ownership.auslandIntro')" />
      <div class="grid sgrid">
        <div class="scard card">
          <span class="sv accent">{{ num(boden.lex_koller.bewilligungen, 0) }}</span>
          <span class="sl" v-html="$t('ownership.auslandBewilligungenLabel', {
            jahr: boden.lex_koller.jahr,
            kontingent: num(boden.lex_koller.kontingent, 0),
            ausschoepfung: pct(boden.lex_koller.ausschoepfung, 0),
          })" />
        </div>
        <div class="scard card">
          <span class="sv gold">{{ pct(boden.lex_koller.zweitwohnsitze_ch_min, 0) }}+</span>
          <span class="sl">{{ $t('ownership.auslandZweitLabel') }}</span>
        </div>
        <div class="scard card">
          <span class="sv">{{ pct(boden.blackrock.anteil, 0) }}</span>
          <span class="sl" v-html="$t('ownership.auslandBlackrockLabel', {
            wert: num(boden.blackrock.wert_mrd, 0),
            firmen: num(boden.blackrock.firmen, 0),
          })" />
        </div>
      </div>
      <p class="muted small note" v-html="$t('ownership.auslandAusnahmen')" />
      <p
        class="muted small note"
        v-html="$t('ownership.auslandNote', {
          faktor: num(boden.blackrock.faktor_10j, 0),
          sps: pct(boden.blackrock.sps_anteil, 0),
        })"
      />
      <p class="muted small note" v-html="$t('ownership.auslandReform')" />
      <span class="srcrow">
        <SourceTag id="lex_koller" :note="$t('ownership.lexKollerSource', { jahr: boden.lex_koller.jahr })" />
        <SourceTag id="lex_koller_ausnahmen" :note="$t('ownership.ausnahmenSource')" />
        <SourceTag id="blackrock_immo" :note="$t('ownership.blackrockSource')" />
        <SourceTag id="lex_koller_reform" :note="$t('ownership.reformSource')" />
      </span>
    </div>
  </section>
</template>

<style scoped>
.chartbox { padding: 24px 26px; }
.chartbox h3 { margin-bottom: 8px; }
.intro { font-size: 0.92rem; max-width: 70ch; margin-bottom: 20px; }
.small { font-size: 0.85rem; max-width: 75ch; }
.note { margin-top: 16px; color: var(--text-mute); }
.block-h { margin-top: 40px; }
.intro2 { margin-top: 8px; margin-bottom: 18px; }
.sgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin: 8px 0 14px; }
.scard { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.sv { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
.sv.accent { color: var(--accent); }
.sv.gold { color: var(--gold); }
.sl { color: var(--text-soft); font-size: 0.88rem; }
.sv .unit { font-size: 1rem; font-weight: 700; color: var(--text-soft); }
.srcrow { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; }
</style>
