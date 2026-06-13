<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReadingProgress from '@/components/ui/ReadingProgress.vue';

const route = useRoute();
const router = useRouter();

// Drei Themen plus Transparenz. Jede Gruppe trägt eine Route und ihre Abschnitts-Anker
// in DOM-Reihenfolge; die Beschriftungen liegen in nav.groups.<key> und nav.items.<id>.
// tone und num spiegeln die Signaturfarben und Nummern der Themen-Karten der Startseite
// (TopicsSection), damit das Menü im selben Look auftritt.
const GROUPS = [
  { key: 'verteilung', route: '/verteilung', tone: 'gold', num: '1', items: ['verteilung', 'international', 'ubs-studie', 'pauschal'] },
  { key: 'rechner', route: '/rechner', tone: 'accent', num: '2', items: ['rechner', 'wegzug', 'dynamik', 'verwendung'] },
  { key: 'modelle', route: '/modelle', tone: 'violet', num: '3', items: ['wir-reports', 'zucman'] },
  { key: 'transparenz', route: '/quellen', tone: 'teal', num: '·', items: ['quellen'] },
];

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

    <!-- Themen-Menü: nach den drei Themen (plus Transparenz) gruppiert. Jede Gruppe
         verlinkt ihre Seite und Abschnitts-Anker; die aktive Gruppe ist markiert. -->
    <transition name="menu">
      <div v-if="menuOpen" id="section-menu" class="section-menu" @click.self="closeMenu">
        <div class="wrap">
          <div class="menu-top">
            <router-link to="/" @click="closeMenu">{{ $t('nav.items.start') }}</router-link>
            <router-link :to="{ path: '/', hash: '#aussagen' }" @click="closeMenu">{{ $t('nav.items.aussagen') }}</router-link>
            <router-link :to="{ path: '/', hash: '#themen' }" @click="closeMenu">{{ $t('nav.items.themen') }}</router-link>
          </div>
          <div class="menu-groups">
            <div
              v-for="g in GROUPS"
              :key="g.key"
              class="menu-group card"
              :class="[`tone-${g.tone}`, { active: isGroupActive(g.key) }]"
            >
              <router-link class="menu-group-title" :to="g.route" @click="closeMenu">
                <span class="menu-group-num" aria-hidden="true">{{ g.num }}</span>
                <span>{{ $t(`nav.groups.${g.key}`) }}</span>
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
  /* Glasleiste mit dezentem Farbschleier im Verlaufston der Startseite. */
  background:
    radial-gradient(700px 220px at 82% -60%, rgba(255, 84, 112, 0.12), transparent 70%),
    radial-gradient(600px 200px at 8% -60%, rgba(91, 141, 255, 0.1), transparent 70%),
    rgba(11, 16, 32, 0.82);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 16px; }
.brand { display: flex; align-items: center; gap: 9px; font-weight: 800; color: var(--text); text-decoration: none; font-size: 0.98rem; letter-spacing: -0.01em; }
.brand:hover { text-decoration: none; }
.brand-flag {
  display: block; width: 22px; height: 22px; flex: none; border-radius: 6px;
  box-shadow: 0 0 0 3px rgba(227, 6, 19, 0.16);
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}
.brand:hover .brand-flag { transform: rotate(-4deg) scale(1.06); box-shadow: 0 0 0 4px rgba(255, 84, 112, 0.22); }
.nav-actions { display: flex; align-items: center; gap: 12px; }
.nav-cta { padding: 8px 16px; font-size: 0.85rem; }

.menu-toggle {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; font-size: 0.85rem; font-weight: 700;
  color: var(--text); cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border); border-radius: 999px;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.menu-toggle:hover { background: rgba(255, 255, 255, 0.09); border-color: var(--text-mute); }
/* Geöffnetes Menü an den Akzent koppeln. */
.menu-toggle[aria-expanded='true'] { background: rgba(255, 84, 112, 0.14); border-color: var(--accent); color: var(--accent-soft); }
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
.menu-top {
  display: flex; flex-wrap: wrap; gap: 10px;
  margin-bottom: 22px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
}
.menu-top a {
  display: inline-flex; align-items: center;
  padding: 7px 15px; border-radius: 999px;
  font-size: 0.84rem; font-weight: 700; color: var(--text-soft); text-decoration: none;
  background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border);
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.menu-top a:hover { color: var(--text); background: rgba(255, 255, 255, 0.08); border-color: var(--accent); text-decoration: none; }

.menu-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }

/* Themengruppen als Karten im Look der Startseiten-Karten (Akzentlinie + Signaturton). */
.tone-gold { --tone: var(--gold); }
.tone-accent { --tone: var(--accent); }
.tone-violet { --tone: var(--violet); }
.tone-teal { --tone: var(--teal); }

.menu-group {
  position: relative; overflow: hidden;
  padding: 16px 16px 12px;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.menu-group::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--tone); opacity: 0.85;
}
.menu-group:hover { transform: translateY(-2px); border-color: var(--tone); }
.menu-group.active { border-color: var(--tone); }

.menu-group-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.92rem; font-weight: 800; letter-spacing: -0.01em;
  color: var(--text); margin: 0 0 12px; text-decoration: none;
}
.menu-group-title:hover { color: var(--tone); text-decoration: none; }
.menu-group-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 8px; flex: none;
  font-size: 0.82rem; font-weight: 800; line-height: 1;
  color: #11152b; background: var(--tone);
}

.menu-list { list-style: none; margin: 0; padding: 0; }
.menu-list a {
  display: block; padding: 9px 12px; border-radius: var(--radius-sm, 10px);
  color: var(--text-soft); font-weight: 600; font-size: 0.92rem; text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
}
.menu-list a:hover { background: rgba(255, 255, 255, 0.06); color: var(--text); text-decoration: none; }
.menu-list a.active { background: color-mix(in srgb, var(--tone) 16%, transparent); color: var(--tone); }

.menu-enter-active, .menu-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 460px) {
  .nav-cta { display: none; }
}
</style>
