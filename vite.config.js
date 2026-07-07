import { fileURLToPath, URL } from 'node:url';
import { copyFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// GitHub Pages kennt keinen SPA-Fallback: Direktaufrufe unbekannter Pfade liefern 404.
// Wir kopieren die gebaute index.html (leere App-Shell) nach 404.html, damit Pages dann
// dieselbe App ausliefert und der Router (History-Mode) die Route übernimmt. Die echten
// Routen werden nach dem Build prerendert (scripts/prerender.mjs) und von Pages mit
// Status 200 ausgeliefert.
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const out = fileURLToPath(new URL('./dist', import.meta.url));
    const index = `${out}/index.html`;
    if (existsSync(index)) copyFileSync(index, `${out}/404.html`);
  },
});

// GitHub Pages löst Pfade ohne Endung auf gleichnamige HTML-Dateien auf (/rechner wird
// aus rechner.html bedient). `vite preview` kennt diese Auflösung nicht; dieses Shim
// bildet sie nach, damit Vorschau und E2E-Tests (Playwright läuft gegen preview) die
// Produktionsauslieferung abbilden.
const pagesHtmlResolution = () => ({
  name: 'pages-html-resolution',
  configurePreviewServer(server) {
    const out = fileURLToPath(new URL('./dist', import.meta.url));
    server.middlewares.use((req, res, next) => {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      if (pathname !== '/' && !extname(pathname) && existsSync(`${out}${pathname}.html`)) {
        req.url = req.url.replace(pathname, `${pathname}.html`);
      }
      next();
    });
  },
});

export default defineConfig({
  // Custom Domain (vermögenssteuer.ch) wird vom Root ausgeliefert
  base: '/',
  plugins: [vue(), spaFallback(), pagesHtmlResolution()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
