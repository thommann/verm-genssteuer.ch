<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import DistributionSection from '@/components/sections/DistributionSection.vue';
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import WirSection from '@/components/sections/WirSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import SourcesSection from '@/components/sections/SourcesSection.vue';

// Vollständige Liste aller Abschnitte. Jede id entspricht einem Anker im DOM,
// der von überall (auch extern) per #id verlinkt werden kann.
const NAV = [
  { id: 'start', label: 'Start' },
  { id: 'verteilung', label: 'Verteilung' },
  { id: 'rechner', label: 'Rechner' },
  { id: 'verwendung', label: 'Was tun?' },
  { id: 'dynamik', label: 'Dynamik' },
  { id: 'international', label: 'International' },
  { id: 'wir-reports', label: 'WIR-Reports' },
  { id: 'ubs-studie', label: 'UBS-Studie' },
  { id: 'pauschal', label: 'Pauschalbesteuerung' },
  { id: 'quellen', label: 'Quellen' },
];

const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 40);

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);
const onKeydown = (e) => {
  if (e.key === 'Escape') closeMenu();
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <nav class="nav" :class="{ solid: scrolled || menuOpen }">
    <div class="wrap nav-inner">
      <a href="#start" class="brand" @click="closeMenu">
        <span class="brand-dot" /> vermögenssteuer.ch
      </a>

      <div class="nav-links">
        <a v-for="n in NAV" :key="n.id" :href="`#${n.id}`">{{ n.label }}</a>
      </div>

      <div class="nav-actions">
        <a href="#rechner" class="btn btn-primary nav-cta" @click="closeMenu">Ausprobieren</a>
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="section-menu"
          aria-label="Abschnitts-Menü"
          @click="toggleMenu"
        >
          <span class="menu-icon" :class="{ open: menuOpen }"><span></span><span></span><span></span></span>
          Menü
        </button>
      </div>
    </div>

    <!-- Vollständiges Abschnitts-Menü: listet alle Sektionen und springt zum Anker. -->
    <transition name="menu">
      <div v-if="menuOpen" id="section-menu" class="section-menu" @click.self="closeMenu">
        <div class="wrap">
          <p class="menu-title">Abschnitte</p>
          <ul class="menu-list">
            <li v-for="(n, i) in NAV" :key="n.id">
              <a :href="`#${n.id}`" @click="closeMenu">
                <span class="menu-num">{{ String(i + 1).padStart(2, '0') }}</span>
                {{ n.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </nav>

  <main id="top">
    <HeroSection />
    <DistributionSection />
    <CalculatorSection />
    <SpendSection />
    <ProjectionSection />
    <InternationalSection />
    <WirSection />
    <UbsStudySection />
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
.nav-actions { display: flex; align-items: center; gap: 12px; }
.nav-cta { padding: 8px 16px; font-size: 0.85rem; }

.menu-toggle {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; font-size: 0.85rem; font-weight: 700;
  color: var(--text); cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border); border-radius: var(--radius-sm, 10px);
}
.menu-toggle:hover { background: rgba(255, 255, 255, 0.09); }
.menu-icon { position: relative; display: inline-flex; flex-direction: column; justify-content: center; gap: 3px; width: 16px; height: 12px; }
.menu-icon span { display: block; height: 2px; width: 100%; background: currentColor; border-radius: 2px; transition: transform 0.2s ease, opacity 0.2s ease; }
.menu-icon.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.menu-icon.open span:nth-child(2) { opacity: 0; }
.menu-icon.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

.section-menu {
  position: absolute; left: 0; right: 0; top: 100%;
  background: rgba(11, 16, 32, 0.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow);
  max-height: calc(100vh - 62px);
  overflow-y: auto;
  padding: 18px 0 26px;
}
.menu-title { font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-mute); margin: 0 0 12px; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 4px 22px; }
.menu-list a {
  display: flex; align-items: baseline; gap: 12px;
  padding: 11px 12px; border-radius: var(--radius-sm, 10px);
  color: var(--text); font-weight: 600; text-decoration: none;
}
.menu-list a:hover { background: rgba(255, 255, 255, 0.06); }
.menu-num { color: var(--accent-soft); font-variant-numeric: tabular-nums; font-size: 0.82rem; font-weight: 700; }

.menu-enter-active, .menu-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 860px) {
  .nav-links { display: none; }
}
@media (max-width: 460px) {
  .nav-cta { display: none; }
}
</style>
