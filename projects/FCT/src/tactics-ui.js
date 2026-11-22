import './tactics.css';
import { createMatch, autoDeploy, confirmDeployment, rollInitiative, chooseInitiative, roundRules, submitPlan, resolveNext, getLegalMoves, getAttackSquares, attackOrderFor, unitAt, validatePlan, previewPlan, publicView, UNIT_NAMES, ABILITIES, orderCategory } from './tactics-engine.js';
import { planAI } from './tactics-ai.js';
import { tacticalValues } from './tactics-values.js';
import { describeBattleEvent, directionArrow } from './tactics-presentation.js';
import { appearanceFor, thumbnailUrl, setLoadout, armyPalettes } from './appearance.js';
import { createAudioSystem } from './audio-system.js';

try { const saved=sessionStorage.getItem('fct:tactics:loadout');if(saved)setLoadout(JSON.parse(saved)); } catch { /* Appearance preferences are optional. */ }
const $=selector=>document.querySelector(selector);
const board=$('#board-2d'), host3d=$('#board-3d'), rulesDialog=$('#rules-dialog');
const audio=createAudioSystem();
const FACE={N:'↑',E:'→',S:'↓',W:'←'}, DIR={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
const ACTION={move:'Mover',attack:'Atacar',block:'Bloquear',focus:'Focus',ultimate:'Definitiva',pass:'Esperar',fizzle:'Orden frustrada'};
let liteGraphics=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const other=side=>side==='w'?'b':'w';
const isAlive=unit=>unit.hp>0&&unit.square;
const squares=Array.from({length:64},(_,i)=>String.fromCharCode(97+i%8)+(8-Math.floor(i/8)));
let match=null, viewer='w', selectedId=null, inspectedId=null, draft=[], intent=null, pendingTarget=null, abilityMode=null;
let phaseToken=0, privacy=false, planning=false, resolving=false, roundPrepared=0, secondsLeft=0, totalSeconds=15, lastTick=0;
let view='3d', three=null, threePromise=null, lastEvent=null, toastTimer, furthestOrder=0;
let history=[],reviewIndex=null,facingOrderIndex=null,facingTimer=0,aiWorker=null,aiJob=0,aiPending=null;
let forecastMemo=null,checkMemo=new Map(),checkMatch=null,checkRevision=-1;
const sound=(name='menu2')=>audio.playSound(name);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sideName(side){return side==='w'?'Tu ejército':'El estratega';}
function look(unit){return appearanceFor(unit.type,unit.color);}
function toast(message){clearTimeout(toastTimer);$('#board-toast').textContent=message;$('#board-toast').hidden=false;toastTimer=setTimeout(()=>$('#board-toast').hidden=true,3200);}
function unitFrom(state,id=selectedId){return state?.units.find(unit=>unit.id===id);}
function forecast(){
  if(reviewIndex!==null)return history[reviewIndex].state;
  if(!match)return null;const key=JSON.stringify(draft);
  if(forecastMemo?.match===match&&forecastMemo.revision===match.revision&&forecastMemo.key===key)return forecastMemo.value;
  const value=match.phase==='planning'?previewPlan(match,viewer,draft):publicView(match,viewer);
  forecastMemo={match,revision:match.revision,key,value};return value;
}
function visibleState(){return forecast();}
function clearIntent(){clearTimeout(facingTimer);facingOrderIndex=null;intent=null;pendingTarget=null;abilityMode=null;}
function checkPlan(orders){
  if(checkMatch!==match||checkRevision!==match.revision){checkMemo.clear();checkMatch=match;checkRevision=match.revision;}
  const key=JSON.stringify(orders);if(!checkMemo.has(key)){const result=validatePlan(match,viewer,orders);checkMemo.set(key,{ok:result.ok,error:result.error});}return checkMemo.get(key);
}

function targetSquares(state,unit){
  if(!unit?.square||unit.color!==viewer||!planning||resolving||reviewIndex!==null||intent==='facing')return [];
  const moves=getLegalMoves(state,unit).filter(target=>!unitAt(state,target)&&checkPlan([...draft,{unitId:unit.id,kind:'move',target}]).ok);
  const attacks=getAttackSquares(state,unit).filter(target=>checkPlan([...draft,attackOrderFor(state,unit,target)]).ok);
  return [...new Set([...moves,...attacks])];
}
function renderBoard(){
  const state=visibleState();if(!state)return;
  const selected=unitFrom(state),targets=new Set(targetSquares(state,selected));
  if(!board.children.length)board.innerHTML=squares.map(square=>`<button type="button" class="tactical-cell" data-square="${square}" role="gridcell"><span class="cell-coordinate">${square}</span></button>`).join('');
  const occupants=new Map(state.units.filter(u=>isAlive(u)||u.type==='k'&&u.hp<=0&&state.phase==='finished').map(u=>[u.square,u]));
  for(const [index,cell]of [...board.children].entries()){
    const square=squares[index],unit=occupants.get(square),classes=['tactical-cell',(Math.floor(index/8)+index%8)%2?'dark':'light'];
    if(unit?.id===selectedId)classes.push('is-selected');
    if(targets.has(square))classes.push('is-target');
    if(state.tiles[square])classes.push('terrain-'+state.tiles[square].kind);
    cell.querySelectorAll('.combat-number').forEach(n=>n.remove());const oldToken=cell.querySelector('.tactical-token');if(oldToken){oldToken.getAnimations().forEach(a=>a.cancel());oldToken.classList.remove('is-focusing','is-striking','is-falling');}
    cell.className=classes.join(' ');cell.setAttribute('aria-selected',String(unit?.id===selectedId));
    cell.setAttribute('aria-label',`${square}${unit?`, ${UNIT_NAMES[unit.type]}, ${sideName(unit.color)}, ${unit.hp} de vida, mira ${unit.facing}`:''}`);
    const signature=unit?`${unit.id}:${unit.hp}:${unit.charged}:${unit.guard}:${unit.counterUntil}`:'';
    if(cell.dataset.piece!==signature){cell.querySelector('.tactical-token')?.remove();cell.dataset.piece=signature;if(unit){const token=document.createElement('span');token.className='tactical-token';token.dataset.unit=unit.id;const img=document.createElement('img');img.src=thumbnailUrl(look(unit),unit.hp<=0?'defeated':'standing');img.alt='';img.draggable=false;token.append(img);if(unit.charged){const charge=document.createElement('span');charge.className='token-charge';charge.textContent='✦';token.append(charge);}if(unit.guard||unit.counterUntil===state.round){const mark=document.createElement('span');mark.className='token-resource';mark.textContent='◇';token.append(mark);}cell.append(token);}}
  }
  if(three&&view==='3d')three.render(state,{selectedSquare:selected?.square,targets:[...targets],lastEvent:reviewIndex!==null?history[reviewIndex].event:lastEvent,interactive:planning&&!resolving&&reviewIndex===null&&draft.length<roundRules(match).actions});
}

function renderPhase(){
  if(!match)return;const panel=$('#phase-panel'),reviewing=reviewIndex!==null,show=match.phase==='planning'&&planning&&!reviewing;
  document.body.classList.toggle('is-planning',show);document.body.classList.toggle('is-reviewing',reviewing);
  $('#planning-panel').hidden=false;$('#queue-panel').hidden=!show;
  $('#review-controls').hidden=!reviewing;$('#review-open').disabled=resolving||history.length<2||(intent==='facing'&&draft.length>=roundRules(match).actions);
  $('#round-counter').textContent=`Ronda ${reviewing?history[reviewIndex].state.round:match.round||'—'}`;$('#action-clock').textContent='';
  if(reviewing){$('#phase-kicker').textContent='REVISIÓN';$('#battle-status').textContent='Partida pausada';panel.innerHTML='<h2>Revisando partida</h2><p>Recorre cada acción sin cambiar el resultado.</p>';renderReview();return;}
  if(match.phase==='initiative'){
    $('#phase-kicker').textContent='INICIATIVA';$('#battle-status').textContent='Dos ejércitos. Una corona.';
    const dice=match.dice,canChoose=dice?.winner==='w';
    panel.innerHTML=`<h2>${dice?`${escape(sideName(dice.winner))} gana`:'Lanza los dados'}</h2>${dice?`<div class="dice-pair"><div><span class="dice-face">${dice.w}</span>Tu ejército</div><div><span class="dice-face">${dice.b}</span>El estratega</div></div><p>Todas las piezas empiezan sin carga.</p>${canChoose?'<div class="choice-pair"><button type="button" data-command="choose-first">Jugar primero</button><button type="button" data-command="choose-second">Jugar segundo</button></div>':'<p>El estratega elige…</p>'}`:'<p>16 piezas por bando. Posición inicial de ajedrez.</p><button type="button" class="primary-button" data-command="roll">Lanzar dados</button>'}`;
  }else if(show){
    $('#phase-kicker').textContent='PREPARA TU SECUENCIA';$('#battle-status').textContent=intent==='facing'?'Movimiento listo · orientación opcional':'Elige tu siguiente orden';
    panel.innerHTML=`<div class="timer" id="planning-timer"><p>Tiempo de esta acción</p><strong id="timer-seconds"></strong></div><div class="timer-track"><i id="timer-progress"></i></div><p>Dos acciones por bando. Una pieza no puede repetir el mismo tipo.</p>`;updateTimer();
  }else if(match.phase==='resolution'){
    $('#phase-kicker').textContent='COMBATE';$('#battle-status').textContent=lastEvent?describeBattleEvent(lastEvent,match):'Ejecutando órdenes…';panel.innerHTML='<h2>¡En combate!</h2><p>Tu secuencia se cruza con la del rival.</p>';
  }else if(match.phase==='finished'){$('#phase-kicker').textContent='RESULTADO';$('#battle-status').textContent=winnerText();panel.innerHTML=`<h2>${escape(winnerText())}</h2><button type="button" data-command="review">Revisar partida</button><button type="button" data-command="restart">Otra partida</button>`;}
}
function renderControls(){renderInspector();renderFieldActions();if(match)renderQueue();}
function teamInfo(side){const palette=armyPalettes.find(p=>p.id===appearanceFor('p',side).palette);return {...palette,name:`${sideName(side)} · ${palette.label}`};}
function teamBadge(side,compact=false){const team=teamInfo(side);return `<span class="team-badge" title="${escape(team.name)}" style="--team-color:${team.swatch}"><i aria-hidden="true"></i>${escape(compact?`${side==='w'?'Tú':'Rival'} · ${team.label}`:team.name)}</span>`;}
function renderInspector(){
  const unit=match&&unitFrom(forecast(),inspectedId);$('#unit-name').textContent=unit?UNIT_NAMES[unit.type]:'Consulta';$('#unit-health').textContent=unit?`${unit.hp} / 6 ♥`:'';
  $('#unit-team').innerHTML=unit?teamBadge(unit.color,true):'';
  $('#unit-details').innerHTML=unit?`<span>${unit.square} · ${directionArrow[unit.facing]}</span><span>${unit.hp<=0?'Fuera de combate':unit.charged?'Definitiva lista':'Sin carga'}</span><span>${unit.type==='k'?'Proteger al rey':`Valor táctico ${tacticalValues[unit.type]}`}</span>`:'<span>Toca una ficha.</span><span>Consulta ambos</span><span>bandos.</span>';
}
function inspectSquare(square){
  if(!match||!square)return;const state=forecast(),unit=state.units.find(u=>u.square===square&&(isAlive(u)||u.type==='k'&&state.phase==='finished'));
  if(unit&&unit.id!==inspectedId){inspectedId=unit.id;renderInspector();}
}
function renderFieldActions(){
  const menu=$('#unit-actions'),destination=$('#destination-actions'),unit=match&&unitFrom(forecast(),intent==='facing'?draft[facingOrderIndex]?.unitId:selectedId);menu.hidden=destination.hidden=true;document.body.classList.remove('has-field-actions');
  if(!planning||resolving||reviewIndex!==null||!unit||unit.color!==viewer||view==='3d'&&!three)return;
  if(intent==='facing'){destination.innerHTML=`<div class="field-compass">${['N','W','E','S'].map(d=>`<button type="button" data-field-facing="${d}" aria-label="Mirar ${d}">${FACE[d]}</button>`).join('')}</div>`;destination.hidden=false;}
  else{
    const available=kind=>checkPlan([...draft,{unitId:unit.id,kind}]).ok;
    menu.innerHTML=`<button type="button" data-field-action="block" ${available('block')?'':'disabled'}>Bloquear</button><button type="button" data-field-action="focus" ${available('focus')?'':'disabled'}>Focus</button><button type="button" data-field-action="ultimate" ${available('ultimate')?'':'disabled'}>Definitiva</button>`;menu.hidden=false;
  }if(!menu.hidden&&view==='2d')document.body.classList.add('has-field-actions');positionFieldActions();
}
function positionFieldActions(){
  if(!match)return;const unit=unitFrom(forecast(),intent==='facing'?draft[facingOrderIndex]?.unitId:selectedId);if(!unit?.square)return;
  const wrap=$('.tactical-board-wrap'),box=wrap.getBoundingClientRect();
  for(const [id,square]of [['unit-actions',unit.square],['destination-actions',pendingTarget??unit.square]]){
    const el=$('#'+id);if(el.hidden)continue;if(id==='unit-actions'){el.style.left=`${box.width/2}px`;el.style.top=`${view==='3d'?box.height-el.offsetHeight-12:box.height+8}px`;continue;}let point;
    if(view==='3d'&&three)point=three.projectSquare(square);
    else{const rect=board.querySelector(`[data-square="${square}"]`).getBoundingClientRect();point={x:rect.x-box.x+rect.width/2,y:rect.y-box.y+rect.height/2};}
    if(!point)continue;const half=Math.min(el.offsetWidth/2+6,box.width/2);el.style.left=`${Math.max(half,Math.min(box.width-half,point.x))}px`;el.style.top=`${Math.max(8,Math.min(box.height-el.offsetHeight-8,(id==='unit-actions'?point.y+30:point.y-el.offsetHeight-28)))}px`;
  }
}

function commitOrder(order){const result=checkPlan([...draft,order]);if(!result.ok){toast(result.error);return;}draft.push(order);clearIntent();selectedId=null;sound('menu4');advanceOrder();}
function confirmMove(order){
  const result=checkPlan([...draft,order]);if(!result.ok){toast(result.error);return;}
  draft.push(order);clearIntent();selectedId=null;facingOrderIndex=draft.length-1;pendingTarget=order.target;intent='facing';sound('menu4');
  if(draft.length<roundRules(match).actions){furthestOrder=draft.length;secondsLeft=totalSeconds;lastTick=performance.now();}
  else facingTimer=setTimeout(()=>finishFacing(),2500);
  render();
}
function finishFacing(value){
  if(facingOrderIndex===null)return;if(value)draft[facingOrderIndex].facing=value;clearIntent();
  if(draft.length>=roundRules(match).actions)void sealPlan();else render();
}
function orderLabel(order,index){const unit=unitFrom(match,order.unitId),projected=previewPlan(publicView(match,viewer),viewer,draft.slice(0,index)),converted=order.kind==='move'&&orderCategory(projected,order)==='other';return `${unit?UNIT_NAMES[unit.type]:''} · ${converted?'Atacar':ACTION[order.kind]}${order.target?` ${order.target}`:''}${order.direction?` ${DIR[order.direction]}`:''}${order.mode?` · ${ABILITIES[unit?.type]?.name??'Área'}`:''}${order.facing&&!converted?` ${FACE[order.facing]}`:''}`;}
function renderQueue(){
  const max=roundRules(match).actions;$('#queue-count').textContent=`${draft.length} / ${max}`;
  $('#order-queue').innerHTML=draft.length?draft.map((order,index)=>`<li><span class="queue-number">${index+1}</span><span>${escape(orderLabel(order,index))}</span></li>`).join(''):'<li class="queue-empty">Elige las órdenes directamente sobre el tablero.</li>';
}

function render(){renderPhase();renderBoard();renderControls();}
function selectUnit(id){if(!planning||resolving||reviewIndex!==null)return;const full=intent==='facing'&&draft.length>=roundRules(match).actions;if(intent==='facing')finishFacing();if(full)return;const unit=unitFrom(forecast(),id);if(!unit||unit.color!==viewer||unit.hp<=0)return;selectedId=id;inspectedId=id;clearIntent();sound();render();}
function handleSquare(square){
  if(!match)return;inspectSquare(square);
  if(!planning||resolving||reviewIndex!==null)return;
  if(intent==='facing'){const full=draft.length>=roundRules(match).actions;finishFacing();if(full)return;}
  if(!square){selectedId=null;clearIntent();render();return;}
  const state=forecast(),unit=unitFrom(state),clicked=unitAt(state,square);
  if(unit&&square!==unit.square&&targetSquares(state,unit).includes(square)){
    if(clicked)commitOrder(attackOrderFor(state,unit,square));
    else confirmMove({unitId:unit.id,kind:'move',target:square,facing:unit.facing});
    return;
  }
  if(clicked?.color===viewer)selectUnit(clicked.id);else{selectedId=null;clearIntent();render();}
}
function beginBoardDrag(square){
  if(!planning||resolving||reviewIndex!==null)return;
  if(intent==='facing'){const full=draft.length>=roundRules(match).actions;finishFacing();if(full)return;}
  const unit=unitAt(forecast(),square);if(!unit||unit.color!==viewer)return;
  selectedId=unit.id;inspectedId=unit.id;clearIntent();render();
}
function handleBoardDrag(from,to){
  if(!planning||resolving||reviewIndex!==null||!to)return;
  const unit=unitAt(forecast(),from);if(!unit||unit.color!==viewer)return;
  selectedId=unit.id;clearIntent();handleSquare(to);
}
function advanceOrder(){
  if(draft.length>=roundRules(match).actions||forecast().winner){void sealPlan();return;}
  if(draft.length>furthestOrder){furthestOrder=draft.length;secondsLeft=totalSeconds;lastTick=performance.now();}
  render();
}
function expireOrder(){
  while(draft.length<=furthestOrder&&draft.length<roundRules(match).actions)draft.push({kind:'pass'});
  clearIntent();advanceOrder();
}
function setAction(kind){if(!planning||reviewIndex!==null)return;const unit=unitFrom(forecast());if(!unit)return;commitOrder({unitId:unit.id,kind,...(kind==='ultimate'?{mode:'sweep'}:{})});}
function newMatch(){
  phaseToken++;planning=false;resolving=false;privacy=false;roundPrepared=0;reviewIndex=null;history=[];forecastMemo=null;aiWorker?.terminate();aiWorker=null;aiPending=null;
  match=createMatch({seed:crypto.getRandomValues(new Uint32Array(1))[0]});viewer='w';draft=[];lastEvent=null;selectedId=null;inspectedId=null;clearIntent();
  for(const side of ['w','b']){autoDeploy(match,side);confirmDeployment(match,side);}
  render();void setView('3d');
}
function rollDice(){
  const result=rollInitiative(match);if(!result.ok){toast(result.error);return;}sound('menu3');render();
  if(match.dice.winner==='b'){const token=phaseToken;setTimeout(()=>{if(token!==phaseToken)return;const choice=chooseInitiative(match,'b',{first:true});if(choice.ok)prepareRound();},700);}
}
function choosePrivilege(first){if(match.dice.winner!=='w')return;const result=chooseInitiative(match,'w',{first});if(!result.ok){toast(result.error);return;}sound('menu4');prepareRound();}
function prepareRound(){
  if(match.phase!=='planning')return;
  if(roundPrepared!==match.round){roundPrepared=match.round;draft=[];lastEvent=null;aiPending=requestAI();}
  if(!history.length)recordPosition(null);
  viewer='w';selectedId=null;clearIntent();beginPlanning();
}
function requestAI(){
  const state=publicView(match,'b'),id=++aiJob;
  if(typeof Worker==='undefined')return Promise.resolve(planAI(state,'b'));
  return new Promise(resolve=>{
    try{aiWorker??=new Worker(new URL('./tactics-ai-worker.js',import.meta.url),{type:'module'});
      aiWorker.onmessage=({data})=>{if(data.id!==id)return;resolve(data.orders??planAI(state,'b'));};
      aiWorker.onerror=()=>{aiWorker?.terminate();aiWorker=null;resolve(planAI(state,'b'));};
      aiWorker.postMessage({id,state,side:'b'});
    }catch{resolve(planAI(state,'b'));}
  });
}
function recordPosition(event){
  history.push({state:structuredClone({units:match.units,tiles:match.tiles,phase:match.phase,round:match.round,firstSide:match.firstSide,winner:match.winner,revision:match.revision,opponent:'ai'}),event:event?structuredClone(event):null});
}
function enterReview(){if(resolving||history.length<2)return;$('#result-dialog').close();clearIntent();selectedId=null;reviewIndex=history.length-1;render();}
function renderReview(){
  const entry=history[reviewIndex];$('#review-range').max=String(history.length-1);$('#review-range').value=String(reviewIndex);$('#review-position').textContent=`Acción ${reviewIndex} / ${history.length-1}`;
  $('#review-description').textContent=describeBattleEvent(entry.event,entry.state);$('#review-side').innerHTML=entry.event?teamBadge(entry.event.side):'';
  $('#review-return').textContent=match.phase==='finished'?'Resultado':'Volver';
  for(const button of document.querySelectorAll('[data-review]'))button.disabled=['first','prev'].includes(button.dataset.review)?reviewIndex===0:reviewIndex===history.length-1;
}
function leaveReview(){reviewIndex=null;selectedId=null;lastTick=performance.now();render();if(match.phase==='finished')$('#result-dialog').showModal();}
function beginPlanning(){planning=true;draft=[];furthestOrder=0;selectedId=null;clearIntent();totalSeconds=roundRules(match).seconds;secondsLeft=totalSeconds;lastTick=performance.now();render();}
function updateTimer(){const seconds=$('#timer-seconds'),progress=$('#timer-progress'),value=`${Math.max(0,Math.ceil(secondsLeft))}s`;if(seconds&&seconds.textContent!==value)seconds.textContent=value;if(progress)progress.style.width=`${Math.max(0,secondsLeft/totalSeconds*100)}%`;$('#planning-timer')?.classList.toggle('is-urgent',secondsLeft<=3);if(planning&&reviewIndex===null)$('#action-clock').textContent=value;}
async function sealPlan(){
  if(!planning||match.phase!=='planning')return;const token=phaseToken,result=submitPlan(match,'w',draft);if(!result.ok){toast(result.error);return;}
  planning=false;clearIntent();selectedId=null;render();const orders=await aiPending;if(token!==phaseToken)return;
  const aiResult=submitPlan(match,'b',orders??[]);if(!aiResult.ok){console.error('AI plan rejected:',aiResult.error);submitPlan(match,'b',[]);}
  draft=[];await runResolution();
}
async function animate2D(event){
  const attacker=event.from?board.querySelector(`[data-square="${event.from}"] .tactical-token`):null;
  if(attacker){
    if(event.kind==='move'&&event.to&&event.to!==event.from){
      const from=board.querySelector(`[data-square="${event.from}"]`).getBoundingClientRect(),to=board.querySelector(`[data-square="${event.to}"]`).getBoundingClientRect();
      attacker.style.zIndex='7';attacker.animate([{transform:'translate(0,0)'},{transform:`translate(${to.x-from.x}px,${to.y-from.y}px)`}],{duration:reduced?85:520,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});
    }else{
      attacker.classList.add(['focus','ultimate'].includes(event.kind)?'is-focusing':'is-striking');
      const target=event.targets?.find(item=>!item.reflected)?.square;
      if(target&&event.from){const dx=target.charCodeAt(0)-event.from.charCodeAt(0),dy=Number(event.from[1])-Number(target[1]),length=Math.hypot(dx,dy)||1;attacker.style.setProperty('--strike-x',`${dx/length*10}px`);attacker.style.setProperty('--strike-y',`${dy/length*10}px`);}
    }
  }
  for(const target of event.targets??[]){const cell=board.querySelector(`[data-square="${target.square}"]`);if(!cell)continue;cell.classList.add(target.absorbed?'is-blocked':'is-hit');const number=document.createElement('span');number.className='combat-number';number.textContent=target.heal?`+${target.heal}`:target.damage?`−${target.damage}`:'◇';cell.append(number);if(target.dead)cell.querySelector('.tactical-token')?.classList.add('is-falling');}
  if(event.kind==='block'&&event.from)board.querySelector(`[data-square="${event.from}"]`)?.classList.add('is-blocked');
  await delay(reduced?85:['pass','fizzle'].includes(event.kind)?210:570);
}
async function runResolution(){
  const token=phaseToken;resolving=true;planning=false;privacy=false;board.removeAttribute('aria-hidden');viewer=match.opponent==='ai'?'w':match.firstSide;render();
  while(match.phase==='resolution'&&token===phaseToken){
    const result=resolveNext(match);if(!result.ok){toast(result.error);break;}const event=result.event;lastEvent=event;recordPosition(event);
    $('#battle-status').textContent=describeBattleEvent(event,match);audio.playSound(event.targets?.some(target=>target.damage)?'user_piece_move':event.kind==='move'?'AI_piece_move':'menu3',.7);
    if(view==='3d'&&three)await three.play(event,forecast());else await animate2D(event);
    if(token!==phaseToken)return;renderBoard();renderInspector();await delay(reduced?20:110);
  }
  resolving=false;if(token!==phaseToken)return;
  if(match.phase==='finished'){render();await delay(reduced?80:300);if(token!==phaseToken)return;$('#result-title').textContent=winnerText();$('#result-description').textContent=match.winner==='draw'?'Los dos reyes cayeron en el mismo intercambio.':`El rey de ${sideName(other(match.winner)).toLowerCase()} ha caído en la ronda ${match.round}.`;$('#result-dialog').showModal();audio.playSound('checkmate');}
  else prepareRound();
}
function winnerText(){return match.winner==='draw'?'Ambas coronas han caído':match.winner==='w'?'Tu ejército vence':'El estratega vence';}
async function setView(next){
  if(next==='3d'){
    if(!threePromise)threePromise=import('./tactics-board3d.js').then(module=>module.createTacticsBoard3D(host3d,handleSquare,{onDrag:handleBoardDrag,onDragStart:beginBoardDrag,onInspect:inspectSquare,onProject:positionFieldActions}));
    try{three=await threePromise;}catch{threePromise=null;toast('Vista 2D activada: este dispositivo no pudo iniciar 3D.');next='2d';}
  }
  view=next;board.hidden=view!=='2d';host3d.hidden=view!=='3d';three?.setActive(view==='3d'&&!privacy);if(view==='3d'){three.setQuality(liteGraphics);three.resize();}renderBoard();renderControls();
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));sound();
}
function openRules(){rulesDialog.showModal();three?.setActive(false);sound('menu1');}
function restart(){if(resolving||planning){if(!confirm('¿Abandonar esta batalla y preparar otra?'))return;}phaseToken++;planning=false;resolving=false;privacy=false;three?.setActive(false);$('#result-dialog').close();newMatch();}

board.addEventListener('click',event=>{const cell=event.target.closest('[data-square]');if(cell&&!suppressClick)handleSquare(cell.dataset.square);});
$('#board-actions').addEventListener('pointerdown',e=>e.stopPropagation());
$('#board-actions').addEventListener('click',event=>{
  event.stopPropagation();const button=event.target.closest('button');if(!button||reviewIndex!==null)return;
  if(button.hasAttribute('data-field-cancel')){clearIntent();render();return;}
  if(button.dataset.fieldAction){setAction(button.dataset.fieldAction);return;}
  if(button.dataset.fieldFacing)finishFacing(button.dataset.fieldFacing);
});
let drag2d=null,suppressClick=false;
function clearDragGhost(){drag2d?.ghost?.remove();if(drag2d?.token)drag2d.token.style.opacity='';}
board.addEventListener('pointerdown',e=>{const cell=e.target.closest('[data-square]');if(!planning||resolving||reviewIndex!==null||!cell)return;const unit=forecast().units.find(u=>u.square===cell.dataset.square&&u.color==='w'&&u.hp>0);if(unit)drag2d={from:unit.square,x:e.clientX,y:e.clientY,token:cell.querySelector('.tactical-token')};});
board.addEventListener('pointermove',e=>{if(!drag2d||Math.hypot(e.clientX-drag2d.x,e.clientY-drag2d.y)<=6)return;if(!drag2d.ghost){beginBoardDrag(drag2d.from);if(!planning||!selectedId){drag2d=null;return;}board.setPointerCapture(e.pointerId);drag2d.ghost=drag2d.token.querySelector('img').cloneNode();drag2d.ghost.className='field-drag-ghost';const r=drag2d.token.getBoundingClientRect();drag2d.ghost.style.width=r.width+'px';drag2d.ghost.style.height=r.height+'px';document.body.append(drag2d.ghost);drag2d.token.style.opacity='.3';}drag2d.ghost.style.left=e.clientX+'px';drag2d.ghost.style.top=e.clientY+'px';});
board.addEventListener('pointerup',e=>{if(!drag2d)return;const start=drag2d;clearDragGhost();drag2d=null;if(board.hasPointerCapture(e.pointerId))board.releasePointerCapture(e.pointerId);if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>6){const to=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-square]')?.dataset.square;suppressClick=true;handleBoardDrag(start.from,to);setTimeout(()=>suppressClick=false,0);}});
board.addEventListener('pointerover',e=>{if(!drag2d)inspectSquare(e.target.closest('[data-square]')?.dataset.square);});
board.addEventListener('focusin',e=>inspectSquare(e.target.closest('[data-square]')?.dataset.square));
board.addEventListener('pointercancel',()=>{clearDragGhost();drag2d=null;});document.addEventListener('pointerup',()=>{if(drag2d){clearDragGhost();drag2d=null;}});
$('#phase-panel').addEventListener('click',event=>{const command=event.target.closest('[data-command]')?.dataset.command;if(command==='roll')rollDice();else if(command==='choose-first')choosePrivilege(true);else if(command==='choose-second')choosePrivilege(false);else if(command==='restart')restart();else if(command==='review')enterReview();});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
$('#camera-reset').addEventListener('click',()=>{three?.resetCamera();sound('menu3');});
$('#graphics-mode').addEventListener('click',()=>{liteGraphics=!liteGraphics;three?.setQuality(liteGraphics);$('#graphics-mode').setAttribute('aria-pressed',String(liteGraphics));$('#graphics-mode').textContent=liteGraphics?'Ligero':'Auto';$('#graphics-mode').title=liteGraphics?'Volver a gráficos automáticos':'Activar gráficos ligeros';});
$('#rules-open').addEventListener('click',openRules);$('#rules-close').addEventListener('click',()=>rulesDialog.close());$('#rules-done').addEventListener('click',()=>rulesDialog.close());rulesDialog.addEventListener('close',()=>{lastTick=performance.now();three?.setActive(view==='3d');});
$('#new-match').addEventListener('click',restart);$('#result-again').addEventListener('click',restart);
$('#result-review').addEventListener('click',enterReview);$('#review-open').addEventListener('click',enterReview);$('#review-return').addEventListener('click',leaveReview);
$('#review-range').addEventListener('input',e=>{reviewIndex=Number(e.target.value);selectedId=null;render();});
$('#review-controls').addEventListener('click',e=>{const command=e.target.closest('[data-review]')?.dataset.review;if(!command)return;reviewIndex=command==='first'?0:command==='last'?history.length-1:Math.max(0,Math.min(history.length-1,reviewIndex+(command==='next'?1:-1)));selectedId=null;render();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&intent==='facing')finishFacing();});
document.addEventListener('visibilitychange',()=>lastTick=performance.now());window.addEventListener('resize',()=>{three?.resize();positionFieldActions();});
setInterval(()=>{const now=performance.now(),elapsed=(now-lastTick)/1000;lastTick=now;if(!planning||document.hidden||rulesDialog.open||resolving||reviewIndex!==null)return;if(intent==='facing'&&draft.length>=roundRules(match).actions)return;secondsLeft=Math.max(0,secondsLeft-elapsed);updateTimer();if(secondsLeft<=0)expireOrder();},100);
$('#class-manual').innerHTML=Object.entries(ABILITIES).map(([type,ability])=>`<article><strong>${UNIT_NAMES[type]} · ${escape(ability.name)}</strong>${escape(ability.description)}</article>`).join('');
newMatch();
