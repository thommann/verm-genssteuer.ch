<script setup>
import ReichsteSection from '@/components/sections/ownership/ReichsteSection.vue';
import FirmenSection from '@/components/sections/ownership/FirmenSection.vue';
import BodenSection from '@/components/sections/ownership/BodenSection.vue';
import RegisterSection from '@/components/sections/ownership/RegisterSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['reichste', 'firmen', 'boden', 'bodeneigentum'], { syncHash: true });
</script>

<template>
  <ReichsteSection />
  <FirmenSection />
  <BodenSection />
  <RegisterSection />
</template>
