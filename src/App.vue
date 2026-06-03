<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import DistributionSection from '@/components/sections/DistributionSection.vue';
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import SourcesSection from '@/components/sections/SourcesSection.vue';

const NAV = [
  { id: 'verteilung', label: 'Verteilung' },
  { id: 'rechner', label: 'Rechner' },
  { id: 'verwendung', label: 'Was tun?' },
  { id: 'dynamik', label: 'Dynamik' },
  { id: 'international', label: 'International' },
  { id: 'quellen', label: 'Quellen' },
];

const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 40);
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <nav class="nav" :class="{ solid: scrolled }">
    <div class="wrap nav-inner">
      <a href="#top" class="brand">
        <span class="brand-dot" /> Vermögen&nbsp;&amp;&nbsp;Steuern
      </a>
      <div class="nav-links">
        <a v-for="n in NAV" :key="n.id" :href="`#${n.id}`">{{ n.label }}</a>
      </div>
      <a href="#rechner" class="btn btn-primary nav-cta">Ausprobieren</a>
    </div>
  </nav>

  <main id="top">
    <HeroSection />
    <DistributionSection />
    <CalculatorSection />
    <SpendSection />
    <ProjectionSection />
    <InternationalSection />
    <PauschalSection />
    <SourcesSection />
  </main>
</template>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 50;
  transition: background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease;
  border-bottom: 1px solid transparent;
}
.nav.solid {
  background: rgba(11, 16, 32, 0.82);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 16px; }
.brand { display: flex; align-items: center; gap: 9px; font-weight: 800; color: var(--text); text-decoration: none; font-size: 0.98rem; }
.brand:hover { text-decoration: none; }
.brand-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px rgba(255, 84, 112, 0.18); }
.nav-links { display: flex; gap: 22px; }
.nav-links a { color: var(--text-soft); font-size: 0.88rem; font-weight: 600; text-decoration: none; }
.nav-links a:hover { color: var(--text); }
.nav-cta { padding: 8px 16px; font-size: 0.85rem; }
@media (max-width: 860px) {
  .nav-links { display: none; }
}
@media (max-width: 460px) {
  .nav-cta { display: none; }
}
</style>
