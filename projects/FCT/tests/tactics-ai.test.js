import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,autoDeploy,confirmDeployment,beginBattle,roundRules,previewPlan,validatePlan,publicView,submitPlan,resolveNext} from '../src/tactics-engine.js';
import {tacticalValues} from '../src/tactics-values.js';
import {planAI} from '../src/tactics-ai.js';

function battlefield(seed=17,round=3){const s=createMatch({seed});for(const side of ['w','b']){autoDeploy(s,side);confirmDeployment(s,side);}beginBattle(s);s.round=round;return s;}
function fixture(positions,round=1){const s=battlefield(17,round);s.units=s.units.filter(u=>positions[u.id]);for(const u of s.units)Object.assign(u,{square:positions[u.id].square,homeSquare:positions[u.id].square,captured:false,hasMoved:true},positions[u.id]);return s;}
function resolve(s,b,w=[]){s=structuredClone(s);assert.equal(submitPlan(s,'w',w).ok,true);assert.equal(submitPlan(s,'b',b).ok,true);while(s.phase==='resolution')assert.equal(resolveNext(s).ok,true);return s;}
const unit=(s,id)=>s.units.find(u=>u.id===id);

test('AI obeys 1/2/3-action budgets, per-piece moves, and preserves the observation',()=>{
 for(const round of [1,2,3]){const s=battlefield(41,round),before=structuredClone(s),orders=planAI(s,'b');assert.deepEqual(s,before);assert.ok(orders.length&&orders.length<=roundRules(s).actions);assert.equal(validatePlan(s,'b',orders).ok,true);const movers=orders.filter(o=>o.kind==='move').map(o=>o.unitId);assert.equal(new Set(movers).size,movers.length);assert.ok(orders.every(o=>['move','block','pass'].includes(o.kind)));}
});
test('sealed enemy orders, readiness, RNG and private logs cannot influence AI',()=>{
 const s=fixture({'w-k':{square:'a1'},'b-k':{square:'h8'},'b-r':{square:'d4'}},2),expected=planAI(s,'b'),altered=structuredClone(s);altered.plans.w=[{unitId:'w-k',kind:'move',target:'b2'}];altered.ready.w=true;altered.log=[{secret:'not observable'}];altered.rng=12345;assert.deepEqual(planAI(altered,'b'),expected);assert.deepEqual(planAI(publicView(s,'b'),'b'),expected);assert.deepEqual(planAI(createMatch(),'b'),[]);
});
test('AI captures the king with a moving piece, without ranged attacks or health',()=>{
 const s=fixture({'w-k':{square:'a1'},'b-k':{square:'h8'},'b-r':{square:'a8'}}),orders=planAI(s,'b');assert.equal(orders[0].kind,'move');assert.equal(orders[0].target,'a1');const result=resolve(s,orders);assert.equal(result.winner,'b');assert.equal(unit(result,'w-k').captured,true);assert.equal(unit(result,'b-r').square,'a1');
});
test('first-moving AI takes an undefended queen without spending its shield',()=>{
 const s=fixture({'b-k':{square:'h2'},'b-q':{square:'g1'},'w-k':{square:'h8'},'w-b':{square:'d4'}});s.shieldUsed.b=true;const orders=planAI(s,'w');assert.equal(orders[0].kind,'move');assert.equal(orders[0].target,'g1');assert.equal(unit(resolve(s,[],orders),'b-q').captured,true);
});
test('opponent counterplay rejects a queen grab that abandons the king',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'d4'},'b-q':{square:'d8'},'b-r':{square:'a8'},'b-k':{square:'h8'}}),orders=planAI(s,'w');assert.equal(validatePlan(s,'w',orders).ok,true);assert.notEqual(orders[0].target,'d8');const result=resolve(s,[{unitId:'b-r',kind:'move',target:'a1'}],orders);assert.equal(unit(result,'w-k').captured,false);assert.notEqual(result.winner,'b');
});
test('AI never reuses a spent army shield even when an important piece is threatened',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'d1'},'b-k':{square:'h8'},'b-q':{square:'d6'}},3);s.shieldUsed.b=true;const orders=planAI(s,'b');assert.ok(orders.every(o=>o.kind!=='block'));assert.equal(validatePlan(s,'b',orders).ok,true);
});
test('AI secures a promotion even when the opponent can vacate a capture target',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-n':{square:'h1'},'b-k':{square:'a8'},'b-p1':{square:'g2',hasMoved:true}});s.shieldUsed.w=true;const orders=planAI(s,'b'),promote=orders.find(o=>o.unitId==='b-p1');assert.ok(promote);assert.equal(promote.promotion,'q');const next=resolve(s,orders);assert.equal(unit(next,'b-p1').type,'q');assert.ok(['g1','h1'].includes(unit(next,'b-p1').square));
});

test('AI recognizes immediate en-passant captures before the opportunity expires',()=>{
 const s=fixture({'w-k':{square:'h1'},'w-p1':{square:'e5',hasMoved:true},'b-k':{square:'a8'},'b-p1':{square:'d5'}});s.enPassant={square:'d6',victimId:'b-p1',availableTo:'w'};const orders=planAI(s,'w');assert.equal(orders[0].unitId,'w-p1');assert.equal(orders[0].target,'d6');
});
test('capture-chess values are shared material priors with terminal king priority',()=>{assert.equal(tacticalValues.p,1);assert.equal(tacticalValues.r,5);assert.equal(tacticalValues.q,9);assert.ok(tacticalValues.b>tacticalValues.n);assert.ok(tacticalValues.k>100*tacticalValues.q);});

test('black does not end an exchange with its king exposed to the next white action',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'h1'},'w-q':{square:'d1'},'b-k':{square:'h8'},'b-b':{square:'h5'}}),orders=planAI(s,'b'),result=resolve(s,orders,[{unitId:'w-r',kind:'move',target:'h2'}]);assert.equal(unit(result,'b-k').captured,false);const king=unit(result,'b-k');assert.notEqual(king.square,'h8');
});

test('priority shield protects the king before a first enemy capture and is used only once',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'h1'},'b-k':{square:'h8'}}),orders=planAI(s,'b');assert.ok(orders.some(o=>o.kind==='block'||o.unitId==='b-k'));const next=resolve(s,orders,[{unitId:'w-r',kind:'move',target:'h8'}]);assert.equal(unit(next,'b-k').captured,false);
});


test('seeded near-equivalent choices stay legal and never read an opponents sealed orders',()=>{
 const s=battlefield(1514,2);for(const seed of [0,1,123456789]){const orders=planAI(s,'b',{seed}),hidden=structuredClone(s);hidden.plans.w=[{secret:'unavailable'}];assert.deepEqual(planAI(hidden,'b',{seed}),orders);assert.equal(validatePlan(s,'b',orders).ok,true);}
});
