import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import HintergrundPage from '@/pages/HintergrundPage.vue';
import VerteilungPage from '@/pages/VerteilungPage.vue';
import RechnerPage from '@/pages/RechnerPage.vue';
import ModellePage from '@/pages/ModellePage.vue';
import QuellenPage from '@/pages/QuellenPage.vue';
import ImpressumPage from '@/pages/ImpressumPage.vue';
import DatenschutzPage from '@/pages/DatenschutzPage.vue';

// Drei Themen plus Startseite und Quellen. Die meta.group-Schlüssel verbinden eine Route
// mit ihrer Menü-Überschrift (nav.groups.<group>) und der aktiven Hervorhebung.
export const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { titleKey: 'routes.home' } },
  { path: '/rechner', name: 'rechner', component: RechnerPage, meta: { group: 'rechner', titleKey: 'routes.rechner' } },
  { path: '/verteilung', name: 'verteilung', component: VerteilungPage, meta: { group: 'verteilung', titleKey: 'routes.verteilung' } },
  { path: '/modelle', name: 'modelle', component: ModellePage, meta: { group: 'modelle', titleKey: 'routes.modelle' } },
  { path: '/hintergrund', name: 'hintergrund', component: HintergrundPage, meta: { group: 'hintergrund', titleKey: 'routes.hintergrund' } },
  { path: '/quellen', name: 'quellen', component: QuellenPage, meta: { group: 'transparenz', titleKey: 'routes.quellen' } },
  // Rechtliche Seiten (ohne eigene Menügruppe, verlinkt aus der Fusszeile).
  { path: '/impressum', name: 'impressum', component: ImpressumPage, meta: { titleKey: 'routes.impressum' } },
  { path: '/datenschutz', name: 'datenschutz', component: DatenschutzPage, meta: { titleKey: 'routes.datenschutz' } },
  // Unbekannte Pfade führen zurück zur Startseite.
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Beim Seitenwechsel nach oben; Anker-Sprünge innerhalb einer Seite übernimmt die
  // settleScroll-Routine in App.vue, weil Diagramme das Layout asynchron verschieben.
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return false;
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

export default router;
