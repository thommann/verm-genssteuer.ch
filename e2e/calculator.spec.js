import { test, expect } from '@playwright/test';

// Hilfsfunktion: Range-Input programmatisch auf einen Wert setzen und Input-Event auslösen.
async function setSlider(locator, value) {
  await locator.evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

// Logarithmische Wegzug-Skala (identisch mit WegzugSection.vue):
// 0–200 UI-Schritte → 100 Mio.–50 Mrd. CHF
const WEGZUG_LOG_MIN = 1e8;
const WEGZUG_MAX = 50e9;
const WEGZUG_LOG_STEPS = 200;
function chfToLogPos(chf) {
  if (chf >= WEGZUG_MAX) return WEGZUG_LOG_STEPS;
  const logMin = Math.log10(WEGZUG_LOG_MIN);
  const logMax = Math.log10(WEGZUG_MAX);
  return Math.round(((Math.log10(chf) - logMin) / (logMax - logMin)) * WEGZUG_LOG_STEPS);
}
// Vordefinierte Positionen für die Tests
const POS_1MRD  = chfToLogPos(1e9);   // ≈ 74
const POS_10MRD = chfToLogPos(10e9);  // ≈ 148
const POS_MAX   = WEGZUG_LOG_STEPS;   // 200 = kein Wegzug

// Erste Ganzzahl aus einem Text als Personenzahl lesen.
const parseCnt = (t) => parseInt(t.match(/\d+/)?.[0] ?? '0', 10);

test.describe('Rechner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rechner');
    // Sicherstellen, dass der Rechner-Abschnitt gerendert ist.
    await expect(page.locator('#rechner')).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Grundzustand
  // -------------------------------------------------------------------------

  test('Preset "Tief" ist beim Laden aktiv', async ({ page }) => {
    await expect(page.locator('.preset.active')).toHaveText('Tief');
  });

  test('Tarifkurven-Regler sind sichtbar', async ({ page }) => {
    for (const label of ['Freibetrag', 'Grenzsatz', 'Progression', 'Höchst-Grenzsatz']) {
      await expect(page.locator('#rechner-modell label').filter({ hasText: label }).first()).toBeVisible();
    }
  });

  test('Datenjahr 2022 ist voreingestellt', async ({ page }) => {
    await expect(page.locator('.ychip.active')).toHaveText('2022');
  });

  test('Wegzug-Anzeige zeigt "kein Wegzug" im Grundzustand', async ({ page }) => {
    const display = page.locator('#wegzug .range-display');
    await expect(display).toHaveText('kein Wegzug');
  });

  test('Aufkommen-Ergebnis ist sichtbar und positiv', async ({ page }) => {
    const label = page.locator('.result-label');
    await expect(label).toContainText('Mehreinnahmen');

    const value = page.locator('.result-value');
    await expect(value).toBeVisible();
    // Aufkommen ist positiv: beginnt nicht mit einem Minuszeichen.
    const text = await value.textContent();
    expect(text).not.toMatch(/^−/);
  });

  // -------------------------------------------------------------------------
  // Preset-Wechsel
  // -------------------------------------------------------------------------

  test('Preset "Moderat" wechselt korrekt', async ({ page }) => {
    // Erste Preset-Zeile enthält die eigenen Modelle; "moderat" (WIR 2022) sitzt in der zweiten.
    const myRow = page.locator('.preset-row').first();
    await myRow.locator('.preset', { hasText: 'Moderat' }).click();
    await expect(page.locator('.preset.active')).toHaveText('Moderat');
    await expect(page.locator('.result-value')).toBeVisible();
  });

  test('Preset "Hoch" wechselt korrekt', async ({ page }) => {
    // "Hoch" gibt es auch in der WIR-Zeile; daher auf die progressive Zeile einschränken.
    const myRow = page.locator('.preset-row').first();
    await myRow.locator('.preset', { hasText: 'Hoch' }).click();
    await expect(page.locator('.preset.active')).toHaveText('Hoch');
  });

  test('WIR-2022-Preset sperrt die Tarifkurven-Regler', async ({ page }) => {
    // Erstes WIR-Preset (moderat) anklicken.
    const wirPresets = page.locator('.preset-row').last().locator('.preset');
    await wirPresets.first().click();

    // Sperr-Hinweis erscheint.
    await expect(page.locator('.controls-lock')).toBeVisible();
    await expect(page.locator('.controls-lock')).toContainText('WIR-Referenzmodell aktiv');

    // Tarifkurven-Regler sind versteckt.
    await expect(page.locator('.controls label').filter({ hasText: 'Grenzsatz' })).not.toBeVisible();
  });

  test('"Klicke hier" im WIR-Modus kehrt zum eigenen Modell zurück', async ({ page }) => {
    const wirPresets = page.locator('.preset-row').last().locator('.preset');
    await wirPresets.first().click();
    await expect(page.locator('.controls-lock')).toBeVisible();

    await page.locator('.controls-lock-link').click();
    await expect(page.locator('.controls-lock')).not.toBeVisible();
    await expect(page.locator('.preset.active')).toHaveText('Tief');
  });

  // -------------------------------------------------------------------------
  // Datenjahr-Chips
  // -------------------------------------------------------------------------

  test('Datenjahr-Chip 2020 wird aktiv', async ({ page }) => {
    await page.locator('.ychip', { hasText: '2020' }).click();
    await expect(page.locator('.ychip.active')).toHaveText('2020');
    await expect(page.locator('.result-value')).toBeVisible();
  });

  test('Datenjahr-Chip 2021 wird aktiv', async ({ page }) => {
    await page.locator('.ychip', { hasText: '2021' }).click();
    await expect(page.locator('.ychip.active')).toHaveText('2021');
    await expect(page.locator('.result-value')).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Tarifkurven-Regler: Reaktivität
  // -------------------------------------------------------------------------

  test('Freibetrag-Regler ändert das Aufkommen', async ({ page }) => {
    const before = await page.locator('.result-value').textContent();

    const slider = page.locator('#rechner-modell .controls input[type="range"]').first();
    await setSlider(slider, 50_000_000); // 50 Mio. statt 5 Mio.

    // Wert hat sich verändert (nicht identisch mit dem Ausgangswert).
    const after = await page.locator('.result-value').textContent();
    expect(after).not.toBe(before);
  });

  // -------------------------------------------------------------------------
  // Wegzug-Szenario (eigener Abschnitt #wegzug)
  // -------------------------------------------------------------------------

  test('Wegzug-Schieber aktiviert das Wegzug-Szenario', async ({ page }) => {
    const slider = page.locator('#wegzug input[type="range"]');
    await setSlider(slider, POS_1MRD);

    // Anzeige wechselt von "kein Wegzug" auf "ab …"
    await expect(page.locator('#wegzug .range-display')).toContainText('ab');

    // Der Wegzug-Info-Kasten nennt jetzt eine Personenzahl grösser null.
    const info = page.locator('.wegzug-info');
    await expect(info).toBeVisible();
    expect(parseCnt(await info.textContent())).toBeGreaterThan(0);
  });

  test('Wegzug-Info zeigt Personenzahl und Schwelle', async ({ page }) => {
    const slider = page.locator('#wegzug input[type="range"]');
    await setSlider(slider, POS_1MRD);

    const infoBox = page.locator('.wegzug-info');
    // Enthält Personenanzahl und Text über die Schweiz.
    await expect(infoBox).toContainText('Steuerpflichtige');
    await expect(infoBox).toContainText('2022');
    await expect(infoBox).toContainText('Schweiz');
  });

  test('Wegzug-Aufschlüsselung reagiert auf das Szenario', async ({ page }) => {
    // Die heutigen Steuern der Abgewanderten (Minus-Zeile) ändern sich mit dem Szenario.
    const negVal = page.locator('#wegzug .rb-row.neg .rb-val');
    const before = await negVal.textContent();

    const slider = page.locator('#wegzug input[type="range"]');
    await setSlider(slider, POS_1MRD);

    const after = await negVal.textContent();
    expect(after).not.toBe(before);

    // Aufschlüsselung zeigt neue Steuer (+) und heutige Steuern (−).
    const rows = await page.locator('#wegzug .rb-rows').textContent();
    expect(rows).toMatch(/\+/);
    expect(rows).toMatch(/−/);
  });

  test('Dauerhaft-Wert reagiert auf aktiven Wegzug', async ({ page }) => {
    // Der gold ausgewiesene Dauerhaft-Wert in der Ergebnis-Karte folgt dem Wegzug.
    const gold = page.locator('.result .result-value.gold');
    await expect(gold).toBeVisible();
    const before = await gold.textContent();

    const slider = page.locator('#wegzug input[type="range"]');
    await setSlider(slider, POS_1MRD);

    await expect(gold).toBeVisible();
    expect(await gold.textContent()).not.toBe(before);
  });

  test('Wegzug-Schieber auf Maximum setzt auf "kein Wegzug" zurück', async ({ page }) => {
    const slider = page.locator('#wegzug input[type="range"]');
    // Zuerst aktivieren.
    await setSlider(slider, POS_1MRD);
    await expect(page.locator('#wegzug .range-display')).toContainText('ab');

    // Zurück auf Maximum (Sentinel = kein Wegzug).
    await setSlider(slider, POS_MAX);
    await expect(page.locator('#wegzug .range-display')).toHaveText('kein Wegzug');
    await expect(page.locator('.result-label')).toContainText('Mehreinnahmen');
  });

  test('Höhere Wegzug-Schwelle bedeutet weniger Wegziehende', async ({ page }) => {
    const slider = page.locator('#wegzug input[type="range"]');

    // Tiefer Schwellwert: viele Wegziehende.
    await setSlider(slider, POS_1MRD);
    await page.waitForTimeout(50);
    const lowText = await page.locator('.wegzug-info').textContent();

    // Hoher Schwellwert: weniger Wegziehende.
    await setSlider(slider, POS_10MRD);
    await page.waitForTimeout(50);
    const highText = await page.locator('.wegzug-info').textContent();

    expect(parseCnt(lowText)).toBeGreaterThan(parseCnt(highText));
  });

  test('Wegzug-Szenario in Kombination mit WIR-Preset funktioniert', async ({ page }) => {
    // WIR-2022-moderat aktivieren.
    const wirPresets = page.locator('.preset-row').last().locator('.preset');
    await wirPresets.first().click();
    await expect(page.locator('.controls-lock')).toBeVisible();

    // Wegzug-Schieber setzen: ist auch im WIR-Modus aktiv.
    const slider = page.locator('#wegzug input[type="range"]');
    await setSlider(slider, POS_1MRD);

    await expect(page.locator('#wegzug .range-display')).toContainText('ab');
    const info = page.locator('.wegzug-info');
    await expect(info).toBeVisible();
    expect(parseCnt(await info.textContent())).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // Voreinstellung in der URL (Deep-Link)
  // -------------------------------------------------------------------------

  test('Deep-Link ?preset=moderat aktiviert die Voreinstellung beim Laden', async ({ page }) => {
    await page.goto('/rechner?preset=moderat');
    await expect(page.locator('.preset.active')).toHaveText('Moderat');
  });

  test('Deep-Link auf ein WIR-Preset sperrt die Regler', async ({ page }) => {
    await page.goto('/rechner?preset=wir2022_3');
    await expect(page.locator('.controls-lock')).toBeVisible();
  });

  test('Preset-Klick schreibt die Voreinstellung in die URL', async ({ page }) => {
    const myRow = page.locator('.preset-row').first();
    await myRow.locator('.preset', { hasText: 'Hoch' }).click();
    await expect(page).toHaveURL(/[?&]preset=steil/);
  });

  test('Schieber-Anpassung entfernt die Voreinstellung aus der URL', async ({ page }) => {
    await page.goto('/rechner?preset=moderat');
    await expect(page).toHaveURL(/[?&]preset=moderat/);

    const slider = page.locator('#rechner-modell .controls input[type="range"]').first();
    await setSlider(slider, 50_000_000);
    await expect(page).not.toHaveURL(/preset=/);
  });

  test('Unbekannte Voreinstellung in der URL fällt auf das Standardmodell zurück', async ({ page }) => {
    await page.goto('/rechner?preset=gibtsnicht');
    await expect(page.locator('.preset.active')).toHaveText('Tief');
    await expect(page).not.toHaveURL(/gibtsnicht/);
  });
});
