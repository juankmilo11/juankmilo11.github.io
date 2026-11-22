import { publicView, previewPlan, validateOrder, roundRules, getLegalMoves, getAttackTargets, unitAt } from './tactics-engine.js';

const DIRECTIONS = ['N','NE','E','SE','S','SW','W','NW'];
const VALUES = { p:3, n:5, b:5, r:6, q:9, k:80 };
const CARDINAL = { N:[0,1], E:[1,0], S:[0,-1], W:[-1,0] };
const point = square => [square.charCodeAt(0)-97, Number(square[1])-1];
const square = (x,y) => x>=0&&x<8&&y>=0&&y<8 ? String.fromCharCode(97+x)+(y+1) : null;
const alive = unit => unit.hp>0 && typeof unit.square==='string';
const distance = (a,b) => { const [x,y]=point(a),[u,v]=point(b); return Math.max(Math.abs(x-u),Math.abs(y-v)); };
const neighbors = position => { const [x,y]=point(position);return DIRECTIONS.map((_,i)=>{const [dx,dy]=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]][i];return square(x+dx,y+dy);}).filter(Boolean); };

function faceThreat(unit, destination, enemies) {
  const [x,y]=point(destination);
  const nearest=[...enemies].sort((a,b)=>distance(destination,a.square)-distance(destination,b.square)||a.id.localeCompare(b.id))[0];
  if(!nearest)return unit.facing;
  const [u,v]=point(nearest.square),dx=u-x,dy=v-y;
  return Math.abs(dy)>=Math.abs(dx)?dy>=0?'N':'S':dx>=0?'E':'W';
}

function basicDirections(unit) {
  if(unit.type==='n'||unit.type==='b')return ['NE','SE','SW','NW'];
  if(unit.type==='r')return ['N','E','S','W'];
  return DIRECTIONS;
}

function candidates(state,side) {
  const units=state.units.filter(alive), allies=units.filter(unit=>unit.color===side),enemies=units.filter(unit=>unit.color!==side);
  const orders=[];
  for(const unit of allies){
    for(const target of getLegalMoves(state,unit))orders.push({unitId:unit.id,kind:'move',target,facing:faceThreat(unit,target,enemies)});
    for(const direction of basicDirections(unit)){
      const targets=getAttackTargets(state,unit,direction);
      // Empty shots cannot help against a snapshot; the AI cannot see future orders.
      if(targets.some(target=>units.some(piece=>piece.square===target)))orders.push({unitId:unit.id,kind:'attack',direction});
    }
    orders.push({unitId:unit.id,kind:'block'},{unitId:unit.id,kind:'focus'});
    if(!unit.charged)continue;
    orders.push({unitId:unit.id,kind:'ultimate'});
    if(unit.type==='b')for(const ally of allies)orders.push({unitId:unit.id,kind:'ultimate',mode:'heal',target:ally.square});
    if(unit.type==='r')for(const target of neighbors(unit.square))orders.push({unitId:unit.id,kind:'ultimate',mode:'obstacle',target});
    if(unit.type==='q')for(const direction of DIRECTIONS)for(const target of getAttackTargets(state,unit,direction)){
      if(distance(unit.square,target)<=3)orders.push({unitId:unit.id,kind:'ultimate',mode:'fracture',target});
    }
  }
  return orders;
}

function threatDamage(attacker, defender) {
  const [x,y]=point(attacker.square),[u,v]=point(defender.square),[fx,fy]=CARDINAL[defender.facing]??[0,1];
  const dx=x-u,dy=y-v,dot=dx*fx+dy*fy,perp=Math.abs(dx*fy-dy*fx);
  return Math.max(1,(dot>0&&dot>=perp?2:4)+(attacker.boost?1:0)-(defender.armor?1:0)-(defender.guard?2:0));
}

function positionScore(state,side) {
  const units=state.units.filter(alive),allies=units.filter(unit=>unit.color===side),enemies=units.filter(unit=>unit.color!==side);
  if(!allies.some(unit=>unit.type==='k'))return -100000;
  if(!enemies.some(unit=>unit.type==='k'))return 100000;
  let score=0;
  for(const unit of units){
    const friendly=unit.color===side, weight=VALUES[unit.type];
    score+=(friendly?1.2:-1)*(weight*9+unit.hp*(unit.type==='k'?23:weight+5));
    const nearest=Math.min(8,...units.filter(other=>other.color!==unit.color).map(other=>distance(unit.square,other.square)));
    if(friendly){
      score+=Math.min(unit.armor||0,2)*.9+Math.min(unit.reflect||0,2)*.7+(unit.guard?.8:0)+(unit.boost?1.2:0);
      if(unit.charged)score+=unit.type==='q'?2.2:nearest<=4?1.1:.35;
      if(unit.type!=='k')score+=(8-nearest)*.85;
      else if(allies.some(ally=>!['k','p'].includes(ally.type)))score+=Math.min(nearest,3)*.45;
      else score+=(8-nearest)*.9;
      // Reward setting up a line of attack, not just immediate damage. Without
      // this term a greedy planner can keep refreshing guard instead of taking
      // the one repositioning step needed to threaten an exposed king.
      const reachable=new Set(basicDirections(unit).flatMap(direction=>getAttackTargets(state,unit,direction)));
      for(const enemy of enemies)if(reachable.has(enemy.square))score+=enemy.type==='k'?8:2;
    }
  }
  // Penalize exposing allies to the opponent's current legal attack lanes.
  // We deliberately do not inspect an opponent's queued instructions.
  for(const enemy of enemies){
    const threatened=new Set(basicDirections(enemy).flatMap(direction=>getAttackTargets(state,enemy,direction)));
    for(const ally of allies)if(threatened.has(ally.square)){
      const damage=threatDamage(enemy,ally);
      score-=damage*(ally.type==='k'?3.5:.48);
      if(damage>=ally.hp)score-=ally.type==='k'?90:VALUES[ally.type]*1.1;
    }
  }
  for(const [position,tile]of Object.entries(state.tiles??{})){
    if(tile.kind==='trap'&&tile.owner===side){
      const near=Math.min(8,...enemies.map(unit=>distance(unit.square,position)));
      score+=near<=2?1.4:.15;
    }
  }
  return score;
}

function tieBreak(order,round,side) {
  let hash=2166136261;
  for(const letter of `${round}:${side}:${JSON.stringify(order)}`)hash=Math.imul(hash^letter.charCodeAt(0),16777619)>>>0;
  return hash/4294967296*.025;
}

/** Plan against a public round snapshot, never against another player's plan. */
export function planAI(state,side='b') {
  if(!['w','b'].includes(side)||state.phase!=='planning')return [];
  const observation=publicView(state,side);
  // Redaction is enforced here as well as at the engine boundary. Neither an
  // already submitted enemy plan nor old combat logs influence the strategy.
  observation.plans={w:[],b:[]};observation.log=[];
  const rules=roundRules(observation), orders=[];
  let movesUsed=0,otherUsed=0;
  for(let index=0;index<rules.actions;index++){
    const projected=previewPlan(observation,side,orders);
    if(projected.winner)break;
    let best=null,bestScore=-Infinity,bestMoves=0,bestOthers=0;
    const seen=new Set();
    for(const candidate of candidates(projected,side)){
      const validation=validateOrder(projected,side,candidate);
      if(!validation.ok)continue;
      const order=validation.order??candidate,key=JSON.stringify(order);
      if(seen.has(key))continue;seen.add(key);
      const proposal=[...orders,order];
      const forecast=previewPlan(observation,side,proposal);
      if(forecast.forecastErrors?.length)continue;
      if(forecast.phase==='finished'&&forecast.winner!==side)continue;
      // validateOrder can be position-only: enforce the opening quota here too.
      const moves=movesUsed+(order.kind==='move'&&!unitAt(projected,order.target)?1:0);
      const others=otherUsed+(order.kind!=='pass'&&!(order.kind==='move'&&!unitAt(projected,order.target))?1:0);
      if(moves>rules.maxMoves||others>rules.maxOther)continue;
      const score=positionScore(forecast,side)+tieBreak(order,observation.round,side);
      if(score>bestScore){best=order;bestScore=score;bestMoves=moves;bestOthers=others;}
    }
    if(!best)break;
    orders.push(best);
    movesUsed=bestMoves;otherUsed=bestOthers;
  }
  return orders;
}
