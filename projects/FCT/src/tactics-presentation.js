import { UNIT_NAMES, ABILITIES, getAttackTargets, getUltimateTargets, unitAt } from './tactics-engine.js';

export const directionArrow={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
export function describeBattleEvent(event,state){
  if(!event)return 'Posición inicial';
  const unit=state.units.find(u=>u.id===event.unitId),name=UNIT_NAMES[unit?.type]??'Pieza';
  const damage=event.targets?.filter(t=>t.damage&&!t.reflected).reduce((sum,t)=>sum+t.damage,0);
  const suffix=damage?` · −${damage}`:'';
  if(event.kind==='move')return event.castle?`Rey: enroque ${event.from} → ${event.to} · Torre ${event.castle.rookFrom} → ${event.castle.rookTo}`:`${name}: ${event.from} → ${event.to}`;
  if(event.kind==='attack')return `${name}: ataque ${directionArrow[event.direction]??''}${event.target?` ${event.target}`:''}${suffix}`;
  if(event.kind==='ultimate')return `${name}: ${ABILITIES[unit?.type]?.name??'Definitiva'}${suffix}`;
  if(event.kind==='block')return `${name}: bloqueo y devolución`;
  if(event.kind==='focus')return `${name}: definitiva cargada`;
  if(event.kind==='pass')return 'Espera';
  return `${name}: ${event.message}`;
}

export function describePlannedOrder(order,state){
  if(order.kind==='pass')return 'Espera';
  const unit=state.units.find(u=>u.id===order.unitId),name=UNIT_NAMES[unit?.type]??'Pieza',source=unit?.square??'—';
  const victimText=target=>`${UNIT_NAMES[target.type]} ${target.square} (${target.color===unit?.color?'aliada':'rival'})`;
  if(order.kind==='move')return order.castle?`Rey ${source} → ${order.target} · enroque; torre ${order.castle.rookFrom} → ${order.castle.rookTo}`:`${name} ${source} → ${order.target}`;
  if(order.kind==='attack'){
    const targets=unit?.type==='n'?getAttackTargets(state,unit,order.direction).map(s=>unitAt(state,s)).filter(Boolean):[unitAt(state,order.target)].filter(Boolean);
    return `${name} ${source}: atacar ${directionArrow[order.direction]??''} · ${targets.length?targets.map(victimText).join(', '):order.target} · 2 por impacto`;
  }
  if(order.kind==='ultimate'){const targets=unit?getUltimateTargets(state,unit).map(s=>unitAt(state,s)).filter(Boolean):[];return `${name} ${source}: ${ABILITIES[unit?.type]?.name??'Definitiva'} · área completa · ${targets.length?targets.map(victimText).join(', '):'sin objetivos previstos'} · 2 por impacto`;}
  return `${name} ${source}: ${order.kind==='focus'?'cargar definitiva':'activar escudo de un solo uso'}`;
}
