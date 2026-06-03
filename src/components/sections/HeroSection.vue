<script setup>
import kennzahlen from '@/data/estv_kennzahlen.json';
import { chf, pct, num } from '@/lib/format.js';
import SourceTag from '@/components/ui/SourceTag.vue';

const k = kennzahlen.unbeschraenkt['2022'];
</script>

<template>
  <header id="start" class="hero">
    <div class="wrap">
      <div class="eyebrow">Vermögen · Schweiz · 2022</div>
      <h1>
        Das reichste <span class="hl">1&nbsp;%</span> besitzt
        <span class="hl gold">{{ pct(k.share_ge5M, 0) }}</span>
        des steuerbaren Vermögens.
      </h1>
      <p class="lead">
        Knapp <strong>{{ num(k.cnt_ge5M) }}</strong> Steuerpflichtige – rund ein Prozent –
        halten zusammen fast so viel Vermögen wie die anderen 99&nbsp;% zusammen.
        Das mittlere (Median-)Vermögen liegt bei nur <strong>{{ chf(k.median) }}</strong>.
        Diese Seite macht die Zahlen sichtbar – und lässt dich ausprobieren, was eine
        faire Vermögenssteuer auf dieses eine Prozent bewirken könnte.
      </p>

      <div class="hero-stats">
        <div class="hstat">
          <div class="hstat-val gold">{{ pct(k.share_ge5M, 0) }}</div>
          <div class="hstat-lab">des Vermögens beim reichsten&nbsp;1&nbsp;%<br />(Vermögen ab 5&nbsp;Mio.)</div>
        </div>
        <div class="divider" />
        <div class="hstat">
          <div class="hstat-val">{{ chf(k.median) }}</div>
          <div class="hstat-lab">Median-Vermögen –<br />die «mittlere» Schweiz</div>
        </div>
        <div class="divider" />
        <div class="hstat">
          <div class="hstat-val accent">{{ Math.round(k.mean / k.median) }}×</div>
          <div class="hstat-lab">so hoch ist der Durchschnitt<br />wegen der Spitze</div>
        </div>
      </div>

      <div class="hero-cta">
        <a href="#rechner" class="btn btn-primary">Steuermodell ausprobieren ↓</a>
        <a href="#verteilung" class="btn">Erst die Verteilung ansehen</a>
      </div>
      <div style="margin-top: 18px">
        <SourceTag id="estv_vermoegen" note="unbeschränkt Steuerpflichtige, 2022" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero { padding: clamp(70px, 13vw, 150px) 0 clamp(50px, 8vw, 90px); }
.hl { color: var(--accent); }
.hl.gold { color: var(--gold); }
h1 { max-width: 18ch; }
.hero-stats {
  display: flex; align-items: center; gap: clamp(16px, 4vw, 44px);
  margin: 40px 0 32px; flex-wrap: wrap;
}
.hstat-val { font-size: clamp(1.8rem, 4.5vw, 2.8rem); font-weight: 800; letter-spacing: -0.02em; }
.hstat-val.gold { color: var(--gold); }
.hstat-val.accent { color: var(--accent); }
.hstat-lab { color: var(--text-soft); font-size: 0.9rem; margin-top: 2px; }
.divider { width: 1px; height: 52px; background: var(--border); }
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 560px) { .divider { display: none; } }
</style>
