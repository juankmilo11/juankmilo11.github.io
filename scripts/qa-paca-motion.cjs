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
   await page.locator('.work-card').first().waitFor();
   await page.evaluate(()=>document.fonts.ready);
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,nav:[...document.querySelectorAll('.masthead nav a,.masthead button,.masthead .nav-book')].map(el=>({text:el.textContent.trim(),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height,display:getComputedStyle(el).display}))}));
   assert.ok(layout.scroll<=width+1,JSON.stringify(layout));
   for(const item of layout.nav){assert.notEqual(item.display,'none',item.text);assert.ok(item.h>=44&&item.w>=44,JSON.stringify(item));}
   await page.screenshot({path:path.join(output,`hero-${width}.png`)});
   await page.locator('.masthead nav a[href="#servicios"]').click();
   await page.waitForFunction(()=>document.querySelector('.masthead nav a[href="#servicios"]').getAttribute('aria-current')==='location');
   await page.locator('.nav-book').click();assert.ok(await page.locator('#booking-dialog').isVisible());
   await page.locator('#booking-window-close').click();
   assert.deepEqual(errors,[]);
   console.log(`PACA ${width}px: layout, touch targets, active navigation, booking OK`);
   await page.close();
  }
  console.log('Screenshots: '+output);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
