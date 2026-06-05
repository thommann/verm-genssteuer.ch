<script setup>
// Kapitel-Einstieg zwischen den Themen: nummerierter Kopf mit Titel und kurzem Lead.
// Die id dient als Anker, auf den der Themen-Hub und das Menü springen.
defineProps({
  id: { type: String, required: true },
  num: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  lead: { type: String, required: true },
});
</script>

<template>
  <div :id="id" class="chapter-head">
    <div class="wrap">
      <div class="chapter-head-top">
        <span class="chapter-num">{{ num }}</span>
        <span class="chapter-kicker">{{ kicker }}</span>
      </div>
      <h2 class="chapter-title" v-html="title" />
      <p class="chapter-lead lead" v-html="lead" />
    </div>
  </div>
</template>
