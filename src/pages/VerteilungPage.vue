<script setup>
import ChapterHeader from '@/components/sections/ChapterHeader.vue';
import DistributionSection from '@/components/sections/DistributionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
</script>

<template>
  <ChapterHeader
    id="thema-verteilung"
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
