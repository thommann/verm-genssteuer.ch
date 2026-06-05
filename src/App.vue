<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import HeroSection from '@/components/sections/HeroSection.vue';
import TopicsSection from '@/components/sections/TopicsSection.vue';
import ChapterHeader from '@/components/sections/ChapterHeader.vue';
import DistributionSection from '@/components/sections/DistributionSection.vue';
import CalculatorSection from '@/components/sections/CalculatorSection.vue';
import SpendSection from '@/components/sections/SpendSection.vue';
import ProjectionSection from '@/components/sections/ProjectionSection.vue';
import InternationalSection from '@/components/sections/InternationalSection.vue';
import WirSection from '@/components/sections/WirSection.vue';
import ZucmanSection from '@/components/sections/ZucmanSection.vue';
import UbsStudySection from '@/components/sections/UbsStudySection.vue';
import PauschalSection from '@/components/sections/PauschalSection.vue';
import SourcesSection from '@/components/sections/SourcesSection.vue';

// Die Abschnitte sind in drei Themen gebündelt (plus Transparenz). Jede Gruppe trägt
// einen Schlüssel für die Menü-Überschrift (nav.groups.<key>) und ihre Abschnitts-Anker
// in DOM-Reihenfolge. Die einzelnen Beschriftungen liegen in nav.items.<id>.
const GROUPS = [
  { key: 'verteilung', items: ['verteilung', 'international', 'ubs-studie', 'pauschal'] },
  { key: 'rechner', items: ['rechner', 'dynamik', 'verwendung'] },
  { key: 'modelle', items: ['wir-reports', 'zucman'] },
  { key: 'transparenz', items: ['quellen'] },
];

// Flache Anker-Liste in DOM-Reihenfolge (für den Scroll-Spy), beginnend mit dem Hero.
const SECTION_IDS = ['start', 'themen', ...GROUPS.flatMap((g) => g.items)];
const scrolled = ref(false);
const activeId = ref(SECTION_IDS[0]);

// Themengruppe, in der der aktive Abschnitt liegt: hebt die ganze Gruppe im Menü hervor.
const activeGroupKey = computed(() => {
  const g = GROUPS.find((grp) => grp.items.includes(activeId.value));
  return g ? g.key : null;
});

// Scroll-Spy: ermittelt den aktuell sichtbaren Abschnitt und spiegelt dessen
// Anker in die URL (ohne neue History-Einträge), damit Links jederzeit teilbar
// sind und der aktive Eintrag im Menü markiert werden kann.
const updateActive = () => {
  const line = 90; // knapp unter der Sticky-Navigation
  let current = SECTION_IDS[0];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  // Am Seitenende den letzten Abschnitt aktiv setzen, auch wenn er kurz ist.
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    current = SECTION_IDS[SECTION_IDS.length - 1];
  }
  if (current !== activeId.value) activeId.value = current;
  if (location.hash !== `#${current}`) {
    history.replaceState(null, '', `#${current}`);
  }
};

let ticking = false;
const onScroll = () => {
  scrolled.value = window.scrollY > 40;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateActive();
    });
  }
};

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);
const onKeydown = (e) => {
  if (e.key === 'Escape') closeMenu();
};

// Externe Deeplinks (#abschnitt) zuverlässig anspringen: Diagramme werden
// asynchron gerendert und schieben das Layout nach. Wir korrigieren das
// Anspringen daher so lange nach, bis das Layout steht, brechen aber ab,
// sobald der Nutzer selbst scrollt. Das Ziel wird einmal aus der initialen
// URL gelesen, bevor der Scroll-Spy den Hash verändern kann.
const settleDeeplink = async () => {
  const id = decodeURIComponent(location.hash.slice(1));
  await nextTick();
  const target = id && document.getElementById(id);
  if (!target) {
    updateActive(); // ohne Deeplink: Hash auf den obersten Abschnitt setzen
    return;
  }
  const jumpToTarget = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
  jumpToTarget();

  let userScrolled = false;
  const cancel = () => (userScrolled = true);
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchmove', cancel, { passive: true, once: true });

  // Bei Höhenänderungen (nachladende Charts) erneut zum Anker springen.
  const ro = new ResizeObserver(() => { if (!userScrolled) jumpToTarget(); });
  ro.observe(document.body);

  // Beobachtung nach kurzer Stabilisierungsphase wieder lösen.
  setTimeout(() => {
    ro.disconnect();
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
  }, 1800);
};

onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
  settleDeeplink();
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
        <img class="brand-flag" src="/logo.svg" alt="" aria-hidden="true" />
        {{ $t('nav.brand') }}
      </a>

      <div class="nav-actions">
        <a href="#rechner" class="btn btn-primary nav-cta" @click="closeMenu">{{ $t('nav.cta') }}</a>
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="section-menu"
          :aria-label="$t('nav.menuAria')"
          @click="toggleMenu"
        >
          <span class="menu-icon" :class="{ open: menuOpen }"><span></span><span></span><span></span></span>
          {{ $t('nav.menu') }}
        </button>
      </div>
    </div>

    <!-- Themen-Menü: nach den drei Themen (plus Transparenz) gruppiert. Jede Gruppe
         listet ihre Abschnitte und springt zum Anker; die aktive Gruppe ist markiert. -->
    <transition name="menu">
      <div v-if="menuOpen" id="section-menu" class="section-menu" @click.self="closeMenu">
        <div class="wrap">
          <div class="menu-top">
            <a href="#start" @click="closeMenu">{{ $t('nav.items.start') }}</a>
            <a href="#themen" @click="closeMenu">{{ $t('nav.items.themen') }}</a>
          </div>
          <div class="menu-groups">
            <div
              v-for="g in GROUPS"
              :key="g.key"
              class="menu-group"
              :class="{ active: activeGroupKey === g.key }"
            >
              <p class="menu-group-title">{{ $t(`nav.groups.${g.key}`) }}</p>
              <ul class="menu-list">
                <li v-for="n in g.items" :key="n">
                  <a
                    :href="`#${n}`"
                    :class="{ active: activeId === n }"
                    :aria-current="activeId === n ? 'true' : undefined"
                    @click="closeMenu"
                  >
                    {{ $t(`nav.items.${n}`) }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>

  <main id="top">
    <HeroSection />
    <TopicsSection />

    <!-- Thema 1: Wie ungleich ist die Schweiz? -->
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

    <!-- Thema 2: Der Rechner. Zusammenhängende Einheit: Modell wählen, Rendite einstellen,
         Wirkung sehen. Alle drei Abschnitte teilen denselben reaktiven Datensatz (useCalculator)
         und werden durch Rahmen, Akzentlinie und Schritt-Navigation als ein Block markiert. -->
    <div id="thema-rechner" class="calc-suite">
      <div class="wrap calc-suite-head">
        <div class="chapter-head-top">
          <span class="chapter-num">{{ $t('chapters.rechnerNum') }}</span>
          <span class="chapter-kicker">{{ $t('chapters.rechnerKicker') }}</span>
        </div>
        <h2 class="chapter-title" v-html="$t('chapters.rechnerTitle')" />
        <p class="chapter-lead lead" v-html="$t('chapters.rechnerLead')" />
        <ol class="cs-steps">
          <li>
            <a href="#rechner" :class="{ active: activeId === 'rechner' }">
              <span class="cs-num">1</span>{{ $t('calcSuite.step1') }}
            </a>
          </li>
          <li>
            <a href="#dynamik" :class="{ active: activeId === 'dynamik' }">
              <span class="cs-num">2</span>{{ $t('calcSuite.step2') }}
            </a>
          </li>
          <li>
            <a href="#verwendung" :class="{ active: activeId === 'verwendung' }">
              <span class="cs-num">3</span>{{ $t('calcSuite.step3') }}
            </a>
          </li>
        </ol>
      </div>
      <CalculatorSection />
      <ProjectionSection />
      <SpendSection />
    </div>

    <!-- Thema 3: Welche Modelle gibt es? -->
    <ChapterHeader
      id="thema-modelle"
      :num="$t('chapters.modelleNum')"
      :kicker="$t('chapters.modelleKicker')"
      :title="$t('chapters.modelleTitle')"
      :lead="$t('chapters.modelleLead')"
    />
    <WirSection />
    <ZucmanSection />

    <SourcesSection />
  </main>
</template>

<style scoped>
/* Rechner-Einheit: full-bleed Band, das die drei zusammengehörenden Abschnitte
   (Rechner, Rendite, Verwendung) optisch zu einem Block zusammenfasst. */
.calc-suite {
  position: relative;
  background:
    radial-gradient(1100px 500px at 50% -8%, rgba(255, 84, 112, 0.07), transparent 60%),
    linear-gradient(180deg, rgba(124, 92, 255, 0.05), rgba(56, 214, 196, 0.035));
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
/* Akzentlinie am oberen Rand markiert den Anfang der Einheit. */
.calc-suite::before {
  content: '';
  position: absolute; top: -1px; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet), var(--teal));
}
/* Innenabstände der gebündelten Abschnitte verringern, damit sie als Einheit lesen. */
.calc-suite > section { padding-top: clamp(40px, 5vw, 72px); padding-bottom: clamp(40px, 5vw, 72px); }
.calc-suite > section:first-of-type { padding-top: clamp(20px, 3vw, 36px); }

.calc-suite-head { padding-top: clamp(40px, 6vw, 80px); }
.cs-steps {
  list-style: none; margin: 22px 0 0; padding: 0;
  display: flex; flex-wrap: wrap; gap: 10px;
}
.cs-steps a {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 8px 15px 8px 8px; border-radius: 999px;
  font-size: 0.88rem; font-weight: 700; color: var(--text-soft);
  background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border);
  text-decoration: none; transition: color 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}
.cs-steps a:hover { color: var(--text); border-color: var(--accent); }
.cs-steps a.active { color: var(--text); border-color: var(--accent); background: rgba(255, 84, 112, 0.1); }
.cs-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 999px;
  font-size: 0.8rem; font-variant-numeric: tabular-nums;
  background: var(--accent); color: #1a0008;
}
/* Verbindende Pfeile zwischen den Schritten. */
.cs-steps li:not(:last-child)::after {
  content: '→'; color: var(--text-mute); font-weight: 700; margin-left: 10px;
  align-self: center;
}
.cs-steps li { display: inline-flex; align-items: center; }

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
.brand-flag { display: block; width: 20px; height: 20px; flex: none; border-radius: 5px; box-shadow: 0 0 0 3px rgba(227, 6, 19, 0.16); }
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
.menu-top {
  display: flex; flex-wrap: wrap; gap: 20px;
  margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
}
.menu-top a { font-size: 0.86rem; font-weight: 700; color: var(--text-soft); text-decoration: none; }
.menu-top a:hover { color: var(--text); text-decoration: none; }

.menu-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px 26px; }
.menu-group { padding: 6px 0 10px; }
.menu-group.active .menu-group-title { color: var(--accent-soft); }
.menu-group-title {
  font-size: 0.74rem; font-weight: 800; letter-spacing: 0.02em;
  color: var(--text-mute); margin: 0 0 8px; padding: 0 12px;
}

.menu-list { list-style: none; margin: 0; padding: 0; }
.menu-list a {
  display: block; padding: 9px 12px; border-radius: var(--radius-sm, 10px);
  color: var(--text); font-weight: 600; font-size: 0.95rem; text-decoration: none;
}
.menu-list a:hover { background: rgba(255, 255, 255, 0.06); text-decoration: none; }
.menu-list a.active { background: rgba(255, 84, 112, 0.12); color: var(--accent-soft); }

.menu-enter-active, .menu-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 460px) {
  .nav-cta { display: none; }
}
</style>
