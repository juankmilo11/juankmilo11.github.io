// Deterministic, DOM-free rules for FCT's concealed-order skirmish mode.
export const UNIT_NAMES = {p:'Peón',n:'Caballo',b:'Alfil',r:'Torre',q:'Reina',k:'Rey'};
export const DIRECTIONS = {N:[0,1],NE:[1,1],E:[1,0],SE:[1,-1],S:[0,-1],SW:[-1,-1],W:[-1,0],NW:[-1,1]};
export const ABILITIES = {
  p:{name:'Auxilio / Trampa',description:'Cura 3 a un aliado adyacente o coloca una trampa de 2 de daño.',modes:['heal','trap']},
  n:{name:'Tormenta ecuestre',description:'Ataca las ocho casillas en L, incluidos aliados.',modes:['storm']},
  b:{name:'Cruz astral / Sanación',description:'Ataca las cuatro diagonales hasta el primer objetivo, o cura 3 al primer aliado de una diagonal.',modes:['nova','heal']},
  r:{name:'Bastión / Barricada',description:'Obtiene 2 cargas de armadura y reflejo, o crea un obstáculo adyacente durante dos rondas.',modes:['bastion','obstacle']},
  q:{name:'Corona / Fractura',description:'Ataca las ocho direcciones, o destruye una casilla vacía a distancia 3. Máximo dos fracturas por partida.',modes:['nova','fracture']},
  k:{name:'Estandarte',description:'Cura 2 al rey; aliados adyacentes ganan una carga de armadura y potencian su siguiente ataque.',modes:['rally']},
};
const TYPES=['p','p','p','r','n','b','q','k'];
const FACINGS=['N','E','S','W'];
const DIAGONALS=['NE','SE','SW','NW'];
const ORTHOGONALS=['N','E','S','W'];
const ALL=Object.keys(DIRECTIONS);
const KNIGHT={NW:[[-2,1],[-1,2]],NE:[[1,2],[2,1]],SE:[[2,-1],[1,-2]],SW:[[-1,-2],[-2,-1]]};
const other=color=>color==='w'?'b':'w';
const good=(extra={})=>({ok:true,...extra});
const bad=error=>({ok:false,error});
const clone=value=>structuredClone(value);
const xy=square=>[square.charCodeAt(0)-97,Number(square[1])-1];
const sq=(x,y)=>x>=0&&x<8&&y>=0&&y<8?`${String.fromCharCode(97+x)}${y+1}`:null;
const validSquare=square=>typeof square==='string'&&/^[a-h][1-8]$/.test(square);
const alive=unit=>unit&&unit.hp>0&&validSquare(unit.square);
export const unitAt=(state,square)=>state.units.find(unit=>alive(unit)&&unit.square===square);
export const livingUnits=(state,side)=>state.units.filter(unit=>alive(unit)&&(!side||unit.color===side));
const findUnit=(state,unit)=>typeof unit==='string'?state.units.find(item=>item.id===unit):unit;
const solid=(state,square)=>['void','obstacle'].includes(state.tiles[square]?.kind);
const adjacent=(a,b)=>{const[x,y]=xy(a),[u,v]=xy(b);return Math.max(Math.abs(x-u),Math.abs(y-v))<=1;};
const directionBetween=(a,b)=>{const[x,y]=xy(a),[u,v]=xy(b);return ALL.find(dir=>DIRECTIONS[dir][0]===Math.sign(u-x)&&DIRECTIONS[dir][1]===Math.sign(v-y));};
const attackDirections=unit=>unit.type==='p'?(unit.color==='w'?['NW','NE']:['SW','SE']):unit.type==='n'?DIAGONALS:unit.type==='b'?DIAGONALS:unit.type==='r'?ORTHOGONALS:ALL;

function nextRandom(state) {
  let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;
  return state.rng/4294967296;
}
export function roundRules(input) {
  const round=typeof input==='number'?input:input.round;
  return round<=2?{seconds:10,actions:2,maxMoves:1,maxOther:1}:{seconds:10,actions:3,maxMoves:3,maxOther:3};
}
export function createMatch({seed=Date.now(),opponent='ai'}={}) {
  let normalized=typeof seed==='number'?seed: [...String(seed)].reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),7);
  const units=[];
  for(const color of ['w','b']) {
    let pawn=0;
    for(const type of TYPES)units.push({id:`${color}-${type}${type==='p'?++pawn:''}`,color,type,square:null,hp:6,maxHp:6,facing:color==='w'?'N':'S',charged:type==='k',armor:0,guard:0,guardUntil:0,reflect:0,boost:0,hasMoved:false});
  }
  return {version:1,opponent:'ai',rng:(normalized>>>0)||0x9e3779b9,units,tiles:{},phase:'deployment',round:0,firstSide:'w',activePlanner:'w',ready:{w:false,b:false},deployed:{w:false,b:false},plans:{w:[],b:[]},winner:null,log:[],dice:null,diceWinner:null,fractures:0,resolution:[],resolutionIndex:0,revision:0};
}
export function placeUnit(state,side,id,square) {
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  const unit=findUnit(state,id);
  if(!unit||unit.color!==side)return bad('Elige una pieza de tu bando.');
  if(!validSquare(square)||(side==='w'?!['1','2'].includes(square[1]):!['7','8'].includes(square[1])))return bad('Solo puedes desplegar en tus dos primeras filas.');
  const occupied=unitAt(state,square);
  if(occupied&&occupied.id!==id)return bad('Esa casilla ya está ocupada.');
  unit.square=square;state.revision++;return good({unit});
}
export function autoDeploy(state,side) {
  if(!['w','b'].includes(side))return bad('Bando no válido.');
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  const home=[];for(const rank of side==='w'?[1,2]:[8,7])for(let file=0;file<8;file++)home.push(sq(file,rank-1));
  // Randomize all 16 home squares, not only a fixed chess back rank.
  for(let i=home.length-1;i>0;i--){const j=Math.floor(nextRandom(state)*(i+1));[home[i],home[j]]=[home[j],home[i]];}
  state.units.filter(unit=>unit.color===side).forEach((unit,index)=>{unit.square=home[index];});
  state.revision++;return good();
}
export function confirmDeployment(state,side) {
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  if(!['w','b'].includes(side)||state.units.filter(unit=>unit.color===side&&alive(unit)).length!==8)return bad('Debes ubicar las ocho piezas.');
  state.deployed[side]=true;state.ready[side]=true;state.activePlanner=other(side);
  if(state.deployed.w&&state.deployed.b){state.phase='initiative';state.activePlanner=null;state.ready={w:false,b:false};}
  state.revision++;return good();
}
export function rollInitiative(state) {
  if(state.phase!=='initiative'||state.dice)return bad('La tirada no está disponible.');
  const rolls=[];let w,b;do{w=1+Math.floor(nextRandom(state)*6);b=1+Math.floor(nextRandom(state)*6);rolls.push({w,b});}while(w===b);
  state.dice={w,b,winner:w>b?'w':'b',rolls};state.diceWinner=state.dice.winner;state.activePlanner=state.dice.winner;state.revision++;
  return good({dice:clone(state.dice),winner:state.dice.winner,rolls:clone(rolls)});
}
export function chooseInitiative(state,side,{first=true,unitId}={}) {
  if(state.phase!=='initiative'||!state.dice||state.dice.winner!==side)return bad('Solo el ganador de la tirada puede elegir.');
  if(first!==true){
    const unit=findUnit(state,unitId);
    if(!unit||unit.color!==side||unit.type==='q'||unit.type==='k')return bad('Elige peón, caballo, alfil o torre: los reyes ya empiezan cargados.');
    unit.charged=true;
  }
  state.firstSide=first?side:other(side);state.dice.choice={side,first:Boolean(first),unitId:first?null:unitId};
  startRound(state);return good();
}
export function startRound(state) {
  if(state.winner)return bad('La partida ha terminado.');
  if(!((state.phase==='initiative'&&state.dice?.choice)||(state.phase==='resolution'&&state.resolutionIndex>=state.resolution.length)))return bad('La siguiente ronda todavía no puede empezar.');
  state.round++;if(state.round>1)state.firstSide=other(state.firstSide);
  state.phase='planning';state.ready={w:false,b:false};state.plans={w:[],b:[]};state.activePlanner=state.firstSide;
  state.resolution=[];state.resolutionIndex=0;
  for(const[square,tile]of Object.entries(state.tiles))if(tile.expires&&tile.expires<=state.round)delete state.tiles[square];
  for(const unit of state.units)if(unit.guardUntil<state.round)unit.guard=0;
  state.revision++;return good({rules:roundRules(state)});
}

function ray(state,unit,direction,max=7) {
  if(!alive(unit)||!DIRECTIONS[direction])return [];
  const[x,y]=xy(unit.square),[dx,dy]=DIRECTIONS[direction],result=[];
  for(let step=1;step<=max;step++){
    const square=sq(x+dx*step,y+dy*step);if(!square||solid(state,square))break;
    result.push(square);if(unitAt(state,square))break;
  }
  return result;
}
export function getLegalMoves(state,input) {
  const unit=findUnit(state,input);if(!alive(unit))return [];
  const[x,y]=xy(unit.square);
  if(unit.type==='n')return Object.values(KNIGHT).flat().map(([dx,dy])=>sq(x+dx,y+dy)).filter(square=>square&&!solid(state,square));
  if(unit.type==='p'){
    const dy=unit.color==='w'?1:-1,result=[],front=sq(x,y+dy);
    if(front&&!solid(state,front)){
      result.push(front);
      const twice=sq(x,y+dy*2);
      if(!unitAt(state,front)&&!unit.hasMoved&&y===(unit.color==='w'?1:6)&&twice&&!solid(state,twice))result.push(twice);
    }
    for(const dx of [-1,1]){const square=sq(x+dx,y+dy);if(square&&!solid(state,square)&&unitAt(state,square))result.push(square);}
    return result;
  }
  return attackDirections(unit).flatMap(direction=>ray(state,unit,direction,unit.type==='k'?1:7));
}
export function getAttackTargets(state,input,direction) {
  const unit=findUnit(state,input);if(!alive(unit)||!attackDirections(unit).includes(direction))return [];
  if(unit.type==='n'){
    const[x,y]=xy(unit.square);return KNIGHT[direction].map(([dx,dy])=>sq(x+dx,y+dy)).filter(square=>square&&!solid(state,square));
  }
  return ray(state,unit,direction,['p','k'].includes(unit.type)?1:7);
}
const firstTarget=(state,unit,direction,max)=>ray(state,unit,direction,max).map(square=>unitAt(state,square)).find(Boolean);
function healTarget(state,unit,target) {
  const ally=unitAt(state,target);
  if(!ally||ally.color!==unit.color)return false;
  if(unit.type==='p')return adjacent(unit.square,target);
  if(unit.type==='b')return DIAGONALS.some(direction=>firstTarget(state,unit,direction)?.id===ally.id);
  return false;
}
export function validateOrder(state,side,raw) {
  if(!raw||!['move','attack','block','focus','ultimate','pass'].includes(raw.kind))return bad('Acción desconocida.');
  const order={...raw};
  if(order.kind==='pass')return good({order:{kind:'pass'}});
  if(typeof order.unitId!=='string')return bad('Identificador de pieza no válido.');
  const unit=findUnit(state,order.unitId);
  if(!alive(unit)||unit.color!==side)return bad('La pieza ya no está disponible.');
  if(order.facing&&!FACINGS.includes(order.facing))return bad('Orientación no válida.');
  if(order.kind==='move'&&!getLegalMoves(state,unit).includes(order.target))return bad('Movimiento fuera del alcance o bloqueado.');
  if(order.kind==='attack'){
    if(!order.direction&&validSquare(order.target))order.direction=directionBetween(unit.square,order.target);
    if(!attackDirections(unit).includes(order.direction))return bad('Elige una dirección de ataque válida.');
  }
  if(order.kind==='focus'&&unit.charged)return bad('Esta definitiva ya está cargada.');
  if(order.kind==='ultimate'){
    if(!unit.charged)return bad('Primero debes cargar la definitiva con Focus.');
    order.mode??=ABILITIES[unit.type].modes[0];
    if(!ABILITIES[unit.type].modes.includes(order.mode))return bad('Variante de definitiva no válida.');
    if(order.mode==='heal'&&!healTarget(state,unit,order.target))return bad('Elige un aliado al alcance de la curación.');
    if(['trap','obstacle'].includes(order.mode)){
      if(!validSquare(order.target)||!adjacent(unit.square,order.target)||order.target===unit.square||unitAt(state,order.target)||state.tiles[order.target])return bad('Elige una casilla adyacente vacía y libre.');
      if(order.mode==='trap'&&Object.values(state.tiles).filter(tile=>tile.kind==='trap'&&tile.owner===side).length>=2)return bad('Cada bando puede mantener dos trampas.');
    }
    if(order.mode==='fracture'){
      if(state.fractures>=2)return bad('Ya se han creado las dos fracturas de la partida.');
      const target=order.target;
      if(!validSquare(target)||unitAt(state,target)||state.tiles[target]||!ALL.some(direction=>ray(state,unit,direction,3).includes(target)))return bad('Fractura requiere una casilla vacía visible a distancia máxima 3.');
    }
  }
  return good({order});
}
export function orderCategory(state,order) {
  if(order.kind==='pass')return 'pass';
  return order.kind==='move'&&!unitAt(state,order.target)?'move':'other';
}

function checkWinner(state,event) {
  const defeated=state.units.filter(unit=>unit.type==='k'&&unit.hp<=0);
  if(!defeated.length)return;
  // A reflected killing blow can eliminate both kings: the board is a draw.
  state.winner=defeated.length===2?'draw':other(defeated[0].color);state.phase='finished';state.activePlanner=null;
  event.winner=state.winner;
}
export function incomingDamage(attacker,defender) {
  const[a,b]=xy(attacker.square),[x,y]=xy(defender.square),dx=a-x,dy=b-y,[fx,fy]=DIRECTIONS[defender.facing]??DIRECTIONS.N;
  // The forward 90-degree sector is protected; orthogonal flanks and rear are vulnerable.
  const front=(dx*fx+dy*fy)>0&&Math.abs(dx*fy-dy*fx)<=(dx*fx+dy*fy);
  return front?2:4;
}
function strike(state,attacker,defender,event,bonus=0,fixed=null) {
  if(!alive(defender))return;
  const base=fixed??incomingDamage(attacker,defender)+bonus;
  const armor=defender.armor>0?1:0,guard=defender.guard>0?2:0;
  if(armor)defender.armor--;if(guard)defender.guard=0;
  const damage=Math.max(1,base-armor-guard);
  defender.hp=Math.max(0,defender.hp-damage);
  event.targets.push({id:defender.id,square:defender.square,damage,hp:defender.hp,dead:defender.hp===0,front:fixed===null?incomingDamage(attacker,defender)===2:null,absorbed:armor+guard});
  if(defender.reflect>0&&attacker&&attacker.id!==defender.id&&attacker.hp>0){
    defender.reflect--;attacker.hp=Math.max(0,attacker.hp-1);
    event.targets.push({id:attacker.id,square:attacker.square,damage:1,hp:attacker.hp,dead:attacker.hp===0,reflected:true});
  }
}
function applyOrder(state,side,raw) {
  const check=validateOrder(state,side,raw);
  const event={kind:raw?.kind??'pass',side,unitId:raw?.unitId??null,from:null,to:null,targets:[],round:state.round,message:'',revision:++state.revision};
  if(!check.ok){event.kind='fizzle';event.message=check.error;return event;}
  const order=check.order;if(order.kind==='pass'){event.message='Sin orden: espera.';return event;}
  const unit=findUnit(state,order.unitId);event.from=unit.square;event.to=unit.square;event.mode=order.mode;
  const name=UNIT_NAMES[unit.type];
  if(order.kind==='focus'){unit.charged=true;event.message=`${name}: definitiva cargada.`;}
  if(order.kind==='block'){unit.guard=1;unit.guardUntil=state.round+1;event.message=`${name}: guardia hasta el siguiente impacto.`;}
  if(order.kind==='move'){
    const target=unitAt(state,order.target);
    if(target){
      event.kind='attack';event.convertedMove=true;event.direction=directionBetween(unit.square,order.target);
      const targets=unit.type==='n'?getAttackTargets(state,unit,event.direction).map(square=>unitAt(state,square)).filter(Boolean):[target];
      const bonus=unit.boost?1:0;unit.boost=0;
      for(const victim of targets)if(unit.hp>0){strike(state,unit,victim,event,bonus);checkWinner(state,event);if(state.winner)break;}
      event.message=`${name}: movimiento ocupado, ataque básico.`;
    }else{
      unit.square=order.target;unit.hasMoved=true;event.to=unit.square;event.message=`${name}: ${event.from} → ${event.to}.`;
      const trap=state.tiles[unit.square];
      if(trap?.kind==='trap'){
        delete state.tiles[unit.square];unit.hp=Math.max(0,unit.hp-2);event.targets.push({id:unit.id,square:unit.square,damage:2,hp:unit.hp,dead:unit.hp===0,trap:true});event.message+=' Trampa: 2 de daño.';checkWinner(state,event);
      }
    }
  }
  if(order.kind==='attack'){
    event.direction=order.direction;const bonus=unit.boost?1:0;unit.boost=0;
    for(const target of getAttackTargets(state,unit,order.direction).map(square=>unitAt(state,square)).filter(Boolean)){
      if(unit.hp<=0||state.winner)break;strike(state,unit,target,event,bonus);checkWinner(state,event);
    }
    event.message=`${name}: ataque ${order.direction}${event.targets.length?'':' sin objetivo'}.`;
  }
  if(order.kind==='ultimate'){
    unit.charged=false;event.message=`${name}: ${ABILITIES[unit.type].name}.`;
    if(order.mode==='heal'){
      const target=unitAt(state,order.target),healed=Math.min(3,target.maxHp-target.hp);target.hp+=healed;event.targets.push({id:target.id,square:target.square,heal:healed,hp:target.hp});
    }else if(['trap','obstacle','fracture'].includes(order.mode)){
      const kind=order.mode==='fracture'?'void':order.mode;
      state.tiles[order.target]={kind,owner:side,...(kind==='obstacle'?{expires:state.round+2}:{})};
      if(kind==='void')state.fractures++;event.tile={square:order.target,...state.tiles[order.target]};
    }else if(unit.type==='r'){
      unit.armor=2;unit.reflect=2;event.buffs=[unit.id];
    }else if(unit.type==='k'){
      const healed=Math.min(2,unit.maxHp-unit.hp);unit.hp+=healed;event.buffs=[];
      if(healed)event.targets.push({id:unit.id,square:unit.square,heal:healed,hp:unit.hp});
      for(const ally of livingUnits(state,side))if(adjacent(unit.square,ally.square)){ally.armor=Math.min(2,ally.armor+1);ally.boost=1;event.buffs.push(ally.id);}
    }else{
      const directions=unit.type==='n'?DIAGONALS:unit.type==='b'?DIAGONALS:ALL;
      const targetIds=[...new Set(directions.flatMap(direction=>getAttackTargets(state,unit,direction)).map(square=>unitAt(state,square)?.id).filter(Boolean))];
      const bonus=unit.boost?1:0;unit.boost=0;
      for(const id of targetIds){if(unit.hp<=0||state.winner)break;strike(state,unit,findUnit(state,id),event,bonus);checkWinner(state,event);}
    }
  }
  if(order.facing&&unit.hp>0&&event.kind==='move'&&event.from!==event.to)unit.facing=order.facing;
  event.facing=unit.facing;return event;
}
export function previewPlan(state,side,orders=[]) {
  const projected=clone(state);projected.forecastErrors=[];
  // Never simulate or inspect an opponent's sealed orders when forecasting.
  projected.plans={w:[],b:[]};projected.resolution=[];
  for(const order of orders){
    if(projected.winner)break;
    const event=applyOrder(projected,side,order);if(event.kind==='fizzle')projected.forecastErrors.push(event.message);
  }
  return projected;
}
export function submitPlan(state,side,orders=[]) {
  if(state.phase!=='planning'||state.ready[side])return bad('Este plan ya está cerrado.');
  if(!['w','b'].includes(side)||!Array.isArray(orders))return bad('Plan no válido.');
  const rules=roundRules(state);
  if(orders.length>rules.actions)return bad(`Dispones de ${rules.actions} acciones.`);
  const projected=clone(state);
  let moveCount=0,otherCount=0;
  for(const order of orders){
    const result=validateOrder(projected,side,order);if(!result.ok)return result;
    const category=orderCategory(projected,result.order);
    moveCount+=category==='move'?1:0;otherCount+=category==='other'?1:0;
    if(moveCount>rules.maxMoves||otherCount>rules.maxOther)return bad('En las dos primeras rondas solo puedes preparar un movimiento y una acción.');
    applyOrder(projected,side,result.order);
    if(projected.winner&&order!==orders.at(-1))return bad('No puedes preparar órdenes después de terminar la partida.');
  }
  state.plans[side]=clone(orders);state.ready[side]=true;state.activePlanner=other(side);
  if(state.ready.w&&state.ready.b){
    state.phase='resolution';state.activePlanner=null;state.resolution=[];state.resolutionIndex=0;
    for(let index=0;index<rules.actions;index++)for(const color of [state.firstSide,other(state.firstSide)])state.resolution.push({side:color,order:clone(state.plans[color][index]??{kind:'pass'})});
  }
  state.revision++;return good();
}
export function resolveNext(state) {
  if(state.phase!=='resolution')return bad('No hay una secuencia pendiente.');
  const next=state.resolution[state.resolutionIndex++];
  if(!next)return bad('La secuencia ya terminó.');
  const event=applyOrder(state,next.side,next.order);state.log.push(clone(event));
  // Keep recent choreography bounded while preserving every complete event in callers if wanted.
  if(state.log.length>240)state.log.shift();
  const roundEnded=state.resolutionIndex>=state.resolution.length;
  if(roundEnded&&!state.winner)startRound(state);
  return good({event,done:Boolean(state.winner||roundEnded),roundEnded,winner:state.winner});
}
export function publicView(state,viewer) {
  const view=clone(state);
  // Random state would expose a reproducible hidden deployment or sealed choice.
  delete view.rng;
  if(state.phase==='deployment'){
    for(const unit of view.units)if(unit.color!==viewer)unit.square=null;
    view.log=[];
  }
  if(state.phase!=='resolution'&&state.phase!=='finished'){
    for(const side of ['w','b'])if(side!==viewer)view.plans[side]=[];
    view.resolution=[];
  }
  return view;
}
