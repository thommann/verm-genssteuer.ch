<script setup>
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import WegzugSection from '@/components/sections/WegzugSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Stepper-Hervorhebung: markiert den gerade sichtbaren Schritt (Modell, Wegzug, Rendite, Verwendung).
const { activeId } = useScrollSpy(['rechner', 'wegzug', 'dynamik', 'verwendung']);
</script>

<template>
  <!-- Zusammenhängende Rechner-Einheit: Modell wählen, Rendite einstellen, Wirkung sehen.
       Alle drei Abschnitte teilen denselben reaktiven Datensatz (useCalculator) und werden
       durch Rahmen, Akzentlinie und Schritt-Navigation als ein Block markiert. -->
  <div id="thema-rechner" class="calc-suite">
    <header class="claim-band chapter-band tone-accent">
      <div class="wrap calc-suite-head">
        <div class="chapter-head-top">
          <span class="chapter-num">{{ $t('chapters.rechnerNum') }}</span>
          <span class="eyebrow chapter-kicker">{{ $t('chapters.rechnerKicker') }}</span>
        </div>
        <h2 class="band-text" v-html="$t('chapters.rechnerTitle')" />
        <p class="chapter-band-lead" v-html="$t('chapters.rechnerLead')" />
        <ol class="cs-steps">
          <li>
            <a href="#rechner" :class="{ active: activeId === 'rechner' }">
              <span class="cs-num">1</span>{{ $t('calcSuite.step1') }}
            </a>
          </li>
          <li>
            <a href="#wegzug" :class="{ active: activeId === 'wegzug' }">
              <span class="cs-num">2</span>{{ $t('calcSuite.step2') }}
            </a>
          </li>
          <li>
            <a href="#dynamik" :class="{ active: activeId === 'dynamik' }">
              <span class="cs-num">3</span>{{ $t('calcSuite.step3') }}
            </a>
          </li>
          <li>
            <a href="#verwendung" :class="{ active: activeId === 'verwendung' }">
              <span class="cs-num">4</span>{{ $t('calcSuite.step4') }}
            </a>
          </li>
        </ol>
      </div>
    </header>
    <CalculatorSection />
    <WegzugSection />
    <ProjectionSection />
    <SpendSection />
  </div>
</template>

<style scoped>
/* Rechner-Einheit: full-bleed Band, das die drei zusammengehörenden Abschnitte
   (Rechner, Rendite, Verwendung) optisch zu einem Block zusammenfasst. */
.calc-suite {
  position: relative;
  background:
    radial-gradient(1100px 500px at 50% -8%, rgba(255, 84, 112, 0.07), transparent 60%),
    linear-gradient(180deg, rgba(124, 92, 255, 0.05), rgba(56, 214, 196, 0.035));
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
/* Akzentlinie am oberen Rand markiert den Anfang der Einheit. */
.calc-suite::before {
  content: '';
  position: absolute; top: -1px; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet), var(--teal));
}
/* Innenabstände der gebündelten Abschnitte verringern, damit sie als Einheit lesen. */
.calc-suite > section { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(40px, 5vw, 72px); }
.calc-suite > section:first-of-type { padding-top: clamp(20px, 3vw, 36px); }

.cs-steps {
  list-style: none; margin: 24px 0 0; padding: 0;
  display: flex; flex-wrap: wrap; gap: 10px;
}
/* Stepper im hellen Kapitel-Band: helle Pillen mit dunklem Schleier, wie die Band-Links. */
.chapter-band .cs-steps a {
  color: #fff; background: rgba(11, 16, 32, 0.24); border-color: rgba(255, 255, 255, 0.45);
}
.chapter-band .cs-steps a:hover,
.chapter-band .cs-steps a.active { color: #fff; background: rgba(11, 16, 32, 0.4); border-color: #fff; }
.chapter-band .cs-num { background: rgba(255, 255, 255, 0.92); color: var(--ink); }
.chapter-band .cs-steps li:not(:last-child)::after { color: rgba(255, 255, 255, 0.72); }
.cs-steps a {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 8px 15px 8px 8px; border-radius: 999px;
  font-size: 0.88rem; font-weight: 700; color: var(--text-soft);
  background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border);
  text-decoration: none; transition: color 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}
.cs-steps a:hover { color: var(--text); border-color: var(--accent); }
.cs-steps a.active { color: var(--text); border-color: var(--accent); background: rgba(255, 84, 112, 0.1); }
.cs-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 999px;
  font-size: 0.8rem; font-variant-numeric: tabular-nums;
  background: var(--accent); color: #1a0008;
}
/* Verbindende Pfeile zwischen den Schritten. */
.cs-steps li:not(:last-child)::after {
  content: '→'; color: var(--text-mute); font-weight: 700; margin-left: 10px;
  align-self: center;
}
.cs-steps li { display: inline-flex; align-items: center; }
/* Auf schmalen Schirmen brechen die Schritte um; dann die baumelnden Pfeile
   ausblenden und die Pillen auf volle Breite stellen. */
@media (max-width: 480px) {
  .cs-steps { flex-direction: column; align-items: stretch; }
  .cs-steps li:not(:last-child)::after { content: none; }
  .cs-steps a { justify-content: flex-start; }
}
</style>
