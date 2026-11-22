// Read-only public smoke test, using normal UI and the deployed production files.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),origin='https://juankmilo11.github.io/FCT/',normalize=s=>s.replace(/\r/g,'');
const output=process.env.FCT_QA_OUTPUT||path.join(root,'dist/tactics-live');
(async()=>{
 const html=normalize(fs.readFileSync(path.join(root,'FCT/tactics.html'),'utf8'));let ready=false;
 for(let i=0;i<30;i++){const r=await fetch(origin+'tactics.html?verify='+Date.now(),{signal:AbortSignal.timeout(15000)});if(r.ok&&normalize(await r.text())===html){ready=true;break;}await new Promise(r=>setTimeout(r,5000));}
 assert.ok(ready,'public tactical page matches the local production build');
 for(const m of html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))(?:[^"\s]*)"/g)){
  const url=new URL(m[1],origin),r=await fetch(url,{signal:AbortSignal.timeout(15000)});assert.equal(r.status,200);assert.equal(normalize(await r.text()),normalize(fs.readFileSync(path.join(root,url.pathname.replace(/^\//,'')),'utf8')));
 }
 for(const file of ['index.html','script.js','styles.css']){const r=await fetch(new URL('../'+file,origin),{signal:AbortSignal.timeout(15000)});assert.equal(r.status,200);assert.equal(normalize(await r.text()),normalize(fs.readFileSync(path.join(root,file),'utf8')),`public ${file} matches local`);}
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
 try{const home=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await home.goto(new URL('../',origin).href,{waitUntil:'domcontentloaded'});await home.waitForFunction(()=>!document.querySelector('.enlaces').hasAttribute('inert'));await home.locator('.enlace[href="/FCT/"]').click();const win=home.locator('.ventana-fct');await win.frameLocator('iframe').locator('.tactics-mode-link').click();await win.frameLocator('iframe').locator('#board-3d canvas').waitFor();await home.screenshot({path:path.join(output,'jk-fct-window.png')});const opening=home.context().waitForEvent('page');await win.locator('.abrir-pestana').click();const page=await opening,errors=[];page.on('pageerror',e=>errors.push(e.message));await page.waitForLoadState('domcontentloaded');assert.ok(page.url().endsWith('/FCT/tactics.html'));await page.locator('#board-3d canvas').waitFor();assert.equal(await page.locator('[data-view="3d"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#mode-dialog,#planning-panel button,#queue-panel button').count(),0);assert.equal(await page.locator('#board-2d .tactical-token').count(),16);await page.locator('[data-view="2d"]').click();
  assert.equal(await page.locator('#privacy-curtain,[name="opponent"]').count(),0);await page.locator('[data-command="roll"]').click();
  await page.waitForFunction(()=>!document.querySelector('#planning-panel').hidden||!!document.querySelector('[data-command="choose-first"]:not(:disabled)'));
  if(await page.locator('[data-command="choose-first"]:not(:disabled)').count())await page.locator('[data-command="choose-first"]').click();await page.locator('#planning-panel:not([hidden])').waitFor();
  await page.locator('#unit-roster [data-unit="w-p1"]').click();await page.locator('[data-field-action="focus"]').click();
  await page.locator('#unit-roster [data-unit="w-n"]').click();await page.locator('.tactical-cell.is-target:not(:has(.tactical-token))').first().click();await page.locator('[data-field-choice="move"]').click();await page.locator('[data-field-facing="N"]').click();
  await page.waitForFunction(()=>document.querySelector('#round-counter').textContent==='Ronda 2'&&!document.querySelector('#planning-panel').hidden);
  await page.locator('[data-view="3d"]').click();await page.locator('#board-3d canvas').waitFor();await page.waitForTimeout(1200);await page.screenshot({path:path.join(output,'tactical-3d.png')});assert.deepEqual(errors,[]);console.log('LIVE VERIFIED: matching homepage/build; embedded FCT/new tab, direct 3D, automatic armies, dice, field orders/facing and automatic battle/next round.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
