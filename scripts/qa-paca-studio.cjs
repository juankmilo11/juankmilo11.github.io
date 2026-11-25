// Browser-only QA; no real appointment writes.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url=process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4250/pages/paula/';
const output=path.resolve('dist/qa-studio');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];
 try{
  const intro=await browser.newPage({viewport:{width:390,height:844}});intro.on('pageerror',e=>errors.push(e.message));
  await intro.goto(url,{waitUntil:'domcontentloaded'});
  await intro.screenshot({path:path.join(output,'loader-390.png')});
  await intro.locator('#paca-intro').waitFor({state:'detached',timeout:3200});
  await intro.reload({waitUntil:'domcontentloaded'});assert.equal(await intro.locator('#paca-intro').count(),1,'Reload shows the logo again');await intro.close();
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:960}});page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>sessionStorage.setItem('paca-intro-seen','1'));
   await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   await page.locator('#paca-intro').waitFor({state:'detached',timeout:3200});
   if(width>768){await page.waitForFunction(()=>document.querySelector('#inicio').dataset.titleReveal==='running');await page.screenshot({path:path.join(output,`hero-stipple-${width}.png`)});}
   await page.waitForFunction(()=>document.querySelector('#inicio').dataset.titleReveal==='complete');
   const ribbon=await page.locator('#inicio').getAttribute('data-ribbon-offset');
   await page.waitForFunction(value=>document.querySelector('#inicio').dataset.ribbonOffset!==value,ribbon);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No overflow '+width);
   assert.equal(await page.locator('.artist-animation-controls').count(),0);
   assert.equal(await page.locator('#servicios .services-fan').count(),0);
   assert.equal(await page.locator('.footer-wordmark .services-fan svg').count(),6);
   await page.screenshot({path:path.join(output,`hero-${width}.png`)});
   const metrics=await page.locator('#inicio').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight,viewport:el.querySelector('.hero-scene').offsetHeight}));
   assert.ok(Math.abs(metrics.height/metrics.viewport-2.6)<.02);
   await page.evaluate(({top,height,viewport})=>scrollTo({top:top+height-viewport,behavior:'instant'}),metrics);
   await page.waitForFunction(()=>Number(document.querySelector('#inicio').dataset.progress)>.999);
   await page.evaluate(({top})=>scrollTo({top,behavior:'instant'}),metrics);
   await page.waitForFunction(()=>Number(document.querySelector('#inicio').dataset.progress)<.001);
   await page.locator('.circle-link').click();
   await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
   await page.locator('.catalog-stream').scrollIntoViewIfNeeded();
   const stream=page.locator('.catalog-stream');await stream.focus();await stream.press('ArrowDown');
   await page.waitForFunction(()=>document.querySelector('.catalog-stream').dataset.index==='1');
   await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)===1&&document.querySelector('#catalogo').dataset.motionRunning==='false');
   await page.screenshot({path:path.join(output,`catalog-${width}.png`)});
   assert.equal(await page.locator('.stream-controls').count(),0);
   const before=await stream.getAttribute('data-index');await stream.press('Enter');await stream.click();assert.equal(await stream.getAttribute('data-index'),before);assert.ok(await page.locator('#work-dialog').isHidden());
   await page.locator('.masthead nav a[href="#servicios"]').click();
   await page.locator('.service.is-active').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(output,`service-${width}.png`)});
   await page.locator('.poster-controls>button').last().click();
   assert.ok(await page.locator('.service.is-active').evaluate(el=>el.getBoundingClientRect().top>=el.parentElement.getBoundingClientRect().bottom-1),'Incoming poster stays below stage during first phase');
   await page.waitForFunction(()=>document.querySelector('#servicios').dataset.transitioning==='false');
   assert.equal(await page.locator('#servicios').getAttribute('data-service-index'),'1');
   await page.locator('.poster-controls>button').last().click();await page.locator('.poster-controls>button').last().click();
   await page.waitForFunction(()=>document.querySelector('#servicios').dataset.transitioning==='false');
   assert.equal(await page.locator('#servicios').getAttribute('data-service-index'),'3');
   await page.emulateMedia({reducedMotion:'reduce'});
   for(let index=0;index<4;index++){
    await page.locator('.poster-dots button').nth(index).click();
    const slide=page.locator('.service.is-active');
    assert.equal(await page.locator('.service[aria-hidden="false"]').count(),1);
    assert.ok(await slide.evaluate(el=>el.scrollHeight<=el.parentElement.clientHeight+1),'Poster contains all text');
    await slide.locator('[data-book]').click();await page.locator('#booking-dialog').waitFor();
    assert.equal(await page.locator('#booking-form [name="service"]').inputValue(),['nails','tattoo','pmu','beauty'][index]);
    await page.locator('#booking-window-close').click();await page.locator('#booking-dialog').waitFor({state:'hidden'});
   }
   await page.locator('[data-language="es"]').click();await page.locator('#theme-toggle').click();
   await page.locator('.service.is-active').scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.screenshot({path:path.join(output,`service-es-night-${width}.png`)});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('[data-language="en"]').click();await page.locator('#theme-toggle').click();await page.emulateMedia({reducedMotion:'no-preference'});
   await page.locator('.artist-portrait').scrollIntoViewIfNeeded();
   assert.ok(await page.locator('#booking-dialog').isHidden());
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.artist-portrait')).clipPath==='none');
   const transform=await page.locator('.artist-portrait').getAttribute('style');
   await page.screenshot({path:path.join(output,`artist-${width}.png`)});
   await page.waitForFunction(before=>document.querySelector('.artist-portrait').getAttribute('style')!==before,transform);
   await page.locator('.paca-story').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(output,`footer-${width}.png`)});
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.artist-portrait').evaluate(el=>getComputedStyle(el).transform),'none');
   await page.close();console.log('OK '+width+'px: automatic ribbon, title reveal, vertical gallery, posters, booking service, EN/ES, night, visible portrait and footer.');
  }
  assert.deepEqual(errors,[]);console.log('Screenshots: '+output);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
