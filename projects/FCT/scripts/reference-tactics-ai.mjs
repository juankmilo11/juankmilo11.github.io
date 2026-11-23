// Previous published planner, run under current engine rules for A/B checks.
import { publicView, previewPlan, validatePlan, validateOrder, roundRules, getLegalMoves, getCaptureSquares, getCastleOptions, unitAt, livingUnits, submitPlan, resolveNext } from '../src/tactics-engine.js';
import { tacticalValues as VALUES } from '../src/tactics-values.js';

const other=side=>side==='w'?'b':'w';
const point=square=>[square.charCodeAt(0)-97,Number(square[1])-1];
const key=orders=>JSON.stringify(orders);
const TERMINAL=100000;
// Deterministic node budgets: the Worker never blocks the board while thinking.
const LIMITS=Object.freeze({beam:7,first:24,later:16,plans:7,replies:7,counters:2});
function attacks(state){
  const maps={w:new Map(),b:new Map()};
  for(const unit of livingUnits(state))for(const square of getCaptureSquares(state,unit)){
    if(!maps[unit.color].has(square))maps[unit.color].set(square,[]);maps[unit.color].get(square).push(unit);
  }
  return maps;
}
function scorePosition(state,side,afterExchange=false){
  if(state.winner)return state.winner==='draw'?0:state.winner===side?TERMINAL:-TERMINAL;
  const units=livingUnits(state),maps=attacks(state),opponent=other(side);
  if(!units.some(u=>u.type==='k'&&u.color===side))return -TERMINAL;
  if(!units.some(u=>u.type==='k'&&u.color===opponent))return TERMINAL;
  if(afterExchange&&state.phase==='planning'){const next=state.firstSide??'w',king=units.find(u=>u.type==='k'&&u.color!==next);if(king&&!king.guard&&maps[next].has(king.square))return (king.color===side?-1:1)*(TERMINAL-100);}
  let score=0;
  for(const unit of units){
    const sign=unit.color===side?1:-1,[x,y]=point(unit.square),enemy=other(unit.color),threats=maps[enemy].get(unit.square)??[],cover=maps[unit.color].get(unit.square)??[];
    const center=3.5-(Math.abs(x-3.5)+Math.abs(y-3.5))/2;
    score+=sign*(VALUES[unit.type]*100+(unit.type==='k'?0:center*(unit.type==='p'?3:7)));
    if(unit.type==='p')score+=sign*(unit.color==='w'?y-1:6-y)*8;
    if(unit.guard)score+=sign*(unit.type==='k'?95:Math.min(75,VALUES[unit.type]*12));
    if(threats.length&&!unit.guard){
      const minimum=Math.min(...threats.map(t=>VALUES[t.type]));
      const loose=unit.type==='k'?650:VALUES[unit.type]*100*(cover.length&&minimum>=VALUES[unit.type]?.18:.65);
      score-=sign*loose;
    }
    if(unit.type==='k'){
      // A king can be captured, so exposed lines matter more than conventional check.
      const nearby=units.filter(u=>u.color===unit.color&&u.id!==unit.id).filter(u=>{const[a,b]=point(u.square);return Math.max(Math.abs(a-x),Math.abs(b-y))<=1;}).length;
      score+=sign*Math.min(18,nearby*4);
    }
  }
  for(const color of ['w','b']){
    const sign=color===side?1:-1;
    score+=sign*(maps[color].size*1.2+(!state.shieldUsed?.[color]?120:0));
  }
  return score;
}
function candidates(state,side,orders){
  const used=new Set(orders.filter(o=>o.kind==='move').map(o=>o.unitId));for(const o of orders)if(o.castle)used.add(o.castle.rookId);
  const map=attacks(state),result=[];
  for(const unit of livingUnits(state,side)){
    if(!used.has(unit.id)){
      const castles=unit.type==='k'?getCastleOptions(state,unit):[];
      const targets=new Set([...getLegalMoves(state,unit),...castles.map(c=>c.inputTarget)]);
      for(const target of targets){
        const victim=unitAt(state,target),castle=castles.find(c=>c.inputTarget===target);
        // Ally endpoints are legal predictions, but unproductive without a specific counterplan.
        if(victim?.color===side&&!castle&&!map[other(side)].has(target))continue;
        let predictedEnPassant=false;
        if(unit.type==='p'&&target[0]!==unit.square[0]&&!victim&&state.enPassant?.square!==target){
          predictedEnPassant=livingUnits(state,other(side)).some(p=>p.type==='p'&&!p.hasMoved&&p.square[0]===target[0]&&Number(p.square[1])===(p.color==='w'?2:7)&&Number(unit.square[1])===(p.color==='w'?4:5)&&!unitAt(state,target)&&!unitAt(state,target[0]+unit.square[1]));
          if(!predictedEnPassant)continue;
        }
        const promotions=unit.type==='p'&&['1','8'].includes(target[1])?['q','n','r','b']:[null];
        for(const promotion of promotions){
          const order={unitId:unit.id,kind:'move',target,...(promotion?{promotion}:{})};
          const check=validateOrder(state,side,order);if(!check.ok)continue;
          const [x,y]=point(target),[oldX,oldY]=point(unit.square),danger=map[other(side)].has(target),exposed=map[other(side)].has(unit.square);
          let priority=victim&&victim.color!==side?(victim.type==='k'?100000:VALUES[victim.type]*120-(victim.guard?VALUES[victim.type]*100:0)):0;
          priority+=(predictedEnPassant?65:0)+(promotion?VALUES[promotion]*100:0)+(castle?35:0)+(exposed?(unit.type==='k'?1500:VALUES[unit.type]*70):0);
          priority+=((7-Math.abs(x-3.5)-Math.abs(y-3.5))-(7-Math.abs(oldX-3.5)-Math.abs(oldY-3.5)))*6;
          if(unit.type==='p')priority+=(side==='w'?y-oldY:oldY-y)*6;
          if(danger&&!unit.guard)priority-=unit.type==='k'?2500:VALUES[unit.type]*60;
          result.push({order:check.order,priority});
        }
      }
    }
    if(!state.shieldUsed?.[side]&&!orders.some(o=>o.kind==='block')){
      const danger=map[other(side)].has(unit.square);
      if(danger||unit.type==='k'||VALUES[unit.type]>=5){const check=validateOrder(state,side,{unitId:unit.id,kind:'block'});if(check.ok)result.push({order:check.order,priority:danger?(unit.type==='k'?1200:VALUES[unit.type]*65):unit.type==='k'?15:2});}
    }
  }
  result.sort((a,b)=>b.priority-a.priority||key(a.order).localeCompare(key(b.order)));
  return result.map(r=>r.order);
}
function generatePlans(state,side,{beam=LIMITS.beam,count=LIMITS.plans}={}){
  const initial=scorePosition(state,side);let frontier=[{orders:[],position:state,score:initial}],finished=[];
  for(let depth=0;depth<roundRules(state,side).actions;depth++){
    const next=[];
    for(const node of frontier){
      if(node.position.winner){finished.push(node);continue;}
      const proposals=candidates(node.position,side,node.orders).slice(0,depth?LIMITS.later:LIMITS.first);
      proposals.push({kind:'pass'});
      for(const order of proposals){
        const plan=[...node.orders,order],valid=validatePlan(state,side,plan);if(!valid.ok)continue;
        const forecast=valid.forecast??previewPlan(state,side,plan);
        const score=scorePosition(forecast,side)-plan.filter(o=>o.kind==='pass').length*.5;
        next.push({orders:valid.orders,position:forecast,score});
      }
    }
    next.sort((a,b)=>b.score-a.score||key(a.orders).localeCompare(key(b.orders)));
    // Keep different opening choices, not seven transpositions of one tempting capture.
    const selected=[],openings=new Map();
    for(const node of next){const first=key(node.orders[0]),seen=openings.get(first)??0;if(seen>=2)continue;selected.push(node);openings.set(first,seen+1);if(selected.length>=beam)break;}
    frontier=selected;
  }
  const ranked=[...finished,...frontier].sort((a,b)=>b.score-a.score||key(a.orders).localeCompare(key(b.orders))),seen=new Set(),plans=[];
  for(const node of ranked){const id=key(node.orders);if(seen.has(id))continue;seen.add(id);plans.push(node.orders);if(plans.length>=count)break;}
  return plans.length?plans:[[]];
}
function resolvePair(state,side,own,opposing){
  const sim=structuredClone(state);sim.ready={w:false,b:false};sim.plans={w:[],b:[]};sim.resolution=[];sim.resolutionIndex=0;sim.log=[];
  const plans={[side]:own,[other(side)]:opposing};
  for(const color of ['w','b']){const result=submitPlan(sim,color,plans[color]);if(!result.ok)return null;}
  let events=0;while(sim.phase==='resolution'&&events++<6){const result=resolveNext(sim);if(!result.ok)return null;}
  return sim;
}
// Canonical action identity keeps pair simulations reusable across searches.
const canonical=plan=>[...plan.filter(o=>o.kind==='block'),...plan.filter(o=>o.kind!=='block')];
function variations(state,side,plan){
 const result=[plan],moves=plan.filter(o=>o.kind!=='block'),blocks=plan.filter(o=>o.kind==='block');
 function visit(prefix,left){if(!left.length){const r=validatePlan(state,side,[...blocks,...prefix]);if(r.ok)result.push(r.orders);return;}for(let i=0;i<left.length;i++)visit([...prefix,left[i]],[...left.slice(0,i),...left.slice(i+1)]);}
 if(moves.length>1)visit([],moves);return result;
}
// Explicit protected king-pressure plans survive even when a solo heuristic
// would reject their landing square as defended. Shields resolve before moves.
function kingPressurePlans(state,side){
 const king=livingUnits(state,other(side)).find(u=>u.type==='k');if(!king)return [];
 const slots=roundRules(state,side).actions,result=[];
 for(const unit of livingUnits(state,side))if(unit.type!=='k')for(const target of getLegalMoves(state,unit)){
  if(unitAt(state,target)?.color===side)continue;
  if(unit.type==='p'&&target[0]!==unit.square[0]&&!unitAt(state,target)&&state.enPassant?.square!==target)continue;
  const move={unitId:unit.id,kind:'move',target,...(unit.type==='p'&&['1','8'].includes(target[1])?{promotion:'q'}:{})};
  const probe=previewPlan(state,side,[move]),actor=probe.units.find(u=>u.id===unit.id);
  if(!actor||!getCaptureSquares(probe,actor).includes(king.square))continue;
  for(const guarded of [false,true]){
   if(guarded&&(slots<2||state.shieldUsed?.[side]))continue;
   const prefix=guarded?[{unitId:unit.id,kind:'block'},move]:[move];
   const raw=[...prefix];while(raw.length<slots)raw.push({kind:'pass'});const valid=validatePlan(state,side,raw);if(valid.ok)result.push(valid.orders);
  }
 }
 return result.slice(0,14);
}
// Two separate actors can strip a priority shield and recapture on a square
// currently occupied by an ally. Solo forecasts cannot discover this pairing.
function recapturePlans(state,side){
 if(roundRules(state,side).actions<2)return [];
 const enemy=attacks(state)[other(side)],units=livingUnits(state,side),result=[];
 for(const victim of units)if(enemy.has(victim.square)){
  const actors=units.filter(u=>u.id!==victim.id&&getCaptureSquares(state,u).includes(victim.square));
  for(const first of actors)for(const second of actors)if(first.id!==second.id){
   const raw=[{unitId:first.id,kind:'move',target:victim.square},{unitId:second.id,kind:'move',target:victim.square}];
   while(raw.length<roundRules(state,side).actions)raw.push({kind:'pass'});const r=validatePlan(state,side,raw);if(r.ok)result.push(r.orders);
  }
 }
 return result.slice(0,10);
}
/** Restricted adversarial portfolio search with iterative best responses.
 * Pair values use the real priority-shield/interleaved engine. Candidate plans
 * are fixed before execution; no live sealed opponent order is inspected. */
export function planAI(state,side='b',options={}){
 if(!['w','b'].includes(side)||state.phase!=='planning'||state.winner)return [];
 const observation=publicView(state,side);observation.ready={w:false,b:false};observation.plans={w:[],b:[]};observation.log=[];observation.resolution=[];observation.resolutionIndex=0;
 const enemy=other(side),slots=roundRules(state,side).actions,pairCache=new Map(),limit=options.pairBudget??1800;
 let evaluations=0;
 const evaluate=(own,reply)=>{
  const id=key(own)+'|'+key(reply);if(pairCache.has(id))return pairCache.get(id);
  if(evaluations>=limit)return null;evaluations++;
  const next=resolvePair(observation,side,own,reply);const value=next?scorePosition(next,side,true):null;pairCache.set(id,value);return value;
 };
 const unique=plans=>[...new Map(plans.map(p=>[key(p),p])).values()];
 let owns=unique([...generatePlans(observation,side).flatMap(p=>variations(observation,side,p)).slice(0,18),...kingPressurePlans(observation,side),...recapturePlans(observation,side)]);
 let replies=unique([...generatePlans(observation,enemy),...kingPressurePlans(observation,enemy),...recapturePlans(observation,enemy),[]]);
 // Explicit tactical replies cannot be lost behind quiet high-scoring beam nodes.
 for(const mover of livingUnits(observation,enemy)){
  const king=livingUnits(observation,side).find(u=>u.type==='k');
  if(king&&getCaptureSquares(observation,mover).includes(king.square)){
   const p=validatePlan(observation,enemy,[{unitId:mover.id,kind:'move',target:king.square}]);if(p.ok)replies.push(p.orders);
  }
 }
 const rank=plan=>{
  let minimum=Infinity,total=0,n=0;for(const reply of replies){const value=evaluate(plan,reply);if(value===null)continue;minimum=Math.min(minimum,value);total+=value;n++;}
  const safety=minimum<=-TERMINAL?-2*TERMINAL:minimum<=-TERMINAL+100?-TERMINAL:0;
  return n?{plan,score:safety+minimum*.84+total/n*.16,minimum}: {plan,score:-Infinity,minimum:-Infinity};
 };
 let ranked=owns.map(rank).sort((a,b)=>b.score-a.score);
 // Coordinate best responses search slots against actual opponent plans rather
 // than selecting every action solely by its solo-position material score.
 function improve(initial,actor,opponents,opposing=false){
  const slots=roundRules(observation,actor).actions;let plan=initial,best=-Infinity;
  const value=candidate=>{const scores=opponents.map(p=>opposing?evaluate(p,candidate):evaluate(candidate,p)).filter(v=>v!==null).map(v=>opposing?-v:v);if(!scores.length)return -Infinity;const minimum=Math.min(...scores),safety=minimum<=-TERMINAL?-2*TERMINAL:minimum<=-TERMINAL+100?-TERMINAL:0;return safety+minimum*.84+scores.reduce((a,b)=>a+b,0)/scores.length*.16;};
  best=value(plan);
  for(let slot=0;slot<slots&&evaluations<limit;slot++){
   const before=previewPlan(observation,actor,plan.slice(0,slot));
   const proposals=candidates(before,actor,plan.slice(0,slot)).slice(0,24);
   proposals.push({kind:'pass'});
   for(const order of proposals){
    let raw=[...plan];while(raw.length<slots)raw.push({kind:'pass'});raw[slot]=order;
    let checked=validatePlan(observation,actor,raw);
    if(!checked.ok){raw=[...plan.slice(0,slot),order];while(raw.length<slots)raw.push({kind:'pass'});checked=validatePlan(observation,actor,raw);}
    if(!checked.ok)continue;const candidate=checked.orders,score=value(candidate);
    if(score>best+.001){best=score;plan=candidate;}
    if(evaluations>=limit)break;
   }
  }
  return plan;
 }
 // Reserve evaluations for a counter-response to the leading own strategy.
 for(let iteration=0;iteration<2&&evaluations<limit*.8;iteration++){
  const lead=ranked[0]?.plan??[],hard=replies.map(p=>({p,v:evaluate(lead,p)})).filter(x=>x.v!==null).sort((a,b)=>a.v-b.v).slice(0,3).map(x=>x.p);
  for(const seed of ranked.slice(0,2))owns.push(improve(seed.plan,side,hard));
  owns=unique(owns);ranked=owns.map(rank).sort((a,b)=>b.score-a.score);
  const counter=improve(hard[0]??[],enemy,ranked.slice(0,2).map(x=>x.plan),true);replies=unique([...replies,counter]);
  ranked=owns.map(rank).sort((a,b)=>b.score-a.score);
 }
 const complete=ranked.filter(r=>replies.every(reply=>evaluate(r.plan,reply)!==null));
 const best=complete[0]??ranked[0];if(!best)return [];
 const pool=complete.filter(r=>r.score>=best.score-6&&r.minimum>=best.minimum-6);
 let seed=Number(options.seed??0)>>>0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
 if(options.debug){options.debug.evaluations=evaluations;options.debug.ranked=complete;options.debug.replies=replies;}
 return pool.length?pool[(seed>>>0)%pool.length].plan:best.plan;
}
