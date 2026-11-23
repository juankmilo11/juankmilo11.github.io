// Reproducible rules/AI smoke simulation. This is not human balance validation.
// node projects/FCT/scripts/simulate-tactics.mjs --games=8 --rounds=40
import { performance } from 'node:perf_hooks';
import { createMatch, autoDeploy, confirmDeployment, beginBattle, submitPlan, resolveNext } from '../src/tactics-engine.js';
import { planAI } from '../src/tactics-ai.js';

const option=(name,fallback)=>Number(process.argv.find(arg=>arg.startsWith(`--${name}=`))?.split('=')[1]??fallback);
const games=option('games',8),maxRounds=option('rounds',40);
if(!Number.isInteger(games)||games<1||games>200||!Number.isInteger(maxRounds)||maxRounds<1||maxRounds>200)throw new Error('Use --games=1..200 and --rounds=1..200.');
const results=[],counts={},timings=[];
for(let index=0;index<games;index++){
  const state=createMatch({seed:1103+index*137});
  for(const side of ['w','b']){autoDeploy(state,side);confirmDeployment(state,side);}
  beginBattle(state);
  const initialFirstSide=state.firstSide;
  while(!state.winner&&state.round<=maxRounds){
    // Both plans are generated from exactly the same revealed round position.
    const plans={};
    for(const side of ['w','b']){
      const start=performance.now();plans[side]=planAI(state,side);timings.push(performance.now()-start);
      for(const order of plans[side])counts[`${order.kind}${order.mode?':'+order.mode:''}`]=(counts[`${order.kind}${order.mode?':'+order.mode:''}`]??0)+1;
    }
    for(const side of ['w','b']){
      const result=submitPlan(state,side,plans[side]);
      if(!result.ok)throw new Error(`Seed ${1103+index*137}, round ${state.round}, ${side}: ${result.error} ${JSON.stringify(plans[side])}`);
    }
    while(state.phase==='resolution'){
      const result=resolveNext(state);if(!result.ok)throw new Error(result.error);
    }
  }
  const result={seed:1103+index*137,winner:state.winner??'round-limit',round:Math.min(state.round,maxRounds),firstSide:initialFirstSide,lastRoundFirstSide:state.firstSide};
  results.push(result);console.error(`Simulation ${index+1}/${games}: ${JSON.stringify(result)}`);
}
const decided=results.filter(result=>['w','b'].includes(result.winner));
console.log(JSON.stringify({
  note:'Seeded AI smoke simulation; small samples do not establish balance against human players.',
  games,maxRounds,results,
  summary:{decided:decided.length,draws:results.filter(result=>result.winner==='draw').length,roundLimits:results.filter(result=>result.winner==='round-limit').length,meanRounds:results.reduce((sum,result)=>sum+result.round,0)/games,firstSideWins:decided.filter(result=>result.winner===result.firstSide).length,meanPlanMs:timings.reduce((sum,value)=>sum+value,0)/timings.length},
  orders:counts,
},null,2));
