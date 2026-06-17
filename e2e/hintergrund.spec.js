import { test, expect } from '@playwright/test';

// Smoke-Test der Hintergrund-Seite: Alle sieben Artikel rendern, der i18n-Block-Renderer
// (tm/rt) liefert echten Text, Kennzahl-Karten und Quellen-Tags sind vorhanden, und es
// gibt keine ungeloesten i18n-Schluessel im Sichtbereich.
const ANCHORS = ['aufkauf', 'geldfluss', 'demokratie', 'steuerluecke', 'wirtschaft', 'loesung', 'mehr'];

test('Hintergrund-Seite rendert alle sieben Artikel', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('/hintergrund');

  for (const a of ANCHORS) {
    const sec = page.locator(`section#${a}`);
    await expect(sec).toBeVisible();
    await expect(sec.locator('h2')).not.toBeEmpty();
    await expect(sec.locator('p.body, p.lead').first()).not.toBeEmpty();
  }

  // Jeder Artikel ist ein vollflaechiges Farbband (Verlauf via --g1) und traegt Quellen-Tags.
  const firstBg = await page.locator('section#aufkauf').evaluate(
    (el) => getComputedStyle(el).getPropertyValue('--g1').trim(),
  );
  expect(firstBg).not.toBe('');
  await expect(page.locator('.source-tag').first()).toBeVisible();

  // Jeder Artikel verlinkt ein Gary-Video (YouTube).
  const videoLinks = page.locator('a.video-link');
  await expect(videoLinks).toHaveCount(ANCHORS.length);
  for (const h of await videoLinks.evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
    expect(h).toContain('youtube.com');
  }

  // Keine ungeloesten i18n-Schluessel im Text (z. B. "hintergrund.aufkauf.title")
  const body = await page.locator('main').innerText();
  expect(body).not.toContain('hintergrund.');

  expect(errors, errors.join('\n')).toEqual([]);
});
