const test=require('node:test');
const assert=require('node:assert/strict');
const S=require('../pages/paula/js/schedule.js');
const {makeSummary}=require('../pages/paula/js/booking.js');
const source=require('../pages/paula/assets/availability.json');
const config=()=>structuredClone(source);
const now=new Date('2026-11-15T17:00:00Z');
test('published manual agenda validates and weekdays follow New Jersey dates',()=>{
  assert.equal(S.validateConfig(config()).open,'07:00');
  assert.equal(S.dayOpen('2026-11-16',source,now),true);
  assert.equal(S.dayOpen('2026-11-21',source,now),false);
  assert.equal(S.dayOpen('2026-11-22',source,now),false);
  assert.equal(S.dayOpen('2026-11-14',source,now),false);
  assert.equal(S.dayOpen('2026-02-30',source,now),false);
  assert.equal(S.dayOpen('2027-03-01',source,now),false);
});
test('studio clock follows daylight saving instead of the visitors timezone',()=>{
  assert.deepEqual(S.studioNow(new Date('2026-07-01T12:00:00Z')),{date:'2026-07-01',minutes:480});
  assert.deepEqual(S.studioNow(new Date('2026-12-01T12:00:00Z')),{date:'2026-12-01',minutes:420});
  assert.equal(S.studioNow(new Date('2026-11-16T02:00:00Z')).date,'2026-11-15');
});
test('past starts are excluded and service plus removal must finish by 7 PM',()=>{
  const c=config();c.durationMinutes.fullSet=120;c.removalMinutes=30;
  const list=S.slots('2026-11-16',c,{service:'nails',nailType:'fullSet',removal:'yes'},new Date('2026-11-16T16:00:00Z'));
  assert.equal(list[0].time,'11:30');assert.equal(list.at(-1).time,'16:30');assert.equal(list.at(-1).end,'19:00');
});
test('busy intervals block overlapping services and allow adjacent appointments',()=>{
  const c=config();c.durationMinutes.fullSet=120;c.blocked=[{date:'2026-11-16',start:'10:00',end:'12:00'}];
  const list=S.slots('2026-11-16',c,{service:'nails',nailType:'fullSet'},now);
  assert.equal(list.find(s=>s.time==='08:00').available,true);
  assert.equal(list.find(s=>s.time==='08:30').available,false);
  assert.equal(list.find(s=>s.time==='11:30').available,false);
  assert.equal(list.find(s=>s.time==='12:00').available,true);
  c.closedDates=['2026-11-16'];assert.deepEqual(S.slots('2026-11-16',c,{},now),[]);
});
test('unconfigured durations remain subject to confirmation instead of inventing service times',()=>{
  const c=config();c.durationMinutes.fullSet=null;c.removalMinutes=null;
  const list=S.slots('2026-11-16',c,{service:'nails',nailType:'fullSet',removal:'yes'},now);
  assert.equal(list[0].duration,null);assert.equal(list[0].end,null);
  c.durationMinutes.fullSet=120;assert.equal(S.serviceDuration(c,{service:'nails',nailType:'fullSet',removal:'yes'}),null);
  c.durationMinutes.removalOnly=30;assert.equal(S.serviceDuration(c,{service:'nails',nailType:'removalOnly',removal:'yes'}),30);
});
test('invalid manual data cannot turn into false availability',()=>{
  for(const change of [c=>c.timeZone='UTC',c=>c.open='06:00',c=>c.weekdays.push(6),c=>c.blocked.push({date:'2026-11-16',start:'12:00',end:'11:00'}),c=>c.durationMinutes.fullSet=-20]){
    const c=config();change(c);assert.throws(()=>S.validateConfig(c));
  }
});
test('request includes exact time, removal and acknowledgements in both languages',()=>{
  const data={name:'Ana',contact:'@ana',service:'nails',date:'2026-11-16',time:'09:30',nailType:'fullSet',removal:'yes',removalConsent:true,punctuality:true,cancellation:true,policy:true,duration:150,currentPhoto:'current.jpg',message:'Azul y flores.'};
  const es=makeSummary(data,'Uñas','es'),en=makeSummary(data,'Nails','en');
  assert.match(es,/Hora de inicio solicitada: 09:30/);assert.match(es,/Set completo/);assert.match(es,/tiempo adicional y tiene un costo extra/);assert.match(es,/He leído las condiciones/);assert.match(es,/current.jpg/);assert.match(es,/Adjuntaré estas fotos/);
  assert.match(en,/Requested start time: 09:30/);assert.match(en,/Full set/);assert.match(en,/additional time and costs extra/);assert.match(en,/Azul y flores/);
  const other=makeSummary({...data,service:'pmu'},'PMU','es');assert.doesNotMatch(other,/Servicio de uñas|¿Necesita retiro/);
});
