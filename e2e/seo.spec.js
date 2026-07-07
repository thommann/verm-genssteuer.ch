import { test, expect } from '@playwright/test';
import { routeTable, canonicalUrl, SITE_ORIGIN } from '../src/router/routes.js';

// SEO-Smoke-Tests: Alle Routen sind als statische HTML-Dateien prerendert (Status 200,
// Inhalt und Meta-Tags ohne JavaScript sichtbar), robots.txt und sitemap.xml sind
// vorhanden, und die Head-Tags wechseln bei Client-Navigation mit.

test('alle Routen sind prerendert: Status 200, Inhalt und Head-Tags ohne JavaScript', async ({ request }) => {
  for (const route of routeTable) {
    const res = await request.get(route.path);
    expect(res.status(), route.path).toBe(200);
    const html = await res.text();
    // Route-spezifischer Canonical beweist, dass der Head-Hook beim Prerendern lief;
    // data-v-app beweist, dass die App beim Erfassen gemountet war (kein leeres Shell-HTML).
    expect(html, route.path).toContain(`<link rel="canonical" href="${canonicalUrl(route.path)}">`);
    expect(html, route.path).toContain('og:title');
    expect(html, route.path).toContain('data-v-app');
  }
});

test('robots.txt erlaubt Crawling und verweist auf die Sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
});

test('sitemap.xml führt alle Routen mit kanonischer URL', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const body = await res.text();
  for (const route of routeTable) {
    expect(body).toContain(`<loc>${canonicalUrl(route.path)}</loc>`);
  }
});

test('Head-Tags wechseln bei Client-Navigation mit', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Das reichste 1 %/);

  // Zur Rechner-Seite navigieren (Client-Routing, kein neuer Seitenabruf).
  await page.getByRole('link', { name: 'Ausprobieren' }).first().click();
  await expect(page).toHaveTitle(/Vermögenssteuer-Rechner/);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', canonicalUrl('/rechner'));
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', /Vermögenssteuer-Rechner/);
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', /Vermögenssteuer-Rechner/);
});
