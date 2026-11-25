const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const url=process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4250/pages/paula/';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];
 const watch=page=>page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:844}});watch(page);
   await page.goto(url,{waitUntil:'domcontentloaded'});
   const box=await page.locator('#paca-intro svg').boundingBox();
   if(box){assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=844);}
   await page.locator('#paca-intro').waitFor({state:'detached',timeout:3200});
   await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('#paca-intro').count(),0);
   await page.close();
  }
  const slow=await browser.newPage();watch(slow);
  await slow.route('**/assets/hero-nails.webp',async route=>{await new Promise(resolve=>setTimeout(resolve,5000));await route.continue().catch(()=>{});});
  await slow.goto(url,{waitUntil:'domcontentloaded'});
  await slow.locator('#paca-intro').waitFor({state:'detached',timeout:3200});
  assert.ok(await slow.evaluate(()=>performance.now()<3800),'Intro remains capped on slow image');
  await slow.close();
  const hidden=await browser.newPage();watch(hidden);await hidden.goto(url,{waitUntil:'domcontentloaded'});
  await hidden.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await hidden.locator('#paca-intro').count(),0);assert.equal(await hidden.locator('[data-motion-running=true]').count(),0);await hidden.close();
  const reduced=await browser.newPage({reducedMotion:'reduce'});watch(reduced);await reduced.goto(url);
  assert.equal(await reduced.locator('#paca-intro').count(),0);assert.equal(await reduced.locator('.hero-liquid,.artist-animation-controls').count(),0);
  await reduced.locator('#paula').scrollIntoViewIfNeeded();assert.equal(await reduced.locator('.artist-portrait').evaluate(el=>getComputedStyle(el).transform),'none');await reduced.close();
  const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(url);
  assert.ok(await noJS.locator('#paca-intro').isHidden());assert.equal(await noJS.locator('.service').count(),4);
  await noJS.locator('.service summary').first().click();assert.ok(await noJS.locator('.service-body').first().isVisible());await noJS.close();
  const noGL=await browser.newPage();watch(noGL);await noGL.addInitScript(()=>{sessionStorage.setItem('paca-intro-seen','1');const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};});
  await noGL.goto(url);await noGL.locator('#catalogo').scrollIntoViewIfNeeded();
  await noGL.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='fallback');
  await noGL.locator('.work-open').first().click();assert.ok(await noGL.locator('#work-dialog').isHidden());await noGL.close();
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:3});
  const touch=await context.newPage();watch(touch);await touch.addInitScript(()=>sessionStorage.setItem('paca-intro-seen','1'));await touch.goto(url);
  await touch.locator('#catalogo').scrollIntoViewIfNeeded();await touch.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');await touch.locator('.catalog-stream').scrollIntoViewIfNeeded();
  const client=await context.newCDPSession(touch);
  async function swipe(selector){
   const r=await touch.locator(selector).boundingBox(),y=Math.min(600,Math.max(220,r.y+r.height*.35)),x=r.x+r.width*.8;
   await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let i=1;i<=8;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*26,y}]});
   await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }
  await swipe('.catalog-stream');await touch.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.index)>0);
  await touch.locator('.service.is-active').scrollIntoViewIfNeeded();await swipe('.service-list');
  await touch.waitForFunction(()=>document.querySelector('#servicios').dataset.serviceIndex==='1');
  await touch.waitForFunction(()=>document.querySelector('#servicios').dataset.transitioning==='false');
  await touch.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
  assert.equal(await touch.locator('.catalog-stream,.poster-controls,.portrait-light').count(),0);
  await touch.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  assert.equal(await touch.locator('.poster-controls').count(),1);assert.equal(await touch.locator('.portrait-light').count(),1);
  await context.close();assert.deepEqual(errors,[]);
  console.log('OK: loader centering/session/3s/hidden/reduced, no-JS, WebGL fallback, horizontal touch swipes and lifecycle cleanup.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
