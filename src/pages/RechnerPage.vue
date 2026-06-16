<script setup>
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import ModellSection from '@/components/sections/ModellSection.vue';
import WegzugSection from '@/components/sections/WegzugSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';
import { useCalculator, PRESETS } from '@/composables/useCalculator.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['rechner', 'wegzug', 'dynamik', 'verwendung'], { syncHash: true });

// Voreinstellung verlinkbar machen: ?preset=<key> in der URL spiegelt die aktive Pille.
// Der Hash ist vom Scrollspy belegt, daher liegt die Voreinstellung im Query-Teil.
const route = useRoute();
const calc = useCalculator();

// Aktive Voreinstellung in die URL schreiben (eigenes Modell = kein Parameter). Wie der
// Scrollspy per replaceState, also ohne Verlaufseintrag, ohne Scroll-Sprung und unter
// Beibehaltung des Hashes.
const writePresetToUrl = (key) => {
  const url = new URL(window.location.href);
  if (key) url.searchParams.set('preset', key);
  else url.searchParams.delete('preset');
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
};

onMounted(() => {
  const key = route.query.preset;
  // Gültige Voreinstellung aus der URL übernehmen, sonst den aktuellen Zustand in die URL
  // spiegeln, damit die Adresse die gezeigte Voreinstellung immer abbildet.
  if (typeof key === 'string' && PRESETS[key]) calc.applyPreset(key);
  else writePresetToUrl(calc.state.activePreset);
});

watch(() => calc.state.activePreset, writePresetToUrl);
</script>

<template>
  <!-- Zusammenhängende Rechner-Einheit: Modell wählen, Rendite einstellen, Wirkung sehen.
       Alle Abschnitte teilen denselben reaktiven Datensatz (useCalculator) und werden
       durch Rahmen und Akzentlinie als ein Block markiert. -->
  <div id="thema-rechner" class="calc-suite">
    <!-- Hero: Steuermodell (Presets), langfristige Mehreinnahmen und die
         Verwendungs-Übersicht. Darunter in gewohnter Reihenfolge: Modell selbst
         einstellen, Wegzug, langfristige Entwicklung und die ausführliche Verwendung. -->
    <CalculatorSection />
    <ModellSection />
    <div class="calc-duo">
      <WegzugSection />
      <ProjectionSection />
    </div>
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
/* Innenabstände der gebündelten Abschnitte, damit sie als Einheit lesen. */
.calc-suite > section { padding-top: clamp(28px, 3.4vw, 48px); padding-bottom: clamp(28px, 3.4vw, 48px); }
/* Hero (Presets, Ertrag, Verwendung) als ein Block: nur minimaler Abstand zwischen
   Rechner und Verwendung, damit die drei Kernelemente eng zusammen liegen. */
.calc-suite > #rechner { padding-bottom: clamp(12px, 1.4vw, 18px); }
.calc-suite > #verwendung { padding-top: clamp(12px, 1.4vw, 18px); }

/* Wegzug und Rendite auf Desktop nebeneinander, je eine Spalte. Der Block ist auf
   die gleiche Breite wie die übrigen Abschnitte begrenzt, damit die Kanten fluchten. */
.calc-duo {
  width: 100%; max-width: var(--maxw); margin: 0 auto;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}
.calc-duo > section { padding-top: clamp(28px, 3.4vw, 48px); padding-bottom: clamp(28px, 3.4vw, 48px); }
@media (max-width: 820px) {
  .calc-duo { grid-template-columns: 1fr; }
}
</style>
