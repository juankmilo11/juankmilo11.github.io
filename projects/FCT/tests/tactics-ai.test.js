import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,autoDeploy,confirmDeployment,beginBattle,roundRules,firstSideForRound,previewPlan,validatePlan,publicView,submitPlan,resolveNext,isSquareAttacked} from '../src/tactics-engine.js';
import {tacticalValues} from '../src/tactics-values.js';
import {planAI} from '../src/tactics-ai.js';

function battlefield(seed=17,round=3){const s=createMatch({seed});for(const side of ['w','b']){autoDeploy(s,side);confirmDeployment(s,side);}beginBattle(s);s.round=round;s.firstSide=firstSideForRound(round);return s;}
function fixture(positions,round=1){const s=battlefield(17,round);s.units=s.units.filter(u=>positions[u.id]);for(const u of s.units)Object.assign(u,{square:positions[u.id].square,homeSquare:positions[u.id].square,captured:false,hasMoved:true},positions[u.id]);return s;}
function resolve(s,b,w=[]){s=structuredClone(s);assert.equal(submitPlan(s,'w',w).ok,true);assert.equal(submitPlan(s,'b',b).ok,true);while(s.phase==='resolution')assert.equal(resolveNext(s).ok,true);return s;}
const unit=(s,id)=>s.units.find(u=>u.id===id);

test('AI obeys 1/2-action budgets and alternating initiative without mutating its observation',()=>{
 for(const round of [1,2,3]){const s=battlefield(41,round),before=structuredClone(s),debug={},orders=planAI(s,'b',{debug});if(round===2){assert.ok(debug.horizonNodes>0);assert.ok(debug.horizonNodes<=180);}assert.deepEqual(s,before);assert.ok(orders.length&&orders.length<=roundRules(s,'b').actions);assert.equal(validatePlan(s,'b',orders).ok,true);assert.ok(orders.every(o=>['move','pass'].includes(o.kind)));}
});
test('sealed enemy orders, readiness, RNG and private logs cannot influence AI',()=>{
 const s=fixture({'w-k':{square:'a1'},'b-k':{square:'h8'},'b-r':{square:'d4'}},2),expected=planAI(s,'b'),altered=structuredClone(s);altered.plans.w=[{unitId:'w-k',kind:'move',target:'b2'}];altered.ready.w=true;altered.log=[{secret:'not observable'}];altered.rng=12345;assert.deepEqual(planAI(altered,'b'),expected);assert.deepEqual(planAI(publicView(s,'b'),'b'),expected);assert.deepEqual(planAI(createMatch(),'b'),[]);
});
test('AI captures the king with a moving piece, without ranged attacks or health',()=>{
 // The first mover can guarantee this capture. A second mover must account
 // for the opposing king escaping before its declared capture executes.
 const s=fixture({'b-k':{square:'a8'},'w-k':{square:'h1'},'w-r':{square:'a1'}}),orders=planAI(s,'w');assert.equal(orders[0].kind,'move');assert.equal(orders[0].target,'a8');const result=resolve(s,[],orders);assert.equal(result.winner,'w');assert.equal(unit(result,'b-k').captured,true);assert.equal(unit(result,'w-r').square,'a8');
});

test('AI can use the same queen twice to force a king capture or mate',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-q':{square:'d4'},'b-k':{square:'g8'},'b-q':{square:'d8'}},1),orders=planAI(s,'w');
 assert.equal(orders.length,2);assert.ok(orders.every(o=>o.unitId==='w-q'&&o.kind==='move'));const result=resolve(s,[],orders);assert.equal(result.winner,'w');assert.ok(unit(result,'b-k').captured||result.winReason==='checkmate');
});
test('AI prefers a favorable queen trade over speculative king threats',()=>{
 const s=fixture({'b-k':{square:'h2'},'b-q':{square:'g1'},'w-k':{square:'h8'},'w-b':{square:'d4'}});const orders=planAI(s,'w');assert.equal(orders[0].kind,'move');assert.equal(orders[0].target,'g1');assert.equal(unit(resolve(s,[],orders),'b-q').captured,true);
});
test('opponent counterplay rejects a queen grab that abandons the king',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'d4'},'b-q':{square:'d8'},'b-r':{square:'a8'},'b-k':{square:'h8'}}),orders=planAI(s,'w');assert.equal(validatePlan(s,'w',orders).ok,true);assert.notEqual(orders[0].target,'d8');const result=resolve(s,[{unitId:'b-r',kind:'move',target:'a1'}],orders);assert.equal(unit(result,'w-k').captured,false);assert.notEqual(result.winner,'b');
});
test('AI secures a promotion even when the opponent can vacate a capture target',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-n':{square:'h1'},'b-k':{square:'a8'},'b-p1':{square:'g2',hasMoved:true}});const orders=planAI(s,'b'),promote=orders.find(o=>o.unitId==='b-p1');assert.ok(promote);assert.equal(promote.promotion,'q');const next=resolve(s,orders);assert.equal(unit(next,'b-p1').type,'q');assert.ok(['g1','h1'].includes(unit(next,'b-p1').square));
});

test('AI recognizes immediate en-passant captures before the opportunity expires',()=>{
 const s=fixture({'w-k':{square:'h1'},'w-p1':{square:'e5',hasMoved:true},'b-k':{square:'a8'},'b-p1':{square:'d5'}});s.enPassant={square:'d6',victimId:'b-p1',availableTo:'w'};const orders=planAI(s,'w');assert.equal(orders[0].unitId,'w-p1');assert.equal(orders[0].target,'d6');
});
test('capture-chess values are shared material priors with terminal king priority',()=>{assert.equal(tacticalValues.p,1);assert.equal(tacticalValues.r,5);assert.equal(tacticalValues.q,9.5);assert.ok(tacticalValues.b>tacticalValues.n);assert.ok(tacticalValues.k>100*tacticalValues.q);});

test('black does not end an exchange with its king exposed to the next white action',()=>{
 const s=fixture({'w-k':{square:'a1'},'w-r':{square:'h1'},'w-q':{square:'d1'},'b-k':{square:'h8'},'b-b':{square:'h5'}}),orders=planAI(s,'b'),result=resolve(s,orders,[{unitId:'w-r',kind:'move',target:'h2'}]);assert.equal(unit(result,'b-k').captured,false);const king=unit(result,'b-k');assert.notEqual(king.square,'h8');
});

test('AI recognizes a checkmate that wins before the opposing next order',()=>{
 const s=fixture({'w-k':{square:'h1'},'b-k':{square:'f3'},'b-q':{square:'f2'}}),orders=planAI(s,'b'),result=resolve(s,orders);assert.equal(result.winner,'b');assert.ok(['capture','checkmate'].includes(result.winReason));
});

test('defensive king retreats survive a tempting attack being captured before it acts',()=>{
 const s=battlefield(17,5),placements={'w-p1':'a4','w-p2':'b3','w-p4':'d4','w-p5':'e3','w-p8':'h4','w-n':'c3','w-b':'f4','w-b2':'g6','b-p3':'c6','b-p4':'d5','b-p5':'e6','b-p6':'f6','b-n':'d3','b-b':'g4','b-k':'d7'};
 for(const [id,square]of Object.entries(placements))Object.assign(unit(s,id),{square,hasMoved:true});
 const orders=planAI(s,'b',{seed:214105}),reply=[{kind:'move',unitId:'w-q',target:'d3'}],result=resolve(s,orders,reply),king=unit(result,'b-k');
 assert.equal(validatePlan(s,'b',orders).ok,true);assert.notEqual(result.winner,'w');assert.equal(king.captured,false);assert.equal(isSquareAttacked(result,king.square,'w'),false);
});

test('seeded near-equivalent choices stay legal and never read an opponents sealed orders',()=>{
 const s=battlefield(1514,2);for(const seed of [0,1,123456789]){const orders=planAI(s,'b',{seed}),hidden=structuredClone(s);hidden.plans.w=[{secret:'unavailable'}];assert.deepEqual(planAI(hidden,'b',{seed}),orders);assert.equal(validatePlan(s,'b',orders).ok,true);}
});
