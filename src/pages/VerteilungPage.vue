<script setup>
import DistributionSection from '@/components/sections/DistributionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['verteilung', 'international', 'ubs-studie', 'pauschal'], { syncHash: true });
</script>

<template>
  <DistributionSection />
  <InternationalSection />
  <UbsStudySection />
  <PauschalSection />
</template>
