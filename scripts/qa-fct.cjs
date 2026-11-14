// Optional real-browser QA: set PLAYWRIGHT_MODULE_PATH if Playwright is not local.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = process.env.FCT_QA_OUTPUT || path.join(require('node:os').tmpdir(), 'fct-qa');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-unsafe-swiftshader'] });
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 568], [844, 390]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width <= 844, hasTouch: width <= 844 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`);
      await page.waitForFunction(() => window.fctReview);
      await page.locator('#new-game').click();
      await page.locator('#board-3d canvas').waitFor();
      await page.waitForFunction(() => !document.querySelector('#battle-curtain').classList.contains('is-revealing') && document.querySelector('.app-shell').classList.contains('is-playing'));
      await page.locator('[data-view="2d"]').click();
      await page.locator('[data-square="e2"]').click();
      await page.locator('[data-square="e4"]').click();
      await page.waitForFunction(() => /2 de 2/.test(document.querySelector('#review-position').textContent));
      await page.locator('[data-view="3d"]').click();
      await page.locator('#review-previous').click();
      await page.locator('#review-pause-note').waitFor({ state: 'visible' });
      // Wait for the HUD ResizeObserver and the 3D resize to settle.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const note = await page.locator('#review-pause-note').boundingBox();
      const toolbar = await page.locator('.game-toolbar').boundingBox();
      const pieces = await page.locator('.remaining-black').boundingBox();
      assert.ok(note && pieces && toolbar);
      assert.ok(!overlaps(note, pieces), `notice overlaps opponent pieces at ${width}x${height}`);
      assert.ok(note.y + note.height <= toolbar.y + toolbar.height + 1, 'notice escapes reserved HUD');
      assert.ok(note.x >= 0 && note.x + note.width <= width, 'notice overflows viewport');
      assert.ok(pieces.y >= toolbar.y + toolbar.height, 'opponent pieces overlap HUD');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'horizontal overflow');
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(output, `fct-${width}x${height}.png`) });
      await page.locator('#review-return').click();
      await page.locator('#review-pause-note').waitFor({ state: 'hidden' });
      console.log(`OK ${width}x${height}: actual move/review/resume, no HUD overlap or runtime errors`);
      await page.close();
    }
    console.log(`Screenshots: ${output}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
