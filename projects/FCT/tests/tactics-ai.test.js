import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, autoDeploy, roundRules, previewPlan, submitPlan, publicView, validateOrder } from '../src/tactics-engine.js';
import { tacticalValues } from '../src/tactics-values.js';
import { planAI } from '../src/tactics-ai.js';

function battlefield(seed=17,round=3) {
  const state=createMatch({seed});autoDeploy(state,'w');autoDeploy(state,'b');
  Object.assign(state,{phase:'planning',round,deployed:{w:true,b:true},ready:{w:false,b:false},activePlanner:'w'});
  return state;
}
function fixture(positions,round=3) {
  const state=battlefield(17,round);
  for(const unit of state.units){unit.hp=0;unit.square=null;}
  for(const [id,details]of Object.entries(positions))Object.assign(state.units.find(unit=>unit.id===id),{hp:6,charged:false},details);
  return state;
}

test('AI emits legal plans within opening and later budgets, without mutating the match',()=>{
  for(const round of [1,2,3,7])for(const seed of [7,41]){
    const state=battlefield(seed,round),before=structuredClone(state),orders=planAI(state,'b');
    assert.deepEqual(state,before);
    assert.ok(orders.length>0&&orders.length<=roundRules(round).actions);
    assert.deepEqual(previewPlan(state,'b',orders).forecastErrors,[]);
    const result=submitPlan(structuredClone(state),'b',orders);
    assert.equal(result.ok,true,result.error);
  }
});

test('sealed enemy plans and logs cannot influence the deterministic AI',()=>{
  const state=battlefield(),plan=planAI(state,'b');
  const altered=structuredClone(state);
  altered.plans.w=[{kind:'attack',unitId:'w-q',direction:'N'},{kind:'ultimate',unitId:'w-k'}];
  altered.log=[{message:'arbitrary private information',unitId:'w-q'}];
  assert.deepEqual(planAI(altered,'b'),plan);
  assert.deepEqual(planAI(publicView(state,'b'),'b'),plan);
  const hidden=createMatch();autoDeploy(hidden,'b');
  assert.deepEqual(planAI(hidden,'b'),[]);
});

test('AI attacks an exposed king but never repeats the same action with that piece',()=>{
 const state=fixture({'w-k':{square:'a1',facing:'N'},'b-k':{square:'h8'},'b-r':{square:'a8'}},1);
 const orders=planAI(state,'b'),result=previewPlan(state,'b',orders),keys=orders.filter(o=>o.kind!=='pass').map(o=>`${o.unitId}:${o.kind}`);
 assert.equal(orders.length,2);assert.equal(new Set(keys).size,keys.length);assert.ok(result.units.find(u=>u.id==='w-k').hp<6);assert.ok(result.units.find(u=>u.id==='w-k').hp>0);
});

test('AI attacks an exposed enemy instead of striking allies that stop its diagonal',()=>{
  const state=fixture({'w-k':{square:'a1'},'w-r':{square:'g1',hp:1},'b-k':{square:'g7'},'b-b':{square:'d4'},'b-p1':{square:'b2',hp:2}});
  const result=previewPlan(state,'b',planAI(state,'b'));
  assert.equal(result.units.find(unit=>unit.id==='w-r').hp,0);
  assert.equal(result.units.find(unit=>unit.id==='b-k').hp,6);
  assert.equal(result.units.find(unit=>unit.id==='b-p1').hp,2);
});

test('round-one attacks have real piece targets; empty-square orders are movements',()=>{
 const state=fixture({'w-k':{square:'a1',facing:'N'},'b-k':{square:'h8'},'b-r':{square:'a8'}},1),orders=planAI(state,'b');let projected=structuredClone(state);
 assert.ok(orders.some(o=>o.kind==='attack'));
 for(const order of orders){assert.equal(validateOrder(projected,'b',order).ok,true);if(order.kind==='attack')assert.ok(projected.units.some(u=>u.hp>0&&u.square===order.target));projected=previewPlan(projected,'b',[order]);}
 assert.equal(submitPlan(state,'b',orders).ok,true);
});

test('AI repositions to create an attack instead of refreshing guard indefinitely',()=>{
  const state=fixture({'w-k':{square:'h7',facing:'S'},'b-k':{square:'a2'},'b-q':{square:'f6'}});
  const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
  assert.ok(result.units.find(unit=>unit.id==='w-k').hp<6);
  assert.ok(orders.some(order=>order.kind==='move'));
  const movement=orders.find(order=>order.kind==='move');
  assert.equal(Object.hasOwn(movement,'facing'),false);
});

test('AI uses a charged bishop area attack without obsolete healing modes',()=>{
  const state=fixture({'w-k':{square:'a1'},'w-r':{square:'e5',hp:2},'b-k':{square:'h8'},'b-b':{square:'d4',charged:true}});
  const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
  assert.equal(result.units.find(u=>u.id==='w-r').hp,0);assert.ok(orders.every(o=>!['heal','fracture','obstacle','rally'].includes(o.mode)));
});

test('endgames make progress after initial charging rather than refreshing guard indefinitely',()=>{
 const state=fixture({'w-k':{square:'a1'},'b-k':{square:'h8'},'b-p1':{square:'f4'}});
 const first=previewPlan(state,'b',planAI(state,'b'));first.round++;
 const next=previewPlan(first,'b',planAI(first,'b'));assert.ok(next.units.find(u=>u.id==='b-k').square!=='h8');
});

test('two-action search combines Focus and an area ultimate when it wins more material',()=>{
 const state=fixture({'w-k':{square:'a1'},'w-p2':{square:'a3'},'w-p3':{square:'b1'},'w-q':{square:'f4',hp:2},'w-r':{square:'d6',hp:2},'b-k':{square:'h8'},'b-r':{square:'d4'}});
 const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
 assert.deepEqual(orders.map(o=>o.kind),['focus','ultimate']);assert.equal(result.units.find(u=>u.id==='w-q').hp,0);assert.equal(result.units.find(u=>u.id==='w-r').hp,0);
});

test('combat values reflect stationary attacks and are independent from classic chess scores',()=>{
 assert.equal(tacticalValues.p,2);assert.equal(tacticalValues.n,4);assert.equal(tacticalValues.r,5);assert.equal(tacticalValues.q,8);assert.ok(tacticalValues.k>10*tacticalValues.q);
});
