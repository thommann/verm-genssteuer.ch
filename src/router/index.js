import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import HintergrundPage from '@/pages/HintergrundPage.vue';
import VerteilungPage from '@/pages/VerteilungPage.vue';
import RechnerPage from '@/pages/RechnerPage.vue';
import ModellePage from '@/pages/ModellePage.vue';
import EigentumPage from '@/pages/EigentumPage.vue';
import QuellenPage from '@/pages/QuellenPage.vue';
import ImpressumPage from '@/pages/ImpressumPage.vue';
import DatenschutzPage from '@/pages/DatenschutzPage.vue';
import { routeTable } from './routes';

// Pfade und meta liegen in routes.js (auch von Prerendering und Sitemap genutzt);
// hier werden nur die Seiten-Komponenten über den Routen-Namen angehängt.
const pages = {
  home: HomePage,
  rechner: RechnerPage,
  eigentum: EigentumPage,
  verteilung: VerteilungPage,
  modelle: ModellePage,
  hintergrund: HintergrundPage,
  quellen: QuellenPage,
  impressum: ImpressumPage,
  datenschutz: DatenschutzPage,
};

export const routes = [
  ...routeTable.map((route) => ({ ...route, component: pages[route.name] })),
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
