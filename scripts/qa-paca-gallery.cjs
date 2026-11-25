const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const url=process.env.PACA_DEPLOYMENT_URL||'http://127.0.0.1:4250/pages/paula/';
const output=path.resolve('dist/qa-studio');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error'&&/WebGLProgram|Shader Error|GL_INVALID/.test(message.text()))errors.push(message.text());});
  await page.goto(url);await page.locator('#paca-intro').waitFor({state:'detached'});
  await page.locator('.masthead nav a[href="#paula"]').click();
  await page.waitForFunction(()=>{const portrait=document.querySelector('.artist-portrait'),img=portrait.querySelector('img'),r=img.getBoundingClientRect();return img.naturalWidth>0&&r.width>200&&r.top<innerHeight&&r.bottom>140&&getComputedStyle(portrait).clipPath==='none';});
  assert.ok(await page.locator('.artist-portrait img').evaluate(img=>img.naturalWidth>0&&img.getBoundingClientRect().width>200));
  await page.screenshot({path:path.join(output,'portrait-desktop-fresh.png')});
  await page.locator('.masthead nav a[href="#catalogo"]').click();await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='ready');
  const stream=page.locator('.catalog-stream');await stream.scrollIntoViewIfNeeded();await stream.focus();
  await stream.press('Home');await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)===0);
  const initial=await stream.getAttribute('data-index');await stream.press('Enter');await stream.click();assert.equal(await stream.getAttribute('data-index'),initial);
  await stream.hover();await page.mouse.wheel(0,300);
  await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)>0);
  await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)===1&&document.querySelector('#catalogo').dataset.motionRunning==='false');
  assert.equal(await stream.getAttribute('data-speed'),'0.000000');
  const box=await stream.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height*.68);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+box.height*.30,{steps:12});await page.mouse.up();
  await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)===2);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.locator('[data-motion-running="true"]').count(),0);
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.mouse.move(5,450);const y=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,200);await page.waitForFunction(before=>scrollY!==before,y);
  await page.locator('.masthead nav a[href="#paula"]').click();await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.motionRunning==='false');
  await page.locator('.masthead nav a[href="#catalogo"]').click();await stream.scrollIntoViewIfNeeded();await stream.focus();
  await page.emulateMedia({reducedMotion:'reduce'});await stream.press('ArrowDown');
  await page.waitForFunction(()=>Number(document.querySelector('.catalog-stream').dataset.phase)===3);
  assert.equal(await stream.getAttribute('data-speed'),'0.000000');assert.ok(await stream.isVisible());
  const entries=await page.evaluate(()=>window.PacaCatalog.entries);
  await stream.press('Home');
  for(let index=0;index<entries.length;index++){
    assert.equal(await stream.locator('[role="img"]').getAttribute('aria-label'),entries[index].alt);
    if(index<entries.length-1)await stream.press('ArrowDown');
  }
  assert.equal(await stream.getAttribute('data-index'),'34');await stream.press('ArrowDown');assert.equal(await stream.getAttribute('data-index'),'0','Wrap preserves all 35 entries');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>document.querySelector('.catalog-stream canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.querySelector('#catalogo').dataset.galleryState==='fallback');assert.equal(await page.locator('.catalog-fallback img').count(),35);
  assert.deepEqual(errors,[]);console.log('OK: desktop portrait without preference toggles; vertical wheel/drag, exact rest, click/Enter inert, hidden/offscreen pause, page scroll, reduced navigation through all 35 alts and context-loss fallback.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
