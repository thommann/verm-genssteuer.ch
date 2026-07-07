import { canonicalUrl } from '@/router/routes';

// Setzt die suchmaschinenrelevanten Head-Tags je Route: Titel, Meta-Description,
// Canonical-Link und Open-Graph-Tags. Läuft bei jedem Routenwechsel (router.afterEach in
// main.js); beim Prerendering (scripts/prerender.mjs) werden die gesetzten Werte in die
// statischen HTML-Dateien eingebacken, damit Crawler sie ohne JavaScript sehen.

// Liefert das erste Element für den Selektor oder hängt ein neu erzeugtes in den Head.
const ensureHeadElement = (selector, create) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
};

const setMetaTag = (attribute, key, content) => {
  const el = ensureHeadElement(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    return meta;
  });
  el.setAttribute('content', content);
};

export function applyHead(route, t) {
  const brand = t('nav.brand');
  const title = route.meta.titleKey ? `${t(route.meta.titleKey)} · ${brand}` : brand;
  const description = t(route.meta.descriptionKey || 'seo.descriptions.home');
  const url = canonicalUrl(route.path);

  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:site_name', brand);
  setMetaTag('property', 'og:locale', 'de_CH');
  setMetaTag('name', 'twitter:card', 'summary');

  const canonical = ensureHeadElement('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  canonical.setAttribute('href', url);
}
