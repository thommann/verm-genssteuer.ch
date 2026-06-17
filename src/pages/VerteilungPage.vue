<script setup>
import DistributionSection from '@/components/sections/DistributionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import ArtikelSection from '@/components/sections/ArtikelSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['verteilung', 'international', 'ubs-studie', 'pauschal', 'bodeneigentum'], { syncHash: true });
</script>

<template>
  <DistributionSection />
  <InternationalSection />
  <UbsStudySection />
  <PauschalSection />
  <ArtikelSection
    ns="boden"
    id="eigentum"
    anchor="bodeneigentum"
    :bg="['#0f9d7a', '#14c98a', '#4f8bff', '#0f9d7a']"
  />
</template>
