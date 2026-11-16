// Run with Playwright installed, or set PLAYWRIGHT_MODULE_PATH to its module.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = process.env.PACA_QA_OUTPUT || path.join(os.tmpdir(), 'paca-qa');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.gif': 'image/gif', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || relative.split(path.sep).some(part => part.startsWith('.')) || relative.startsWith('projects' + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function closeBooking(page) {
  await page.locator('#booking-window-close').click();
  await page.locator('#booking-dialog').waitFor({ state: 'hidden' });
}
async function checkLayout(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page fits viewport');
  assert.ok(await page.locator('#booking-dialog').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth + 1), 'Booking has no horizontal overflow');
  const close = await page.locator('#booking-window-close').boundingBox();
  assert.ok(close && close.y >= 0 && close.y + close.height <= page.viewportSize().height, 'Close button stays in view');
}
async function settleAnimations(page, selector) {
  await page.locator(selector).evaluate(async element => {
    await Promise.all(element.getAnimations({ subtree: true })
      .filter(animation => animation.effect.getTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})));
  });
}

(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: process.env.PACA_BROWSER_CHANNEL || 'msedge', headless: true });
    const url = `http://127.0.0.1:${server.address().port}/pages/paula/`;
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
    const errors = [], failures = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(url) && response.status() >= 400) failures.push(response.url()); });
    page.on('request', request => requests.push(request));
    await page.goto(url);
    await page.locator('.work-card').first().waitFor();
    assert.equal(await page.locator('#motion-toggle,#catalog-search,#total-count,.service-number').count(), 0);
    assert.equal(await page.locator('main #agendar').count(), 0, 'Booking is outside the main page');
    assert.equal(await page.locator('#booking-dialog').isVisible(), false);
    assert.equal(requests.filter(request => request.url().includes('availability.json')).length, 0, 'Availability is loaded on demand');
    for (const category of ['all', 'nails', 'tattoo', 'pmu', 'beauty']) {
      const filter = page.locator(`[data-filter="${category}"]`);
      assert.doesNotMatch(await filter.innerText(), /\d/);
      await filter.click();
      assert.ok(await page.locator('.work-card').count() > 0);
    }
    await page.locator('[data-filter="all"]').click();
    const originalCard = await page.locator('.work-card').first().elementHandle();
    await page.locator('#catalog-more').click();
    assert.equal(await page.locator('.work-card').count(), 18);
    assert.ok(await originalCard.evaluate(card => card === document.querySelector('.work-card')), 'More inspiration preserves existing cards');
    await page.locator('.nav-book').click();
    await page.locator('#booking-dialog').waitFor();
    await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
    await checkLayout(page);
    const form = page.locator('#booking-form');
    await form.locator('[name="name"]').fill('Ana Test');
    await form.locator('[name="contact"]').fill('@ana_test');
    await form.locator('[name="message"]').fill('Azul y flores.');
    await closeBooking(page);
    assert.ok(await page.locator('.nav-book').evaluate(link => link === document.activeElement), 'Closing restores the opener');

    for (const service of ['nails', 'tattoo', 'pmu', 'beauty']) {
      await page.locator(`[data-book="${service}"]`).evaluate(button => button.closest('details').open = true);
      await page.locator(`[data-book="${service}"]`).click();
      assert.equal(await form.locator('[name="service"]').inputValue(), service);
      assert.equal(await form.locator('[name="name"]').inputValue(), 'Ana Test');
      await closeBooking(page);
    }
    await page.locator('[data-language="es"]').click();
    await page.locator('#theme-toggle').click();
    await page.locator('.floating-book').click();
    assert.equal(await page.locator('#booking-window-title').innerText(), 'Solicitar una cita');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert.equal(await form.locator('[name="message"]').inputValue(), 'Azul y flores.');
    await page.keyboard.press('Escape');
    await page.locator('#booking-dialog').waitFor({ state: 'hidden' });
    await page.locator('[data-language="en"]').click();
    await page.locator('#theme-toggle').click();

    await page.locator('.work-open').first().click();
    const reference = await page.locator('#work-title').innerText();
    await page.locator('#work-book').click();
    await page.locator('#booking-dialog').waitFor();
    await page.locator('#work-dialog').waitFor({ state: 'hidden' });
    assert.ok((await form.locator('[name="message"]').inputValue()).includes(reference));
    assert.ok((await form.locator('[name="message"]').inputValue()).includes('Azul y flores.'));
    await closeBooking(page);

    await page.locator('[data-book="nails"]').click();
    await form.locator('[name="nailType"]').selectOption('fullSet');
    await form.locator('[name="removal"]').selectOption('no');
    await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
    const days = page.locator('.calendar-days button:not(:disabled)');
    let selected = false;
    for (let index = 0; index < await days.count(); index++) {
      await days.nth(index).click();
      const times = page.locator('.time-slot:not(:disabled)');
      if (await times.count()) { await times.first().click(); selected = true; break; }
    }
    assert.ok(selected, 'Calendar offers a future appointment start');
    for (const name of ['punctuality', 'cancellation', 'policy', 'consent']) await form.locator(`[name="${name}"]`).check();
    await page.locator('#booking-submit').click();
    await page.locator('#booking-review').waitFor();
    assert.match(await page.locator('#booking-summary').innerText(), /Ana Test/);
    assert.match(await page.locator('#booking-summary').innerText(), /Azul y flores/);
    await page.locator('#booking-edit').click();
    assert.equal(await form.locator('[name="name"]').inputValue(), 'Ana Test');
    await closeBooking(page);
    assert.equal(requests.filter(request => request.method() === 'POST').length, 0, 'No request was sent');

    for (const [width, height] of [[1180, 820], [768, 1024], [375, 812], [812, 375], [320, 640]]) {
      await page.setViewportSize({ width, height });
      await page.locator('.nav-book').click();
      await checkLayout(page);
      await settleAnimations(page, '#booking-dialog');
      await page.screenshot({ path: path.join(output, `booking-${width}x${height}.png`) });
      await closeBooking(page);
    }
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.locator('#catalogo').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await page.waitForFunction(() => document.querySelector('#catalogo .section-heading').classList.contains('is-revealed'));
    await settleAnimations(page, '#catalogo');
    await page.screenshot({ path: path.join(output, 'catalog-desktop.png') });
    assert.equal(await page.locator('.ticker-track').evaluate(element => getComputedStyle(element).animationPlayState), 'running');
    assert.equal(await page.locator('.ticker-track').evaluate(element => getComputedStyle(element).animationName), 'marquee');
    await page.goto(url + '#agendar');
    await page.locator('#booking-dialog').waitFor();
    await closeBooking(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.ticker-track').evaluate(element => getComputedStyle(element).animationName), 'none');

    await page.route('**/assets/availability.json', route => route.fulfill({ status: 503, body: '{}' }));
    await page.locator('.nav-book').click();
    await page.locator('#agenda-retry').waitFor();
    assert.equal(failures.pop(), url + 'assets/availability.json', 'The simulated availability failure is reported');
    await form.locator('[name="name"]').fill('Retry Test');
    await page.unroute('**/assets/availability.json');
    await page.locator('#agenda-retry').click();
    await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
    assert.ok(await page.locator('.calendar-days button:not(:disabled)').count() > 0);
    assert.equal(await form.locator('[name="name"]').inputValue(), 'Retry Test');
    await closeBooking(page);

    const home = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const homeErrors = [];
    home.on('pageerror', error => homeErrors.push(error.message));
    await home.goto(`http://127.0.0.1:${server.address().port}/`);
    await home.locator('.enlace-paca').click();
    const paca = home.frameLocator('.ventana-paca iframe');
    await paca.locator('.nav-book').click();
    await paca.locator('#booking-dialog').waitFor();
    await paca.locator('#booking-dialog').evaluate(async element => {
      await Promise.all(element.getAnimations().map(animation => animation.finished));
    });
    await home.screenshot({ path: path.join(output, 'booking-inside-paca.png') });
    await paca.locator('#booking-window-close').click();
    await home.locator('.ventana-paca .cerrar-ventana').click();
    assert.equal(await home.locator('.ventana-paca').count(), 0);
    assert.deepEqual(homeErrors, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log('OK: filters, retained cards, every booking entry point, EN/ES, theme, draft, catalog reference, calendar, retry, review/edit, Escape, focus, five viewport sizes and the parent PACA iframe.');
    console.log(`Screenshots: ${output}`);
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
