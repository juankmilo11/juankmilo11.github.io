// Real-browser review/selection checks. Test-only routes expose the existing
// handlers and scene; no debug globals or scripted moves ship in production.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const assert = require('node:assert/strict');
const project = path.resolve(__dirname, '../projects/FCT');
const output = process.env.FCT_QA_OUTPUT || path.join(require('node:os').tmpdir(), 'fct-review-ui-qa');

function near(actual, expected, label, tolerance = 1.1) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
}

(async () => {
  const { build } = await import(pathToFileURL(require.resolve('vite', { paths: [project] })).href);
  const buildRoot = path.resolve(__dirname, '../dist/fct-review-ui-build');
  const marker = 'return { update, resize, resetCamera, playIntro, cancelIntro };';
  await build({ root: project, logLevel: 'warn', build: { outDir: buildRoot, emptyOutDir: true }, plugins: [{
    name: 'review-ui-test-hooks',
    transform(code, id) {
      id = id.replaceAll('\\', '/');
      if (id.endsWith('/src/main.js')) return code + '\nwindow.qaReviewUI={handleSquare,getSelected:()=>selectedSquare};';
      if (id.endsWith('/src/board3d.js')) {
        assert.ok(code.includes(marker), 'test scene hook still matches the renderer return');
        return code.replace(marker, `window.qaReviewBoard={scene,selectionMarker};${marker}`);
      }
    },
  }] });
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let file = path.resolve(buildRoot, './' + decodeURIComponent(url.pathname).replace(/^\/FCT\/?/, ''));
    if (file !== buildRoot && !file.startsWith(buildRoot + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    const size = fs.statSync(file).size, range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Accept-Ranges', 'bytes');
    if (range) {
      const start = Number(range[1]), end = range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
      if (start >= size || end < start) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return; }
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else { res.setHeader('Content-Length', size); fs.createReadStream(file).pipe(res); }
  });
  let browser;
  try {
    fs.mkdirSync(output, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-unsafe-swiftshader'] });
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 568], [844, 390]]) {
      const reduced = width !== 1440;
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference', isMobile: width <= 844, hasTouch: width <= 844 });
      page.setDefaultTimeout(25000);
      page.setDefaultNavigationTimeout(30000);
      const errors = [];
      page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
      await page.route(/\/assets\/ai-worker-[^/]+\.js$/, route => route.fulfill({ contentType: 'text/javascript', body: `self.onmessage=({data})=>{if(data.type==='choose-move')self.postMessage({type:'move',requestId:data.requestId,move:'e7e5'});};` }));
      await page.goto(origin + '/FCT/', { waitUntil: 'domcontentloaded' });
      console.log(`Review UI ${width}x${height}: loading game`);
      await page.waitForFunction(() => window.qaReviewUI && window.fctReview);
      await page.locator('#select-pieces').click();
      assert.equal(await page.locator('#army-opponent-color').count(),0);
      for(const group of ['#appearance-genders','#appearance-colors']) {
        const centered=await page.locator(group).evaluate(el=>{
          const section=el.closest('section').getBoundingClientRect();
          const first=el.firstElementChild.getBoundingClientRect(),last=el.lastElementChild.getBoundingClientRect();
          return Math.abs((first.left+last.right)/2-(section.left+section.right)/2)<1.2;
        });
        assert.ok(centered,`${group} centered within its settings column`);
      }
      await page.locator('[data-role="k"]').click();
      await page.locator('[data-character="cloud"]').click();
      await page.locator('[data-role="q"]').click();
      await page.locator('[data-character="ovelia"]').click();
      await page.locator('[data-gender="male"]').click();
      assert.equal(await page.locator('[data-character="ovelia"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('[data-character="cloud"]').count(),0);
      await page.locator('[data-role="k"]').click();
      assert.equal(await page.locator('[data-character="cloud"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('[data-character="ovelia"]').count(),0);
      await page.locator('[data-gender="female"]').click();
      await page.locator('#appearance-save').click();
      await page.locator('#new-game').click();
      await page.locator('#board-3d canvas').waitFor();
      await page.waitForFunction(() => document.querySelector('.app-shell').classList.contains('is-playing') && !document.querySelector('#battle-curtain').classList.contains('is-revealing'));
      console.log(`Review UI ${width}x${height}: scene ready`);

      const camera = await page.locator('#reset-camera').boundingBox();
      const exit = await page.locator('#return-to-menu').boundingBox();
      const eye = await page.locator('#reset-camera svg').boundingBox();
      near(camera.width, exit.width, 'camera/exit width'); near(camera.height, exit.height, 'camera/exit height');
      near(eye.x + eye.width / 2, camera.x + camera.width / 2, 'eye horizontal center');
      near(eye.y + eye.height / 2, camera.y + camera.height / 2, 'eye vertical center');

      // A real 3D blank-canvas click must clear both the ring and legal targets.
      await page.evaluate(() => window.qaReviewUI.handleSquare('d2'));
      await page.waitForFunction(() => window.qaReviewBoard.selectionMarker.visible);
      await page.locator('#board-3d canvas').click({ position: { x: 3, y: 3 } });
      await page.waitForFunction(() => window.qaReviewUI.getSelected() === null && !window.qaReviewBoard.selectionMarker.visible);

      await page.locator('[data-view="2d"]').click();
      await page.locator('[data-square="e2"]').click();
      assert.equal(await page.locator('.square.selected').count(), 1);
      assert.ok(await page.locator('.move-target').count() > 0);
      await page.locator('.map-title').click();
      assert.equal(await page.locator('.square.selected,.move-target,.capture-target').count(), 0, 'outside-board click clears selection and targets');

      await page.locator('[data-square="e2"]').click();
      await page.locator('[data-square="e4"]').click();
      await page.waitForFunction(() => /2 de 2/.test(document.querySelector('#review-position').textContent));
      const timeline = await page.locator('#review-controls').boundingBox();
      near(timeline.x, 0, 'timeline starts at the viewport edge');
      near(timeline.width, width, 'timeline spans the viewport');
      const start = await page.evaluate(() => {
        document.querySelector('#review-previous').click();
        return {
          transitioning: document.querySelector('.app-shell').classList.contains('is-review-transitioning'),
          animation: getComputedStyle(document.querySelector('.board-stage')).animationName,
          status: document.querySelector('#game-status').textContent,
        };
      });
      assert.equal(start.status, 'Partida pausada');
      assert.equal(start.transitioning, !reduced);
      assert.equal(start.animation.includes('review-soft-shade'), !reduced);
      assert.equal(await page.locator('.game-status-badge').isVisible(), true);
      assert.equal(await page.locator('#review-pause-note').evaluate(el => getComputedStyle(el).textAlign), 'center');
      await page.waitForFunction(() => !document.querySelector('.app-shell').classList.contains('is-review-transitioning'));
      assert.equal(await page.locator('.board-stage').evaluate(el=>getComputedStyle(el).filter),'brightness(0.92)');
      await page.locator('#review-last').click();
      assert.equal(await page.locator('#game-status').textContent(), 'Partida pausada', 'latest reviewed position stays paused');
      await page.screenshot({ path: path.join(output, `review-${width}x${height}.png`) });
      const resume = await page.evaluate(() => {
        document.querySelector('#review-return').click();
        return {
          transitioning: document.querySelector('.app-shell').classList.contains('is-review-transitioning'),
          status: document.querySelector('#game-status').textContent,
        };
      });
      assert.equal(resume.transitioning, !reduced);
      assert.equal(resume.status, 'Tu turno');
      await page.waitForFunction(() => !document.querySelector('.app-shell').classList.contains('is-review-transitioning'));
      assert.equal(await page.locator('#review-pause-note').isVisible(), false);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow');
      assert.deepEqual(errors, []);
      console.log(`OK ${width}x${height}: full-width review, centered pause/badge, shade transition ${!reduced}, symmetric camera, 2D/3D deselection`);
      await page.close();
    }
    console.log('Screenshots: ' + output);
  } finally { await browser?.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
