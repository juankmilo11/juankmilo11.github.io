// Compare the custom opponent-aware search with a simple public-information
// own-plan greedy baseline. This is an engineering regression, not an Elo test.
// node projects/FCT/scripts/benchmark-tactics.mjs --rounds=40
import {performance} from 'node:perf_hooks';
import {createMatch,autoDeploy,confirmDeployment,beginBattle,roundRules,publicView,livingUnits,unitAt,getLegalMoves,getCastleOptions,getCaptureSquares,validatePlan,submitPlan,resolveNext} from '../src/tactics-engine.js';
import {planAI as previousAI} from './reference-tactics-ai.mjs';
import {planAI} from '../src/tactics-ai.js';
import {tacticalValues as values} from '../src/tactics-values.js';
const rounds=Number(process.argv.find(a=>a.startsWith('--rounds='))?.split('=')[1]??40);
if(!Number.isInteger(rounds)||rounds<1||rounds>100)throw Error('Use --rounds=1..100');
const opponent=process.argv.includes('--previous')?previousAI:greedy;
const seeds=process.argv.find(a=>a.startsWith('--seeds='))?.split('=')[1].split(',').map(Number)??[1103,1240,1377,1514],other=s=>s==='w'?'b':'w';
function evaluate(s,side){
 const units=livingUnits(s);if(!units.some(u=>u.type==='k'&&u.color===side))return -1e6;if(!units.some(u=>u.type==='k'&&u.color!==side))return 1e6;
 let score=0;const attacked={w:new Set(),b:new Set()};for(const u of units)for(const square of getCaptureSquares(s,u))attacked[u.color].add(square);
 for(const u of units){const sign=u.color===side?1:-1,x=u.square.charCodeAt(0)-97,y=Number(u.square[1])-1;score+=sign*values[u.type]*100;if(u.type!=='k')score+=sign*(7-Math.abs(x-3.5)-Math.abs(y-3.5))*3;if(u.type==='p')score+=sign*(u.color==='w'?y:7-y)*5;if(attacked[other(u.color)].has(u.square))score-=sign*(u.type==='k'?1500:values[u.type]*35);}
 return score;
}
function greedy(state,side){
 const s=publicView(state,side);s.plans={w:[],b:[]};s.ready={w:false,b:false};s.log=[];let orders=[],position=s;
 for(let slot=0;slot<roundRules(s).actions;slot++){
  const used=new Set(orders.filter(o=>o.kind==='move').map(o=>o.unitId));for(const o of orders)if(o.castle)used.add(o.castle.rookId);
  const proposals=[{kind:'pass'}];
  for(const u of livingUnits(position,side)){
   const castles=u.type==='k'?getCastleOptions(position,u):[];
   if(!used.has(u.id))for(const target of getLegalMoves(position,u)){const victim=unitAt(position,target);if(victim?.color===side&&!castles.some(c=>c.inputTarget===target))continue;if(u.type==='p'&&target[0]!==u.square[0]&&!victim&&position.enPassant?.square!==target)continue;proposals.push({kind:'move',unitId:u.id,target,...(u.type==='p'&&['1','8'].includes(target[1])?{promotion:'q'}:{})});}

  }
  let best=null;for(const order of proposals){const valid=validatePlan(s,side,[...orders,order]);if(!valid.ok)continue;const score=evaluate(valid.forecast,side)-(order.kind==='pass'?.5:0);if(!best||score>best.score)best={orders:valid.orders,position:valid.forecast,score};}
  if(!best)break;orders=best.orders;position=best.position;
 }
 return orders;
}
const games=[],time={search:[],greedy:[]};
const sides=process.argv.find(a=>a.startsWith('--side='))?.split('=')[1];
for(const seed of seeds)for(const searchSide of (sides?[sides]:['w','b'])){
 const s=createMatch({seed});for(const side of ['w','b']){autoDeploy(s,side);confirmDeployment(s,side);}beginBattle(s);let fizzles=0,actions=0;
 while(!s.winner&&s.round<=rounds){const plans={};for(const side of ['w','b']){const name=side===searchSide?'search':'greedy',start=performance.now();plans[side]=(name==='search'?planAI:opponent)(s,side,{seed:seed*100+s.round});time[name].push(performance.now()-start);const valid=validatePlan(s,side,plans[side]);if(!valid.ok)throw Error(`Invalid ${name} plan seed ${seed}: ${valid.error}`);}
  for(const side of ['w','b']){const result=submitPlan(s,side,plans[side]);if(!result.ok)throw Error(result.error);}while(s.phase==='resolution'){const result=resolveNext(s);if(!result.ok)throw Error(result.error);actions++;if(result.event.kind==='fizzle')fizzles++;}
 }
 const game={seed,searchSide,winner:s.winner??'round-limit',round:Math.min(s.round,rounds),searchWon:s.winner===searchSide,actions,fizzles};games.push(game);console.error(JSON.stringify(game));
}
const decided=games.filter(g=>['w','b'].includes(g.winner));console.log(JSON.stringify({description:process.argv.includes('--previous')?'New adversarial planner versus frozen previous production planner under identical interception/checkmate rules; no human or Elo claim.':'Custom opponent-aware search vs own-plan greedy material/king-safety baseline; no human or Elo claim.',games,summary:{games:games.length,searchWins:games.filter(g=>g.searchWon).length,greedyWins:decided.filter(g=>!g.searchWon).length,draws:games.filter(g=>g.winner==='draw').length,roundLimits:games.filter(g=>g.winner==='round-limit').length,searchFirstWins:games.filter(g=>g.searchSide==='w'&&g.searchWon).length,searchSecondWins:games.filter(g=>g.searchSide==='b'&&g.searchWon).length,meanPlanMs:Object.fromEntries(Object.entries(time).map(([k,v])=>[k,v.reduce((a,b)=>a+b,0)/v.length]))}},null,2));
