import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,placeUnit,autoDeploy,confirmDeployment,rollInitiative,chooseInitiative,roundRules,publicView,getLegalMoves,getAttackTargets,validateOrder,previewPlan,submitPlan,resolveNext,incomingDamage,orderCategory} from '../src/tactics-engine.js';

function fixture(placements,round=3) {
  const state=createMatch({seed:123});state.phase='planning';state.round=round;
  state.deployed={w:true,b:true};
  const squares={'w-k':'a1','b-k':'h8',...placements};
  state.units=state.units.filter(unit=>Object.hasOwn(squares,unit.id));
  for(const unit of state.units)unit.square=squares[unit.id];
  return state;
}
const unit=(state,id)=>state.units.find(item=>item.id===id);
function deployed(seed=1) {
  const state=createMatch({seed});autoDeploy(state,'w');autoDeploy(state,'b');confirmDeployment(state,'w');confirmDeployment(state,'b');return state;
}
function duel(state,w,b=[]) {
  assert.equal(submitPlan(state,'w',w).ok,true);assert.equal(submitPlan(state,'b',b).ok,true);
  const events=[];while(state.phase==='resolution')events.push(resolveNext(state).event);return events;
}

test('each side has three pawns and one of each special; only kings start charged',()=>{
  const state=createMatch();
  for(const color of ['w','b']){
    const army=state.units.filter(unit=>unit.color===color);
    assert.equal(army.length,8);assert.equal(army.filter(unit=>unit.type==='p').length,3);
    for(const type of ['r','n','b','q','k'])assert.equal(army.filter(unit=>unit.type===type).length,1);
    for(const piece of army){assert.equal(piece.hp,6);assert.equal(piece.charged,piece.type==='k');}
  }
});

test('deployment accepts only free home squares, seals placements and reveals both armies for initiative',()=>{
  const state=createMatch({seed:2});
  assert.equal(placeUnit(state,'w','w-p1','e3').ok,false);
  assert.equal(placeUnit(state,'w','b-p1','a1').ok,false);
  assert.equal(placeUnit(state,'w','w-p1','a1').ok,true);
  assert.equal(placeUnit(state,'w','w-r','a1').ok,false);
  assert.equal(confirmDeployment(state,'w').ok,false);
  autoDeploy(state,'w');autoDeploy(state,'b');
  const publicWhite=publicView(state,'w');
  assert.ok(publicWhite.units.filter(piece=>piece.color==='b').every(piece=>piece.square===null));
  assert.equal(Object.hasOwn(publicWhite,'rng'),false);
  confirmDeployment(state,'w');assert.equal(placeUnit(state,'w','w-p1','b1').ok,false);
  confirmDeployment(state,'b');assert.equal(state.phase,'initiative');
  assert.ok(publicView(state,'w').units.filter(piece=>piece.color==='b').every(piece=>piece.square));
  const roll=rollInitiative(state);chooseInitiative(state,roll.winner,{first:true});
  assert.equal(state.phase,'planning');assert.ok(publicView(state,'w').units.every(piece=>piece.square));
});

test('seeded dice reroll ties and the winner trades initiative for one non-royal charge',()=>{
  let chosen;
  for(let seed=1;seed<200;seed++){const state=deployed(seed),roll=rollInitiative(state);if(roll.rolls.length>1){chosen=state;break;}}
  assert.ok(chosen,'some deterministic seeds produce tied rolls');
  const winner=chosen.dice.winner;
  for(const roll of chosen.dice.rolls.slice(0,-1))assert.equal(roll.w,roll.b);
  assert.notEqual(chosen.dice.w,chosen.dice.b);
  assert.equal(chooseInitiative(chosen,winner==='w'?'b':'w',{first:true}).ok,false);
  assert.equal(chooseInitiative(chosen,winner,{first:false,unitId:`${winner}-q`}).ok,false);
  assert.equal(chooseInitiative(chosen,winner,{first:false,unitId:`${winner}-k`}).ok,false);
  assert.equal(chooseInitiative(chosen,winner,{first:false,unitId:`${winner}-n`}).ok,true);
  assert.notEqual(chosen.firstSide,winner);assert.equal(unit(chosen,`${winner}-n`).charged,true);
  const copy=deployed(43),again=deployed(43);assert.deepEqual(rollInitiative(copy),rollInitiative(again));
});

test('opening quotas count occupied moves as attacks; later rounds allow three free actions',()=>{
  const state=fixture({'w-r':'d4','b-r':'d6'},1);
  assert.deepEqual(roundRules(state),{seconds:10,actions:2,maxMoves:1,maxOther:1});
  assert.equal(orderCategory(state,{kind:'move',target:'d6'}),'other');
  assert.equal(submitPlan(state,'w',[{unitId:'w-r',kind:'move',target:'d6'},{unitId:'w-r',kind:'attack',direction:'N'}]).ok,false);
  assert.equal(submitPlan(state,'w',[{unitId:'w-r',kind:'move',target:'d5'},{unitId:'w-r',kind:'attack',direction:'N'}]).ok,true);
  const later=fixture({'w-r':'d4','b-r':'d6'});
  assert.equal(roundRules(later).seconds,10);
  assert.equal(submitPlan(later,'w',[{unitId:'w-r',kind:'block'},{unitId:'w-r',kind:'focus'},{unitId:'w-r',kind:'ultimate'}]).ok,true);
});

test('sealed plans stay hidden and resolve A1 B1 A2 B2 without using future enemy orders',()=>{
  const state=fixture({'w-r':'c3','b-r':'f6'},1);
  const w=[{unitId:'w-r',kind:'move',target:'c4'},{unitId:'w-r',kind:'focus'}];
  const b=[{unitId:'b-r',kind:'focus'},{unitId:'b-r',kind:'move',target:'f5'}];
  assert.equal(submitPlan(state,'w',w).ok,true);
  assert.deepEqual(publicView(state,'b').plans.w,[]);
  assert.equal(submitPlan(state,'b',b).ok,true);
  const events=[];while(state.phase==='resolution')events.push(resolveNext(state).event);
  assert.deepEqual(events.map(event=>event.side),['w','b','w','b']);
  assert.deepEqual(events.map(event=>event.kind),['move','focus','focus','move']);
  assert.equal(state.round,2);assert.equal(state.phase,'planning');assert.deepEqual(state.ready,{w:false,b:false});
  assert.equal(state.firstSide,'b','the opening roll grants only the first round initiative');
  const secondRound=duel(state,[{unitId:'w-r',kind:'block'}],[{unitId:'b-r',kind:'block'}]);
  assert.deepEqual(secondRound.map(event=>event.side),['b','w','b','w']);
  assert.equal(state.firstSide,'w','initiative alternates again for round three');
});

test('movement keeps chess paths, knight jumps and pawn double step; terrain blocks landing',()=>{
  const state=fixture({'w-r':'d4','w-p1':'d5','w-n':'b1','w-p2':'e2','b-p1':'e3'});
  assert.ok(getLegalMoves(state,'w-r').includes('d5'));assert.ok(!getLegalMoves(state,'w-r').includes('d6'));
  assert.ok(getLegalMoves(state,'w-n').includes('c3'));
  assert.ok(getLegalMoves(state,'w-p2').includes('e3'));assert.ok(!getLegalMoves(state,'w-p2').includes('e4'));
  unit(state,'b-p1').square='g6';assert.ok(getLegalMoves(state,'w-p2').includes('e4'));
  state.tiles.c3={kind:'void'};assert.ok(!getLegalMoves(state,'w-n').includes('c3'));
  state.tiles.e3={kind:'obstacle'};assert.ok(!getLegalMoves(state,'w-p2').includes('e3'));
});

test('basic ray attacks stand still, stop at first piece and damage allies',()=>{
  const state=fixture({'w-r':'d4','w-p1':'d5','b-p1':'d6'});
  assert.deepEqual(getAttackTargets(state,'w-r','N'),['d5']);
  const result=previewPlan(state,'w',[{unitId:'w-r',kind:'attack',direction:'N'}]);
  assert.equal(unit(result,'w-r').square,'d4');assert.equal(unit(result,'w-p1').hp,2);assert.equal(unit(result,'b-p1').hp,6);
  assert.equal(unit(state,'w-p1').hp,6,'forecast is isolated');
  const moved=previewPlan(state,'w',[{unitId:'w-r',kind:'move',target:'d5'}]);
  assert.equal(unit(moved,'w-r').square,'d4');assert.equal(unit(moved,'w-p1').hp,2);
});

test('knight basic attack strikes exactly its selected pair and ultimate all eight squares',()=>{
  const state=fixture({'w-n':'d4','b-p1':'b5','b-p2':'c6','b-p3':'f5'});
  assert.deepEqual(getAttackTargets(state,'w-n','NW').sort(),['b5','c6']);
  const basic=previewPlan(state,'w',[{unitId:'w-n',kind:'attack',direction:'NW'}]);
  assert.ok(unit(basic,'b-p1').hp<6&&unit(basic,'b-p2').hp<6);assert.equal(unit(basic,'b-p3').hp,6);
  unit(state,'w-n').charged=true;
  const nova=previewPlan(state,'w',[{unitId:'w-n',kind:'ultimate'}]);
  assert.ok(unit(nova,'b-p3').hp<6);assert.equal(unit(nova,'w-n').charged,false);
});

test('six HP survive three frontal hits but only a front plus flank hit',()=>{
  const state=fixture({'w-r':'d4','b-r':'d7','b-q':'g4'});
  assert.equal(incomingDamage(unit(state,'b-r'),unit(state,'w-r')),2);
  assert.equal(incomingDamage(unit(state,'b-q'),unit(state,'w-r')),4);
  const twice=previewPlan(state,'b',[{unitId:'b-r',kind:'attack',direction:'S'},{unitId:'b-r',kind:'attack',direction:'S'}]);
  assert.equal(unit(twice,'w-r').hp,2);
  const third=previewPlan(twice,'b',[{unitId:'b-r',kind:'attack',direction:'S'}]);assert.equal(unit(third,'w-r').hp,0);
  const flanked=previewPlan(state,'b',[{unitId:'b-r',kind:'attack',direction:'S'},{unitId:'b-q',kind:'attack',direction:'W'}]);
  assert.equal(unit(flanked,'w-r').hp,0);
});

test('only an actual movement grants a free facing choice, not an attack or occupied move',()=>{
  const state=fixture({'w-r':'d4','b-r':'d6'});
  for(const order of [{kind:'attack',direction:'N'},{kind:'move',target:'d6'},{kind:'focus'},{kind:'block'}]){
    const result=previewPlan(state,'w',[{unitId:'w-r',...order,facing:'S'}]);
    assert.equal(unit(result,'w-r').facing,'N');
  }
  const moved=previewPlan(state,'w',[{unitId:'w-r',kind:'move',target:'c4',facing:'S'}]);
  assert.equal(unit(moved,'w-r').facing,'S');
});

test('guards, armor and reflect consume bounded resources; focus charges a spent ultimate',()=>{
  const state=fixture({'w-r':'d4','b-r':'d7'});unit(state,'w-r').charged=true;
  const defended=previewPlan(state,'w',[{unitId:'w-r',kind:'ultimate'},{unitId:'w-r',kind:'block'}]);
  const hit=previewPlan(defended,'b',[{unitId:'b-r',kind:'attack',direction:'S'}]);
  assert.equal(unit(hit,'w-r').hp,5);assert.equal(unit(hit,'w-r').armor,1);assert.equal(unit(hit,'w-r').guard,0);assert.equal(unit(hit,'w-r').reflect,1);assert.equal(unit(hit,'b-r').hp,5);
  assert.equal(validateOrder(hit,'w',{unitId:'w-r',kind:'ultimate'}).ok,false);
  const focused=previewPlan(hit,'w',[{unitId:'w-r',kind:'focus'}]);assert.equal(unit(focused,'w-r').charged,true);
  assert.equal(validateOrder(focused,'w',{unitId:'w-r',kind:'focus'}).ok,false);
});

test('bishop ultimate hits the first target in all four diagonals without x-ray',()=>{
  const state=fixture({'w-b':'d4','b-p1':'e5','b-r':'f6','b-p2':'c5','b-p3':'e3','w-p1':'c3'});unit(state,'w-b').charged=true;
  const result=previewPlan(state,'w',[{unitId:'w-b',kind:'ultimate'}]);
  for(const id of ['b-p1','b-p2','b-p3','w-p1'])assert.ok(unit(result,id).hp<6);
  assert.equal(unit(result,'b-r').hp,6);assert.equal(unit(result,'w-b').square,'d4');
});

test('healing is capped, traps trigger on allies too, and obstacles expire after two rounds',()=>{
  const state=fixture({'w-b':'c4','w-p1':'d4','w-r':'d5','b-r':'g6'});unit(state,'w-b').charged=true;unit(state,'w-r').hp=5;
  const healed=previewPlan(state,'w',[{unitId:'w-b',kind:'ultimate',mode:'heal',target:'d5'}]);assert.equal(unit(healed,'w-r').hp,6);
  const trapState=structuredClone(state);trapState.tiles.e5={kind:'trap',owner:'w'};const trapped=previewPlan(trapState,'w',[{unitId:'w-r',kind:'move',target:'e5'}]);
  assert.equal(unit(trapped,'w-r').hp,3);assert.equal(trapped.tiles.e5,undefined);
  unit(state,'w-r').charged=true;
  const barricade=previewPlan(state,'w',[{unitId:'w-r',kind:'ultimate',mode:'obstacle',target:'e5'}]);
  assert.equal(barricade.tiles.e5.expires,5);assert.ok(!getLegalMoves(barricade,'w-r').includes('e5'));
  duel(barricade,[]);assert.ok(barricade.tiles.e5);duel(barricade,[]);assert.equal(barricade.tiles.e5,undefined);
});

test('queen fractures are permanent, cannot destroy occupied squares and are globally capped',()=>{
  const state=fixture({'w-q':'d4','b-q':'f6','w-p1':'e4'});unit(state,'w-q').charged=true;
  assert.equal(validateOrder(state,'w',{unitId:'w-q',kind:'ultimate',mode:'fracture',target:'e4'}).ok,false);
  const once=previewPlan(state,'w',[{unitId:'w-q',kind:'ultimate',mode:'fracture',target:'c4'}]);
  assert.equal(once.tiles.c4.kind,'void');
  unit(once,'b-q').charged=true;const twice=previewPlan(once,'b',[{unitId:'b-q',kind:'ultimate',mode:'fracture',target:'f5'}]);
  assert.equal(twice.fractures,2);unit(twice,'w-q').charged=true;
  assert.equal(validateOrder(twice,'w',{unitId:'w-q',kind:'ultimate',mode:'fracture',target:'d5'}).ok,false);
});

test('king rally protects nearby allies and boosts only their next attack',()=>{
  const state=fixture({'w-k':'d4','w-r':'d5','b-r':'d7'});unit(state,'w-k').hp=3;
  const rally=previewPlan(state,'w',[{unitId:'w-k',kind:'ultimate'}]);
  assert.equal(unit(rally,'w-k').hp,5);assert.equal(unit(rally,'w-r').armor,1);assert.equal(unit(rally,'w-r').boost,1);
  const attack=previewPlan(rally,'w',[{unitId:'w-r',kind:'attack',direction:'N'}]);
  assert.equal(unit(attack,'b-r').hp,3);assert.equal(unit(attack,'w-r').boost,0);
});

test('stale orders fizzle but preserve the interleaved slot; killing a king ends immediately',()=>{
  const state=fixture({'w-r':'d4','b-r':'d5','b-k':'d8'},3);unit(state,'b-r').hp=2;
  assert.equal(submitPlan(state,'w',[{unitId:'w-r',kind:'attack',direction:'N'}]).ok,true);
  assert.equal(submitPlan(state,'b',[{unitId:'b-r',kind:'attack',direction:'S'}]).ok,true);
  const first=resolveNext(state),second=resolveNext(state);
  assert.equal(first.event.targets[0].dead,true);assert.equal(second.event.kind,'fizzle');
  const lethal=fixture({'w-r':'d4','b-k':'d8'});unit(lethal,'b-k').hp=2;
  assert.equal(submitPlan(lethal,'w',[{unitId:'w-r',kind:'attack',direction:'N'}]).ok,true);
  assert.equal(submitPlan(lethal,'b',[{unitId:'b-k',kind:'move',target:'e8'}]).ok,true);
  const end=resolveNext(lethal);assert.equal(end.event.winner,'w');assert.equal(lethal.phase,'finished');assert.equal(end.done,true);assert.equal(resolveNext(lethal).ok,false);
});

test('forecast and public observation do not consume, reveal, or depend on sealed enemy orders',()=>{
  const state=fixture({'w-r':'d4','b-r':'f6'});state.plans.b=[{unitId:'b-r',kind:'move',target:'d6'}];state.ready.b=true;
  const before=structuredClone(state),plan=[{unitId:'w-r',kind:'move',target:'d5',facing:'E'},{unitId:'w-r',kind:'attack',direction:'N'}];
  const projected=previewPlan(state,'w',plan);assert.equal(unit(projected,'w-r').square,'d5');assert.equal(unit(projected,'w-r').facing,'E');assert.deepEqual(projected.forecastErrors,[]);
  const alternative=structuredClone(state);alternative.plans.b=[{unitId:'b-r',kind:'focus'}];
  assert.deepEqual(previewPlan(state,'w',plan),previewPlan(alternative,'w',plan));assert.deepEqual(state,before);
  const view=publicView(state,'w');assert.deepEqual(view.plans.b,[]);view.units[0].hp=0;assert.deepEqual(state,before);
});

test('pawns always advance up to two clear squares, can move diagonally and sweep all four forward cells',()=>{
  const state=fixture({'w-p1':'d4','b-p1':'c5','b-p2':'d5','b-p3':'e5','b-r':'d6'});unit(state,'w-p1').hasMoved=true;unit(state,'w-p1').charged=true;
  assert.ok(getLegalMoves(state,'w-p1').includes('c5'));assert.ok(!getLegalMoves(state,'w-p1').includes('d6'),'movement cannot jump a body');
  const result=previewPlan(state,'w',[{unitId:'w-p1',kind:'ultimate'}]);for(const id of ['b-p1','b-p2','b-p3','b-r'])assert.ok(unit(result,id).hp<6);
  unit(state,'b-p2').square='a7';assert.ok(getLegalMoves(state,'w-p1').includes('d6'),'double step remains available away from home');unit(state,'b-p1').square='a6';assert.ok(getLegalMoves(state,'w-p1').includes('c5'),'diagonal movement does not require a capture');
});
