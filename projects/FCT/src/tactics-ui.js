import './tactics.css';
import { createMatch, autoDeploy, confirmDeployment, rollInitiative, chooseInitiative, roundRules, submitPlan, resolveNext, getLegalMoves, getAttackTargets, validateOrder, previewPlan, publicView, UNIT_NAMES, ABILITIES, orderCategory } from './tactics-engine.js';
import { planAI } from './tactics-ai.js';
import { appearanceFor, thumbnailUrl, setLoadout } from './appearance.js';
import { createAudioSystem } from './audio-system.js';

try { const saved=sessionStorage.getItem('fct:tactics:loadout');if(saved)setLoadout(JSON.parse(saved)); } catch { /* Appearance preferences are optional. */ }
const $=selector=>document.querySelector(selector);
const board=$('#board-2d'), host3d=$('#board-3d'), rulesDialog=$('#rules-dialog');
const audio=createAudioSystem();
const FACE={N:'↑',E:'→',S:'↓',W:'←'}, DIR={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
const ACTION={move:'Mover',attack:'Atacar',block:'Bloquear',focus:'Focus',ultimate:'Definitiva',pass:'Esperar',fizzle:'Orden frustrada'};
const MODE={heal:'Sanación',trap:'Trampa',storm:'Tormenta',nova:'Ataque radial',bastion:'Bastión',obstacle:'Barricada',fracture:'Fractura',rally:'Estandarte'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactPlanning=()=>matchMedia('(max-width: 740px)').matches;
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const other=side=>side==='w'?'b':'w';
const isAlive=unit=>unit.hp>0&&unit.square;
const squares=Array.from({length:64},(_,i)=>String.fromCharCode(97+i%8)+(8-Math.floor(i/8)));
let match=null, viewer='w', selectedId=null, draft=[], intent=null, pendingTarget=null, abilityMode=null;
let phaseToken=0, privacy=false, planning=false, resolving=false, roundPrepared=0, aiPlan=[], secondsLeft=0, totalSeconds=10, lastTick=0;
let view='3d', three=null, threePromise=null, lastEvent=null, toastTimer, furthestOrder=0;
const sound=(name='menu2')=>audio.playSound(name);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sideName(side){return side==='w'?'Tu ejército':'El estratega';}
function look(unit){return appearanceFor(unit.type,unit.color);}
function toast(message){clearTimeout(toastTimer);$('#board-toast').textContent=message;$('#board-toast').hidden=false;toastTimer=setTimeout(()=>$('#board-toast').hidden=true,3200);}
function unitFrom(state,id=selectedId){return state?.units.find(unit=>unit.id===id);}
function forecast(){return match?.phase==='planning'?previewPlan(publicView(match,viewer),viewer,draft):publicView(match,viewer);}
function visibleState(){return match?publicView(forecast(),viewer):null;}
function clearIntent(){intent=null;pendingTarget=null;abilityMode=null;}
function checkPlan(orders){
  const rules=roundRules(match);if(orders.length>rules.actions)return {ok:false,error:'La secuencia ya está completa.'};
  let moves=0,others=0;
  for(let i=0;i<orders.length;i++){
    const projected=previewPlan(publicView(match,viewer),viewer,orders.slice(0,i));
    if(projected.winner)return {ok:false,error:'La secuencia ya prevé el final de la partida; no admite más órdenes.'};
    const result=validateOrder(projected,viewer,orders[i]);if(!result.ok)return result;
    const category=orderCategory(projected,result.order);if(category==='move')moves++;else if(category==='other')others++;
    if(moves>rules.maxMoves||others>rules.maxOther)return {ok:false,error:'Estas primeras rondas permiten un movimiento y una acción.'};
  }
  return {ok:true};
}
function aliveOwn(state){return state.units.filter(unit=>unit.color===viewer&&unit.hp>0);}
function attackDirections(unit){return unit.type==='p'?(unit.color==='w'?['NW','NE']:['SW','SE']):unit.type==='n'||unit.type==='b'?['NW','NE','SW','SE']:unit.type==='r'?['N','E','S','W']:Object.keys(DIR);}
function targetSquares(state,unit){
  if(!unit?.square||!planning)return [];
  if(intent==='ultimate'&&['heal','obstacle','fracture'].includes(abilityMode))return squares.filter(target=>validateOrder(state,viewer,{unitId:unit.id,kind:'ultimate',mode:abilityMode,target}).ok);
  if(intent==='facing')return pendingTarget?[pendingTarget]:[];
  return [...new Set([...getLegalMoves(state,unit).filter(target=>checkPlan([...draft,{unitId:unit.id,kind:'move',target}]).ok),...attackDirections(unit).filter(direction=>checkPlan([...draft,{unitId:unit.id,kind:'attack',direction}]).ok).flatMap(d=>getAttackTargets(state,unit,d))])];
}
function renderBoard(){
  const state=visibleState();if(!state)return;
  const selected=unitFrom(state),targets=new Set(targetSquares(state,selected));
  const moveTargets=selected&&planning?getLegalMoves(state,selected):[],attackTargets=selected&&planning?attackDirections(selected).flatMap(d=>getAttackTargets(state,selected,d)):[];
  board.replaceChildren(...squares.map((square,index)=>{
    const cell=document.createElement('button');cell.type='button';cell.dataset.square=square;cell.className=`tactical-cell ${(Math.floor(index/8)+index%8)%2?'dark':'light'}`;cell.setAttribute('role','gridcell');
    const unit=state.units.find(piece=>isAlive(piece)&&piece.square===square);
    const tile=state.tiles[square];if(tile)cell.classList.add(`terrain-${tile.kind}`);
    if(state.phase==='deployment'&&(viewer==='w'?['1','2']:['7','8']).includes(square[1]))cell.classList.add('is-home');
    cell.classList.toggle('is-selected',Boolean(unit&&unit.id===selectedId));cell.setAttribute('aria-selected',String(Boolean(unit&&unit.id===selectedId)));
    if(targets.has(square)){if(moveTargets.includes(square))cell.classList.add('is-target');if(attackTargets.includes(square)||intent==='ultimate')cell.classList.add('is-attack-target');}
    const orderIndex=draft.findLastIndex(order=>order.target===square);if(orderIndex>=0){cell.classList.add('is-order-target');cell.dataset.order=String(orderIndex+1);}
    const coordinate=document.createElement('span');coordinate.className='cell-coordinate';coordinate.textContent=square;cell.append(coordinate);
    cell.setAttribute('aria-label',`${square}${unit?`, ${UNIT_NAMES[unit.type]} ${sideName(unit.color)}, ${unit.hp} de 6 de vida, mira ${unit.facing}, ${unit.charged?'definitiva cargada':'sin carga'}`:''}${tile?`, ${tile.kind==='void'?'casilla destruida':tile.kind==='obstacle'?'obstáculo':'trampa'}`:''}`);
    if(unit){
      const token=document.createElement('span');token.className=`tactical-token token-${unit.color==='w'?'white':'black'}`;token.dataset.unit=unit.id;
      const img=document.createElement('img');img.src=thumbnailUrl(look(unit));img.alt='';img.draggable=false;token.append(img);
      if(unit.charged){const charge=document.createElement('span');charge.className='token-charge';charge.textContent='✦';token.append(charge);}
      const buffs=[unit.guard?'◇':'',unit.armor?`A${unit.armor}`:'',unit.reflect?'↶':'',unit.boost?'+':''].filter(Boolean);if(buffs.length){const resource=document.createElement('span');resource.className='token-resource';resource.textContent=buffs.join(' ');token.append(resource);}
      cell.append(token);
    }
    return cell;
  }));
  if(three&&view==='3d'&&!privacy)three.render(state,{selectedSquare:selected?.square,targets:[...targets],moveTargets,attackTargets,lastEvent});
}
function renderRoster(){
  if(!match)return;
  $('#unit-roster').hidden=privacy;
  const state=forecast();$('#unit-roster').replaceChildren(...aliveOwn(state).map(unit=>{
    const button=document.createElement('button');button.type='button';button.className=`roster-unit${!unit.square?' is-unplaced':''}${unit.hp<=0?' is-dead':''}`;button.dataset.unit=unit.id;button.setAttribute('aria-pressed',String(selectedId===unit.id));button.disabled=privacy||resolving||unit.hp<=0;button.setAttribute('aria-label',`${UNIT_NAMES[unit.type]}, ${unit.square??'sin ubicar'}, ${unit.hp} de vida`);
    const img=document.createElement('img');img.src=thumbnailUrl(look(unit));img.alt='';button.append(img);
    const name=document.createElement('b');name.textContent=UNIT_NAMES[unit.type];button.append(name);const info=document.createElement('small');info.textContent=unit.square??'Ubicar';button.append(info);return button;
  }));
}
function renderPhase(){
  if(!match)return;
  const panel=$('#phase-panel');$('#round-counter').textContent=match.round?`Ronda ${match.round}`:'Preparación';
  const show=match.phase==='planning'&&planning;
  document.body.classList.toggle('is-planning',show);$('#planning-panel').hidden=!show;$('#queue-panel').hidden=!show;
  $('#phase-title').textContent='Fantasy Chess Tactics';
  if(match.phase==='initiative'){
    $('#phase-kicker').textContent='INICIATIVA';$('#battle-status').textContent='Ambos ejércitos están listos.';
    const dice=match.dice,canChoose=dice?.winner==='w';
    panel.innerHTML=`<h2>${dice?`${escape(sideName(dice.winner))} gana la tirada`:'Lanza los dados'}</h2>${dice?`<div class="dice-pair"><div><span class="dice-face">${dice.w}</span>Tu ejército</div><div><span class="dice-face">${dice.b}</span>El estratega</div></div><p>Elige actuar primero o cargar una definitiva. La iniciativa alterna cada ronda.</p><button type="button" class="primary-button" data-command="choose-first" ${canChoose?'':'disabled'}>Actuar primero</button><div class="privilege-list">${match.units.filter(u=>u.color==='w'&&!['k','q'].includes(u.type)).map(u=>`<button type="button" data-charge="${u.id}" ${canChoose?'':'disabled'}>✦ ${UNIT_NAMES[u.type]}${u.type==='p'?` ${u.id.at(-1)}`:''}</button>`).join('')}</div>`:'<button type="button" class="primary-button" data-command="roll">Lanzar dados</button>'}`;
  }else if(match.phase==='planning'){
    $('#phase-kicker').textContent='PREPARA TUS ÓRDENES';$('#battle-status').textContent='Tu ejército · elige la siguiente orden';
    panel.innerHTML=`<p class="eyebrow">${roundRules(match).actions} ÓRDENES</p><div class="timer" id="planning-timer"><p>Tiempo para esta orden</p><strong id="timer-seconds">${Math.ceil(secondsLeft)}s</strong></div><div class="timer-track"><i id="timer-progress"></i></div><p>${match.round<=2?'Un movimiento y una acción.':'Tres acciones libres.'} Cada orden dispone de 10 segundos.</p>`;updateTimer();
  }else if(match.phase==='resolution'){
    $('#phase-kicker').textContent='COMBATE';$('#battle-status').textContent=lastEvent?.message??'Ejecutando órdenes…';panel.innerHTML='<h2>Combate en curso</h2><p>Una acción por bando, una tras otra.</p>';
  }else if(match.phase==='finished'){
    $('#phase-kicker').textContent='PARTIDA FINALIZADA';$('#battle-status').textContent=winnerText();panel.innerHTML=`<h2>${escape(winnerText())}</h2><button type="button" class="primary-button" data-command="restart">Otra partida</button>`;
  }
}
function renderControls(){
  const state=match?forecast():null,unit=state&&unitFrom(state);
  $('#unit-name').textContent=unit?UNIT_NAMES[unit.type]:'Elige una pieza';$('#unit-health').textContent=unit?`${unit.hp} / 6 ♥`:'';
  $('#unit-details').textContent=unit?`${unit.square} · mira ${unit.facing} · ${unit.charged?'Definitiva lista':'Focus para cargar'}${unit.armor?` · Armadura ${unit.armor}`:''}`:'Toca una pieza o arrástrala hasta una casilla resaltada.';
  renderFieldActions();if(match)renderQueue();
}
function renderFieldActions(){
  const menu=$('#unit-actions'),destination=$('#destination-actions'),unit=match&&unitFrom(forecast());
  menu.hidden=destination.hidden=true;
  if(!planning||resolving||!unit||view==='3d'&&!three)return;
  if(intent==='facing'){
    destination.innerHTML=`<span class="field-label">Orientación final</span><div class="field-compass">${['N','W','E','S'].map(d=>`<button type="button" data-field-facing="${d}" aria-label="Mirar ${d}">${FACE[d]}</button>`).join('')}</div>`;destination.hidden=false;
  }else if(pendingTarget&&intent!=='ultimate'){
    const state=forecast(),occupied=state.units.some(u=>isAlive(u)&&u.square===pendingTarget),move=!occupied&&getLegalMoves(state,unit).includes(pendingTarget)&&checkPlan([...draft,{unitId:unit.id,kind:'move',target:pendingTarget}]).ok,rawAttack=attackOrder(state,unit,pendingTarget),attack=rawAttack&&checkPlan([...draft,rawAttack]).ok;
    destination.innerHTML=`<span class="field-label">${pendingTarget}</span>${move?'<button type="button" data-field-choice="move">Mover</button>':''}${attack?'<button type="button" data-field-choice="attack">Atacar</button>':''}<button type="button" data-field-cancel aria-label="Cancelar selección">×</button>`;destination.hidden=false;
  }else{
    const canAct=checkPlan([...draft,{unitId:unit.id,kind:'block'}]).ok;
    menu.innerHTML=intent==='variants'?ABILITIES[unit.type].modes.map(mode=>`<button type="button" data-field-mode="${mode}">${MODE[mode]??ABILITIES[unit.type].name}</button>`).join(''):
      intent==='ultimate'?'<span class="field-label">Elige un objetivo resaltado</span><button type="button" data-field-cancel>×</button>':`<button type="button" data-field-action="block" ${canAct?'':'disabled'}>Bloquear</button><button type="button" data-field-action="focus" ${unit.charged||!canAct?'disabled':''}>Focus</button><button type="button" data-field-action="ultimate" ${unit.charged&&canAct?'':'disabled'}>Definitiva</button>`;
    menu.hidden=false;
  }
  positionFieldActions();
}
function positionFieldActions(){
  if(!match)return;const unit=unitFrom(forecast());if(!unit?.square)return;
  const wrap=$('.tactical-board-wrap'),box=wrap.getBoundingClientRect();
  for(const [id,square]of [['unit-actions',unit.square],['destination-actions',pendingTarget??unit.square]]){
    const el=$('#'+id);if(el.hidden)continue;let point;
    if(view==='3d'&&three)point=three.projectSquare(square);
    else{const rect=board.querySelector(`[data-square="${square}"]`).getBoundingClientRect();point={x:rect.x-box.x+rect.width/2,y:rect.y-box.y+rect.height/2};}
    if(!point)continue;const half=Math.min(el.offsetWidth/2+6,box.width/2);el.style.left=`${Math.max(half,Math.min(box.width-half,point.x))}px`;el.style.top=`${Math.max(8,Math.min(box.height-el.offsetHeight-8,(id==='unit-actions'?point.y+30:point.y-el.offsetHeight-28)))}px`;
  }
}
function attackOrder(state,unit,target){
  const direction=attackDirections(unit).find(d=>getAttackTargets(state,unit,d).includes(target));
  if(direction)return{unitId:unit.id,kind:'attack',direction,target};
  if(getLegalMoves(state,unit).includes(target)&&state.units.some(u=>isAlive(u)&&u.square===target))return{unitId:unit.id,kind:'move',target};
  return null;
}
function commitOrder(order){const result=checkPlan([...draft,order]);if(!result.ok){toast(result.error);return;}draft.push(order);clearIntent();sound('menu4');advanceOrder();}
function orderLabel(order,index){const unit=unitFrom(match,order.unitId),projected=previewPlan(publicView(match,viewer),viewer,draft.slice(0,index)),converted=order.kind==='move'&&orderCategory(projected,order)==='other';return `${unit?UNIT_NAMES[unit.type]:''} · ${converted?'Atacar':ACTION[order.kind]}${order.target?` ${order.target}`:''}${order.direction?` ${DIR[order.direction]}`:''}${order.mode?` · ${MODE[order.mode]}`:''}${order.facing&&!converted?` ${FACE[order.facing]}`:''}`;}
function renderQueue(){
  const max=roundRules(match).actions;$('#queue-count').textContent=`${draft.length} / ${max}`;
  $('#order-queue').innerHTML=draft.length?draft.map((order,index)=>`<li><span class="queue-number">${index+1}</span><span>${escape(orderLabel(order,index))}</span></li>`).join(''):'<li class="queue-empty">Elige las órdenes directamente sobre el tablero.</li>';
}
function renderLog(){
  if(!match)return;
  const entries=publicView(match,viewer).log.slice(-12).reverse();$('#battle-log').innerHTML=entries.length?entries.map(event=>`<li><strong>${escape(sideName(event.side))}</strong> · ${escape(event.message)}${event.targets?.some(target=>target.damage)?` <span>${event.targets.filter(target=>target.damage).map(target=>`−${target.damage}${target.reflected?' reflejado':''}`).join(', ')}</span>`:''}</li>`).join(''):'<li>La próxima decisión todavía es un secreto.</li>';
}
function render(){renderPhase();renderBoard();renderRoster();renderControls();renderLog();}
function selectUnit(id){const state=forecast(),unit=unitFrom(state,id);if(!unit||unit.color!==viewer||unit.hp<=0)return;selectedId=id;clearIntent();sound();render();}
function handleSquare(square){
  if(!match||!planning||resolving)return;
  if(!square){selectedId=null;clearIntent();render();return;}
  const state=forecast(),unit=unitFrom(state);
  if(unit&&intent==='ultimate'&&targetSquares(state,unit).includes(square)){commitOrder({unitId:unit.id,kind:'ultimate',mode:abilityMode,target:square});return;}
  const clickedOwn=state.units.find(u=>u.color===viewer&&isAlive(u)&&u.square===square);if(clickedOwn&&clickedOwn.id!==selectedId){selectUnit(clickedOwn.id);return;}
  if(unit&&targetSquares(state,unit).includes(square)&&square!==unit.square){pendingTarget=square;intent='destination';sound('menu3');render();return;}
  const own=state.units.find(u=>u.color===viewer&&isAlive(u)&&u.square===square);if(own)selectUnit(own.id);else{selectedId=null;clearIntent();render();}
}
function handleBoardDrag(from,to){
  if(!planning||!to)return;const unit=forecast().units.find(u=>u.color===viewer&&isAlive(u)&&u.square===from);if(!unit)return;
  selectedId=unit.id;clearIntent();if(targetSquares(forecast(),unit).includes(to)){pendingTarget=to;intent='destination';}render();
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
function setAction(kind){
  if(!planning)return;const unit=unitFrom(forecast());if(!unit)return;clearIntent();
  if(['block','focus'].includes(kind)){commitOrder({unitId:unit.id,kind});return;}
  if(kind==='ultimate'){
    if(!unit.charged)return;
    if(ABILITIES[unit.type].modes.length>1){intent='variants';render();return;}
    commitOrder({unitId:unit.id,kind:'ultimate',mode:ABILITIES[unit.type].modes[0]});
  }
}
function newMatch(){
  phaseToken++;planning=false;resolving=false;privacy=false;roundPrepared=0;
  match=createMatch({seed:crypto.getRandomValues(new Uint32Array(1))[0]});viewer='w';draft=[];lastEvent=null;selectedId=null;clearIntent();
  for(const side of ['w','b']){autoDeploy(match,side);confirmDeployment(match,side);}
  render();void setView('3d');three?.setActive(view==='3d');
}
function rollDice(){
  const result=rollInitiative(match);if(!result.ok){toast(result.error);return;}sound('menu3');render();
  if(match.dice.winner==='b'){const token=phaseToken;setTimeout(()=>{if(token!==phaseToken)return;const choice=chooseInitiative(match,'b',{first:true});if(choice.ok)prepareRound();},700);}
}
function choosePrivilege(first,unitId){if(match.dice.winner!=='w')return;const result=chooseInitiative(match,'w',{first,unitId});if(!result.ok){toast(result.error);return;}sound('menu4');prepareRound();}
function prepareRound(){
  if(match.phase!=='planning')return;
  if(roundPrepared!==match.round){roundPrepared=match.round;draft=[];lastEvent=null;aiPlan=planAI(structuredClone(match),'b');}
  viewer='w';selectedId=null;clearIntent();beginPlanning();
}
function beginPlanning(){planning=true;draft=[];furthestOrder=0;selectedId=null;clearIntent();totalSeconds=10;secondsLeft=10;lastTick=performance.now();render();}
function updateTimer(){const seconds=$('#timer-seconds'),progress=$('#timer-progress');if(seconds)seconds.textContent=`${Math.max(0,Math.ceil(secondsLeft))}s`;if(progress)progress.style.width=`${Math.max(0,secondsLeft/totalSeconds*100)}%`;$('#planning-timer')?.classList.toggle('is-urgent',secondsLeft<=3);if(planning&&compactPlanning())$('#round-counter').textContent=`R${match.round} · ${Math.max(0,Math.ceil(secondsLeft))}s · ${draft.length}/${roundRules(match).actions}`;}
async function sealPlan(){
  if(!planning||match.phase!=='planning')return;
  const result=submitPlan(match,'w',draft);if(!result.ok){toast(result.error);return;}
  planning=false;clearIntent();selectedId=null;sound('menu4');
  const aiResult=submitPlan(match,'b',aiPlan);if(!aiResult.ok){console.error('AI plan rejected:',aiResult.error);submitPlan(match,'b',[]);}
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
    const result=resolveNext(match);if(!result.ok){toast(result.error);break;}const event=result.event;lastEvent=event;
    $('#battle-status').textContent=event.message;audio.playSound(event.targets?.some(target=>target.damage)?'user_piece_move':event.kind==='move'?'AI_piece_move':'menu3',.7);
    if(view==='3d'&&three)await three.play(event,publicView(match,viewer));else await animate2D(event);
    if(token!==phaseToken)return;renderBoard();renderLog();await delay(reduced?20:110);
  }
  resolving=false;if(token!==phaseToken)return;
  if(match.phase==='finished'){render();await delay(reduced?80:300);if(token!==phaseToken)return;$('#result-title').textContent=winnerText();$('#result-description').textContent=match.winner==='draw'?'Los dos reyes cayeron en el mismo intercambio.':`El rey de ${sideName(other(match.winner)).toLowerCase()} ha caído en la ronda ${match.round}.`;$('#result-dialog').showModal();audio.playSound('checkmate');}
  else prepareRound();
}
function winnerText(){return match.winner==='draw'?'Ambas coronas han caído':match.winner==='w'?'Tu ejército vence':'El estratega vence';}
async function setView(next){
  if(next==='3d'){
    if(!threePromise)threePromise=import('./tactics-board3d.js').then(module=>module.createTacticsBoard3D(host3d,handleSquare,{onDrag:handleBoardDrag,onProject:positionFieldActions}));
    try{three=await threePromise;}catch(error){threePromise=null;console.error('No se pudo iniciar 3D:',error);toast('La vista 3D no está disponible en este navegador. Puedes jugar en 2D.');return;}
  }
  view=next;board.hidden=view!=='2d';host3d.hidden=view!=='3d';three?.setActive(view==='3d'&&!privacy);if(view==='3d'){three.resize();renderBoard();}renderControls();
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));sound();
}
function openRules(){rulesDialog.showModal();three?.setActive(false);sound('menu1');}
function restart(){if(resolving||planning){if(!confirm('¿Abandonar esta batalla y preparar otra?'))return;}phaseToken++;planning=false;resolving=false;privacy=false;three?.setActive(false);$('#result-dialog').close();newMatch();}

board.addEventListener('click',event=>{const cell=event.target.closest('[data-square]');if(cell&&!suppressClick)handleSquare(cell.dataset.square);});
$('#unit-roster').addEventListener('click',event=>{const button=event.target.closest('[data-unit]');if(button)selectUnit(button.dataset.unit);});
$('#board-actions').addEventListener('pointerdown',e=>e.stopPropagation());
$('#board-actions').addEventListener('click',event=>{
  event.stopPropagation();const button=event.target.closest('button');if(!button)return;
  const unit=unitFrom(forecast());if(!unit)return;
  if(button.hasAttribute('data-field-cancel')){clearIntent();render();return;}
  if(button.dataset.fieldAction){setAction(button.dataset.fieldAction);return;}
  if(button.dataset.fieldMode){const mode=button.dataset.fieldMode;if(['heal','obstacle','fracture'].includes(mode)){intent='ultimate';abilityMode=mode;render();}else commitOrder({unitId:unit.id,kind:'ultimate',mode});return;}
  if(button.dataset.fieldChoice==='move'){intent='facing';render();return;}
  if(button.dataset.fieldChoice==='attack'){const order=attackOrder(forecast(),unit,pendingTarget);if(order)commitOrder(order);return;}
  if(button.dataset.fieldFacing)commitOrder({unitId:unit.id,kind:'move',target:pendingTarget,facing:button.dataset.fieldFacing});
});
let drag2d=null,suppressClick=false;
function clearDragGhost(){drag2d?.ghost?.remove();if(drag2d?.token)drag2d.token.style.opacity='';}
board.addEventListener('pointerdown',e=>{const cell=e.target.closest('[data-square]');if(!planning||!cell)return;const unit=forecast().units.find(u=>u.square===cell.dataset.square&&u.color==='w'&&u.hp>0);if(unit)drag2d={from:unit.square,x:e.clientX,y:e.clientY,token:cell.querySelector('.tactical-token')};});
board.addEventListener('pointermove',e=>{if(!drag2d||Math.hypot(e.clientX-drag2d.x,e.clientY-drag2d.y)<=6)return;if(!drag2d.ghost){drag2d.ghost=drag2d.token.querySelector('img').cloneNode();drag2d.ghost.className='field-drag-ghost';const r=drag2d.token.getBoundingClientRect();drag2d.ghost.style.width=r.width+'px';drag2d.ghost.style.height=r.height+'px';document.body.append(drag2d.ghost);drag2d.token.style.opacity='.3';}drag2d.ghost.style.left=e.clientX+'px';drag2d.ghost.style.top=e.clientY+'px';});
board.addEventListener('pointerup',e=>{if(!drag2d)return;const start=drag2d;clearDragGhost();drag2d=null;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>6){const to=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-square]')?.dataset.square;suppressClick=true;handleBoardDrag(start.from,to);setTimeout(()=>suppressClick=false,0);}});
board.addEventListener('pointercancel',()=>{clearDragGhost();drag2d=null;});
document.addEventListener('pointerup',()=>{if(drag2d){clearDragGhost();drag2d=null;}});
$('#phase-panel').addEventListener('click',event=>{const command=event.target.closest('[data-command]')?.dataset.command,charge=event.target.closest('[data-charge]')?.dataset.charge;if(charge)choosePrivilege(false,charge);else if(command==='roll')rollDice();else if(command==='choose-first')choosePrivilege(true);else if(command==='restart')restart();});

document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
$('#camera-reset').addEventListener('click',()=>{three?.resetCamera();sound('menu3');});
$('#rules-open').addEventListener('click',openRules);$('#rules-close').addEventListener('click',()=>rulesDialog.close());$('#rules-done').addEventListener('click',()=>rulesDialog.close());rulesDialog.addEventListener('close',()=>{lastTick=performance.now();three?.setActive(view==='3d'&&!privacy);});
$('#new-match').addEventListener('click',restart);$('#result-again').addEventListener('click',restart);

document.addEventListener('visibilitychange',()=>lastTick=performance.now());
window.addEventListener('resize',()=>{three?.resize();positionFieldActions();});
setInterval(()=>{const now=performance.now(),elapsed=(now-lastTick)/1000;lastTick=now;if(!planning||privacy||document.hidden||rulesDialog.open||resolving)return;secondsLeft=Math.max(0,secondsLeft-elapsed);updateTimer();if(secondsLeft<=0)expireOrder();},100);
$('#class-manual').innerHTML=Object.entries(ABILITIES).map(([type,ability])=>`<article><strong>${UNIT_NAMES[type]} · ${escape(ability.name)}</strong>${escape(ability.description)}</article>`).join('');
newMatch();
