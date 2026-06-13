// Rendert jeden .slide aus slides.html als druckfertiges PNG nach ./out/.
// Aufruf:  node marketing/instagram/export.mjs [scale]
// scale = Pixeldichte (Standard 2 -> 2160x2700 px, gestochen scharf; 1 = exakt 1080x1350).
//
// Voraussetzung: Playwright-Chromium ist installiert (npm i, npx playwright install chromium).

import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const scale = Number(process.argv[2] || 2);
const outDir = join(here, 'out');

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: scale,
});

await page.goto(pathToFileURL(join(here, 'slides.html')).href, { waitUntil: 'networkidle' });
// Schriften sicher geladen, bevor wir abgreifen.
await page.evaluate(() => document.fonts.ready);

const ids = await page.$$eval('.slide', els => els.map(el => el.id));
for (const id of ids) {
  const el = await page.$(`#${id}`);
  const num = id.replace(/^s/, '');
  const file = join(outDir, `slide-${num}.png`);
  await el.screenshot({ path: file });
  console.log(`✓ ${file}`);
}

await browser.close();
console.log(`\nFertig: ${ids.length} Slides (scale ${scale}) in ${outDir}`);
