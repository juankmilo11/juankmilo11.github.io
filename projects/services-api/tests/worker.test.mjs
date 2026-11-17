import test from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { unlinkSync } from 'node:fs';
import worker, { passwordHash, hash, DEFAULT_CONFIG } from '../worker/index.js';
import { D1Database, R2Bucket } from './adapter.mjs';
const ORIGIN='https://juankmilo11.github.io';
const PASSWORD='correct test password 123!';
const seedHash=await passwordHash(PASSWORD);
const env=()=>({DB:new D1Database(),BUCKET:new R2Bucket(),ADMIN_PASSWORD_HASH:seedHash,ALLOWED_ORIGINS:ORIGIN,RATE_LIMIT_SECRET:'private test rate limiter secret'});
function futureDate(){const date=new Date();date.setUTCDate(date.getUTCDate()+3);while([0,6].includes(date.getUTCDay()))date.setUTCDate(date.getUTCDate()+1);return date.toISOString().slice(0,10);}
const payload=()=>({name:'Ana Test',whatsapp:'+12015550123',instagram:'@ana',service:'nails',date:futureDate(),time:'09:00',nailType:'fullSet',removal:'no',removalConsent:false,punctuality:true,cancellation:true,policy:true,consent:true,message:'Blue flowers',language:'en',reference:null});
async function call(environment,route,method='GET',data=null,{token,key,origin=ORIGIN}={}){
  const headers={Origin:origin};if(token)headers.Authorization=`Bearer ${token}`;if(key)headers['Idempotency-Key']=key;
  let body;if(data instanceof FormData)body=data;else if(data!==null){headers['Content-Type']='application/json';body=JSON.stringify(data);}
  const response=await worker.fetch(new Request('https://service.example'+route,{method,headers,body}),environment);
  const value=response.headers.get('Content-Type')?.includes('application/json')?await response.json():await response.arrayBuffer();
  return {status:response.status,value,headers:response.headers};
}
const login=async environment=>(await call(environment,'/api/admin/login','POST',{password:PASSWORD})).value.token;
const jpeg=new Uint8Array([255,216,255,1,2,3]);
const create=(environment,data=payload(),key=crypto.randomUUID())=>{
  if(!(data instanceof FormData)){const form=new FormData();form.set('payload',JSON.stringify(data));form.set('inspirationPhoto',new File([jpeg],'design.jpg',{type:'image/jpeg'}));data=form;}
  return call(environment,'/api/appointments','POST',data,{key});
};

test('one-time setup expires, verifies activation, and stores only a password hash',async()=>{
  const environment=env();delete environment.ADMIN_PASSWORD_HASH;
  environment.ADMIN_SETUP_TOKEN_HASH=await hash('activation-token-with-at-least-32-characters');
  environment.ADMIN_SETUP_EXPIRES_AT=new Date(Date.now()+3600000).toISOString();
  assert.equal((await create(environment)).status,503);
  assert.equal((await call(environment,'/api/admin/setup','POST',{activationToken:'x'.repeat(40),password:PASSWORD})).status,403);
  const setup={activationToken:'activation-token-with-at-least-32-characters',password:PASSWORD};
  environment.ADMIN_SETUP_EXPIRES_AT='2020-01-01T00:00:00Z';
  assert.equal((await call(environment,'/api/admin/setup','POST',setup)).value.error.code,'activation_expired');
  environment.ADMIN_SETUP_EXPIRES_AT=new Date(Date.now()+3600000).toISOString();
  assert.equal((await call(environment,'/api/admin/setup','POST',setup)).status,201);
  assert.equal((await call(environment,'/api/admin/setup','POST',setup)).status,409);
  const record=environment.DB.sqlite.prepare('SELECT * FROM administrators').get();
  assert.notEqual(record.password_hash,PASSWORD);assert.match(record.password_hash,/^pbkdf2-sha256\$/);
  assert.ok(await login(environment));environment.DB.close();
});

test('authorization, expiry, logout, throttling and origin rejection are enforced server-side',async()=>{
  const environment=env();
  assert.equal((await call(environment,'/api/admin/appointments')).status,401);
  assert.equal((await call(environment,'/api/admin/login','POST',{password:'wrong'})).status,401);
  const token=await login(environment);assert.ok(token);
  const stored=environment.DB.sqlite.prepare('SELECT token_hash FROM sessions').get();assert.notEqual(stored.token_hash,token);
  assert.equal((await call(environment,'/api/admin/appointments','GET',null,{token,origin:'https://evil.example'})).status,403);
  assert.equal((await call(environment,'/api/admin/logout','POST',{}, {token})).status,200);
  assert.equal((await call(environment,'/api/admin/appointments','GET',null,{token})).status,401);
  const expired=await login(environment);environment.DB.sqlite.exec('UPDATE sessions SET expires_at=0');
  assert.equal((await call(environment,'/api/admin/export','GET',null,{token:expired})).status,401);
  for(let index=0;index<5;index++)await call(environment,'/api/admin/login','POST',{password:'wrong'});
  assert.equal((await call(environment,'/api/admin/login','POST',{password:PASSWORD})).status,429);environment.DB.close();
});

test('successful requests persist across database reopen and idempotency cannot create duplicates',async()=>{
  const filename=path.join(tmpdir(),`paca-db-${crypto.randomUUID()}.sqlite`);
  const environment=env();environment.DB.close();environment.DB=new D1Database(filename);
  const key=crypto.randomUUID(),data=payload();
  const first=await create(environment,data,key);assert.equal(first.status,201);
  assert.equal((await create(environment,data,key)).value.id,first.value.id);
  assert.equal((await create(environment,{...data,message:'changed'},key)).status,409);
  environment.DB.close();environment.DB=new D1Database(filename,{migrate:false});
  const token=await login(environment);const records=await call(environment,'/api/admin/appointments','GET',null,{token});
  assert.equal(records.value.items.length,1);assert.equal(records.value.items[0].whatsapp,data.whatsapp);
  environment.DB.close();unlinkSync(filename);
});

test('server validation rejects invalid WhatsApp, consent, closed slots and malformed JSON',async()=>{
  const environment=env();
  for(const change of [{whatsapp:'@ana'},{instagram:'not a handle'},{consent:false},{date:'2020-01-01'},{time:'22:00'},{time:'09:15'},{service:'unapproved'}])assert.ok((await create(environment,{...payload(),...change})).status>=400);
  assert.equal((await call(environment,'/api/admin/login','POST',[])).status,400);environment.DB.close();
});

test('pending requests do not reserve slots; confirmed overlaps are rejected atomically',async()=>{
  const environment=env(),token=await login(environment),data=payload();
  const first=await create(environment,data),second=await create(environment,data);
  assert.equal(first.status,201);assert.equal(second.status,201);
  let availability=await call(environment,'/api/availability');assert.equal(availability.value.blocked.length,0);
  const edits=await Promise.all([first,second].map(item=>call(environment,`/api/admin/appointments/${item.value.id}`,'PATCH',{version:1,status:'confirmed',durationMinutes:90},{token})));
  assert.deepEqual(edits.map(edit=>edit.status).sort(),[200,409]);
  assert.equal(edits.find(edit=>edit.status===409).value.error.code,'appointment_overlap');
  availability=await call(environment,'/api/availability');assert.equal(availability.value.blocked.length,1);
  assert.deepEqual(availability.value.blocked[0],{date:data.date,start:'09:00',end:'10:30'});
  assert.doesNotMatch(JSON.stringify(availability.value),/Ana Test|12015550123|@ana|Blue flowers/);
  assert.equal((await create(environment,data)).value.error.code,'slot_unavailable');environment.DB.close();
});

test('optimistic edit/delete checks reject stale state and export includes records only for authenticated admins',async()=>{
  const environment=env(),token=await login(environment),key=crypto.randomUUID(),data=payload(),created=await create(environment,data,key);
  const route=`/api/admin/appointments/${created.value.id}`;
  assert.equal((await call(environment,route,'PATCH',{version:1,notes:'Discuss colors'},{token})).value.version,2);
  assert.equal((await call(environment,route,'PATCH',{version:1,notes:'Lost update'},{token})).status,409);
  assert.equal((await call(environment,route+'?version=1','DELETE',null,{token})).status,409);
  assert.equal((await call(environment,'/api/admin/export')).status,401);
  const exported=await call(environment,'/api/admin/export','GET',null,{token});assert.equal(exported.value.appointments.length,1);assert.doesNotMatch(JSON.stringify(exported.value),/token_hash|password_hash/);
  assert.equal((await call(environment,route+'?version=2','DELETE',null,{token})).status,200);
  assert.equal((await call(environment,route,'GET',null,{token})).status,404);
  assert.equal((await create(environment,data,key)).value.error.code,'request_deleted','A delayed retry cannot resurrect an admin-deleted request');
  const audit=environment.DB.sqlite.prepare('SELECT * FROM audit_log').all();assert.deepEqual(audit.map(row=>row.action),['created','updated','deleted']);assert.doesNotMatch(JSON.stringify(audit),/Ana Test|12015550123/);environment.DB.close();
});

test('closed schedules do not prevent cancelling records or editing contact and notes',async()=>{
  const environment=env(),token=await login(environment),created=await create(environment),data=payload();
  const config=structuredClone(DEFAULT_CONFIG);config.closedDates=[data.date];
  await call(environment,'/api/admin/schedule','PUT',{version:0,config},{token});
  const route=`/api/admin/appointments/${created.value.id}`;
  assert.equal((await call(environment,route,'PATCH',{version:1,notes:'Contact update',whatsapp:'+12015550999'},{token})).status,200);
  assert.equal((await call(environment,route,'PATCH',{version:2,status:'confirmed',durationMinutes:60},{token})).status,409);
  assert.equal((await call(environment,route,'PATCH',{version:2,status:'cancelled'},{token})).status,200);
  environment.DB.close();
});

test('private photo upload has no public read route, validates magic bytes and uses durable deletion retries',async()=>{
  const environment=env(),token=await login(environment);
  const form=new FormData();form.set('payload',JSON.stringify(payload()));form.set('inspirationPhoto',new File([new Uint8Array([255,216,255,1,2,3])],'nails.jpg',{type:'image/jpeg'}));
  const saved=await create(environment,form);assert.equal(saved.status,201);assert.equal(environment.BUCKET.objects.size,1);
  const record=(await call(environment,`/api/admin/appointments/${saved.value.id}`,'GET',null,{token})).value;
  const photo='/api/admin/attachments/'+record.attachments[0].id;
  assert.equal((await call(environment,photo)).status,401);assert.equal((await call(environment,photo,'GET',null,{token})).status,200);
  environment.BUCKET.failDelete=true;
  const removed=await call(environment,`/api/admin/appointments/${saved.value.id}?version=1`,'DELETE',null,{token});assert.equal(removed.value.cleanupPending,true);
  assert.equal((await call(environment,photo,'GET',null,{token})).status,404);
  assert.equal(environment.DB.sqlite.prepare('SELECT count(*) AS count FROM object_deletions').get().count,1);
  environment.BUCKET.failDelete=false;await call(environment,'/api/admin/appointments','GET',null,{token});assert.equal(environment.BUCKET.objects.size,0);
  const invalid=new FormData();invalid.set('payload',JSON.stringify(payload()));invalid.set('currentPhoto',new File(['<svg>bad</svg>'],'fake.jpg',{type:'image/jpeg'}));assert.equal((await create(environment,invalid)).value.error.code,'invalid_photo');environment.DB.close();
});

test('schedule writes use versions, validate intervals and persist changes',async()=>{
  const environment=env(),token=await login(environment),config=structuredClone(DEFAULT_CONFIG);config.closedDates=[futureDate()];
  const initial=await call(environment,'/api/admin/schedule','GET',null,{token});assert.equal(initial.value.version,0);
  const saved=await call(environment,'/api/admin/schedule','PUT',{version:0,config},{token});assert.equal(saved.value.version,1);
  assert.equal((await call(environment,'/api/admin/schedule','PUT',{version:0,config},{token})).status,409);
  config.closedDates=[];assert.equal((await call(environment,'/api/admin/schedule','PUT',{version:1,config},{token})).value.version,2);
  assert.equal((await call(environment,'/api/admin/schedule','PUT',{version:2,config:{...config,blocked:[{date:futureDate(),start:'12:00',end:'10:00'}]}},{token})).status,400);environment.DB.close();
});

test('password changes revoke all sessions and previous credentials stop working',async()=>{
  const environment=env(),first=await login(environment),second=await login(environment);
  const changed=await call(environment,'/api/admin/password','POST',{currentPassword:PASSWORD,newPassword:'new strong password 456!'},{token:first});assert.equal(changed.status,200);
  assert.equal((await call(environment,'/api/admin/appointments','GET',null,{token:second})).status,401);
  assert.equal((await call(environment,'/api/admin/login','POST',{password:PASSWORD})).status,401);
  assert.equal((await call(environment,'/api/admin/login','POST',{password:'new strong password 456!'})).status,200);environment.DB.close();
});

test('search escapes wildcards instead of interpreting user text as SQL',async()=>{
  const environment=env(),token=await login(environment);await create(environment,{...payload(),name:'Ana % literal'});await create(environment,{...payload(),whatsapp:'+12015550124',name:'Different'});
  const found=await call(environment,'/api/admin/appointments?q=%25','GET',null,{token});assert.equal(found.status,200);assert.equal(found.value.items.length,1);assert.equal(found.value.items[0].name,'Ana % literal');environment.DB.close();
});


test('editable ranges persist, preview includes confirmed time without saving, and saved closures reject requests',async()=>{
  const environment=env(),token=await login(environment),data=payload();
  const created=await create(environment,data);
  await call(environment,'/api/admin/appointments/'+created.value.id,'PATCH',{version:1,status:'confirmed',durationMinutes:60},{token});
  const original=await call(environment,'/api/admin/schedule','GET',null,{token}),config=structuredClone(original.value.config);
  assert.equal(config.estimates.fullSet.maxMinutes,150);assert.equal(config.currency,'USD');
  config.closedDates=[data.date];config.estimates.fullSet={minMinutes:80,maxMinutes:140,minPrice:45,maxPrice:95};
  const preview=await call(environment,'/api/admin/schedule/preview','POST',{config},{token});
  assert.equal(preview.status,200);assert.deepEqual(preview.value.closedDates,[data.date]);
  assert.ok(preview.value.blocked.some(b=>b.date===data.date&&b.start==='09:00'&&b.end==='10:00'));
  assert.deepEqual((await call(environment,'/api/admin/schedule','GET',null,{token})).value.config.closedDates,[],'Preview never saves');
  const invalid=structuredClone(config);invalid.estimates.fullSet.minMinutes=141;
  assert.equal((await call(environment,'/api/admin/schedule','PUT',{config:invalid,version:0},{token})).value.error.code,'invalid_estimates');
  invalid.estimates.fullSet={minMinutes:80,maxMinutes:140,minPrice:95,maxPrice:45};
  assert.equal((await call(environment,'/api/admin/schedule/preview','POST',{config:invalid},{token})).status,400);
  const save=await call(environment,'/api/admin/schedule','PUT',{config,version:original.value.version},{token});assert.equal(save.status,200);
  const publicConfig=(await call(environment,'/api/availability')).value;assert.deepEqual(publicConfig.estimates.fullSet,config.estimates.fullSet);
  assert.equal((await create(environment,{...data,time:'13:00'})).value.error.code,'slot_unavailable','Saved closed days enforced on server');
  config.closedDates=[];config.blocked=[{date:data.date,start:'13:00',end:'13:30'}];
  await call(environment,'/api/admin/schedule','PUT',{config,version:save.value.version},{token});
  assert.equal((await create(environment,{...data,time:'12:00'})).status,409,'Maximum duration overlapping a manual block is rejected');
  environment.DB.close();
});

test('availability changes and newly confirmed appointments during photo upload reject atomically and remove uploaded photos',async()=>{
  for(const mode of ['closed','confirmed']){
    const environment=env(),token=await login(environment),data=payload();
    const pending=await create(environment,data);
    const original=environment.BUCKET.put.bind(environment.BUCKET);
    environment.BUCKET.put=async(...args)=>{
      await original(...args);
      if(mode==='closed'){
        const config=(await call(environment,'/api/admin/schedule','GET',null,{token})).value;
        config.config.closedDates=[data.date];
        assert.equal((await call(environment,'/api/admin/schedule','PUT',config,{token})).status,200);
      }else assert.equal((await call(environment,'/api/admin/appointments/'+pending.value.id,'PATCH',{version:1,status:'confirmed',durationMinutes:60},{token})).status,200);
    };
    const form=new FormData();form.set('payload',JSON.stringify(data));
    form.set('inspirationPhoto',new Blob([Uint8Array.from([0xff,0xd8,0xff,0xe0,0,0,0,0,0,0,0,0])],{type:'image/jpeg'}),'current.jpg');
    const result=await call(environment,'/api/appointments','POST',form,{key:crypto.randomUUID()});
    assert.equal(result.status,409,mode);assert.equal(result.value.error.code,'slot_unavailable');
    assert.equal(environment.BUCKET.objects.size,1,'Only the earlier pending request keeps its inspiration photo');assert.equal((await environment.DB.prepare('SELECT COUNT(*) AS n FROM appointments').first()).n,1);
    environment.DB.close();
  }
});

test('every new service requires an actual inspiration upload; JSON references and current photos cannot bypass it',async()=>{
  const environment=env();
  for(const service of ['nails','tattoo','pmu','beauty','consultation']){
    const result=await call(environment,'/api/appointments','POST',{...payload(),service,reference:{en:'Catalog design',es:'Diseño del catálogo'}},{key:crypto.randomUUID()});
    assert.equal(result.status,400);assert.equal(result.value.error.code,'inspiration_required');
  }
  const form=new FormData();form.set('payload',JSON.stringify(payload()));form.set('currentPhoto',new File([jpeg],'current.jpg',{type:'image/jpeg'}));
  assert.equal((await create(environment,form)).value.error.code,'inspiration_required');
  form.set('inspirationPhoto',new File(['fake'],'fake.png',{type:'image/png'}));
  assert.equal((await create(environment,form)).value.error.code,'invalid_photo');
  assert.equal(environment.BUCKET.objects.size,0);
  assert.equal((await create(environment)).status,201);
  environment.DB.close();
});

test('templates require authentication, persist across connections, reject stale writes and export the saved collection',async()=>{
  const filename=path.join(tmpdir(),`paca-templates-${crypto.randomUUID()}.sqlite`),environment=env();
  environment.DB.close();environment.DB=new D1Database(filename);
  assert.equal((await call(environment,'/api/admin/templates')).status,401);
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:0,items:[]})).status,401);
  const token=await login(environment),initial=(await call(environment,'/api/admin/templates','GET',null,{token})).value;
  assert.equal(initial.version,0);assert.ok(initial.items.length>=6);
  assert.match(initial.items.find(item=>item.id==='deposit-es').body,/\$20 USD/);
  const item={id:crypto.randomUUID(),title:'Custom',body:'Hello {nombre}\nSecond line'};
  const saved=await call(environment,'/api/admin/templates','PUT',{version:0,items:[...initial.items,item]},{token});
  assert.equal(saved.status,200);assert.equal(saved.value.version,1);
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:0,items:[]},{token})).status,409);
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:1,items:[item,item]},{token})).status,400);
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:1,items:[{...item,body:'x'.repeat(5001)}]},{token})).status,400);
  environment.DB.close();environment.DB=new D1Database(filename,{migrate:false});
  assert.deepEqual((await call(environment,'/api/admin/templates','GET',null,{token})).value,saved.value);
  const changed={...item,body:'Edited'};
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:1,items:[changed]},{token})).status,200);
  const backup=await call(environment,'/api/admin/export','GET',null,{token});assert.deepEqual(backup.value.templates.items,[changed]);
  assert.equal((await call(environment,'/api/admin/templates','PUT',{version:2,items:[]},{token})).status,200);
  assert.deepEqual((await call(environment,'/api/admin/templates','GET',null,{token})).value.items,[],'An intentionally empty collection stays empty');
  environment.DB.close();unlinkSync(filename);
});


test('private monthly agenda includes every status and historical cancellations without exposing events publicly',async()=>{
  const environment=env(),token=await login(environment),date=payload().date;
  const ids={};let index=0;
  for(const status of ['confirmed','pending','completed','cancelled']){
    const data={...payload(),name:'Agenda '+status,time:['07:00','10:00','13:00','16:00'][index],whatsapp:'+1201555012'+index};index++;
    const item=await create(environment,data);assert.equal(item.status,201);ids[status]=item.value.id;
    if(status!=='pending')assert.equal((await call(environment,'/api/admin/appointments/'+item.value.id,'PATCH',{version:1,status,durationMinutes:60},{token})).status,200);
  }
  const saved=(await call(environment,'/api/admin/schedule','GET',null,{token})).value;
  saved.config.closedDates=[date];saved.config.blocked=[{date,start:'12:00',end:'13:00'}];
  const route='/api/admin/schedule/preview',body={config:saved.config,month:date.slice(0,7)};
  const preview=await call(environment,route,'POST',body,{token});assert.equal(preview.status,200);
  assert.deepEqual(preview.value.events.map(e=>e.status).sort(),['cancelled','completed','confirmed','pending']);
  assert.ok(preview.value.events.every(e=>!('whatsapp' in e)&&!('payload' in e)&&!('notes' in e)));
  assert.equal(preview.value.blocked.length,2,'Only confirmed appointment and manual block occupy time');
  assert.equal((await call(environment,route,'POST',body)).status,401);
  assert.equal((await call(environment,route,'POST',{...body,month:'2026-13'},{token})).status,400);
  const publicData=(await call(environment,'/api/availability')).value;assert.equal(publicData.events,undefined);assert.doesNotMatch(JSON.stringify(publicData),/Agenda|cancelled|whatsapp/);
  const history=new Date(date+'T12:00:00Z');history.setUTCMonth(history.getUTCMonth()-2);const historicalDate=history.toISOString().slice(0,10);
  assert.equal((await call(environment,'/api/admin/appointments/'+ids.cancelled,'PATCH',{version:2,date:historicalDate},{token})).status,200);
  const past=await call(environment,route,'POST',{...body,month:historicalDate.slice(0,7)},{token});assert.equal(past.value.events.length,1);assert.equal(past.value.events[0].status,'cancelled');
  environment.DB.close();
});
