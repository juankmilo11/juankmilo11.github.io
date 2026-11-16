// Isolated UI security checks; production persistence is tested by qa-online.mjs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(__dirname, '../../..');
const output = path.join(os.tmpdir(), 'admin-qa');
const fixtureToken = 'isolated-ui-fixture-session';
const fixturePassword = 'UI fixture password only';
let reads = 0;
let expire = false;
let appointments = [{ id: 'fixture-request-1', name: 'Ana Test', whatsapp: '+12015550123', instagram: '@ana_test', service: 'nails', nailType: 'fullSet', removal: 'no', removalConsent: false, date: '2027-01-04', time: '10:00', durationMinutes: null, status: 'pending', notes: '', version: 1, createdAt: '2026-11-16T12:00:00Z', message: '<img src=x onerror="window.fixtureXSS=true">', attachments: [], punctuality: true, cancellation: true, policy: true, consent: true }];
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    let raw = ''; for await (const chunk of req) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    if (url.pathname === '/api/admin/login') {
      if (body.password !== fixturePassword) return json(res, 401, { error: { code: 'invalid_credentials' } });
      return json(res, 200, { token: fixtureToken, expiresAt: new Date(Date.now() + 3600000).toISOString() });
    }
    if (expire || req.headers.authorization !== 'Bearer ' + fixtureToken) return json(res, 401, { error: { code: 'unauthorized' } });
    if (url.pathname === '/api/admin/appointments') { reads++; return json(res, 200, { items: appointments, nextCursor: null }); }
    if (url.pathname === '/api/admin/appointments/fixture-request-1' && req.method === 'PATCH') {
      if (body.version !== appointments[0].version) return json(res, 409, { error: { code: 'version_conflict' } });
      appointments[0] = { ...appointments[0], ...body, version: body.version + 1 }; return json(res, 200, appointments[0]);
    }
    if (url.pathname === '/api/admin/appointments/fixture-request-1' && req.method === 'DELETE') { appointments = []; return json(res, 200, { ok: true }); }
    return json(res, 200, { ok: true });
  }
  if (url.pathname === '/shared/api-config.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(`window.ProjectAPIConfig={baseURL:'http://127.0.0.1:${server.address().port}'};`); return; }
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || relative.split(path.sep).some(part => part.startsWith('.'))) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  let browser;
  fs.mkdirSync(output, { recursive: true });
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: process.env.PACA_BROWSER_CHANNEL || 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/pages/admin/`);
    assert.equal(reads, 0, 'No private data requested before login');
    assert.equal(await page.locator('#dashboard').isVisible(), false);
    await page.locator('#login-password').fill('wrong password');
    await page.locator('#login-form button').click();
    await page.getByText('La contraseña no es correcta.').waitFor();
    assert.equal(reads, 0, 'Rejected login cannot load records');
    await page.locator('#login-password').fill(fixturePassword);
    await page.locator('#login-form button').click();
    await page.locator('.appointment-action').waitFor();
    assert.equal(await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length), 0);
    await page.locator('.appointment-action').click();
    assert.equal(await page.locator('#request-message img').count(), 0, 'User text is never inserted as HTML');
    assert.equal(await page.evaluate(() => Boolean(window.fixtureXSS)), false);
    await page.locator('#edit-form [name="status"]').selectOption('confirmed');
    assert.equal(await page.locator('#edit-form [name="durationMinutes"]').getAttribute('required'), '');
    await page.locator('#edit-form [name="durationMinutes"]').fill('60');
    await page.locator('#edit-form [type="submit"]').click();
    await page.locator('.badge[data-status="confirmed"]').waitFor();
    await page.screenshot({ path: path.join(output, 'admin-desktop.png') });
    await page.locator('.appointment-action').click();
    await page.locator('#delete-open').click();
    await page.locator('#delete-dialog [data-close]').first().click();
    assert.equal(appointments.length, 1, 'Cancel preserves the record');
    await page.locator('#delete-open').click();
    await page.locator('#delete-form [type="submit"]').click();
    await page.getByText('Solicitud eliminada.').waitFor();
    assert.equal(appointments.length, 0);
    await page.setViewportSize({ width: 320, height: 640 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, 'admin-mobile.png') });
    expire = true;
    await page.locator('#refresh').click();
    await page.locator('#access').waitFor();
    assert.equal(await page.locator('#dashboard').isVisible(), false);
    assert.equal(await page.locator('#appointments').innerText(), '');
    assert.equal(await page.locator('#login-password').inputValue(), '');
    assert.deepEqual(errors, []);
    console.log('ADMIN UI OK: server-only login, empty browser storage, text safety, edit, explicit deletion, mobile and session-expiry cleanup.');
    console.log(`Screenshots: ${output}`);
  } finally { await browser?.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
