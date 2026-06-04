<script setup>
// Statischer Vorstellungs-/Vergleichsabschnitt zu den beiden World Inequality Reports.
// WIR 2022 (progressive Staffel) speist das gleichnamige Rechner-Preset; WIR 2026
// (Mindeststeuer) wird im Abschnitt «Zucman-Steuer» behandelt. Reine Inhalts-/Link-Sektion.
import SourceTag from '@/components/ui/SourceTag.vue';

const VIDEO_URL = 'https://www.youtube.com/watch?v=4jRnYfigc3I';
</script>

<template>
  <section id="wir-reports">
    <div class="wrap">
      <div class="eyebrow">{{ $t('wir.eyebrow') }}</div>
      <h2 v-html="$t('wir.title')" />
      <p class="lead" v-html="$t('wir.lead')" />

      <div class="grid cmp">
        <div class="card wir">
          <div class="wir-head">
            <span class="badge gold">{{ $t('wir.card2022Badge') }}</span>
            <h3>{{ $t('wir.card2022Title') }}</h3>
          </div>
          <p class="wir-sub" v-html="$t('wir.card2022Sub')" />
          <ul>
            <li v-html="$t('wir.card2022Li1')" />
            <li v-html="$t('wir.card2022Li2')" />
            <li v-html="$t('wir.card2022Li3')" />
          </ul>
          <a class="btn btn-ghost" :href="'https://wir2022.wid.world'" target="_blank" rel="noopener">
            {{ $t('wir.card2022Link') }}
          </a>
        </div>

        <div class="card wir">
          <div class="wir-head">
            <span class="badge teal">{{ $t('wir.card2026Badge') }}</span>
            <h3>{{ $t('wir.card2026Title') }}</h3>
          </div>
          <p class="wir-sub" v-html="$t('wir.card2026Sub')" />
          <ul>
            <li v-html="$t('wir.card2026Li1')" />
            <li v-html="$t('wir.card2026Li2')" />
            <li v-html="$t('wir.card2026Li3')" />
          </ul>
          <a class="btn btn-ghost" :href="'https://wir2026.wid.world'" target="_blank" rel="noopener">
            {{ $t('wir.card2026Link') }}
          </a>
        </div>
      </div>

      <p class="shift" v-html="$t('wir.shift')" />

      <a class="videocard card" :href="VIDEO_URL" target="_blank" rel="noopener">
        <span class="play" aria-hidden="true">▶</span>
        <span class="vtext">
          <span class="vlabel">{{ $t('wir.videoLabel') }}</span>
          <span class="vtitle">{{ $t('wir.videoTitle') }}</span>
          <span class="vhint">{{ $t('wir.videoHint') }}</span>
        </span>
      </a>

      <div class="srcs">
        <SourceTag id="wir2022" :note="$t('wir.sourceNote2022')" />
        <SourceTag id="wir2026" :note="$t('wir.sourceNote2026')" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cmp { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin: 28px 0 24px; }
.wir { padding: 24px 26px; display: flex; flex-direction: column; gap: 10px; }
.wir-head { display: flex; align-items: center; gap: 12px; }
.wir-head h3 { margin: 0; }
.badge {
  font-size: 0.82rem; font-weight: 800; padding: 3px 10px; border-radius: 999px;
  color: #1a1400; letter-spacing: 0.02em;
}
.badge.gold { background: var(--gold); }
.badge.teal { background: var(--teal); }
.wir-sub { color: var(--text-soft); font-size: 0.9rem; margin: 0; font-weight: 600; }
.wir ul { margin: 6px 0 4px; padding-left: 18px; color: var(--text-soft); font-size: 0.92rem; }
.wir li { margin-bottom: 8px; }
.wir :deep(strong) { color: var(--text); }
.btn-ghost {
  align-self: flex-start; margin-top: auto; padding: 8px 14px; font-size: 0.85rem;
  border: 1px solid var(--border); background: rgba(255, 255, 255, 0.05); color: var(--text);
  border-radius: 10px; transition: border-color 0.15s ease;
}
.btn-ghost:hover { border-color: var(--accent); text-decoration: none; }

.shift {
  font-size: 0.95rem; line-height: 1.6; color: var(--text-soft);
  padding: 16px 18px; border-radius: 12px;
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid var(--border); border-left: 3px solid var(--violet);
}
.shift :deep(strong) { color: var(--text); }

.videocard {
  display: flex; align-items: center; gap: 18px; padding: 18px 22px; margin-top: 22px;
  text-decoration: none; color: inherit; transition: border-color 0.15s ease, transform 0.15s ease;
}
.videocard:hover { border-color: var(--accent); transform: translateY(-2px); text-decoration: none; }
.play {
  flex: none; width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center; font-size: 1.1rem; color: #1a0008;
  background: var(--accent); padding-left: 3px;
}
.vtext { display: flex; flex-direction: column; gap: 3px; }
.vlabel { color: var(--accent-soft); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.02em; }
.vtitle { color: var(--text); font-weight: 700; font-size: 1rem; }
.vhint { color: var(--text-mute); font-size: 0.78rem; }

.srcs { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 18px; }
</style>
