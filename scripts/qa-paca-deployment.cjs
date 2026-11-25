// Read-only smoke test of the real Pages deployment; never sends a booking.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const url = process.env.PACA_DEPLOYMENT_URL;
if (!url || new URL(url).protocol !== 'https:') throw new Error('Set PACA_DEPLOYMENT_URL to the HTTPS deployment.');
const output = path.join(require('node:os').tmpdir(), 'paca-deployment-qa');
(async () => {
  let browser;
  try {
    fs.mkdirSync(output, { recursive: true });
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    for (const width of [1180, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const errors = [], failures = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(url)) failures.push(response.status() + ' ' + response.url()); });
      assert.equal((await page.goto(url)).status(), 200);
      await page.locator('.work-card').first().waitFor({state:'attached'});
      const live = await page.evaluate(async () => ({ config: await window.ProjectAPI.availability(), lang: document.documentElement.lang }));
      assert.equal(live.config.timeZone, 'America/New_York');
      assert.ok(Array.isArray(live.config.blocked));
      const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
      const icon = await fetch(new URL(favicon, url)); assert.equal(icon.status, 200);
      const hash = data => crypto.createHash('sha256').update(data).digest('hex');
      assert.equal(hash(Buffer.from(await icon.arrayBuffer())), hash(fs.readFileSync(path.join(__dirname, '../img/bubble-paca.png'))));
      await page.evaluate(() => window.PacaI18n.setLanguage('es'));
      assert.equal(await page.locator('a[aria-label="Administración de PACA"]').count(), 1);
      await page.locator('.nav-book').click();
      assert.equal(await page.locator('[name="inspirationPhoto"]').getAttribute('required'), '');
      await page.locator('#booking-form [name="service"]').selectOption('beauty');
      await page.locator('#calendar-open').click();
      await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
      assert.ok(await page.locator('.calendar-days button').count() > 0);
      assert.doesNotMatch(await page.locator('#agenda-status').innerText(), /No pudimos|error/i);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(output, `calendar-${width}.png`) });
      await page.locator('#calendar-cancel').click();
      await page.locator('#booking-window-close').click();
      await page.screenshot({ path: path.join(output, `paca-${width}.png`), fullPage: true });
      assert.deepEqual(errors, []); assert.deepEqual(failures, []);
      await page.goto(new URL('admin/', url).href);
      await page.locator('#access').waitFor();
      assert.equal(await page.locator('#dashboard').isVisible(), false);
      assert.equal(await page.locator('#app-lbds').isVisible(), false);
      assert.deepEqual(errors, []); assert.deepEqual(failures, []);
      console.log(`OK ${width}px: pink favicon, catalog, live API/CORS, ES, mandatory inspiration, calendar and protected administration.`);
      await page.close();
    }
    console.log('Screenshots: ' + output);
  } finally { await browser?.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
