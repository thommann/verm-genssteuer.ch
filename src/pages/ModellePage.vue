<script setup>
import ChapterHeader from '@/components/sections/ChapterHeader.vue';
import WirSection from '@/components/sections/WirSection.vue';
import ZucmanSection from '@/components/sections/ZucmanSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['wir-reports', 'zucman'], { syncHash: true });
</script>

<template>
  <ChapterHeader
    id="thema-modelle"
    tone="violet"
    :num="$t('chapters.modelleNum')"
    :kicker="$t('chapters.modelleKicker')"
    :title="$t('chapters.modelleTitle')"
    :lead="$t('chapters.modelleLead')"
  />
  <WirSection />
  <ZucmanSection />
</template>
