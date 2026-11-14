// Optional real-browser QA: set PLAYWRIGHT_MODULE_PATH if Playwright is not local.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = process.env.FCT_QA_OUTPUT || path.join(require('node:os').tmpdir(), 'fct-qa');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp':'image/webp', '.ttf':'font/ttf', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  const size=fs.statSync(file).size,range=/bytes=(\d*)-(\d*)/.exec(req.headers.range||'');
  res.setHeader('Accept-Ranges','bytes');
  if(range){const start=range[1]?Number(range[1]):Math.max(0,size-Number(range[2]));const end=range[1]?(range[2]?Math.min(size-1,Number(range[2])):size-1):size-1;
    if(start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);
  }else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
});
function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
async function inspectViewer(browser) {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    window.qaAudio=[];
    const play=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){ window.qaAudio.push(this.currentSrc||this.src); return play.call(this); };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`);
  await page.locator('#select-pieces').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>window.qaAudio.some(src=>src.includes('/assets/music/'))),'music starts attempting on page load');
  const card=await page.locator('.match-card').boundingBox();
  assert.ok(Math.abs(card.x+card.width/2-720)<3,'menu card centered');
  await page.locator('#audio-reopen').click();
  const seen=[await page.locator('#background-music').getAttribute('data-track')];
  for(let i=0;i<7;i++){await page.locator('#music-next').click();seen.push(await page.locator('#background-music').getAttribute('data-track'));}
  assert.equal(new Set(seen).size,8,'all themes play before a repeat');
  await page.locator('#music-next').click();const ninth=await page.locator('#background-music').getAttribute('data-track');
  assert.notEqual(ninth,seen.at(-1));
  await page.locator('#music-previous').click();assert.equal(await page.locator('#background-music').getAttribute('data-track'),seen.at(-1));
  await page.locator('#music-next').click();assert.equal(await page.locator('#background-music').getAttribute('data-track'),ninth);
  await page.locator('#music-volume').evaluate(el=>{el.value='17';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.ok(Math.abs(await page.locator('#background-music').evaluate(el=>el.volume)-.17)<.001);
  if(await page.locator('#background-music').evaluate(el=>el.paused))await page.locator('#audio-toggle').click();
  await page.waitForFunction(()=>!document.querySelector('#background-music').paused);
  await page.locator('#audio-toggle').click();
  await page.mouse.move(20,20);
  assert.equal(await page.locator('#background-music').evaluate(el=>el.paused),true,'intentional pause survives mouse movement');
  await page.locator('#audio-hide').click();
  await page.locator('#effects-open').click();await page.locator('#effects-toggle').click();await page.locator('#effects-hide').click();
  const soundCount=await page.evaluate(()=>window.qaAudio.filter(src=>/menu[1-4]\.wav/.test(src)).length);
  await page.locator('#select-pieces').click();await page.locator('#appearance-close').click();
  assert.equal(await page.evaluate(()=>window.qaAudio.filter(src=>/menu[1-4]\.wav/.test(src)).length),soundCount,'FX mute is independent');
  await page.locator('#effects-open').click();await page.locator('#effects-toggle').click();
  await page.locator('#effects-volume').evaluate(el=>{el.value='22';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.locator('#effects-hide').click();
  await page.screenshot({path:path.join(output,'menu-main.png')});
  await page.locator('#select-pieces').click();
  await page.locator('[data-role="r"]').click();
  await page.waitForFunction(()=>document.querySelector('#appearance-status').dataset.state==='ready');
  await page.locator('#preview-rotate').click();
  await page.locator('[data-palette="1"]').click();
  await page.locator('#appearance-save').click();
  await page.locator('#select-pieces').click();
  await page.waitForFunction(()=>document.querySelector('#appearance-status').dataset.state==='ready');
  await page.screenshot({path:path.join(output,'models-front.png')});
  const canvas=await page.locator('#piece-preview canvas').boundingBox();
  await page.mouse.move(canvas.x+40,canvas.y+canvas.height*.6);
  await page.mouse.down();
  await page.mouse.move(canvas.x+40+canvas.height*.45,canvas.y+canvas.height*.6,{steps:24});
  await page.mouse.up();
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.screenshot({path:path.join(output,'models-back.png')});
  await page.locator('[data-role="k"]').click();
  await page.locator('[data-character="ramza"]').click();
  await page.locator('[data-palette="0"]').click();
  await page.waitForFunction(()=>document.querySelector('#appearance-status').dataset.state==='ready');
  await page.mouse.move(canvas.x+40,canvas.y+canvas.height*.6);
  await page.mouse.down();await page.mouse.move(canvas.x+40+canvas.height*.25,canvas.y+canvas.height*.6,{steps:20});await page.mouse.up();
  await page.screenshot({path:path.join(output,'ramza-blue-profile.png')});
  assert.ok(await page.evaluate(()=>['menu1','menu2','menu3','menu4'].every(name=>window.qaAudio.some(src=>src.includes(`${name}.wav`)))),'selector uses its own four menu sounds');
  assert.equal(await page.evaluate(()=>window.qaAudio.some(src=>src.includes('sound1.wav'))),false,'old UI cue must not play in selector');
  assert.deepEqual(errors,[]);
  await page.locator('#appearance-close').click();
  await page.locator('#select-pieces').click();
  await page.keyboard.press('Escape');
  await page.locator('#piece-selector').waitFor({state:'hidden'});
  assert.equal(await page.locator('#select-pieces').evaluate(el=>el===document.activeElement),true,'close restores keyboard focus');
  console.log('OK: front/back orbit, idle animation, menu audio and Escape/focus');
  await page.close();
}
async function specialMoves(browser, width, height) {
  const cases = [
    { name:'capturas', black:['d7d5','d8d5'], white:['e2e4','e4d5'], pieces:30, squares:{d5:'Reina'} },
    { name:'enroque', black:['e7e5','b8c6','f8c5','g8f6'], white:['e2e4','g1f3','f1c4','e1g1'], pieces:32, squares:{g1:'Rey',f1:'Torre'} },
    { name:'al-paso', black:['a7a6','d7d5','c7c6'], white:['e2e4','e4e5','e5d6'], pieces:31, squares:{d6:'Peón'}, empty:['d5'] },
    { name:'promocion', black:['h7h5','h5h4','h4h3','h3g2','b8c6'], white:['a2a4','a4a5','a5a6','a6b7','b7a8'], pieces:29, squares:{a8:'Reina'}, promote:true },
    { name:'jaque-mate', black:['e7e5','d8h4'], white:['f2f3','g2g4'], pieces:32, mate:true },
  ];
  for (const fixture of cases) {
    const page = await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    // Only the opponent's choice is scripted; the actual app validates and
    // applies every move, renders all pieces and runs its own review controls.
    await page.route(/\/assets\/ai-worker-[^/]+\.js$/,route=>route.fulfill({contentType:'text/javascript',body:
      `const moves=${JSON.stringify(fixture.black)};let cursor=0;self.onmessage=({data})=>{if(data.type==='choose-move')self.postMessage({type:'move',requestId:data.requestId,move:moves[cursor++%moves.length]});};`}));
    await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`);
    await page.waitForFunction(()=>window.fctReview);
    await page.locator('#new-game').tap();
    await page.waitForFunction(()=>document.querySelector('.app-shell').classList.contains('is-playing')&&!document.querySelector('#battle-curtain').classList.contains('is-revealing'));
    await page.locator('[data-view="2d"]').tap();
    for (let i=0;i<fixture.white.length;i++) {
      const move=fixture.white[i];
      await page.locator(`[data-square="${move.slice(0,2)}"]`).tap();
      await page.locator(`[data-square="${move.slice(2,4)}"]`).tap();
      if(fixture.promote&&i===fixture.white.length-1) await page.locator('#promotion-dialog [value="q"]').tap();
      await page.waitForFunction(count=>document.querySelector('#review-position').textContent.includes(`${count} de ${count}`),(i+1)*2);
    }
    assert.equal(await page.locator('#board-2d .piece-token').count(),fixture.pieces);
    for(const [square,role] of Object.entries(fixture.squares||{})) assert.ok((await page.locator(`[data-square="${square}"]`).getAttribute('aria-label')).includes(role));
    for(const square of fixture.empty||[]) assert.equal(await page.locator(`[data-square="${square}"] .piece-token`).count(),0);
    if(fixture.mate) {
      await page.locator('#checkmate-overlay').waitFor({state:'visible'});
      await page.locator('#review-match').tap();
    }
    await page.locator('#review-first').tap();
    assert.equal(await page.locator('#board-2d .piece-token').count(),32);
    await page.locator('#review-last').tap();
    assert.equal(await page.locator('#board-2d .piece-token').count(),fixture.pieces);
    await page.locator('[data-view="3d"]').tap();
    await page.locator('#review-pause-note').waitFor({state:'visible'});
    await page.screenshot({path:path.join(output,`${fixture.name}-${width}x${height}.png`)});
    await page.locator('#review-return').tap();
    if(fixture.mate) {
      await page.locator('#checkmate-overlay').waitFor({state:'visible'});
      await page.locator('#play-again').tap();
      await page.waitForFunction(()=>document.querySelector('#review-position').textContent.includes('0/0'));
      await page.locator('#review-pause-note').waitFor({state:'hidden'});
    }
    if(fixture.name==='capturas') {
      await page.locator('#review-previous').tap();
      await page.locator('#return-to-menu').tap();
      await page.locator('#exit-confirmation [value="exit"]').tap();
      await page.waitForFunction(()=>!document.querySelector('.app-shell').classList.contains('is-playing'));
      await page.locator('#new-game').tap();
      await page.waitForFunction(()=>document.querySelector('#review-position').textContent.includes('0/0'));
      await page.locator('#review-pause-note').waitFor({state:'hidden'});
      assert.equal(await page.locator('.app-shell').evaluate(el=>el.classList.contains('is-reviewing')),false);
    }
    assert.deepEqual(errors,[]);
    console.log(`OK ${width}x${height}: ${fixture.name}, review/replay and 3D`);
    await page.close();
  }
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-unsafe-swiftshader'] });
    await inspectViewer(browser);
    if(process.env.FCT_QA_VIEWER_ONLY) return;
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 568], [844, 390]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width <= 844, hasTouch: width <= 844 });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`);
      await page.waitForFunction(() => window.fctReview);
      await page.locator('#select-pieces').click();
      await page.waitForFunction(() => document.querySelector('#appearance-status').dataset.state === 'ready');
      const selector = page.locator('#piece-selector');
      assert.equal(await selector.evaluate(el => el.scrollWidth > el.clientWidth),false,'selector horizontal overflow');
      if (width === 1440) {
        let variants = 0;
        for(const [role,count] of [['p',2],['r',2],['n',2],['b',6],['q',2],['k',2]]) {
          await page.locator(`[data-role="${role}"]`).click();
          const characters = await page.locator('[data-character]').evaluateAll(items => items.map(item => item.dataset.character));
          assert.equal(characters.length,count,'role must only expose allowed character families');
          for (const character of characters) {
            await page.locator(`[data-character="${character}"]`).click();
            const palettes = await page.locator('[data-palette]').evaluateAll(items => items.map(item => item.dataset.palette));
            for (const palette of palettes) {
              await page.locator(`[data-palette="${palette}"]`).click();
              await page.waitForFunction(() => document.querySelector('#appearance-status').dataset.state === 'ready');
              assert.equal(await page.locator('#preview-rival-name').count(),0,'rival preview is not shown');
              assert.equal((await page.locator(`[data-palette="${palette}"]`).textContent()).trim(),'');
              variants++;
            }
          }
        }
        assert.equal(variants,70);
        console.log('OK: all 70 player palettes, including Delita/Teta, restricted roles and single preview');
      }
      await page.locator('[data-role="r"]').click();
      await page.locator('[data-character="knight-male"]').click();
      await page.locator('[data-palette="2"]').click();
      await page.waitForFunction(() => document.querySelector('#appearance-status').dataset.state === 'ready');
      await page.locator('#piece-preview').scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(output,`selector-${width}x${height}.png`)});
      await page.locator('#appearance-save').click();
      await page.locator('#select-pieces').click();
      assert.equal(await page.locator('[data-character="knight-male"]').getAttribute('aria-pressed'),'true');
      await page.locator('[data-character="knight-female"]').click();
      await page.locator('#appearance-close').click();
      await page.locator('#select-pieces').click();
      assert.equal(await page.locator('[data-character="knight-male"]').getAttribute('aria-pressed'),'true','exit must discard draft');
      await page.locator('#appearance-close').click();
      await page.reload();
      await page.waitForFunction(() => window.fctReview);
      await page.locator('#select-pieces').click();
      assert.equal(await page.locator('[data-character="knight-female"]').getAttribute('aria-pressed'),'true','reload resets session appearance');
      await page.locator('[data-character="knight-male"]').click();
      await page.locator('#appearance-save').click();
      await page.locator('#select-pieces').click();
      await page.locator('[data-role="k"]').click();await page.locator('[data-character="delita"]').click();await page.locator('[data-palette="1"]').click();
      await page.locator('[data-role="q"]').click();await page.locator('[data-character="teta"]').click();await page.locator('[data-palette="2"]').click();
      await page.locator('#appearance-save').click();
      await page.locator('#new-game').click();
      await page.locator('#board-3d canvas').waitFor();
      await page.waitForFunction(() => !document.querySelector('#battle-curtain').classList.contains('is-revealing') && document.querySelector('.app-shell').classList.contains('is-playing'));
      await page.locator('[data-view="2d"]').click();
      assert.ok((await page.locator('[data-square="a1"]').getAttribute('aria-label')).includes('Caballero'));
      assert.ok((await page.locator('[data-square="e1"]').getAttribute('aria-label')).includes('Delita'));
      assert.ok((await page.locator('[data-square="d1"]').getAttribute('aria-label')).includes('Teta'));
      for(const square of ['a1','a8','e2','e7']) {
        const cell=await page.locator(`[data-square="${square}"]`).boundingBox();
        const art=await page.locator(`[data-square="${square}"] .piece-art`).boundingBox();
        assert.ok(art.x>=cell.x&&art.y>=cell.y&&art.x+art.width<=cell.x+cell.width+0.5&&art.y+art.height<=cell.y+cell.height+0.5,'PNG fits inside square');
      }
      assert.equal(await page.locator('.piece-role').count(),0,'no role badges below pieces');
      await page.screenshot({path:path.join(output,`board2d-${width}x${height}.png`)});
      if(width===1440) {
        const image=await page.locator('[data-square="e2"] .piece-art').getAttribute('src');
        const from=await page.locator('[data-square="e2"]').boundingBox(),to=await page.locator('[data-square="e4"]').boundingBox();
        await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();
        await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:12});
        assert.equal(await page.locator('.piece-drag-image').getAttribute('src'),image);
        assert.ok((await page.locator('[data-square="e4"]').getAttribute('style')).includes('--drag-shadow-image'));
        await page.screenshot({path:path.join(output,'board2d-drag.png')});
        await page.mouse.up();
      }else{
        await page.locator('[data-square="e2"]').tap(); await page.locator('[data-square="e4"]').tap();
      }
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
      await page.locator('#audio-reopen').click();
      const audioBox=await page.locator('#audio-control').boundingBox();
      assert.ok(audioBox.x>=0&&audioBox.x+audioBox.width<=width&&audioBox.y+audioBox.height<=height,'music panel fits viewport');
      await page.screenshot({path:path.join(output,`audio-${width}x${height}.png`)});
      await page.locator('#audio-hide').click();
      if(width===1440){
        const canvas=await page.locator('#board-3d canvas').boundingBox();
        await page.mouse.move(canvas.x+80,canvas.y+canvas.height*.24);await page.mouse.down();
        await page.mouse.move(canvas.x+80+canvas.height*.32,canvas.y+canvas.height*.24,{steps:30});await page.mouse.up();
        await page.screenshot({path:path.join(output,'cosmos-orbit.png')});
      }
      await page.locator('#review-return').click();
      await page.locator('#review-pause-note').waitFor({ state: 'hidden' });
      console.log(`OK ${width}x${height}: actual move/review/resume, no HUD overlap or runtime errors`);
      await page.close();
    }
    await specialMoves(browser,390,844);
    await specialMoves(browser,844,390);
    console.log(`Screenshots: ${output}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
