import INITIAL_ESTIMATES from './initial-estimates.json' with { type: 'json' };
const ZONE = 'America/New_York';
const SERVICES = new Set(['nails', 'tattoo', 'pmu', 'beauty', 'consultation']);
const STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled']);
const SESSION_MS = 60 * 60 * 1000;
const ITERATIONS = 100000;
const MAX_FILE = 8 * 1024 * 1024;
const DEFAULT_CONFIG = { version: 1, timeZone: ZONE, updatedAt: '2026-11-16', open: '07:00', close: '19:00', weekdays: [1,2,3,4,5], slotMinutes: 30, horizonDays: 60, durationMinutes: { fullSet: null, fill: null, removalOnly: null, nails: null, tattoo: null, pmu: null, beauty: null, consultation: null }, removalMinutes: null, closedDates: [], blocked: [] };
class Problem extends Error { constructor(status, code, message = code) { super(message); this.status = status; this.code = code; } }
const fail = (status, code, message) => { throw new Problem(status, code, message); };
const encode = value => new TextEncoder().encode(value);
const hex = value => [...new Uint8Array(value)].map(byte => byte.toString(16).padStart(2, '0')).join('');
const hash = async value => hex(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encode(value) : value));
const b64 = bytes => btoa(String.fromCharCode(...bytes));
const unb64 = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
const random = () => b64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
const equal = (a, b) => { let result = a.length ^ b.length; for (let index=0; index<Math.max(a.length,b.length); index++) result |= (a.charCodeAt(index)||0) ^ (b.charCodeAt(index)||0); return result === 0; };
const validPassword = password => typeof password === 'string' && password.length >= 14 && password.length <= 128;
async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256));
  return `pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(bits)}`;
}
async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || password.length > 128 || typeof stored !== 'string') return false;
  const [kind, rounds, salt, expected] = stored.split('$');
  if (kind !== 'pbkdf2-sha256' || Number(rounds) < 100000 || Number(rounds) > 600000) return false;
  try {
    const key = await crypto.subtle.importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits']);
    const actual = b64(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unb64(salt), iterations: Number(rounds), hash: 'SHA-256' }, key, 256)));
    return equal(actual, expected);
  } catch { return false; }
}
function minutes(value) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '') ? Number(value.slice(0,2))*60 + Number(value.slice(3)) : NaN; }
const timeString = value => `${String(Math.floor(value / 60)).padStart(2,'0')}:${String(value % 60).padStart(2,'0')}`;
function validDate(value) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false; const date = new Date(`${value}T12:00:00Z`); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value; }
function studioNow() { const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23' }).formatToParts(new Date()); const get = type => parts.find(part=>part.type===type).value; return { date: `${get('year')}-${get('month')}-${get('day')}`, minute: Number(get('hour'))*60+Number(get('minute')) }; }
const addDays = (date, count) => { const result = new Date(`${date}T12:00:00Z`); result.setUTCDate(result.getUTCDate()+count); return result.toISOString().slice(0,10); };
function validateEstimates(values) {
  if(!values||typeof values!=='object'||Array.isArray(values))fail(400,'invalid_estimates');
  const result={};for(const key of Object.keys(INITIAL_ESTIMATES)){
    const item=values[key];if(!item||!['minMinutes','maxMinutes','minPrice','maxPrice'].every(k=>Number.isFinite(item[k])))fail(400,'invalid_estimates');
    if(!Number.isInteger(item.minMinutes)||!Number.isInteger(item.maxMinutes)||item.minMinutes<1||item.maxMinutes>720||item.minMinutes>item.maxMinutes||item.minPrice<0||item.maxPrice>10000||item.minPrice>item.maxPrice||![item.minPrice,item.maxPrice].every(n=>Math.abs(n*100-Math.round(n*100))<1e-7))fail(400,'invalid_estimates');
    result[key]={minMinutes:item.minMinutes,maxMinutes:item.maxMinutes,minPrice:item.minPrice,maxPrice:item.maxPrice};
  }return result;
}
function validateConfig(config) {
  if (config?.version !== 1 || config.timeZone !== ZONE || config.open !== '07:00' || config.close !== '19:00' || JSON.stringify(config.weekdays) !== '[1,2,3,4,5]' || config.slotMinutes !== 30 || !Number.isInteger(config.horizonDays) || config.horizonDays < 1 || config.horizonDays > 365 || !config.durationMinutes || Array.isArray(config.durationMinutes) || !Array.isArray(config.blocked) || !Array.isArray(config.closedDates) || config.blocked.length > 3000 || config.closedDates.length > 366) fail(400,'invalid_schedule');
  const clean = structuredClone(DEFAULT_CONFIG); clean.horizonDays = config.horizonDays;
  for (const key of Object.keys(clean.durationMinutes)) { const value = config.durationMinutes[key]; if (value !== null && (!Number.isInteger(value) || value < 1 || value > 720)) fail(400,'invalid_duration'); clean.durationMinutes[key] = value; }
  if (config.removalMinutes !== null && (!Number.isInteger(config.removalMinutes) || config.removalMinutes < 1 || config.removalMinutes > 720)) fail(400,'invalid_duration');
  clean.removalMinutes = config.removalMinutes;
  clean.closedDates = [...new Set(config.closedDates)];
  if (clean.closedDates.some(date => !validDate(date))) fail(400,'invalid_closed_date');
  clean.blocked = config.blocked.map(block => { if (!validDate(block.date) || !Number.isFinite(minutes(block.start)) || !Number.isFinite(minutes(block.end)) || minutes(block.start) >= minutes(block.end)) fail(400,'invalid_block'); return { date:block.date, start:block.start, end:block.end }; });
  clean.estimates=validateEstimates(config.estimates??INITIAL_ESTIMATES); clean.currency='USD'; clean.updatedAt = new Date().toISOString(); return clean;
}
function cleanText(value, maximum, required=false) { if (typeof value !== 'string' || value.length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(400,'invalid_input'); const result=value.trim(); if(required&&!result)fail(400,'required_field'); return result; }
function validatePayload(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail(400,'invalid_input');
  const result = { name:cleanText(data.name,80,true), whatsapp:cleanText(data.whatsapp,20,true), instagram:cleanText(data.instagram ?? '',31), service:data.service, date:data.date, time:data.time, nailType:data.nailType || '', removal:data.removal || '', message:cleanText(data.message || '',700), reference:null, language: data.language==='es'?'es':'en' };
  if(result.name.length<2 || !/^\+[1-9]\d{6,14}$/.test(result.whatsapp) || (result.instagram && !/^@[A-Za-z0-9._]{1,30}$/.test(result.instagram)) || !SERVICES.has(result.service) || !validDate(result.date) || !Number.isFinite(minutes(result.time))) fail(400,'invalid_input');
  for(const key of ['punctuality','cancellation','policy','consent']) { if(data[key]!==true)fail(400,'consent_required'); result[key]=true; }
  result.removalConsent = data.removalConsent===true;
  if(result.service==='nails') { if(!['fullSet','fill','removalOnly','nails'].includes(result.nailType)||!['yes','no','unsure'].includes(result.removal))fail(400,'invalid_nail_plan'); if(result.nailType==='removalOnly'&&result.removal!=='yes')fail(400,'invalid_removal'); if(['yes','unsure'].includes(result.removal)&&!result.removalConsent)fail(400,'removal_consent_required'); }
  if(data.reference)result.reference={en:cleanText(data.reference.en,180,true),es:cleanText(data.reference.es,180,true)};
  return result;
}
function serviceDuration(config, data) { const key=data.service==='nails'?data.nailType||'nails':data.service; const base=config.durationMinutes[key]??config.estimates?.[key]?.maxMinutes; if(!base)return null; const extra=data.service==='nails'&&['yes','unsure'].includes(data.removal)&&key!=='removalOnly'; const removal=config.removalMinutes??config.estimates?.removalExtra?.maxMinutes;if(extra&&!removal)return null; return base+(extra?removal:0); }
function validateSlot(data,config,duration,allowPast=false) {
  const now=studioNow(), start=minutes(data.time), span=duration||config.slotMinutes;
  if(!allowPast && (data.date<now.date || data.date>addDays(now.date,config.horizonDays) || (data.date===now.date&&start<=now.minute))) fail(409,'slot_unavailable');
  if(!config.weekdays.includes(new Date(`${data.date}T12:00:00Z`).getUTCDay()) || config.closedDates.includes(data.date) || start<minutes(config.open) || start+span>minutes(config.close) || (start-minutes(config.open))%config.slotMinutes!==0 || config.blocked.some(block=>block.date===data.date&&start<minutes(block.end)&&start+span>minutes(block.start)))fail(409,'slot_unavailable');
}
async function schedule(env, includeConfirmed=false) {
  const row=await env.DB.prepare("SELECT config,version FROM settings WHERE id='schedule'").first();
  const config=row?JSON.parse(row.config):structuredClone(DEFAULT_CONFIG);
  if(includeConfirmed) { const now=studioNow(); const rows=await env.DB.prepare("SELECT date,time,end_minute FROM appointments WHERE status='confirmed' AND date>=? AND date<=?").bind(now.date,addDays(now.date,config.horizonDays)).all(); for(const item of rows.results) config.blocked.push({date:item.date,start:item.time,end:timeString(item.end_minute)}); }
  config.estimates=validateEstimates(config.estimates??INITIAL_ESTIMATES); config.currency='USD';
  return {config,version:row?.version||0};
}
async function rate(env, request, kind, limit, durationMs, extra='') {
  const ip=request.headers.get('CF-Connecting-IP')||request.headers.get('X-Real-IP')||'unknown';
  const now=Date.now(), bucket=Math.floor(now/durationMs); const key=await hash(`${env.RATE_LIMIT_SECRET||env.ADMIN_SETUP_TOKEN_HASH||env.ADMIN_PASSWORD_HASH||'site-rate'}|${kind}|${extra||ip}|${bucket}`);
  const row=await env.DB.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+durationMs).first();
  if(row.count>limit)fail(429,'rate_limited','Please wait before trying again.');
  await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<?').bind(now).run();
}
async function adminHash(env) { return (await env.DB.prepare('SELECT password_hash FROM administrators WHERE id=1').first())?.password_hash || env.ADMIN_PASSWORD_HASH || null; }
async function authenticate(request,env) {
  const raw=request.headers.get('Authorization')?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1]; if(!raw)fail(401,'unauthorized');
  const tokenHash=await hash(raw), password=await adminHash(env); if(!password)fail(401,'unauthorized');
  const row=await env.DB.prepare('SELECT expires_at,password_version FROM sessions WHERE token_hash=?').bind(tokenHash).first();
  if(!row || row.expires_at<=Date.now() || row.password_version!==await hash(password))fail(401,'unauthorized');
  return tokenHash;
}
async function body(request,limit=24000) {
  if(Number(request.headers.get('Content-Length')||0)>limit)fail(413,'body_too_large');
  if(!request.body)return new Uint8Array(); const reader=request.body.getReader(); const chunks=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();fail(413,'body_too_large');}chunks.push(value);}
  const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;
}
async function jsonBody(request,limit=24000){try{const data=JSON.parse(new TextDecoder().decode(await body(request,limit)));if(!data||typeof data!=='object'||Array.isArray(data))fail(400,'invalid_json');return data;}catch(error){if(error instanceof Problem)throw error;fail(400,'invalid_json');}}
async function readSubmission(request) {
  let payload,files=[];
  if(request.headers.get('Content-Type')?.startsWith('multipart/form-data')){
    const bytes=await body(request,17*1024*1024);
    let form;try{form=await new Response(bytes,{headers:{'Content-Type':request.headers.get('Content-Type')}}).formData();payload=JSON.parse(form.get('payload'));}catch{fail(400,'invalid_multipart');}
    for(const field of ['currentPhoto','inspirationPhoto']){const file=form.get(field);if(!file||typeof file==='string')continue;if(file.size>MAX_FILE||file.size===0||!['image/jpeg','image/png','image/webp'].includes(file.type))fail(400,'invalid_photo');const bytes=new Uint8Array(await file.arrayBuffer());const signature=file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:file.type==='image/png'?hex(bytes.slice(0,8))==='89504e470d0a1a0a':new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';if(!signature)fail(400,'invalid_photo');files.push({field,name:cleanText(file.name.replace(/[\\/\r\n]/g,'_'),180)||field,type:file.type,size:file.size,bytes,digest:await hash(bytes)});}
  }else payload=await jsonBody(request);
  return {payload:validatePayload(payload),files};
}
const summary = row => ({id:row.id,status:row.status,createdAt:row.created_at});
async function resolveLegacyFields(env,row,files) {
  if (!env.BUCKET || !files.length || files.length > 2 || files.every(file=>file.field)) return files;
  try {
    // Old records omitted the upload field. The original request fingerprint
    // includes each file digest and field, so recover only a unique exact match.
    // UUID order, file names and upload times are not reliable evidence.
    const digests = [];
    for (const file of files) {
      if (file.size > MAX_FILE) return files;
      const object = await env.BUCKET.get(file.object_key);
      if (!object) return files;
      const bytes = await body(new Response(object.body), MAX_FILE);
      digests.push(await hash(bytes));
    }
    const choices = files.length === 1
      ? [['currentPhoto'], ['inspirationPhoto']]
      : [['currentPhoto','inspirationPhoto'], ['inspirationPhoto','currentPhoto']];
    const matches = [];
    for (const fields of choices) {
      if (files.some((file,index)=>file.field && file.field!==fields[index])) continue;
      const fingerprintFiles = fields.map((field,index)=>({field,digest:digests[index]}))
        .sort((a,b)=>(a.field==='currentPhoto'?0:1)-(b.field==='currentPhoto'?0:1));
      const fingerprint = await hash(JSON.stringify([JSON.parse(row.payload),fingerprintFiles]));
      if (equal(fingerprint,row.request_hash)) matches.push(fields);
    }
    if (matches.length !== 1) return files;
    await env.DB.batch(files.filter(file=>!file.field).map(file=>{
      const index=files.indexOf(file);
      return env.DB.prepare('UPDATE attachments SET field=? WHERE id=? AND appointment_id=? AND field IS NULL')
        .bind(matches[0][index],file.id,row.id);
    }));
    return files.map((file,index)=>({...file,field:matches[0][index]}));
  } catch { return files; }
}
async function appointment(env,row,{resolveLegacy=false}={}) {
  const result=await env.DB.prepare('SELECT id,name,type,size,field,object_key FROM attachments WHERE appointment_id=? ORDER BY id').bind(row.id).all();
  const files=resolveLegacy?await resolveLegacyFields(env,row,result.results):result.results;
  const attachments=files.map(({id,name,type,size,field})=>({id,name,type,size,field:field||null}));
  return {...JSON.parse(row.payload),id:row.id,name:row.name,whatsapp:row.whatsapp,instagram:row.instagram,service:row.service,date:row.date,time:row.time,durationMinutes:row.duration_minutes,status:row.status,notes:row.notes,version:row.version,createdAt:row.created_at,updatedAt:row.updated_at,attachments};
}
async function submit(request,env) {
  if(!await adminHash(env))fail(503,'setup_required');
  await rate(env,request,'submit-ip',15,3600000);
  const key=request.headers.get('Idempotency-Key');if(!key||!(/^[A-Za-z0-9_-]{32,100}$/.test(key)||/^[a-f0-9-]{36}$/i.test(key)))fail(400,'idempotency_key_required');
  const {payload,files}=await readSubmission(request);
  const keyHash=await hash(key),requestHash=await hash(JSON.stringify([payload,files.map(file=>({field:file.field,digest:file.digest}))]));
  const receipt=await env.DB.prepare('SELECT request_hash,deleted FROM request_receipts WHERE key_hash=?').bind(keyHash).first();
  if(receipt){if(receipt.request_hash!==requestHash)fail(409,'idempotency_conflict');if(receipt.deleted)fail(410,'request_deleted');}
  const existing=await env.DB.prepare('SELECT id,status,created_at,request_hash FROM appointments WHERE idempotency_hash=?').bind(keyHash).first();
  if(existing){if(existing.request_hash!==requestHash)fail(409,'idempotency_conflict');return response(summary(existing));}
  await rate(env,request,'submit-phone',5,3600000,payload.whatsapp);
  const {config,version:availabilityVersion}=await schedule(env,true),duration=serviceDuration(config,payload);validateSlot(payload,config,duration);
  const id=crypto.randomUUID(),createdAt=new Date().toISOString(),stored=[];
  try{
    for(const file of files){if(!env.BUCKET)fail(503,'file_storage_unavailable');const attachmentId=crypto.randomUUID(),objectKey=`appointments/${id}/${attachmentId}`;await env.BUCKET.put(objectKey,file.bytes,{httpMetadata:{contentType:file.type}});stored.push({...file,id:attachmentId,objectKey});}
    const statements=[env.DB.prepare('INSERT INTO appointments(id,name,whatsapp,instagram,service,date,time,start_minute,end_minute,duration_minutes,payload,created_at,updated_at,idempotency_hash,request_hash,availability_version) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,payload.name,payload.whatsapp,payload.instagram,payload.service,payload.date,payload.time,minutes(payload.time),duration?minutes(payload.time)+duration:null,duration,JSON.stringify(payload),createdAt,createdAt,keyHash,requestHash,availabilityVersion)];
    statements.push(env.DB.prepare('INSERT INTO request_receipts(key_hash,request_hash,appointment_id,created_at) VALUES(?,?,?,?)').bind(keyHash,requestHash,id,createdAt));
    for(const file of stored)statements.push(env.DB.prepare('INSERT INTO attachments(id,appointment_id,object_key,name,type,size,field) VALUES(?,?,?,?,?,?,?)').bind(file.id,id,file.objectKey,file.name,file.type,file.size,file.field));
    await env.DB.batch(statements);
    return response({id,status:'pending',createdAt},201);
  }catch(error){
    for(const file of stored){try{await env.BUCKET.delete(file.objectKey);}catch{await env.DB.prepare('INSERT OR IGNORE INTO object_deletions(object_key,created_at) VALUES(?,?)').bind(file.objectKey,new Date().toISOString()).run();}}
    const duplicate=await env.DB.prepare('SELECT id,status,created_at,request_hash FROM appointments WHERE idempotency_hash=?').bind(keyHash).first();
    if(duplicate){if(duplicate.request_hash!==requestHash)fail(409,'idempotency_conflict');return response(summary(duplicate));}
    if(String(error.message).includes('slot_unavailable'))fail(409,'slot_unavailable');
    throw error;
  }
}
function response(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8'}});}
async function cleanObjects(env) {
  if(!env.BUCKET)return;
  const queue=await env.DB.prepare('SELECT object_key FROM object_deletions ORDER BY created_at LIMIT 20').all();
  for(const item of queue.results){try{await env.BUCKET.delete(item.object_key);await env.DB.prepare('DELETE FROM object_deletions WHERE object_key=?').bind(item.object_key).run();}catch{/* Retain durable outbox entry for the next authenticated request. */}}
}
async function route(request,env,url) {
  if(!env.DB)fail(503,'storage_unavailable');
  const path=url.pathname;
  if(['/', '/health', '/api/health'].includes(path)&&request.method==='GET')return response({ok:true,service:'juankmilo-apps',storage:'D1'});
  if(path==='/api/availability'&&request.method==='GET')return response((await schedule(env,true)).config);
  if(path==='/api/appointments'&&request.method==='POST')return submit(request,env);
  if(path==='/api/admin/setup'&&request.method==='POST'){
    await rate(env,request,'setup',5,900000);const data=await jsonBody(request);
    if(await adminHash(env))fail(409,'already_initialized');
    if(!env.ADMIN_SETUP_EXPIRES_AT||!Number.isFinite(Date.parse(env.ADMIN_SETUP_EXPIRES_AT))||Date.parse(env.ADMIN_SETUP_EXPIRES_AT)<=Date.now())fail(403,'activation_expired');
    if(!env.ADMIN_SETUP_TOKEN_HASH||typeof data.activationToken!=='string'||data.activationToken.length<32||data.activationToken.length>256||!equal(await hash(data.activationToken),env.ADMIN_SETUP_TOKEN_HASH))fail(403,'invalid_activation');
    if(!validPassword(data.password))fail(400,'weak_password','Use 14–128 characters.');
    const encoded=await passwordHash(data.password);
    try{await env.DB.prepare('INSERT INTO administrators(id,password_hash,updated_at) VALUES(1,?,?)').bind(encoded,new Date().toISOString()).run();}catch{fail(409,'already_initialized');}
    return response({ok:true},201);
  }
  if(path==='/api/admin/login'&&request.method==='POST'){
    await rate(env,request,'login',8,900000);const data=await jsonBody(request),stored=await adminHash(env);if(!stored)fail(503,'setup_required');
    if(!await verifyPassword(data.password,stored))fail(401,'invalid_credentials');
    const token=random(),expiresAt=Date.now()+SESSION_MS;
    await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),env.DB.prepare('INSERT INTO sessions(token_hash,expires_at,created_at,password_version) VALUES(?,?,?,?)').bind(await hash(token),expiresAt,Date.now(),await hash(stored))]);
    return response({token,expiresAt:new Date(expiresAt).toISOString()});
  }
  if(!path.startsWith('/api/admin/'))fail(404,'not_found');
  const session=await authenticate(request,env);
  await cleanObjects(env);
  if(path==='/api/admin/logout'&&request.method==='POST'){await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(session).run();return response({ok:true});}
  if(path==='/api/admin/password'&&request.method==='POST'){
    await rate(env,request,'password',5,900000);const data=await jsonBody(request),stored=await adminHash(env);if(!await verifyPassword(data.currentPassword,stored))fail(401,'invalid_credentials');if(!validPassword(data.newPassword))fail(400,'weak_password');const encoded=await passwordHash(data.newPassword);
    await env.DB.batch([env.DB.prepare('INSERT INTO administrators(id,password_hash,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash,updated_at=excluded.updated_at').bind(encoded,new Date().toISOString()),env.DB.prepare('DELETE FROM sessions')]);return response({ok:true});
  }
  if(path==='/api/admin/schedule/preview'&&request.method==='POST'){
    const data=await jsonBody(request,200000),config=validateConfig(data.config),now=studioNow();
    const rows=await env.DB.prepare("SELECT date,time,end_minute FROM appointments WHERE status='confirmed' AND date>=? AND date<=?").bind(now.date,addDays(now.date,config.horizonDays)).all();
    return response({...config,blocked:[...config.blocked,...rows.results.map(item=>({date:item.date,start:item.time,end:timeString(item.end_minute)}))]});
  }
  if(path==='/api/admin/schedule'&&request.method==='GET')return response(await schedule(env));
  if(path==='/api/admin/schedule'&&request.method==='PUT'){
    const data=await jsonBody(request,200000);if(!Number.isInteger(data.version)||data.version<0)fail(400,'version_required');const config=validateConfig(data.config);
    const saved=data.version===0
      ? await env.DB.prepare("INSERT INTO settings(id,config,version) VALUES('schedule',?,1) ON CONFLICT(id) DO NOTHING RETURNING version").bind(JSON.stringify(config)).first()
      : await env.DB.prepare("UPDATE settings SET config=?,version=version+1 WHERE id='schedule' AND version=? RETURNING version").bind(JSON.stringify(config),data.version).first();
    if(!saved)fail(409,'version_conflict');return response({config,version:saved.version});
  }
  if(path==='/api/admin/export'&&request.method==='GET'){
    const rows=await env.DB.prepare('SELECT * FROM appointments ORDER BY created_at,id').all();const items=[];for(const row of rows.results)items.push(await appointment(env,row));return response({exportedAt:new Date().toISOString(),appointments:items,schedule:await schedule(env)});
  }
  if(path==='/api/admin/appointments'&&request.method==='GET'){
    const status=url.searchParams.get('status')||'',q=(url.searchParams.get('q')||'').trim();if(status&&!STATUSES.has(status))fail(400,'invalid_status');if(q.length>100)fail(400,'invalid_query');
    const cursor=url.searchParams.get('cursor')||'',offset=cursor?Number(cursor):0;if(!Number.isInteger(offset)||offset<0||offset>1000000)fail(400,'invalid_cursor');
    const where=[],values=[];if(status){where.push('status=?');values.push(status);}if(q){where.push('(name LIKE ? ESCAPE \'\\\' OR whatsapp LIKE ? ESCAPE \'\\\' OR instagram LIKE ? ESCAPE \'\\\')');const pattern=`%${q.replace(/[\\%_]/g,'\\$&')}%`;values.push(pattern,pattern,pattern);}
    const rows=await env.DB.prepare(`SELECT * FROM appointments ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ?`).bind(...values,offset).all();const items=[];for(const row of rows.results.slice(0,50))items.push(await appointment(env,row));return response({items,nextCursor:rows.results.length>50?String(offset+50):null});
  }
  const attachmentMatch=/^\/api\/admin\/attachments\/([a-f0-9-]{36})$/.exec(path);
  if(attachmentMatch&&request.method==='GET'){
    const record=await env.DB.prepare('SELECT object_key,name,type FROM attachments WHERE id=?').bind(attachmentMatch[1]).first();if(!record)fail(404,'not_found');const object=await env.BUCKET?.get(record.object_key);if(!object)fail(404,'not_found');return new Response(object.body,{headers:{'Content-Type':record.type,'Content-Disposition':`inline; filename*=UTF-8''${encodeURIComponent(record.name)}`}});
  }
  const match=/^\/api\/admin\/appointments\/([a-f0-9-]{36})$/.exec(path);
  if(match){
    const row=await env.DB.prepare('SELECT * FROM appointments WHERE id=?').bind(match[1]).first();if(!row)fail(404,'not_found');
    if(request.method==='GET')return response(await appointment(env,row,{resolveLegacy:true}));
    if(request.method==='DELETE'){
      const version=Number(url.searchParams.get('version'));if(!Number.isInteger(version)||version<1)fail(400,'version_required');if(version!==row.version)fail(409,'version_conflict');
      const deleted=await env.DB.prepare('DELETE FROM appointments WHERE id=? AND version=? RETURNING id').bind(row.id,version).first();if(!deleted)fail(409,'version_conflict');
      await cleanObjects(env);
      const pending=await env.DB.prepare('SELECT COUNT(*) AS count FROM object_deletions').first();
      return response({ok:true,cleanupPending:pending.count>0});
    }
    if(request.method==='PATCH'){
      const patch=await jsonBody(request);if(!Number.isInteger(patch.version)||patch.version<1)fail(400,'version_required');if(patch.version!==row.version)fail(409,'version_conflict');
      const data=validatePayload({...JSON.parse(row.payload),name:row.name,whatsapp:row.whatsapp,instagram:row.instagram,service:row.service,date:row.date,time:row.time,...patch});
      const status=patch.status??row.status;if(!STATUSES.has(status))fail(400,'invalid_status');const notes=cleanText(patch.notes??row.notes,2000);
      const duration=patch.durationMinutes===undefined?row.duration_minutes:patch.durationMinutes;if(duration!==null&&(!Number.isInteger(duration)||duration<1||duration>720))fail(400,'invalid_duration');if(status==='confirmed'&&!duration)fail(400,'duration_required');
      const previous=JSON.parse(row.payload);
      const calendarChanged=data.date!==row.date||data.time!==row.time||data.service!==row.service||data.nailType!==previous.nailType||data.removal!==previous.removal||duration!==row.duration_minutes;
      if(!['cancelled','completed'].includes(status)&&(calendarChanged||(status==='confirmed'&&row.status!=='confirmed'))){const {config}=await schedule(env);validateSlot(data,config,duration);}
      try{
        const updated=await env.DB.prepare('UPDATE appointments SET name=?,whatsapp=?,instagram=?,service=?,date=?,time=?,start_minute=?,end_minute=?,duration_minutes=?,status=?,notes=?,payload=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING *').bind(data.name,data.whatsapp,data.instagram,data.service,data.date,data.time,minutes(data.time),duration?minutes(data.time)+duration:null,duration,status,notes,JSON.stringify(data),new Date().toISOString(),row.id,patch.version).first();if(!updated)fail(409,'version_conflict');return response(await appointment(env,updated));
      }catch(error){if(String(error.message).includes('appointment_overlap'))fail(409,'appointment_overlap');throw error;}
    }
  }
  fail(404,'not_found');
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url),origin=request.headers.get('Origin');
    const allowed=new Set((env.ALLOWED_ORIGINS||'https://juankmilo11.github.io').split(',').map(value=>value.trim()).filter(Boolean));allowed.add(url.origin);
    const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Vary':'Origin'};
    if(origin&&allowed.has(origin)){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Headers']='Authorization, Content-Type, Idempotency-Key';headers['Access-Control-Allow-Methods']='GET, POST, PATCH, PUT, DELETE, OPTIONS';headers['Access-Control-Max-Age']='600';}
    let result;
    try{if(origin&&!allowed.has(origin))fail(403,'origin_not_allowed');if(request.method==='OPTIONS')result=new Response(null,{status:204});else result=await route(request,env,url);}catch(error){const known=error instanceof Problem;result=response({error:{code:known?error.code:'internal_error',message:known?error.message:'The request could not be completed.'}},known?error.status:500);}
    for(const [key,value]of Object.entries(headers))result.headers.set(key,value);return result;
  }
};
export { passwordHash, verifyPassword, hash, validatePayload, validateConfig, DEFAULT_CONFIG };
