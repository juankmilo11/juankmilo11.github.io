// Verify the deployed production files and a real, public browser session.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const origin = 'https://juankmilo11.github.io/FCT/';
const commit = process.env.FCT_QA_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const output = process.env.FCT_QA_OUTPUT || path.join(root, 'dist/fct-live');
const normalize = text => text.replace(/\r/g, '');
const localHTML = normalize(fs.readFileSync(path.join(root, 'FCT/index.html'), 'utf8'));

(async () => {
  let ready = false;
  for (let attempt = 0; attempt < 24; attempt++) {
    const response = await fetch(origin + '?verify=' + commit, { signal: AbortSignal.timeout(20000) });
    if (response.ok && normalize(await response.text()) === localHTML) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  assert.ok(ready, 'GitHub Pages serves the current local build');
  const resources = [...localHTML.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))(?:[^"\s]*)"/g)].map(match => match[1]);
  for (const resource of resources) {
    const response = await fetch(new URL(resource + '?verify=' + commit, origin), { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, resource);
    const localPath = new URL(resource, origin).pathname.replace(/^\/FCT\//, '');
    assert.equal(normalize(await response.text()), normalize(fs.readFileSync(path.resolve(root, 'FCT', localPath), 'utf8')), 'published file matches ' + resource);
  }
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '?verify=' + commit, { waitUntil: 'domcontentloaded' });
    await page.locator('#select-pieces').click();
    for (const gender of ['female', 'male']) {
      await page.locator(`[data-gender="${gender}"]`).click();
      for (const [role, count] of [['p', 3], ['r', 3], ['n', 3], ['b', 3], ['q', 6], ['k', 6]]) {
        await page.locator(`[data-role="${role}"]`).click();
        assert.equal(await page.locator('[data-character]').count(), count);
        assert.equal(await page.locator('[data-character="dycedarg"],[data-character="gaff-gafgarion"]').count(), 0);
      }
    }
    await page.locator('[data-character="cloud"]').click();
    await page.locator('[data-palette="3"]').click();
    await page.waitForFunction(() => document.querySelector('#appearance-status').dataset.state === 'ready');
    await page.screenshot({ path: path.join(output, 'selector.png') });
    await page.locator('#appearance-save').click();
    await page.locator('#new-game').click();
    await page.waitForFunction(() => document.querySelector('.app-shell').classList.contains('is-playing') && !document.querySelector('#battle-curtain').classList.contains('is-revealing'));
    assert.equal(await page.locator('#reset-camera svg').count(), 1);
    await page.locator('[data-view="2d"]').click();
    assert.match(await page.locator('[data-square="e8"]').getAttribute('aria-label'), /Dycedarg|Gaff Gafgarion/);
    assert.match(await page.locator('[data-square="e1"]').getAttribute('aria-label'), /Cloud/);
    assert.equal(await page.locator('#board-2d').evaluate(el => /male|female/i.test(el.textContent + [...el.querySelectorAll('[aria-label]')].map(item => item.getAttribute('aria-label')).join(' '))), false);
    const royal = await page.locator('[data-square="e1"] .piece-art').getAttribute('src');
    assert.equal(Buffer.from(royal.split(',')[1], 'base64').equals(fs.readFileSync(path.join(root, 'projects/FCT/sprites/characters/cloud-3-thumb.png'))), true);
    await page.locator('[data-square="e2"]').click();
    assert.equal(await page.locator('[data-square="e2"]').getAttribute('aria-selected'), 'true');
    await page.locator('[data-square="e4"]').click();
    await page.waitForFunction(() => /2 de 2/.test(document.querySelector('#review-position').textContent));
    await page.locator('#review-previous').click();
    assert.equal(await page.locator('#game-status').textContent(), 'Partida pausada');
    assert.equal(await page.locator('.game-status-badge').isVisible(), true);
    const bar = await page.locator('#review-controls').boundingBox();
    assert.ok(Math.abs(bar.width - 1440) < 2 && Math.abs(bar.x) < 2);
    await page.screenshot({ path: path.join(output, 'review-2d.png') });
    await page.locator('#review-return').click();
    assert.equal(await page.locator('#game-status').textContent(), 'Tu turno');
    await page.locator('[data-view="3d"]').click();
    await page.locator('#board-3d canvas').waitFor();
    await page.screenshot({ path: path.join(output, 'board-3d.png') });
    assert.deepEqual(errors, []);
    console.log(`LIVE VERIFIED ${commit}: matching production files, uniform formations/colors, exclusive AI kings, selection, full-width review/pause and 3D.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
