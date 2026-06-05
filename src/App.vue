<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReadingProgress from '@/components/ui/ReadingProgress.vue';

const route = useRoute();
const router = useRouter();

// Drei Themen plus Transparenz. Jede Gruppe trägt eine Route und ihre Abschnitts-Anker
// in DOM-Reihenfolge; die Beschriftungen liegen in nav.groups.<key> und nav.items.<id>.
const GROUPS = [
  { key: 'verteilung', route: '/verteilung', items: ['verteilung', 'international', 'ubs-studie', 'pauschal'] },
  { key: 'rechner', route: '/rechner', items: ['rechner', 'dynamik', 'verwendung'] },
  { key: 'modelle', route: '/modelle', items: ['wir-reports', 'zucman'] },
  { key: 'transparenz', route: '/quellen', items: ['quellen'] },
];

// Alte Single-Page-Deeplinks (#abschnitt) auf die passende Route umleiten, damit
// geteilte Links weiter funktionieren.
const LEGACY = {
  verteilung: '/verteilung', international: '/verteilung', 'ubs-studie': '/verteilung', pauschal: '/verteilung',
  rechner: '/rechner', dynamik: '/rechner', verwendung: '/rechner',
  'wir-reports': '/modelle', zucman: '/modelle',
  quellen: '/quellen',
};

const isGroupActive = (key) => route.meta.group === key;
const isItemActive = (g, n) =>
  route.path === g.route && (route.hash === `#${n}` || (!route.hash && n === g.items[0]));

// Sticky-Navigation: ab etwas Scroll einen soliden Hintergrund einblenden.
const scrolled = ref(false);
const onScroll = () => { scrolled.value = window.scrollY > 40; };

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);
const onKeydown = (e) => { if (e.key === 'Escape') closeMenu(); };

// Anker innerhalb einer Seite zuverlässig anspringen: Diagramme rendern asynchron und
// schieben das Layout nach. Wir springen daher wiederholt zum Ziel, bis das Layout steht,
// brechen aber ab, sobald der Nutzer selbst scrollt.
const settleScroll = async (hash) => {
  if (!hash) return;
  await nextTick();
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  const jump = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
  jump();

  let userScrolled = false;
  const cancel = () => (userScrolled = true);
  window.addEventListener('wheel', cancel, { passive: true, once: true });
  window.addEventListener('touchmove', cancel, { passive: true, once: true });

  const ro = new ResizeObserver(() => { if (!userScrolled) jump(); });
  ro.observe(document.body);
  setTimeout(() => {
    ro.disconnect();
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
  }, 1800);
};

// Interne Absolut-Links aus v-html-Texten (z. B. «/rechner») ohne Vollreload navigieren.
// router-link-Klicks haben e.defaultPrevented bereits gesetzt und werden übersprungen.
const onDocClick = (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('/')) return;
  if (a.target && a.target !== '_self') return;
  e.preventDefault();
  const url = new URL(a.href);
  router.push(url.pathname + url.search + url.hash);
};

// Bei jedem Seitenwechsel das Menü schliessen und Anker (falls vorhanden) anspringen.
watch(
  () => route.fullPath,
  () => {
    closeMenu();
    if (route.hash) settleScroll(route.hash);
  },
);

onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('click', onDocClick);

  // Alten Deeplink (z. B. «/#rechner») einmalig auf die neue Route umleiten.
  const id = decodeURIComponent(location.hash.slice(1));
  if (route.path === '/' && id && LEGACY[id]) {
    router.replace({ path: LEGACY[id], hash: `#${id}` });
  } else if (route.hash) {
    settleScroll(route.hash);
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('keydown', onKeydown);
  document.removeEventListener('click', onDocClick);
});
</script>

<template>
  <nav class="nav" :class="{ solid: scrolled || menuOpen }">
    <div class="wrap nav-inner">
      <router-link to="/" class="brand" @click="closeMenu">
        <img class="brand-flag" src="/logo.svg" alt="" aria-hidden="true" />
        {{ $t('nav.brand') }}
      </router-link>

      <div class="nav-actions">
        <router-link to="/rechner" class="btn btn-primary nav-cta" @click="closeMenu">{{ $t('nav.cta') }}</router-link>
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
         verlinkt ihre Seite und Abschnitts-Anker; die aktive Gruppe ist markiert. -->
    <transition name="menu">
      <div v-if="menuOpen" id="section-menu" class="section-menu" @click.self="closeMenu">
        <div class="wrap">
          <div class="menu-top">
            <router-link to="/" @click="closeMenu">{{ $t('nav.items.start') }}</router-link>
            <router-link :to="{ path: '/', hash: '#themen' }" @click="closeMenu">{{ $t('nav.items.themen') }}</router-link>
          </div>
          <div class="menu-groups">
            <div
              v-for="g in GROUPS"
              :key="g.key"
              class="menu-group"
              :class="{ active: isGroupActive(g.key) }"
            >
              <router-link class="menu-group-title" :to="g.route" @click="closeMenu">
                {{ $t(`nav.groups.${g.key}`) }}
              </router-link>
              <ul class="menu-list">
                <li v-for="n in g.items" :key="n">
                  <router-link
                    :to="{ path: g.route, hash: `#${n}` }"
                    :class="{ active: isItemActive(g, n) }"
                    :aria-current="isItemActive(g, n) ? 'true' : undefined"
                    @click="closeMenu"
                  >
                    {{ $t(`nav.items.${n}`) }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>

  <ReadingProgress />

  <main id="top">
    <router-view />
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
  display: block;
  font-size: 0.74rem; font-weight: 800; letter-spacing: 0.02em;
  color: var(--text-mute); margin: 0 0 8px; padding: 0 12px; text-decoration: none;
}
.menu-group-title:hover { color: var(--text); text-decoration: none; }

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
