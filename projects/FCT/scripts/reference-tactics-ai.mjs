// Frozen previous production planner, retained for reproducible strength comparisons.
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
    score+=sign*(maps[color].size*1.2+(!state.shieldUsed?.[color]?18:0));
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
        if(victim?.color===side&&!castle)continue;
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
      if(danger){const check=validateOrder(state,side,{unitId:unit.id,kind:'block'});if(check.ok)result.push({order:check.order,priority:unit.type==='k'?1200:VALUES[unit.type]*65});}
    }
  }
  result.sort((a,b)=>b.priority-a.priority||key(a.order).localeCompare(key(b.order)));
  return result.map(r=>r.order);
}
function generatePlans(state,side,{beam=LIMITS.beam,count=LIMITS.plans}={}){
  const initial=scorePosition(state,side);let frontier=[{orders:[],position:state,score:initial}],finished=[];
  for(let depth=0;depth<roundRules(state).actions;depth++){
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
/** Public-information, bounded robust search over pairs of concealed plans.
 * No submitted enemy order, RNG state, or private log enters the search. This
 * samples pure responses; it does not solve a full mixed-strategy equilibrium. */
export function planAI(state,side='b'){
  if(!['w','b'].includes(side)||state.phase!=='planning'||state.winner)return [];
  const observation=publicView(state,side);observation.ready={w:false,b:false};observation.plans={w:[],b:[]};observation.log=[];observation.resolution=[];observation.resolutionIndex=0;
  const ownPlans=generatePlans(observation,side),enemy=other(side),responses=generatePlans(observation,enemy,{count:LIMITS.replies});
  responses.push([]);let best=null;
  for(const own of ownPlans){
    const afterOwn=previewPlan(observation,side,own);
    let probe=afterOwn;
    if(!livingUnits(afterOwn,enemy).some(u=>u.type==='k')){
      // A projected capture is not guaranteed: include escapes from the position
      // just before that capture instead of searching with the enemy king gone.
      for(let i=0;i<own.length;i++){const before=previewPlan(observation,side,own.slice(0,i));if(livingUnits(before,enemy).some(u=>u.type==='k')&&!livingUnits(previewPlan(observation,side,own.slice(0,i+1)),enemy).some(u=>u.type==='k')){probe=before;break;}}
    }
    const tailored=generatePlans({...probe,phase:'planning',winner:null},enemy,{beam:3,count:LIMITS.counters}).filter(plan=>validatePlan(observation,enemy,plan).ok);
    const unique=[...new Map([...responses,...tailored].map(plan=>[key(plan),plan])).values()];let minimum=Infinity,total=0,count=0;
    for(const reply of unique){const result=resolvePair(observation,side,own,reply);if(!result)continue;const score=scorePosition(result,side,true);minimum=Math.min(minimum,score);total+=score;count++;}
    if(!count)continue;
    const score=minimum*.9+(total/count)*.1;
    if(!best||score>best.score+1e-7)best={orders:own,score};
  }
  return best?.orders??ownPlans[0]??[];
}
