// Deterministic concealed-order chess. Captures, not hit points, remove pieces.
export const UNIT_NAMES={p:'Peón',n:'Caballo',b:'Alfil',r:'Torre',q:'Reina',k:'Rey'};
export const DIRECTIONS={N:[0,1],NE:[1,1],E:[1,0],SE:[1,-1],S:[0,-1],SW:[-1,-1],W:[-1,0],NW:[-1,1]};
const TYPES=[...Array(8).fill('p'),'r','n','b','q','k','b','n','r'];
const DIAGONALS=['NE','SE','SW','NW'],ORTHOGONALS=['N','E','S','W'],ALL=Object.keys(DIRECTIONS);
const KNIGHT=[[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
const other=color=>color==='w'?'b':'w';
const good=(extra={})=>({ok:true,...extra}),bad=error=>({ok:false,error}),clone=value=>structuredClone(value);
const validSquare=square=>typeof square==='string'&&/^[a-h][1-8]$/.test(square);
const xy=square=>[square.charCodeAt(0)-97,Number(square[1])-1];
const sq=(x,y)=>x>=0&&x<8&&y>=0&&y<8?`${String.fromCharCode(97+x)}${y+1}`:null;
const alive=unit=>unit&&!unit.captured&&validSquare(unit.square);
export const unitAt=(state,square)=>state.units.find(unit=>alive(unit)&&unit.square===square);
export const livingUnits=(state,side)=>state.units.filter(unit=>alive(unit)&&(!side||unit.color===side));
const findUnit=(state,unit)=>typeof unit==='string'?state.units.find(item=>item.id===unit):unit;
const solid=(state,square)=>['void','obstacle'].includes(state.tiles?.[square]?.kind);
const attackDirections=unit=>unit.type==='b'?DIAGONALS:unit.type==='r'?ORTHOGONALS:ALL;
export function roundRules(state=1){const value=Number(typeof state==='number'?state:state?.round),round=Number.isFinite(value)?Math.floor(value):1,actions=round>=2?2:1;return {seconds:20,actions,maxMoves:actions,maxOther:0};}
export function firstSideForRound(round){return Math.floor((Math.max(1,Number(round)||1)-1)/2)%2?'b':'w';}
export function createMatch({seed=Date.now()}={}){
  let normalized=typeof seed==='number'?seed: [...String(seed)].reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),7);
  const units=[];
  for(const color of ['w','b']) {
    const counts={};
    TYPES.forEach((type,index)=>{const count=counts[type]=(counts[type]??0)+1;units.push({id:`${color}-${type}${type==='p'||count>1?count:''}`,color,type,homeSquare:sq(index%8,(color==='w'?(index<8?2:1):(index<8?7:8))-1),square:null,captured:false,hasMoved:false});});
  }
  return {version:9,opponent:'ai',rng:(normalized>>>0)||1,units,tiles:{},phase:'deployment',round:0,firstSide:'w',lastSide:null,actionNumber:0,activePlanner:'w',ready:{w:false,b:false},deployed:{w:false,b:false},plans:{w:[],b:[]},winner:null,log:[],enPassant:null,resolution:[],resolutionIndex:0,revision:0};
}
export function autoDeploy(state,side){
  if(!['w','b'].includes(side))return bad('Bando no válido.');
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  state.units.filter(u=>u.color===side).forEach(u=>{u.square=u.homeSquare;});state.revision++;return good();
}
export function confirmDeployment(state,side){
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  if(!['w','b'].includes(side)||livingUnits(state,side).filter(u=>u.square===u.homeSquare).length!==16)return bad('Las dieciséis piezas deben estar en su formación inicial clásica.');
  state.deployed[side]=true;state.ready[side]=true;
  if(state.deployed.w&&state.deployed.b){state.phase='ready';state.activePlanner=null;state.ready={w:false,b:false};}
  state.revision++;return good();
}
export function beginBattle(state){if(state.phase!=='ready')return bad('La batalla todavía no está lista.');state.firstSide='w';return startRound(state);}
export function startRound(state){
  if(state.winner)return bad('La partida ha terminado.');
  if(!(state.phase==='ready'||state.phase==='resolution'&&state.resolutionIndex>=state.resolution.length))return bad('La siguiente ronda todavía no puede empezar.');
  state.round++;state.firstSide=firstSideForRound(state.round);state.phase='planning';state.ready={w:false,b:false};state.plans={w:[],b:[]};state.activePlanner='w';state.resolution=[];state.resolutionIndex=0;
  state.revision++;return good({rules:roundRules(state)});
}
function ray(state,unit,direction,max=7,ignoreBodies=false){
  if(!alive(unit))return [];const [x,y]=xy(unit.square),[dx,dy]=DIRECTIONS[direction],result=[];
  for(let step=1;step<=max;step++){const square=sq(x+dx*step,y+dy*step);if(!square||solid(state,square))break;result.push(square);if(!ignoreBodies&&unitAt(state,square))break;}return result;
}
export function getCaptureSquares(state,input){
  const unit=findUnit(state,input);if(!alive(unit))return [];const[x,y]=xy(unit.square);
  if(unit.type==='p'){const dy=unit.color==='w'?1:-1;return [-1,1].map(dx=>sq(x+dx,y+dy)).filter(s=>s&&!solid(state,s));}
  if(unit.type==='n')return KNIGHT.map(([dx,dy])=>sq(x+dx,y+dy)).filter(s=>s&&!solid(state,s));
  return attackDirections(unit).flatMap(d=>ray(state,unit,d,unit.type==='k'?1:7));
}
export function isSquareAttacked(state,square,bySide){return livingUnits(state,bySide).some(unit=>getCaptureSquares(state,unit).includes(square));}
export function getCastleOptions(state,input){
  const king=findUnit(state,input);if(!alive(king)||king.type!=='k'||king.hasMoved)return [];
  const rank=king.color==='w'?'1':'8',home=king.homeSquare;
  if(king.square!==home||home[1]!==rank)return [];let kingSafe=null;
  const span=(a,b)=>{const lo=Math.min(a.charCodeAt(0),b.charCodeAt(0)),hi=Math.max(a.charCodeAt(0),b.charCodeAt(0));return Array.from({length:hi-lo+1},(_,i)=>String.fromCharCode(lo+i)+rank);},result=[];
  for(const rook of livingUnits(state,king.color).filter(u=>u.type==='r'&&!u.hasMoved&&u.square===u.homeSquare&&u.square[1]===rank)){
    const right=rook.square>home,target=(right?'g':'c')+rank,rookTo=(right?'f':'d')+rank;
    const path=[...new Set([...span(home,target),...span(rook.square,rookTo)])];
    if(path.some(square=>solid(state,square)||state.units.some(u=>alive(u)&&u.square===square&&u.id!==king.id&&u.id!==rook.id)))continue;
    kingSafe??=!isSquareAttacked(state,home,other(king.color));if(!kingSafe)return [];
    const safe=span(home,target).filter(square=>square!==home&&square!==target).every(square=>!isSquareAttacked({...state,units:state.units.map(u=>u.id===king.id?{...u,square}:u.id===rook.id?{...u,square:null}:u)},square,other(king.color)));
    const final={...state,units:state.units.map(u=>u.id===king.id?{...u,square:target}:u.id===rook.id?{...u,square:rookTo}:u)};
    if(safe&&!isSquareAttacked(final,target,other(king.color)))result.push({target,inputTarget:rook.square,rookId:rook.id,rookFrom:rook.square,rookTo});
  }return result;
}

// These are declaration destinations, so an occupied endpoint is deliberately allowed.
export function getLegalMoves(state,input){
  const unit=findUnit(state,input);if(!alive(unit))return [];const [x,y]=xy(unit.square);
  if(unit.type==='p'){
    const dy=unit.color==='w'?1:-1,front=sq(x,y+dy),result=getCaptureSquares(state,unit);
    if(front&&!solid(state,front)){result.push(front);const twice=sq(x,y+2*dy);if(!unit.hasMoved&&y===(unit.color==='w'?1:6)&&twice&&!solid(state,twice))result.push(twice);}return result;
  }
  const area=['b','r','q'].includes(unit.type)?attackDirections(unit).flatMap(d=>ray(state,unit,d,7,true)):getCaptureSquares(state,unit);return [...new Set([...area,...(unit.type==='k'?getCastleOptions(state,unit).map(c=>c.inputTarget):[])])];
}
export function movementPath(from,to){
 if(!validSquare(from)||!validSquare(to)||from===to)return [];
 const[x,y]=xy(from),[u,v]=xy(to),dx=u-x,dy=v-y;if(dx&&dy&&Math.abs(dx)!==Math.abs(dy))return [to];
 return Array.from({length:Math.max(Math.abs(dx),Math.abs(dy))},(_,i)=>sq(x+Math.sign(dx)*(i+1),y+Math.sign(dy)*(i+1)));
}
function geometricMove(unit,target){
 if(!validSquare(target)||unit.square===target)return false;
 const[x,y]=xy(unit.square),[u,v]=xy(target),dx=Math.abs(u-x),dy=Math.abs(v-y);
 if(unit.type==='n')return dx*dy===2;
 if(unit.type==='k')return Math.max(dx,dy)===1;
 if(unit.type==='b')return dx===dy;
 if(unit.type==='r')return dx===0||dy===0;
 if(unit.type==='q')return dx===dy||dx===0||dy===0;
 const forward=unit.color==='w'?1:-1,d=v-y;return dx<=1&&d===forward||dx===0&&d===2*forward&&!unit.hasMoved&&y===(unit.color==='w'?1:6);
}
export function validateOrder(state,side,raw,{executing=false}={}){
 if(!raw||!['move','pass'].includes(raw.kind))return bad('Acción desconocida.');
 if(raw.kind==='pass')return good({order:{kind:'pass'}});
 const unit=findUnit(state,raw.unitId);if(!alive(unit)||unit.color!==side)return bad('La pieza ya fue capturada o no está disponible.');
 if(!validSquare(raw.target))return bad('Elige una casilla del tablero.');
 const options=unit.type==='k'?getCastleOptions(state,unit):[];
 const castle=raw.castle?options.find(c=>c.rookId===raw.castle.rookId):options.find(c=>c.inputTarget===raw.target)??options.find(c=>c.target===raw.target&&!unitAt(state,c.target)&&Math.abs(c.target.charCodeAt(0)-unit.square.charCodeAt(0))>1);
 if(raw.castle&&(!castle||![castle.target,castle.inputTarget].includes(raw.target)))return bad('Enroque cancelado: el camino o la seguridad del rey cambiaron.');
 const order={unitId:unit.id,kind:'move',from:unit.square,target:castle?.target??raw.target};
 if(castle)order.castle=castle;
 else if(executing?!geometricMove(unit,order.target):!getLegalMoves(state,unit).includes(order.target))return bad('Movimiento fuera del alcance.');
 if(unit.type==='p'&&order.target[1]===(side==='w'?'8':'1')){const promotion=raw.promotion??'q';if(!['q','r','b','n'].includes(promotion))return bad('Elige reina, torre, alfil o caballo.');order.promotion=promotion;}
 return good({order});
}
function applyOrder(state,side,raw){
 const check=validateOrder(state,side,raw,{executing:true});
 const actor=findUnit(state,raw?.unitId),origin=alive(actor)?actor.square:raw?.from??actor?.square??null;
 const event={kind:raw?.kind??'pass',side,unitId:raw?.unitId??null,from:origin,to:origin,intendedTo:raw?.target??null,path:origin&&raw?.target?movementPath(origin,raw.target):[],targets:[],round:state.round,message:'',revision:++state.revision};
 const ep=state.enPassant;state.enPassant=null;
 if(!check.ok){event.kind='fizzle';event.message=check.error;return event;}
 const order=check.order;if(order.kind==='pass'){event.message='Espera: no se declaró movimiento.';return event;}
 const unit=actor,originalType=unit.type;let target=order.target,victim=null;
 if(order.castle){event.castle={...order.castle};}
 else if(unit.type==='n'){
  const occupant=unitAt(state,target);if(occupant?.color===side){event.kind='fizzle';event.message='El caballo no puede aterrizar sobre un aliado.';return event;}victim=occupant;
 }else if(unit.type==='p'&&unit.square[0]!==target[0]){
  victim=unitAt(state,target);if(victim?.color===side){event.kind='fizzle';event.message='Diagonal ocupada por un aliado.';return event;}
  if(!victim){victim=ep?.availableTo===side&&ep.square===target?findUnit(state,ep.victimId):null;if(!alive(victim)||victim.type!=='p'||victim.color===side){event.kind='fizzle';event.message='No apareció un enemigo en la diagonal ni existe captura al paso.';return event;}event.enPassant=true;}
 }else{
  let previous=unit.square;
  for(const cell of movementPath(unit.square,target)){
   const occupant=unitAt(state,cell);
   if(solid(state,cell)||occupant){
    event.intercepted={square:cell,id:occupant?.id??null,color:occupant?.color??null};
    if(occupant&&occupant.color!==side&&unit.type!=='p'){victim=occupant;target=cell;}
    else{target=previous;event.stoppedShort=true;}
    break;
   }previous=cell;
  }
 }
 if(target===unit.square&&!order.castle){event.kind='fizzle';event.message=unit.type==='p'?'El peón no pudo avanzar: la primera casilla está ocupada.':'No hay espacio antes de la pieza que bloquea el recorrido.';return event;}
 if(victim){victim.captured=true;event.capture={id:victim.id,square:victim.square,...(event.enPassant?{enPassant:true}:{})};event.targets.push({id:victim.id,square:victim.square,captured:true});if(victim.type==='k'){state.winner=side;state.winReason='capture';state.phase='finished';state.activePlanner=null;event.winner=side;}}
 unit.square=target;unit.hasMoved=true;event.to=target;
 if(order.castle){const rook=findUnit(state,order.castle.rookId);rook.square=order.castle.rookTo;rook.hasMoved=true;}
 if(order.promotion&&target[1]===(side==='w'?'8':'1')){unit.type=order.promotion;event.promotion={from:'p',to:order.promotion};}
 if(originalType==='p'&&Math.abs(Number(target[1])-Number(event.from[1]))===2)state.enPassant={square:target[0]+((Number(target[1])+Number(event.from[1]))/2),victimId:unit.id,availableTo:other(side)};
 event.message=`${UNIT_NAMES[originalType]}: ${event.from} → ${target}${event.capture?' · captura':''}${event.stoppedShort?' · se detuvo antes del bloqueo':''}.`;return event;
}
const mateCache=new Map();
function rememberMate(key,result){if(mateCache.size>=4096)mateCache.delete(mateCache.keys().next().value);mateCache.set(key,result);return result;}
export function isCheckmate(state,side){
 const king=livingUnits(state,side).find(u=>u.type==='k');if(!king||!isSquareAttacked(state,king.square,other(side)))return false;
 const cacheKey=side+state.units.filter(alive).map(u=>u.color+u.type+u.square+(u.type==='p'?Number(u.hasMoved):'')).join('')+JSON.stringify(state.enPassant)+JSON.stringify(state.tiles);
 if(mateCache.has(cacheKey))return mateCache.get(cacheKey);
 for(const unit of livingUnits(state,side))for(const target of getLegalMoves(state,unit)){
  const occupant=unitAt(state,target);if(occupant?.color===side)continue;
  if(unit.type!=='n'&&movementPath(unit.square,target).slice(0,-1).some(s=>unitAt(state,s)||solid(state,s)))continue;
  let victim=occupant;
  if(unit.type==='p'){
   const diagonal=target[0]!==unit.square[0];if(!diagonal&&occupant)continue;
   if(diagonal&&!occupant){const ep=state.enPassant;if(ep?.availableTo!==side||ep.square!==target)continue;victim=findUnit(state,ep.victimId);if(!alive(victim))continue;}
  }
  const probe={...state,units:state.units.map(u=>u.id===unit.id?{...u,square:target,type:u.type==='p'&&['1','8'].includes(target[1])?'q':u.type}:u.id===victim?.id?{...u,captured:true}:u)};
  const square=unit.id===king.id?target:king.square;
  if(!isSquareAttacked(probe,square,other(side)))return rememberMate(cacheKey,false);
 }
 return rememberMate(cacheKey,true);
}
function adjudicate(state,event,actor){
 if(state.winner)return;
 for(const side of [other(actor),actor])if(isCheckmate(state,side)){state.winner=other(side);state.winReason='checkmate';state.matedSide=side;state.phase='finished';state.activePlanner=null;event.winner=state.winner;event.checkmate={side,square:livingUnits(state,side).find(u=>u.type==='k').square};break;}
}
// A forecasted king capture is uncertain: enemy orders may move that king first.
// Keep all declaration slots available while remembering its provisional result.
function applyForecastOrder(state,side,order){
  const phase=state.phase,event=applyOrder(state,side,order);adjudicate(state,event,side);
  if(state.winner){state.predictedWinner??=state.winner;state.predictedReason??=state.winReason;state.winner=null;state.winReason=null;state.matedSide=null;state.phase=phase;}
  return event;
}
export function previewPlan(state,side,orders=[]){
  const projected=clone({...state,log:[],plans:{w:[],b:[]},resolution:[]});projected.forecastErrors=[];projected.forecastEvents=[];
  for(const raw of orders){
    const check=validateOrder(projected,side,raw);
    if(!check.ok){projected.forecastErrors.push(check.error);continue;}
    projected.forecastEvents.push(applyForecastOrder(projected,side,check.order));
  }return projected;
}
export function validatePlan(state,side,orders=[]){
  if(!['w','b'].includes(side)||!Array.isArray(orders))return bad('Plan no válido.');
  if(orders.length>roundRules(state).actions)return bad(`Dispones de ${roundRules(state).actions} acciones en esta ronda.`);
  const projected=clone({...state,log:[],plans:{w:[],b:[]},resolution:[]}),normalized=[];
  for(const raw of orders){
    const result=validateOrder(projected,side,raw);if(!result.ok)return result;const order=result.order;
    normalized.push(order);applyForecastOrder(projected,side,order);
  }return good({orders:normalized,forecast:projected});
}
export function submitPlan(state,side,orders=[]){
  if(state.phase!=='planning'||state.ready[side])return bad('Este plan ya está cerrado.');const validation=validatePlan(state,side,orders);if(!validation.ok)return validation;
  state.plans[side]=clone(validation.orders);state.ready[side]=true;state.activePlanner=other(side);
  if(state.ready.w&&state.ready.b){state.phase='resolution';state.activePlanner=null;state.resolution=[];state.resolutionIndex=0;for(let i=0;i<roundRules(state).actions;i++)for(const color of [state.firstSide,other(state.firstSide)])state.resolution.push({side:color,order:clone(state.plans[color][i]??{kind:'pass'})});}
  state.revision++;return good();
}
export function resolveNext(state){
  if(state.phase!=='resolution')return bad('No hay una secuencia pendiente.');const next=state.resolution[state.resolutionIndex++];if(!next)return bad('La secuencia ya terminó.');
  const event=applyOrder(state,next.side,next.order);adjudicate(state,event,next.side);state.lastSide=next.side;event.priority=Boolean(next.priority);event.sequenceIndex=state.resolutionIndex-1;event.sequenceTotal=state.resolution.length;event.actionNumber=++state.actionNumber;state.log.push(clone(event));if(state.log.length>240)state.log.shift();
  const roundEnded=state.resolutionIndex>=state.resolution.length;if(roundEnded&&!state.winner)startRound(state);
  return good({event,done:Boolean(state.winner||roundEnded),roundEnded,winner:state.winner});
}
export function publicView(state,viewer){
  const view=clone(state);delete view.rng;
  if(state.phase==='deployment'){for(const u of view.units)if(u.color!==viewer)u.square=null;view.log=[];}
  if(state.phase!=='resolution'&&state.phase!=='finished'){for(const side of ['w','b'])if(side!==viewer)view.plans[side]=[];view.resolution=[];}
  return view;
}
