// Prerendert alle Router-Routen zu statischen HTML-Dateien und erzeugt die Sitemap.
// GitHub Pages kennt kein serverseitiges Rendering: ohne diesen Schritt liefern
// Unterseiten den HTTP-Status 404 (SPA-Fallback über 404.html) und eine fast leere
// index.html; beides indexieren Suchmaschinen nicht. Der Schritt läuft als Teil von
// `npm run build` (siehe package.json) nach `vite build` und schreibt:
//   dist/index.html         voll gerenderte Startseite
//   dist/<pfad>.html        voll gerendertes HTML je Unterseite; GitHub Pages liefert
//                           z. B. /rechner aus rechner.html mit Status 200
//   dist/sitemap.xml        alle Routen, referenziert aus public/robots.txt
// Die leere App-Shell bleibt als 404.html (SPA-Fallback für unbekannte Pfade) erhalten.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extname, join } from 'node:path';
import { chromium } from '@playwright/test';
import { routeTable, canonicalUrl } from '../src/router/routes.js';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

// Die leere App-Shell einmal einlesen und für alle Routen aus dem Speicher ausliefern;
// so bleibt der Fallback stabil, auch nachdem index.html unten mit der gerenderten
// Startseite überschrieben wurde.
const shell = await readFile(join(dist, 'index.html'));

// Minimaler statischer Server über dist/ mit SPA-Fallback auf die App-Shell, damit der
// Browser jede Route direkt laden kann.
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = join(dist, pathname);
  if (!pathname.includes('..') && extname(pathname) && existsSync(file)) {
    res.writeHead(200, { 'content-type': contentTypes[extname(pathname)] || 'application/octet-stream' });
    res.end(await readFile(file));
    return;
  }
  res.writeHead(200, { 'content-type': contentTypes['.html'] });
  res.end(shell);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage();

const rendered = [];
for (const route of routeTable) {
  await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle' });
  // Warten, bis die App gemountet ist und der Router-Hook (src/lib/head.js) den
  // Canonical-Link dieser Route gesetzt hat; erst dann ist der Head vollständig.
  await page.waitForFunction((expected) => {
    const app = document.getElementById('app');
    const link = document.head.querySelector('link[rel="canonical"]');
    return !!app && app.children.length > 0 && !!link && link.href === expected;
  }, canonicalUrl(route.path));
  const html = await page.content();
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  await writeFile(join(dist, file), html);
  rendered.push(file);
}

await browser.close();
server.close();

// Sitemap aus derselben Routen-Tabelle, damit sie nie von den Routen abweicht.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routeTable.map((route) => `  <url><loc>${canonicalUrl(route.path)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(join(dist, 'sitemap.xml'), sitemap);

console.log(`Prerendert: ${rendered.join(', ')}`);
console.log(`Sitemap: sitemap.xml (${routeTable.length} URLs)`);
