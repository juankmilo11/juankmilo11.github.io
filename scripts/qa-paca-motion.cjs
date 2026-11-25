// Read-only browser QA: never submits appointments or changes production data.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const output=path.join(require('node:os').tmpdir(),'paca-motion-qa');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:process.env.PACA_BROWSER_CHANNEL||'msedge',headless:true});
 try{
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:960}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4173/pages/paula/');
   await page.locator('.work-card').first().waitFor({state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,nav:[...document.querySelectorAll('.masthead nav a,.masthead button,.masthead .nav-book')].map(el=>({text:el.textContent.trim(),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,display:getComputedStyle(el).display}))}));
   assert.ok(layout.scroll<=width+1,JSON.stringify(layout));
   for(const item of layout.nav){assert.notEqual(item.display,'none',item.text);assert.ok(item.h>=44&&item.w>=44,JSON.stringify(item));}
   await page.screenshot({path:path.join(output,`hero-${width}.png`)});
   await page.waitForFunction(()=>!document.querySelector('#hero-title').classList.contains('is-stippling'));
   assert.match(await page.locator('#hero-title').innerText(),/THE ART/);
   await page.locator('[data-hero="tattoo"]').click();
   await page.waitForFunction(()=>document.querySelector('#hero-image').src.includes('hero-tattoo'));
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.ok(await page.locator('.hero-liquid').isHidden());
   assert.equal(await page.locator('.hero-title-live').evaluate(el=>getComputedStyle(el).opacity),'1');
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('.masthead nav a[href="#catalogo"]').click();
   await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
   const stream=page.locator('.catalog-stream');await stream.focus();
   await stream.press('ArrowDown');await page.waitForFunction(()=>document.querySelector('.catalog-stream').dataset.index==='1');
   await stream.press('Enter');await stream.click();assert.equal(await page.locator('#work-dialog').isVisible(),false);
   await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.motionRunning==='false');
   await page.screenshot({path:path.join(output,`catalog-${width}.png`)});
   for(const category of ['nails','tattoo','pmu','beauty','all']){
    await page.locator(`[data-filter="${category}"]`).click();
    assert.match(await page.locator('.stream-controls span').innerText(),/\/ [1-9]/);
   }
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='static');
   assert.ok(await page.locator('#catalog-grid').isVisible());
   await page.locator('.work-open').first().click();assert.equal(await page.locator('#work-dialog').isVisible(),false);
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('.masthead nav a[href="#servicios"]').click();
   await page.waitForFunction(()=>document.querySelector('.masthead nav a[href="#servicios"]').getAttribute('aria-current')==='location');
   await page.locator('.services-fan').scrollIntoViewIfNeeded();
   assert.equal(await page.locator('.services-fan svg').count(),6);
   await page.waitForFunction(()=>document.querySelector('.services-fan').dataset.motionRunning==='false');
   const fanBefore=await page.locator('.services-fan').getAttribute('data-progress');
   await page.evaluate(()=>scrollBy({top:180,behavior:'instant'}));
   await page.waitForFunction(before=>Number(document.querySelector('.services-fan').dataset.progress)>Number(before),fanBefore);
   await page.screenshot({path:path.join(output,`services-${width}.png`)});
   await page.evaluate(()=>scrollBy({top:-180,behavior:'instant'}));
   await page.waitForFunction(()=>document.querySelector('.services-fan').dataset.motionRunning==='false');
   await page.locator('.masthead nav a[href="#paula"]').click();
   await page.waitForFunction(()=>document.querySelector('#paula').dataset.motionRunning==='true');
   await page.locator('.artist-animation-controls button').first().click();
   await page.waitForFunction(()=>document.querySelector('#paula').dataset.motionRunning==='false');
   assert.equal(await page.locator('.artist-name-live').evaluate(el=>getComputedStyle(el).opacity),'1');
   await page.screenshot({path:path.join(output,`artist-${width}.png`)});
   await page.locator('.artist-animation-controls button').last().click();
   await page.waitForFunction(()=>document.querySelector('#paula').dataset.namePhase==='draw');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await page.locator('.artist-name-live').evaluate(el=>getComputedStyle(el).opacity),'1');
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('.nav-book').click();assert.ok(await page.locator('#booking-dialog').isVisible());
   await page.locator('#booking-window-close').click();
   assert.deepEqual(errors,[]);
   console.log(`PACA ${width}px: layout, touch targets, active navigation, booking OK`);
   await page.close();
  }
  console.log('Screenshots: '+output);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
