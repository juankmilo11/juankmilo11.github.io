import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, autoDeploy, roundRules, previewPlan, submitPlan, publicView, unitAt } from '../src/tactics-engine.js';
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

test('AI can repeat stationary attacks to finish the opposing king in three front hits',()=>{
  const state=fixture({'w-k':{square:'a1',facing:'N'},'b-k':{square:'h8'},'b-r':{square:'a8'}});
  const plan=planAI(state,'b'),result=previewPlan(state,'b',plan);
  assert.equal(result.winner,'b');
  assert.equal(result.units.find(unit=>unit.id==='b-r').square,'a8');
  assert.equal(plan.length,3);
  assert.ok(plan.every(order=>order.unitId==='b-r'));
});

test('AI attacks an exposed enemy instead of striking allies that stop its diagonal',()=>{
  const state=fixture({'w-k':{square:'a1'},'w-r':{square:'g1',hp:1},'b-k':{square:'g7'},'b-b':{square:'d4'},'b-p1':{square:'b2',hp:2}});
  const result=previewPlan(state,'b',planAI(state,'b'));
  assert.equal(result.units.find(unit=>unit.id==='w-r').hp,0);
  assert.equal(result.units.find(unit=>unit.id==='b-k').hp,6);
  assert.equal(result.units.find(unit=>unit.id==='b-p1').hp,2);
});

test('opening plans do not disguise a second attack as an occupied movement',()=>{
  const state=fixture({'w-k':{square:'a1',facing:'N'},'b-k':{square:'h8'},'b-r':{square:'a8'}},1);
  const orders=planAI(state,'b');let projected=structuredClone(state),attacks=0,moves=0;
  for(const order of orders){
    if(order.kind==='move'&&!unitAt(projected,order.target))moves++;
    else if(order.kind!=='pass')attacks++;
    projected=previewPlan(projected,'b',[order]);
  }
  assert.ok(moves<=1&&attacks===0);
  assert.equal(submitPlan(state,'b',orders).ok,true);
});

test('AI repositions to create an attack instead of refreshing guard indefinitely',()=>{
  const state=fixture({'w-k':{square:'h7',facing:'S'},'b-k':{square:'a2'},'b-q':{square:'f6'}});
  const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
  assert.ok(result.units.find(unit=>unit.id==='w-k').hp<6);
  assert.ok(orders.some(order=>order.kind==='move'));
  const movement=orders.find(order=>order.kind==='move');
  assert.ok(['N','E','S','W'].includes(movement.facing));
});

test('AI uses a charged bishop area attack without obsolete healing modes',()=>{
  const state=fixture({'w-k':{square:'a1'},'w-r':{square:'e5',hp:2},'b-k':{square:'h8'},'b-b':{square:'d4',charged:true}});
  const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
  assert.equal(result.units.find(u=>u.id==='w-r').hp,0);assert.ok(orders.every(o=>!['heal','fracture','obstacle','rally'].includes(o.mode)));
});

test('a king approaches the opponent when no supporting special pieces remain',()=>{
  const state=fixture({'w-k':{square:'a1'},'b-k':{square:'h8'},'b-p1':{square:'f4'}});
  const orders=planAI(state,'b'),result=previewPlan(state,'b',orders);
  const king=result.units.find(unit=>unit.id==='b-k');
  assert.ok(king.square!=='h8','endgames must not consist only of refreshing guard');
});
