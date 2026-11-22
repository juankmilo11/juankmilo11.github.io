import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,autoDeploy,confirmDeployment,rollInitiative,chooseInitiative,roundRules,publicView,getLegalMoves,getAttackTargets,getAttackSquares,getUltimateTargets,attackOrderFor,validateOrder,validatePlan,previewPlan,submitPlan,resolveNext,incomingDamage} from '../src/tactics-engine.js';
import {describeBattleEvent} from '../src/tactics-presentation.js';
const unit=(s,id)=>s.units.find(u=>u.id===id);
function fixture(placements={},round=1){const s=createMatch({seed:123});Object.assign(s,{phase:'planning',round,deployed:{w:true,b:true}});const positions={'w-k':'a1','b-k':'h8',...placements};s.units=s.units.filter(u=>Object.hasOwn(positions,u.id));for(const u of s.units)u.square=positions[u.id];return s;}
function deployed(seed=1){const s=createMatch({seed});for(const side of ['w','b']){autoDeploy(s,side);confirmDeployment(s,side);}return s;}
function duel(s,w=[],b=[]){for(const [side,orders]of [['w',w],['b',b]]){const r=submitPlan(s,side,orders);assert.equal(r.ok,true,r.error);}const events=[];while(s.phase==='resolution')events.push(resolveNext(s).event);return events;}
const attack=(s,id,target)=>attackOrderFor(s,id,target);

test('both standard sixteen-piece armies and every king start without charge',()=>{
 const a=deployed(1),b=deployed(999);assert.deepEqual(a.units.map(u=>u.square),b.units.map(u=>u.square));assert.equal(new Set(a.units.map(u=>u.square)).size,32);
 for(const color of ['w','b']){const army=a.units.filter(u=>u.color===color);assert.equal(army.length,16);for(const [type,count]of Object.entries({p:8,r:2,n:2,b:2,q:1,k:1}))assert.equal(army.filter(u=>u.type===type).length,count);}
 for(const [id,square]of Object.entries({'w-r':'a1','w-r2':'h1','w-n':'b1','w-n2':'g1','w-q':'d1','w-k':'e1','b-k':'e8','b-p8':'h7'}))assert.equal(unit(a,id).square,square);
 assert.ok(a.units.every(u=>u.hp===6&&!u.charged));
});
test('initiative grants no charge advantage whichever side the dice winner chooses',()=>{
 for(const first of [true,false]){const s=deployed(43),copy=deployed(43);assert.deepEqual(rollInitiative(s),rollInitiative(copy));const winner=s.dice.winner;assert.equal(chooseInitiative(s,winner==='w'?'b':'w').ok,false);assert.equal(chooseInitiative(s,winner,{first}).ok,true);assert.equal(s.firstSide,first?winner:winner==='w'?'b':'w');assert.ok(s.units.every(u=>!u.charged));}
});
test('every round has two actions and fifteen seconds per action',()=>{for(const round of [1,2,3,40])assert.deepEqual(roundRules(round),{seconds:15,actions:2,maxMoves:2,maxOther:2});});
test('the same piece cannot repeat a kind; different pieces may share a kind',()=>{
 const s=fixture({'w-r':'d4','w-r2':'f4','b-r':'d6'});
 assert.equal(validatePlan(s,'w',[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r',kind:'move',target:'e5'}]).ok,false);
 const blocked=validatePlan(s,'w',[{unitId:'w-r',kind:'block'},{unitId:'w-r',kind:'block'}]);assert.equal(blocked.ok,false);assert.match(blocked.error,/repetir/);
 assert.equal(validatePlan(s,'w',[attack(s,'w-r','d6'),attack(s,'w-r','d6')]).ok,false);
 assert.equal(validatePlan(s,'w',[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r2',kind:'move',target:'f5'}]).ok,true);
 assert.equal(validatePlan(s,'w',[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r',kind:'focus'}]).ok,true);
 assert.equal(validatePlan(s,'w',[{kind:'pass'},{kind:'pass'}]).ok,true);
 assert.equal(validatePlan(s,'w',[{kind:'pass'},{kind:'pass'},{kind:'pass'}]).ok,false);
});
test('basic attacks require an occupied legal target and moves require an empty square',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5','b-r':'d6'});
 for(const order of [{kind:'attack',direction:'N'},{kind:'attack',target:'e4'},{kind:'attack',target:'d6'},{kind:'move',target:'d5'}])assert.equal(validateOrder(s,'w',{unitId:'w-r',...order}).ok,false);
 assert.equal(validateOrder(s,'w',attack(s,'w-r','d5')).ok,true);assert.equal(validateOrder(s,'w',{unitId:'w-r',kind:'attack',target:'d5',direction:'S'}).ok,false);
 assert.ok(getAttackSquares(s,'w-r').includes('d5'));assert.ok(!getAttackSquares(s,'w-r').includes('d6'));
});
test('stationary ray attacks damage the selected ally and do not pass through it',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5','b-p1':'d6'}),before=structuredClone(s),result=previewPlan(s,'w',[attack(s,'w-r','d5')]);
 assert.equal(unit(result,'w-r').square,'d4');assert.equal(unit(result,'w-p1').hp,2);assert.equal(unit(result,'b-p1').hp,6);assert.deepEqual(s,before);
});
test('knight selection identifies a quadrant: both L targets are struck, including allies',()=>{
 const s=fixture({'w-n':'d4','b-p1':'b5','w-p1':'c6','b-p2':'f5'});assert.deepEqual(getAttackTargets(s,'w-n','NW').sort(),['b5','c6']);
 const hit=previewPlan(s,'w',[attack(s,'w-n','b5')]);assert.ok(unit(hit,'b-p1').hp<6&&unit(hit,'w-p1').hp<6);assert.equal(unit(hit,'b-p2').hp,6);
 unit(s,'w-n').charged=true;assert.ok(unit(previewPlan(s,'w',[{unitId:'w-n',kind:'ultimate'}]),'b-p2').hp<6);
});
test('pawns keep repeated double steps and empty diagonals while respecting blocked paths',()=>{
 const s=fixture({'w-p1':'d4','b-p1':'d5'});unit(s,'w-p1').hasMoved=true;
 assert.ok(getLegalMoves(s,'w-p1').includes('c5'));assert.ok(!getLegalMoves(s,'w-p1').includes('d6'));
 assert.ok(attack(s,'w-p1','d5'));unit(s,'b-p1').square='d6';assert.ok(attack(s,'w-p1','d6'));
 unit(s,'b-p1').square='h6';assert.ok(getLegalMoves(s,'w-p1').includes('d6'));s.tiles.d5={kind:'obstacle'};assert.ok(!getLegalMoves(s,'w-p1').includes('d6'));
});
test('front damage is two, flanks/rear four; face changes only on movement',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7','b-q':'g4'});assert.equal(incomingDamage(unit(s,'b-r'),unit(s,'w-r')),2);assert.equal(incomingDamage(unit(s,'b-q'),unit(s,'w-r')),4);
 let next=s;for(let i=0;i<3;i++)next=previewPlan(next,'b',[attack(next,'b-r','d4')]);assert.equal(unit(next,'w-r').hp,0);
 assert.equal(unit(previewPlan(s,'w',[{...attack(s,'w-r','d7'),facing:'S'}]),'w-r').facing,'N');
 const moved=previewPlan(s,'w',[{unitId:'w-r',kind:'move',target:'c4',facing:'W'}]);assert.equal(unit(moved,'w-r').facing,'W');
 const unchanged=previewPlan(s,'w',[{unitId:'w-r',kind:'move',target:'c4'}]);assert.equal(unit(unchanged,'w-r').square,'c4');assert.equal(unit(unchanged,'w-r').facing,'N');
});
test('block returns received damage this round only, without reflection chains',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7'}),defended=previewPlan(s,'w',[{unitId:'w-r',kind:'block'}]);
 const hit=previewPlan(defended,'b',[attack(defended,'b-r','d4')]);assert.equal(unit(hit,'w-r').hp,5);assert.equal(unit(hit,'b-r').hp,5);assert.equal(unit(hit,'w-r').guard,0);
 const both=previewPlan(defended,'b',[{unitId:'b-r',kind:'block'},attack(defended,'b-r','d4')]);assert.equal(unit(both,'b-r').hp,5);
 duel(hit);assert.equal(unit(hit,'w-r').counterUntil,0);const expired=previewPlan(hit,'b',[attack(hit,'b-r','d4')]);assert.equal(unit(expired,'b-r').hp,5);
});
test('all six ultimates use their entire class area, consume charge and preserve position',()=>{
 const cases={p:{'w-p1':'d4','b-p1':'c5','b-p2':'d5','b-p3':'e5','b-r':'d6'},n:{'w-n':'d4','b-p1':'b5','b-p2':'c6','b-p3':'f5'},b:{'w-b':'d4','b-p1':'e5','b-p2':'c5','w-p1':'c3','b-r':'f6'},r:{'w-r':'d4','b-p1':'e4','b-p2':'d5','w-p1':'d3','b-r':'d6'},q:{'w-q':'d4','b-p1':'e4','b-p2':'e5','w-p1':'d3','b-r':'f6'},k:{'w-k':'d4','b-p1':'e4','b-p2':'e5','w-p1':'d3','b-r':'d6'}};
 for(const [type,positions]of Object.entries(cases)){const s=fixture(positions),id=`w-${type}${type==='p'?'1':''}`;unit(s,id).charged=true;assert.ok(getUltimateTargets(s,id).length);const result=previewPlan(s,'w',[{unitId:id,kind:'ultimate'}]);assert.equal(unit(result,id).charged,false);assert.equal(unit(result,id).square,'d4');for(const victim of ['b-p1','b-p2'])assert.ok(unit(result,victim).hp<6);if(type==='p')assert.ok(unit(result,'b-r').hp<6);else if(['b','r','q','k'].includes(type))assert.equal(unit(result,'b-r').hp,6,'ray/body or king range blocks a second victim');if(type!=='p'&&type!=='n')assert.ok(unit(result,'w-p1').hp<6,'friendly fire');}
});
test('Focus then ultimate is a legal two-kind combination from the first round',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),result=validatePlan(s,'w',[{unitId:'w-r',kind:'focus'},{unitId:'w-r',kind:'ultimate'}]);assert.equal(result.ok,true);assert.ok(unit(result.forecast,'b-r').hp<6);assert.equal(unit(result.forecast,'w-r').charged,false);
});
test('two actions interleave A1 B1 A2 B2, stay secret and alternate initiative next round',()=>{
 const s=fixture({'w-r':'c3','b-r':'f6'}),w=[{unitId:'w-r',kind:'move',target:'c4'},{unitId:'w-r',kind:'focus'}],b=[{unitId:'b-r',kind:'focus'},{unitId:'b-r',kind:'move',target:'f5'}];
 assert.equal(submitPlan(s,'w',w).ok,true);assert.deepEqual(publicView(s,'b').plans.w,[]);assert.equal(submitPlan(s,'b',b).ok,true);
 const events=[];while(s.phase==='resolution')events.push(resolveNext(s).event);assert.deepEqual(events.map(e=>e.side),['w','b','w','b']);assert.deepEqual(events.map(e=>e.kind),['move','focus','focus','move']);assert.equal(s.round,2);assert.equal(s.firstSide,'b');
});
test('a selected attack whose target moved fizzles rather than turning into a move',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'});s.firstSide='b';const events=duel(s,[attack(s,'w-r','d6')],[{unitId:'b-r',kind:'move',target:'e6'}]);assert.equal(events[1].kind,'fizzle');assert.equal(unit(s,'w-r').square,'d4');assert.equal(unit(s,'b-r').hp,6);
});
test('a committed empty-square move that becomes occupied fizzles without a hidden attack',()=>{
 const s=fixture({'w-r':'d4','b-r':'f4'});s.firstSide='b';const events=duel(s,[{unitId:'w-r',kind:'move',target:'e4'}],[{unitId:'b-r',kind:'move',target:'e4'}]);assert.equal(events[1].kind,'fizzle');assert.equal(unit(s,'w-r').square,'d4');assert.equal(unit(s,'b-r').hp,6);
});
test('king death ends immediately; a reflected killing blow can draw',()=>{
 const s=fixture({'w-r':'d4','b-k':'d8'});unit(s,'b-k').hp=2;assert.equal(submitPlan(s,'w',[attack(s,'w-r','d8')]).ok,true);assert.equal(submitPlan(s,'b',[]).ok,true);assert.equal(resolveNext(s).winner,'w');assert.equal(resolveNext(s).ok,false);
 const both=fixture({'w-k':'d4','b-k':'d5'});unit(both,'w-k').hp=unit(both,'b-k').hp=1;const defended=previewPlan(both,'b',[{unitId:'b-k',kind:'block'}]);assert.equal(previewPlan(defended,'w',[attack(defended,'w-k','d5')]).winner,'draw');
});
test('forecasts do not mutate the source or depend on the sealed enemy plan',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),before=structuredClone(s),orders=[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r',kind:'focus'}],a=previewPlan(s,'w',orders);assert.deepEqual(s,before);const secret=structuredClone(s);secret.plans.b=[{unitId:'b-r',kind:'move',target:'e6'}];assert.deepEqual(previewPlan(secret,'w',orders),a);
});
test('review action captions use arrows rather than cardinal-letter directions',()=>{
 const s=fixture({'w-r':'d4','b-r':'f4'});assert.equal(describeBattleEvent({kind:'attack',unitId:'w-r',direction:'E',target:'f4',targets:[]},s),'Torre: ataque → f4');assert.match(describeBattleEvent({kind:'move',unitId:'w-r',from:'d4',to:'e4',facing:'N'},s),/↑/);
});
