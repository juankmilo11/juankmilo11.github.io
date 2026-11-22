import './tactics.css';
import { createMatch, autoDeploy, confirmDeployment, rollInitiative, chooseInitiative, roundRules, submitPlan, resolveNext, getLegalMoves, getAttackSquares, attackOrderFor, unitAt, validatePlan, previewPlan, publicView, UNIT_NAMES, ABILITIES, getCastleOptions } from './tactics-engine.js';
import { planAI } from './tactics-ai.js';
import { tacticalValues } from './tactics-values.js';
import { describeBattleEvent, describePlannedOrder } from './tactics-presentation.js';
import { appearanceFor, thumbnailUrl, setLoadout, armyPalettes } from './appearance.js';
import { actionDuration, reverseBattleEvent } from './tactics-animation.js';
import { createAudioSystem } from './audio-system.js';

try { const saved=sessionStorage.getItem('fct:tactics:loadout');if(saved)setLoadout(JSON.parse(saved)); } catch { /* Appearance preferences are optional. */ }
const $=selector=>document.querySelector(selector);
const board=$('#board-2d'), host3d=$('#board-3d'), rulesDialog=$('#rules-dialog');
const audio=createAudioSystem();

const ACTION={move:'Mover',attack:'Atacar',block:'Bloquear',focus:'Focus',ultimate:'Definitiva',pass:'Esperar',fizzle:'Orden frustrada'};
let liteGraphics=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const other=side=>side==='w'?'b':'w';
const isAlive=unit=>unit.hp>0&&unit.square;
const squares=Array.from({length:64},(_,i)=>String.fromCharCode(97+i%8)+(8-Math.floor(i/8)));
let match=null, viewer='w', selectedId=null, selectedSquare=null, inspectedId=null, draft=[], intent=null, pendingTarget=null, abilityMode=null;
let phaseToken=0, privacy=false, planning=false, resolving=false, roundPrepared=0, secondsLeft=0, totalSeconds=20, lastTick=0;
let view='3d', three=null, threePromise=null, lastEvent=null, toastTimer, furthestOrder=0;
let history=[],reviewIndex=null,aiWorker=null,aiJob=0,aiPending=null;
let presenting=false,reviewPlaying=false,playbackState=null,playbackEvent=null,playbackExchange=null,currentExchange=null,currentEvent=null,hudExpanded=innerWidth>740;
let forecastMemo=null,checkMemo=new Map(),checkMatch=null,checkRevision=-1;
const sound=(name='menu2')=>audio.playSound(name);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sideName(side){const who=side==='w'?'Tú':'IA';return match?.round?`${side===match.firstSide?'Atacantes':'Defensores'} · ${who}`:who;}
function look(unit){return appearanceFor(unit.type,unit.color);}
function toast(message){clearTimeout(toastTimer);$('#board-toast').textContent=message;$('#board-toast').hidden=false;toastTimer=setTimeout(()=>$('#board-toast').hidden=true,3200);}
function unitFrom(state,id=selectedId){return state?.units.find(unit=>unit.id===id);}
function forecast(){
  if(playbackState)return playbackState;
  if(reviewIndex!==null)return history[reviewIndex].state;
  if(!match)return null;const key=JSON.stringify(draft);
  if(forecastMemo?.match===match&&forecastMemo.revision===match.revision&&forecastMemo.key===key)return forecastMemo.value;
  const value=match.phase==='planning'?previewPlan(match,viewer,draft):publicView(match,viewer);
  forecastMemo={match,revision:match.revision,key,value};return value;
}
function visibleState(){return forecast();}
function clearIntent(){intent=null;pendingTarget=null;}
function checkPlan(orders){
  if(checkMatch!==match||checkRevision!==match.revision){checkMemo.clear();checkMatch=match;checkRevision=match.revision;}
  const key=JSON.stringify(orders);if(!checkMemo.has(key)){const result=validatePlan(match,viewer,orders);checkMemo.set(key,{ok:result.ok,error:result.error});}return checkMemo.get(key);
}

function targetSquares(state,unit){
  if(!unit?.square||unit.color!==viewer||!planning||resolving||reviewIndex!==null)return [];
  const moves=getLegalMoves(state,unit).filter(target=>!unitAt(state,target)&&checkPlan([...draft,{unitId:unit.id,kind:'move',target}]).ok);
  const attacks=getAttackSquares(state,unit).filter(target=>checkPlan([...draft,attackOrderFor(state,unit,target)]).ok);
  const castles=unit.type==='k'?getCastleOptions(state,unit).map(c=>c.inputTarget).filter(target=>checkPlan([...draft,{unitId:unit.id,kind:'move',target}]).ok):[];return [...new Set([...moves,...attacks,...castles])];
}
function renderBoard(){
  const state=visibleState();if(!state)return;
  const selected=unitFrom(state),targets=new Set(targetSquares(state,selected));
  if(!board.children.length)board.innerHTML=squares.map(square=>`<button type="button" class="tactical-cell" data-square="${square}" role="gridcell"><span class="cell-coordinate">${square}</span></button>`).join('');
  const occupants=new Map(state.units.filter(u=>isAlive(u)||u.type==='k'&&u.hp<=0&&state.phase==='finished').map(u=>[u.square,u]));
  for(const [index,cell]of [...board.children].entries()){
    const square=squares[index],unit=occupants.get(square),classes=['tactical-cell',(Math.floor(index/8)+index%8)%2?'dark':'light'];
    if(square===selectedSquare)classes.push('is-selected');
    if(targets.has(square))classes.push('is-target');
    if(state.tiles[square])classes.push('terrain-'+state.tiles[square].kind);
    cell.querySelectorAll('.combat-number').forEach(n=>n.remove());const oldToken=cell.querySelector('.tactical-token');if(oldToken){oldToken.getAnimations().forEach(a=>a.cancel());oldToken.classList.remove('is-focusing','is-striking','is-falling');}
    cell.className=classes.join(' ');cell.setAttribute('aria-selected',String(square===selectedSquare));
    cell.setAttribute('aria-label',`${square}${unit?`, ${UNIT_NAMES[unit.type]}, ${sideName(unit.color)}, ${unit.hp} de vida`:''}`);
    const signature=unit?`${unit.id}:${unit.hp}:${unit.charged}:${unit.guard}:${unit.counterUntil}`:'';
    if(cell.dataset.piece!==signature){cell.querySelector('.tactical-token')?.remove();cell.dataset.piece=signature;if(unit){const token=document.createElement('span');token.className='tactical-token';token.dataset.unit=unit.id;const img=document.createElement('img');img.src=thumbnailUrl(look(unit),unit.hp<=0?'defeated':'standing');img.alt='';img.draggable=false;token.append(img);if(unit.charged){const charge=document.createElement('span');charge.className='token-charge';charge.textContent='✦';token.append(charge);}if(unit.guard||unit.counterUntil===state.round){const mark=document.createElement('span');mark.className='token-resource';mark.textContent='◇';token.append(mark);}cell.append(token);}}
  }
  if(three&&view==='3d')three.render(state,{selectedSquare,targets:[...targets],lastEvent:reviewIndex!==null?history[reviewIndex].event:lastEvent,interactive:planning&&!resolving&&!presenting&&reviewIndex===null&&draft.length<roundRules(match).actions});
}

function renderPhase(){
  if(!match)return;$('#player-role').textContent=match.round?(match.firstSide==='w'?'Tú: Atacantes · juegas primero':'Tú: Defensores · la IA juega primero'):'';const panel=$('#phase-panel'),reviewing=reviewIndex!==null,show=match.phase==='planning'&&planning&&!reviewing;
  document.body.classList.toggle('is-planning',show);document.body.classList.toggle('is-reviewing',reviewing);document.body.classList.toggle('is-resolving',resolving);document.body.classList.toggle('is-presenting',presenting);document.body.classList.toggle('hud-expanded',hudExpanded);
  $('#planning-panel').hidden=false;$('#queue-panel').hidden=!show;$('#review-controls').hidden=!reviewing;$('#review-open').disabled=resolving||presenting||reviewPlaying||history.length<2;
  $('#hud-toggle').setAttribute('aria-expanded',String(hudExpanded));
  $('#round-counter').textContent=`Ronda ${reviewing?((playbackEvent??history[reviewIndex].event)?.round??history[reviewIndex].state.round):currentEvent&&resolving?currentEvent.round:match.round||'—'}`;$('#action-clock').textContent='';
  const event=playbackEvent??(reviewing?history[reviewIndex].event:resolving?currentEvent:null);
  $('#status-team').innerHTML=event?teamBadge(event.side,true):match.round?teamBadge('w',true):'';
  $('#action-detail').textContent=event?outcomeText(event,reviewing?history[reviewIndex].state:match):'';$('#action-detail').hidden=!$('#action-detail').textContent;
  if(reviewing){$('#phase-kicker').textContent='REVISIÓN';$('#battle-status').textContent=reviewPlaying?`${playbackEvent?.reversed?'Retrocediendo':'Reproduciendo'} · ${describeBattleEvent(playbackEvent,forecast())}`:'Partida pausada';panel.innerHTML='';renderReview();renderExchange();return;}
  if(resolving){$('#phase-kicker').textContent='INTERCAMBIO';$('#battle-status').textContent=event?`Acción ${event.sequenceIndex+1}/${event.sequenceTotal} · ${describeBattleEvent(event,match)}`:'Órdenes reveladas';panel.innerHTML='';renderExchange();return;}
  if(match.phase==='initiative'){
    $('#phase-kicker').textContent=presenting?'PRESENTACIÓN':'INICIATIVA';$('#battle-status').textContent=presenting?'Presentando el campo de batalla…':'Dos ejércitos. Una corona.';
    const dice=match.dice,canChoose=dice?.winner==='w';panel.innerHTML=`<h2>${dice?`${escape(sideName(dice.winner))} gana`:'Lanza los dados'}</h2>${dice?`<div class="dice-pair"><div><span class="dice-face">${dice.w}</span>Tu ejército</div><div><span class="dice-face">${dice.b}</span>El estratega</div></div><p>Dos acciones por bando. Todas las piezas empiezan sin carga.</p>${canChoose?'<div class="choice-pair"><button type="button" data-command="choose-first">Jugar primero</button><button type="button" data-command="choose-second">Jugar segundo</button></div>':'<p>El estratega elige…</p>'}`:`<p>16 piezas por bando. Formación inicial Ajedrez960.</p><button type="button" class="primary-button" data-command="roll" ${presenting?'disabled':''}>Lanzar dados</button>`}`;
  }else if(show){$('#phase-kicker').textContent='PREPARA TU SECUENCIA';$('#battle-status').textContent=`Elige tu siguiente orden · ${draft.length}/2`;panel.innerHTML='<div class="timer" id="planning-timer"><p>Tiempo de esta acción</p><strong id="timer-seconds"></strong></div><div class="timer-track"><i id="timer-progress"></i></div><p>Dos acciones por bando. Una pieza no repite el mismo tipo.</p>';updateTimer();}
  else if(match.phase==='finished'){$('#phase-kicker').textContent='RESULTADO';$('#battle-status').textContent=winnerText();panel.innerHTML=`<h2>${escape(winnerText())}</h2><button type="button" data-command="review">Revisar partida</button><button type="button" data-command="restart">Otra partida</button>`;}
  renderExchange();
}
function outcomeText(event,state){
  return (event.targets??[]).map(t=>{const unit=state.units.find(u=>u.id===t.id);return `${UNIT_NAMES[unit?.type]??'Pieza'} ${t.square}: ${t.blocked?'BLOQUEADO':t.heal?`+${t.heal}`:`−${t.damage??0}`} · ${t.hp}/6${t.reflected?' (devuelto)':''}${t.dead?' · abatida':''}`;}).join(' · ');
}
function revealRound(){
  const base=publicView(match,viewer);currentExchange={round:match.round,entries:match.resolution.map((step,index)=>{const before=previewPlan(base,step.side,match.plans[step.side].slice(0,Math.floor(index/2)));return {index,side:step.side,order:structuredClone(step.order),text:describePlannedOrder(step.order,before)};})};
}
function renderExchange(){
  const reviewing=reviewIndex!==null,exchange=reviewing?(playbackExchange??history[reviewIndex].exchange):currentExchange,event=playbackEvent??(reviewing?history[reviewIndex].event:currentEvent),show=Boolean(exchange&&(resolving||reviewing||match.phase==='finished'));
  $('#exchange-panel').hidden=!show;$('#turn-strip').hidden=!show||reviewing;if(!show)return;
  const active=event?.sequenceIndex??-1,finalEvent=history.at(-1)?.event;$('#exchange-title').textContent=`Intercambio · ronda ${exchange.round}`;$('#exchange-position').textContent=active<0?'Órdenes reveladas':`${active+1}/${exchange.entries.length}`;
  $('#exchange-orders').innerHTML=exchange.entries.map(step=>`<li class="${step.index===active?'is-current':step.index<active?'is-done':''}" data-exchange-index="${step.index}" ${step.index===active?'aria-current="step"':''}><b>${step.index+1}</b><div>${teamBadge(step.side,true)}<p>${escape(step.text)}</p>${match.phase==='finished'&&exchange.round===finalEvent?.round&&step.index>finalEvent.sequenceIndex?'<small>No ejecutada · fin de partida</small>':''}</div></li>`).join('');
  $('#turn-strip').innerHTML=exchange.entries.map(step=>`<button type="button" data-show-exchange title="${escape(step.text)}" class="${step.index===active?'is-current':''}"><b>${step.index+1}</b>${teamBadge(step.side,true)}<span>${escape(step.text)}</span></button>`).join('');
  $('#exchange-result').textContent=event?outcomeText(event,reviewing?history[reviewIndex].state:match):'';
}
function renderControls(){renderInspector();renderFieldActions();if(match)renderQueue();}
function teamInfo(side){const palette=armyPalettes.find(p=>p.id===appearanceFor('p',side).palette);return {...palette,name:`${sideName(side)} · ${palette.label}`};}
function teamBadge(side,compact=false){const team=teamInfo(side);return `<span class="team-badge" title="${escape(team.name)}" style="--team-color:${team.swatch}"><i aria-hidden="true"></i>${escape(compact?`${sideName(side)} · ${team.label}`:team.name)}</span>`;}
function renderInspector(){
  const unit=match&&unitFrom(forecast(),inspectedId);$('#unit-name').textContent=unit?UNIT_NAMES[unit.type]:'Consulta';$('#unit-health').textContent=unit?`${unit.hp} / 6 ♥`:'';
  $('#unit-team').innerHTML=unit?teamBadge(unit.color,true):'';
  $('#unit-details').innerHTML=unit?`<span>Casilla ${unit.square}</span><span>${unit.hp<=0?'Fuera de combate':unit.guard?'Escudo activo':unit.blockUsed?'Escudo agotado':unit.charged?'Definitiva lista':'Sin carga'}</span><span>${unit.type==='k'?'Proteger al rey':`Valor táctico ${tacticalValues[unit.type]}`}</span>`:'<span>Toca una ficha.</span><span>Consulta ambos</span><span>bandos.</span>';
}
function inspectableAt(state,square){return state.units.find(u=>u.square===square&&(isAlive(u)||u.type==='k'&&state.phase==='finished'));}
function inspectSquare(square){
  if(!match||!square)return;const state=forecast(),unit=inspectableAt(state,square);
  if(unit&&unit.id!==inspectedId){inspectedId=unit.id;renderInspector();}
}
function renderFieldActions(){
  const menu=$('#unit-actions'),unit=match&&unitFrom(forecast());menu.hidden=true;document.body.classList.remove('has-field-actions');
  if(!planning||resolving||presenting||reviewIndex!==null||!unit||unit.color!==viewer||view==='3d'&&!three)return;
  const available=kind=>checkPlan([...draft,{unitId:unit.id,kind}]).ok;
  menu.innerHTML=`<button type="button" data-field-action="block" ${available('block')?'':'disabled'}>Bloquear</button><button type="button" data-field-action="focus" ${available('focus')?'':'disabled'}>Focus</button><button type="button" data-field-action="ultimate" ${available('ultimate')?'':'disabled'}>Definitiva</button>`;menu.hidden=false;positionFieldActions();
}
function positionFieldActions(){
  const menu=$('#unit-actions');if(menu.hidden)return;const box=$('.tactical-board-wrap').getBoundingClientRect(),hud=$('.command-column').getBoundingClientRect(),mobile=innerWidth<=740,clearance=mobile&&hud.height?Math.max(12,box.bottom-hud.top+12):20;
  menu.style.left=view==='2d'?`${board.getBoundingClientRect().x+board.getBoundingClientRect().width/2}px`:'50%';menu.style.top=`${box.height-menu.offsetHeight-clearance}px`;
}
function selectCell(square){
  selectedSquare=/^[a-h][1-8]$/.test(square??'')?square:null;for(const cell of board.children){const selected=cell.dataset.square===selectedSquare;cell.classList.toggle('is-selected',selected);cell.setAttribute('aria-selected',String(selected));}three?.setSelection(selectedSquare);
}
function commitOrder(order){const result=checkPlan([...draft,order]);if(!result.ok){toast(result.error);return;}draft.push(order);clearIntent();selectedId=null;selectCell(null);sound('menu4');advanceOrder();}
function confirmMove(order){commitOrder(order);}

function orderLabel(order,index){const before=previewPlan(match,viewer,draft.slice(0,index));return describePlannedOrder(validatePlan(match,viewer,draft.slice(0,index+1)).orders?.at(-1)??order,before);}
function renderQueue(){
  const max=roundRules(match).actions;$('#queue-count').textContent=`${draft.length} / ${max}`;
  $('#order-queue').innerHTML=draft.length?draft.map((order,index)=>`<li><span class="queue-number">${index+1}</span><span>${escape(orderLabel(order,index))}</span></li>`).join(''):'<li class="queue-empty">Elige las órdenes directamente sobre el tablero.</li>';
}

function render(){renderPhase();renderBoard();renderControls();}
function selectUnit(id){if(!planning||resolving||presenting||reviewIndex!==null)return;const unit=unitFrom(forecast(),id);if(!unit||unit.color!==viewer||unit.hp<=0)return;selectedId=id;selectedSquare=unit.square;inspectedId=id;clearIntent();sound();render();}
function handleSquare(square){
  if(!match)return;inspectSquare(square);
  if(!planning||resolving||presenting||reviewIndex!==null){selectCell(square);if(!inspectableAt(forecast(),square)){inspectedId=null;renderInspector();}return;}
  const state=forecast(),unit=unitFrom(state),clicked=unitAt(state,square);
  if(unit&&square!==unit.square&&targetSquares(state,unit).includes(square)){if(unit.type==='k'&&getCastleOptions(state,unit).some(c=>c.inputTarget===square))commitOrder({unitId:unit.id,kind:'move',target:square});else if(clicked)commitOrder(attackOrderFor(state,unit,square));else confirmMove({unitId:unit.id,kind:'move',target:square});return;}
  if(clicked?.color===viewer)selectUnit(clicked.id);else{selectedId=null;clearIntent();selectedSquare=square;if(!clicked)inspectedId=null;render();}
}
function beginBoardDrag(square){if(!planning||resolving||presenting||reviewIndex!==null)return;const unit=unitAt(forecast(),square);if(!unit||unit.color!==viewer)return;selectedId=unit.id;selectedSquare=unit.square;inspectedId=unit.id;clearIntent();render();}
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
async function newMatch(){
  const token=++phaseToken;three?.cancelIntro();three?.cancelPlayback();planning=false;resolving=false;reviewPlaying=false;playbackState=null;playbackEvent=null;playbackExchange=null;currentExchange=null;currentEvent=null;privacy=false;roundPrepared=0;reviewIndex=null;history=[];forecastMemo=null;aiWorker?.terminate();aiWorker=null;aiPending=null;presenting=true;
  match=createMatch({seed:crypto.getRandomValues(new Uint32Array(1))[0]});viewer='w';draft=[];lastEvent=null;selectedId=null;selectedSquare=null;inspectedId=null;clearIntent();for(const side of ['w','b']){autoDeploy(match,side);confirmDeployment(match,side);}render();
  await setView('3d');if(token!==phaseToken)return;if(three&&view==='3d')await three.playIntro();if(token!==phaseToken)return;presenting=false;renderPhase();
}
function rollDice(){
  const result=rollInitiative(match);if(!result.ok){toast(result.error);return;}sound('menu3');render();
  if(match.dice.winner==='b'){const token=phaseToken;setTimeout(()=>{if(token!==phaseToken)return;const choice=chooseInitiative(match,'b',{first:true});if(choice.ok)prepareRound();},700);}
}
function choosePrivilege(first){if(match.dice.winner!=='w')return;const result=chooseInitiative(match,'w',{first});if(!result.ok){toast(result.error);return;}sound('menu4');prepareRound();}
function prepareRound(){
  if(match.phase!=='planning')return;
  currentEvent=null;currentExchange=null;
  if(roundPrepared!==match.round){roundPrepared=match.round;draft=[];lastEvent=null;aiPending=requestAI();}
  if(!history.length)recordPosition(null);
  viewer='w';selectedId=null;selectedSquare=null;clearIntent();beginPlanning();
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
  history.push({exchange:currentExchange,state:structuredClone({units:match.units,tiles:match.tiles,phase:match.phase,round:match.round,firstSide:match.firstSide,winner:match.winner,revision:match.revision,opponent:'ai'}),event:event?structuredClone(event):null});
}
function enterReview(){if(resolving||reviewPlaying||history.length<2)return;$('#result-dialog').close();clearIntent();selectedId=null;selectedSquare=null;reviewIndex=history.length-1;render();}
function renderReview(){
  const entry=history[reviewIndex];$('#review-range').max=String(history.length-1);$('#review-range').value=String(reviewIndex);$('#review-position').textContent=`Acción ${reviewIndex} / ${history.length-1}`;
  const event=playbackEvent??entry.event;$('#review-description').textContent=`${event?.reversed?'Restaurando · ':''}${describeBattleEvent(event,entry.state)}`;$('#review-side').innerHTML=event?teamBadge(event.side):'';$('#review-return').textContent=match.phase==='finished'?'Resultado':'Volver';
  $('#review-range').disabled=reviewPlaying;$('#review-return').disabled=reviewPlaying;$('#review-replay').disabled=reviewPlaying||reviewIndex===0;
  for(const button of document.querySelectorAll('[data-review]'))button.disabled=reviewPlaying||(['first','prev'].includes(button.dataset.review)?reviewIndex===0:reviewIndex===history.length-1);
}
async function seekReview(target,replay=false){
  if(reviewIndex===null||reviewPlaying)return;target=Math.max(0,Math.min(history.length-1,target));if(target===reviewIndex&&!replay)return;
  const previous=reviewIndex,backward=target===previous-1&&!replay,before=backward?history[previous].state:target>0?history[target-1].state:history[0].state,event=backward?reverseBattleEvent(history[previous].event,history[target].state):history[target].event,token=phaseToken;
  reviewIndex=target;selectedId=null;selectedSquare=null;if(!event){render();return;}reviewPlaying=true;playbackState=before;playbackEvent=event;playbackExchange=backward?history[previous].exchange:history[target].exchange;render();
  await playEvent(event,history[target].state);if(token!==phaseToken)return;playbackState=null;playbackEvent=null;playbackExchange=null;reviewPlaying=false;lastTick=performance.now();render();
}
function leaveReview(){if(reviewPlaying)return;reviewIndex=null;selectedId=null;selectedSquare=null;lastTick=performance.now();render();if(match.phase==='finished')$('#result-dialog').showModal();}
function beginPlanning(){planning=true;draft=[];furthestOrder=0;selectedId=null;selectedSquare=null;clearIntent();totalSeconds=roundRules(match).seconds;secondsLeft=totalSeconds;lastTick=performance.now();render();}
function updateTimer(){const seconds=$('#timer-seconds'),progress=$('#timer-progress'),value=`${Math.max(0,Math.ceil(secondsLeft))}s`;if(seconds&&seconds.textContent!==value)seconds.textContent=value;if(progress)progress.style.width=`${Math.max(0,secondsLeft/totalSeconds*100)}%`;$('#planning-timer')?.classList.toggle('is-urgent',secondsLeft<=3);if(planning&&reviewIndex===null)$('#action-clock').textContent=value;}
async function sealPlan(){
  if(!planning||match.phase!=='planning')return;const token=phaseToken,result=submitPlan(match,'w',draft);if(!result.ok){toast(result.error);return;}
  planning=false;clearIntent();selectedId=null;render();const orders=await aiPending;if(token!==phaseToken)return;
  const aiResult=submitPlan(match,'b',orders??[]);if(!aiResult.ok){console.error('AI plan rejected:',aiResult.error);submitPlan(match,'b',[]);}
  revealRound();draft=[];await runResolution();
}
async function animate2D(event,after){
  const duration=actionDuration(event,reduced),motions=[{id:event.unitId,from:event.from,to:event.to},...(event.castle?[{id:event.castle.rookId,from:event.castle.rookFrom,to:event.castle.rookTo}]:[])];
  for(const motion of motions){const token=motion.from?board.querySelector(`[data-square="${motion.from}"] .tactical-token`):null;if(!token)continue;
    if(event.kind==='move'&&motion.to&&motion.to!==motion.from){const a=board.querySelector(`[data-square="${motion.from}"]`).getBoundingClientRect(),b=board.querySelector(`[data-square="${motion.to}"]`).getBoundingClientRect();token.style.zIndex='7';token.animate([{transform:'translate(0,0)'},{transform:`translate(${b.x-a.x}px,${b.y-a.y}px)`}],{duration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});}
    else{token.classList.add(['focus','ultimate'].includes(event.kind)?'is-focusing':'is-striking');token.style.setProperty('--action-duration',duration+'ms');const target=event.targets?.find(t=>!t.reflected)?.square;if(target&&event.from){const dx=target.charCodeAt(0)-event.from.charCodeAt(0),dy=Number(event.from[1])-Number(target[1]),length=Math.hypot(dx,dy)||1;token.style.setProperty('--strike-x',`${dx/length*10}px`);token.style.setProperty('--strike-y',`${dy/length*10}px`);}}
  }
  for(const target of event.targets??[]){if(event.reversed&&target.heal){const cell=board.querySelector(`[data-square="${target.square}"]`),unit=after.units.find(u=>u.id===target.id);if(cell&&unit&&!cell.querySelector('.tactical-token')){const token=document.createElement('span');token.className='tactical-token';const img=document.createElement('img');img.src=thumbnailUrl(look(unit));img.alt='';token.append(img);cell.append(token);token.animate([{opacity:0,transform:'rotate(70deg)'},{opacity:1,transform:'rotate(0)'}],{duration,fill:'forwards'});}}const cell=board.querySelector(`[data-square="${target.square}"]`);if(!cell)continue;cell.classList.add(target.heal?'is-restored':'is-hit');cell.style.setProperty('--action-duration',duration+'ms');const number=document.createElement('span');number.className='combat-number'+(target.heal?' healing':'');number.style.animationDuration=duration+'ms';number.textContent=target.blocked?'ESCUDO':target.heal?`+${target.heal}`:`−${target.damage??0}`;cell.append(number);if(target.dead)cell.querySelector('.tactical-token')?.classList.add('is-falling');}
  if(event.kind==='block'&&event.from)board.querySelector(`[data-square="${event.from}"]`)?.classList.add('is-blocked');await delay(duration);
}
async function playEvent(event,after){
  audio.playSound(event.targets?.some(t=>t.damage)?'user_piece_move':event.kind==='move'?'AI_piece_move':'menu3',.7);
  if(view==='3d'&&three)await three.play(event,after);else await animate2D(event,after);
}
async function runResolution(){
  const token=phaseToken;resolving=true;planning=false;viewer='w';render();
  while(match.phase==='resolution'&&token===phaseToken){
    const before=publicView(match,viewer),result=resolveNext(match);if(!result.ok){toast(result.error);break;}const event=result.event;lastEvent=event;currentEvent=event;recordPosition(event);playbackState=before;renderPhase();
    await delay(reduced?100:300);if(token!==phaseToken)return;await playEvent(event,publicView(match,viewer));if(token!==phaseToken)return;playbackState=null;renderBoard();renderInspector();await delay(reduced?150:300);
  }
  resolving=false;if(token!==phaseToken)return;
  if(match.phase==='finished'){render();await delay(300);if(token!==phaseToken)return;$('#result-title').textContent=winnerText();$('#result-description').textContent=match.winner==='draw'?'Los dos reyes cayeron en el mismo intercambio.':`El rey de ${sideName(other(match.winner)).toLowerCase()} ha caído en la ronda ${match.round}.`;$('#result-dialog').showModal();audio.playSound('checkmate');}
  else prepareRound();
}
function winnerText(){return match.winner==='draw'?'Ambas coronas han caído':match.winner==='w'?'Tu ejército vence':'El estratega vence';}
async function setView(next){
  if(next!=='3d'){three?.cancelIntro();presenting=false;}
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
$('#review-range').addEventListener('change',e=>seekReview(Number(e.target.value)));$('#review-replay').addEventListener('click',()=>seekReview(reviewIndex,true));
$('#review-controls').addEventListener('click',e=>{const command=e.target.closest('[data-review]')?.dataset.review;if(!command)return;const target=command==='first'?0:command==='last'?history.length-1:reviewIndex+(command==='next'?1:-1);void seekReview(target);});
$('.tactical-board-wrap').addEventListener('click',e=>{if(e.target===$('.tactical-board-wrap'))handleSquare(null);});
$('#hud-toggle').addEventListener('click',()=>{hudExpanded=!hudExpanded;renderPhase();positionFieldActions();});
$('#turn-strip').addEventListener('click',()=>{hudExpanded=true;renderPhase();});
document.addEventListener('visibilitychange',()=>lastTick=performance.now());window.addEventListener('resize',()=>{three?.resize();positionFieldActions();measureHud();});
setInterval(()=>{const now=performance.now(),elapsed=(now-lastTick)/1000;lastTick=now;if(!planning||document.hidden||rulesDialog.open||resolving||presenting||reviewIndex!==null||reviewPlaying)return;secondsLeft=Math.max(0,secondsLeft-elapsed);updateTimer();if(secondsLeft<=0)expireOrder();},100);
function measureHud(){document.documentElement.style.setProperty('--toolbar-height',$('.tactics-header').offsetHeight+'px');document.documentElement.style.setProperty('--status-height',$('.battle-status').offsetHeight+'px');positionFieldActions();}
new ResizeObserver(measureHud).observe($('.tactics-header'));new ResizeObserver(measureHud).observe($('.battle-status'));
$('#class-manual').innerHTML=Object.entries(ABILITIES).map(([type,ability])=>`<article><strong>${UNIT_NAMES[type]} · ${escape(ability.name)}</strong>${escape(ability.description)}</article>`).join('');
newMatch();
