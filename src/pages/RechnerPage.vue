<script setup>
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import WegzugSection from '@/components/sections/WegzugSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['rechner', 'wegzug', 'dynamik', 'verwendung'], { syncHash: true });
</script>

<template>
  <!-- Zusammenhängende Rechner-Einheit: Modell wählen, Rendite einstellen, Wirkung sehen.
       Alle Abschnitte teilen denselben reaktiven Datensatz (useCalculator) und werden
       durch Rahmen und Akzentlinie als ein Block markiert. -->
  <div id="thema-rechner" class="calc-suite">
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
/* Innenabstände der gebündelten Abschnitte, damit sie als Einheit lesen. */
.calc-suite > section { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(40px, 5vw, 72px); }
</style>
