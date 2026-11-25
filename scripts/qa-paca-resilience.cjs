const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const url=process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4173/pages/paula/';
const output=path.join(require('node:os').tmpdir(),'paca-motion-qa');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const errors=[];
 const track=page=>page.on('pageerror',error=>errors.push(error.message));
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}});track(page);
  await page.goto(url);await page.locator('.work-card').first().waitFor({state:'attached'});
  assert.ok(await page.evaluate(async()=>{
   const data=await(await fetch('assets/catalog.json')).json();
   const checks=await Promise.all(data.entries.map(entry=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=entry.src;})));
   return checks.length===35&&checks.every(Boolean);
  }),'All 35 real catalog assets load');
  await page.locator('.catalog-stream').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
  const stream=page.locator('.catalog-stream');await stream.focus();await stream.press('ArrowDown');
  await page.waitForFunction(()=>document.querySelector('.catalog-stream').dataset.index==='1');
  await stream.hover();await page.mouse.wheel(0,400);
  await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.index)>1);
  await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.motionRunning==='false');
  const before=Number(await stream.getAttribute('data-index')),box=await stream.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height*.65);await page.mouse.down();
  await page.mouse.move(box.x+box.width/2,box.y+box.height*.3,{steps:12});await page.mouse.up();
  await page.waitForFunction(index=>Number(document.querySelector('.catalog-stream').dataset.index)>index,before);
  await page.evaluate(()=>{
   Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await page.locator('[data-motion-running="true"]').count(),0,'No animation clock in hidden document');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  assert.equal(await page.locator('.hero-liquid,.catalog-stream,.services-fan,.artist-name-drawing').count(),0,'Unmount removes canvases, SVGs and observers');
  await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  await page.locator('.catalog-stream').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
  assert.equal(await page.locator('.hero-title-live').count(),1,'Back-forward restore mounts once');
  await page.evaluate(()=>document.querySelector('.catalog-stream canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='fallback');
  assert.ok(await page.locator('#catalog-grid').isVisible());
  await page.locator('.work-open').first().press('Enter');assert.ok(await page.locator('#work-dialog').isHidden());
  await page.close();
  console.log('OK: 35 assets, wheel/drag/snap, hidden-tab pause, GPU/context-loss fallback and back-forward lifecycle.');

  const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:3});
  const touch=await touchContext.newPage();track(touch);await touch.goto(url);
  await touch.locator('.catalog-stream').scrollIntoViewIfNeeded();
  await touch.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
  assert.ok(await touch.locator('.catalog-stream canvas').evaluate(el=>el.width<=el.clientWidth*1.5+1),'Gallery DPR cap 1.5');
  assert.ok(await touch.locator('.hero-liquid').evaluate(el=>el.width<=el.clientWidth+1),'Hero DPR cap 1');
  const client=await touchContext.newCDPSession(touch),touchBox=await touch.locator('.catalog-stream').boundingBox();
  const x=touchBox.x+touchBox.width/2,y=touchBox.y+touchBox.height*.67;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*25}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await touch.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.index)>0);
  await touch.screenshot({path:path.join(output,'touch-gallery.png')});
  await touchContext.close();console.log('OK: touch swipe and DPR caps on a 390px touch device.');

  for(const width of [390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});
   const fallback=await context.newPage();track(fallback);let threeLoaded=false;
   fallback.on('request',request=>{if(request.url().includes('vendor/three'))threeLoaded=true;});
   await fallback.goto(url);await fallback.locator('.work-card').first().waitFor({state:'attached'});
   await fallback.locator('#paula').scrollIntoViewIfNeeded();
   assert.ok(await fallback.locator('.hero-liquid').isHidden());
   assert.equal(await fallback.locator('.hero-title-live').evaluate(el=>getComputedStyle(el).opacity),'1');
   assert.equal(await fallback.locator('.artist-name-live').evaluate(el=>getComputedStyle(el).opacity),'1');
   assert.equal(threeLoaded,false,'Reduced motion avoids loading Three.js');
   await fallback.locator('[data-language="es"]').click();await fallback.locator('#theme-toggle').click();
   await fallback.locator('.paca-story').scrollIntoViewIfNeeded();
   assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Spanish/night fits '+width);
   await fallback.screenshot({path:path.join(output,`night-es-${width}.png`)});
   await context.close();
  }
  console.log('OK: initial reduced-motion, Spanish and night theme at 390/768/1440px.');
  const noGL=await browser.newPage({viewport:{width:390,height:844}});track(noGL);
  await noGL.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args);};});
  await noGL.route('**/assets/hero-tattoo.webp',route=>route.abort());
  await noGL.goto(url);await noGL.locator('#catalogo').scrollIntoViewIfNeeded();
  await noGL.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='fallback');
  await noGL.locator('.work-open').first().click();assert.ok(await noGL.locator('#work-dialog').isHidden());
  await noGL.locator('[data-hero="tattoo"]').click();
  await noGL.locator('.asset-error').waitFor();
  assert.match(await noGL.locator('.asset-error').innerText(),/hero-tattoo\.webp/,'A failed URL is reported');
  assert.match(await noGL.locator('#hero-image').getAttribute('src'),/hero-nails/,'A failed asset is never replaced by demo content');
  await noGL.close();assert.deepEqual(errors,[]);
  console.log('OK: missing WebGL and intentionally failed asset handled without uncaught errors.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
