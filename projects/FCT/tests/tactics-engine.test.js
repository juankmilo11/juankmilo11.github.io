import test from 'node:test';
import assert from 'node:assert/strict';
import {Chess} from 'chess.js';
import {UNIT_NAMES,createMatch,autoDeploy,confirmDeployment,beginBattle,startRound,roundRules,livingUnits,unitAt,getLegalMoves,getCaptureSquares,isSquareAttacked,getCastleOptions,validateOrder,validatePlan,previewPlan,submitPlan,resolveNext,publicView} from '../src/tactics-engine.js';
const unit=(s,id)=>s.units.find(u=>u.id===id);
function deployed(seed=1){const s=createMatch({seed});for(const side of ['w','b']){assert.equal(autoDeploy(s,side).ok,true);assert.equal(confirmDeployment(s,side).ok,true);}return s;}
function fixture(placements={},round=3){const s=deployed();beginBattle(s);s.round=round;const positions={'w-k':'a1','b-k':'h8',...placements};s.units=s.units.filter(u=>Object.hasOwn(positions,u.id));for(const u of s.units){u.square=positions[u.id];u.homeSquare=u.square;}return s;}
function duel(s,w=[],b=[]){for(const [side,plan]of [['w',w],['b',b]]){const check=submitPlan(s,side,plan);assert.equal(check.ok,true,check.error);}const events=[];while(s.phase==='resolution')events.push(resolveNext(s).event);return events;}
const move=(id,target,extra={})=>({unitId:id,kind:'move',target,...extra});
const block=id=>({unitId:id,kind:'block'});

test('mirrored seeded Chess960 preserves all pieces and contains no hit points or charges',()=>{
 const layouts=new Set();for(let seed=1;seed<=960;seed++){const s=deployed(seed),armies=['w','b'].map(c=>livingUnits(s,c).filter(u=>u.type!=='p').sort((a,b)=>a.square.localeCompare(b.square))),types=armies[0].map(u=>u.type);assert.deepEqual(types,armies[1].map(u=>u.type));const bishops=armies[0].filter(u=>u.type==='b').map(u=>u.square.charCodeAt(0)%2);assert.notEqual(...bishops);assert.ok(types.indexOf('r')<types.indexOf('k')&&types.indexOf('k')<types.lastIndexOf('r'));assert.equal(new Set(s.units.map(u=>u.square)).size,32);assert.ok(s.units.every(u=>!u.captured&&!Object.hasOwn(u,'hp')&&!Object.hasOwn(u,'maxHp')&&!Object.hasOwn(u,'charged')));layouts.add(types.join(''));}assert.ok(layouts.size>400);assert.deepEqual(deployed(43),deployed(43));
});
test('human starts immediately after readiness, without dice or initiative choices',()=>{
 const s=deployed();assert.equal(s.phase,'ready');assert.equal(Object.hasOwn(s,'dice'),false);assert.equal(beginBattle(s).ok,true);assert.equal(s.phase,'planning');assert.equal(s.firstSide,'w');assert.equal(s.round,1);assert.equal(beginBattle(s).ok,false);
});
test('round budgets grow 1, 2, 3 then stay at 3 with twenty seconds per action',()=>{
 for(const [round,actions]of [[0,1],[1,1],[2,2],[3,3],[40,3]])assert.equal(roundRules(round).actions,actions);assert.equal(roundRules({round:2}).seconds,20);
 const s=fixture({},1);assert.equal(validatePlan(s,'w',[{kind:'pass'},{kind:'pass'}]).ok,false);
});
test('no ranged attack, focus or ultimate order is accepted',()=>{
 const s=fixture({'w-r':'d4'});for(const kind of ['attack','focus','ultimate'])assert.equal(validateOrder(s,'w',{unitId:'w-r',kind,target:'d5'}).ok,false);
});
test('all captures displace the attacker and remove the victim without damage arithmetic',()=>{
 const cases=[['r','d4','d7'],['b','d4','g7'],['n','d4','e6'],['q','d4','g4'],['k','d4','e5'],['p','d4','e5']];
 for(const [type,from,to]of cases){const id='w-'+type+(type==='p'?'1':''),s=fixture({[id]:from,'b-p1':to}),r=previewPlan(s,'w',[move(id,to)]);assert.equal(unit(r,id).square,to);assert.equal(unit(r,'b-p1').captured,true);assert.equal(unitAt(r,to).id,id);assert.equal(r.forecastEvents[0].capture.id,'b-p1');assert.equal(r.forecastEvents[0].targets[0].captured,true);assert.equal(unit(s,'b-p1').captured,false);}
});
test('a captured king ends immediately while kings may otherwise enter attacked squares',()=>{
 const s=fixture({'w-r':'d4','b-k':'d8'}),events=duel(s,[move('w-r','d8')]);assert.equal(s.winner,'w');assert.equal(s.phase,'finished');assert.equal(events.length,1);assert.equal(resolveNext(s).ok,false);
 const exposed=fixture({'w-k':'e4','b-r':'f8'});assert.equal(previewPlan(exposed,'w',[move('w-k','f4')]).forecastEvents[0].kind,'move');
});
test('pawn has ordinary first double step, later single step and capture-only diagonals',()=>{
 const s=fixture({'w-p1':'d2','b-p1':'e3'});assert.ok(getLegalMoves(s,'w-p1').includes('d4'));const r=previewPlan(s,'w',[move('w-p1','d4')]);assert.equal(unit(r,'w-p1').hasMoved,true);assert.ok(!getLegalMoves(r,'w-p1').includes('d6'));assert.equal(unit(previewPlan(s,'w',[move('w-p1','e3')]),'b-p1').captured,true);
 const empty=previewPlan(s,'w',[move('w-p1','c3')]);assert.equal(empty.forecastEvents[0].kind,'fizzle');assert.equal(unit(empty,'w-p1').square,'d2');assert.deepEqual(empty.forecastErrors,[]);
 const front=fixture({'w-p1':'d2','b-p1':'d3'});assert.equal(previewPlan(front,'w',[move('w-p1','d3')]).forecastEvents[0].kind,'fizzle');assert.ok(!getLegalMoves(front,'w-p1').includes('d4'));
 const offHome=fixture({'w-p1':'d4'});assert.ok(!getLegalMoves(offHome,'w-p1').includes('d6'));
});
test('black pawns use the reversed ordinary geometry',()=>{
 const s=fixture({'b-p1':'e7','w-p1':'d6'});assert.ok(getLegalMoves(s,'b-p1').includes('e5'));assert.equal(unit(previewPlan(s,'b',[move('b-p1','d6')]),'w-p1').captured,true);assert.ok(!getLegalMoves(s,'b-p1').includes('d8'));
});
test('predictions may target allied occupied squares but blocked destinations consume the order',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5'}),plan=[move('w-r','d5')];assert.equal(validatePlan(s,'w',plan).ok,true);assert.deepEqual(previewPlan(s,'w',plan).forecastErrors,[]);const events=duel(s,plan);assert.equal(events[0].kind,'fizzle');assert.equal(unit(s,'w-r').square,'d4');assert.equal(unit(s,'w-p1').captured,false);
});
test('an allied occupied prediction recaptures an enemy that replaces the ally',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5','b-r':'f5'});const events=duel(s,[{kind:'pass'},move('w-r','d5')],[move('b-r','d5')]);assert.equal(events[1].capture.id,'w-p1');assert.equal(events[2].capture.id,'b-r');assert.equal(unit(s,'w-r').square,'d5');
});
test('an empty diagonal pawn prediction can capture an arriving enemy',()=>{
 const s=fixture({'w-p1':'d4','b-r':'f5'}),events=duel(s,[{kind:'pass'},move('w-p1','e5')],[move('b-r','e5')]);assert.equal(events[2].capture.id,'b-r');assert.equal(unit(s,'w-p1').square,'e5');
});
test('pieces cannot pass through an intermediate body, even when predicting',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5','b-r':'d7'});assert.equal(validateOrder(s,'w',move('w-r','d7')).ok,false);assert.ok(getLegalMoves(s,'w-r').includes('d5'));
});
test('each side gets one shield for the entire match, on any chosen piece',()=>{
 const s=fixture({'w-r':'d4','w-b':'b2','b-r':'d7'}),r=previewPlan(s,'w',[block('w-r')]);assert.equal(r.shieldUsed.w,true);assert.equal(r.shieldUsed.b,false);assert.equal(unit(r,'w-r').guard,1);assert.equal(validateOrder(r,'w',block('w-b')).ok,false);assert.equal(validateOrder(r,'b',block('b-r')).ok,true);duel(r);assert.equal(unit(r,'w-r').guard,0);assert.equal(validateOrder(r,'w',block('w-b')).ok,false);
});
test('shielded captures bounce to origin and consume the defender shield, without losing either piece',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7'});unit(s,'b-r').guard=1;s.shieldUsed.b=true;const r=previewPlan(s,'w',[move('w-r','d7')]),event=r.forecastEvents[0];assert.equal(event.bounced,true);assert.equal(event.from,'d4');assert.equal(event.to,'d4');assert.equal(event.attemptedTo,'d7');assert.equal(unit(r,'b-r').guard,0);assert.equal(unit(r,'w-r').square,'d4');assert.equal(unit(r,'w-r').hasMoved,false);assert.equal(unit(r,'b-r').captured,false);assert.equal(event.targets[0].blocked,true);
});
test('an activated shield protects subsequent actions in the same round but expires before the next',()=>{
 const s=fixture({'w-r':'d4','b-r':'d7'}),events=duel(s,[block('w-r')],[move('b-r','d4')]);assert.equal(events[1].bounced,true);assert.equal(unit(s,'w-r').captured,false);assert.equal(s.shieldUsed.w,true);assert.equal(unit(s,'w-r').guard,0);
 const noHit=fixture({'w-r':'d4'});duel(noHit,[block('w-r')]);assert.equal(unit(noHit,'w-r').guard,0);
});
test('king shield follows the same side-wide resource and round duration',()=>{
 const s=fixture({'w-k':'d4','b-r':'d7'}),events=duel(s,[block('w-k')],[move('b-r','d4')]);assert.equal(events[1].bounced,true);assert.equal(s.winner,null);assert.equal(unit(s,'w-k').guard,0);assert.equal(validateOrder(s,'w',block('w-k')).ok,false);
});
test('a piece cannot repeat a movement within a sequence; shield plus move is allowed',()=>{
 const s=fixture({'w-r':'d4','w-r2':'b2'});assert.equal(validatePlan(s,'w',[move('w-r','d5'),move('w-r','d6')]).ok,false);assert.equal(validatePlan(s,'w',[move('w-r','d5'),move('w-r2','b3')]).ok,true);assert.equal(validatePlan(s,'w',[block('w-r'),move('w-r','d5')]).ok,true);
});
test('promotion supports all four choices and defaults to queen',()=>{
 for(const promotion of ['q','r','b','n',undefined]){const s=fixture({'w-p1':'d7'}),r=previewPlan(s,'w',[move('w-p1','d8',promotion?{promotion}:{})]);assert.equal(unit(r,'w-p1').type,promotion??'q');assert.deepEqual(r.forecastEvents[0].promotion,{from:'p',to:promotion??'q'});}
 const black=fixture({'b-p1':'d2'});assert.equal(unit(previewPlan(black,'b',[move('b-p1','d1',{promotion:'n'})]),'b-p1').type,'n');assert.equal(validateOrder(black,'b',move('b-p1','d1',{promotion:'k'})).ok,false);
});
test('capture promotion removes the victim and retains the promoted piece identity',()=>{
 const s=fixture({'w-p1':'d7','b-r':'e8'}),r=previewPlan(s,'w',[move('w-p1','e8',{promotion:'r'})]);assert.equal(unit(r,'b-r').captured,true);assert.equal(unit(r,'w-p1').type,'r');assert.equal(unit(r,'w-p1').square,'e8');
});
test('en passant remains available across a round boundary for the immediately following action',()=>{
 const s=fixture({'w-p1':'e5','b-p1':'d7'},1);duel(s,[],[move('b-p1','d5')]);assert.deepEqual(s.enPassant,{square:'d6',victimId:'b-p1',availableTo:'w'});const events=duel(s,[move('w-p1','d6')]);assert.equal(events[0].capture.enPassant,true);assert.equal(events[0].capture.square,'d5');assert.equal(unit(s,'b-p1').captured,true);assert.equal(unit(s,'w-p1').square,'d6');
});
test('en passant expires after any next action, including pass or shield',()=>{
 for(const action of [{kind:'pass'},block('w-k')]){const s=fixture({'w-p1':'e5','b-p1':'d7'},1);duel(s,[],[move('b-p1','d5')]);const events=duel(s,[action,move('w-p1','d6')]);assert.equal(events[2].kind,'fizzle');assert.equal(unit(s,'b-p1').captured,false);}
});
test('a shield also repels en passant and consumes its opportunity',()=>{
 const s=fixture({'w-p1':'e5','b-p1':'d5'});unit(s,'b-p1').guard=1;s.enPassant={square:'d6',victimId:'b-p1',availableTo:'w'};const r=previewPlan(s,'w',[move('w-p1','d6')]);assert.equal(r.forecastEvents[0].bounced,true);assert.equal(unit(r,'w-p1').square,'e5');assert.equal(unit(r,'b-p1').guard,0);assert.equal(r.enPassant,null);
});
test('captured pieces cannot act; a target that vacates becomes an ordinary move for non-pawns',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),events=duel(s,[{kind:'pass'},move('w-r','d6')],[move('b-r','e6')]);assert.equal(events[2].kind,'move');assert.equal(unit(s,'w-r').square,'d6');assert.equal(unit(s,'b-r').captured,false);
 unit(s,'w-r').captured=true;assert.equal(validateOrder(s,'w',move('w-r','d7')).ok,false);assert.equal(unitAt(s,'d6'),undefined);
});
test('continuous alternation survives growing rounds, missing orders and fizzles',()=>{
 const s=fixture({'w-r':'d4','w-p1':'d5'},1),events=[];for(let round=1;round<=5;round++)events.push(...duel(s,[move('w-r','d5')]));assert.equal(events.length,24);assert.equal(events[0].side,'w');for(let i=1;i<events.length;i++)assert.notEqual(events[i].side,events[i-1].side);assert.equal(s.round,6);
});
test('plans stay hidden and forecasting never reads sealed opponent plans',()=>{
 const s=fixture({'w-r':'d4','b-r':'d6'}),copy=structuredClone(s),plan=[move('w-r','d5')],a=previewPlan(s,'w',plan);assert.deepEqual(s,copy);const secret=structuredClone(s);secret.plans.b=[move('b-r','f6')];assert.deepEqual(previewPlan(secret,'w',plan),a);submitPlan(s,'w',plan);assert.deepEqual(publicView(s,'b').plans.w,[]);assert.equal(Object.hasOwn(publicView(s,'b'),'rng'),false);
});
test('castling matches standard chess in ordinary layouts for either side',()=>{
 for(const color of ['w','b']){const rank=color==='w'?'1':'8',s=fixture({[`${color}-k`]:'e'+rank,[`${color}-r`]:'a'+rank,[`${color}-r2`]:'h'+rank,[color==='w'?'b-k':'w-k']:color==='w'?'e8':'e1'}),chess=new Chess(color==='w'?'4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1':'r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1'),expected=chess.moves({square:'e'+rank,verbose:true}).filter(m=>m.isKingsideCastle()||m.isQueensideCastle()).map(m=>m.to).sort();assert.deepEqual(getCastleOptions(s,`${color}-k`).map(c=>c.target).sort(),expected);for(const c of getCastleOptions(s,`${color}-k`)){const r=previewPlan(s,color,[move(`${color}-k`,c.inputTarget)]);assert.equal(unit(r,`${color}-k`).square,c.target);assert.equal(unit(r,c.rookId).square,c.rookTo);assert.equal(unit(r,c.rookId).hasMoved,true);}}
});
test('960 castle handles a stationary king, stationary rook and swapped king/rook',()=>{
 for(const [king,rook,target,rookTo]of [['g1','h1','g1','f1'],['e1','f1','g1','f1'],['f1','g1','g1','f1']]){const s=fixture({'w-k':king,'w-r2':rook,'b-k':'a8'}),r=previewPlan(s,'w',[move('w-k',rook)]);assert.equal(r.forecastEvents[0].kind,'move');assert.equal(unit(r,'w-k').square,target);assert.equal(unit(r,'w-r2').square,rookTo);assert.equal(unit(r,'w-r2').captured,false);}
});
test('castling rejects moved pieces, blocked paths, and attacked start/transit/destination',()=>{
 const base=()=>fixture({'w-k':'e1','w-r':'a1','w-r2':'h1','b-k':'h8'});let s=base();unit(s,'w-k').hasMoved=true;assert.deepEqual(getCastleOptions(s,'w-k'),[]);s=base();unit(s,'w-r2').hasMoved=true;assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target==='g1'));
 for(const square of ['f1','g1','b1','c1','d1']){s=base();s.units.push({id:'body',type:'p',color:'w',captured:false,square});assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target===('fg'.includes(square[0])?'g1':'c1')));}
 for(const [type,square]of [['r','e6'],['b','b5'],['b','c5'],['p','e2']]){s=base();s.units.push({id:'threat',type,color:'b',captured:false,square});assert.ok(!getCastleOptions(s,'w-k').some(c=>c.target==='g1'));}
});
test('castling is revalidated after an enemy action and never silently downgrades to a normal move',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1','b-r':'h3','b-k':'e8'}),events=duel(s,[{kind:'pass'},move('w-k','h1')],[move('b-r','f3')]);assert.equal(events[2].kind,'fizzle');assert.equal(unit(s,'w-k').square,'e1');assert.equal(unit(s,'w-r2').square,'h1');
});
test('castling consumes both pieces movements for the round',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1'});assert.equal(validatePlan(s,'w',[move('w-k','h1'),move('w-r2','f2')]).ok,false);assert.equal(validatePlan(s,'w',[move('w-k','h1'),block('w-r2')]).ok,true);
});
test('pawn threats for castling are diagonal, not forward, and kings attack neighboring squares',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1','b-p1':'e2','b-k':'h8'});assert.equal(isSquareAttacked(s,'f1','b'),true);assert.equal(isSquareAttacked(s,'e1','b'),false);assert.deepEqual(getCaptureSquares(s,'b-p1').sort(),['d1','f1']);
});

test('action budgets remain integer and bounded for malformed or fractional round values',()=>{
 for(const value of [NaN,Infinity,undefined,null,-4,0,1.8]){const budget=roundRules(value);assert.equal(budget.actions,1);assert.ok(Number.isInteger(budget.actions));}assert.equal(roundRules(2.9).actions,2);assert.equal(roundRules(500).actions,3);
});
test('castle metadata cannot redirect an unrelated declared square',()=>{
 const s=fixture({'w-k':'e1','w-r2':'h1'}),castle=getCastleOptions(s,'w-k').find(c=>c.target==='g1');assert.equal(validateOrder(s,'w',move('w-k','e7',{castle})).ok,false);
});
test('the one side-wide shield remains spent after many growing rounds',()=>{
 const s=fixture({'w-r':'d4'},1);duel(s,[block('w-r')]);for(let i=0;i<5;i++)duel(s);assert.equal(s.shieldUsed.w,true);assert.equal(unit(s,'w-r').guard,0);assert.equal(validateOrder(s,'w',block('w-k')).ok,false);
});

test('all planning slots remain available after an uncertain forecasted king capture',()=>{
 const s=fixture({'w-r':'d4','w-p1':'b2','w-b':'f1','b-k':'d8','b-r':'h7'}),orders=[move('w-r','d8'),move('w-p1','b3'),move('w-b','g2')],check=validatePlan(s,'w',orders);assert.equal(check.ok,true,check.error);assert.equal(check.orders.length,3);assert.equal(check.forecast.winner,null);assert.equal(check.forecast.predictedWinner,'w');assert.equal(unit(check.forecast,'b-k').captured,true);assert.equal(unit(check.forecast,'w-p1').square,'b3');
 const forecast=previewPlan(s,'w',orders);assert.equal(forecast.forecastEvents.length,3);assert.equal(forecast.winner,null);assert.equal(forecast.phase,'planning');assert.equal(forecast.predictedWinner,'w');const events=duel(s,orders);assert.equal(events.length,1);assert.equal(s.winner,'w');assert.equal(unit(s,'w-p1').square,'b2');
});

test('960 neighboring c/g king moves are ordinary moves unless the rook is selected',()=>{
 for(const [king,rook,neighbor]of [['f1','h1','g1'],['b1','a1','c1']]){
  const s=fixture({'w-k':king,'w-r2':rook,'b-k':'e8'}),ordinary=previewPlan(s,'w',[move('w-k',neighbor)]);assert.equal(ordinary.forecastEvents[0].castle,undefined);assert.equal(unit(ordinary,'w-k').square,neighbor);assert.equal(unit(ordinary,'w-r2').square,rook);
  const explicit=validatePlan(s,'w',[move('w-k',rook)]);assert.equal(explicit.ok,true,explicit.error);assert.ok(explicit.orders[0].castle);assert.equal(unit(explicit.forecast,'w-k').square,neighbor);assert.equal(unit(explicit.forecast,'w-r2').square,neighbor==='g1'?'f1':'d1');
  const normalized=previewPlan(s,'w',explicit.orders);assert.equal(unit(normalized,'w-k').square,neighbor);assert.equal(unit(normalized,'w-r2').square,neighbor==='g1'?'f1':'d1');
 }
 const standard=fixture({'w-k':'e1','w-r':'a1','w-r2':'h1','b-k':'e8'});for(const target of ['c1','g1'])assert.ok(previewPlan(standard,'w',[move('w-k',target)]).forecastEvents[0].castle);
});
