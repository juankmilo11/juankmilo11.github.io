// Deterministic, DOM-free rules for FCT's concealed-order skirmish mode.
export const UNIT_NAMES = {p:'Peón',n:'Caballo',b:'Alfil',r:'Torre',q:'Reina',k:'Rey'};
export const DIRECTIONS = {N:[0,1],NE:[1,1],E:[1,0],SE:[1,-1],S:[0,-1],SW:[-1,-1],W:[-1,0],NW:[-1,1]};
export const ABILITIES = {
  p:{name:'Vanguardia',description:'Ataca las dos casillas del frente y ambas diagonales delanteras, incluidos aliados.',modes:['sweep']},
  n:{name:'Tormenta ecuestre',description:'Ataca las ocho casillas en L, incluidos aliados.',modes:['sweep']},
  b:{name:'Cruz astral',description:'Ataca las cuatro diagonales hasta el primer cuerpo de cada línea, incluidos aliados.',modes:['sweep']},
  r:{name:'Cruz de acero',description:'Ataca las cuatro líneas rectas hasta el primer cuerpo de cada línea, incluidos aliados.',modes:['sweep']},
  q:{name:'Corona',description:'Ataca las ocho direcciones hasta el primer cuerpo de cada línea, incluidos aliados.',modes:['sweep']},
  k:{name:'Cerco real',description:'Ataca las ocho casillas adyacentes, incluidos aliados.',modes:['sweep']},
};
const TYPES=[...Array(8).fill('p'),'r','n','b','q','k','b','n','r'];
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
const directionBetween=(a,b)=>{const[x,y]=xy(a),[u,v]=xy(b);return ALL.find(dir=>DIRECTIONS[dir][0]===Math.sign(u-x)&&DIRECTIONS[dir][1]===Math.sign(v-y));};
const attackDirections=unit=>unit.type==='p'?(unit.color==='w'?['NW','NE']:['SW','SE']):unit.type==='n'?DIAGONALS:unit.type==='b'?DIAGONALS:unit.type==='r'?ORTHOGONALS:ALL;

function nextRandom(state) {
  let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;
  return state.rng/4294967296;
}
export function roundRules(){return {seconds:15,actions:2,maxMoves:2,maxOther:2};}
export function createMatch({seed=Date.now(),opponent='ai'}={}) {
  let normalized=typeof seed==='number'?seed: [...String(seed)].reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),7);
  const units=[];
  for(const color of ['w','b']) {
    const counts={};
    TYPES.forEach((type,index)=>{const count=counts[type]=(counts[type]??0)+1;units.push({id:`${color}-${type}${type==='p'||count>1?count:''}`,color,type,homeSquare:sq(index%8,(color==='w'?(index<8?2:1):(index<8?7:8))-1),square:null,hp:6,maxHp:6,charged:false,guard:0,guardUntil:0,counterUntil:0,hasMoved:false});});
  }
  return {version:4,opponent:'ai',rng:(normalized>>>0)||0x9e3779b9,units,tiles:{},phase:'deployment',round:0,firstSide:'w',lastSide:null,actionNumber:0,activePlanner:'w',ready:{w:false,b:false},deployed:{w:false,b:false},plans:{w:[],b:[]},winner:null,log:[],dice:null,diceWinner:null,fractures:0,resolution:[],resolutionIndex:0,revision:0};
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
  state.units.filter(unit=>unit.color===side).forEach(unit=>{unit.square=unit.homeSquare;});
  state.revision++;return good();
}
export function confirmDeployment(state,side) {
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  if(!['w','b'].includes(side)||state.units.filter(unit=>unit.color===side&&alive(unit)&&unit.square===unit.homeSquare).length!==16)return bad('Las dieciséis piezas deben estar en su posición inicial de ajedrez.');
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
export function chooseInitiative(state,side,{first=true}={}) {
  if(state.phase!=='initiative'||!state.dice||state.dice.winner!==side)return bad('Solo el ganador de la tirada puede elegir.');
  state.firstSide=first?side:other(side);state.dice.choice={side,first:Boolean(first)};
  for(const unit of state.units)unit.charged=false;
  startRound(state);return good();
}
export function startRound(state) {
  if(state.winner)return bad('La partida ha terminado.');
  if(!((state.phase==='initiative'&&state.dice?.choice)||(state.phase==='resolution'&&state.resolutionIndex>=state.resolution.length)))return bad('La siguiente ronda todavía no puede empezar.');
  if(state.lastSide)state.firstSide=other(state.lastSide);state.round++;
  state.phase='planning';state.ready={w:false,b:false};state.plans={w:[],b:[]};state.activePlanner=state.firstSide;
  state.resolution=[];state.resolutionIndex=0;
  for(const[square,tile]of Object.entries(state.tiles))if(tile.expires&&tile.expires<=state.round)delete state.tiles[square];
  for(const unit of state.units){if(unit.guardUntil<state.round)unit.guard=0;if(unit.counterUntil<state.round)unit.counterUntil=0;}
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
export function isSquareAttacked(state,square,bySide){
  return livingUnits(state,bySide).some(unit=>attackDirections(unit).some(direction=>getAttackTargets(state,unit,direction).includes(square)));
}
export function getCastleOptions(state,input){
  const king=findUnit(state,input);if(!alive(king)||king.type!=='k'||king.hasMoved)return [];
  const rank=king.color==='w'?'1':'8',home='e'+rank;
  if(king.square!==home)return [];let kingSafe=null;
  const result=[];
  for(const [target,rookFrom,rookTo,path,crossed]of [['g','h','f',['f','g'],['f','g']],['c','a','d',['b','c','d'],['d','c']]]){
    const rook=unitAt(state,rookFrom+rank);if(!rook||rook.type!=='r'||rook.color!==king.color||rook.hasMoved)continue;
    if(path.some(file=>unitAt(state,file+rank)||solid(state,file+rank)))continue;
    kingSafe??=!isSquareAttacked(state,home,other(king.color));if(!kingSafe)return [];
    const safe=crossed.every(file=>{
      const probe={...state,units:state.units.map(u=>u.id===king.id?{...u,square:file+rank}:u.id===rook.id&&file===target?{...u,square:rookTo+rank}:u)};
      return !isSquareAttacked(probe,file+rank,other(king.color));
    });
    if(safe)result.push({target:target+rank,rookId:rook.id,rookFrom:rook.square,rookTo:rookTo+rank});
  }return result;
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
      if(!unitAt(state,front)&&twice&&!solid(state,twice))result.push(twice);
    }
    for(const dx of [-1,1]){const square=sq(x+dx,y+dy);if(square&&!solid(state,square))result.push(square);}
    return result;
  }
  return [...attackDirections(unit).flatMap(direction=>ray(state,unit,direction,unit.type==='k'?1:7)),...(unit.type==='k'?getCastleOptions(state,unit).map(c=>c.target):[])];
}
export function getPawnArea(state,input){
  const unit=findUnit(state,input);if(!alive(unit))return [];
  const[x,y]=xy(unit.square),dy=unit.color==='w'?1:-1;
  return [[-1,dy],[1,dy],[0,dy],[0,2*dy]].map(([dx,step])=>sq(x+dx,y+step)).filter(square=>square&&!solid(state,square)&&(Number(square[1])!==y+1+2*dy||!solid(state,sq(x,y+dy))));
}
export function getAttackTargets(state,input,direction) {
  const unit=findUnit(state,input);if(!alive(unit)||!attackDirections(unit).includes(direction))return [];
  if(unit.type==='n'){
    const[x,y]=xy(unit.square);return KNIGHT[direction].map(([dx,dy])=>sq(x+dx,y+dy)).filter(square=>square&&!solid(state,square));
  }
  return ray(state,unit,direction,['p','k'].includes(unit.type)?1:7);
}
export function getUltimateTargets(state,input){
  const unit=findUnit(state,input);if(!alive(unit))return [];
  return unit.type==='p'?getPawnArea(state,unit):[...new Set(attackDirections(unit).flatMap(direction=>getAttackTargets(state,unit,direction)))];
}
export function getAttackSquares(state,input){
  const unit=findUnit(state,input);if(!alive(unit))return [];
  return [...new Set([...attackDirections(unit).flatMap(d=>getAttackTargets(state,unit,d)),...getLegalMoves(state,unit)])].filter(square=>{const target=unitAt(state,square);return target&&target.id!==unit.id;});
}
export function attackOrderFor(state,input,target){
  const unit=findUnit(state,input);if(!unit||!getAttackSquares(state,unit).includes(target))return null;
  return {unitId:unit.id,kind:'attack',target,direction:directionBetween(unit.square,target)};
}
export function validateOrder(state,side,raw) {
  if(!raw||!['move','attack','block','focus','ultimate','pass'].includes(raw.kind))return bad('Acción desconocida.');
  const order={...raw};
  if(order.kind==='pass')return good({order:{kind:'pass'}});
  if(typeof order.unitId!=='string')return bad('Identificador de pieza no válido.');
  const unit=findUnit(state,order.unitId);
  if(!alive(unit)||unit.color!==side)return bad('La pieza ya no está disponible.');
  delete order.facing;delete order.castle;
  if(order.kind==='move'&&(!getLegalMoves(state,unit).includes(order.target)||unitAt(state,order.target)))return bad('Movimiento fuera del alcance o bloqueado.');
  if(order.kind==='move'&&unit.type==='k'){const castle=getCastleOptions(state,unit).find(c=>c.target===order.target);if(castle)order.castle=castle;}
  if(order.kind==='attack'){
    const aimed=attackOrderFor(state,unit,order.target);
    if(!aimed)return bad('Selecciona una pieza aliada o enemiga al alcance para atacar.');
    if(order.direction&&order.direction!==aimed.direction)return bad('La dirección no coincide con la pieza elegida.');
    order.direction=aimed.direction;
  }
  if(order.kind==='focus'&&unit.charged)return bad('Esta definitiva ya está cargada.');
  if(order.kind==='ultimate'){
    if(!unit.charged)return bad('Primero debes cargar la definitiva con Focus.');
    order.mode??=ABILITIES[unit.type].modes[0];
    if(!ABILITIES[unit.type].modes.includes(order.mode))return bad('Variante de definitiva no válida.');
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
export function incomingDamage(){return 2;}
function strike(state,attacker,defender,event){
  if(!alive(defender))return;
  const damage=2;defender.hp=Math.max(0,defender.hp-damage);
  event.targets.push({id:defender.id,square:defender.square,damage,hp:defender.hp,dead:defender.hp===0});
  if(defender.counterUntil>0&&defender.counterUntil===state.round&&attacker&&attacker.id!==defender.id&&attacker.hp>0){
    attacker.hp=Math.max(0,attacker.hp-2);event.targets.push({id:attacker.id,square:attacker.square,damage:2,hp:attacker.hp,dead:attacker.hp===0,reflected:true});
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
  if(order.kind==='block'){unit.guard=1;unit.guardUntil=state.round;unit.counterUntil=state.round;event.message=`${name}: bloqueo y devolución de daño durante esta ronda.`;}
  if(order.kind==='move'){
    unit.square=order.target;unit.hasMoved=true;event.to=unit.square;event.message=`${name}: ${event.from} → ${event.to}.`;
    if(order.castle){const rook=findUnit(state,order.castle.rookId);rook.square=order.castle.rookTo;rook.hasMoved=true;event.castle={...order.castle};event.message=`Rey: enroque ${event.from} → ${event.to}; torre ${order.castle.rookFrom} → ${order.castle.rookTo}.`;}
    const trap=state.tiles[unit.square];
    if(trap?.kind==='trap'){delete state.tiles[unit.square];unit.hp=Math.max(0,unit.hp-2);event.targets.push({id:unit.id,square:unit.square,damage:2,hp:unit.hp,dead:unit.hp===0,trap:true});checkWinner(state,event);}
  }
  if(order.kind==='attack'){
    event.direction=order.direction;event.target=order.target;
    const victims=unit.type==='n'?getAttackTargets(state,unit,order.direction).map(square=>unitAt(state,square)).filter(Boolean):[unitAt(state,order.target)];
    for(const target of victims){if(unit.hp<=0||state.winner)break;strike(state,unit,target,event);checkWinner(state,event);}
    event.message=`${name}: ataque ${order.direction}.`;
  }
  if(order.kind==='ultimate'){
    unit.charged=false;event.message=`${name}: ${ABILITIES[unit.type].name}.`;
    const targetIds=[...new Set(getUltimateTargets(state,unit).map(square=>unitAt(state,square)?.id).filter(Boolean))];
    for(const id of targetIds){if(unit.hp<=0||state.winner)break;strike(state,unit,findUnit(state,id),event);checkWinner(state,event);}
  }
  return event;
}
export function previewPlan(state,side,orders=[]) {
  const projected=clone({...state,log:[],plans:{w:[],b:[]},resolution:[]});projected.forecastErrors=[];
  // Never simulate or inspect an opponent's sealed orders when forecasting.
  projected.plans={w:[],b:[]};projected.resolution=[];
  for(const order of orders){
    if(projected.winner)break;
    const event=applyOrder(projected,side,order);if(event.kind==='fizzle')projected.forecastErrors.push(event.message);
  }
  return projected;
}
export function validatePlan(state,side,orders=[]){
  if(!['w','b'].includes(side)||!Array.isArray(orders))return bad('Plan no válido.');
  if(orders.length>roundRules(state).actions)return bad('Dispones de dos acciones por ronda.');
  const projected=clone({...state,log:[],plans:{w:[],b:[]},resolution:[]}),used=new Set(),normalized=[];
  for(const raw of orders){
    if(projected.winner)return bad('No puedes preparar órdenes después de terminar la partida.');
    const result=validateOrder(projected,side,raw);if(!result.ok)return result;const order=result.order;
    if(order.kind!=='pass'){
      const key=`${order.unitId}:${order.kind}`;
      if(used.has(key))return bad('Una misma pieza no puede repetir la misma acción en esta ronda.');
      used.add(key);
      if(order.castle){const rookKey=`${order.castle.rookId}:move`;if(used.has(rookKey))return bad('La torre ya utilizó su movimiento en esta ronda.');used.add(rookKey);}
    }
    normalized.push(order);applyOrder(projected,side,order);
  }
  return good({orders:normalized,forecast:projected});
}
export function submitPlan(state,side,orders=[]) {
  if(state.phase!=='planning'||state.ready[side])return bad('Este plan ya está cerrado.');
  const validation=validatePlan(state,side,orders);if(!validation.ok)return validation;
  const rules=roundRules(state);
  state.plans[side]=clone(validation.orders);state.ready[side]=true;state.activePlanner=other(side);
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
  const event=applyOrder(state,next.side,next.order);state.lastSide=next.side;event.sequenceIndex=state.resolutionIndex-1;event.sequenceTotal=state.resolution.length;event.actionNumber=++state.actionNumber;state.log.push(clone(event));
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
