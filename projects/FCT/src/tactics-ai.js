import { publicView, previewPlan, validateOrder, roundRules, getLegalMoves, getAttackSquares, getUltimateTargets, attackOrderFor, getCastleOptions, unitAt } from './tactics-engine.js';
import { tacticalValues as VALUES } from './tactics-values.js';

const point=square=>[square.charCodeAt(0)-97,Number(square[1])-1];
const alive=unit=>unit.hp>0&&typeof unit.square==='string';
const distance=(a,b)=>{const[x,y]=point(a),[u,v]=point(b);return Math.max(Math.abs(x-u),Math.abs(y-v));};
function damage(){return 2;}
function areaPriority(state,unit,side){
  return getUltimateTargets(state,unit).reduce((sum,square)=>{const target=unitAt(state,square);if(!target)return sum;const value=damage(unit,target)*(target.type==='k'?100:VALUES[target.type]+2);return sum+(target.color===side?-1.5:1)*value;},0);
}
function candidates(state,side,orders){
  const units=state.units.filter(alive),allies=units.filter(u=>u.color===side),enemies=units.filter(u=>u.color!==side),used=new Set(orders.map(o=>`${o.unitId}:${o.kind}`)),result=[];
  for(const order of orders)if(order.castle)used.add(`${order.castle.rookId}:move`);
  const attacks=new Map(enemies.map(e=>[e.id,new Set(getAttackSquares(state,e))]));
  for(const unit of allies){
    const add=(order,priority)=>{if(!used.has(`${unit.id}:${order.kind}`))result.push({order:{unitId:unit.id,...order},priority});};
    if(!used.has(`${unit.id}:move`))for(const target of getLegalMoves(state,unit))if(!unitAt(state,target)){
      const nearest=Math.min(8,...enemies.map(e=>distance(target,e.square)));
      add({kind:'move',target},8-nearest+(unit.type==='k'&&getCastleOptions(state,unit).some(c=>c.target===target)?2:0));
    }
    for(const target of getAttackSquares(state,unit)){const victim=unitAt(state,target);if(victim.color===side)continue;const order=attackOrderFor(state,unit,target),hit=damage(unit,victim);add(order,hit*(victim.type==='k'?200:VALUES[victim.type]*2)+(hit>=victim.hp?400:0));}
    const exposed=enemies.some(e=>attacks.get(e.id).has(unit.square));
    if(exposed&&!unit.guard)add({kind:'block'},12+(unit.type==='k'?20:0));
    const potential=areaPriority(state,unit,side);
    if(!unit.charged)add({kind:'focus'},Math.max(0,potential)*.4);
    else if(potential>0)add({kind:'ultimate',mode:'sweep'},potential);
  }
  return result.sort((a,b)=>b.priority-a.priority||JSON.stringify(a.order).localeCompare(JSON.stringify(b.order))).map(v=>v.order);
}
function scorePosition(state,side){
  if(state.winner)return state.winner==='draw'?0:state.winner===side?1e6:-1e6;
  const units=state.units.filter(alive),allies=units.filter(u=>u.color===side),enemies=units.filter(u=>u.color!==side),king=enemies.find(u=>u.type==='k');
  if(!allies.some(u=>u.type==='k'))return -1e6;if(!king)return 1e6;
  const attacks=new Map(units.map(u=>[u.id,new Set(getAttackSquares(state,u))])),ultimates=new Map(enemies.filter(u=>u.charged).map(u=>[u.id,new Set(getUltimateTargets(state,u))]));
  let score=0;
  for(const unit of units){
    const friendly=unit.color===side,weight=VALUES[unit.type],sign=friendly?1.05:-1;
    score+=sign*(weight*(.4+.6*unit.hp/6)*12+(unit.type==='k'?unit.hp*23:unit.hp*2));
    if(!friendly)continue;
    const nearest=Math.min(8,...enemies.map(e=>distance(unit.square,e.square)));
    score+=(8-nearest)*(unit.type==='k'?allies.some(a=>!['p','k'].includes(a.type))?.15:.9:.65);
    const threats=attacks.get(unit.id);for(const enemy of enemies)if(threats.has(enemy.square))score+=enemy.type==='k'?12:1.5;
    if(unit.charged)score+=1+Math.max(0,areaPriority(state,unit,side))*.12;
  }
  for(const ally of allies){
    const hits=[];
    for(const enemy of enemies){const basic=attacks.get(enemy.id).has(ally.square),ultimate=enemy.charged&&ultimates.get(enemy.id).has(ally.square);if(basic||ultimate)hits.push(damage(enemy,ally));}
    hits.sort((a,b)=>b-a);const danger=(hits[0]??0)+(hits[1]??0)*.45;
    score-=danger*(ally.type==='k'?12:VALUES[ally.type]*.6);
    if(danger>=ally.hp)score-=ally.type==='k'?160:VALUES[ally.type]*8;
    if(hits.length&&ally.counterUntil===state.round)score+=Math.min(ally.hp,danger)*2;
  }
  return score;
}
function tieBreak(order,round,side){let hash=2166136261;for(const c of `${round}:${side}:${JSON.stringify(order)}`)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;return hash/4294967296*.01;}

/** Bounded two-action beam search. Only the public position enters the model. */
export function planAI(state,side='b'){
  if(!['w','b'].includes(side)||state.phase!=='planning')return [];
  const observation=publicView(state,side);observation.plans={w:[],b:[]};observation.log=[];
  const baseline=scorePosition(observation,side);let beam=[{orders:[],state:observation,score:baseline,firstScore:baseline}],finished=[];
  for(let depth=0;depth<roundRules(state).actions;depth++){
    const next=[];
    for(const node of beam){
      if(node.state.winner){finished.push(node);continue;}
      const proposals=candidates(node.state,side,node.orders).slice(0,depth?48:96);
      proposals.push({kind:'pass'});
      for(const raw of proposals){
        const check=validateOrder(node.state,side,raw);if(!check.ok)continue;
        const forecast=previewPlan(node.state,side,[check.order]);if(forecast.forecastErrors.length||forecast.winner&&![side,'draw'].includes(forecast.winner))continue;
        const value=scorePosition(forecast,side),firstScore=depth?node.firstScore:value;
        next.push({orders:[...node.orders,check.order],state:forecast,firstScore,score:value+(firstScore-baseline)*.12+tieBreak(check.order,state.round,side)});
      }
    }
    const ranked=next.sort((a,b)=>b.score-a.score);
    if(depth===0){
      // Preserve setup actions that pay off on order two. A purely greedy beam
      // would discard Focus before it gets to evaluate the charged area strike.
      beam=ranked.slice(0,2);
      for(const kind of ['move','focus']){const setup=ranked.find(n=>n.orders[0].kind===kind);if(setup&&!beam.includes(setup))beam.push(setup);}
    }else beam=ranked.slice(0,3);
  }
  return [...finished,...beam].sort((a,b)=>b.score-a.score)[0]?.orders??[];
}
