<script setup>
// Kapitel-Einstieg zwischen den Themen: als volles Aussage-Band im Look der Kernaussagen,
// je Thema mit eigenem Signatur-Verlauf (tone). Nummeriertes Chip, Eyebrow, fette Aussage
// und kurzer Lead. Die id dient als Anker, auf den der Themen-Hub und das Menü springen.
defineProps({
  id: { type: String, required: true },
  num: { type: String, required: true },
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  lead: { type: String, required: true },
  // gold | accent | violet; gold läuft als helle Variante mit dunkler Schrift.
  tone: { type: String, default: 'accent' },
});
</script>

<template>
  <header
    :id="id"
    class="claim-band chapter-band"
    :class="[`tone-${tone}`, { dark: tone === 'gold' }]"
  >
    <div class="wrap">
      <div class="chapter-head-top">
        <span class="chapter-num">{{ num }}</span>
        <span class="eyebrow chapter-kicker">{{ kicker }}</span>
      </div>
      <h2 class="band-text" v-html="title" />
      <p class="chapter-band-lead" v-html="lead" />
    </div>
  </header>
</template>
