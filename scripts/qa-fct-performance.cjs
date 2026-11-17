// Inspect the real 3D scene on a high-density mobile screen, without debug code in production.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const project = path.resolve(__dirname, '../projects/FCT');
const output = process.env.FCT_QA_OUTPUT || path.join(require('node:os').tmpdir(), 'fct-performance-qa');
(async () => {
  const { createServer } = await import(pathToFileURL(require.resolve('vite', { paths: [project] })).href);
  const server = await createServer({ root: project, logLevel: 'warn', server: { host: '127.0.0.1', port: 0 } });
  let browser;
  try {
    fs.mkdirSync(output, { recursive: true });
    await server.listen();
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-unsafe-swiftshader'] });
    for (const reduced of [false, true]) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: reduced ? 'reduce' : 'no-preference' });
      const errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => requests.push(request.url()));
      await page.route('**/__performance-qa', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><style>body{margin:0}#board{width:100vw;height:100vh}</style><div id="board"></div>' }));
      await page.route('**/src/board3d.js*', async route => {
        const response = await route.fetch(), body = await response.text();
        const marker = 'return { update, resize, resetCamera, playIntro, cancelIntro };';
        assert.ok(body.includes(marker));
        await route.fulfill({ response, body: body.replace(marker, `window.qaPerformance={scene,renderer,windParticles};${marker}`) });
      });
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FCT/__performance-qa`);
      const result = await page.evaluate(async () => {
        const { create3DBoard } = await import('/FCT/src/board3d.js');
        const { Chess } = await import('/FCT/node_modules/chess.js/dist/esm/chess.js');
        const game = new Chess(), board = create3DBoard(document.querySelector('#board'), () => {}, () => {});
        board.update(game.board(), { targets: new Set() });
        const { scene, renderer, windParticles } = window.qaPerformance;
        const names = [], shadowSizes = []; let birds = 0;
        scene.traverse(node => { names.push(node.name); birds += node.userData.birdCount || 0; if (node.isLight && node.castShadow) shadowSizes.push(node.shadow.mapSize.x); });
        return { names, birds, wind: windParticles?.count || 0, ratio: renderer.getPixelRatio(), shadowSizes };
      });
      assert.ok(result.names.every(name => !/cosmos|galaxy|planet|meteor|starfield|earth|moon/i.test(name)));
      assert.equal(result.birds, reduced ? 0 : 2);
      assert.equal(result.wind, reduced ? 0 : 4);
      assert.ok(result.ratio <= 1.25);
      assert.deepEqual(result.shadowSizes, [1024]);
      await page.waitForTimeout(1500);
      assert.ok(requests.every(url => !/cosmos|earth-blue-marble/.test(url)));
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(output, reduced ? 'reduced-motion.png' : 'mobile.png') });
      console.log(JSON.stringify({ reduced, ...result, names: undefined, output }));
      await page.close();
    }
  } finally { await browser?.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
