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
function nextRandom(state){let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;return state.rng/4294967296;}
export function roundRules(state=1){const value=Number(typeof state==='number'?state:state?.round),round=Number.isFinite(value)?Math.floor(value):1,actions=Math.max(1,Math.min(3,round||1));return {seconds:20,actions,maxMoves:actions,maxOther:1};}
export function createMatch({seed=Date.now()}={}){
  let normalized=typeof seed==='number'?seed: [...String(seed)].reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),7);
  const units=[];
  for(const color of ['w','b']) {
    const counts={};
    TYPES.forEach((type,index)=>{const count=counts[type]=(counts[type]??0)+1;units.push({id:`${color}-${type}${type==='p'||count>1?count:''}`,color,type,homeSquare:sq(index%8,(color==='w'?(index<8?2:1):(index<8?7:8))-1),square:null,captured:false,guard:0,hasMoved:false});});
  }
  const layout=Array(8).fill(null);let rngState={rng:(normalized>>>0)||0x9e3779b9};
  for(let warmup=0;warmup<8;warmup++)nextRandom(rngState);
  const choose=items=>items[Math.floor(nextRandom(rngState)*items.length)],empty=()=>layout.map((v,i)=>v===null?i:null).filter(i=>i!==null);
  layout[choose([0,2,4,6])]='b';layout[choose([1,3,5,7])]='b';layout[choose(empty())]='q';
  layout[choose(empty())]='n';layout[choose(empty())]='n';empty().forEach((file,i)=>layout[file]=['r','k','r'][i]);
  for(const color of ['w','b']){const counts={};layout.forEach((type,file)=>{const list=units.filter(u=>u.color===color&&u.type===type);const u=list[counts[type]??0];counts[type]=(counts[type]??0)+1;u.homeSquare=sq(file,color==='w'?0:7);});}
  return {version:6,opponent:'ai',rng:rngState.rng,units,tiles:{},phase:'deployment',round:0,firstSide:'w',lastSide:null,actionNumber:0,activePlanner:'w',ready:{w:false,b:false},deployed:{w:false,b:false},plans:{w:[],b:[]},winner:null,log:[],shieldUsed:{w:false,b:false},enPassant:null,resolution:[],resolutionIndex:0,revision:0};
}
export function autoDeploy(state,side){
  if(!['w','b'].includes(side))return bad('Bando no válido.');
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  state.units.filter(u=>u.color===side).forEach(u=>{u.square=u.homeSquare;});state.revision++;return good();
}
export function confirmDeployment(state,side){
  if(state.phase!=='deployment'||state.deployed[side])return bad('El despliegue ya está cerrado.');
  if(!['w','b'].includes(side)||livingUnits(state,side).filter(u=>u.square===u.homeSquare).length!==16)return bad('Las dieciséis piezas deben estar en su formación inicial 960.');
  state.deployed[side]=true;state.ready[side]=true;
  if(state.deployed.w&&state.deployed.b){state.phase='ready';state.activePlanner=null;state.ready={w:false,b:false};}
  state.revision++;return good();
}
export function beginBattle(state){if(state.phase!=='ready')return bad('La batalla todavía no está lista.');state.firstSide='w';return startRound(state);}
export function startRound(state){
  if(state.winner)return bad('La partida ha terminado.');
  if(!(state.phase==='ready'||state.phase==='resolution'&&state.resolutionIndex>=state.resolution.length))return bad('La siguiente ronda todavía no puede empezar.');
  state.firstSide='w';state.round++;state.phase='planning';state.ready={w:false,b:false};state.plans={w:[],b:[]};state.activePlanner='w';state.resolution=[];state.resolutionIndex=0;
  for(const unit of state.units)unit.guard=0;
  state.revision++;return good({rules:roundRules(state)});
}
function ray(state,unit,direction,max=7){
  if(!alive(unit))return [];const [x,y]=xy(unit.square),[dx,dy]=DIRECTIONS[direction],result=[];
  for(let step=1;step<=max;step++){const square=sq(x+dx*step,y+dy*step);if(!square||solid(state,square))break;result.push(square);if(unitAt(state,square))break;}return result;
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
    if(front&&!solid(state,front)){result.push(front);const twice=sq(x,y+2*dy);if(!unit.hasMoved&&y===(unit.color==='w'?1:6)&&!unitAt(state,front)&&twice&&!solid(state,twice))result.push(twice);}return result;
  }
  return [...new Set([...getCaptureSquares(state,unit),...(unit.type==='k'?getCastleOptions(state,unit).map(c=>c.inputTarget):[])])];
}
export function validateOrder(state,side,raw,{executing=false}={}){
  if(!raw||!['move','block','pass'].includes(raw.kind))return bad('Acción desconocida.');
  if(raw.kind==='pass')return good({order:{kind:'pass'}});
  const unit=findUnit(state,raw.unitId);if(!alive(unit)||unit.color!==side)return bad('La pieza ya no está disponible.');
  if(raw.kind==='block'){
    if(state.shieldUsed?.[side])return bad('Tu bando ya utilizó su único escudo.');
    return good({order:{unitId:unit.id,kind:'block'}});
  }
  if(!validSquare(raw.target))return bad('Elige una casilla del tablero.');
  const options=unit.type==='k'?getCastleOptions(state,unit):[];
  const castle=raw.castle?options.find(c=>c.rookId===raw.castle.rookId):options.find(c=>c.inputTarget===raw.target)??options.find(c=>c.target===raw.target&&!unitAt(state,c.target)&&Math.abs(c.target.charCodeAt(0)-unit.square.charCodeAt(0))>1);
  if(raw.castle&&(!castle||![castle.target,castle.inputTarget].includes(raw.target)))return bad('El enroque ya no es posible.');
  const order={unitId:unit.id,kind:'move',target:castle?.target??raw.target};
  if(castle)order.castle=castle;
  else if(!getLegalMoves(state,unit).includes(order.target))return bad('Movimiento fuera del alcance o bloqueado.');
  if(unit.type==='p'&&order.target[1]===(side==='w'?'8':'1')){
    const promotion=raw.promotion??'q';if(!['q','r','b','n'].includes(promotion))return bad('Elige reina, torre, alfil o caballo para promocionar.');order.promotion=promotion;
  }
  if(executing&&!castle){
    const target=unitAt(state,order.target);if(target?.color===side)return bad('La casilla sigue ocupada por una pieza aliada.');
    if(unit.type==='p'){
      const diagonal=unit.square[0]!==order.target[0];
      if(!diagonal&&target)return bad('El peón no captura de frente.');
      if(diagonal&&!target){const ep=state.enPassant,victim=ep&&findUnit(state,ep.victimId);if(!ep||ep.availableTo!==side||ep.square!==order.target||!alive(victim)||victim.color===side||victim.type!=='p')return bad('El peón solo captura en diagonal si hay un rival o captura al paso.');order.enPassant=victim.id;}
    }
  }
  return good({order});
}
function applyOrder(state,side,raw){
  const check=validateOrder(state,side,raw,{executing:true});
  const event={kind:raw?.kind??'pass',side,unitId:raw?.unitId??null,from:null,to:null,targets:[],round:state.round,message:'',revision:++state.revision};
  // Any action consumes the immediately following en-passant opportunity.
  state.enPassant=null;
  if(!check.ok){event.kind='fizzle';event.message=check.error;return event;}
  const order=check.order;if(order.kind==='pass'){event.message='Espera.';return event;}
  const unit=findUnit(state,order.unitId);event.from=unit.square;event.to=unit.square;
  if(order.kind==='block'){state.shieldUsed[side]=true;unit.guard=1;event.message=`${UNIT_NAMES[unit.type]}: escudo activo hasta finalizar la ronda.`;return event;}
  const victim=order.enPassant?findUnit(state,order.enPassant):unitAt(state,order.target);
  if(victim&&!order.castle){
    if(victim.guard){victim.guard=0;event.bounced=true;event.attemptedTo=order.target;event.targets.push({id:victim.id,square:victim.square,captured:false,blocked:true});event.message='El escudo repele la captura.';return event;}
    victim.captured=true;victim.guard=0;event.capture={id:victim.id,square:victim.square,...(order.enPassant?{enPassant:true}:{})};event.targets.push({id:victim.id,square:victim.square,captured:true});
    if(victim.type==='k'){state.winner=side;state.phase='finished';state.activePlanner=null;event.winner=side;}
  }
  const originalType=unit.type;unit.square=order.target;unit.hasMoved=true;event.to=unit.square;
  if(order.castle){const rook=findUnit(state,order.castle.rookId);rook.square=order.castle.rookTo;rook.hasMoved=true;event.castle={...order.castle};}
  if(order.promotion){unit.type=order.promotion;event.promotion={from:'p',to:order.promotion};}
  if(originalType==='p'&&Math.abs(Number(event.to[1])-Number(event.from[1]))===2)state.enPassant={square:unit.square[0]+((Number(event.to[1])+Number(event.from[1]))/2),victimId:unit.id,availableTo:other(side)};
  event.message=`${UNIT_NAMES[originalType]}: ${event.from} → ${event.to}${event.capture?' · captura':''}${event.promotion?' · promoción':''}.`;return event;
}
// A forecasted king capture is uncertain: enemy orders may move that king first.
// Keep all declaration slots available while remembering its provisional result.
function applyForecastOrder(state,side,order){
  const phase=state.phase,event=applyOrder(state,side,order);
  if(state.winner){state.predictedWinner=state.winner;state.winner=null;state.phase=phase;}
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
  const projected=clone({...state,log:[],plans:{w:[],b:[]},resolution:[]}),used=new Set(),normalized=[];
  for(const raw of orders){
    const result=validateOrder(projected,side,raw);if(!result.ok)return result;const order=result.order;
    if(order.kind!=='pass'){
      const key=`${order.unitId}:${order.kind}`;if(used.has(key))return bad('Una misma pieza no puede repetir la misma acción en esta ronda.');used.add(key);
      if(order.castle){const key=`${order.castle.rookId}:move`;if(used.has(key))return bad('La torre ya utilizó su movimiento en esta ronda.');used.add(key);}
    }
    normalized.push(order);applyForecastOrder(projected,side,order);
  }return good({orders:normalized,forecast:projected});
}
export function submitPlan(state,side,orders=[]){
  if(state.phase!=='planning'||state.ready[side])return bad('Este plan ya está cerrado.');const validation=validatePlan(state,side,orders);if(!validation.ok)return validation;
  state.plans[side]=clone(validation.orders);state.ready[side]=true;state.activePlanner=other(side);
  if(state.ready.w&&state.ready.b){state.phase='resolution';state.activePlanner=null;state.resolution=[];state.resolutionIndex=0;for(let i=0;i<roundRules(state).actions;i++)for(const color of ['w','b'])state.resolution.push({side:color,order:clone(state.plans[color][i]??{kind:'pass'})});}
  state.revision++;return good();
}
export function resolveNext(state){
  if(state.phase!=='resolution')return bad('No hay una secuencia pendiente.');const next=state.resolution[state.resolutionIndex++];if(!next)return bad('La secuencia ya terminó.');
  const event=applyOrder(state,next.side,next.order);state.lastSide=next.side;event.sequenceIndex=state.resolutionIndex-1;event.sequenceTotal=state.resolution.length;event.actionNumber=++state.actionNumber;state.log.push(clone(event));if(state.log.length>240)state.log.shift();
  const roundEnded=state.resolutionIndex>=state.resolution.length;if(roundEnded&&!state.winner)startRound(state);
  return good({event,done:Boolean(state.winner||roundEnded),roundEnded,winner:state.winner});
}
export function publicView(state,viewer){
  const view=clone(state);delete view.rng;
  if(state.phase==='deployment'){for(const u of view.units)if(u.color!==viewer)u.square=null;view.log=[];}
  if(state.phase!=='resolution'&&state.phase!=='finished'){for(const side of ['w','b'])if(side!==viewer)view.plans[side]=[];view.resolution=[];}
  return view;
}
