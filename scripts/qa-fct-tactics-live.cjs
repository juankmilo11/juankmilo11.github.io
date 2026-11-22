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
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
 try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.tactics-mode-link').click();await page.locator('#mode-dialog[open]').waitFor();await page.locator('#start-match').click();assert.equal(await page.locator('#board-2d .tactical-token').count(),16);
  assert.equal(await page.locator('#privacy-curtain,[name="opponent"]').count(),0);await page.locator('[data-command="roll"]').click();
  await page.waitForFunction(()=>!document.querySelector('#planning-panel').hidden||!!document.querySelector('[data-command="choose-first"]:not(:disabled)'));
  if(await page.locator('[data-command="choose-first"]:not(:disabled)').count())await page.locator('[data-command="choose-first"]').click();await page.locator('#planning-panel:not([hidden])').waitFor();
  await page.locator('#unit-roster [data-unit="w-p1"]').click();await page.locator('[data-action="focus"]').click();
  await page.locator('#unit-roster [data-unit="w-n"]').click();await page.locator('[data-action="move"]').click();await page.locator('.tactical-cell.is-target:not(:has(.tactical-token))').first().click();await page.locator('[data-facing="N"]').click();await page.locator('#add-order').click();
  await page.waitForFunction(()=>document.querySelector('#round-counter').textContent==='Ronda 2'&&!document.querySelector('#planning-panel').hidden);
  await page.locator('[data-view="3d"]').click();await page.locator('#board-3d canvas').waitFor();await page.waitForTimeout(1200);await page.screenshot({path:path.join(output,'tactical-3d.png')});assert.deepEqual(errors,[]);console.log('LIVE VERIFIED: matching tactical build; classic entry, automatic armies, dice, per-order planning, automatic battle/next round and 3D.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
