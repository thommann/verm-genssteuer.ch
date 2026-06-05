<script setup>
import ChapterHeader from '@/components/sections/ChapterHeader.vue';
import WirSection from '@/components/sections/WirSection.vue';
import ZucmanSection from '@/components/sections/ZucmanSection.vue';
</script>

<template>
  <ChapterHeader
    id="thema-modelle"
    :num="$t('chapters.modelleNum')"
    :kicker="$t('chapters.modelleKicker')"
    :title="$t('chapters.modelleTitle')"
    :lead="$t('chapters.modelleLead')"
  />
  <WirSection />
  <ZucmanSection />
</template>
