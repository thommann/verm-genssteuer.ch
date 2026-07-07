// Zentrale Routen-Tabelle ohne Komponenten-Importe, damit sie auch unter Node läuft:
// scripts/prerender.mjs liest daraus die zu prerendernden Pfade und die Sitemap-Einträge,
// src/router/index.js hängt die Seiten-Komponenten über `name` an, src/lib/head.js baut
// daraus die Canonical-URLs. Die meta.group-Schlüssel verbinden eine Route mit ihrer
// Menü-Überschrift (nav.groups.<group>) und der aktiven Hervorhebung; titleKey und
// descriptionKey zeigen auf die i18n-Texte für Seitentitel und Meta-Description.

// GitHub Pages liefert die Seite unter der Custom Domain vermögenssteuer.ch aus; in URLs
// (Canonical, Open Graph, Sitemap) steht die Punycode-Form aus public/CNAME, weil Crawler
// und Validatoren IDN-Domains darauf normalisieren.
export const SITE_ORIGIN = 'https://xn--vermgenssteuer-ypb.ch';

// Kanonische URL einer Route: Startseite mit Slash, Unterseiten ohne (GitHub Pages liefert
// /rechner direkt aus rechner.html, ohne Redirect auf einen Slash-Pfad).
export const canonicalUrl = (path) => (path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`);

// Drei Themen plus Startseite und Quellen; rechtliche Seiten (Impressum, Datenschutz)
// ohne eigene Menügruppe, verlinkt aus der Fusszeile.
export const routeTable = [
  { path: '/', name: 'home', meta: { titleKey: 'routes.home', descriptionKey: 'seo.descriptions.home' } },
  { path: '/rechner', name: 'rechner', meta: { group: 'rechner', titleKey: 'routes.rechner', descriptionKey: 'seo.descriptions.rechner' } },
  { path: '/wem-gehoert-die-schweiz', name: 'eigentum', meta: { group: 'eigentum', titleKey: 'routes.eigentum', descriptionKey: 'seo.descriptions.eigentum' } },
  { path: '/verteilung', name: 'verteilung', meta: { group: 'verteilung', titleKey: 'routes.verteilung', descriptionKey: 'seo.descriptions.verteilung' } },
  { path: '/modelle', name: 'modelle', meta: { group: 'modelle', titleKey: 'routes.modelle', descriptionKey: 'seo.descriptions.modelle' } },
  { path: '/hintergrund', name: 'hintergrund', meta: { group: 'hintergrund', titleKey: 'routes.hintergrund', descriptionKey: 'seo.descriptions.hintergrund' } },
  { path: '/quellen', name: 'quellen', meta: { group: 'transparenz', titleKey: 'routes.quellen', descriptionKey: 'seo.descriptions.quellen' } },
  { path: '/impressum', name: 'impressum', meta: { titleKey: 'routes.impressum', descriptionKey: 'seo.descriptions.impressum' } },
  { path: '/datenschutz', name: 'datenschutz', meta: { titleKey: 'routes.datenschutz', descriptionKey: 'seo.descriptions.datenschutz' } },
];
