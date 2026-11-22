import { UNIT_NAMES, ABILITIES } from './tactics-engine.js';

export const directionArrow={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
export function describeBattleEvent(event,state){
  if(!event)return 'Posición inicial';
  const unit=state.units.find(u=>u.id===event.unitId),name=UNIT_NAMES[unit?.type]??'Pieza';
  const damage=event.targets?.filter(t=>t.damage&&!t.reflected).reduce((sum,t)=>sum+t.damage,0);
  const suffix=damage?` · −${damage}`:'';
  if(event.kind==='move')return `${name}: ${event.from} → ${event.to}${event.facing?` · ${directionArrow[event.facing]}`:''}`;
  if(event.kind==='attack')return `${name}: ataque ${directionArrow[event.direction]??''}${event.target?` ${event.target}`:''}${suffix}`;
  if(event.kind==='ultimate')return `${name}: ${ABILITIES[unit?.type]?.name??'Definitiva'}${suffix}`;
  if(event.kind==='block')return `${name}: bloqueo y devolución`;
  if(event.kind==='focus')return `${name}: definitiva cargada`;
  if(event.kind==='pass')return 'Espera';
  return `${name}: ${event.message}`;
}
