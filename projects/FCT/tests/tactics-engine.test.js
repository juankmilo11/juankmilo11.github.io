import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,autoDeploy,confirmDeployment,rollInitiative,chooseInitiative,roundRules,publicView,getLegalMoves,getAttackTargets,getAttackSquares,getUltimateTargets,attackOrderFor,validateOrder,validatePlan,previewPlan,submitPlan,resolveNext,incomingDamage,getCastleOptions} from '../src/tactics-engine.js';
import {Chess} from 'chess.js';
import {reverseBattleEvent} from '../src/tactics-animation.js';
import {describeBattleEvent,describePlannedOrder} from '../src/tactics-presentation.js';
const unit=(s,id)=>s.units.find(u=>u.id===id);
function fixture(placements={},round=1){const s=createMatch({seed:123});Object.assign(s,{phase:'planning',round,deployed:{w:true,b:true}});const positions={'w-k':'a1','b-k':'h8',...placements};s.units=s.units.filter(u=>Object.hasOwn(positions,u.id));for(const u of s.units){u.square=positions[u.id];u.homeSquare=u.square;}return s;}
function deployed(seed=1){const s=createMatch({seed});for(const side of ['w','b']){autoDeploy(s,side);confirmDeployment(s,side);}return s;}
function duel(s,w=[],b=[]){for(const [side,orders]of [['w',w],['b',b]]){const r=submitPlan(s,side,orders);assert.equal(r.ok,true,r.error);}const events=[];while(s.phase==='resolution')events.push(resolveNext(s).event);return events;}
const attack=(s,id,target)=>attackOrderFor(s,id,target);

test('seeded Chess960 layouts are mirrored, legal and varied',()=>{
 const layouts=new Set();for(let seed=1;seed<=960;seed++){const a=deployed(seed),white=a.units.filter(u=>u.color==='w'&&u.type!=='p').sort((a,b)=>a.square.localeCompare(b.square)),black=a.units.filter(u=>u.color==='b'&&u.type!=='p').sort((a,b)=>a.square.localeCompare(b.square));const types=white.map(u=>u.type);assert.deepEqual(types,black.map(u=>u.type));const bishops=white.filter(u=>u.type==='b').map(u=>u.square.charCodeAt(0)%2);assert.notEqual(...bishops);assert.ok(types.indexOf('r')<types.indexOf('k')&&types.indexOf('k')<types.lastIndexOf('r'));assert.equal(new Set(a.units.map(u=>u.square)).size,32);assert.ok(a.units.every(u=>u.hp===6&&!u.charged));layouts.add(types.join(''));}assert.ok(layouts.size>400);assert.deepEqual(deployed(43),deployed(43));
});

test('initiative grants no charge advantage whichever side the dice winner chooses',()=>{
 for(const first of [true,false]){const s=deployed(43),copy=deployed(43);assert.deepEqual(rollInitiative(s),rollInitiative(copy));const winner=s.dice.winner;assert.equal(chooseInitiative(s,winner==='w'?'b':'w').ok,false);assert.equal(chooseInitiative(s,winner,{first}).ok,true);assert.equal(s.firstSide,first?winner:winner==='w'?'b':'w');assert.ok(s.units.every(u=>!u.charged));}
});
test('every round has two actions and twenty seconds per action',()=>{for(const round of [1,2,3,40])assert.deepEqual(roundRules(round),{seconds:20,actions:2,maxMoves:2,maxOther:2});});
test('the same piece cannot repeat a kind; different pieces may share a kind',()=>{
 const s=fixture({'w-r':'d4','w-r2':'f4','b-r':'d6'});
 assert.equal(validatePlan(s,'w',[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r',kind:'move',target:'e5'}]).ok,false);
 const blocked=validatePlan(s,'w',[{unitId:'w-r',kind:'block'},{unitId:'w-r',kind:'block'}]);assert.equal(blocked.ok,false);assert.match(blocked.error,/repetir|escudo/);
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
 assert.equal(unit(result,'w-r').square,'d4');assert.equal(unit(result,'w-p1').hp,4);assert.equal(unit(result,'b-p1').hp,6);assert.deepEqual(s,before);
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
test('all damage is two, independent of direction, obsolete bonuses or facing',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7','b-q':'g4'});Object.assign(unit(s,'w-r'),{facing:'S',armor:20});Object.assign(unit(s,'b-q'),{boost:10});assert.equal(incomingDamage(unit(s,'b-r'),unit(s,'w-r')),2);assert.equal(incomingDamage(unit(s,'b-q'),unit(s,'w-r')),2);
 const hit=previewPlan(s,'b',[attack(s,'b-q','d4')]);assert.equal(unit(hit,'w-r').hp,4);
 let next=s;for(let i=0;i<3;i++)next=previewPlan(next,'b',[attack(next,'b-r','d4')]);assert.equal(unit(next,'w-r').hp,0);
 const order=validateOrder(s,'w',{unitId:'w-r',kind:'move',target:'c4',facing:'W'}).order;assert.equal(Object.hasOwn(order,'facing'),false);
});

test('one-use shield persists, absorbs completely and reflects without chains',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7'}),defended=previewPlan(s,'w',[{unitId:'w-r',kind:'block'}]);duel(defended);duel(defended);assert.equal(unit(defended,'w-r').guard,1);
 const hit=previewPlan(defended,'b',[attack(defended,'b-r','d4')]);assert.equal(unit(hit,'w-r').hp,6);assert.equal(unit(hit,'b-r').hp,4);assert.equal(unit(hit,'w-r').guard,0);assert.equal(validateOrder(hit,'w',{unitId:'w-r',kind:'block'}).ok,false);
 const both=previewPlan(defended,'b',[{unitId:'b-r',kind:'block'},attack(defended,'b-r','d4')]);assert.equal(unit(both,'b-r').hp,4);assert.equal(unit(both,'b-r').guard,1);
});
test('king shield expires after current and next round and cannot recharge',()=>{
 const s=previewPlan(fixture(), 'w',[{unitId:'w-k',kind:'block'}]);duel(s);assert.equal(unit(s,'w-k').guard,1);duel(s);assert.equal(unit(s,'w-k').guard,0);assert.equal(validateOrder(s,'w',{unitId:'w-k',kind:'block'}).ok,false);
});

test('all six ultimates use their entire class area, consume charge and preserve position',()=>{
 const cases={p:{'w-p1':'d4','b-p1':'c5','b-p2':'d5','b-p3':'e5','b-r':'d6'},n:{'w-n':'d4','b-p1':'b5','b-p2':'c6','b-p3':'f5'},b:{'w-b':'d4','b-p1':'e5','b-p2':'c5','w-p1':'c3','b-r':'f6'},r:{'w-r':'d4','b-p1':'e4','b-p2':'d5','w-p1':'d3','b-r':'d6'},q:{'w-q':'d4','b-p1':'e4','b-p2':'e5','w-p1':'d3','b-r':'f6'},k:{'w-k':'d4','b-p1':'e4','b-p2':'e5','w-p1':'d3','b-r':'d6'}};
 for(const [type,positions]of Object.entries(cases)){const s=fixture(positions),id=`w-${type}${type==='p'?'1':''}`;unit(s,id).charged=true;assert.ok(getUltimateTargets(s,id).length);const result=previewPlan(s,'w',[{unitId:id,kind:'ultimate'}]);assert.equal(unit(result,id).charged,false);assert.equal(unit(result,id).square,'d4');for(const victim of ['b-p1','b-p2'])assert.ok(unit(result,victim).hp<6);if(type==='p')assert.ok(unit(result,'b-r').hp<6);else if(['b','r','q','k'].includes(type))assert.equal(unit(result,'b-r').hp,6,'ray/body or king range blocks a second victim');if(type!=='p'&&type!=='n')assert.ok(unit(result,'w-p1').hp<6,'friendly fire');}
});
test('Focus then ultimate is a legal two-kind combination from the first round',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),result=validatePlan(s,'w',[{unitId:'w-r',kind:'focus'},{unitId:'w-r',kind:'ultimate'}]);assert.equal(result.ok,true);assert.ok(unit(result.forecast,'b-r').hp<6);assert.equal(unit(result.forecast,'w-r').charged,false);
});
test('two actions interleave A1 B1 A2 B2, stay secret and preserve alternation across round boundaries',()=>{
 const s=fixture({'w-r':'c3','b-r':'f6'}),w=[{unitId:'w-r',kind:'move',target:'c4'},{unitId:'w-r',kind:'focus'}],b=[{unitId:'b-r',kind:'focus'},{unitId:'b-r',kind:'move',target:'f5'}];
 assert.equal(submitPlan(s,'w',w).ok,true);assert.deepEqual(publicView(s,'b').plans.w,[]);assert.equal(submitPlan(s,'b',b).ok,true);
 const events=[];while(s.phase==='resolution')events.push(resolveNext(s).event);assert.deepEqual(events.map(e=>e.side),['w','b','w','b']);assert.deepEqual(events.map(e=>e.kind),['move','focus','focus','move']);assert.equal(s.round,2);assert.equal(s.firstSide,'w');
});
test('a directional attack continues when the originally selected target moves',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'});s.firstSide='b';const events=duel(s,[attack(s,'w-r','d6')],[{unitId:'b-r',kind:'move',target:'e6'}]);assert.equal(events[1].kind,'attack');assert.equal(unit(s,'w-r').square,'d4');assert.equal(unit(s,'b-r').hp,6);
});
test('a committed empty-square move that becomes occupied fizzles without a hidden attack',()=>{
 const s=fixture({'w-r':'d4','b-r':'f4'});s.firstSide='b';const events=duel(s,[{unitId:'w-r',kind:'move',target:'e4'}],[{unitId:'b-r',kind:'move',target:'e4'}]);assert.equal(events[1].kind,'fizzle');assert.equal(unit(s,'w-r').square,'d4');assert.equal(unit(s,'b-r').hp,6);
});
test('king death ends immediately; a shield can reflect a killing blow',()=>{
 const s=fixture({'w-r':'d4','b-k':'d8'});unit(s,'b-k').hp=2;assert.equal(submitPlan(s,'w',[attack(s,'w-r','d8')]).ok,true);assert.equal(submitPlan(s,'b',[]).ok,true);assert.equal(resolveNext(s).winner,'w');assert.equal(resolveNext(s).ok,false);
 const both=fixture({'w-k':'d4','b-k':'d5'});unit(both,'w-k').hp=unit(both,'b-k').hp=1;const defended=previewPlan(both,'b',[{unitId:'b-k',kind:'block'}]);assert.equal(previewPlan(defended,'w',[attack(defended,'w-k','d5')]).winner,'b');
});
test('forecasts do not mutate the source or depend on the sealed enemy plan',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),before=structuredClone(s),orders=[{unitId:'w-r',kind:'move',target:'e4'},{unitId:'w-r',kind:'focus'}],a=previewPlan(s,'w',orders);assert.deepEqual(s,before);const secret=structuredClone(s);secret.plans.b=[{unitId:'b-r',kind:'move',target:'e6'}];assert.deepEqual(previewPlan(secret,'w',orders),a);
});
test('review action captions use arrows rather than cardinal-letter directions',()=>{
 const s=fixture({'w-r':'d4','b-r':'f4'});assert.equal(describeBattleEvent({kind:'attack',unitId:'w-r',direction:'E',target:'f4',targets:[]},s),'Torre: ataque → f4');assert.equal(describeBattleEvent({kind:'move',unitId:'w-r',from:'d4',to:'e4'},s),'Torre: d4 → e4');
});

test('continuous alternation holds over multiple rounds, including waits, for either starter',()=>{
 for(const first of ['w','b']){const s=fixture();s.firstSide=first;const all=[];for(let round=0;round<4;round++)all.push(...duel(s).map(e=>e.side));assert.equal(all.length,16);assert.equal(all[0],first);for(let i=1;i<all.length;i++)assert.notEqual(all[i],all[i-1]);}
});
test('castling matches classical king moves on both sides and relocates both pieces',()=>{
 for(const color of ['w','b']){
  const rank=color==='w'?'1':'8',s=fixture({[`${color}-k`]:'e'+rank,[`${color}-r`]:'a'+rank,[`${color}-r2`]:'h'+rank,[color==='w'?'b-k':'w-k']:color==='w'?'e8':'e1'}),fen=color==='w'?'4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1':'r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1',chess=new Chess(fen);
  const expected=chess.moves({square:'e'+rank,verbose:true}).filter(m=>m.isKingsideCastle()||m.isQueensideCastle()).map(m=>m.to).sort();assert.deepEqual(getCastleOptions(s,`${color}-k`).map(c=>c.target).sort(),expected);
  for(const target of ['g','c']){const result=validatePlan(s,color,[{unitId:`${color}-k`,kind:'move',target:target+rank}]);assert.equal(result.ok,true);assert.equal(unit(result.forecast,`${color}-k`).square,target+rank);assert.equal(unit(result.forecast,`${color}-${target==='g'?'r2':'r'}`).square,(target==='g'?'f':'d')+rank);assert.ok(unit(result.forecast,`${color}-k`).hasMoved);}
 }
});
test('castling rejects moved pieces, occupied paths, and threats at start, transit and destination',()=>{
 const base=()=>fixture({'w-k':'e1','w-r':'a1','w-r2':'h1','b-k':'h8'});
 let s=base();unit(s,'w-k').hasMoved=true;assert.deepEqual(getCastleOptions(s,'w-k'),[]);
 s=base();unit(s,'w-r2').hasMoved=true;assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target==='g1'));
 for(const square of ['f1','g1','b1','c1','d1']){s=base();s.units.push({id:'block',type:'p',color:'w',hp:6,square});assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target===('fg'.includes(square[0])?'g1':'c1')));}
 for(const [type,square,target]of [['r','e6','g1'],['b','b5','g1'],['b','c5','g1'],['p','e2','g1']]){s=base();s.units.push({id:'threat',type,color:'b',hp:6,square});assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target===target),`${type} ${square}`);}
});
test('the rook involved in castling consumes its movement for that round',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1'});assert.equal(validatePlan(s,'w',[{unitId:'w-k',kind:'move',target:'g1'},{unitId:'w-r2',kind:'move',target:'f2'}]).ok,false);assert.equal(validatePlan(s,'w',[{unitId:'w-k',kind:'move',target:'g1'},{unitId:'w-r2',kind:'focus'}]).ok,true);
});
test('a castle is revalidated after the preceding enemy order',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1','b-r':'h3','b-k':'e8'});s.firstSide='b';assert.ok(getCastleOptions(s,'w-k').some(c=>c.target==='g1'));const events=duel(s,[{unitId:'w-k',kind:'move',target:'g1'}],[{unitId:'b-r',kind:'move',target:'f3'}]);assert.equal(events[1].kind,'fizzle');assert.equal(unit(s,'w-k').square,'e1');assert.equal(unit(s,'w-r2').square,'h1');
});
test('reverse replay restores damage and both castle paths without executing rules',()=>{
 const before=fixture({'w-r':'d4','b-r':'d6'}),event={kind:'attack',unitId:'w-r',from:'d4',to:'d4',targets:[{id:'b-r',square:'d6',damage:2,hp:4,dead:false}]},copy=structuredClone(before),reversed=reverseBattleEvent(event,before);assert.equal(reversed.targets[0].heal,2);assert.equal(reversed.targets[0].hp,6);assert.deepEqual(before,copy);
 const castle=reverseBattleEvent({kind:'move',from:'e1',to:'g1',castle:{rookId:'w-r2',rookFrom:'h1',rookTo:'f1'},targets:[]},before);assert.equal(castle.from,'g1');assert.equal(castle.to,'e1');assert.equal(castle.castle.rookFrom,'f1');assert.equal(castle.castle.rookTo,'h1');
});

test('revealed orders identify both victims in a knight quadrant and friendly fire',()=>{
 const s=fixture({'w-n':'d4','w-p1':'e6','b-r':'f5'}),text=describePlannedOrder(attack(s,'w-n','f5'),s);assert.match(text,/Caballo d4/);assert.match(text,/↗/);assert.match(text,/Peón e6 \(aliada\)/);assert.match(text,/Torre f5 \(rival\)/);assert.match(text,/2 por impacto/);
 const castle=describePlannedOrder({unitId:'w-k',kind:'move',target:'g1',castle:{rookFrom:'h1',rookTo:'f1'}},fixture({'w-k':'e1'}));assert.match(castle,/e1 → g1/);assert.match(castle,/h1 → f1/);
});

test('resolution hits the first new body on a declared ray, including allies',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6','b-q':'f5'});s.firstSide='b';const events=duel(s,[attack(s,'w-r','d6')],[{unitId:'b-q',kind:'move',target:'d5'}]);assert.equal(events[1].targets[0].id,'b-q');assert.equal(unit(s,'b-q').hp,4);assert.equal(unit(s,'b-r').hp,6);
 const beyond=fixture({'w-r':'d4','b-r':'d6','w-q':'d8'});beyond.firstSide='b';const moved=duel(beyond,[attack(beyond,'w-r','d6')],[{unitId:'b-r',kind:'move',target:'e6'}]);assert.equal(moved[1].targets[0].id,'w-q');assert.equal(unit(beyond,'w-q').hp,4);
});
test('960 castling supports a stationary king, stationary rook and exchanged squares',()=>{
 for(const [king,rook,target,rookTo]of [['g1','h1','g1','f1'],['e1','f1','g1','f1'],['f1','g1','g1','f1']]){const s=fixture({'w-k':king,'w-r2':rook,'b-k':'a8'}),r=validatePlan(s,'w',[{unitId:'w-k',kind:'move',target:rook}]);assert.equal(r.ok,true,r.error);assert.equal(unit(r.forecast,'w-k').square,target);assert.equal(unit(r.forecast,'w-r2').square,rookTo);}
});
