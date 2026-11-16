// Run with Playwright installed, or set PLAYWRIGHT_MODULE_PATH to its module.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = process.env.PACA_QA_OUTPUT || path.join(os.tmpdir(), 'paca-qa');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.gif': 'image/gif', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || relative.split(path.sep).some(part => part.startsWith('.')) || relative.startsWith('projects' + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function closeBooking(page) {
  await page.locator('#booking-window-close').click();
  await page.locator('#booking-dialog').waitFor({ state: 'hidden' });
}
async function checkLayout(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Page fits viewport');
  assert.ok(await page.locator('#booking-dialog').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth + 1), 'Booking has no horizontal overflow');
  const close = await page.locator('#booking-window-close').boundingBox();
  assert.ok(close && close.y >= 0 && close.y + close.height <= page.viewportSize().height, 'Close button stays in view');
}
async function settleAnimations(page, selector) {
  await page.locator(selector).evaluate(async element => {
    await Promise.all(element.getAnimations({ subtree: true })
      .filter(animation => animation.effect.getTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})));
  });
}


(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: process.env.PACA_BROWSER_CHANNEL || 'msedge', headless: true });
    const url = 'http://127.0.0.1:' + server.address().port + '/pages/paula/';
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
    const errors=[];
    page.on('pageerror', error=>errors.push(error.message));
    const schedule=JSON.parse(fs.readFileSync(path.join(root,'pages/paula/assets/availability.json'),'utf8'));
    // This is a browser contract test. Production persistence is tested separately
    // against the actual server, never replaced by this fixture in shipped code.
    const fixture='window.__bookingCalls=[];window.__availabilityCalls=0;window.__availabilityDelay=0;window.ProjectAPI={availability:async()=>{window.__availabilityCalls++;if(window.__availabilityDelay)await new Promise(resolve=>setTimeout(resolve,window.__availabilityDelay));return '+JSON.stringify(schedule)+'},createAppointment:async(payload,options)=>{window.__bookingCalls.push({payload,key:options.idempotencyKey,photos:Object.fromEntries(Object.entries(options.files).map(([key,file])=>[key,file?{name:file.name,type:file.type,size:file.size}:null]))});if(window.__bookingCalls.length===1)throw new Error("uncertain network response");return {id:"PACA-QA-RECEIPT",status:"pending",createdAt:new Date().toISOString()}}};';
    await page.route('**/shared/api.js*',route=>route.fulfill({contentType:'text/javascript',body:fixture}));
    await page.route('**/shared/api-config.js*',route=>route.fulfill({contentType:'text/javascript',body:'/* Browser QA configuration */'}));
    await page.goto(url);
    await page.locator('.work-card').first().waitFor();
    assert.equal(await page.locator('.service[open]').count(),0);
    assert.equal(await page.locator('.hero-tabs small').count(),0);
    assert.equal(await page.locator('#motion-toggle,#catalog-search,#total-count,.service-number,#booking-copy,#booking-instagram').count(),0);
    assert.equal(await page.locator('main #agendar').count(),0);
    for(const category of ['all','nails','tattoo','pmu','beauty']){
      const filter=page.locator('[data-filter="'+category+'"]');assert.doesNotMatch(await filter.innerText(),/\d/);await filter.click();assert.ok(await page.locator('.work-card').count()>0);
    }
    await page.locator('[data-filter="all"]').click();
    const originalCard=await page.locator('.work-card').first().elementHandle();
    await page.locator('#catalog-more').click();
    assert.equal(await page.locator('.work-card').count(),18);
    assert.ok(await originalCard.evaluate(card=>card===document.querySelector('.work-card')));
    await page.locator('.nav-book').click();
    await page.locator('#booking-dialog').waitFor();
    const form=page.locator('#booking-form');
    assert.equal(await page.locator('.booking-policy').getAttribute('open'),null);
    assert.equal(await form.locator('[name="whatsapp"]').evaluate(element=>element.required),true);
    assert.equal(await form.locator('[name="instagram"]').evaluate(element=>element.required),false);
    assert.equal(await page.locator('#calendar-dialog').isVisible(),false);
    assert.equal(await page.evaluate(()=>window.__availabilityCalls),1,'Catalog loads current estimates before opening the calendar');
    await form.locator('[name="name"]').fill('Ana Test');
    assert.equal(await form.locator('[name="countryCode"]').inputValue(),'+1');
    assert.deepEqual(await form.locator('[name="countryCode"] option').evaluateAll(options=>options.map(option=>option.value)),['+1','+57']);
    await form.locator('[name="countryCode"]').selectOption('+57');
    await form.locator('[name="whatsapp"]').fill('300 123 4567');
    await form.locator('[name="message"]').fill('Azul y flores.');
    await form.locator('[name="service"]').selectOption('beauty');
    async function selectSlot(){
      await page.locator('#calendar-open').click();
      await page.locator('#calendar-dialog').waitFor();
      await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
      const days=page.locator('.calendar-days button:not(:disabled)');
      for(let index=0;index<await days.count();index++){
        await days.nth(index).click();const times=page.locator('.time-slot:not(:disabled)');
        if(await times.count()){await times.first().click();return;}
      }
      throw new Error('No available future date in QA schedule');
    }
    await selectSlot();
    await page.keyboard.press('Escape');
    await page.locator('#calendar-dialog').waitFor({state:'hidden'});
    await page.waitForFunction(()=>document.querySelector('#booking-form [name="date"]').value==='');
    assert.equal(await page.locator('#booking-dialog').isVisible(),true,'Escape closes only calendar');
    assert.equal(await form.locator('[name="date"]').inputValue(),'','Cancel restores original selection');
    await selectSlot();await page.locator('#calendar-apply').click();
    await page.locator('#calendar-dialog').waitFor({state:'hidden'});
    assert.match(await page.locator('#calendar-selection').innerText(),/New Jersey/);
    const originalDate=await form.locator('[name="date"]').inputValue();
    await page.locator('#calendar-open').click();await page.locator('#calendar-cancel').click();
    assert.equal(await form.locator('[name="date"]').inputValue(),originalDate);
    for(const name of ['punctuality','cancellation','policy','consent'])await form.locator('[name="'+name+'"]').check();
    await form.locator('[name="currentPhoto"]').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1cAAAAASUVORK5CYII=','base64')});
    await page.locator('#booking-submit').click();
    await page.locator('#booking-review').waitFor();
    assert.match(await page.locator('#booking-summary').innerText(),/\+573001234567/);
    assert.equal(await page.evaluate(()=>window.__bookingCalls.length),0,'Review does not transmit data');
    await page.locator('#booking-send').click();
    await page.waitForFunction(()=>window.__bookingCalls.length===1);
    assert.equal(await page.locator('#booking-success').isVisible(),false,'Uncertain response cannot claim success');
    await page.locator('#booking-send').click();
    await page.locator('#booking-success').waitFor();
    assert.match(await page.locator('#booking-receipt').innerText(),/PACA-QA-RECEIPT/);
    const writes=await page.evaluate(()=>window.__bookingCalls);
    assert.equal(writes.length,2);
    assert.equal(writes[0].key,writes[1].key,'Retry uses the same idempotency key');
    assert.equal(writes[1].payload.whatsapp,'+573001234567');
    assert.equal(writes[1].payload.instagram,'');
    assert.equal(writes[1].photos.currentPhoto.name,'test.png');
    assert.equal('currentPhoto' in writes[1].payload,false,'Attachments are Files, not fake saved filenames');
    assert.equal(await page.locator('#booking-exit').innerText(),'Exit');
    await page.locator('#booking-exit').click();
    await page.locator('#booking-dialog').waitFor({state:'hidden'});
    await page.locator('.nav-book').click();
    assert.equal(await page.locator('#booking-success').isVisible(),false,'Reopening a completed request starts fresh');
    for(const name of ['name','whatsapp','instagram','message','date','time'])assert.equal(await form.locator('[name="'+name+'"]').inputValue(),'');
    assert.equal(await form.locator('[name="countryCode"]').inputValue(),'+1');
    assert.equal(await form.locator('[name="currentPhoto"]').evaluate(input=>input.files.length),0);
    for(const name of ['punctuality','cancellation','policy','consent'])assert.equal(await form.locator('[name="'+name+'"]').isChecked(),false);
    await form.locator('[name="name"]').fill('Second Visitor');
    await form.locator('[name="whatsapp"]').fill('2015550123');
    await form.locator('[name="service"]').selectOption('beauty');
    const reads=await page.evaluate(()=>window.__availabilityCalls);
    await selectSlot();await page.locator('#calendar-apply').click();
    assert.ok(await page.evaluate(()=>window.__availabilityCalls)>reads,'New calendar selection refreshes availability');
    await page.evaluate(()=>window.__availabilityDelay=500);
    await page.locator('#calendar-open').click();
    assert.equal(await page.locator('#calendar-apply').isDisabled(),true,'Cannot apply stale availability while reloading');
    assert.equal(await page.locator('.calendar-days button:not([disabled])').count(),0,'Stale dates are disabled during refresh');
    await page.locator('#booking-agenda[aria-busy="false"]').waitFor();
    await page.locator('#calendar-apply').click();await page.evaluate(()=>window.__availabilityDelay=0);
    for(const name of ['punctuality','cancellation','policy','consent'])await form.locator('[name="'+name+'"]').check();
    await page.locator('#booking-submit').click();await page.locator('#booking-review').waitFor();
    await page.locator('#booking-send').click();await page.locator('#booking-success').waitFor();
    const next=await page.evaluate(()=>window.__bookingCalls[2]);
    assert.notEqual(next.key,writes[1].key,'Another completed request uses a fresh idempotency key');
    assert.equal(next.payload.whatsapp,'+12015550123');
    assert.equal(next.payload.name,'Second Visitor');
    await closeBooking(page);
    await page.locator('[data-language="es"]').click();
    await page.locator('#theme-toggle').click();
    await page.locator('.floating-book').click();
    assert.equal(await page.locator('#booking-window-title').innerText(),'Solicitar una cita');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    await page.locator('#calendar-open').click();
    assert.equal(await page.locator('#calendar-window-title').innerText(),'Elegir fecha y hora');
    await page.locator('#calendar-cancel').click();await closeBooking(page);
    await page.locator('[data-language="en"]').click();await page.locator('#theme-toggle').click();
    for(const [width,height] of [[1180,820],[768,1024],[375,812],[812,375],[320,640]]){
      await page.setViewportSize({width,height});await page.locator('.nav-book').click();await checkLayout(page);await settleAnimations(page,'#booking-dialog');
      await page.screenshot({path:path.join(output,'booking-'+width+'x'+height+'.png')});
      if(width<=375){
        await form.locator('[name="whatsapp"]').fill('2015550123');
        await form.locator('[name="whatsapp"]').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(output,'phone-'+width+'x'+height+'.png')});
      }
      await page.locator('#calendar-open').click();await settleAnimations(page,'#calendar-dialog');
      assert.ok(await page.locator('#calendar-dialog').evaluate(element=>element.scrollWidth<=element.clientWidth+1));
      await page.screenshot({path:path.join(output,'calendar-'+width+'x'+height+'.png')});
      await page.locator('#calendar-cancel').click();await closeBooking(page);
    }
    assert.deepEqual(errors,[]);
    console.log('OK: required WhatsApp, optional Instagram, collapsed policies, separate calendar, cancel/apply/Escape, private file contract, review, uncertain save, idempotent retry, receipt, EN/ES, theme and five viewports.');
    console.log('Screenshots: '+output);
  }finally{await browser?.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
