<script setup>
// Hintergrund-Seite: acht erklaerende Artikel zur wachsenden Ungleichheit, gestuetzt auf
// die Arbeiten von Gabriel Zucman (G20-Mindeststeuer, effektive Steuersaetze) und Gary
// Stevenson (Gary's Economics: Vermoegenspreise, Nachfrage, Mieten) sowie auf die Forschung
// zu Ungleichheit und Kriminalitaet. Jeder Artikel ist ein vollflaechiges Farbband wie die
// Aussagen der Startseite (Verlauf je Artikel ueber bg). Eigene Anker-id je Artikel; Text
// und Belege in i18n unter hintergrund.<id>.
import ArtikelSection from '@/components/sections/ArtikelSection.vue';
import { useScrollSpy } from '@/composables/useScrollSpy.js';

const ARTS = [
  { id: 'aufkauf', bg: ['#ff7a33', '#d6249f', '#ff2d6b', '#d6249f'] },
  { id: 'geldfluss', bg: ['#d6249f', '#7c3aed', '#ff2d6b', '#7c3aed'] },
  { id: 'demokratie', bg: ['#7c3aed', '#4f8bff', '#a78bfa', '#3b6fe0'] },
  { id: 'kriminalitaet', bg: ['#ff2d6b', '#7c3aed', '#c01651', '#3b6fe0'] },
  { id: 'steuerluecke', bg: ['#ff2d6b', '#ff7a33', '#d6249f', '#ff7a33'] },
  { id: 'wirtschaft', bg: ['#14c98a', '#25e3c8', '#4f8bff', '#14c98a'] },
  { id: 'loesung', bg: ['#4f8bff', '#7c3aed', '#3b6fe0', '#7c3aed'] },
  { id: 'mehr', bg: ['#ff2d6b', '#7c3aed', '#d6249f', '#4f8bff'] },
];

useScrollSpy(ARTS.map((a) => a.id), { syncHash: true });
</script>

<template>
  <ArtikelSection
    v-for="a in ARTS"
    :id="a.id"
    :key="a.id"
    :anchor="a.id"
    :bg="a.bg"
  />
</template>
