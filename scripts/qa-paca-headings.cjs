const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const url=process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4250/pages/paula/';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:960}});await page.goto(url);await page.evaluate(()=>document.fonts.ready);await page.locator('#paca-intro').waitFor({state:'detached'});
   for(const selector of ['#catalogo .section-heading','#servicios .section-heading','.artist-copy','.faq>div:first-child']){
    const node=page.locator(selector),box=await node.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));
    async function position(y){await page.evaluate(({top,y})=>scrollTo({top:top-y,behavior:'instant'}),{top:box.top,y});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
    await position(1060);await page.waitForFunction(sel=>!document.querySelector(sel).classList.contains('is-revealed'),selector);
    for(const edge of [940,965,930,950]){await position(edge);assert.equal(await node.evaluate(el=>el.classList.contains('is-revealed')),false,'No premature reveal: '+selector);}
    await position(960-Math.max(260,box.height*.4+64));await page.waitForFunction(sel=>document.querySelector(sel).classList.contains('is-revealed'),selector);
    await node.evaluate(el=>Promise.all(el.getAnimations().filter(animation=>animation.effect.getTiming().iterations!==Infinity).map(animation=>animation.finished.catch(()=>{}))));
    for(const edge of [940,975,930,965]){await position(edge);assert.equal(await node.evaluate(el=>el.classList.contains('is-revealed')),true,'Visible content stays revealed near edge: '+selector);}
    await position(1060);await page.waitForFunction(sel=>!document.querySelector(sel).classList.contains('is-revealed'),selector);
   }
   await page.locator('.artist-copy .text-button').focus();assert.equal(await page.locator('.artist-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
   await page.locator('#theme-toggle').focus();assert.equal(await page.locator('.artist-copy').evaluate(el=>getComputedStyle(el).animationName),'none','Keyboard focus does not restart a fade when leaving the link');
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.artist-copy').evaluate(el=>getComputedStyle(el).opacity),'1');
   await page.close();console.log('OK '+width+'px: four heading/copy groups delay entrance, remain stable during edge jitter, reset only offscreen, and stay readable with reduced motion.');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
