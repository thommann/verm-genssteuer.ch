<script setup>
// Inhalts-/Analyse-Abschnitt zu Gabriel Zucmans Mindeststeuer (2 % auf Vermögen
// ab 100 Mio.) und ihrer Wirkung in der Schweiz. Marktnahe Bilanz-Basis 2025,
// eigene Effektivlast-Schätzung und die Trennung Brutto-2-% vs. Mindeststeuer.
// Reine Inhalts-/Link-Sektion mit zwei weiterführenden Videos.
import SourceTag from '@/components/ui/SourceTag.vue';

const VIDEO_POLANSKI = 'https://www.youtube.com/watch?v=1cG4ULI1yCo';
const VIDEO_GARY = 'https://www.youtube.com/watch?v=4jRnYfigc3I';
</script>

<template>
  <section id="zucman">
    <div class="wrap">
      <div class="eyebrow">{{ $t('zucman.eyebrow') }}</div>
      <h2 v-html="$t('zucman.title')" />
      <p class="lead" v-html="$t('zucman.lead')" />

      <div class="grid sgrid">
        <div class="scard card">
          <span class="sv gold">851,5&nbsp;Mrd.</span>
          <span class="sl" v-html="$t('zucman.statTotal')" />
        </div>
        <div class="scard card">
          <span class="sv">~300</span>
          <span class="sl" v-html="$t('zucman.statCount')" />
        </div>
        <div class="scard card">
          <span class="sv gold">156</span>
          <span class="sl" v-html="$t('zucman.statBill')" />
        </div>
        <div class="scard card">
          <span class="sv accent">100&nbsp;Mio.</span>
          <span class="sl" v-html="$t('zucman.statThreshold')" />
        </div>
      </div>
      <SourceTag id="bilanz300" :note="$t('zucman.statSource')" />

      <h3 class="block-h">{{ $t('zucman.basisHeading') }}</h3>
      <p class="body" v-html="$t('zucman.basisText')" />
      <div class="srcrow">
        <SourceTag id="estv_vermoegen" :note="$t('zucman.basisSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.burdenHeading') }}</h3>
      <p class="body" v-html="$t('zucman.burdenText')" />
      <div class="srcrow">
        <SourceTag id="reichensteuer_studie" :note="$t('zucman.burdenSource')" />
        <SourceTag id="nzz_vermoegenssteuer" :note="$t('zucman.rateSource')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.scenarioHeading') }}</h3>
      <p class="body" v-html="$t('zucman.scenarioIntro')" />
      <div class="srcrow">
        <SourceTag id="woz_zucman" :note="$t('zucman.designSource')" />
      </div>

      <div class="card tablebox">
        <table class="scenario">
          <thead>
            <tr>
              <th>{{ $t('zucman.thScenario') }}</th>
              <th>{{ $t('zucman.thCalc') }}</th>
              <th class="num">{{ $t('zucman.thRevenue') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span class="badge gold">A</span>
                <span class="rowname" v-html="$t('zucman.rowAName')" />
                <span class="rowsub">{{ $t('zucman.rowASub') }}</span>
              </td>
              <td class="calc">2&nbsp;% × 851,5&nbsp;Mrd.</td>
              <td class="num strongnum">17,0&nbsp;Mrd.</td>
            </tr>
            <tr class="highlight">
              <td>
                <span class="badge teal">B</span>
                <span class="rowname" v-html="$t('zucman.rowBName')" />
                <span class="rowsub">{{ $t('zucman.rowBSub') }}</span>
              </td>
              <td class="calc">(2&nbsp;% − ~1&nbsp;%) × 851,5&nbsp;Mrd.</td>
              <td class="num strongnum accent">~6–11&nbsp;Mrd.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="callout" v-html="$t('zucman.scenarioNote')" />
      <div class="srcrow">
        <SourceTag id="workzeitung_reiche" :note="$t('zucman.headlineSource')" />
      </div>

      <div class="derive card">
        <h3>{{ $t('zucman.deriveHeading') }}</h3>
        <p class="derive-intro" v-html="$t('zucman.deriveIntro')" />
        <div class="derive-cols">
          <div>
            <p class="derive-sub">{{ $t('zucman.deriveInputsTitle') }}</p>
            <ul>
              <li v-html="$t('zucman.deriveInput1')" />
              <li v-html="$t('zucman.deriveInput2')" />
              <li v-html="$t('zucman.deriveInput3')" />
            </ul>
          </div>
          <div>
            <p class="derive-sub">{{ $t('zucman.deriveStepsTitle') }}</p>
            <ol>
              <li v-html="$t('zucman.deriveStep1')" />
              <li v-html="$t('zucman.deriveStep2')" />
              <li v-html="$t('zucman.deriveStep3')" />
              <li v-html="$t('zucman.deriveStep4')" />
              <li v-html="$t('zucman.deriveStep5')" />
            </ol>
          </div>
        </div>
        <p class="derive-note" v-html="$t('zucman.deriveNote')" />
      </div>

      <h3 class="block-h">{{ $t('zucman.extraHeading') }}</h3>
      <p class="body" v-html="$t('zucman.extraText')" />

      <div class="core card">
        <h3>{{ $t('zucman.coreHeading') }}</h3>
        <p v-html="$t('zucman.coreText')" />
        <SourceTag id="woz_zucman" :note="$t('zucman.coreSource')" />
      </div>

      <div class="caveats card">
        <h3>{{ $t('zucman.caveatsTitle') }}</h3>
        <ul>
          <li v-html="$t('zucman.caveat1')" />
          <li v-html="$t('zucman.caveat2')" />
          <li v-html="$t('zucman.caveat3')" />
          <li v-html="$t('zucman.caveat4')" />
        </ul>
      </div>

      <h3 class="block-h">{{ $t('zucman.videosHeading') }}</h3>
      <div class="grid vgrid">
        <a class="videocard card" :href="VIDEO_POLANSKI" target="_blank" rel="noopener">
          <span class="play" aria-hidden="true">▶</span>
          <span class="vtext">
            <span class="vlabel">{{ $t('zucman.video1Label') }}</span>
            <span class="vtitle">{{ $t('zucman.video1Title') }}</span>
            <span class="vhint">youtube.com ↗</span>
          </span>
        </a>
        <a class="videocard card" :href="VIDEO_GARY" target="_blank" rel="noopener">
          <span class="play" aria-hidden="true">▶</span>
          <span class="vtext">
            <span class="vlabel">{{ $t('zucman.video2Label') }}</span>
            <span class="vtitle">{{ $t('zucman.video2Title') }}</span>
            <span class="vhint">youtube.com ↗</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sgrid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin: 24px 0 10px; }
.scard { padding: 22px; display: flex; flex-direction: column; gap: 6px; }
.sv { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.02em; }
.sv.accent { color: var(--accent); }
.sv.gold { color: var(--gold); }
.sl { color: var(--text-soft); font-size: 0.86rem; }
.sl :deep(strong) { color: var(--text); }

.srcrow { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 12px; }
.core :deep(.source-tag) { margin-top: 14px; }

.block-h { margin-top: 40px; }
.body { font-size: 0.96rem; line-height: 1.65; color: var(--text-soft); max-width: 74ch; }
.body :deep(strong) { color: var(--text); }
.body :deep(.hl) { color: var(--accent); font-weight: 700; }
.body :deep(.hl.gold) { color: var(--gold); }
.body :deep(a) { color: var(--accent-soft); }

.tablebox { padding: 8px 8px; margin: 20px 0 14px; overflow-x: auto; }
table.scenario { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
table.scenario th, table.scenario td { text-align: left; padding: 14px 16px; vertical-align: top; }
table.scenario thead th {
  font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-mute); font-weight: 700; border-bottom: 1px solid var(--border);
}
table.scenario tbody tr { border-bottom: 1px solid var(--border); }
table.scenario tbody tr:last-child { border-bottom: none; }
tr.highlight { background: rgba(56, 214, 196, 0.07); }
.rowname { font-weight: 700; color: var(--text); }
.rowname :deep(strong) { color: var(--text); }
.rowsub { display: block; color: var(--text-mute); font-size: 0.82rem; margin-top: 3px; }
.calc { color: var(--text-soft); font-variant-numeric: tabular-nums; white-space: nowrap; }
.num { text-align: right; }
.strongnum { font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--text); }
.strongnum.accent { color: var(--accent); }
.badge {
  display: inline-block; font-size: 0.74rem; font-weight: 800; padding: 1px 8px;
  border-radius: 999px; color: #1a1400; margin-right: 8px; vertical-align: middle;
}
.badge.gold { background: var(--gold); }
.badge.teal { background: var(--teal); }

.callout {
  font-size: 0.92rem; line-height: 1.6; color: var(--text-soft);
  padding: 16px 18px; border-radius: 12px; max-width: none;
  background: rgba(255, 206, 92, 0.08);
  border: 1px solid var(--border); border-left: 3px solid var(--gold);
}
.callout :deep(strong) { color: var(--text); }

.derive { padding: 24px 26px; margin: 20px 0 4px; border-left: 3px solid var(--violet); }
.derive h3 { margin-bottom: 8px; }
.derive-intro { font-size: 0.9rem; line-height: 1.6; color: var(--text-soft); max-width: 78ch; }
.derive-intro :deep(strong) { color: var(--text); }
.derive-intro :deep(a) { color: var(--accent-soft); }
.derive-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 8px 28px; margin-top: 6px; }
.derive-sub { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-mute); font-weight: 700; margin: 8px 0 4px; }
.derive ul, .derive ol { margin: 0; padding-left: 20px; color: var(--text-soft); }
.derive li { margin-bottom: 8px; font-size: 0.88rem; line-height: 1.55; }
.derive :deep(strong) { color: var(--text); }
.derive-note {
  font-size: 0.84rem; color: var(--text-mute); margin: 14px 0 0;
  padding-top: 12px; border-top: 1px solid var(--border);
}
.derive-note :deep(strong) { color: var(--text-soft); }

.core { padding: 26px; margin-top: 18px; border-left: 3px solid var(--accent); }
.core h3 { margin-bottom: 10px; }
.core p { font-size: 0.95rem; line-height: 1.65; color: var(--text-soft); margin: 0; }
.core :deep(strong) { color: var(--text); }

.caveats { padding: 26px; margin-top: 18px; }
.caveats ul { margin: 12px 0 0; padding-left: 20px; color: var(--text-soft); }
.caveats li { margin-bottom: 12px; font-size: 0.9rem; }
.caveats :deep(strong) { color: var(--text); }

.vgrid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.videocard {
  display: flex; align-items: center; gap: 18px; padding: 18px 22px;
  text-decoration: none; color: inherit; transition: border-color 0.15s ease, transform 0.15s ease;
}
.videocard:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
.play {
  flex: none; width: 44px; height: 44px; border-radius: 50%;
  display: grid; place-items: center; font-size: 1rem; color: #1a0008;
  background: var(--accent); padding-left: 3px;
}
.vtext { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.vlabel { color: var(--accent-soft); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.02em; }
.vtitle { color: var(--text); font-weight: 700; font-size: 0.95rem; line-height: 1.3; }
.vhint { color: var(--text-mute); font-size: 0.76rem; }
</style>
