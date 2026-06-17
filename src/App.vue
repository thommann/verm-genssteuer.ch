<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReadingProgress from '@/components/ui/ReadingProgress.vue';

const route = useRoute();
const router = useRouter();

// Drei Themen plus Transparenz. Jede Gruppe trägt eine Route und ihre Abschnitts-Anker
// in DOM-Reihenfolge; die Beschriftungen liegen in nav.groups.<key> und nav.items.<id>.
// num nummeriert die drei Themen im Menübaum.
const GROUPS = [
  { key: 'hintergrund', route: '/hintergrund', num: '1', items: ['aufkauf', 'geldfluss', 'demokratie', 'steuerluecke', 'wirtschaft', 'loesung', 'mehr'] },
  { key: 'rechner', route: '/rechner', num: '2', items: ['rechner', 'wegzug', 'dynamik', 'verwendung'] },
  { key: 'verteilung', route: '/verteilung', num: '3', items: ['verteilung', 'international', 'ubs-studie', 'pauschal'] },
  { key: 'modelle', route: '/modelle', num: '4', items: ['wir-reports', 'zucman'] },
  { key: 'transparenz', route: '/quellen', num: '·', items: ['quellen'] },
];

// Jede Seite trägt den Signaturverlauf ihres Themas (main::before in main.css).
// Die Startseite und unbekannte Routen laufen auf dem Home-Verlauf.
const themeClass = computed(() => `theme-${route.meta.group || 'home'}`);

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

  if (route.hash) settleScroll(route.hash);
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

    <!-- Themen-Menü als einfacher Menübaum: Start, dann die drei Themen (plus Transparenz)
         mit ihren Abschnitts-Ankern als eingerückte Unterpunkte. Die aktive Seite/der aktive
         Abschnitt ist markiert. -->
    <transition name="menu">
      <nav v-if="menuOpen" id="section-menu" class="section-menu" :aria-label="$t('nav.menuAria')" @click.self="closeMenu">
        <div class="wrap">
          <ul class="menu-tree">
            <li>
              <router-link
                class="mt-link mt-home"
                :class="{ active: route.path === '/' }"
                to="/"
                @click="closeMenu"
              >{{ $t('nav.items.start') }}</router-link>
            </li>
            <li v-for="g in GROUPS" :key="g.key" class="mt-group">
              <router-link
                class="mt-link mt-group-link"
                :class="{ active: isGroupActive(g.key) }"
                :to="g.route"
                @click="closeMenu"
              >
                <span class="mt-num" aria-hidden="true">{{ g.num }}</span>
                <span>{{ $t(`nav.groups.${g.key}`) }}</span>
              </router-link>
              <ul class="mt-items">
                <li v-for="n in g.items" :key="n">
                  <router-link
                    class="mt-link mt-item"
                    :class="{ active: isItemActive(g, n) }"
                    :to="{ path: g.route, hash: `#${n}` }"
                    :aria-current="isItemActive(g, n) ? 'true' : undefined"
                    @click="closeMenu"
                  >
                    {{ $t(`nav.items.${n}`) }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </transition>
  </nav>

  <ReadingProgress />

  <main id="top" :class="themeClass">
    <router-view />
  </main>

  <footer class="site-footer" :class="{ flush: route.path === '/' }">
    <div class="wrap site-footer-inner">
      <router-link to="/#slogan" class="site-footer-slogan">#TaxWealthNotWork</router-link>
      <nav class="site-footer-links" :aria-label="$t('siteFooter.impressum')">
        <router-link to="/">{{ $t('siteFooter.start') }}</router-link>
        <router-link to="/quellen">{{ $t('siteFooter.quellen') }}</router-link>
        <router-link to="/impressum">{{ $t('siteFooter.impressum') }}</router-link>
        <router-link to="/datenschutz">{{ $t('siteFooter.datenschutz') }}</router-link>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 50;
  transition: background 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease;
}
.nav.solid {
  /* Glasleiste mit Farbschleier im Verlaufston der Slides. */
  background:
    radial-gradient(760px 240px at 82% -60%, rgba(255, 45, 107, 0.18), transparent 70%),
    radial-gradient(640px 220px at 8% -60%, rgba(124, 58, 237, 0.16), transparent 70%),
    rgba(11, 16, 32, 0.78);
  backdrop-filter: blur(14px);
}
/* Feine Verlaufslinie unter der soliden Leiste (wie der Lesefortschritt/die Slides). */
.nav.solid::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet), var(--teal));
  opacity: 0.9;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 16px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 900; color: #fff; text-decoration: none; font-size: 1rem; letter-spacing: -0.02em; }
/* Am Seitenanfang (transparente Leiste) liegt die Leiste teils über hellen Bändern:
   dezenter Schatten hält Marke und Knopf lesbar, bis die Glasleiste einblendet. */
.nav:not(.solid) .brand,
.nav:not(.solid) .menu-toggle { text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35); }
.brand:hover { text-decoration: none; }
.brand-flag {
  display: block; width: 26px; height: 26px; flex: none; border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3), 0 6px 16px -6px rgba(0, 0, 0, 0.6);
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}
.brand:hover .brand-flag { transform: rotate(-4deg) scale(1.06); box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 8px 18px -6px rgba(0, 0, 0, 0.6); }
.nav-actions { display: flex; align-items: center; gap: 10px; }

/* CTA als vivide Verlaufs-Pille im Slide-Look statt der flachen Akzentfläche. */
.nav-cta {
  padding: 10px 20px; font-size: 0.88rem; font-weight: 800; color: #fff;
  border: 0; border-radius: 999px;
  background: linear-gradient(135deg, #ff2d6b, #7c3aed);
  box-shadow: 0 10px 24px -10px rgba(255, 45, 107, 0.8);
}
.nav-cta:hover { transform: translateY(-1px); filter: brightness(1.06); background: linear-gradient(135deg, #ff2d6b, #7c3aed); }

.menu-toggle {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 10px 18px; font-size: 0.88rem; font-weight: 800;
  color: #fff; cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.28); border-radius: 999px;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.menu-toggle:hover { background: rgba(255, 255, 255, 0.16); border-color: rgba(255, 255, 255, 0.5); }
/* Geöffnetes Menü an den Akzent koppeln. */
.menu-toggle[aria-expanded='true'] { background: rgba(255, 45, 107, 0.22); border-color: var(--accent); color: #fff; }
.menu-icon { position: relative; display: inline-flex; flex-direction: column; justify-content: center; gap: 3px; width: 16px; height: 12px; }
.menu-icon span { display: block; height: 2px; width: 100%; background: currentColor; border-radius: 2px; transition: transform 0.2s ease, opacity 0.2s ease; }
.menu-icon.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.menu-icon.open span:nth-child(2) { opacity: 0; }
.menu-icon.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

.section-menu {
  position: absolute; left: 0; right: 0; top: 100%;
  /* Glasflaeche mit demselben Verlaufsschimmer wie der Seitenhintergrund. */
  background:
    radial-gradient(900px 380px at 80% -10%, rgba(255, 84, 112, 0.12), transparent 60%),
    radial-gradient(700px 320px at 6% 0%, rgba(91, 141, 255, 0.1), transparent 58%),
    rgba(11, 16, 32, 0.96);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow);
  /* dvh berücksichtigt die ein- und ausfahrende Adressleiste mobiler Browser,
     damit das Menü nicht abgeschnitten wird; vh bleibt als Fallback. */
  max-height: calc(100vh - 62px);
  max-height: calc(100dvh - 62px);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 22px 0 30px;
}
/* Menübaum: einfache, eingerückte Hierarchie statt Kacheln und Chips. */
.menu-tree { list-style: none; margin: 0; padding: 0; max-width: 460px; }
.menu-tree > li + li { margin-top: 2px; }
.menu-tree > li.mt-group { margin-top: 8px; }

.mt-link {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 8px;
  color: var(--text-soft); text-decoration: none; font-weight: 600;
  transition: color 0.12s ease, background 0.12s ease;
}
.mt-link:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); text-decoration: none; }
.mt-link.active { color: var(--accent); }

.mt-home, .mt-group-link {
  font-size: 1.02rem; font-weight: 800; letter-spacing: -0.01em; color: var(--text);
}
.mt-home { margin-bottom: 6px; }

.mt-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 7px; flex: none;
  font-size: 0.8rem; font-weight: 800; line-height: 1;
  color: var(--text-soft); background: rgba(255, 255, 255, 0.06); border: 1px solid var(--border);
}
.mt-group-link.active { color: var(--accent); }
.mt-group-link.active .mt-num { color: var(--accent); border-color: var(--accent); background: rgba(255, 84, 112, 0.12); }

/* Unterpunkte eingerückt mit Führungslinie (Baum-Optik). */
.mt-items {
  list-style: none; margin: 2px 0 2px 23px; padding: 2px 0;
  border-left: 1px solid var(--border);
}
.mt-item { font-size: 0.92rem; font-weight: 600; padding: 6px 12px; margin-left: 8px; }
.mt-item.active { color: var(--accent); font-weight: 700; }

.menu-enter-active, .menu-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 460px) {
  .nav-cta { display: none; }
}
/* Sehr schmale Schirme: Marke und Menü-Knopf etwas kompakter, damit die Leiste passt. */
@media (max-width: 360px) {
  .brand { font-size: 0.9rem; gap: 8px; }
  .brand-flag { width: 22px; height: 22px; }
  .menu-toggle { padding: 9px 13px; gap: 7px; }
}

/* Globale Fusszeile mit den rechtlichen Seiten. Erscheint auf jeder Route.
   position/z-index sind nötig, weil <main> als eigener Stacking-Context (isolation)
   seinen fixierten Verlauf (main::before) sonst über die Fusszeile legt und deren
   Text verdeckt. Ein eigener Stacking-Context hebt die Fusszeile darüber. */
.site-footer {
  position: relative;
  z-index: 1;
  margin-top: 40px;
  border-top: 1px solid var(--border);
  background: rgba(5, 7, 15, 0.4);
}
/* Startseite: das Slogan-Band ist vollflächig farbig; ein 40px-Abstand würde die dunkle
   Grundfläche als Naht durchscheinen lassen. Daher Fusszeile bündig anschliessen. */
.site-footer.flush { margin-top: 0; }
.site-footer-inner {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 12px 24px; padding-top: 18px; padding-bottom: 18px;
}
.site-footer-slogan {
  font-size: 0.92rem; font-weight: 900; letter-spacing: -0.01em;
  color: var(--text); text-decoration: none;
  background: linear-gradient(90deg, var(--accent), var(--violet));
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.site-footer-slogan:hover { filter: brightness(1.1); }
.site-footer-links { display: flex; flex-wrap: wrap; gap: 8px 18px; }
/* Auf schmalen Schirmen rechts Platz lassen, damit der fixierte
   «nach oben»-Knopf (ReadingProgress) den letzten Link nicht verdeckt. */
@media (max-width: 600px) {
  .site-footer-inner { padding-right: calc(46px + clamp(16px, 4vw, 32px) + 12px); }
}
.site-footer-links a {
  font-size: 0.84rem; font-weight: 700; color: var(--text-soft); text-decoration: none;
  transition: color 0.15s ease;
}
.site-footer-links a:hover { color: var(--accent-soft); }
.site-footer-links a.router-link-exact-active { color: var(--accent); }
</style>
