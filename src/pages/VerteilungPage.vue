<script setup>
import ChapterHeader from '@/components/sections/ChapterHeader.vue';
import DistributionSection from '@/components/sections/DistributionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

// Beim Scrollen den Anker des sichtbaren Abschnitts in die URL schreiben.
useScrollSpy(['verteilung', 'international', 'ubs-studie', 'pauschal'], { syncHash: true });
</script>

<template>
  <ChapterHeader
    id="thema-verteilung"
    tone="gold"
    :num="$t('chapters.verteilungNum')"
    :kicker="$t('chapters.verteilungKicker')"
    :title="$t('chapters.verteilungTitle')"
    :lead="$t('chapters.verteilungLead')"
  />
  <DistributionSection />
  <InternationalSection />
  <UbsStudySection />
  <PauschalSection />
</template>
