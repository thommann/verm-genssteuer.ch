<script setup>
import WirSection from '@/components/sections/WirSection.vue';
import ZucmanSection from '@/components/sections/ZucmanSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['wir-reports', 'zucman'], { syncHash: true });
</script>

<template>
  <WirSection />
  <ZucmanSection />
</template>
