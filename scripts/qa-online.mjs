// True client/Worker integration using durable local SQLite and an R2 adapter.
// All records and credentials are generated for this isolated test only.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { existsSync, statSync, createReadStream, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker, { passwordHash } from '../projects/services-api/worker/index.js';
import { D1Database, R2Bucket } from '../projects/services-api/tests/adapter.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const standalone = Boolean(process.env.PACA_QA_ROOT);
const root = process.env.PACA_QA_ROOT || fileURLToPath(new URL('../', import.meta.url));
const output = mkdtempSync(path.join(tmpdir(), 'paca-online-qa-'));
const filename = path.join(output, 'appointments.sqlite');
function submissionForm(payload) {
  const form = new FormData();
  form.set('payload', JSON.stringify(payload));
  form.set('inspirationPhoto', new Blob([new Uint8Array([255,216,255,1,2,3])], {type:'image/jpeg'}), 'design.jpg');
  return form;
}
const password = 'QA-only-' + crypto.randomUUID();
const env = { DB: new D1Database(filename), BUCKET: new R2Bucket(), ADMIN_PASSWORD_HASH: await passwordHash(password), RATE_LIMIT_SECRET: crypto.randomUUID() };
let origin;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, origin);
    if (url.pathname.startsWith('/api/')) {
      const options = { method: req.method, headers: req.headers };
      if (!['GET', 'HEAD'].includes(req.method)) { options.body = Readable.toWeb(req); options.duplex = 'half'; }
      const response = await worker.fetch(new Request(url, options), env);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) Readable.fromWeb(response.body).pipe(res); else res.end();
      return;
    }
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || relative.split(path.sep).some(part => part.startsWith('.')) || relative.startsWith('projects' + path.sep)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404).end(); return; }
    if (url.pathname === '/shared/api-config.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end('window.ProjectAPIConfig = Object.freeze({baseURL:' + JSON.stringify(origin) + '});');
      return;
    }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    createReadStream(file).pipe(res);
  } catch (error) { res.writeHead(500, { 'Content-Type': 'text/plain' }).end('QA bridge failed'); console.error(error); }
});
let browser;
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = 'http://127.0.0.1:' + server.address().port;
  env.ALLOWED_ORIGINS = origin;
  browser = await chromium.launch({ channel: process.env.PACA_BROWSER_CHANNEL || 'msedge', headless: true });
  const visitor = await browser.newPage({ viewport: { width: 1180, height: 820 } });
  const errors = [];
  visitor.on('pageerror', error => errors.push(error.message));
  const paca = origin + (standalone ? '/' : '/pages/paula/');
  await visitor.goto(paca);
  await visitor.locator('.nav-book').click();
  const form = visitor.locator('#booking-form');
  await form.locator('[name="name"]').fill('Online QA Visitor');
  await form.locator('[name="whatsapp"]').fill('202 555 0123');
  await form.locator('[name="instagram"]').fill('@online_qa');
  await form.locator('[name="service"]').selectOption('beauty');
  await form.locator('[name="message"]').fill('Synthetic integration test.');
  await form.locator('[name="inspirationPhoto"]').setInputFiles({ name: 'qa-reference.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1cAAAAASUVORK5CYII=', 'base64') });
  await visitor.locator('#calendar-open').click();
  await visitor.locator('#booking-agenda[aria-busy="false"]').waitFor();
  const days = visitor.locator('.calendar-days button:not(:disabled)');
  let slot = false;
  for (let index = 0; index < await days.count(); index++) {
    await days.nth(index).click();
    const times = visitor.locator('.time-slot:not(:disabled)');
    if (await times.count() > 2) { await times.first().click(); slot = true; break; }
  }
  assert.ok(slot);
  await visitor.locator('#calendar-apply').click();
  const date = await form.locator('[name="date"]').inputValue(), time = await form.locator('[name="time"]').inputValue();
  for (const name of ['punctuality', 'cancellation', 'policy', 'consent']) await form.locator('[name="' + name + '"]').check();
  const design = await form.locator('[name="inspirationPhoto"]').inputValue();
  assert.ok(design);
  await visitor.locator('#booking-submit').click();
  await visitor.locator('#booking-review').waitFor();
  const posted = visitor.waitForResponse(response => response.url() === origin + '/api/appointments' && response.request().method() === 'POST');
  await visitor.locator('#booking-send').click();
  const response = await posted;
  assert.equal(response.status(), 201, 'The actual Worker accepted the multipart request');
  const receipt = await response.json();
  await visitor.locator('#booking-success').waitFor();
  assert.ok((await visitor.locator('#booking-receipt').innerText()).includes(receipt.id));
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS total FROM appointments').first()).total, 1);
  assert.equal(env.BUCKET.objects.size, 1);

  // Restart the database connection: the record is not browser memory or a Map.
  env.DB.close(); env.DB = new D1Database(filename, { migrate: false });
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS total FROM appointments').first()).total, 1);
  assert.equal((await fetch(origin + '/api/admin/appointments')).status, 401);
  async function login() {
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + (standalone ? '/admin/' : '/pages/admin/'));
    await page.locator('#login-password').fill(password);
    const response = page.waitForResponse(response => response.url() === origin + '/api/admin/login');
    await page.locator('#login-form [type="submit"]').click();
    assert.equal((await response).status(), 200);
    const authentication = await (await response).json();
    await page.locator('#dashboard').waitFor();
    await page.locator('.appointment-action').first().waitFor();
    return { page, token: authentication.token };
  }
  const a = await login(), b = await login();
  assert.match(await a.page.locator('#appointments').innerText(), /Online QA Visitor/);
  assert.match(await a.page.locator('#appointments').innerText(), /\d{2}:\d{2} (AM|PM)/);
  // The template flow uses the real Worker/D1, including another device/session.
  await a.page.locator('#templates-tab').click();
  await a.page.locator('.template-card').first().waitFor();
  assert.ok(await a.page.locator('.template-card').count() >= 6);
  await a.page.locator('#template-add').click();
  await a.page.locator('#template-title').fill('QA template');
  await a.page.locator('#template-body').fill('Hello {nombre}\nPrivate test message');
  await a.page.locator('#template-form [type="submit"]').click();
  await a.page.locator('#template-dialog').waitFor({state:'hidden'});
  const card = a.page.locator('.template-card').filter({has:a.page.getByRole('heading',{name:'QA template',exact:true})});
  await card.waitFor();
  await a.page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await card.getByRole('button',{name:'Copiar',exact:true}).click();
  assert.equal((await a.page.evaluate(()=>navigator.clipboard.readText())).replaceAll('\r\n','\n'),'Hello {nombre}\nPrivate test message');
  await b.page.locator('#templates-tab').click();
  await b.page.getByRole('heading',{name:'QA template',exact:true}).waitFor();
  await card.getByRole('button',{name:'Editar',exact:true}).click();
  await a.page.locator('#template-body').fill('Edited from session A');
  await a.page.locator('#template-form [type="submit"]').click();
  await a.page.locator('#template-dialog').waitFor({state:'hidden'});
  const stale = b.page.locator('.template-card').filter({has:b.page.getByRole('heading',{name:'QA template',exact:true})});
  await stale.getByRole('button',{name:'Editar',exact:true}).click();
  await b.page.locator('#template-body').fill('Stale overwrite');
  await b.page.locator('#template-form [type="submit"]').click();
  await b.page.locator('#template-edit-status[data-kind="error"]').waitFor();
  assert.equal(await b.page.locator('#template-dialog').isVisible(),true);
  await b.page.keyboard.press('Escape');
  await b.page.locator('#refresh').click();
  await b.page.waitForFunction(()=>document.querySelectorAll('.template-card textarea').length && [...document.querySelectorAll('.template-card textarea')].some(node=>node.value==='Edited from session A'));
  await a.page.setViewportSize({width:390,height:844});
  await a.page.screenshot({path:path.join(output,'templates-mobile.png'),fullPage:true});
  assert.equal(await a.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await a.page.setViewportSize({width:1180,height:820});
  await a.page.screenshot({path:path.join(output,'templates-desktop.png'),fullPage:true});
  await card.getByRole('button',{name:'Eliminar',exact:true}).click();
  await a.page.locator('#template-delete-form [type="submit"]').click();
  await a.page.locator('#template-delete-dialog').waitFor({state:'hidden'});
  await card.waitFor({state:'detached'});
  for (const instance of [a,b]) await instance.page.locator('#requests-tab').click();
  for (const instance of [a, b]) {
    await instance.page.locator('.appointment-action').first().click();
    await instance.page.locator('#edit-dialog').waitFor();
  }
  assert.equal(await a.page.locator('#attachments button').count(), 1);
  await a.page.locator('#attachments button').first().click();
  await a.page.locator('#private-photo').waitFor();
  assert.ok(await a.page.locator('#private-photo').evaluate(element => element.complete && element.naturalWidth > 0));
  await a.page.keyboard.press('Escape');
  const edit = a.page.locator('#edit-form');
  await edit.locator('[name="name"]').fill('Online QA Edited');
  await edit.locator('[name="status"]').selectOption('confirmed');
  await edit.locator('[name="durationMinutes"]').fill('60');
  await edit.locator('[name="notes"]').fill('Confirmed through the real ADMIN UI.');
  const patched = a.page.waitForResponse(response => response.url().includes('/api/admin/appointments/') && response.request().method() === 'PATCH');
  await edit.locator('[type="submit"]').click();
  assert.equal((await patched).status(), 200);
  await a.page.locator('#edit-dialog').waitFor({ state: 'hidden' });
  await b.page.locator('#edit-form [name="notes"]').fill('This stale edit must not overwrite the saved update.');
  const conflicted = b.page.waitForResponse(response => response.request().method() === 'PATCH');
  await b.page.locator('#edit-form [type="submit"]').click();
  assert.equal((await conflicted).status(), 409);
  assert.match(await b.page.locator('#edit-status').innerText(), /Otro administrador|cambió|Actualiza/);
  const saved = await env.DB.prepare('SELECT name,notes,version,status FROM appointments WHERE id=?').bind(receipt.id).first();
  assert.equal(saved.name, 'Online QA Edited'); assert.equal(saved.status, 'confirmed'); assert.equal(saved.version, 2);
  assert.equal(saved.notes, 'Confirmed through the real ADMIN UI.');
  const availability = await (await fetch(origin + '/api/availability')).json();
  assert.ok(availability.blocked.some(block => block.date === date && block.start === time));
  assert.ok(!JSON.stringify(availability).includes('Online QA'), 'Public availability contains no customer names');
  const overlapPayload = { name: 'QA Overlap', whatsapp: '+12025550124', instagram: '', service: 'beauty', date, time, nailType: '', removal: '', removalConsent: false, punctuality: true, cancellation: true, policy: true, consent: true, message: '', language: 'en', reference: null };
  const duplicate = await fetch(origin + '/api/appointments', { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: submissionForm(overlapPayload) });
  assert.equal(duplicate.status, 409, 'Server rejects an appointment overlapping a confirmed slot');
  await a.page.locator('.appointment-action').first().click();
  await a.page.locator('#delete-open').click();
  const deleted = a.page.waitForResponse(response => response.request().method() === 'DELETE');
  await a.page.locator('#delete-form [type="submit"]').click();
  assert.equal((await deleted).status(), 200);
  await a.page.locator('#delete-dialog').waitFor({ state: 'hidden' });
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS total FROM appointments').first()).total, 0);
  assert.equal((await env.DB.prepare('SELECT COUNT(*) AS total FROM attachments').first()).total, 0);
  assert.equal(env.BUCKET.objects.size, 0, 'Deleting also removes the private photo');
  const activityDate=new Date(date+'T12:00:00Z');activityDate.setUTCDate(activityDate.getUTCDate()+7);const eventDate=activityDate.toISOString().slice(0,10);
  for(const [index,state] of ['confirmed','pending','completed','cancelled'].entries()){
    const body={...overlapPayload,date:eventDate,time:['08:00','10:00','13:00','16:00'][index],name:'Agenda QA '+state,whatsapp:'+1202555022'+index};
    const created=await fetch(origin+'/api/appointments',{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:submissionForm(body)});assert.equal(created.status,201);const record=await created.json();
    if(state!=='pending')assert.equal((await fetch(origin+'/api/admin/appointments/'+record.id,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({version:1,status:state,durationMinutes:60})})).status,200);
  }
  await a.page.locator('#schedule-tab').click();
  await a.page.locator('#schedule-form:not([aria-busy])').waitFor();
  assert.equal(await a.page.locator('#dashboard .topbar h1').innerText(),'ADMIN');
  const originalHorizon=await a.page.locator('#schedule-horizon').inputValue();
  const originalMinimum=await a.page.locator('[data-estimate="fullSet"][data-part="minMinutes"]').inputValue();
  await a.page.locator('#schedule-horizon').fill('999');
  await a.page.locator('[data-estimate="fullSet"][data-part="minMinutes"]').fill('999');
  await a.page.locator('#schedule-closed').fill('invalid date');
  await a.page.locator('#schedule-cancel').click();
  assert.equal(await a.page.locator('#schedule-horizon').inputValue(),originalHorizon);
  assert.equal(await a.page.locator('[data-estimate="fullSet"][data-part="minMinutes"]').inputValue(),originalMinimum);
  assert.equal(await a.page.locator('#schedule-closed').inputValue(),'');
  await a.page.locator('[data-estimate="fullSet"][data-part="minMinutes"]').fill('75');
  await a.page.locator('[data-estimate="fullSet"][data-part="maxMinutes"]').fill('135');
  await a.page.locator('[data-estimate="fullSet"][data-part="minPrice"]').fill('45');
  await a.page.locator('[data-estimate="fullSet"][data-part="maxPrice"]').fill('85');
  await a.page.locator('#schedule-closed').fill(date+'\n'+eventDate);
  await a.page.locator('#schedule-blocked').fill(eventDate+' 11:30-12:30');
  await a.page.locator('#schedule-preview').click();
  await a.page.locator('#schedule-preview-dialog[open]:not([aria-busy])').waitFor();
  for(let i=0;i<12&&!(await a.page.locator(`#preview-days button[aria-label^="${eventDate}"]`).count());i++){await a.page.locator('#preview-next').click();await a.page.locator('#schedule-preview-dialog:not([aria-busy])').waitFor();}
  const eventDay=a.page.locator(`#preview-days button[aria-label^="${eventDate}"]`);
  assert.equal(await eventDay.isDisabled(),false,'Closed days remain inspectable');
  assert.match(await eventDay.innerText(),/4 citas/);assert.equal(await eventDay.locator('.event-dot').count(),4);
  await eventDay.click();assert.equal(await a.page.locator('.preview-event').count(),5,'Every appointment status plus the manual block is visible');
  assert.match(await a.page.locator('#preview-events').innerText(),/Cancelada · No bloquea horarios/);
  assert.match(await a.page.locator('#preview-events').innerText(),/Día cerrado/);
  assert.equal(await a.page.locator('[data-preview-service]:checked').count(),8);
  await a.page.locator('[data-preview-service][value="tattoo"]').uncheck();
  assert.equal(await a.page.locator('[data-preview-service]:checked').count(),7);
  await a.page.locator('#preview-select-none').click();
  assert.equal(await a.page.locator('[data-preview-service]:checked').count(),0);
  assert.match(await a.page.locator('#preview-status').innerText(),/Selecciona al menos/);
  assert.equal(await a.page.locator('.preview-event').count(),5,'Service comparison does not hide appointments or manual blocks');
  await a.page.locator('#preview-select-all').click();
  await a.page.locator('#preview-days button:not(.is-unavailable)').first().click();
  assert.equal(await a.page.locator('.preview-service-times').count(),8);
  await a.page.locator('[data-preview-service][value="tattoo"]').uncheck();
  assert.equal(await a.page.locator('.preview-service-times').count(),7);
  await a.page.locator('#preview-select-all').click();
  await eventDay.click();
  assert.equal((await (await fetch(origin+'/api/availability')).json()).closedDates.includes(date),false,'Preview does not save draft closure');
  await a.page.screenshot({path:path.join(output,'agenda-preview.png')});
  for(const width of [768,375,320]){
    await a.page.setViewportSize({width,height:820});
    assert.ok(await a.page.locator('#schedule-preview-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Agenda fits '+width);
  }
  await a.page.locator('#schedule-preview-dialog').evaluate(el=>el.scrollTop=0);
  await a.page.screenshot({path:path.join(output,'agenda-mobile.png')});
  await a.page.locator('[data-close="schedule-preview-dialog"]').click();
  for(const width of [1180,768,375,320]){
    await a.page.setViewportSize({width,height:820});
    assert.ok(await a.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Range editor fits '+width);
  }
  await a.page.screenshot({path:path.join(output,'availability-mobile.png')});
  await a.page.locator('#schedule-form [type="submit"]').click();
  await a.page.getByText('Disponibilidad guardada. Las nuevas visitas usarán estos horarios.',{exact:true}).waitFor();
  await a.page.locator('[data-estimate="fullSet"][data-part="maxMinutes"]').fill('999');
  await a.page.locator('#schedule-cancel').click();
  assert.equal(await a.page.locator('[data-estimate="fullSet"][data-part="maxMinutes"]').inputValue(),'135','Cancel uses the latest successful save');
  const updated=(await (await fetch(origin+'/api/availability')).json());assert.ok(updated.closedDates.includes(date));assert.equal(updated.estimates.fullSet.maxMinutes,135);
  assert.equal((await fetch(origin+'/api/appointments',{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:submissionForm(overlapPayload)})).status,409,'Saved closure rejects real submissions');
  const catalog=await browser.newPage();await catalog.goto(paca);
  await catalog.locator('.work-card .service-estimate').first().waitFor({state:'attached'});
  assert.match(await catalog.locator('.work-card .service-estimate').first().innerText(),/USD/);
  await catalog.locator('.nav-book').click();await catalog.locator('#booking-form [name="service"]').selectOption('nails');
  await catalog.locator('#booking-form [name="nailType"]').selectOption('fullSet');await catalog.locator('#booking-form [name="removal"]').selectOption('no');
  assert.match(await catalog.locator('#booking-estimate').innerText(),/75–135 min · USD \$45–\$85/);
  await a.page.locator('#logout').click();
  await a.page.locator('#access').waitFor();
  assert.equal(await a.page.locator('#preview-events').innerText(),'','Session end clears agenda names');
  assert.equal((await fetch(origin + '/api/admin/appointments', { headers: { Authorization: 'Bearer ' + a.token } })).status, 401);
  assert.deepEqual(errors, []);
  console.log('OK: real browser/Worker/SQLite/R2 flow: multipart save, restart persistence, two ADMIN sessions, private photo, edit, version conflict, blocked availability, deletion and logout.');
  console.log('Isolated test database: ' + filename);
} finally {
  await browser?.close();
  env.DB.close();
  server.close();
}
