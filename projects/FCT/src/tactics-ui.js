import './tactics.css';
import { createMatch, placeUnit, autoDeploy, confirmDeployment, rollInitiative, chooseInitiative, roundRules, submitPlan, resolveNext, getLegalMoves, getAttackTargets, validateOrder, previewPlan, publicView, UNIT_NAMES, ABILITIES, orderCategory } from './tactics-engine.js';
import { planAI } from './tactics-ai.js';
import { appearanceFor, thumbnailUrl, setLoadout } from './appearance.js';
import { createAudioSystem } from './audio-system.js';

try { const saved=sessionStorage.getItem('fct:tactics:loadout');if(saved)setLoadout(JSON.parse(saved)); } catch { /* Appearance preferences are optional. */ }
const $=selector=>document.querySelector(selector);
const board=$('#board-2d'), host3d=$('#board-3d'), modeDialog=$('#mode-dialog'), rulesDialog=$('#rules-dialog');
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
let match=null, viewer='w', selectedId=null, draft=[], intent=null, facing='N', pendingTarget=null, direction=null, abilityMode=null;
let phaseToken=0, privacy=false, curtainCallback=null, planning=false, resolving=false, roundPrepared=0, aiPlan=[], secondsLeft=0, totalSeconds=7, lastTick=0;
let view='2d', three=null, threePromise=null, lastEvent=null, toastTimer;
const sound=(name='menu2')=>audio.playSound(name);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sideName(side){return match?.opponent==='local'?(side==='w'?'Jugador 1':'Jugador 2'):(side==='w'?'Tu ejército':'El estratega');}
function look(unit){const result=appearanceFor(unit.type,unit.color);return match?.opponent==='local'&&unit.color==='b'&&unit.type==='k'?{...result,character:'delita'}:result;}
function toast(message){clearTimeout(toastTimer);$('#board-toast').textContent=message;$('#board-toast').hidden=false;toastTimer=setTimeout(()=>$('#board-toast').hidden=true,3200);}
function unitFrom(state,id=selectedId){return state?.units.find(unit=>unit.id===id);}
function forecast(){return match?.phase==='planning'?previewPlan(publicView(match,viewer),viewer,draft):publicView(match,viewer);}
function visibleState(){return match?publicView(forecast(),viewer):null;}
function clearIntent(){intent=null;pendingTarget=null;direction=null;abilityMode=null;}
function currentOrder(){if(!selectedId||!intent)return null;return {unitId:selectedId,kind:intent,...(pendingTarget?{target:pendingTarget}:{}),...(direction?{direction}:{}),...(intent==='move'?{facing}:{}),...(intent==='ultimate'?{mode:abilityMode}: {})};}
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
  if(!unit||!unit.square||!planning)return [];
  if(intent==='move')return getLegalMoves(state,unit);
  if(intent==='attack')return direction?getAttackTargets(state,unit,direction):[...new Set(attackDirections(unit).flatMap(dir=>getAttackTargets(state,unit,dir)))];
  if(intent==='ultimate'&&['heal','trap','obstacle','fracture'].includes(abilityMode))return squares.filter(target=>validateOrder(state,viewer,{unitId:unit.id,kind:'ultimate',mode:abilityMode,target}).ok);
  return [];
}
function renderBoard(){
  const state=visibleState();if(!state)return;
  const selected=unitFrom(state),targets=new Set(targetSquares(state,selected));
  board.replaceChildren(...squares.map((square,index)=>{
    const cell=document.createElement('button');cell.type='button';cell.dataset.square=square;cell.className=`tactical-cell ${(Math.floor(index/8)+index%8)%2?'dark':'light'}`;cell.setAttribute('role','gridcell');
    const unit=state.units.find(piece=>isAlive(piece)&&piece.square===square);
    const tile=state.tiles[square];if(tile)cell.classList.add(`terrain-${tile.kind}`);
    if(state.phase==='deployment'&&(viewer==='w'?['1','2']:['7','8']).includes(square[1]))cell.classList.add('is-home');
    cell.classList.toggle('is-selected',Boolean(unit&&unit.id===selectedId));cell.setAttribute('aria-selected',String(Boolean(unit&&unit.id===selectedId)));
    if(targets.has(square))cell.classList.add(intent==='attack'?'is-attack-target':'is-target');
    const orderIndex=draft.findLastIndex(order=>order.target===square);if(orderIndex>=0){cell.classList.add('is-order-target');cell.dataset.order=String(orderIndex+1);}
    const coordinate=document.createElement('span');coordinate.className='cell-coordinate';coordinate.textContent=square;cell.append(coordinate);
    cell.setAttribute('aria-label',`${square}${unit?`, ${UNIT_NAMES[unit.type]} ${sideName(unit.color)}, ${unit.hp} de 6 de vida, mira ${unit.facing}, ${unit.charged?'definitiva cargada':'sin carga'}`:''}${tile?`, ${tile.kind==='void'?'casilla destruida':tile.kind==='obstacle'?'obstáculo':'trampa'}`:''}`);
    if(unit){
      const token=document.createElement('span');token.className=`tactical-token token-${unit.color==='w'?'white':'black'}`;token.dataset.unit=unit.id;
      const img=document.createElement('img');img.src=thumbnailUrl(look(unit));img.alt='';img.draggable=false;token.append(img);
      const face=document.createElement('span');face.className='token-face';face.textContent=FACE[unit.facing];token.append(face);
      const hp=document.createElement('span');hp.className='hp-track';hp.setAttribute('aria-hidden','true');hp.innerHTML=Array.from({length:6},(_,i)=>`<i class="${i<unit.hp?'full':''}"></i>`).join('');token.append(hp);
      if(unit.charged){const charge=document.createElement('span');charge.className='token-charge';charge.textContent='✦';token.append(charge);}
      const buffs=[unit.guard?'◇':'',unit.armor?`A${unit.armor}`:'',unit.reflect?'↶':'',unit.boost?'+':''].filter(Boolean);if(buffs.length){const resource=document.createElement('span');resource.className='token-resource';resource.textContent=buffs.join(' ');token.append(resource);}
      cell.append(token);
    }
    return cell;
  }));
  if(three&&view==='3d'&&!privacy)three.render(state,{selectedSquare:selected?.square,targets:[...targets],lastEvent});
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
  const planningVisible=match.phase==='planning'&&planning&&!privacy;
  document.body.classList.toggle('is-planning',planningVisible);
  $('#planning-panel').hidden=!planningVisible;$('#queue-panel').hidden=!planningVisible;
  if(match.phase==='deployment'){
    const count=match.units.filter(unit=>unit.color===viewer&&unit.square).length;
    $('#phase-kicker').textContent='PREPARACIÓN · EJÉRCITOS OCULTOS';$('#phase-title').textContent='Despliegue secreto';$('#battle-status').textContent=`${sideName(viewer)} · ${count} de 8 piezas ubicadas`;
    panel.innerHTML=`<p class="eyebrow">${escape(sideName(viewer))}</p><h2>Elige tu formación</h2><p>Selecciona una pieza abajo y pulsa una casilla de las filas ${viewer==='w'?'1 o 2':'7 u 8'}. Puedes recolocarla hasta confirmar.</p><button type="button" class="secondary-button" data-command="auto-deploy">Formación aleatoria</button><button type="button" class="primary-button" data-command="confirm-deploy" ${count<8?'disabled':''}>Confirmar despliegue</button><p class="phase-footnote">El despliegue contrario sigue oculto. Sin límite de tiempo.</p>`;
  }else if(match.phase==='initiative'){
    $('#phase-kicker').textContent='ANTES DE LA PRIMERA RONDA';$('#phase-title').textContent='La suerte abre el combate';$('#battle-status').textContent='Una ventaja. Dos caminos.';
    const dice=match.dice;
    const canChoose=!privacy&&!(match.opponent==='ai'&&dice?.winner==='b');
    panel.innerHTML=`<p class="eyebrow">INICIATIVA</p><h2>${dice?`${escape(sideName(dice.winner))} gana la tirada`:'Lanza los dados'}</h2>${dice?`<div class="dice-pair"><div><span class="dice-face">${dice.w}</span>${escape(sideName('w'))}</div><div><span class="dice-face">${dice.b}</span>${escape(sideName('b'))}</div></div>${dice.rolls.length>1?'<p class="phase-footnote">Hubo empate: se repitió la tirada.</p>':''}<p>Actúa primero en la ronda 1 o empieza con una definitiva cargada. La iniciativa alterna después de cada ronda. El rey ya empieza cargado y la reina no recibe esta ventaja.</p><button type="button" class="primary-button" data-command="choose-first" ${canChoose?'':'disabled'}>Actuar primero en la ronda 1</button><div class="privilege-list">${match.units.filter(unit=>unit.color===dice.winner&&!['k','q'].includes(unit.type)).map(unit=>`<button type="button" data-charge="${unit.id}" ${canChoose?'':'disabled'}>✦ ${UNIT_NAMES[unit.type]}${unit.type==='p'?` ${unit.id.at(-1)}`:''}</button>`).join('')}</div>`:'<p>Cada bando tira un dado. El mayor elige su ventaja; los empates se repiten.</p><button type="button" class="primary-button" data-command="roll">Lanzar dados</button>'}`;
  }else if(match.phase==='planning'){
    $('#phase-kicker').textContent='PLANIFICACIÓN SIMULTÁNEA · ÓRDENES OCULTAS';$('#phase-title').textContent='Decide antes de combatir';$('#battle-status').textContent=privacy?'Esperando al siguiente estratega':`${sideName(viewer)} · prepara tu secuencia`;
    const rules=roundRules(match);panel.innerHTML=`<p class="eyebrow">${escape(sideName(viewer))} · ${rules.actions} ÓRDENES</p><div class="timer" id="planning-timer"><p>Tiempo para planear</p><strong id="timer-seconds">${Math.ceil(secondsLeft)}s</strong></div><div class="timer-track"><i id="timer-progress"></i></div><p>${match.round<=2?'Un movimiento y una acción, en el orden que elijas.':'Tres acciones libres. Puedes usar varias veces la misma pieza.'}</p><p class="phase-footnote">La posición del tablero anticipa tus órdenes. El rival puede cambiar el resultado.</p>`;updateTimer();
  }else if(match.phase==='resolution'){
    $('#phase-kicker').textContent='LAS ÓRDENES YA ESTÁN SELLADAS';$('#phase-title').textContent='El combate toma vida';$('#battle-status').textContent=lastEvent?.message??'Las órdenes se ejecutan intercaladas.';
    panel.innerHTML='<p class="eyebrow">RESOLUCIÓN</p><h2>Cada orden cuenta</h2><p>Una acción por bando, una tras otra. La geometría, la orientación y el tiempo deciden quién sigue en pie.</p><p class="phase-footnote">Una orden que queda bloqueada pierde su acción.</p>';
  }else if(match.phase==='finished'){
    $('#phase-kicker').textContent='PARTIDA FINALIZADA';$('#phase-title').textContent='Una corona ha caído';$('#battle-status').textContent=winnerText();panel.innerHTML=`<p class="eyebrow">RESULTADO</p><h2>${escape(winnerText())}</h2><p>La crónica conserva los últimos intercambios de esta batalla.</p><button type="button" class="primary-button" data-command="restart">Otra batalla</button>`;
  }
}
function renderControls(){
  if(!match||!planning)return;
  const state=forecast(),unit=unitFrom(state);$('#unit-name').textContent=unit?UNIT_NAMES[unit.type]:'Elige una pieza';$('#unit-health').textContent=unit?`${unit.hp} / 6 ♥`:'';
  $('#unit-details').textContent=unit?`${unit.square} · mira ${unit.facing} · ${unit.charged?'Definitiva lista':'Focus para cargar'}${unit.armor?` · Armadura ${unit.armor}`:''}${unit.reflect?` · Reflejo ${unit.reflect}`:''}${unit.boost?' · Golpe +1':''}`:'Selecciona una de tus piezas para preparar una orden.';
  document.querySelectorAll('[data-action]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.action===intent));button.disabled=!unit||!isAlive(unit)||(button.dataset.action==='ultimate'&&!unit.charged)||(button.dataset.action==='focus'&&unit.charged)||draft.length>=roundRules(match).actions;});
  const context=$('#order-context');
  if(!unit||!intent)context.innerHTML='<p>Elige una pieza y una orden. Focus y bloqueo se añaden con un toque.</p>';
  else if(intent==='move')context.innerHTML=`<p>${pendingTarget?state.units.some(piece=>isAlive(piece)&&piece.square===pendingTarget)?`Casilla ${pendingTarget} ocupada: será un ataque sin desplazamiento.`:`Destino: <strong>${pendingTarget}</strong>. Elige orientación y añade la orden.`:'Pulsa una casilla resaltada. Si está ocupada, será un ataque básico.'}</p>`;
  else if(intent==='attack')context.innerHTML=`<p>El ataque no desplaza a la pieza. Elige dirección${unit.type==='n'?' para golpear ambas casillas en L del cuadrante':'; la primera pieza de la línea recibe el golpe, incluso una aliada'}.</p><div class="direction-grid">${attackDirections(unit).map(dir=>`<button type="button" data-direction="${dir}" aria-pressed="${direction===dir}">${DIR[dir]} ${dir}</button>`).join('')}</div>`;
  else if(intent==='ultimate')context.innerHTML=`<p><strong>${escape(ABILITIES[unit.type].name)}</strong></p><p>${escape(ABILITIES[unit.type].description)}</p><div class="variant-options">${ABILITIES[unit.type].modes.map(mode=>`<button type="button" data-ability-mode="${mode}" aria-pressed="${abilityMode===mode}">${MODE[mode]}</button>`).join('')}</div>${['heal','trap','obstacle','fracture'].includes(abilityMode)?`<p>${pendingTarget?`Objetivo: ${pendingTarget}`:'Pulsa un objetivo resaltado en el tablero.'}</p>`:'<p>Se ejecuta desde la casilla actual, sin desplazarse.</p>'}`;
  else context.innerHTML=`<p>${intent==='focus'?'Una acción carga tu definitiva.':'Reduce el siguiente golpe recibido; no se acumula.'}</p>`;
  $('#facing-controls').hidden=intent!=='move'||!pendingTarget||state.units.some(piece=>isAlive(piece)&&piece.square===pendingTarget);
  document.querySelectorAll('[data-facing]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.facing===facing)));
  const order=currentOrder(),check=order?checkPlan([...draft,order]):{ok:false};$('#add-order').disabled=!check.ok;
  if(order&&!check.ok&&((intent==='move'&&pendingTarget)||(intent==='ultimate'&&!['heal','trap','obstacle','fracture'].includes(abilityMode))))context.insertAdjacentHTML('beforeend',`<p class="muted">${escape(check.error)}</p>`);
  renderQueue();
}
function orderLabel(order,index){const unit=unitFrom(match,order.unitId),projected=previewPlan(publicView(match,viewer),viewer,draft.slice(0,index)),converted=order.kind==='move'&&orderCategory(projected,order)==='other';return `${unit?UNIT_NAMES[unit.type]:''} · ${converted?'Atacar':ACTION[order.kind]}${order.target?` ${order.target}`:''}${order.direction?` ${DIR[order.direction]}`:''}${order.mode?` · ${MODE[order.mode]}`:''}${order.facing&&!converted?` ${FACE[order.facing]}`:''}`;}
function renderQueue(){
  const max=roundRules(match).actions;$('#queue-count').textContent=`${draft.length} / ${max}`;
  $('#order-queue').innerHTML=draft.length?draft.map((order,index)=>`<li><span class="queue-number">${index+1}</span><span>${escape(orderLabel(order,index))}</span><button type="button" data-shift="${index}" aria-label="Subir orden ${index+1}" ${index===0?'disabled':''}>↑</button><button type="button" data-remove="${index}" aria-label="Quitar orden ${index+1}">×</button></li>`).join(''):'<li class="queue-empty">Tu primera decisión abre la secuencia.</li>';
  $('#queue-clear').disabled=!draft.length;$('#queue-confirm').textContent=draft.length?`Sellar ${draft.length} ${draft.length===1?'orden':'órdenes'}`:'Confirmar esperas';
}
function renderLog(){
  if(!match)return;
  const entries=publicView(match,viewer).log.slice(-12).reverse();$('#battle-log').innerHTML=entries.length?entries.map(event=>`<li><strong>${escape(sideName(event.side))}</strong> · ${escape(event.message)}${event.targets?.some(target=>target.damage)?` <span>${event.targets.filter(target=>target.damage).map(target=>`−${target.damage}${target.reflected?' reflejado':''}`).join(', ')}</span>`:''}</li>`).join(''):'<li>La próxima decisión todavía es un secreto.</li>';
}
function render(){renderPhase();renderBoard();renderRoster();renderControls();renderLog();}
function selectUnit(id){const state=forecast(),unit=unitFrom(state,id);if(!unit||unit.color!==viewer||unit.hp<=0)return;selectedId=id;facing=unit.facing;clearIntent();sound();render();}
function handleSquare(square){
  if(!match||privacy||resolving||!square)return;
  if(match.phase==='deployment'){
    if(selectedId){const result=placeUnit(match,viewer,selectedId,square);if(result.ok){sound('menu3');const next=match.units.find(unit=>unit.color===viewer&&!unit.square);if(next)selectedId=next.id;render();return;}}
    const own=match.units.find(unit=>unit.color===viewer&&unit.square===square);if(own)selectUnit(own.id);else toast('Elige una pieza y una casilla libre de tus dos primeras filas.');return;
  }
  if(match.phase!=='planning'||!planning)return;
  const state=forecast(),unit=unitFrom(state),targets=unit?targetSquares(state,unit):[];
  if(unit&&targets.includes(square)){
    if(intent==='attack'){
      const[x,y]=[square.charCodeAt(0)-unit.square.charCodeAt(0),Number(square[1])-Number(unit.square[1])];
      direction=(y>0?'N':y<0?'S':'')+(x>0?'E':x<0?'W':'');
    }else pendingTarget=square;
    sound('menu3');if(compactPlanning()&&(['ultimate','attack'].includes(intent)||(intent==='move'&&state.units.some(piece=>isAlive(piece)&&piece.square===square)))){addOrder();return;}render();return;
  }
  const own=state.units.find(piece=>piece.color===viewer&&piece.hp>0&&piece.square===square);if(own)selectUnit(own.id);else{selectedId=null;clearIntent();render();}
}
function addOrder(){const order=currentOrder(),result=order?checkPlan([...draft,order]):{ok:false,error:'Completa la orden.'};if(!result.ok){toast(result.error);return;}draft.push(order);clearIntent();sound('menu4');render();}
function setAction(kind){if(!planning||privacy)return;const unit=unitFrom(forecast());if(!unit)return;clearIntent();intent=kind;abilityMode=ABILITIES[unit.type].modes[0];facing=unit.facing;sound();if(['block','focus'].includes(kind)){addOrder();return;}render();}
function showCurtain(title,description,callback,label='Listo para planear',kicker='ÓRDENES SECRETAS'){
  privacy=true;planning=false;curtainCallback=callback;$('#order-queue').replaceChildren();$('#order-context').replaceChildren();$('#curtain-title').textContent=title;$('#curtain-description').textContent=description;$('#curtain-kicker').textContent=kicker;$('#curtain-continue').textContent=label;$('#privacy-curtain').hidden=false;three?.setActive(false);board.setAttribute('aria-hidden','true');render();$('#curtain-continue').focus({preventScroll:true});
}
function hideCurtain(){privacy=false;$('#privacy-curtain').hidden=true;board.removeAttribute('aria-hidden');if(three)three.setActive(view==='3d');const callback=curtainCallback;curtainCallback=null;callback?.();}
function startDeployment(){
  selectedId=match.units.find(unit=>unit.color===viewer&&!unit.square)?.id??match.units.find(unit=>unit.color===viewer)?.id;clearIntent();render();
}
function newMatch(opponent){
  phaseToken++;planning=false;resolving=false;privacy=false;roundPrepared=0;match=createMatch({seed:crypto.getRandomValues(new Uint32Array(1))[0],opponent});viewer='w';draft=[];lastEvent=null;$('#privacy-curtain').hidden=true;board.removeAttribute('aria-hidden');
  if(opponent==='ai'){autoDeploy(match,'b');confirmDeployment(match,'b');}
  startDeployment();if(three)three.setActive(view==='3d');
}
function finishDeployment(){
  const result=confirmDeployment(match,viewer);if(!result.ok){toast(result.error);return;}sound('menu4');
  if(match.phase==='initiative'){selectedId=null;render();return;}
  viewer=other(viewer);selectedId=null;showCurtain(`${sideName(viewer)}, prepara tu ejército`,'Pasa el dispositivo. Las posiciones del otro bando seguirán ocultas hasta que ambos confirmen.',startDeployment,'Comenzar despliegue','PANTALLA DE PRIVACIDAD');
}
function rollDice(){const result=rollInitiative(match);if(!result.ok){toast(result.error);return;}sound('menu3');render();if(match.opponent==='local'&&match.dice.winner!==viewer){viewer=match.dice.winner;showCurtain(`${sideName(viewer)}, elige tu ventaja`,'Pasa el dispositivo al ganador de la tirada. Puede actuar primero en la ronda 1 o cargar una definitiva.',render,'Elegir mi ventaja','INICIATIVA');}if(match.opponent==='ai'&&match.dice.winner==='b'){const token=phaseToken;setTimeout(()=>{if(token!==phaseToken)return;const choice=chooseInitiative(match,'b',{first:true});if(choice.ok){toast('El estratega gana la tirada y elige actuar primero.');prepareRound();}},1000);}}
function choosePrivilege(first,unitId){if(match.opponent==='ai'&&match.dice.winner==='b')return;const result=chooseInitiative(match,match.dice.winner,{first,unitId});if(!result.ok){toast(result.error);return;}sound('menu4');prepareRound();}
function prepareRound(){
  if(match.phase!=='planning')return;
  if(roundPrepared!==match.round){roundPrepared=match.round;draft=[];lastEvent=null;if(match.opponent==='ai')aiPlan=planAI(structuredClone(match),'b');}
  viewer=match.opponent==='ai'?'w':match.activePlanner;selectedId=null;clearIntent();
  const rules=roundRules(match);showCurtain(`${sideName(viewer)}, ronda ${match.round}`,`${rules.seconds} segundos para preparar ${match.round<=2?'un movimiento y una acción':'tres acciones libres'}. Tus órdenes se mantendrán ocultas hasta la resolución.`,beginPlanning);
}
function beginPlanning(){
  planning=true;draft=[];selectedId=null;clearIntent();totalSeconds=roundRules(match).seconds;secondsLeft=totalSeconds;lastTick=performance.now();render();
}
function updateTimer(){const seconds=$('#timer-seconds'),progress=$('#timer-progress');if(seconds)seconds.textContent=`${Math.max(0,Math.ceil(secondsLeft))}s`;if(progress)progress.style.width=`${Math.max(0,secondsLeft/totalSeconds*100)}%`;$('#planning-timer')?.classList.toggle('is-urgent',secondsLeft<=3);if(planning&&compactPlanning())$('#round-counter').textContent=`R${match.round} · ${Math.max(0,Math.ceil(secondsLeft))}s · ${draft.length}/${roundRules(match).actions}`;}
async function sealPlan(){
  if(!planning||privacy||match.phase!=='planning')return;const result=submitPlan(match,viewer,draft);if(!result.ok){toast(result.error);return;}planning=false;clearIntent();selectedId=null;sound('menu4');
  if(match.opponent==='ai'){const aiResult=submitPlan(match,'b',aiPlan);if(!aiResult.ok){console.error('AI plan rejected:',aiResult.error);submitPlan(match,'b',[]);}}
  if(match.phase==='resolution'){draft=[];await runResolution();}else{draft=[];viewer=match.activePlanner;showCurtain(`${sideName(viewer)}, prepara tus órdenes`,'Pasa el dispositivo. La secuencia anterior ya está sellada y permanece oculta.',beginPlanning);}
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
  const token=phaseToken;resolving=true;planning=false;privacy=false;$('#privacy-curtain').hidden=true;board.removeAttribute('aria-hidden');viewer=match.opponent==='ai'?'w':match.firstSide;render();
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
function winnerText(){return match.winner==='draw'?'Ambas coronas han caído':match.opponent==='ai'?(match.winner==='w'?'Tu ejército vence':'El estratega vence'):`${sideName(match.winner)} vence`;}
async function setView(next){
  if(next==='3d'){
    if(!threePromise)threePromise=import('./tactics-board3d.js').then(module=>module.createTacticsBoard3D(host3d,handleSquare));
    try{three=await threePromise;}catch(error){threePromise=null;console.error('No se pudo iniciar 3D:',error);toast('La vista 3D no está disponible en este navegador. Puedes jugar en 2D.');return;}
  }
  view=next;board.hidden=view!=='2d';host3d.hidden=view!=='3d';three?.setActive(view==='3d'&&!privacy);if(view==='3d'){three.resize();renderBoard();}
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));sound();
}
function openRules(){rulesDialog.showModal();three?.setActive(false);sound('menu1');}
function restart(){if(resolving||planning){if(!confirm('¿Abandonar esta batalla y preparar otra?'))return;}phaseToken++;planning=false;resolving=false;privacy=false;three?.setActive(false);$('#privacy-curtain').hidden=true;$('#result-dialog').close();modeDialog.showModal();}

board.addEventListener('click',event=>{const cell=event.target.closest('[data-square]');if(cell)handleSquare(cell.dataset.square);});
$('#unit-roster').addEventListener('click',event=>{const button=event.target.closest('[data-unit]');if(button)selectUnit(button.dataset.unit);});
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>setAction(button.dataset.action)));
document.querySelectorAll('[data-facing]').forEach(button=>button.addEventListener('click',()=>{facing=button.dataset.facing;sound('menu3');if(compactPlanning())addOrder();else renderControls();}));
$('#order-context').addEventListener('click',event=>{const dir=event.target.closest('[data-direction]'),mode=event.target.closest('[data-ability-mode]');if(dir){direction=dir.dataset.direction;sound('menu3');if(compactPlanning())addOrder();else render();}if(mode){abilityMode=mode.dataset.abilityMode;pendingTarget=null;sound('menu3');render();}});
$('#add-order').addEventListener('click',addOrder);
$('#order-queue').addEventListener('click',event=>{const remove=event.target.closest('[data-remove]'),shift=event.target.closest('[data-shift]');const candidate=[...draft];if(remove)candidate.splice(Number(remove.dataset.remove),1);else if(shift){const index=Number(shift.dataset.shift);[candidate[index-1],candidate[index]]=[candidate[index],candidate[index-1]];}else return;const result=checkPlan(candidate);if(!result.ok){toast(`La secuencia posterior depende de esta orden. ${result.error}`);return;}draft=candidate;clearIntent();sound();render();});
$('#queue-clear').addEventListener('click',()=>{draft=[];clearIntent();sound();render();});$('#queue-confirm').addEventListener('click',sealPlan);
$('#phase-panel').addEventListener('click',event=>{const command=event.target.closest('[data-command]')?.dataset.command,charge=event.target.closest('[data-charge]')?.dataset.charge;if(charge){choosePrivilege(false,charge);return;}if(command==='auto-deploy'){autoDeploy(match,viewer);sound('menu3');render();}else if(command==='confirm-deploy')finishDeployment();else if(command==='roll')rollDice();else if(command==='choose-first')choosePrivilege(true);else if(command==='restart')restart();});
$('#curtain-continue').addEventListener('click',hideCurtain);
$('#start-match').addEventListener('click',()=>{modeDialog.close();sound('menu4');newMatch(document.querySelector('[name="opponent"]:checked').value);});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
$('#camera-reset').addEventListener('click',()=>{three?.resetCamera();sound('menu3');});
$('#rules-open').addEventListener('click',openRules);$('#rules-close').addEventListener('click',()=>rulesDialog.close());$('#rules-done').addEventListener('click',()=>rulesDialog.close());rulesDialog.addEventListener('close',()=>{lastTick=performance.now();three?.setActive(view==='3d'&&!privacy);});
$('#new-match').addEventListener('click',restart);$('#result-again').addEventListener('click',restart);
modeDialog.addEventListener('cancel',event=>event.preventDefault());
document.addEventListener('visibilitychange',()=>lastTick=performance.now());
window.addEventListener('resize',()=>three?.resize());
setInterval(()=>{const now=performance.now(),elapsed=(now-lastTick)/1000;lastTick=now;if(!planning||privacy||document.hidden||rulesDialog.open||modeDialog.open||resolving)return;secondsLeft=Math.max(0,secondsLeft-elapsed);updateTimer();if(secondsLeft<=0)sealPlan();},100);
$('#class-manual').innerHTML=Object.entries(ABILITIES).map(([type,ability])=>`<article><strong>${UNIT_NAMES[type]} · ${escape(ability.name)}</strong>${escape(ability.description)}</article>`).join('');
modeDialog.showModal();
