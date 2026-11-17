import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {passwordHash} from '../worker/index.js';
import {D1Database,R2Bucket} from './adapter.mjs';
const password='isolated photo role test password';
const encoded=await passwordHash(password);
const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1cAAAAASUVORK5CYII=','base64'));
async function call(env,path,method='GET',body,token,key){
  const headers={}; if(token)headers.Authorization=`Bearer ${token}`;if(key)headers['Idempotency-Key']=key;
  if(body&&!(body instanceof FormData)){headers['Content-Type']='application/json';body=JSON.stringify(body);}
  const response=await worker.fetch(new Request('https://test.example'+path,{method,headers,body}),env);
  assert.ok(response.ok,await response.clone().text()); return response.json();
}
test('photo fields are preserved and legacy roles require an exact original fingerprint',async()=>{
  const env={DB:new D1Database(),BUCKET:new R2Bucket(),ADMIN_PASSWORD_HASH:encoded};
  try{
    const {token}=await call(env,'/api/admin/login','POST',{password});
    const day=new Date();day.setUTCDate(day.getUTCDate()+3);while([0,6].includes(day.getUTCDay()))day.setUTCDate(day.getUTCDate()+1);
    for(const fields of [['inspirationPhoto'],['currentPhoto','inspirationPhoto']]){
      const form=new FormData();form.set('payload',JSON.stringify({name:'Role test',whatsapp:'+12015550123',instagram:'',service:'beauty',date:day.toISOString().slice(0,10),time:'09:00',punctuality:true,cancellation:true,policy:true,consent:true,message:'',language:'en'}));
      for(const field of fields)form.set(field,new File([field==='currentPhoto'?png:new Uint8Array([...png,0])],field+'.png',{type:'image/png'}));
      const receipt=await call(env,'/api/appointments','POST',form,null,crypto.randomUUID());
      let record=await call(env,'/api/admin/appointments/'+receipt.id,'GET',undefined,token);
      assert.deepEqual(record.attachments.map(file=>file.field).sort(),[...fields].sort());
      await env.DB.prepare('UPDATE attachments SET field=NULL WHERE appointment_id=?').bind(record.id).run();
      record=await call(env,'/api/admin/appointments/'+record.id,'GET',undefined,token);
      for(const attachment of record.attachments)assert.equal(attachment.field,attachment.name.replace('.png',''));
      await env.DB.prepare('UPDATE attachments SET field=NULL WHERE appointment_id=?').bind(record.id).run();
      await call(env,'/api/admin/appointments/'+record.id,'PATCH',{version:record.version,name:'Changed customer'},token);
      record=await call(env,'/api/admin/appointments/'+record.id,'GET',undefined,token);
      assert.ok(record.attachments.every(file=>file.field===null),'Changed original data must never yield guessed roles');
    }
  }finally{env.DB.close();}
});
